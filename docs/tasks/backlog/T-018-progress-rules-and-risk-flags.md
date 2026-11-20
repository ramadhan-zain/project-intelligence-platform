# T-018 — Progress rules and risk flags

**Phase:** 2 — Domain · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** FR-6.7, BR-016, BR-008, AC-13 · **Depends on:** — · **Gated by:** —
**Files:** `packages/domain/src/progress.ts`, `packages/domain/src/risks.ts`

## Goal

Progress figures and delivery-risk flags are pure, configurable rules that return the figure plus an explanation of rule and inputs, and never use commit counts or lines of code.

## Acceptance

- [ ] Default rule (OQ-006) and priority-weighted rule implemented; output includes `rule`, `inputs`, `value`
- [ ] Risk flags from OQ-014 with per-project thresholds
- [ ] No function accepts commit counts or line counts as input (BR-008)
- [ ] Tests: `tests/unit/domain/progress.test.ts`, `tests/unit/domain/risks.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
