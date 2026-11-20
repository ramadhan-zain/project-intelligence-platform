# T-041 — Commit and branch sync

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-040, T-025, T-051) · **Size:** M
**Satisfies:** FR-4.3, FR-4.4, FR-4.8 · **Depends on:** T-040, T-025, T-051 · **Gated by:** —
**Files:** `apps/worker/src/processors/git-push.ts`

## Goal

Push and branch-create events create commits (with changed files) and branches, and trigger incremental sync when task or doc sources changed.

## Acceptance

- [ ] Push fixture → commits and files stored once, even on redelivery
- [ ] Push touching `BACKLOG.md` enqueues an incremental task sync
- [ ] Tests: `tests/integration/github/push.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
