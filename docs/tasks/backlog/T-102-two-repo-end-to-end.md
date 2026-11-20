# T-102 — Two repo end to end

**Phase:** 9 — Testing · **Release:** R2 · **Status:** blocked (by T-052, T-006) · **Size:** M
**Satisfies:** FR-1.7, AC-1, AC-2 · **Depends on:** T-052, T-006 · **Gated by:** —
**Files:** `tests/integration/e2e/two-repos.test.ts`

## Goal

End-to-end through the mock: connect `repo-a` and `repo-b` to one project, sync, and see both repositories' tasks and documents in canonical form.

## Acceptance

- [ ] Both repos synchronized into one project with their own conventions
- [ ] Task board query returns tasks from both with correct canonical statuses
- [ ] Tests: `tests/integration/e2e/two-repos.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
