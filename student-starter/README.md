# 慈濟大學 Vibe Coding × EmDash CMS 教學包
# Tzu Chi University Vibe Coding × EmDash CMS Starter

> 慈濟大學 資訊科技與管理學系 大四 Vibe Coding 實機課程
> Tzu Chi University, Department of Information Technology & Management — Senior Vibe Coding Lab

---

## 中文版

### 這份 starter 是什麼？

這是一份「教自己」的 starter。你不會在這裡看到大量 code，因為 **Vibe Coding 的精髓是：你下對指令，AI 幫你寫**。

這份 starter 給你：

1. 三份**精選技術文件**（`lecture-notes/`）— 課堂上講師的研究報告原檔
2. 六道**練習題**（`exercises/EXERCISES.md` / `EXERCISES.en.md`）— 從技術研究、本機安裝到第一個自訂 collection
3. 一份**主 skill**（`skill/SKILL.md`）— 載入後 Claude Code 會引導你完成全部流程
4. 一份**快速入門腳本**（`quickstart.sh`）— 一行跑完最常踩雷的環境檢查

### 預備條件

- macOS / Linux / WSL2（Windows 原生不建議）
- Claude Code CLI（已登入帳號）
- Node.js ≥ 22.12.0（**避開** 21、23、25 這類奇數版本）
- 網路：能訪問 GitHub 與 npm registry
- 30 GB 可用磁碟空間（含 Docker 鏡像 / Cloudflare Workers 模擬等空間）

### 推薦學習路徑

| 階段 | 時程 | 你會做什麼 |
|:---|:---|:---|
| 1. 環境準備 | 10 分鐘 | `bash quickstart.sh` 跑完檢查 |
| 2. 技術研究 | 30 分鐘 | 練習 1 — 用 Claude Code 對任一 OSS 做技術研究 |
| 3. 程式深度分析 | 30 分鐘 | 練習 2 — 對你研究的專案做 5 phase 分析 |
| 4. 本機安裝 EmDash | 20 分鐘 | 練習 3 — 跑通本機 dev server |
| 5. 第一個自訂 collection | 30 分鐘 | 練習 4 — 用 building-emdash-site skill |
| 6. Plugin 體驗 | 30 分鐘 | 練習 5 — 用 creating-plugins skill 寫 Hello World plugin |
| 7. 加碼：部署 Cloudflare | 60 分鐘 | 練習 6 — wrangler deploy（可選） |

### 怎麼開始？

```bash
# 1. 進到這個資料夾
cd student-starter

# 2. 跑環境檢查
bash quickstart.sh

# 3. 開啟 Claude Code（在 student-starter/ 目錄）
claude

# 4. 在 Claude Code 對話框輸入：
#    請載入 tzu-chi-vibe-coding-emdash skill 引導我從第 1 階段開始
```

### 課程網址

老師現場架設的 EmDash demo 站：

- 課程列表（中文）：http://localhost:4321/lessons
- 單課示範：http://localhost:4321/lessons/zh-01-technical-research
- Admin（passkey 登入）：http://localhost:4321/_emdash/admin

> 這個 demo 站本身就是用 **EmDash CMS 寫成的**。你看到的「課程」是 admin 裡的一個 collection。
> 這就是 dogfooding：用 EmDash 教 EmDash。

### 重要規則（vibe coding 心法）

1. **先讀文件再寫 code**：每個 skill 都假設你已經讀過 lecture-notes
2. **下指令要具體**：不要說「寫一個部落格」，要說「在 EmDash 加一個 recipes collection，欄位有 title、ingredients、steps」
3. **驗證 AI 的結論**：今天課堂示範就抓到 3 個公開文檔的錯誤（編輯器、sandbox 機制、MCP 預設）
4. **不懂就問 skill**：載入 `building-emdash-site` 比 google 更精準
5. **失敗是常態**：plugin capability 守關失敗、port 衝突、passkey 註冊失敗 — 都是學習素材

### 求救資源

- 課程 Discord 群（老師會給）
- EmDash GitHub Issues：https://github.com/emdash-cms/emdash/issues
- EmDash 官方文檔：https://docs.emdashcms.com/

---

## English Version

### What is this starter?

This is a "teach-yourself" starter. You won't find a lot of code here, because **the heart of Vibe Coding is: you write the right prompt, the AI writes the code**.

This starter gives you:

1. Three **curated technical documents** (`lecture-notes/`) — the original research reports from class
2. Six **exercises** (`exercises/EXERCISES.md` / `EXERCISES.en.md`) — from technical research and local install to your first custom collection
3. A **main skill** (`skill/SKILL.md`) — load it and Claude Code walks you through the full flow
4. A **quickstart script** (`quickstart.sh`) — one-liner that catches the most common environment gotchas

### Prerequisites

- macOS / Linux / WSL2 (native Windows not recommended)
- Claude Code CLI (logged in)
- Node.js ≥ 22.12.0 (**avoid** odd-numbered releases 21 / 23 / 25)
- Network access: GitHub + npm registry
- 30 GB free disk (Docker images, Cloudflare Workers emulation, etc.)

### Recommended learning path

| Stage | Time | What you'll do |
|:---|:---|:---|
| 1. Environment | 10 min | Run `bash quickstart.sh` |
| 2. Technical research | 30 min | Exercise 1 — research any OSS with Claude Code |
| 3. Code deep analysis | 30 min | Exercise 2 — apply the 5-phase scan to your project |
| 4. Local EmDash | 20 min | Exercise 3 — get the dev server running |
| 5. First custom collection | 30 min | Exercise 4 — use the building-emdash-site skill |
| 6. Plugin tasting | 30 min | Exercise 5 — write a Hello World plugin |
| 7. Bonus: Cloudflare deploy | 60 min | Exercise 6 — wrangler deploy (optional) |

### How to start

```bash
# 1. Enter this folder
cd student-starter

# 2. Run env checks
bash quickstart.sh

# 3. Launch Claude Code (inside student-starter/)
claude

# 4. In the Claude Code prompt, type:
#    Please load the tzu-chi-vibe-coding-emdash skill and guide me from stage 1.
```

### Class URLs

The instructor's live EmDash demo site:

- Lesson index (English): http://localhost:4321/lessons
- Sample lesson: http://localhost:4321/lessons/en-01-technical-research
- Admin (passkey login): http://localhost:4321/_emdash/admin

> The demo site itself is built **with EmDash CMS**. The "lessons" you see live in an admin collection.
> That is dogfooding: teaching EmDash with EmDash.

### Vibe Coding ground rules

1. **Read docs before code**: each skill assumes you've read the lecture notes
2. **Be specific**: don't say "build a blog" — say "add a `recipes` collection to EmDash with title, ingredients, steps"
3. **Verify the AI**: in class today we caught 3 documentation errors (editor type, sandbox mechanism, MCP default)
4. **Ask the skill, not Google**: loading `building-emdash-site` is more precise than search
5. **Failure is normal**: plugin capability gate failures, port conflicts, passkey registration issues — all learning fuel

### Help & resources

- Class Discord (link from instructor)
- EmDash GitHub Issues: https://github.com/emdash-cms/emdash/issues
- EmDash official docs: https://docs.emdashcms.com/

---

## 目錄結構 / Directory Structure

```
student-starter/
├── README.md              # 本檔案 / This file
├── quickstart.sh          # 環境檢查腳本 / Env check script
├── lecture-notes/         # 課堂技術文件 / In-class tech docs
│   ├── 01-technical-research-report.md
│   ├── 02-code-deep-analysis.md
│   └── 03-builtin-skills-research.md
├── exercises/
│   ├── EXERCISES.md       # 練習題（中文）
│   └── EXERCISES.en.md    # Exercises (English)
└── skill/
    └── tzu-chi-vibe-coding-emdash/
        ├── SKILL.md
        └── phases/
            ├── 1-environment.md
            ├── 2-technical-research.md
            ├── 3-code-analysis.md
            ├── 4-local-install.md
            ├── 5-first-collection.md
            └── 6-plugin-or-deploy.md
```

---

授權 / License: MIT
版本 / Version: 2026-05-06
