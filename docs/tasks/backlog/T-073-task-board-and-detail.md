# T-073 — Task board and detail

**Phase:** 8 — UI · **Release:** R1 · **Status:** blocked (by T-070, T-034, T-043) · **Size:** L
**Satisfies:** FR-5.2, FR-4.7, AC-9, AC-10, AC-20 · **Depends on:** T-070, T-034, T-043 · **Gated by:** —
**Files:** `apps/web/src/app/(project)/tasks/`

## Goal

A cross-repository task board and task detail show canonical and original status, source, links to PRs / commits, history, comments, dependencies and blocked state, and allow manual linking — usable without Git access.

## Acceptance

- [ ] Board filters by repository, status, assignee, label; blocked tasks highlighted and filterable
- [ ] Source-owned fields read-only with the reason shown
- [ ] A PM account with no GitHub access can use every screen
- [ ] Tests: `tests/e2e/tasks.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
