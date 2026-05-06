# Cloudflare EmDash 技術研究報告

- **日期**：2026-05-06
- **研究主題**：Cloudflare 開源專案 EmDash 的應用範式、開發範式與 POC 部署可行性
- **記憶 UID**：`TECH-EMDASH-20260506-001`
- **研究流程**：technical-research skill v1.0（7 步驟，三角論證）

---

## ⚠️ 命名衝突警告（非常重要）

GitHub 上有**兩個同名但完全不同的專案**：

| 專案 | 倉庫 | 性質 |
|:---|:---|:---|
| **Cloudflare EmDash CMS**（本研究目標） | `emdash-cms/emdash` | TypeScript + Astro + Cloudflare 全棧 CMS |
| EmDash Agentic Dev Env | `generalaction/emdash` | YC W26 的 coding agent 並行執行 UI |

收集資料時請務必確認倉庫所有者為 `emdash-cms`，避免混淆。本報告全文的「EmDash」皆指 Cloudflare CMS。

---

## 一、研究發現

### 1.1 專案概況

| 項目 | 內容 |
|:---|:---|
| 主導者 | Cloudflare（核心作者 Matt Kane、Matt Taylor） |
| 發布日 | 2026-04-01（Cloudflare Blog 公告） |
| 版本 | v0.1.0 developer preview（截至 2026-05-06，已 115+ releases） |
| 預計 1.0 | 約 2026-05~06 月（HN 訊息） |
| 授權 | MIT |
| 倉庫 | https://github.com/emdash-cms/emdash（10.3k★ / 898 fork） |
| 文檔 | https://docs.emdashcms.com/ |
| Blog | https://blog.cloudflare.com/emdash-wordpress/ |

EmDash 自我定位為「**WordPress 的精神繼承者**」：保留 WordPress 的可擴充性、Admin UX、外掛生態三大成功要素，但用 TypeScript / Astro / Serverless 重建。它不繼承任何 WordPress 程式碼，但提供 WXR 匯入工具。

### 1.2 技術棧

| 層 | 技術 |
|:---|:---|
| 語言/框架 | TypeScript + Astro 6.0（必須 `output: "server"`） |
| 執行環境 | Cloudflare Workers（workerd）/ Node.js（standalone） |
| 資料庫 | Kysely（type-safe SQL）→ D1 / SQLite / libSQL(Turso) / PostgreSQL |
| 儲存 | R2 / AWS S3 / 本機 filesystem（同一 S3 抽象層） |
| 認證 | Passkey-first（WebAuthn）+ RBAC + SSO |
| 內容格式 | Portable Text（JSON 欄位） |
| Plugin Sandbox | V8 isolates via Cloudflare **Dynamic Workers**（Workers for Platforms） |
| AI 整合 | 內建 **MCP Server** + Agent Skills + EmDash CLI |
| 支付 | x402（HTTP 402，AI agent micropayment） |
| 編輯器 | TinyMCE（已被獨立評論批評為過時） |

### 1.3 應用範式（Application Paradigm）

EmDash 開啟以下應用模式：

1. **Headless / Hybrid CMS**：Astro 一個專案同時跑 SSR 前端 + Admin SPA + REST API。
2. **AI-Agent 原生站台**：每個 EmDash 實例自帶 MCP Server，讓 AI agent 直接 CRUD 內容、管理 schema、上傳媒體。
3. **x402 付費內容**：HTTP 402 Payment Required，agent 對 publisher 的微支付架構。
4. **多租戶 SaaS / 託管平台**：以 Workers for Platforms 跑「百萬租戶實例」，scale-to-zero。
5. **WordPress 替代**：WXR 匯入 + 主題安全模型升級。
6. **結構化內容發布**：Portable Text 取代 Gutenberg blocks，內容 JSON 化方便 AI 消費。

### 1.4 開發範式（Development Paradigm）

| 範式 | 說明 |
|:---|:---|
| **Database-first schema** | 欄位定義存於 `_emdash_fields` 系統表，動態建欄；不在程式碼裡寫 schema |
| **Live Content Collections** | `getEmDashCollection()` 即時讀寫，內容變更**無需 rebuild**（與 Astro 靜態 collection 對比） |
| **Type-safe everywhere** | Kysely 全鏈路型別 + `npx emdash types` 從 live schema 產生 `.emdash/types.ts` |
| **Capability-based plugin** | Plugin manifest 宣告 `capabilities: ["read:content", "email:send"]`，類 OAuth scopes |
| **Plugin 隔離模式** | Native（first-party，full host）/ Sandboxed（third-party，**僅 Cloudflare 有效**） |
| **Storage abstraction** | 同一 config 切換 sqlite/d1/turso/postgres、local/r2/s3 |
| **Astro-as-frontend** | Theme 純 Astro project，**禁止存取 DB**（消除 functions.php 風險） |
| **Signed URL uploads** | 客戶端直連 R2，繞過 Workers 25MB body limit |
| **路由注入** | `/_emdash/admin/*`（SPA）+ `/_emdash/api/*`（REST），由 emdash 套件 inject，**不 copy 進專案** |

### 1.5 Plugin Hook 系統

```ts
import { definePlugin } from "emdash";

export default () => definePlugin({
  id: "notify-on-publish",
  version: "1.0.0",
  capabilities: ["read:content", "email:send"],
  hooks: {
    "content:afterSave": async (event, ctx) => { /* ... */ }
  }
});
```

可用 hooks：`content:beforeSave / afterSave / beforeDelete / afterDelete`、`media:beforeUpload / afterUpload`、Admin UI 擴充（dashboard widgets、settings pages、custom field editors）。

### 1.6 POC 部署最短路徑（Cloudflare Workers）

```bash
# 1. 本機 scaffold（需 Node.js ≥ 22.12.0，奇數版本不支援）
npm create emdash@latest
cd my-emdash-site
npm install
npm run dev   # → http://localhost:4321/_emdash/admin（passkey 註冊）

# 2. 部署到 Cloudflare Workers
npm install -g wrangler && wrangler login
npx emdash secrets generate
wrangler secret put EMDASH_ENCRYPTION_KEY
wrangler deploy   # 自動建立 D1 + R2，首次 request 自動跑 migration
```

`wrangler.jsonc` 最小配置：

```jsonc
{
  "name": "my-emdash-site",
  "compatibility_date": "2025-01-15",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases":  [{ "binding": "DB",    "database_name": "emdash-db" }],
  "r2_buckets":    [{ "binding": "MEDIA", "bucket_name":   "emdash-media" }]
}
```

`astro.config.mjs`：

```js
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import emdash from "emdash/astro";
import { d1, r2 } from "@emdash-cms/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    emdash({
      database: d1({ binding: "DB" }),
      storage:  r2({ binding: "MEDIA" })
    })
  ]
});
```

實測（classmethod 部落格）：Dashboard 一鍵部署 `template-blog-cloudflare` **約 4 分鐘**完成，無顯著阻礙。

### 1.7 已知限制與風險

| 風險類別 | 描述 | 嚴重度 |
|:---|:---|:---:|
| 版本不穩 | v0.1.0、月發 100+ releases，breaking change 機率高 | 🔴 高 |
| 零生態 | 無 plugin / theme marketplace | 🔴 高（生產） / 🟢 低（POC） |
| SQLite/D1 上限 | 缺乏複雜關聯模型，企業級資料受限 | 🟡 中 |
| Cloudflare 鎖定 | Plugin 沙箱僅 Cloudflare 有效；Mullenweg 評「難以更換 vendor」 | 🟡 中 |
| 付費門檻 | Dynamic Workers 需 Workers Paid（$5/月起） | 🟢 低 |
| 編輯器陳舊 | 採 TinyMCE，相對 modern alternatives 是退步 | 🟢 低 |
| 治理不確定 | 純 Cloudflare 主導，社群治理未定 | 🟡 中 |
| 兩種 EmDash | Cloudflare 部署有沙箱、Node.js 部署無沙箱 → 安全保證不一致 | 🟡 中 |

---

## 二、三角論證結果

### 2.1 總協（Claude Code）意見

關注架構相容性、實作複雜度、維護成本。

- **架構相容性**：本機 `/Users/chih-hungtseng/projects/EmDash` 目前僅是空 Python venv，無相容性問題；EmDash 採 Astro + TS + Workers 為新堆疊但業界主流。
- **實作複雜度**：本機跑通 < 30 分鐘，Cloudflare 部署 < 10 分鐘，文檔完整。
- **維護成本**：POC 階段不需維護，研究完成可棄置；長期採用需面對 v0.x 演進的 breaking change。
- **知識遷移價值**：Astro + Workers + Kysely + MCP server 對團隊未來自建專案皆有遷移價值。
- **結論**：**贊成進行 POC**。

### 2.2 收集師（Perplexity）意見

關注業界趨勢、替代方案、真實案例成敗。

| 用途 | 收集師建議 | 理由 |
|:---|:---|:---|
| 生產站 | **避免** | v0.1.0 實驗性，缺特性，無穩定性保證 |
| Early Adopter / POC | **建議** | 適合概念驗證、實驗、貢獻；本機指南齊全 |
| 開發 / 測試 | **可** | HN 用戶反映非生產用途體驗良好 |

獨立評論（CMSWire）原話：「Right Architecture, Empty Ecosystem」。**結論：贊成 POC**（明確反對生產採用）。

### 2.3 分析師（Sequential Thinking）意見

關注邏輯一致性、風險評估、長期影響。

- 邏輯一致性：核心架構自洽，但「Cloudflare 部署有沙箱、Node.js 沒沙箱」形成兩種 EmDash，須在報告中明示。
- 風險可控：POC 規模成本 < $20/月，時間 < 7 天。
- 學習報酬：即使 EmDash 失敗，database-first schema、capability-based plugins、MCP-as-admin 等範式對團隊長期有價值。
- 提出三階段 POC 路徑（見 §3.2 建議方案）。
- **結論：贊成 POC**。

### 2.4 投票結果

| 角色 | 投票 |
|:---|:---:|
| 總協 | ✅ 贊成 |
| 收集師 | ✅ 贊成 |
| 分析師 | ✅ 贊成 |

**3:0 一致通過**：建議進行 EmDash POC，**範圍限定為「研究範式」而非「正式採用」**。

---

## 三、結論與建議

### 3.1 核心結論

EmDash 是一個**架構先進、生態空白**的早期 CMS。它的主要價值不在於今天能取代 WordPress，而在於它**示範了「AI-Agent 原生」、「Capability-based Plugin」、「Database-first Schema」、「Serverless Multi-tenant CMS」四個重要設計範式**。

對於以「研究 Cloudflare 開源專案的應用與開發範式」為目標的本案而言，EmDash 是**高學習報酬、低實作門檻**的理想 POC 對象。

### 3.2 建議方案（三階段 POC，遵循「先求有 → 再求好」敏捷原則）

| 階段 | 時程 | 目標 | 通過標準 | 失敗則停 |
|:---|:---|:---|:---|:---|
| **階段 1：本機驗證** | 1–2 天 | `npm create emdash@latest` 跑通本機 SQLite，理解 Admin、Live Collections、Type generation | 完成首篇文章發布、`npx emdash types` 產生 types | 否 → EmDash 太不穩定不繼續 |
| **階段 2：範式驗證** | 2–3 天 | 部署 Cloudflare Workers（D1 + R2 + secret），啟用 MCP Server，AI agent CRUD 內容 | MCP Server 從外部 client 連線成功，agent 可建立/修改 post | 否 → 仍從階段 1 取得 Astro CMS 範式價值 |
| **階段 3：深度範式** | 3–5 天 | 寫一個 sandboxed plugin（如 publish 後通知 Slack）+ 嘗試 x402 付費端點 | Plugin manifest 宣告 capability 後正常運行 / x402 endpoint 回應 | 可選 |

每階段結束務必：
- 記錄使用的 EmDash commit hash
- 截圖關鍵介面與流程
- 整理範式心得（不僅是「能跑」）

### 3.3 預期交付

- `/Users/chih-hungtseng/projects/EmDash/docs/research/`（本目錄）：
  - `EMDASH_TECHNICAL_RESEARCH_REPORT_20260506.md`（本報告）
  - 階段 1/2/3 的 `STAGE_X_POC_NOTES.md`（POC 進行時補上）
- 程式碼：建議放於 `/Users/chih-hungtseng/projects/EmDash/poc/`（非本研究階段任務）

### 3.4 禁忌

- ❌ 不直接以 EmDash 取代既有 CMS
- ❌ 不把生產資料 import 進 POC 站
- ❌ 不在 1.0 release 前承諾任何 SLA
- ❌ 不忽略「Node.js 部署無沙箱」的事實，把 plugin 安全保證直接套到非 Cloudflare 環境

---

## 四、風險與緩解措施

| 風險 | 緩解 |
|:---|:---|
| EmDash 月發 100+ releases，POC 過程版本可能跳動 | 鎖定特定 commit hash；遇 breaking change 評估是否升級或維持 |
| Cloudflare 計費意外 | POC 開發階段使用 Workers Free + D1 Free + R2 Free 額度；若需 Dynamic Workers 階段 3 才升級 Workers Paid |
| 收集師資訊有版本/授權誤差（如誤稱 Apache 2.0） | 以官方 GitHub repo / docs 為準，重要事實必查兩處以上 |
| 名稱衝突誤導 | 永遠檢查倉庫所有者為 `emdash-cms`；本報告 §0 已警示 |
| 個人 passkey 受限於設備 | POC 階段以單人帳號運行，避免多裝置 passkey 同步問題 |

---

## 五、主要參考來源

- 官方
  - https://github.com/emdash-cms/emdash
  - https://docs.emdashcms.com/getting-started
  - https://docs.emdashcms.com/deployment/cloudflare
  - https://docs.emdashcms.com/concepts/architecture
  - https://blog.cloudflare.com/emdash-wordpress/
- 獨立評論
  - https://www.cmswire.com/digital-experience/meet-emdash-the-cloudflare-cms-and-the-wordpress-spiritual-successor/
  - https://www.infoq.com/news/2026/04/cloudflare-emdash-wordpress/
  - https://www.phoronix.com/news/Cloudflare-EmDash
- 部署實測
  - https://dev.classmethod.jp/en/articles/tried-emdash-astro-based-oss-cms-by-cloudflare/
  - https://buildwithemdash.com/beginners-guide/how-to-install-emdash-locally-on-your-computer-run-it-on-localhost/
- 社群討論
  - https://news.ycombinator.com/item?id=47741527

---

## 附錄：研究流程合規性

本報告遵循 `~/.claude/skills/technical-research/SKILL.md` v1.0 的 7 步驟流程：

1. ✅ 書記官查詢既有記憶（無命中）
2. ✅ 文書官（Context7）+ 收集師（Perplexity / WebFetch / WebSearch）並行收集
3. ✅ 書記官撰寫技術文件記憶（UID: TECH-EMDASH-20260506-001）
4. ✅ 依技術文件分析優缺點與相容性
5. ✅ 三角論證投票（總協 / 收集師 / 分析師 3:0 一致通過）
6. ✅ 撰寫本報告
7. ⏳ 報告摘要記憶（生成本檔後執行）
