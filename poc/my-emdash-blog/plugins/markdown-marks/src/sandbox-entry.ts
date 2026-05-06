/**
 * Plugin runtime (loaded by EmDash at request time).
 *
 * Two responsibilities:
 *   1. `content:beforeSave` hook — auto-expand inline markers on every save
 *      so editors can keep typing `**bold**` and the DB always stores valid
 *      Portable Text marks.
 *   2. `migrate` route — one-shot sweep over existing content for installs
 *      where the corpus pre-dates the plugin (Tzu Chi POC). POST to:
 *      /_emdash/api/plugins/markdown-marks/migrate
 */
import { definePlugin } from "emdash";
import type { PluginContext } from "emdash";

import { expandAllPortableTextFields, expandPortableText } from "./lib/expand-marks.js";

interface BeforeSaveEvent {
	content: Record<string, unknown>;
	collection: string;
	isNew: boolean;
}

type ContentList = {
	items: Array<{ id: string; data: Record<string, unknown> }>;
	cursor?: string;
	hasMore?: boolean;
};

const DEFAULT_COLLECTIONS = ["posts", "pages", "lessons"];

export default definePlugin({
	hooks: {
		"content:beforeSave": {
			priority: 50, // Run early so downstream hooks see expanded marks.
			errorPolicy: "continue", // A bad span text shouldn't block the save.
			handler: async (event: BeforeSaveEvent, ctx: PluginContext) => {
				try {
					const next = expandAllPortableTextFields(event.content);
					if (next !== event.content) {
						ctx.log.info(
							`markdown-marks: expanded markers in ${event.collection}/${
								(event.content.id as string) ?? "(new)"
							}`,
						);
					}
					return next;
				} catch (err) {
					ctx.log.warn(
						`markdown-marks: skip due to error: ${
							err instanceof Error ? err.message : String(err)
						}`,
					);
					return undefined; // keep original content
				}
			},
		},
	},

	routes: {
		// POST /_emdash/api/plugins/markdown-marks/migrate
		// Optional JSON body: { collections?: string[], limit?: number }
		// NOTE: marked `public: true` for the local POC. In a production deploy
		// you should remove this and add a token guard via the admin session.
		migrate: {
			public: true,
			handler: async (routeCtx: any, ctx: PluginContext) => {
				if (!ctx.content) {
					return {
						ok: false,
						error: "ctx.content not available — capability missing or sandbox restriction",
					};
				}

				const optionsCollections =
					(ctx.plugin as any)?.options?.collections as string[] | undefined;
				const requested = routeCtx.input?.collections as string[] | undefined;
				const targets = requested ?? optionsCollections ?? DEFAULT_COLLECTIONS;
				const perCollectionLimit =
					typeof routeCtx.input?.limit === "number" ? routeCtx.input.limit : 500;

				const summary: Array<{
					collection: string;
					scanned: number;
					updated: number;
					errors: number;
				}> = [];

				for (const collection of targets) {
					const stat = { collection, scanned: 0, updated: 0, errors: 0 };
					let cursor: string | undefined;

					try {
						do {
							const page = (await ctx.content.list(collection, {
								limit: 100,
								cursor,
							})) as ContentList;
							for (const item of page.items) {
								stat.scanned++;
								if (stat.scanned > perCollectionLimit) break;
								try {
									const original = item.data ?? {};
									const updated = expandAllPortableTextFields(
										original as Record<string, unknown>,
									);
									if (updated !== original) {
										// Only patch the fields whose content actually changed.
										const patch: Record<string, unknown> = {};
										for (const [k, v] of Object.entries(updated)) {
											if (v !== (original as Record<string, unknown>)[k]) {
												patch[k] = v;
											}
										}
										await ctx.content.update(collection, item.id, patch);
										stat.updated++;
										ctx.log.info(
											`markdown-marks/migrate: updated ${collection}/${item.id}`,
										);
									}
								} catch (err) {
									stat.errors++;
									ctx.log.warn(
										`markdown-marks/migrate: error on ${collection}/${item.id}: ${
											err instanceof Error ? err.message : String(err)
										}`,
									);
								}
							}
							cursor = page.hasMore ? page.cursor : undefined;
						} while (cursor && stat.scanned < perCollectionLimit);
					} catch (err) {
						ctx.log.warn(
							`markdown-marks/migrate: failed to list ${collection}: ${
								err instanceof Error ? err.message : String(err)
							}`,
						);
					}

					summary.push(stat);
				}

				return { ok: true, summary };
			},
		},

		// GET /_emdash/api/plugins/markdown-marks/status
		// Quick health check + a snippet of expansion behaviour for the demo.
		status: {
			public: true,
			handler: async () => {
				const sample = "**bold** plain *em* and `code` end";
				const blocks = [
					{
						_type: "block",
						_key: "demo",
						style: "normal",
						children: [{ _type: "span", _key: "demo0", text: sample }],
					},
				];
				return {
					ok: true,
					plugin: "markdown-marks",
					sampleInput: sample,
					sampleExpanded: expandPortableText(blocks),
				};
			},
		},
	},
});
