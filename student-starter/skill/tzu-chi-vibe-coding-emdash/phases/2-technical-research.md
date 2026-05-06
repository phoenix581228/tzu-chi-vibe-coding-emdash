# Phase 2 — 技術研究 / Technical Research

## 中文

### 目標
對「你想學的下一個技術」（不是 EmDash，因為老師已經做過了）做完整的 7 步驟技術研究。

### 預估時間
30 分鐘

### 你會學到
- 怎麼讓 AI 「先查記憶」而不是每次都搜尋
- Context7（官方文檔） vs Perplexity（業界資訊）的分工
- 三角論證為什麼能防 hallucination
- 把研究結果落地為**可被未來 AI 使用**的記憶（OpenMemory）

### 推薦研究主題（任選）
- Astro 6 vs Next.js 15 比較
- pnpm workspace vs npm workspace
- Cloudflare D1 vs Turso 比較
- WebAuthn passkey 規格
- Portable Text vs Markdown
- 你研究所論文相關的技術

### 步驟

1. 在 Claude Code 對話框輸入：
   ```
   請載入 technical-research skill，協助我研究 [主題]
   ```
2. 跟著 7 步驟流程做：
   - Step 1：書記查記憶
   - Step 2：文書官 + 收集師平行收集
   - Step 3：書記寫技術文件
   - Step 4：依文件分析
   - Step 5：三角論證投票
   - Step 6：寫研究報告
   - Step 7：書記記錄報告
3. 報告位置：`docs/research/<TOPIC>_RESEARCH_REPORT_<YYYYMMDD>.md`

### 驗收
- [ ] 報告含「三角論證投票結果」（總協 / 收集師 / 分析師三方各自意見）
- [ ] 修正或補充至少一處公開文檔未提的細節
- [ ] OpenMemory 中可查到對應記憶 UID（格式 `TECH-<TOPIC>-YYYYMMDD-NNN`）
- [ ] 報告檔已用 `open` 指令開啟過

### 對應 skill
`technical-research`

### 隱藏練習：故意挑一個你不熟的主題
你會看到 AI 同時暴露兩種能力：
- 真實知識（從文件爬出來的）
- 自信編造的 hallucination

學會分辨這兩者，是 Vibe Coding 最重要的能力。

---

## English

### Goal
Run the full 7-step technical-research workflow on "the next technology you want to learn" (not EmDash, because the instructor already did that).

### Time
30 minutes

### What you will learn
- Make the AI "check memory first" instead of searching every time
- Division of labour: Context7 (official docs) vs Perplexity (industry signals)
- Why triangulation defeats hallucination
- Land research output as memory **future AI sessions can use** (OpenMemory)

### Suggested topics (pick one)
- Astro 6 vs Next.js 15 comparison
- pnpm workspace vs npm workspace
- Cloudflare D1 vs Turso
- WebAuthn passkey spec
- Portable Text vs Markdown
- Anything tied to your thesis

### Steps

1. In Claude Code:
   ```
   Please load the technical-research skill and help me research [topic]
   ```
2. Follow the 7 steps:
   - Step 1: Librarian checks memory
   - Step 2: Document Officer + Collector gather in parallel
   - Step 3: Librarian writes the tech document
   - Step 4: Analyse based on the document
   - Step 5: Triangulation vote
   - Step 6: Write the research report
   - Step 7: Librarian records the report
3. Output: `docs/research/<TOPIC>_RESEARCH_REPORT_<YYYYMMDD>.md`

### Acceptance
- [ ] Report contains triangulation vote (Coordinator / Collector / Analyst, each)
- [ ] At least one detail not in public docs is added or corrected
- [ ] OpenMemory has a memory UID (`TECH-<TOPIC>-YYYYMMDD-NNN`)
- [ ] The report file has been opened with `open`

### Skill
`technical-research`

### Hidden exercise — pick a topic you do not know
You will see the AI expose two abilities at once:
- Real knowledge (scraped from docs)
- Confident hallucination

Learning to tell them apart is the most important Vibe Coding skill.
