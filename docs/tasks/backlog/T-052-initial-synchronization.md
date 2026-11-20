# T-052 — Initial synchronization

**Phase:** 6 — Workers / background · **Release:** R2 · **Status:** blocked (by T-046, T-047, T-048) · **Size:** M
**Satisfies:** FR-3.15, FR-3.7 · **Depends on:** T-046, T-047, T-048 · **Gated by:** —
**Files:** `apps/worker/src/sync/initial.ts`

## Goal

Connecting a repository runs an initial pull sync at the default branch head: discover sources, read tasks, documents and decisions, import recent commits and open PRs.

## Acceptance

- [ ] Fixture repo connected via mock → tasks, docs, decisions present; status `synchronized`
- [ ] Initial sync is idempotent (second run changes nothing)
- [ ] Tests: `tests/integration/worker/initial-sync.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
