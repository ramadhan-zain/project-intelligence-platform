#!/bin/sh
# Claude Code PostToolUse hook (matcher: Write|Edit|MultiEdit).
# Formats and auto-fixes the file just edited. Never blocks: always exits 0.
# Edit the case table to the project's formatters; drop rows the stack does not use.
f=$(python3 -I -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("file_path",""))')
[ -f "$f" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

case "$f" in
  *.py)
    # Only tools/*.py (stdlib scripts); uses ruff if installed globally.
    command -v ruff >/dev/null 2>&1 && {
      ruff format --quiet "$f" >/dev/null 2>&1
      ruff check --fix --quiet "$f" >/dev/null 2>&1
    } ;;
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.css|*.scss|*.json|*.jsonc)
    if [ -x node_modules/.bin/biome ]; then node_modules/.bin/biome check --write "$f" >/dev/null 2>&1
    elif [ -x node_modules/.bin/prettier ]; then node_modules/.bin/prettier --write --log-level silent "$f"
    fi ;;
esac
exit 0
