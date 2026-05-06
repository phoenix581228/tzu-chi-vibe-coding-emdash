#!/usr/bin/env bash
# 慈濟大學 Vibe Coding × EmDash 環境檢查腳本
# Tzu Chi University Vibe Coding × EmDash environment-check script
#
# Usage: bash quickstart.sh

set -e

c_red()   { printf '\033[31m%s\033[0m' "$*"; }
c_green() { printf '\033[32m%s\033[0m' "$*"; }
c_yellow(){ printf '\033[33m%s\033[0m' "$*"; }
c_blue()  { printf '\033[34m%s\033[0m' "$*"; }

ok=0
warn=0
fail=0

check() {
  local name=$1; shift
  local cmd=$*
  printf "  %-30s " "$name"
  if eval "$cmd" >/dev/null 2>&1; then
    c_green "✓"; printf "\n"
    ok=$((ok+1))
  else
    c_red "✗"; printf "\n"
    fail=$((fail+1))
  fi
}

check_version() {
  local name=$1
  local cmd=$2
  local min=$3
  printf "  %-30s " "$name"
  local ver
  ver=$(eval "$cmd" 2>/dev/null | head -1 || true)
  if [[ -z "$ver" ]]; then
    c_red "✗"; printf "  (not installed)\n"
    fail=$((fail+1))
    return
  fi
  printf "%s" "$ver"
  if [[ -n "$min" ]]; then
    printf "  (min %s)" "$min"
  fi
  printf "  "
  c_green "✓"
  printf "\n"
  ok=$((ok+1))
}

echo
c_blue "═══════════════════════════════════════════════════"; echo
c_blue "  慈濟大學 Vibe Coding × EmDash 環境檢查"; echo
c_blue "  Tzu Chi University Vibe Coding × EmDash"; echo
c_blue "═══════════════════════════════════════════════════"; echo
echo

echo "[1/4] 必要工具 / Required tools"
check_version "Node.js (≥ 22.12.0)" "node -v" "v22.12"
check_version "npm" "npm -v" ""
check_version "git" "git --version" ""
check_version "sqlite3" "sqlite3 --version | awk '{print \$1}'" ""

echo
echo "[2/4] 推薦工具 / Recommended"
if ! command -v pnpm >/dev/null 2>&1; then
  printf "  %-30s " "pnpm"
  c_yellow "!"; printf "  (not installed; will activate via corepack)\n"
  warn=$((warn+1))
  echo "    → run:  corepack enable && corepack prepare pnpm@10.28.0 --activate"
else
  check_version "pnpm (≥ 10.28)" "pnpm -v" "10.28"
fi

if ! command -v claude >/dev/null 2>&1; then
  printf "  %-30s " "Claude Code CLI"
  c_yellow "!"; printf "  (not on PATH)\n"
  warn=$((warn+1))
  echo "    → install: https://docs.anthropic.com/en/docs/claude-code"
else
  check_version "Claude Code CLI" "claude --version" ""
fi

echo
echo "[3/4] 網路 / Network"
check "github.com 連線"   "curl -fsS -m 5 https://github.com/ -o /dev/null"
check "npm registry"      "curl -fsS -m 5 https://registry.npmjs.org/ -o /dev/null"

echo
echo "[4/4] 連接埠 / Ports"
if lsof -i :4321 >/dev/null 2>&1; then
  printf "  %-30s " "port 4321 (Astro)"
  c_yellow "!"; printf "  (in use)\n"
  warn=$((warn+1))
  echo "    → kill:  kill \$(lsof -ti :4321)"
else
  printf "  %-30s " "port 4321 (Astro)"
  c_green "✓"; printf "  (available)\n"
  ok=$((ok+1))
fi

echo
c_blue "───────────────────────────────────────────────────"; echo
printf "  通過 / OK: %s   警告 / Warn: %s   失敗 / Fail: %s\n" \
  "$(c_green $ok)" "$(c_yellow $warn)" "$(c_red $fail)"
c_blue "───────────────────────────────────────────────────"; echo
echo

if [[ $fail -gt 0 ]]; then
  c_red "請先解決失敗項目再繼續 / Please resolve failures before continuing."; echo
  exit 1
fi

if [[ $warn -gt 0 ]]; then
  c_yellow "有警告但可繼續 / Warnings present but you may proceed."; echo
else
  c_green "全部通過！可以開始 / All checks passed. You're ready."; echo
fi

cat <<'EOF'

下一步 / Next steps:

  1. 開啟 Claude Code / Launch Claude Code
       claude

  2. 在 Claude Code 中輸入 / In the Claude Code prompt:
       請載入 tzu-chi-vibe-coding-emdash skill 開始第 1 階段
       Please load the tzu-chi-vibe-coding-emdash skill and start stage 1

EOF
