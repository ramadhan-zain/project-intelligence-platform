# T-021 — Schema tenancy projects repositories

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** done 2026-11-24 · **Size:** M
**Satisfies:** FR-10.1, FR-2.10 · **Depends on:** T-020 · **Gated by:** —
**Files:** `packages/db/src/schema/tenancy.ts`, `packages/db/migrations/`

## Goal

Tables for organizations, users, organization members, projects, project members, repositories and repository integrations exist with RLS policies.

## Acceptance

- [x] Project → exactly one organization; integration → exactly one project (FK, not null)
- [x] RLS policy on each tenant table; cross-org select returns nothing
- [x] `docs/db-schema.md` regenerated
- [x] Tests: `tests/integration/db/tenancy.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-21: T-020 left `make db-schema` as a stub; implement it here (first tables). Policy pattern: header of `packages/db/migrations/0000_tenant_context.sql`.
- 2026-11-24: OQ-041 (users global, no RLS; own-membership read policies) and OQ-042 (allowed values) added as assumed. Sync mode reuses contracts `INTEGRATION_MODES` (push / pull / hybrid), so `@pip/db` now depends on `@pip/contracts`.
- 2026-11-24: children carry `organization_id` and reference `(project_id, organization_id)` composite keys, so a row cannot cross organizations; integrations are unique per (repository, adapter type). RLS policies are declared in the Drizzle schema (`pgPolicy`) so they land in the snapshot. New scripts: `pnpm db:generate` (drizzle-kit with the `source` condition, then formats the snapshot) and `pnpm db:schema` / `make db-schema` (renders `docs/db-schema.md` from the latest snapshot).
- 2026-11-24: closed. Follow-ups: T-030 fits Better Auth to `users` (OQ-041) and decides how sign-in reaches it; T-017 should reuse the role lists in `packages/db/src/schema/tenancy.ts` or move them to contracts. Unblocked T-022–T-026, T-030; T-027 was already free (T-020).
