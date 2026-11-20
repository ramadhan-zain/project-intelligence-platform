# T-112 — Health endpoint

**Phase:** 10 — Deployment · **Release:** R1 · **Status:** ready · **Size:** S
**Satisfies:** infra · **Depends on:** — · **Gated by:** —
**Files:** `apps/api/src/routes/health.ts`

## Goal

`GET /health` returns per-dependency status (PostgreSQL, Redis) cached for a few seconds and the release version in `X-Release-Version`.

## Acceptance

- [ ] Dependency down → `503` with that dependency marked `down`
- [ ] Version header equals the root `package.json` version
- [ ] Tests: `tests/integration/api/health.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: bootstrap delivered `/health` with cached per-dependency status, 503 on failure and `X-Release-Version`; remaining: verify version header in the prod image.
