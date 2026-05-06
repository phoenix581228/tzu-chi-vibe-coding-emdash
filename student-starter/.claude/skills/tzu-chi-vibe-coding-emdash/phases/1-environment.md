# Phase 1 — 環境準備 / Environment

## 中文

### 目標
讓你的電腦具備跑 EmDash 的最低需求，並理解每個工具為什麼存在。

### 預估時間
10 分鐘

### 你會學到
- Node 偶數版本（22、24）vs 奇數版本（21、23、25）的差別 — EmDash 不支援奇數版本
- pnpm 為什麼比 npm 快（hard-link store）+ EmDash 為何選 pnpm
- corepack 是 Node 內建的 package-manager 切換器
- SQLite + 本機 storage 是 EmDash 的「zero-setup」路徑

### 步驟

1. 跑 `bash quickstart.sh`
2. 看結果：
   - 全綠 → 進 Phase 2
   - 有黃色警告 → 通常是 pnpm 或 Claude Code CLI 沒裝；按提示裝
   - 任何紅色失敗 → 必須先處理
3. 紅色項目排查：
   - **Node 太舊或奇數版**：用 [nvm](https://github.com/nvm-sh/nvm) 裝 Node 22.12 或 24.x
   - **git 沒裝**：macOS 跑 `xcode-select --install`；Linux 用 `apt install git`
   - **GitHub 連不上**：檢查 VPN / firewall
   - **port 4321 被占**：`kill $(lsof -ti :4321)` 或改其他 port

### 驗收
- [ ] `bash quickstart.sh` 沒紅色失敗
- [ ] `node -v` 顯示 v22.12+ 或 v24.x（偶數）
- [ ] `pnpm -v` 顯示 10.28+
- [ ] `claude --version` 有輸出（在 PATH）

### 對應 EmDash skill
無（這是預備階段）

### 心法
不要忽略警告。今天能跑不代表明天能跑 — 環境是 Vibe Coding 的隱形地基。

---

## English

### Goal
Bring your machine to the minimum viable state to run EmDash, and understand why each tool exists.

### Time
10 minutes

### What you will learn
- Even-numbered Node (22, 24) vs odd-numbered (21, 23, 25) — EmDash does not support odd releases
- Why pnpm is faster than npm (hard-link store) and why EmDash chose pnpm
- corepack is Node's built-in package-manager switcher
- SQLite + local storage is EmDash's "zero-setup" path

### Steps

1. Run `bash quickstart.sh`
2. Read the output:
   - All green → proceed to Phase 2
   - Yellow warnings → usually missing pnpm or Claude Code CLI; follow the hints
   - Any red failure → resolve first
3. Red-failure triage:
   - **Node too old or odd-numbered**: install Node 22.12+ or 24.x via [nvm](https://github.com/nvm-sh/nvm)
   - **git missing**: macOS `xcode-select --install`; Linux `apt install git`
   - **GitHub unreachable**: check VPN / firewall
   - **Port 4321 in use**: `kill $(lsof -ti :4321)` or pick a different port

### Acceptance
- [ ] `bash quickstart.sh` shows no red failures
- [ ] `node -v` prints v22.12+ or v24.x (even)
- [ ] `pnpm -v` prints 10.28+
- [ ] `claude --version` returns output (on PATH)

### Matching EmDash skill
None (preparatory phase).

### Mindset
Never ignore warnings. Working today does not mean working tomorrow — environment is the invisible foundation of Vibe Coding.
