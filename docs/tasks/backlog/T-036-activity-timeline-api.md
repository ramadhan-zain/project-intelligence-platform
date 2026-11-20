# T-036 — Activity timeline api

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-024) · **Size:** S
**Satisfies:** FR-1.8 · **Depends on:** T-024 · **Gated by:** —
**Files:** `apps/api/src/routes/activity.ts`

## Goal

A project's activity timeline is served newest first with cursor pagination and filters by repository, entity type and date range.

## Acceptance

- [ ] Filters and cursor verified on seeded events
- [ ] Only events the caller may see are returned
- [ ] Tests: `tests/integration/api/activity.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
