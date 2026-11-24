# T-023 — Schema documents decisions

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** FR-2.4, FR-2.5, FR-11.4 · **Depends on:** T-021 · **Gated by:** —
**Files:** `packages/db/src/schema/documents.ts`

## Goal

Project documents with version history, visibility and source references, technical decisions, and document links are stored.

## Acceptance

- [ ] Every content change creates a `document_versions` row with author / source and commit
- [ ] Generated documents flagged `origin = generated` at column level
- [ ] Decisions keep source reference and author
- [ ] Tests: `tests/integration/db/documents.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
