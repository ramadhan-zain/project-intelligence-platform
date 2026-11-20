# T-032 — Projects and project members api

**Phase:** 4 — Services / API · **Release:** R1 · **Status:** blocked (by T-030, T-017) · **Size:** M
**Satisfies:** FR-1.3, FR-1.4, FR-1.5 · **Depends on:** T-030, T-017 · **Gated by:** —
**Files:** `apps/api/src/routes/projects.ts`

## Goal

Projects and project members are managed through the API, with permission checks from the domain evaluator on every route.

## Acceptance

- [ ] Project fields of FR-1.3 validated by contracts schemas
- [ ] Every route calls the permission evaluator; matrix spot-checked in tests
- [ ] Member role changes audited
- [ ] Tests: `tests/integration/api/projects.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
