# T-110 — Service dockerfiles

**Phase:** 10 — Deployment · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** NFR-12 · **Depends on:** — · **Gated by:** —
**Files:** `apps/*/Dockerfile`, `.dockerignore`

## Goal

Each service has a multi-stage, non-root Dockerfile with a healthcheck, built from the pnpm workspace with only its production dependencies.

## Acceptance

- [ ] Images build in CI; final images run as non-root
- [ ] HEALTHCHECK passes in compose
- [ ] Tests: CI image build job

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: bootstrap delivered working multi-stage, non-root Dockerfiles with healthchecks for all four services; remaining: slimmer images, CI image build job.
