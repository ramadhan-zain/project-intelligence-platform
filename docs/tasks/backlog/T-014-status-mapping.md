# T-014 — Status mapping

**Phase:** 2 — Domain · **Release:** R2 · **Status:** ready · **Size:** S
**Satisfies:** FR-3.10, AC-3 · **Depends on:** — · **Gated by:** —
**Files:** `packages/domain/src/status-mapping.ts`

## Goal

External task statuses map to canonical statuses through an adapter's mapping table, the original value is always kept, and unmapped values produce a diagnostic instead of a silent guess.

## Acceptance

- [ ] Mapping from source §4.3 example works (pending → todo, completed → done, …)
- [ ] Result always carries `original_status`
- [ ] Unmapped value → `todo` plus a warning item for sync diagnostics
- [ ] Tests: `tests/unit/domain/status-mapping.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
