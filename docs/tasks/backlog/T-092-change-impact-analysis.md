# T-092 — Change impact analysis

**Phase:** 6 — Workers / background · **Release:** R5 · **Status:** blocked (by T-081, T-090) · **Size:** L
**Satisfies:** FR-7.10 · **Depends on:** T-081, T-090 · **Gated by:** —
**Files:** `apps/worker/src/jobs/impact.ts`

## Goal

For a requirement change, the platform lists affected tasks, documents, tests and deliverables from the link graph, with optional LLM hints marked as generated.

## Acceptance

- [ ] Deterministic graph result always available; LLM hints optional and badged
- [ ] Tests: `tests/integration/worker/impact.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
