# T-113 — Deployment runbook verified

**Phase:** 10 — Deployment · **Release:** R1 · **Status:** blocked (by T-111, T-114) · **Size:** M
**Satisfies:** infra · **Depends on:** T-111, T-114 · **Gated by:** —
**Files:** `docs/DEPLOYMENT.md`, `docs/OPERATIONS.md`

## Goal

`DEPLOYMENT.md` and `OPERATIONS.md` are complete, and a clean machine reaches a healthy stack by following `DEPLOYMENT.md` alone.

## Acceptance

- [ ] Dry run on a fresh VM recorded with date and version
- [ ] Each OPERATIONS section tried at least once on staging
- [ ] Tests: manual, recorded in task Notes

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: bootstrap wrote first versions of `DEPLOYMENT.md` and `OPERATIONS.md`; remaining: clean-VM verification.
