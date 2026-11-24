# Changelog

All notable changes to this project are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
**One version for the whole repository** (D-003): every manifest carries the same `version`, released as
git tag `vX.Y.Z`. A version bump and its changelog entry land in the same pull request.

## [Unreleased]

### Added

- **Bootstrap:** requirements spec with 187 traced IDs, open questions and decisions registers, architecture
  and contract drafts, 99 tasks across all phases, pnpm TypeScript monorepo skeleton (web, api, worker, mcp,
  contracts, domain, db), dev / test / prod Compose stacks, CI, guard tests, runbooks.
- **Database foundation:** Drizzle migrations (`make db-migrate`), non-owner app role `pip_app` without
  BYPASSRLS, `withTenant(ctx, fn)` setting `app.org_id` / `app.user_id` per transaction for RLS [T-020].
- `make dev`: PostgreSQL and Redis in Docker, apps on the host with watch [T-020].
- **Tenancy schema:** organizations, users, organization and project members, projects, repositories and
  repository integrations; RLS on every tenant table, composite keys keep children inside their organization,
  users see their own memberships across organizations (OQ-041) [T-021].
- `make db-schema` renders `docs/db-schema.md` from the latest migration snapshot; `pnpm db:generate` creates
  migrations [T-021].

### Deployment

- First deployment: follow `docs/DEPLOYMENT.md` from step 0.
- Apps now connect as `pip_app`; set `APP_DB_PASSWORD` and run migrations before starting them. Local:
  `make dev-env` adds the new keys to an existing `infra/.env` [T-020].
- Migrations are forward-only: roll back by restoring the pre-deploy backup (D-007) [T-020].
- New migration `0001_tenancy`: run `make db-migrate` before starting the apps [T-021].

[Unreleased]: https://github.com/ramadhan-zain/project-intelligence-platform/commits/main
