# Phase 4 — 本機安裝 EmDash / Local EmDash Install

## 中文

### 目標
從零安裝 EmDash blog template + 本機 SQLite，跑通 dev server，註冊 passkey，發第一篇文章。

### 預估時間
20 分鐘

### 你會學到
- `pnpm create emdash@latest` 一條指令做了多少事
- `bootstrap` = `init`（migrations）+ `seed`（套 seed.json）的關係
- WebAuthn passkey 註冊流程（Touch ID / Windows Hello）
- Live Collections 即時生效（不用 rebuild）

### 步驟

1. **Scaffold**
   ```bash
   cd ~/projects   # 或你慣用的 workspace
   pnpm create emdash@latest my-first-emdash --template blog --platform node --pm pnpm --install --yes
   cd my-first-emdash
   ```

2. **Bootstrap**
   ```bash
   pnpm bootstrap
   ```
   會看到 9 篇示範文章 + 7 張 Unsplash 圖被 seed。

3. **啟動 dev server**
   ```bash
   pnpm dev
   ```
   等到看到 `Local  http://localhost:4321/`

4. **三大訪問點**
   - 首頁：http://localhost:4321/
   - Admin：http://localhost:4321/_emdash/admin（首次需 passkey 註冊）
   - Auth API：http://localhost:4321/_emdash/api/auth/mode

5. **Setup wizard**
   - 開 Admin URL
   - 填 Site Title、Tagline、Admin Email
   - 點「Register Passkey」用 Touch ID / Windows Hello
   - 進入 Admin SPA

6. **發第一篇文章**
   - 左側 Posts → New Post
   - 填 title、content、發布
   - 回首頁不重啟即可看到（Live Collections）

### 驗收
- [ ] dev server 啟動 log 看到 `Astro v6.x.x ready in xxx ms`
- [ ] passkey 註冊成功（無密碼選項）
- [ ] 自建文章在 / 與 /posts 看得到
- [ ] 改 admin 標題 / 內容後不重啟 dev server 立即生效

### 對應 skill
`building-emdash-site`（可選，若想理解每個欄位代表什麼）

### 真實觀察 — 學會看 console
啟動時會看到一行警告：
```
[hooks] Plugin "audit-log" declares content:beforeSave hook
        without content:write capability — skipping
```
**不要忽略這行**。這是 EmDash capability 守關真實運作的證據。Phase 6 寫 plugin 時你會理解原因。

媒體檔名形如 `01KQY00MTRSX9Q7C2NW0GMTP28.jpg` — 這是 ULID（不是 UUID）。可排序、collision-free。

### 常見錯誤

| 症狀 | 原因 | 解法 |
|:---|:---|:---|
| `EADDRINUSE :::4321` | 上次的 dev server 沒關 | `kill $(lsof -ti :4321)` |
| `ERR_PNPM_LOCKFILE_BREAKING_CHANGE` | pnpm 版本不對 | `corepack prepare pnpm@10.28.0 --activate` |
| Passkey 註冊失敗 | 不是 https + 不是 localhost | 必須用 `http://localhost:4321` 不要用 IP |
| `[hooks]` 警告 | audit-log plugin manifest 與 hook 不匹配 | 不影響站運作，可忽略 |

---

## English

### Goal
From zero, install the EmDash blog template + local SQLite, run dev server, register passkey, publish a post.

### Time
20 minutes

### What you will learn
- How much `pnpm create emdash@latest` does in one line
- `bootstrap` = `init` (migrations) + `seed` (apply seed.json)
- WebAuthn passkey registration (Touch ID / Windows Hello)
- Live Collections take effect instantly (no rebuild)

### Steps

1. **Scaffold**
   ```bash
   cd ~/projects   # or your workspace
   pnpm create emdash@latest my-first-emdash --template blog --platform node --pm pnpm --install --yes
   cd my-first-emdash
   ```

2. **Bootstrap**
   ```bash
   pnpm bootstrap
   ```
   You will see 9 sample posts and 7 Unsplash images being seeded.

3. **Start dev server**
   ```bash
   pnpm dev
   ```
   Wait for `Local  http://localhost:4321/`

4. **Three URLs**
   - Site:  http://localhost:4321/
   - Admin: http://localhost:4321/_emdash/admin (first visit registers a passkey)
   - Auth API: http://localhost:4321/_emdash/api/auth/mode

5. **Setup wizard**
   - Open the Admin URL
   - Fill Site Title, Tagline, Admin Email
   - Click "Register Passkey" using Touch ID / Windows Hello
   - Enter the Admin SPA

6. **Publish first post**
   - Left nav → Posts → New Post
   - Fill title, content, publish
   - Visit homepage; appears without restart (Live Collections)

### Acceptance
- [ ] Boot log shows `Astro v6.x.x ready in xxx ms`
- [ ] Passkey registers (no password fallback)
- [ ] Your post appears on / and /posts
- [ ] Edits in admin (title / content) take effect without restarting dev

### Skill
`building-emdash-site` (optional — useful if you want to understand each field)

### Real observation — read your console
At boot you will see:
```
[hooks] Plugin "audit-log" declares content:beforeSave hook
        without content:write capability — skipping
```
**Do not ignore this line**. It is real evidence of EmDash's capability gate. Phase 6 (plugin) will explain why.

Media filenames look like `01KQY00MTRSX9Q7C2NW0GMTP28.jpg` — that's a ULID (not UUID): sortable, collision-free.

### Common errors

| Symptom | Cause | Fix |
|:---|:---|:---|
| `EADDRINUSE :::4321` | Previous dev server still running | `kill $(lsof -ti :4321)` |
| `ERR_PNPM_LOCKFILE_BREAKING_CHANGE` | Wrong pnpm version | `corepack prepare pnpm@10.28.0 --activate` |
| Passkey registration fails | Not https + not localhost | Use `http://localhost:4321`, not an IP |
| `[hooks]` warning | audit-log manifest vs hook mismatch | Doesn't break the site, ignore |
