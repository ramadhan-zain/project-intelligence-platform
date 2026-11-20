#!/bin/sh
# Claude Code PreToolUse hook (matcher: Bash|Write|Edit|MultiEdit).
# Refuses a command or file write that carries an AI attribution line. Exit 2 = blocked;
# the stderr message goes back to Claude. Rule *text* such as `no "Generated with Claude Code"
# footer` in CLAUDE.md is allowed: only the real trailer / footer shapes are matched.
exec python3 -I -c '
import json, re, sys
inp = json.load(sys.stdin).get("tool_input", {})
parts = [inp.get("command", ""), inp.get("content", ""), inp.get("new_string", "")]
parts += [e.get("new_string", "") for e in inp.get("edits", []) or []]
text = "\n".join(p for p in parts if isinstance(p, str))
pattern = re.compile(
    r"^\s*Co-Authored-By:\s*Claude\b.*<[^>]*@anthropic\.com>"   # commit trailer
    r"|^\s*Claude-Session:\s*\S+"                                 # session link trailer
    r"|Generated with \[Claude Code\]\("                          # PR footer link
    r"|\U0001F916 Generated with",                                # robot-emoji footer
    re.IGNORECASE | re.MULTILINE,
)
if pattern.search(text):
    sys.stderr.write(
        "Blocked by project rule: no AI attribution (Co-Authored-By Claude trailer, "
        "Claude-Session link, Generated-with-Claude-Code footer). Remove it and retry.\n"
    )
    sys.exit(2)
'
