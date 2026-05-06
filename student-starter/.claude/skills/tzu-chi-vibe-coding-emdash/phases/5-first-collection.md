# Phase 5 — 第一個自訂 collection / First Custom Collection

## 中文

### 目標
在 Phase 4 的站新增 `recipes`（食譜）collection，4 個欄位，並在 `/recipes` 列出。

### 預估時間
30 分鐘

### 你會學到
- Database-first schema：欄位在 `seed.json` 而不是 code 裡
- `npx emdash seed` validate + apply 流程
- Astro page + `getEmDashCollection()` 渲染
- 5 條救命 gotchas（image / id / taxonomy / cacheHint / getStaticPaths）

### 欄位需求

| Slug | Label | Type | Required? | Searchable? |
|:---|:---|:---|:---:|:---:|
| name | 食譜名稱 | string | ✓ | ✓ |
| photo | 主圖 | image | | |
| ingredients | 材料 | text | | ✓ |
| steps | 作法 | portableText | | ✓ |

### 步驟

1. **載入 skill**
   ```
   請載入 building-emdash-site skill，幫我新增 recipes collection
   ```

2. **告訴 AI 規格**（具體！）
   ```
   請完成以下三件事：
   1. 在 seed/seed.json 加 recipes collection（欄位如表）
   2. 在 src/pages/recipes/ 新增 index.astro 列所有食譜
   3. 在 src/pages/recipes/ 新增 [slug].astro 顯示單篇食譜
   注意：image 欄位要用 <Image image={...} /> from "emdash/ui"，
        要呼叫 Astro.cache.set(cacheHint)
   ```

3. **AI 改完後 validate + seed**
   ```bash
   npx emdash seed seed/seed.json --validate
   npx emdash seed seed/seed.json
   ```

4. **regen types**
   ```bash
   npx emdash types
   ```
   看 `emdash-env.d.ts` 是否多出 `recipes` 型別。

5. **在 admin 建 2 個食譜**
   - 開 http://localhost:4321/_emdash/admin
   - Recipes → New Recipe
   - 填名稱、上傳主圖、寫材料、寫步驟（試 Portable Text 富文字）

6. **驗證前台**
   - http://localhost:4321/recipes — 列表
   - http://localhost:4321/recipes/<slug> — 單篇

### 驗收
- [ ] `/recipes` 顯示至少 2 個食譜卡片
- [ ] `/recipes/<slug>` 渲染主圖 + 完整內容
- [ ] `emdash-env.d.ts` 含 `recipes` 型別
- [ ] DB 多了一張 `ec_recipes` 表（用 `sqlite3 data.db ".tables"` 確認）

### 對應 skill
`building-emdash-site`

### 5 條救命 gotchas（公開文檔沒強調）

1. **image 是物件不是字串**：`post.data.featured_image` 是 `{ id, src, alt }`。寫 `<img src={post.data.featured_image} />` 會渲染 `[object Object]`。用 `<Image image={...} />` from `"emdash/ui"`。
2. **`entry.id` vs `entry.data.id`**：`entry.id` 是 slug（URL 用），`entry.data.id` 是 DB ULID（API 呼叫用）。混用會 silent 空結果。
3. **Taxonomy 名要對齊 seed**：seed 寫 `"name": "category"` 就要 `getTerm("category", slug)`，不是 `"categories"`。
4. **必呼叫 `Astro.cache.set(cacheHint)`**：每個查詢都回 `cacheHint`，沒呼叫 → editor 改完不會即時生效。
5. **不可用 `getStaticPaths`**：EmDash 內容是動態的，必須 `output: "server"`。

---

## English

### Goal
Add a `recipes` collection to your Phase-4 site with 4 fields and list them at `/recipes`.

### Time
30 minutes

### What you will learn
- Database-first schema: fields live in `seed.json`, not in code
- `npx emdash seed` validate + apply flow
- Astro page + `getEmDashCollection()` rendering
- 5 life-saving gotchas (image / id / taxonomy / cacheHint / getStaticPaths)

### Field spec

| Slug | Label | Type | Required? | Searchable? |
|:---|:---|:---|:---:|:---:|
| name | Recipe name | string | ✓ | ✓ |
| photo | Hero image | image | | |
| ingredients | Ingredients | text | | ✓ |
| steps | Steps | portableText | | ✓ |

### Steps

1. **Load skill**
   ```
   Please load the building-emdash-site skill and help me add a recipes collection
   ```

2. **Tell AI the spec** (be specific!)
   ```
   Please do these three things:
   1. Patch seed/seed.json to add a recipes collection (fields per table)
   2. Add src/pages/recipes/index.astro to list all recipes
   3. Add src/pages/recipes/[slug].astro to render a single recipe
   Notes: use <Image image={...} /> from "emdash/ui" for the image field;
          call Astro.cache.set(cacheHint).
   ```

3. **After AI edits, validate + seed**
   ```bash
   npx emdash seed seed/seed.json --validate
   npx emdash seed seed/seed.json
   ```

4. **Regen types**
   ```bash
   npx emdash types
   ```
   Confirm `emdash-env.d.ts` now includes `recipes`.

5. **Create 2 recipes in admin**
   - Open http://localhost:4321/_emdash/admin
   - Recipes → New Recipe
   - Fill name, upload hero image, write ingredients, write steps (try Portable Text rich formatting)

6. **Verify frontend**
   - http://localhost:4321/recipes — list
   - http://localhost:4321/recipes/<slug> — detail

### Acceptance
- [ ] `/recipes` shows at least 2 recipe cards
- [ ] `/recipes/<slug>` renders hero image + full content
- [ ] `emdash-env.d.ts` includes `recipes` types
- [ ] DB has a new `ec_recipes` table (`sqlite3 data.db ".tables"` to confirm)

### Skill
`building-emdash-site`

### 5 life-saving gotchas (under-emphasised in public docs)

1. **Image fields are objects, not strings**: `post.data.featured_image` is `{ id, src, alt }`. Writing `<img src={post.data.featured_image} />` renders `[object Object]`. Use `<Image image={...} />` from `"emdash/ui"`.
2. **`entry.id` vs `entry.data.id`**: `entry.id` is the slug (URLs); `entry.data.id` is the DB ULID (API calls). Mixing them yields silent empty results.
3. **Taxonomy names must match seed**: if seed says `"name": "category"`, query `getTerm("category", slug)`, not `"categories"`.
4. **Always call `Astro.cache.set(cacheHint)`**: every query returns `cacheHint`. Skipping it breaks live invalidation.
5. **Never `getStaticPaths`**: EmDash content is dynamic. Requires `output: "server"`.
