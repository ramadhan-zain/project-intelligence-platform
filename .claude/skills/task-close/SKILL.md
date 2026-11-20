---

name: task-close
description: Close an active task — verify every Acceptance box is ticked, run lint, tests and the traceability check, record notes and decisions, move it to done, and print a commit message and PR body with no AI attribution. Trigger: /task-close [T-nnn], "close T-nnn", "finish the task", "task done".
---

# /task-close [T-nnn]

Never runs git. Commit, push and PR are the user's.

1. **Find the task.** `docs/tasks/active/T-nnn-*.md`. No argument and exactly one active task → that one;
   otherwise ask.
2. **Acceptance.** Every box under `## Acceptance` must be `- [x]`, and each must be true in the code and
   tests, not just ticked. Any `- [ ]` → list them and stop. Do not tick a box you have not verified.
3. **Checks.** Run, and report pass/fail with counts:
   - the project's lint and test commands (`make lint`, `make test`, or what `CLAUDE.md` names);
   - integration tests if the task touched I/O, persistence, queues or integrations;
   - `python3 tools/trace.py --write` (the traceability table must stay green).
     Any failure → stop and report it; do not move the task.
4. **Record.**
   - Add a dated line under `## Notes`: what was built, choices made, follow-ups.
   - A choice that settles an open question → new D-nnn row and section in `docs/fsd/decisions.md`,
     point the OQ row at it, bump the contract doc's version line if a contract changed.
   - Follow-up work → new backlog task(s) with `**Satisfies:**` lines.
   - User-visible change → a line under `## [Unreleased]` in `CHANGELOG.md` (with the T-number).
5. **Move it.** Set `**Status:** done <YYYY-MM-DD>` (append `— D-nnn` if one was made),
   `mv docs/tasks/active/T-nnn-*.md docs/tasks/done/`, update the row in `docs/tasks/README.md`.
6. **Hand off** under **Run yourself**:
   - Commit message: `<Area>: <outcome in plain words> (T-nnn, D-nnn)`.
   - PR body from `.github/pull_request_template.md`, filled in, with the real test counts.
   - No `Co-Authored-By: Claude` trailer, no session link, no generated-by footer.
