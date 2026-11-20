#!/bin/sh
# Claude Code Stop hook. Shows the user a reminder (never blocks) when:
#   * a task in docs/tasks/active/ has every Acceptance box ticked -> time for /task-close;
#   * docs/tasks/active/ holds more than two tasks.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
d=docs/tasks/active
[ -d "$d" ] || exit 0

ready=""
n=0
for t in "$d"/T-*.md; do
  [ -f "$t" ] || continue
  n=$((n + 1))
  # Only the Acceptance section counts: from "## Acceptance" to the next "## ".
  acc=$(awk '/^## Acceptance/{on=1; next} /^## /{on=0} on' "$t")
  if printf '%s\n' "$acc" | grep -q '^- \[x\]' && ! printf '%s\n' "$acc" | grep -q '^- \[ \]'; then
    ready="$ready $(basename "$t" .md | cut -d- -f1,2)"
  fi
done

msg=""
[ -n "$ready" ] && msg="All Acceptance boxes ticked:$ready. Run /task-close."
[ "$n" -gt 2 ] && msg="${msg:+$msg }$n tasks in docs/tasks/active/ (keep to 1-2)."
[ -n "$msg" ] && printf '{"systemMessage": "%s"}\n' "$msg"
exit 0
