# T-105 — Fault injection

**Phase:** 9 — Testing · **Release:** R2 · **Status:** blocked (by T-055) · **Size:** M
**Satisfies:** AC-7 · **Depends on:** T-055 · **Gated by:** —
**Files:** `tests/integration/faults/`

## Goal

Fault-injection tests stop Redis, PostgreSQL, the worker and the GitHub mock mid-sync and prove recovery without loss or duplication.

## Acceptance

- [ ] Each fault scenario ends with the same records as a fault-free run
- [ ] Tests: `tests/integration/faults/*.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
