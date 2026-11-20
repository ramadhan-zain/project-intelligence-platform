# T-057 — Schema version compatibility

**Phase:** 6 — Workers / background · **Release:** R2 · **Status:** blocked (by T-010, T-051) · **Size:** S
**Satisfies:** FR-3.21, FR-9.15 · **Depends on:** T-010, T-051 · **Gated by:** —
**Files:** `packages/contracts/src/events/upcasters.ts`, `docs/fsd/adapter-contract.md`

## Goal

Older event schema versions are upcast to the current one, and adapter compatibility rules state which adapter versions each platform version accepts.

## Acceptance

- [ ] v1 payload accepted after a v2 is introduced (test with a synthetic v2)
- [ ] Compatibility table in `adapter-contract.md`; unsupported adapter version rejected with a clear error
- [ ] Tests: `tests/unit/contracts/upcasters.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
