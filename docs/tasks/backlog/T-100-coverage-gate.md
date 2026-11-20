# T-100 — Coverage gate

**Phase:** 9 — Testing · **Release:** R1 · **Status:** ready · **Size:** S
**Satisfies:** NFR-15 · **Depends on:** — · **Gated by:** —
**Files:** `vitest.config.ts`, `.github/workflows/ci.yml`

## Goal

CI fails when line coverage over `packages/contracts` and `packages/domain` drops under 80 % (OQ-032).

## Acceptance

- [ ] Threshold configured in `vitest.config.ts` and enforced by `make test` in CI
- [ ] Lowering it requires a D-number
- [ ] Tests: CI `check` job

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: bootstrap configured the 80 % thresholds in `vitest.config.ts` and runs them in CI `check`; remaining: confirm the gate fails a PR that drops coverage.
