# 練習題（中文版）

> 對應 `tzu-chi-vibe-coding-emdash` skill 的 6 階段。每題建議在 Claude Code 中載入對應 skill 後再做。

---

## 練習 1 — 技術研究

**目標**：對任一你感興趣的開源專案，跑完 7 步驟技術研究流程。

**你會學到**：

- 怎麼讓 AI「先查記憶」，避免重複勞動
- 文書官（Context7）vs 收集師（Perplexity）的差別
- 三角論證法防止單一視角偏誤

**步驟**：

1. 在 Claude Code 輸入「我要研究 [專案名稱]，請載入 technical-research skill」
2. 跟著 7 步驟提示一步步做
3. 最後產出 `docs/research/<TOPIC>_RESEARCH_REPORT_<DATE>.md`

**驗收**：

- [ ] 研究報告含「三角論證投票結果」（3:0 / 2:1 / 1:1:1）
- [ ] 報告中至少修正一處公開文檔錯誤或補上未提及細節
- [ ] OpenMemory 中可查到對應記憶 UID

**對應 skill**：`technical-research`

---

## 練習 2 — 程式深度分析

**目標**：把練習 1 的目標專案 `git clone` 到本機，跑完 5 phase 程式碼分析。

**你會學到**：

- serena MCP 的符號級操作
- 怎麼從 `package.json` 與目錄結構推架構
- Mermaid 架構圖的最小可用畫法

**步驟**：

1. `git clone <repo-url>`
2. Claude Code 中輸入「請載入 code-deep-analysis skill 分析這個專案」
3. 你需要明確問：
   - 它有幾個 packages？入口在哪？
   - 它有沒有藏起來的 API surface（路由、CLI 命令）？
   - 有沒有公開文檔沒提的設計？

**驗收**：

- [ ] 至少 2 張 Mermaid 圖（建議：系統架構 + 資料流）
- [ ] 列出至少 1 個「公開文檔沒提，但 code 裡有」的設計細節
- [ ] 報告檔附 git commit hash（誠實標記分析時點）

**對應 skill**：`code-deep-analysis`

---

## 練習 3 — 本機安裝 EmDash

**目標**：在你的電腦從零跑通一個 EmDash blog，建立第一篇文章並從前台看到它。

**你會學到**：

- pnpm vs npm（為何 EmDash 偏 pnpm）
- SQLite + local storage 的 zero-setup 路徑
- WebAuthn passkey 註冊流程

**步驟**：

```bash
# 1. 啟用 pnpm
corepack enable && corepack prepare pnpm@10.28.0 --activate

# 2. Scaffold（互動式）
pnpm create emdash@latest my-first-emdash

# 3. 進入 + 初始化 + 啟動
cd my-first-emdash
pnpm bootstrap   # 跑 emdash init && emdash seed
pnpm dev         # http://localhost:4321
```

4. 開瀏覽器：http://localhost:4321/_emdash/admin
5. 註冊 passkey（Touch ID / Windows Hello）
6. 在 admin 內建一篇 post，回首頁確認可見

**驗收**：

- [ ] dev server 跑到顯示 `Astro v6.x.x ready in xxx ms`
- [ ] passkey 成功註冊（不可用密碼登入）
- [ ] 自建文章在 / 與 /posts 都看得到
- [ ] 改 admin 內容後不重啟 server 即時看到變更（驗證 Live Collections）

**對應 skill**：`building-emdash-site`（可選擇性參考）

---

## 練習 4 — 第一個自訂 collection

**目標**：在練習 3 的 EmDash 站新增一個 `recipes` collection（食譜），含 4 個欄位，並在 `/recipes` 列出。

**你會學到**：

- Database-first schema（欄位存於 DB 不是 code）
- `seed/seed.json` patch + `npx emdash seed` 流程
- Astro page + `getEmDashCollection()` 渲染

**欄位需求**：

| Slug | Label | Type | Required? |
|:---|:---|:---|:---:|
| name | 食譜名稱 | string | ✓ |
| photo | 主圖 | image | |
| ingredients | 材料 | text | |
| steps | 作法 | portableText | |

**步驟**：

1. 載入 `building-emdash-site` skill
2. 直接告訴 Claude：「請在 seed.json 加 recipes collection，欄位如上，並寫 src/pages/recipes/index.astro 與 [slug].astro」
3. 跑 `npx emdash seed seed/seed.json --validate` 再 `npx emdash seed seed/seed.json`
4. 在 admin 建 2 個食譜，到 /recipes 確認

**驗收**：

- [ ] `/recipes` 顯示至少 2 個食譜卡片
- [ ] `/recipes/<slug>` 顯示完整內容含主圖
- [ ] `npx emdash types` 跑完 `emdash-env.d.ts` 含 `recipes` 型別

**對應 skill**：`building-emdash-site`

**常見陷阱**：

- 圖片是 `{ id, src, alt }` 物件，不是字串。用 `<Image image={...} />` from `"emdash/ui"`
- 內容必呼叫 `Astro.cache.set(cacheHint)`，否則 admin 改完前台看不到
- `entry.id` 是 slug，`entry.data.id` 才是 ULID — API 呼叫用 ULID

---

## 練習 5 — Hello World plugin

**目標**：寫一個最簡單的 plugin，每當有人發文時在 console 印一行 log。

**你會學到**：

- Plugin 雙 entrypoint（`index.ts` build-time + `sandbox-entry.ts` runtime）
- `definePlugin()` + `content:afterPublish` hook
- Capability 守關實作

**步驟**：

1. 載入 `creating-plugins` skill
2. 在 `packages/` 建 `hello-world-plugin/` 子套件
3. 寫 manifest（capability: `["content:read"]`）
4. 寫 hook 內容（log 文章 title）
5. 在 `astro.config.mjs` 加進 `plugins: [helloWorldPlugin()]`
6. 重啟 dev server
7. 在 admin 發布一篇文章，看 server console

**驗收**：

- [ ] dev server 啟動時無 capability 警告
- [ ] 發文後 server console 印出 `[hello-world] published: <title>`
- [ ] 把 capability 拔掉後，啟動 log 出現 `... missing capability — skipping`

**對應 skill**：`creating-plugins`

---

## 練習 6（加碼）— 部署到 Cloudflare Workers

**目標**：把練習 4 的站部署到 Cloudflare Workers，公開可訪問。

**你會學到**：

- D1（serverless SQLite）+ R2（S3-compatible 儲存）
- wrangler.jsonc 配置（含 Worker Loader 的概念）
- session: "auto" bookmark cookie 一致性模型

**前置**：

- Cloudflare 帳號（免費就夠）
- `npm i -g wrangler && wrangler login`

**步驟**：

1. 用 `pnpm create emdash@latest` 建 cloudflare 版（template `blog-cloudflare`）
2. 把練習 4 的 collection / page 移植過去
3. 在 wrangler.jsonc 設好 D1 + R2 binding
4. `npx emdash secrets generate && wrangler secret put EMDASH_ENCRYPTION_KEY`
5. `wrangler deploy`
6. 訪問 `https://<project>.<subdomain>.workers.dev`

**驗收**：

- [ ] Cloudflare dashboard 看得到 D1 db + R2 bucket
- [ ] 公網 URL 可訪問你的站
- [ ] passkey 註冊成功（注意 rpId 必須是公網域名）
- [ ] 停留 5 分鐘無流量後自動 scale-to-zero（透過 `cloudflare logs` 觀察）

**對應 skill**：`emdash-cli`（部署後遠端管理用）

---

## 交作業 / 延伸學習

每完成一題，把證明（截圖 + report） push 到你的個人 GitHub repo，連結貼到課程 Discord。

**延伸方向**：

- 用 `wordpress-theme-to-emdash` skill 把一個 WordPress 主題遷移到 EmDash
- 用 `agent-browser` skill 寫端對端測試
- 用 `adversarial-reviewer` skill 對自己的 plugin 做對抗式 review

祝寫得開心！記得：**Vibe Coding 不是讓 AI 替你寫，而是讓 AI 跟你一起寫**。
