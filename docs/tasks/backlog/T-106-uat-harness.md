# T-106 — Uat harness

**Phase:** 9 — Testing · **Release:** R3 · **Status:** blocked (by T-102) · **Size:** M
**Satisfies:** tooling · **Depends on:** T-102 · **Gated by:** —
**Files:** `docs/uat/UAT.md`, `tools/seed/`

## Goal

A seed script builds the UAT data set (two orgs, shared project, two repos) and `UAT.md` has filled setup, steps and expected results for every AC.

## Acceptance

- [ ] `make uat-seed` produces the data set on a fresh stack
- [ ] Every AC section in `UAT.md` complete (no `<…>`)
- [ ] Tests: manual UAT run recorded in `UAT.md`

## Notes

- 2026-11-20: created by bootstrap.
