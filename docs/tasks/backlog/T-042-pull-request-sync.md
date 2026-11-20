# T-042 — Pull request sync

**Phase:** 5 — Integrations · **Release:** R2 · **Status:** blocked (by T-040, T-025, T-051) · **Size:** M
**Satisfies:** FR-4.5 · **Depends on:** T-040, T-025, T-051 · **Gated by:** —
**Files:** `apps/worker/src/processors/git-pull-request.ts`

## Goal

Pull request events keep PR records and their status history current: opened, updated, approved, changes requested, merged, closed.

## Acceptance

- [ ] Fixture sequence yields correct final status and full history
- [ ] Out-of-order delivery resolved by GitHub `updated_at` / action order, not arrival time
- [ ] Tests: `tests/integration/github/pull-requests.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
