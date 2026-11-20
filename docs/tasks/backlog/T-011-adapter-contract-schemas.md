# T-011 — Adapter contract schemas

**Phase:** 1 — Contracts · **Release:** R2 · **Status:** ready · **Size:** M
**Satisfies:** FR-3.1, FR-3.2, FR-3.3, FR-3.4, FR-3.5, FR-3.9, FR-3.11, FR-3.12 · **Depends on:** — · **Gated by:** —
**Files:** `packages/contracts/src/adapter/`, `docs/fsd/adapter-contract.md`

## Goal

The adapter contract is code: `.project-sync.yaml` v1 schema, canonical task and document schemas, canonical status and document category enums, and the logical operation names, all in `packages/contracts` with JSON Schema snapshots.

## Acceptance

- [ ] `.project-sync.yaml` example from source §4.3 parses; invalid configs return path-specific issues
- [ ] Unknown document category normalizes to `custom` with `metadata.original_type`
- [ ] A config-less adapter (envelope only) is valid: no schema field requires the config file
- [ ] Contract doc frozen at 1.0 (T-011)
- [ ] Tests: `tests/unit/contracts/adapter.test.ts`, `tests/contract/snapshots.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
