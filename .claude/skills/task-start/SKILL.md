---

name: task-start
description: Start a task from docs/tasks/backlog — check it is ready, move it to active, load only the spec sections and code it cites, and propose a branch name and plan. Trigger: /task-start T-nnn, "start T-nnn", "pick up task T-nnn", "next task".
---

# /task-start [T-nnn]

Never runs git. Branch creation is the user's.

1. **Find the task.** `docs/tasks/backlog/T-nnn-*.md`. No argument → list `ready` tasks from
   `docs/tasks/README.md` (lowest phase first) and ask which one.
2. **Check it can start.** Read the `**Status:**` line.
   - `ready` → continue.
   - `blocked` → name the blocking T-nnn and its folder; stop unless the user says go.
   - `gated` / `open` → name the OQ-nnn and its state in `docs/fsd/open-questions.md`; stop unless the user says go.
   - `docs/tasks/active/` already holds two tasks → say so and ask before adding a third.
3. **Move it.** `mv docs/tasks/backlog/T-nnn-*.md docs/tasks/active/` (plain `mv`, no git). Set the status
   line to `**Status:** active <YYYY-MM-DD>`. Update the task's row in `docs/tasks/README.md` the same way.
4. **Load only what it cites.**
   - For each ID on `**Satisfies:**`, grep the dev spec for `**<ID>**` and read that section only.
   - Read each OQ / D it names in `docs/fsd/`.
   - Read the files on `**Files:**`; find related code with graphify (or the cavecrew-investigator agent),
     not by reading whole folders.
   - Unfamiliar domain words → `docs/GLOSSARY.md`.
5. **Report, then wait:**
   - Suggested branch, under **Run yourself**: `git switch -c feat/t-nnn-<slug>`.
   - Plan: one line per Acceptance box, with the file(s) and the test layer that proves it.
   - Anything unclear in the spec → propose a new OQ row instead of guessing.
