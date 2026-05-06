# Exercises (English)

> Aligned with the 6 stages of `tzu-chi-vibe-coding-emdash`. For each exercise, load the suggested skill in Claude Code first.

---

## Exercise 1 — Technical Research

**Goal**: Apply the 7-step technical-research workflow to an OSS project of your choice.

**You will learn**:

- How to make the AI "check memory first" to avoid duplicate work
- Document Officer (Context7) vs Collector (Perplexity) — when to use which
- Triangulation defends against single-viewpoint bias

**Steps**:

1. In Claude Code: "I want to research [project]. Load the technical-research skill."
2. Follow the 7-step prompts
3. Output `docs/research/<TOPIC>_RESEARCH_REPORT_<DATE>.md`

**Acceptance**:

- [ ] Report includes triangulation vote (3:0 / 2:1 / 1:1:1)
- [ ] At least one correction or undocumented detail vs the public docs
- [ ] OpenMemory has a memory UID for this report

**Skill**: `technical-research`

---

## Exercise 2 — Code Deep Analysis

**Goal**: `git clone` your Exercise-1 project and run the full 5-phase code analysis.

**You will learn**:

- serena MCP's symbol-level operations
- How to infer architecture from `package.json` + folder structure
- Minimum viable Mermaid for architecture diagrams

**Steps**:

1. `git clone <repo-url>`
2. In Claude Code: "Load the code-deep-analysis skill and analyze this project."
3. Be explicit:
   - How many packages? Where is the entry point?
   - Are there hidden API surfaces (routes, CLI commands)?
   - What design choices are not in the public docs?

**Acceptance**:

- [ ] At least 2 Mermaid diagrams (suggested: architecture + data flow)
- [ ] At least 1 design detail "not in public docs but in source"
- [ ] Report file states the git commit hash analyzed

**Skill**: `code-deep-analysis`

---

## Exercise 3 — Install EmDash Locally

**Goal**: From zero to a running EmDash blog with one self-authored post visible on the public site.

**You will learn**:

- pnpm vs npm (why EmDash prefers pnpm)
- The zero-setup SQLite + local-storage path
- WebAuthn passkey registration

**Steps**:

```bash
# 1. Activate pnpm
corepack enable && corepack prepare pnpm@10.28.0 --activate

# 2. Scaffold (interactive)
pnpm create emdash@latest my-first-emdash

# 3. Enter + bootstrap + run
cd my-first-emdash
pnpm bootstrap   # emdash init && emdash seed
pnpm dev         # http://localhost:4321
```

4. Open http://localhost:4321/_emdash/admin
5. Register passkey (Touch ID / Windows Hello)
6. Create a post in admin; verify on the homepage

**Acceptance**:

- [ ] Dev server prints `Astro v6.x.x ready in xxx ms`
- [ ] Passkey registers (no password fallback)
- [ ] Your post is visible on `/` and `/posts`
- [ ] Edits in admin appear without restart (proves Live Collections)

**Skill**: `building-emdash-site` (optional reference)

---

## Exercise 4 — First Custom Collection

**Goal**: Add a `recipes` collection with 4 fields and list them at `/recipes`.

**You will learn**:

- Database-first schema (fields stored in DB, not in code)
- The `seed/seed.json` patch + `npx emdash seed` flow
- Astro pages + `getEmDashCollection()` rendering

**Field spec**:

| Slug | Label | Type | Required? |
|:---|:---|:---|:---:|
| name | Recipe name | string | ✓ |
| photo | Hero image | image | |
| ingredients | Ingredients | text | |
| steps | Steps | portableText | |

**Steps**:

1. Load `building-emdash-site` skill
2. Tell Claude: "Add a `recipes` collection to seed.json with the fields above, and write `src/pages/recipes/index.astro` and `[slug].astro`."
3. Run `npx emdash seed seed/seed.json --validate` then `npx emdash seed seed/seed.json`
4. Create 2 recipes in admin and check `/recipes`

**Acceptance**:

- [ ] `/recipes` shows at least 2 recipe cards
- [ ] `/recipes/<slug>` renders full content including hero image
- [ ] `npx emdash types` regenerates `emdash-env.d.ts` with `recipes` types

**Skill**: `building-emdash-site`

**Common pitfalls**:

- Image fields are `{ id, src, alt }` objects, not strings. Use `<Image image={...} />` from `"emdash/ui"`
- Always call `Astro.cache.set(cacheHint)`, otherwise admin edits don't appear publicly
- `entry.id` is the slug; `entry.data.id` is the ULID — API calls need the ULID

---

## Exercise 5 — Hello World Plugin

**Goal**: Write the simplest possible plugin that logs a line whenever a post is published.

**You will learn**:

- Plugin double entrypoint (`index.ts` build-time + `sandbox-entry.ts` runtime)
- `definePlugin()` + `content:afterPublish` hook
- Capability gate enforcement

**Steps**:

1. Load `creating-plugins` skill
2. In `packages/`, create `hello-world-plugin/`
3. Write the manifest (capability: `["content:read"]`)
4. Write the hook (log the post title)
5. In `astro.config.mjs`: `plugins: [helloWorldPlugin()]`
6. Restart dev server
7. Publish a post in admin; watch server console

**Acceptance**:

- [ ] No capability warnings on dev-server startup
- [ ] After publishing, console prints `[hello-world] published: <title>`
- [ ] Removing the capability triggers `... missing capability — skipping` on startup

**Skill**: `creating-plugins`

---

## Exercise 6 (Bonus) — Deploy to Cloudflare Workers

**Goal**: Deploy your Exercise-4 site publicly via Cloudflare Workers.

**You will learn**:

- D1 (serverless SQLite) + R2 (S3-compatible storage)
- wrangler.jsonc config (including Worker Loader concepts)
- The `session: "auto"` bookmark-cookie consistency model

**Prerequisites**:

- Cloudflare account (free tier suffices)
- `npm i -g wrangler && wrangler login`

**Steps**:

1. `pnpm create emdash@latest` with `blog-cloudflare` template
2. Port your Exercise-4 collection / pages
3. Set D1 + R2 bindings in wrangler.jsonc
4. `npx emdash secrets generate && wrangler secret put EMDASH_ENCRYPTION_KEY`
5. `wrangler deploy`
6. Visit `https://<project>.<subdomain>.workers.dev`

**Acceptance**:

- [ ] Cloudflare dashboard shows the D1 database + R2 bucket
- [ ] Public URL serves your site
- [ ] Passkey registration succeeds (rpId must be the public domain)
- [ ] After 5 minutes idle, the worker scales to zero (verify via `cloudflare logs`)

**Skill**: `emdash-cli` (for post-deploy remote management)

---

## Submission / Going Further

For each exercise, push proof (screenshot + report) to your personal GitHub repo and post the link in the class Discord.

**Stretch directions**:

- Use `wordpress-theme-to-emdash` to migrate a WordPress theme to EmDash
- Use `agent-browser` to write E2E tests
- Use `adversarial-reviewer` to do a hostile review of your own plugin

Have fun! Remember: **Vibe Coding is not letting AI write for you — it is writing with the AI**.
