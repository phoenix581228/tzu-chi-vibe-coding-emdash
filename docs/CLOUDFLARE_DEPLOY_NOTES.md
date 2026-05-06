# Cloudflare 部署紀錄與後續 setup 指引
# Cloudflare deployment record & post-deploy setup guide

> Date: 2026-05-06
> Public URL: **https://emdash-tzu-chi.phoenix-582.workers.dev**

---

## 中文

### 已完成（自動化部分）

| 項目 | 結果 |
|:---|:---|
| Cloudflare account | phoenix@tzuchi-org.tw（582103d73acfe645100a198c438f673c） |
| D1 database | `emdash-tzu-chi-db`（id `9f270577-1215-4284-b386-86d99579ed79`，APAC region） |
| R2 bucket | `emdash-tzu-chi-media` |
| KV namespace | `emdash-tzu-chi-session`（auto-provisioned by `@astrojs/cloudflare`） |
| Worker name | `emdash-tzu-chi` |
| Encryption key | `wrangler secret put EMDASH_ENCRYPTION_KEY` 已上傳 |
| 公網 URL | https://emdash-tzu-chi.phoenix-582.workers.dev（首次冷啟 ~50 秒，之後 ~ms 級） |

### 待手動完成（後續 setup）

EmDash 在 production 模式不允許 `dev-bypass` 自動建立 admin。第一次部署後需要手動完成 setup wizard 才有 admin 帳號 + 完整內容。

#### 步驟 1：完成 setup wizard（瀏覽器，~3 分鐘）

1. 開 https://emdash-tzu-chi.phoenix-582.workers.dev/_emdash/admin
2. 第一次訪問會自動進 setup wizard
3. 填 site title、tagline、admin email
4. 點「Register Passkey」用 Touch ID / Windows Hello 註冊（**rpId 是 emdash-tzu-chi.phoenix-582.workers.dev**，passkey 綁這個域名）
5. 完成後會被導入 admin SPA

#### 步驟 2：拿 admin token

```bash
cd poc/my-emdash-blog
npx emdash login --url https://emdash-tzu-chi.phoenix-582.workers.dev
```

互動：照提示完成（OAuth 或 device code 流程）。完成後 `~/.config/emdash/credentials.json` 會記住 token。

#### 步驟 3：上 schema + content

EmDash 沒有 `seed --url` 這個 CLI 選項，必須拆開做：

```bash
# Schema（collections + fields）
npx emdash schema push --url https://emdash-tzu-chi.phoenix-582.workers.dev

# Media（11 張圖：4 張代表圖 + 7 張 unsplash）
for f in poc/my-emdash-blog/uploads/*; do
  npx emdash media upload "$f" --url https://emdash-tzu-chi.phoenix-582.workers.dev
done

# Content（posts/pages/lessons）—— EmDash 沒提供批次 push CLI，需要透過 admin UI 匯入或自寫腳本
# 替代：用 admin UI 一篇一篇貼，或寫腳本呼叫 /_emdash/api/content/[collection] 帶 token
```

實務做法：用 **`wrangler d1 export`** + `wrangler d1 execute --remote --file` 從本機 SQLite 把整個 `ec_*` 表 dump 過去（最快，但繞過 EmDash 業務邏輯）。

#### 步驟 4：跑 plugin migrate

完成 content 上去後：

```bash
curl -X POST https://emdash-tzu-chi.phoenix-582.workers.dev/_emdash/api/plugins/markdown-marks/migrate \
  -H "Content-Type: application/json" \
  -H "X-EmDash-Request: 1" \
  -H "Cookie: <admin-session-cookie>" \
  -d '{}'
```

把 markdown markers 展開為正規 portable text marks。

### 為什麼 prod 沒做完整 seed

對教學課程而言，**「Cloudflare 部署成功」本身就是課程交付物**：

- 學員看到 wrangler.jsonc + astro.config.cloudflare.mjs 設定
- 看到 `wrangler deploy` 自動 provision D1 + R2 + KV
- 看到 `*.workers.dev` 公網 URL 立即可用
- 理解雙模式並存（本機 Node + 雲端 Cloudflare）

完整 content 移植是 ops/admin 工作而非教學重點，故拆成本指引讓老師課後再做。

---

## English

### Done (automated)

| Item | Result |
|:---|:---|
| Cloudflare account | phoenix@tzuchi-org.tw |
| D1 database | `emdash-tzu-chi-db` (APAC region) |
| R2 bucket | `emdash-tzu-chi-media` |
| KV namespace | `emdash-tzu-chi-session` (auto-provisioned by `@astrojs/cloudflare`) |
| Worker name | `emdash-tzu-chi` |
| Encryption key | `wrangler secret put` uploaded |
| Public URL | https://emdash-tzu-chi.phoenix-582.workers.dev (cold start ~50s, warm ms) |

### To do (manual post-deploy)

EmDash in production does not allow `dev-bypass`. Setup wizard must be completed in a browser to create the first admin user.

#### Step 1: Setup wizard (browser, ~3 min)

1. Open https://emdash-tzu-chi.phoenix-582.workers.dev/_emdash/admin
2. The first visit auto-enters the setup wizard
3. Fill in site title, tagline, admin email
4. Click "Register Passkey" — Touch ID / Windows Hello (the **rpId is the public domain** here)
5. You'll land in the admin SPA

#### Step 2: Get an admin token

```bash
cd poc/my-emdash-blog
npx emdash login --url https://emdash-tzu-chi.phoenix-582.workers.dev
```

#### Step 3: Push schema + content

EmDash has no `seed --url` flag. Must split:

```bash
npx emdash schema push --url <prod>
for f in poc/my-emdash-blog/uploads/*; do
  npx emdash media upload "$f" --url <prod>
done
# Content: use admin UI or write a script against /_emdash/api/content/[collection]
```

Or, faster but bypassing app logic: `wrangler d1 export` + `wrangler d1 execute --remote --file=...`.

#### Step 4: Run plugin migrate

```bash
curl -X POST <prod>/_emdash/api/plugins/markdown-marks/migrate \
  -H "X-EmDash-Request: 1" \
  -H "Cookie: <admin-session>" \
  -d '{}'
```

### Why we shipped without full content seed

For a teaching course, **"Cloudflare deployment succeeded" is itself the deliverable**:

- Students see the wrangler.jsonc and astro.config.cloudflare.mjs setup
- They see `wrangler deploy` auto-provision D1 + R2 + KV
- They see the `*.workers.dev` URL go live immediately
- They learn the dual-mode pattern (local Node + cloud Cloudflare)

Full content migration is an ops chore, not a teaching point, so we documented it here for later instead of slowing down class.
