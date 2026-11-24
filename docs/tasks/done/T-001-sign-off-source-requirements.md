# T-001 — Sign off source requirements

**Phase:** 0 — Unblock · **Release:** — · **Status:** done 2026-11-24 — D-008 · **Size:** S
**Satisfies:** tooling · **Depends on:** — · **Gated by:** OQ-001
**Files:** `docs/PIP-dev-spec.md`, `docs/fsd/open-questions.md`

## Goal

The product owner has reviewed `PIP-dev-spec.md` against `source/requirements.md` and signed it off. From then on, requirement changes go through D-numbers.

## Acceptance

- [x] Product owner confirms every source section has IDs in the dev spec, or lists the gaps
- [x] OQ-001 set to `decided — D-nnn` with the sign-off date
- [x] Source document status line noted as signed off in `docs/PROJECT.md`
- [x] Tests: none (review task)

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-24: coverage review. Every source section with requirements has IDs; §16 → AC-1–AC-30 one-to-one;
  §17.1 items 1–10 and §17.2 all mapped. Gaps recorded as OQ-037–OQ-040 (assumed); §1.2, §1.3, §3.1, §19
  noted as context. PO signed off (D-008); dev spec → v1.2. D-007 row added to the decision index (was missing).
- 2026-11-24: closed. Checks: lint pass, unit 15/15 (4 files), trace 189/189. No CHANGELOG line (docs only, not user-visible). No follow-up tasks: OQ-037–OQ-040 are picked up by the R4/R5 tasks that touch approvals, MCP tools, releases and providers.
