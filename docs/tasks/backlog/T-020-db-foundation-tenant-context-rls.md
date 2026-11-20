# T-020 — Db foundation tenant context rls

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** NFR-2, NFR-6 · **Depends on:** — · **Gated by:** —
**Files:** `packages/db/src/client.ts`, `packages/db/src/tenant.ts`, `packages/db/drizzle.config.ts`

## Goal

Drizzle is set up with migrations, an owner role for migrations and a non-owner app role, and a `withTenant(ctx, fn)` helper that runs work in a transaction with `app.org_id` / `app.user_id` set for RLS.

## Acceptance

- [ ] `make db-migrate` applies migrations; app role cannot bypass RLS
- [ ] A query outside `withTenant` on a tenant table returns no rows
- [ ] PostgreSQL is the only store of record; Redis not used by `packages/db`
- [ ] Tests: `tests/integration/db/tenant.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
