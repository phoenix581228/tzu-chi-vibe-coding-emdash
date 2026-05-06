/**
 * Inline-marker → Portable Text marks expansion.
 *
 * Converts raw `**bold**` / `*em*` / `` `code` `` inside a single span's `text`
 * into multiple spans, each with the appropriate `marks` array.
 *
 * Idempotent: spans that already carry `marks` are left untouched.
 *
 * Pure functions only — safe to run in any environment (Vite build, Workers
 * runtime, plain Node, browser). No I/O.
 */

type Span = {
	_type: "span";
	_key?: string;
	text: string;
	marks?: string[];
};

type Block = {
	_type: "block";
	_key?: string;
	style?: string;
	children?: Span[] | unknown[];
	[k: string]: unknown;
};

type Mark = "strong" | "em" | "code";

interface MarkPattern {
	mark: Mark;
	pattern: RegExp;
}

// Order matters: longer / non-overlapping markers first.
//   `**bold**` is matched before `*em*` so double-asterisks aren't eaten as italic.
//   Italic regex deliberately avoids matching characters next to other `*`s and
//   words to keep `field_*` etc. literal.
const PATTERNS: MarkPattern[] = [
	{ mark: "strong", pattern: /\*\*([^*\n]+?)\*\*/ },
	{ mark: "code", pattern: /`([^`\n]+?)`/ },
	{ mark: "em", pattern: /(?<![\*\w])\*(?!\*)([^*\n]+?)\*(?!\*)/ },
];

/**
 * Recursively split `text` on the next available marker pattern.
 * Each call yields a flat list of spans; recursion handles nested markers
 * (e.g. `**foo `code`**`).
 */
function expandText(text: string, keyPrefix: string): Span[] {
	for (const { mark, pattern } of PATTERNS) {
		const m = pattern.exec(text);
		if (!m) continue;

		const before = text.slice(0, m.index);
		const inside = m[1];
		const after = text.slice(m.index + m[0].length);

		const out: Span[] = [];
		if (before) out.push(...expandText(before, keyPrefix + "a"));
		// Inner gets the mark applied; nested markers apply too via recursion.
		for (const span of expandText(inside, keyPrefix + "b")) {
			const next = new Set(span.marks ?? []);
			next.add(mark);
			out.push({ ...span, marks: [...next] });
		}
		if (after) out.push(...expandText(after, keyPrefix + "c"));
		return out;
	}

	// No markers left → terminal plain span.
	return [{ _type: "span", text, _key: keyPrefix }];
}

function isSpan(x: unknown): x is Span {
	return (
		!!x &&
		typeof x === "object" &&
		(x as { _type?: string })._type === "span" &&
		typeof (x as { text?: unknown }).text === "string"
	);
}

function isBlock(x: unknown): x is Block {
	return !!x && typeof x === "object" && (x as { _type?: string })._type === "block";
}

/**
 * Expand markers inside a single block's children.
 * Spans that already carry marks are skipped (assumed already structured).
 */
export function expandBlock<T>(block: T): T {
	if (!isBlock(block)) return block;
	const children = block.children;
	if (!Array.isArray(children)) return block;

	const next: unknown[] = [];
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (
			isSpan(child) &&
			(!child.marks || child.marks.length === 0) &&
			(child.text.includes("**") ||
				child.text.includes("`") ||
				/(?<![\*\w])\*(?!\*)/.test(child.text))
		) {
			const keyPrefix = child._key || `sp${i}`;
			next.push(...expandText(child.text, keyPrefix));
		} else {
			next.push(child);
		}
	}

	return { ...(block as object), children: next } as T;
}

/**
 * Expand markers across an entire Portable Text array.
 * Returns the same reference if nothing changed (cheap fast path for hot hooks).
 */
export function expandPortableText<T>(blocks: T): T {
	if (!Array.isArray(blocks)) return blocks;
	let changed = false;
	const out = blocks.map((b) => {
		const e = expandBlock(b);
		if (e !== b) changed = true;
		return e;
	});
	return (changed ? out : blocks) as T;
}

/**
 * Walk an arbitrary content object and apply `expandPortableText` to any value
 * that looks like a Portable Text array (array of objects with `_type==="block"`).
 *
 * Used by `content:beforeSave` because the field name housing rich text varies
 * by collection (`content`, `body`, `description`, …).
 */
export function expandAllPortableTextFields<T extends Record<string, unknown>>(content: T): T {
	let changed = false;
	const out: Record<string, unknown> = { ...content };
	for (const [k, v] of Object.entries(out)) {
		if (Array.isArray(v) && v.some(isBlock)) {
			const expanded = expandPortableText(v);
			if (expanded !== v) {
				out[k] = expanded;
				changed = true;
			}
		}
	}
	return (changed ? (out as T) : content) as T;
}
