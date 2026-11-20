# T-004 — Confirm nfr targets and retention

**Phase:** 0 — Unblock · **Release:** — · **Status:** open · **Size:** S
**Satisfies:** NFR-13, NFR-14 · **Depends on:** — · **Gated by:** OQ-003, OQ-023
**Files:** `docs/fsd/open-questions.md`, `docs/fsd/decisions.md`

## Goal

Performance, availability, scale and retention targets are confirmed or changed by the product owner, so load tests (T-104), backup (T-114) and the retention job (T-056) have fixed numbers.

## Acceptance

- [ ] OQ-003 decided with numbers (throughput, latency, availability, RPO / RTO)
- [ ] OQ-023 decided with retention periods per data kind
- [ ] NFR-13 and NFR-14 in the dev spec cite the D-numbers
- [ ] Tests: none (decision task)

## Notes

- 2026-11-20: created by bootstrap.
