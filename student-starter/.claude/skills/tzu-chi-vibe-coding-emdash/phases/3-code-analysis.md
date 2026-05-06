# Phase 3 — 程式深度分析 / Code Deep Analysis

## 中文

### 目標
把 Phase 2 研究的專案 `git clone` 到本機，跑完 5 phase 程式碼分析，產出 Mermaid 架構圖。

### 預估時間
30 分鐘

### 你會學到
- serena MCP 的符號操作（IDE 級 LSP，比 grep 快、比 read 精準）
- 從 `package.json` + 目錄推斷架構模式
- Mermaid 架構圖的最小可用畫法
- 怎麼識別「公開文檔沒提，但 source 裡有」的隱藏設計

### 步驟

1. **Clone 專案**
   ```bash
   git clone <你 Phase 2 研究的 repo>
   cd <專案>
   ```

2. **載入 skill**
   ```
   請載入 code-deep-analysis skill 分析這個專案
   ```

3. **跟著 5 phase**：
   - Phase 0 — 環境準備（serena 啟動，跑 `analyze-project.sh`）
   - Phase 1 — 目錄掃描（找入口、識別模組）
   - Phase 2 — 符號分析（核心類別 / 方法 / 依賴鏈）
   - Phase 3 — 架構評估（模式、技術棧、技術債）
   - Phase 4 — 文檔產出（系統架構圖、資料流圖、依賴圖）

4. **問 AI 這幾題**（不要問空泛問題）：
   - 「總共幾個 packages / modules？哪個是入口？」
   - 「這個專案藏了哪些 API surface（routes、CLI、env vars）？」
   - 「`README.md` 沒提但 source 裡其實有的設計是什麼？」
   - 「最大的單一函數 / 類別是哪個？多大？這是技術債嗎？」

### 驗收
- [ ] 至少 2 張 Mermaid 圖（建議：系統架構圖 + 請求生命週期）
- [ ] 列出 ≥ 1 個「公開文檔沒提」的設計
- [ ] 報告檔開頭標明 git commit hash（誠實標記分析時點）
- [ ] OpenMemory 有對應記憶（`CODE-<PROJECT>-YYYYMMDD-NNN`）

### 對應 skill
`code-deep-analysis`

### 老師的真實案例（範本）
今天我們對 EmDash 跑這個流程，發現：
1. 編輯器是 TipTap（不是公開評論說的 TinyMCE）
2. Plugin sandbox 用 Worker Loader（不是 Workers for Platforms）
3. MCP server 預設啟用（公開文檔說要手動配置）

**這就是價值** — 一份比官方文檔更精確的分析報告。

---

## English

### Goal
`git clone` the project you researched in Phase 2 and run the 5-phase code analysis, producing Mermaid diagrams.

### Time
30 minutes

### What you will learn
- serena MCP's symbol-level operations (IDE-grade LSP — faster than grep, more precise than read)
- Infer architecture from `package.json` + folder layout
- Minimum viable Mermaid for architecture diagrams
- Spot designs that are "in source but not in public docs"

### Steps

1. **Clone the project**
   ```bash
   git clone <your Phase 2 repo>
   cd <project>
   ```

2. **Load the skill**
   ```
   Please load the code-deep-analysis skill and analyze this project
   ```

3. **Walk the 5 phases**:
   - Phase 0 — Env prep (start serena, run `analyze-project.sh`)
   - Phase 1 — Directory scan (entry points, modules)
   - Phase 2 — Symbol analysis (core classes / methods / chains)
   - Phase 3 — Architecture eval (patterns, stack, debt)
   - Phase 4 — Docs (system diagram, data flow, dependency)

4. **Ask AI these questions** (avoid vague ones):
   - "How many packages / modules? Which is the entry point?"
   - "What hidden API surfaces does this project have (routes, CLI, env vars)?"
   - "What design choices are in source but not mentioned in `README.md`?"
   - "What is the largest single function / class? How big? Is it tech debt?"

### Acceptance
- [ ] At least 2 Mermaid diagrams (suggested: system architecture + request lifecycle)
- [ ] List ≥ 1 design "not in public docs"
- [ ] Report file states the git commit hash analyzed
- [ ] OpenMemory holds a matching memory (`CODE-<PROJECT>-YYYYMMDD-NNN`)

### Skill
`code-deep-analysis`

### Instructor's real example (template)
Running this flow on EmDash today, we found:
1. Editor is TipTap (not TinyMCE as some reviews claim)
2. Plugin sandbox uses Worker Loader (not Workers for Platforms)
3. MCP server is on by default (docs implied manual config)

**This is the payoff** — a report more accurate than the official documentation.
