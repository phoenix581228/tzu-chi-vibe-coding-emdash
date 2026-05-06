/**
 * Plugin descriptor (build-time, runs in Vite).
 *
 * IMPORTANT: This file must be side-effect-free and must not import the
 * sandbox entry — that file runs at request time on the deployed server,
 * has different APIs available, and may be loaded into a V8 isolate.
 */
import type { PluginDescriptor } from "emdash";

export interface MarkdownMarksOptions {
	/** Collections to scan when running the migrate route. Defaults to all. */
	collections?: string[];
}

export function markdownMarksPlugin(
	options: MarkdownMarksOptions = {},
): PluginDescriptor {
	return {
		id: "markdown-marks",
		version: "0.1.0",
		format: "standard",
		entrypoint: "@local/markdown-marks/sandbox",
		options,
		// `content:read` lets the migrate route list & fetch entries.
		// `content:write` lets the migrate route call ctx.content.update().
		capabilities: ["content:read", "content:write"],
	};
}

// Default export so `import markdownMarks from "@local/markdown-marks"` also works.
export default markdownMarksPlugin;
