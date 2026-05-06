# Phase 6 — Plugin 或 Cloudflare 部署 / Plugin or Cloudflare Deploy

## 中文

> ⚠️ 這是分支階段：擇一進行即可。**A 路線（Plugin）**深入體驗 capability 安全模型；**B 路線（Cloudflare）**體驗 serverless 部署。時間夠就兩個都做。

---

### A 路線 — Hello World Plugin（30 分鐘）

#### 目標
寫一個最簡 plugin，發文時在 server console 印 log。理解 capability 守關。

#### 你會學到
- Plugin 雙 entrypoint：`index.ts`（build-time，Vite）+ `sandbox-entry.ts`（runtime）
- `definePlugin()` + `content:afterPublish` hook
- 故意拔掉 capability 看守關訊息

#### 步驟

1. **載入 skill**
   ```
   請載入 creating-plugins skill 帶我寫 Hello World plugin
   ```

2. **明確需求**
   ```
   在 packages/hello-world/ 建一個 standard plugin：
   - id: hello-world
   - capability: ["content:read"]
   - hook: content:afterPublish → console.log(`[hello-world] published: ${entry.title}`)
   ```

3. **改 astro.config.mjs**
   ```ts
   plugins: [helloWorldPlugin()]
   ```

4. **重啟 dev server**，發布一篇文章

5. **觀察 console**：應看到 `[hello-world] published: <title>`

6. **故意實驗**：把 capability 拔掉，重啟，看到 `... missing capability — skipping`

#### 驗收
- [ ] 啟動無 capability 警告
- [ ] 發文後 console 印出 log
- [ ] 拔掉 capability 後啟動 log 出現守關訊息

#### 對應 skill
`creating-plugins`

---

### B 路線 — 部署到 Cloudflare Workers（60 分鐘）

#### 目標
把 Phase 5 的站部署到 Cloudflare Workers，公開可訪問。

#### 你會學到
- D1（serverless SQLite）+ R2（S3-compatible）binding
- wrangler.jsonc 配置
- `session: "auto"` bookmark cookie 一致性
- passkey rpId 必須對應公網域名

#### 前置
- Cloudflare 帳號（free tier 夠）
- `npm i -g wrangler && wrangler login`

#### 步驟

1. **新建 cloudflare 版**
   ```bash
   cd ..
   pnpm create emdash@latest my-emdash-cf --template blog --platform cloudflare --pm pnpm --install --yes
   cd my-emdash-cf
   ```

2. **移植 Phase 5 的 collection**：把 `seed.json` 中的 recipes collection + `src/pages/recipes/` 兩個檔複製過來

3. **檢查 wrangler.jsonc**
   ```jsonc
   {
     "compatibility_date": "2026-01-14",
     "compatibility_flags": ["nodejs_compat"],
     "d1_databases": [{ "binding": "DB", "database_name": "emdash-db" }],
     "r2_buckets":   [{ "binding": "MEDIA", "bucket_name": "emdash-media" }]
   }
   ```

4. **產生 + 寫入加密金鑰**
   ```bash
   npx emdash secrets generate
   wrangler secret put EMDASH_ENCRYPTION_KEY
   ```

5. **部署**
   ```bash
   wrangler deploy
   ```
   首次會自動建 D1 + R2 資源。

6. **訪問 `https://<project>.<subdomain>.workers.dev`**

7. **設定 admin** + 註冊 passkey（rpId 是公網域名）

#### 驗收
- [ ] Cloudflare dashboard 看得到 D1 db + R2 bucket
- [ ] 公網 URL 可訪問
- [ ] passkey 註冊成功（不是 localhost）
- [ ] 5 分鐘無流量後 worker scale-to-zero

#### 對應 skill
`emdash-cli`（部署後遠端管理用）

#### 注意事項

- **migrations 自動化**：首次 request 會跑
- **session: auto**：anonymous 讀請求路由到最近 replica；authenticated 用 cookie bookmark
- **媒體上傳**：用 signed URL 直連 R2，繞過 25MB body limit

---

## English

> ⚠️ Branch phase: pick one. **Path A (Plugin)** deepens your capability-security model understanding; **Path B (Cloudflare)** is a serverless deploy. Do both if you have time.

---

### Path A — Hello World Plugin (30 min)

#### Goal
Write the simplest plugin: log to server console on every publish. Understand the capability gate.

#### Learn
- Plugin double entrypoint: `index.ts` (Vite build-time) + `sandbox-entry.ts` (runtime)
- `definePlugin()` + `content:afterPublish` hook
- Deliberately remove the capability and watch the gate fire

#### Steps

1. **Load skill**
   ```
   Please load the creating-plugins skill and walk me through Hello World plugin
   ```

2. **Spec**
   ```
   Create a standard plugin at packages/hello-world/ :
   - id: hello-world
   - capability: ["content:read"]
   - hook: content:afterPublish → console.log(`[hello-world] published: ${entry.title}`)
   ```

3. **Edit astro.config.mjs**
   ```ts
   plugins: [helloWorldPlugin()]
   ```

4. **Restart dev**, publish a post

5. **Observe console**: `[hello-world] published: <title>`

6. **Experiment**: remove the capability, restart, observe `... missing capability — skipping`

#### Acceptance
- [ ] No capability warnings on boot
- [ ] Console logs after publish
- [ ] Removing capability triggers gate message

#### Skill
`creating-plugins`

---

### Path B — Deploy to Cloudflare Workers (60 min)

#### Goal
Deploy your Phase-5 site to Cloudflare Workers with a public URL.

#### Learn
- D1 (serverless SQLite) + R2 (S3-compatible) bindings
- wrangler.jsonc config
- `session: "auto"` bookmark cookie consistency
- passkey rpId must match the public domain

#### Prerequisites
- Cloudflare account (free tier is enough)
- `npm i -g wrangler && wrangler login`

#### Steps

1. **Create the cloudflare variant**
   ```bash
   cd ..
   pnpm create emdash@latest my-emdash-cf --template blog --platform cloudflare --pm pnpm --install --yes
   cd my-emdash-cf
   ```

2. **Port Phase 5's collection**: copy the recipes collection in `seed.json` plus the two `src/pages/recipes/` files

3. **Verify wrangler.jsonc**
   ```jsonc
   {
     "compatibility_date": "2026-01-14",
     "compatibility_flags": ["nodejs_compat"],
     "d1_databases": [{ "binding": "DB", "database_name": "emdash-db" }],
     "r2_buckets":   [{ "binding": "MEDIA", "bucket_name": "emdash-media" }]
   }
   ```

4. **Generate + store encryption key**
   ```bash
   npx emdash secrets generate
   wrangler secret put EMDASH_ENCRYPTION_KEY
   ```

5. **Deploy**
   ```bash
   wrangler deploy
   ```
   First run auto-creates D1 + R2.

6. **Open `https://<project>.<subdomain>.workers.dev`**

7. **Run setup wizard** + register passkey (rpId is the public domain)

#### Acceptance
- [ ] Cloudflare dashboard shows the D1 + R2
- [ ] Public URL serves the site
- [ ] Passkey registered (against the public domain, not localhost)
- [ ] After 5 min idle, the worker scales to zero

#### Skill
`emdash-cli` (for post-deploy remote management)

#### Notes

- **Migrations auto-run** on first request
- **session: auto** routes anonymous reads to the nearest replica; authenticated uses a bookmark cookie
- **Media uploads** use signed URLs straight to R2 (bypassing the 25MB body limit)
