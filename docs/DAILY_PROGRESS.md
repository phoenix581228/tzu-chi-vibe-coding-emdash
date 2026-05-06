# Daily Progress Log
# 每日工作進度

> 此檔記錄本教學專案的每日工作進展。技術 release 細節見 [CHANGELOG.md](../CHANGELOG.md)，本檔聚焦「當天做了什麼、遇到什麼、明天做什麼」。

---

## [2026-05-06]（v1.0.0 → v1.0.1，單日完整公開首發）

### 完成事項

- ✅ **GitHub public repo**：https://github.com/phoenix581228/tzu-chi-vibe-coding-emdash（7 commits，v1.0.0 + v1.0.1 兩個正式 GitHub Release）
- ✅ **Cloudflare 部署**：https://emdash-tzu-chi.phoenix-582.workers.dev（Workers + D1 + R2 + KV，14ms cold start）
- ✅ **本機雙模式**：`pnpm dev`（Node + SQLite，學員預設）/ `pnpm run deploy`（Cloudflare prod），互不干擾
- ✅ **教學素材三件套**：
  - B 主站 dogfooding（lessons collection 中英 12 篇 + posts 中英 8 篇 + 雙語 about + 雙語 footer + version badge）
  - C 學員 starter（quickstart.sh + 雙語 6 練習題 + 8 Claude Code skills + 3 lecture-notes）
  - A 教學 skill `tzu-chi-vibe-coding-emdash`（6 phases 雙語）
- ✅ **markdown-marks plugin**：standard format 雙 entrypoint + content:beforeSave hook + migrate route，符合 creating-plugins skill 規範
- ✅ **4 張代表圖**：3 張 Gemini 生成 + 1 張 Claude 自動產生（HTML → Chrome headless 2752×1536 PNG）
- ✅ **全站 zh/en 雙語**：cookie 持久化 + cross-language equivalent-version redirect on posts/lessons/pages
- ✅ **雙語 LICENSE**（English official + 繁中翻譯，含「以英文為準」法律慣例註記）
- ✅ **v1.0.1 hardening**：Cloudflare D1 重建（避開 SQL dump import 的 FK/FTS5 衝突）+ 文檔化 3 個技術限制

### 遇到問題

1. **D1 SQL dump import 三次失敗**
   - sqlite3 `.dump` 對 FTS5 使用 `INSERT INTO sqlite_schema` 重建 virtual table，是 D1 拒絕的 hack
   - `PRAGMA foreign_keys = OFF` 與 `PRAGMA defer_foreign_keys = true` 在 D1 的隱式 transaction wrapper 內不生效
   - 即使移除 schema 中所有 FK constraint，DROP 既有 migrated tables 仍卡 D1 內建的 FK enforcement
2. **EmDash CLI 對 fresh prod 完全不能用**：login / schema / content / media 全部 `Not authenticated`。EmDash 安全設計上「第一個 admin user 必須透過瀏覽器 setup wizard + WebAuthn passkey 註冊」是 by design，**無 CLI 繞道**
3. **教學反思（領導兩次提示）**：
   - 「先讀 skill」— 載入 creating-plugins skill 後 plugin 設計變更（standard 雙 entrypoint）
   - 「不是有 EmDash CLI 嗎，不香嗎」— 提醒 SQL dump 是錯路徑，CLI 才是 emdash-native 方式

### 收工後補充

- 🔑 **領導已完成 prod admin passkey 註冊**（晚安後補充） → v1.1.0 不再被 setup wizard 卡住

### 明日計劃 / v1.1.0 stretch goal

1. ~~prod setup wizard~~ ✅ 已完成（領導手動）
2. `npx emdash login --url <prod>` device-code 確認拿 token（領導 1 次互動即可）
3. 寫 Python 腳本讀 seed.json，對每個 collection / field / taxonomy / menu / content / media 一個個 emdash CLI push（約 20 min）
4. 11 張媒體用 `emdash media upload --url <prod>`（已有 token 後純自動）
5. （可選）custom domain + 課堂錄影教學 → 完整 v1.1.0 release

### 教學收穫（寫進未來課程教材）

本次教學的真正高峰不是 v1.0.0 release 那刻，而是「Cloudflare D1 import 失敗 + EmDash CLI 必須先有 admin」這兩個 dogfooding 才看得見的工程限制。三條真實案例可教：

- **為什麼不能 SQL dump 跨 SQLite ↔ D1**：FTS5 hack、PRAGMA 失效、FK enforcement
- **為什麼 plugin hook 不擋 seed CLI 路徑**（v1.0.0 教訓）：seed 是 system-level，hook 是 admin API-level
- **為什麼 EmDash 不允許 CLI 繞過 setup wizard**（v1.0.1 教訓）：第一個 admin 是 supply-chain 安全邊界

OpenMemory UID（每日進度）：`b7ea82c9-64eb-47de-a753-b582cde9192c`

---
