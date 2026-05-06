// @ts-check
//
// Astro config for Cloudflare deployment.
//
// Used by `pnpm build:cf` / `pnpm deploy` only. The default `astro.config.mjs`
// remains the Node + SQLite config so students can `pnpm dev` locally with
// zero Cloudflare credentials.
//
// Targets: Cloudflare Workers + D1 (database) + R2 (media storage).
// No worker_loaders / no sandboxed plugins on this site — markdown-marks
// runs trusted in the host worker.
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { auditLogPlugin } from "@emdash-cms/plugin-audit-log";
import { markdownMarksPlugin } from "@local/markdown-marks";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		imageService: "cloudflare",
	}),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			// Binding names must match wrangler.jsonc.
			// session: "auto" enables D1 read replicas with bookmark cookies for
			// read-your-writes consistency on authenticated requests.
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			plugins: [auditLogPlugin(), markdownMarksPlugin()],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
