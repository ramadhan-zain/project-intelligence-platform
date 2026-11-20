# T-017 — Permission evaluation

**Phase:** 2 — Domain · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** FR-1.5, FR-10.2, FR-10.4, BR-014, BR-015 · **Depends on:** — · **Gated by:** —
**Files:** `packages/domain/src/permissions.ts`, `docs/ARCHITECTURE.md`

## Goal

A pure permission evaluator answers `can(actor, action, resource)` from organization roles, project roles and project shares, matching the matrix in `ARCHITECTURE.md` §6.

## Acceptance

- [ ] Every cell of the matrix covered by a table-driven test
- [ ] Shared-org (client) members see only what the share grants; internal activity and private docs denied (BR-014)
- [ ] A share never grants anything outside its project (BR-015)
- [ ] Tests: `tests/unit/domain/permissions.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
