# T-091 — Semantic search

**Phase:** 4 — Services / API · **Release:** R5 · **Status:** blocked (by T-090) · **Size:** L
**Satisfies:** FR-7.9, BR-018 · **Depends on:** T-090 · **Gated by:** —
**Files:** `apps/api/src/services/search/`

## Goal

Semantic search over project content is added only after a written evaluation shows structured retrieval is insufficient for named queries.

## Acceptance

- [ ] Evaluation note with failing structured queries recorded as a D-number before any vector work
- [ ] Search respects permissions like every other retrieval
- [ ] Tests: `tests/integration/context/search.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
