# T-090 — Llm provider and ai summaries

**Phase:** 6 — Workers / background · **Release:** R5 · **Status:** gated (by OQ-019) · **Size:** L
**Satisfies:** FR-7.5, FR-7.6, FR-7.7, NFR-4, NFR-5, BR-013, AC-17 · **Depends on:** T-061 · **Gated by:** OQ-019
**Files:** `packages/llm/`, `apps/worker/src/jobs/summaries.ts`

## Goal

A provider-independent LLM interface produces cached, incrementally updated summaries with full provenance, stored as derived data that never overwrites authoritative records.

## Acceptance

- [ ] Summary row records model, provider, time, input versions, source refs, status
- [ ] Input change invalidates and regenerates only affected summaries
- [ ] Feature off by default per organization; sync paths unaffected when provider is down
- [ ] Tests: `tests/integration/worker/summaries.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
