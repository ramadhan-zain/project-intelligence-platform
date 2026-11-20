# T-033 — Repository registration api

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-032) · **Size:** S
**Satisfies:** FR-1.6, FR-1.7 · **Depends on:** T-032 · **Gated by:** —
**Files:** `apps/api/src/routes/repositories.ts`

## Goal

Several repositories can be registered to one project with provider, external id, URL and default branch; integration status and last sync are read-only to clients.

## Acceptance

- [ ] Two repositories with different providers / structures on one project
- [ ] Duplicate registration of the same external repository refused
- [ ] Tests: `tests/integration/api/repositories.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
