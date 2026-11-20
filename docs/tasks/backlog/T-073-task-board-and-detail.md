# T-073 — Task board and detail

**Phase:** 8 — UI · **Release:** R1 · **Status:** blocked (by T-070, T-034, T-043) · **Size:** L
**Satisfies:** FR-5.2, FR-5.12, FR-4.7, AC-9, AC-10, AC-20 · **Depends on:** T-070, T-034, T-043 · **Gated by:** —
**Files:** `apps/web/src/app/(project)/tasks/`

## Goal

A cross-repository task board (list view and Kanban view, D-006) and task detail show canonical and original status, source, links to PRs / commits, history, comments, dependencies and blocked state, and allow manual linking — usable without Git access.

## Acceptance

- [ ] Board filters by repository, status, assignee, label; blocked tasks highlighted and filterable
- [ ] Source-owned fields read-only with the reason shown
- [ ] List / Kanban toggle; Kanban has one column per canonical status and keeps the board filters
- [ ] Dragging a platform-owned task to another column updates its status (SSE refreshes other viewers); a source-owned card cannot be dragged and shows why
- [ ] A PM account with no GitHub access can use every screen
- [ ] Tests: `tests/e2e/tasks.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: Kanban view added (D-006, FR-5.12).
