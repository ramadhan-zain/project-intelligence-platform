# T-107 — Architecture constraint checks

**Phase:** 9 — Testing · **Release:** R1 · **Status:** ready · **Size:** S
**Satisfies:** NFR-11, BR-001 · **Depends on:** — · **Gated by:** —
**Files:** `.dependency-cruiser.cjs`

## Goal

Automated dependency rules keep provider code behind adapters, keep the core free of repository-structure assumptions, and keep `apps/web` from importing `packages/db`.

## Acceptance

- [ ] Rules: `apps/*` may not import provider SDKs outside `providers/` / `adapters/`; `apps/web` may not import `packages/db`
- [ ] Rule violations fail `make lint`
- [ ] Tests: `make lint` in CI

## Notes

- 2026-11-20: created by bootstrap.
