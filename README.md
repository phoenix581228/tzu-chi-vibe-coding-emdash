# Tzu Chi University Vibe Coding × EmDash CMS
# 慈濟大學 Vibe Coding × EmDash CMS 教學專案

> 慈濟大學 資訊科技與管理學系 大四 Vibe Coding 實機課程的完整教學產出
> Complete teaching artefact of the Tzu Chi University ITM senior Vibe Coding lab
>
> Date: 2026-05-06 · License: MIT

---

## 中文版

### 這是什麼

這是一份「以 EmDash CMS 為範本」的 Vibe Coding 實機課程教學包，內含：

| 內容 | 說明 |
|:---|:---|
| **`poc/my-emdash-blog/`** | 完整可跑的 EmDash blog demo 站。是課堂上 dogfooding 出來的成品 — 你看到的網站本身就用 EmDash 寫成。內含 4 篇研究文章（中英 8 篇）、6 篇課程概要（中英 12 篇）、雙語 about 頁、全站 zh / en 切換 + 跨語對等 redirect、AI 生成代表圖、自製 markdown-marks plugin。 |
| **`student-starter/`** | 學員回家自學的 starter 包。`bash quickstart.sh` 一鍵環境檢查；`exercises/` 6 道循序練習題（雙語）；`skill/tzu-chi-vibe-coding-emdash/` 完整教學 skill；`.claude/skills/` 含 7 個 EmDash 內建 skill + 1 教學 skill = 8 個 Claude Code skill 即用即載。 |
| **`docs/research/`** | 4 份完整研究報告：技術研究、程式深度分析、內建 skills 研究、課程教學素材總結。每份 ~10–25 KB Markdown 含 Mermaid 架構圖。 |
| **`assets/cover-images/`** | 4 張代表圖（3 張 Gemini 生成 + 1 張 Claude 自動產生），對應 4 篇研究文章。 |

### 課程目的

Vibe Coding 不是「讓 AI 替你寫」，而是「讓 AI 跟你一起寫」。本課程訓練三項能力：

1. **下對指令的能力** — 把模糊需求拆成可驗收的具體規格
2. **善用 skill 的能力** — 把方法論封裝成 AI 可重用的 skill，比 Google 精準
3. **驗證 AI 結論的能力** — 課堂上抓到 3 處公開文檔錯誤（編輯器是 TipTap 不是 TinyMCE、Plugin sandbox 用 Worker Loader 不是 Workers for Platforms、MCP server 預設啟用），都是讀原始碼比對才發現的

### 教學範式：dogfooding

這個 repo 本身就是教材。你看到的每一篇研究文章、每一張代表圖、每一個雙語切換按鈕、每一個 plugin hook，都是課堂 2 小時內由師生協同 Claude Code AI agent 產出，並 dogfood 到 EmDash 站本身。

### 快速上手（學員）

```bash
# 1. clone
git clone https://github.com/phoenix581228/tzu-chi-vibe-coding-emdash.git
cd tzu-chi-vibe-coding-emdash

# 2. 環境檢查
bash student-starter/quickstart.sh

# 3. 跑 demo 站
cd poc/my-emdash-blog
cp .env.example .env
npx emdash auth secret >> .env   # 產 EMDASH_ENCRYPTION_KEY 寫入
pnpm install
pnpm bootstrap                    # 建 SQLite + 套 seed
pnpm dev                          # → http://localhost:4321
```

訪問：
- 首頁：http://localhost:4321/
- Admin（首次需 passkey 註冊）：http://localhost:4321/_emdash/admin
- 課程：http://localhost:4321/lessons
- 研究文章：http://localhost:4321/posts
- About：http://localhost:4321/pages/about-zh

### 在家繼續學習（用 Claude Code）

1. 開 Claude Code（在 repo 根目錄或 `student-starter/`）
2. 對 Claude Code 輸入：
   > 請載入 tzu-chi-vibe-coding-emdash skill 開始第 1 階段
3. AI 會引導你完成 6 階段流程（環境 → 技術研究 → 程式分析 → 本機安裝 → 第一個 collection → Plugin 或 Cloudflare 部署）

### 為什麼用這個 repo 學 EmDash 比看官方文檔快

我們把以下事項變成可立即操作的形式：

- **完整 EmDash plugin 範例**（`poc/my-emdash-blog/plugins/markdown-marks/`）— 不是 Hello World，是解決真實問題的 plugin，覆蓋 hook + capability + route + migration 四大特性
- **修正的公開文檔錯誤** — 我們在課堂發現的 3 處錯誤都記錄在 `docs/research/02-code-deep-analysis.md`
- **dogfooding 站台**（`poc/my-emdash-blog/`）— 看到任何前端效果都能立刻找到對應的 source code 位置
- **真實 schema 變更腳本**（如 `seed/seed.json` 加 lang / topic 欄位、posts collection 重建）— 學員照著做就學會 EmDash 的 database-first schema 模型

### 8 個 Claude Code skills（學員 starter 內含）

| 類別 | Skill | 用途 |
|:---|:---|:---|
| 建置 | `building-emdash-site` | 寫 collection、page、Portable Text |
| 建置 | `creating-plugins` | 寫 plugin（hook/capability/route）|
| 建置 | `emdash-cli` | CLI 操作 EmDash 實例 |
| 遷移 | `wordpress-plugin-to-emdash` | WP 概念 → EmDash API 對應 |
| 遷移 | `wordpress-theme-to-emdash` | 6 階段主題遷移流程 |
| 品質 | `adversarial-reviewer` | 敵意式 code review |
| 品質 | `agent-browser` | accessibility tree 瀏覽器自動化 |
| **教學** | `tzu-chi-vibe-coding-emdash` | **本課程主 skill，6 phases 引導** |

### 致謝

- Cloudflare 開放 [EmDash CMS](https://github.com/emdash-cms/emdash) 原始碼（MIT）— 本課程的範本
- 慈濟大學資訊科技與管理學系師生 — 一起把 dogfooding 玩到底

歡迎其他教育機構 fork、自由使用、修改、再發行（MIT 授權）。改進建議透過 GitHub Issues / PR。

---

## English Version

### What is this

A complete teaching package for a Vibe Coding hands-on lab using EmDash CMS as the subject material:

| Content | Description |
|:---|:---|
| **`poc/my-emdash-blog/`** | A fully runnable EmDash blog. The site itself is the course's dogfooding output — what you see was built with EmDash, in class. Includes 4 research articles (8 bilingual posts), 6 lesson summaries (12 bilingual entries), bilingual About page, site-wide zh/en switching with cross-language redirect, AI-generated cover images, and a custom `markdown-marks` plugin. |
| **`student-starter/`** | Take-home starter for self-study. `bash quickstart.sh` runs environment checks; `exercises/` has 6 sequential bilingual exercises; `skill/tzu-chi-vibe-coding-emdash/` is the full teaching skill; `.claude/skills/` ships 7 built-in EmDash skills + 1 course skill = 8 Claude Code skills ready to use. |
| **`docs/research/`** | 4 complete research reports: technical research, code deep analysis, built-in skills research, and a teaching-materials summary. Each is ~10–25 KB Markdown with Mermaid architecture diagrams. |
| **`assets/cover-images/`** | 4 cover images (3 Gemini-generated, 1 Claude-auto-generated), one per research article. |

### Course goals

Vibe Coding is not "let the AI write for you" — it's "writing with the AI." The course trains three abilities:

1. **Writing the right prompt** — turn vague needs into specific, testable specs
2. **Using skills well** — package methodology as AI-reusable skills, more precise than Google
3. **Verifying AI claims** — in class we caught 3 documentation errors (editor is TipTap not TinyMCE; plugin sandbox uses Worker Loader not Workers for Platforms; MCP server is enabled by default). None visible without reading source.

### Teaching paradigm: dogfooding

This repo is itself the teaching material. Every research article, every cover image, every language toggle, every plugin hook you see was produced live in a 2-hour session by students collaborating with the Claude Code AI agent — and then dogfooded back into the EmDash site.

### Quick start (students)

```bash
# 1. clone
git clone https://github.com/phoenix581228/tzu-chi-vibe-coding-emdash.git
cd tzu-chi-vibe-coding-emdash

# 2. env check
bash student-starter/quickstart.sh

# 3. run the demo site
cd poc/my-emdash-blog
cp .env.example .env
npx emdash auth secret >> .env   # generates EMDASH_ENCRYPTION_KEY
pnpm install
pnpm bootstrap                    # creates SQLite + applies seed
pnpm dev                          # → http://localhost:4321
```

URLs:
- Site:    http://localhost:4321/
- Admin:   http://localhost:4321/_emdash/admin (first visit registers a passkey)
- Lessons: http://localhost:4321/lessons
- Posts:   http://localhost:4321/posts
- About:   http://localhost:4321/pages/about-en

### Continue at home (with Claude Code)

1. Open Claude Code in the repo root or `student-starter/`
2. Type:
   > Please load the tzu-chi-vibe-coding-emdash skill and start phase 1
3. The AI walks you through six phases (environment → technical research → code analysis → local install → first custom collection → plugin or Cloudflare deploy).

### Why this repo beats reading the official docs

We turn the following into directly executable form:

- **A complete EmDash plugin example** (`poc/my-emdash-blog/plugins/markdown-marks/`) — not Hello World, but a plugin solving a real problem; covers all four core features (hooks, capabilities, routes, migration)
- **Documentation corrections** — the 3 errors we found in class are recorded in `docs/research/02-code-deep-analysis.md`
- **A dogfooded site** (`poc/my-emdash-blog/`) — any frontend behaviour you see, you can locate in the source
- **Real schema-change scripts** (e.g. adding `lang` / `topic` fields to seed.json, rebuilding the posts collection) — by following them, students learn EmDash's database-first schema model

### 8 Claude Code skills (in the student starter)

| Category | Skill | Purpose |
|:---|:---|:---|
| Build | `building-emdash-site` | Collections, pages, Portable Text |
| Build | `creating-plugins` | Hooks / capabilities / routes |
| Build | `emdash-cli` | CLI ops on EmDash instances |
| Migration | `wordpress-plugin-to-emdash` | WP → EmDash API mapping |
| Migration | `wordpress-theme-to-emdash` | Six-phase theme migration |
| Quality | `adversarial-reviewer` | Hostile code review |
| Quality | `agent-browser` | Accessibility-tree browser automation |
| **Course** | `tzu-chi-vibe-coding-emdash` | **The main course skill, six phases** |

### Credits

- Cloudflare for open-sourcing [EmDash CMS](https://github.com/emdash-cms/emdash) under MIT — the subject of this course
- Tzu Chi University ITM students and faculty — for taking dogfooding all the way

Other institutions are welcome to fork, use, modify, and redistribute under MIT. Improvements via GitHub Issues / PRs welcome.

---

## Repository Map

```
tzu-chi-vibe-coding-emdash/
├── README.md                      ← you are here
├── LICENSE                        ← MIT
├── .gitignore
│
├── assets/
│   └── cover-images/              ← 4 cover images for the 4 research articles
│
├── docs/
│   └── research/                  ← 4 full research reports + Mermaid diagrams
│       ├── EMDASH_TECHNICAL_RESEARCH_REPORT_20260506.md
│       ├── EMDASH_CODE_DEEP_ANALYSIS_20260506.md
│       ├── EMDASH_BUILTIN_SKILLS_RESEARCH_20260506.md
│       └── EMDASH_BUILTIN_SKILLS_RESEARCH_20260506.md
│
├── student-starter/               ← take-home package for students
│   ├── README.md                  (bilingual)
│   ├── quickstart.sh              ← env check
│   ├── lecture-notes/             ← copies of the 4 research reports
│   ├── exercises/
│   │   ├── EXERCISES.md           (zh)
│   │   └── EXERCISES.en.md
│   ├── skill/
│   │   └── tzu-chi-vibe-coding-emdash/
│   │       ├── SKILL.md
│   │       └── phases/1..6.md
│   └── .claude/skills/            ← 7 EmDash skills + 1 course skill
│
└── poc/
    └── my-emdash-blog/            ← live EmDash demo (this repo's site)
        ├── astro.config.mjs       (with markdown-marks plugin wired up)
        ├── package.json           (file: dep on the local plugin)
        ├── pnpm-lock.yaml
        ├── .env.example           ← copy to .env on first run
        ├── seed/seed.json         (collections + content + media URLs)
        ├── src/
        │   ├── layouts/Base.astro (i18n + lang switcher)
        │   ├── components/LanguageSwitcher.astro
        │   ├── pages/             (lessons, posts, pages with cross-lang redirect)
        │   └── utils/lang.ts      (zh/en label dictionary)
        ├── plugins/
        │   └── markdown-marks/    ← full EmDash plugin example
        │       └── src/{index.ts, sandbox-entry.ts, lib/expand-marks.ts}
        └── uploads/               (11 media files: 4 covers + 7 seed images)
```

---

License: [MIT](./LICENSE) · Built 2026-05-06 in 2 hours by 12 students + Claude Code
