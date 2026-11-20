# T-021 — Schema tenancy projects repositories

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** blocked (by T-020) · **Size:** M
**Satisfies:** FR-10.1, FR-2.10 · **Depends on:** T-020 · **Gated by:** —
**Files:** `packages/db/src/schema/tenancy.ts`, `packages/db/migrations/`

## Goal

Tables for organizations, users, organization members, projects, project members, repositories and repository integrations exist with RLS policies.

## Acceptance

- [ ] Project → exactly one organization; integration → exactly one project (FK, not null)
- [ ] RLS policy on each tenant table; cross-org select returns nothing
- [ ] `docs/db-schema.md` regenerated
- [ ] Tests: `tests/integration/db/tenancy.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
