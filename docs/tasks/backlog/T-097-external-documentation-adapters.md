# T-097 — External documentation adapters

**Phase:** 5 — Integrations · **Release:** R5 · **Status:** blocked (by T-051) · **Size:** L
**Satisfies:** FR-11.7, FR-11.1 · **Depends on:** T-051 · **Gated by:** —
**Files:** `apps/worker/src/adapters/notion/`

## Goal

External documentation services (Notion first) are documentation sources through adapters, stored as canonical documents with source references.

## Acceptance

- [ ] Notion page imported with category and source URL
- [ ] Updates create new versions
- [ ] Tests: `tests/integration/adapters/notion.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
