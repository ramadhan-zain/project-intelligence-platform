# T-020 — Db foundation tenant context rls

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** done 2026-11-21 — D-007 · **Size:** M
**Satisfies:** NFR-2, NFR-6 · **Depends on:** — · **Gated by:** —
**Files:** `packages/db/src/client.ts`, `packages/db/src/tenant.ts`, `packages/db/drizzle.config.ts`

## Goal

Drizzle is set up with migrations, an owner role for migrations and a non-owner app role, and a `withTenant(ctx, fn)` helper that runs work in a transaction with `app.org_id` / `app.user_id` set for RLS.

## Acceptance

- [x] `make db-migrate` applies migrations; app role cannot bypass RLS
- [x] A query outside `withTenant` on a tenant table returns no rows
- [x] PostgreSQL is the only store of record; Redis not used by `packages/db`
- [x] Tests: `tests/integration/db/tenant.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-21: Drizzle 0.45 + drizzle-kit 0.31; migrations in `packages/db/migrations/`, applied by `src/migrate.ts` (`make db-migrate`), which first creates/updates `pip_app` (LOGIN NOSUPERUSER NOBYPASSRLS) from `DATABASE_URL` credentials. Migration 0000: `app.current_org_id()` / `app.current_user_id()` (NULL when unset → policy matches nothing), grants and default privileges for `pip_app`.
- 2026-11-21: `createDatabase()` returns `{ sql, db, withTenant(ctx, fn) }`; context set with `set_config(…, true)` per transaction, UUIDs validated. Test uses a fixture table (real tenant tables come with T-021).
- 2026-11-21: local dev runs apps on the host (`make dev` = PostgreSQL + Redis in Docker, migrations, `pnpm dev`); `make dev-up` (full Docker) kept. `dev-env.sh` upgrades an existing `infra/.env` in place.
- 2026-11-21: decisions: migrations forward-only (OQ-036 → D-007); `make db-schema` deferred to T-021; prod migrate service noted on T-111.
- 2026-11-21: closed. lint clean, unit + contract 15 passed, integration 12 passed, trace 189/189. Follow-ups noted on T-021 (`make db-schema`) and T-111 (prod migrate service).
