# T-056 — Retention job

**Phase:** 6 — Workers / background · **Release:** R2 · **Status:** blocked (by T-050) · **Size:** S
**Satisfies:** NFR-14 · **Depends on:** T-050 · **Gated by:** —
**Files:** `apps/worker/src/jobs/retention.ts`

## Goal

A daily job applies the retention periods of OQ-023: drops raw payloads after the period (metadata kept) and prunes audit rows past their period.

## Acceptance

- [ ] Periods read from configuration, defaults from OQ-023
- [ ] Job logs counts; dry-run mode available
- [ ] Tests: `tests/integration/worker/retention.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
