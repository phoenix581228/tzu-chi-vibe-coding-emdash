---
name: tzu-chi-vibe-coding-emdash
description: Walk a student through the full Tzu Chi University Vibe Coding lab on EmDash CMS — six phases from technical research, through code analysis and local install, to a custom collection and (optionally) a Cloudflare deploy. Use when a student says "I'm starting the Vibe Coding course", "請帶我做慈大 Vibe Coding 練習", "load the EmDash tutorial skill", "guide me through the EmDash lessons", or any time someone asks to learn EmDash from scratch in this starter kit. Bilingual zh-TW + English.
---

# Tzu Chi University Vibe Coding × EmDash CMS Tutorial Skill
# 慈濟大學 Vibe Coding × EmDash CMS 教學 skill

> 慈濟大學 資訊科技與管理學系 大四 Vibe Coding 實機課程
> Tzu Chi University, Department of Information Technology & Management — Senior Vibe Coding Lab
> Version: 2026-05-06

---

## 中文版

### 這份 skill 帶你做什麼

帶你以「Vibe Coding」方法論完成 6 個階段，從零理解並實作一個 Cloudflare EmDash CMS POC：

| Phase | 主題 | 對應 phase 檔 |
|:---:|:---|:---|
| 1 | 環境準備 | `phases/1-environment.md` |
| 2 | 技術研究 | `phases/2-technical-research.md` |
| 3 | 程式深度分析 | `phases/3-code-analysis.md` |
| 4 | 本機安裝 EmDash | `phases/4-local-install.md` |
| 5 | 第一個自訂 collection | `phases/5-first-collection.md` |
| 6 | Plugin 或 Cloudflare 部署 | `phases/6-plugin-or-deploy.md` |

### 使用順序（鐵律）

1. 一定先讀 `lecture-notes/01-technical-research-report.md` 等三份報告（已包在 starter）
2. **每階段開工前先讀對應 phase 檔**（不要跳）
3. 一階段未通過驗收前不進下一階段
4. 失敗是常態 — 把錯誤訊息貼回 Claude Code 對話框，不要私下硬解

### Vibe Coding 心法（請反覆讀）

| 規則 | 反例 | 正確做法 |
|:---|:---|:---|
| 下指令要具體 | 「寫一個部落格」 | 「在 EmDash 加 recipes collection，欄位 title/photo/ingredients/steps」 |
| 先讀文件再寫 code | 直接問「怎麼做？」 | 先載入 skill / 讀 phase 檔，再針對細節問 |
| 驗證 AI 結論 | 看到 AI 回「應該可以」就 commit | curl / 跑 server / 看 console 確認 |
| 失敗就學習 | 心慌、刪檔重來 | 把錯誤完整貼給 AI 一起 debug |
| 用 skill 不用 Google | 「pnpm create emdash 怎麼用？」上網查 | 「請載入 emdash-cli skill 教我」 |

### 進度速查表

```
[ ] Phase 1 環境檢查通過（quickstart.sh 全綠或全黃）
[ ] Phase 2 自選一個 OSS 完成技術研究報告
[ ] Phase 3 完成程式深度分析含 ≥2 張 Mermaid 圖
[ ] Phase 4 本機 EmDash dev server 跑通 + passkey 註冊
[ ] Phase 5 自製 recipes collection 在 /recipes 看得到
[ ] Phase 6（擇一）Hello World plugin **或** Cloudflare 部署
```

### 給 AI agent 的執行指引

當 student 說「我要開始第 N 階段」：

1. **讀 `phases/N-*.md`**（用 Read tool）
2. **先報告該階段的「目標 / 驗收 / 預估時間」**，請 student 確認
3. **照 phase 檔的步驟逐項做**，每完成一項 update task list 並請 student 驗證
4. **不確定時問**：student 的目標、技能水準、可用時間
5. **驗收未通過時不要前進到下一階段**
6. **每階段結束時把證據（截圖 / 報告）整理成段落**，讓 student 可貼到 Discord

### 常見問題（FAQ）

**Q：我可以跳過 Phase 2 直接安裝嗎？**
A：可以但不建議。Phase 2 教你「如何研究新技術」，這個能力比 EmDash 本身更值錢。

**Q：Cloudflare 帳號要不要錢？**
A：免費方案就夠 POC。Workers Paid 月費 $5 才有 plugin sandbox（Phase 6 才用得到）。

**Q：可以用 Windows 嗎？**
A：用 WSL2。EmDash 部分依賴（`better-sqlite3`、`workerd`）在原生 Windows 編譯困難。

**Q：passkey 怎麼跨裝置同步？**
A：iCloud Keychain（Apple 生態）或 1Password 等 password manager 支援 WebAuthn 同步。POC 階段建議單裝置。

---

## English Version

### What this skill does

Walks you through 6 phases of the Vibe Coding methodology to build an EmDash CMS POC from scratch:

| Phase | Topic | Phase file |
|:---:|:---|:---|
| 1 | Environment prep | `phases/1-environment.md` |
| 2 | Technical research | `phases/2-technical-research.md` |
| 3 | Code deep analysis | `phases/3-code-analysis.md` |
| 4 | Local EmDash install | `phases/4-local-install.md` |
| 5 | First custom collection | `phases/5-first-collection.md` |
| 6 | Plugin **or** Cloudflare deploy | `phases/6-plugin-or-deploy.md` |

### Order of operations (hard rules)

1. Read all three reports in `lecture-notes/` first (shipped in the starter)
2. **Read the matching phase file before starting any phase** — don't skip
3. Don't move on until the current phase passes acceptance
4. Failures are normal — paste the error back to Claude Code, don't silently brute-force

### Vibe Coding mindset (re-read this often)

| Rule | Anti-pattern | Correct |
|:---|:---|:---|
| Be specific | "Build a blog" | "Add a `recipes` collection to EmDash with fields title/photo/ingredients/steps" |
| Read docs first | "How do I do X?" cold | Load the relevant skill / read the phase file first, then ask specifics |
| Verify AI claims | "Looks fine" → commit | curl / run server / check console |
| Failure = learning | Panic, delete, restart | Paste the full error to AI and debug together |
| Skill > Google | Search "pnpm create emdash" online | "Load the emdash-cli skill and teach me" |

### Progress tracker

```
[ ] Phase 1 environment check (quickstart.sh all green or yellow)
[ ] Phase 2 technical research on a self-chosen OSS
[ ] Phase 3 code deep analysis with ≥2 Mermaid diagrams
[ ] Phase 4 local EmDash dev server running + passkey registered
[ ] Phase 5 custom recipes collection visible at /recipes
[ ] Phase 6 (one of) Hello World plugin OR Cloudflare deploy
```

### Instructions for the AI agent

When the student says "I'm starting phase N":

1. **Read `phases/N-*.md`** with the Read tool
2. **Report the phase's goal / acceptance / time estimate** and ask the student to confirm
3. **Walk through steps one by one**, updating the task list and asking the student to verify after each
4. **When uncertain, ask**: student's goal, skill level, available time
5. **Don't advance until acceptance passes**
6. **At phase end, summarise evidence** (screenshots, reports) as a Discord-ready paragraph

### FAQ

**Q: Can I skip Phase 2 and jump to install?**
A: Yes, but you shouldn't. Phase 2 teaches you *how to research a new technology* — a skill more valuable than EmDash itself.

**Q: Does Cloudflare cost money?**
A: Free tier suffices for the POC. Workers Paid ($5/month) is only needed for plugin sandbox (Phase 6 only).

**Q: Windows OK?**
A: Use WSL2. Native Windows fails to build some EmDash deps (`better-sqlite3`, `workerd`).

**Q: How do passkeys sync across devices?**
A: iCloud Keychain (Apple) or password managers like 1Password support WebAuthn sync. For the POC, stick to one device.

---

## File Structure

```
tzu-chi-vibe-coding-emdash/
├── SKILL.md                # this file (bilingual)
└── phases/
    ├── 1-environment.md
    ├── 2-technical-research.md
    ├── 3-code-analysis.md
    ├── 4-local-install.md
    ├── 5-first-collection.md
    └── 6-plugin-or-deploy.md
```

---

License: MIT · Version: 2026-05-06
