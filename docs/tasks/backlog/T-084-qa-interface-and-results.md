# T-084 — Qa interface and results

**Phase:** 8 — UI · **Release:** R4 · **Status:** blocked (by T-080, T-026) · **Size:** L
**Satisfies:** FR-6.4, FR-2.8, AC-22 · **Depends on:** T-080, T-026 · **Gated by:** —
**Files:** `apps/web/src/app/(project)/qa/`, `apps/api/src/routes/qa-results.ts`

## Goal

QA sees tasks ready for testing with acceptance criteria and PR references, records results, files bugs (OQ-013) and tracks regressions.

## Acceptance

- [ ] QA result recorded against task and requirement, visible in traceability
- [ ] Bug created as task `type = bug` linked to the failing result
- [ ] Tests: `tests/e2e/qa.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
