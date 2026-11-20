# T-061 — Context caching and invalidation

**Phase:** 4 — Services / API · **Release:** R3 · **Status:** blocked (by T-060) · **Size:** M
**Satisfies:** FR-7.8, NFR-4 · **Depends on:** T-060 · **Gated by:** —
**Files:** `apps/api/src/services/context/cache.ts`

## Goal

Context responses are cached in PostgreSQL keyed by query and input record versions, and invalidated by the events that change those records.

## Acceptance

- [ ] Second identical call served from cache
- [ ] Task update invalidates affected entries only
- [ ] Cache entries never cross organizations
- [ ] Tests: `tests/integration/context/cache.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
