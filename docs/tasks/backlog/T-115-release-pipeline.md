# T-115 — Release pipeline

**Phase:** 10 — Deployment · **Release:** R1 · **Status:** blocked (by T-110, T-002) · **Size:** S
**Satisfies:** infra · **Depends on:** T-110, T-002 · **Gated by:** —
**Files:** `.github/workflows/release.yml`, `tools/bump-version.mjs`

## Goal

Tagging `vX.Y.Z` builds and pushes all images tagged `vX.Y.Z` and `latest`; a bump script updates `version` in every manifest listed in `CLAUDE.md`.

## Acceptance

- [ ] `node tools/bump-version.mjs 0.2.0` updates every manifest
- [ ] Tag push produces images with both tags
- [ ] Tests: release workflow run

## Notes

- 2026-11-20: created by bootstrap.
