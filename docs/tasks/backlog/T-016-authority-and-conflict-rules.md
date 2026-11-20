# T-016 — Authority and conflict rules

**Phase:** 2 — Domain · **Release:** R2 · **Status:** ready · **Size:** M
**Satisfies:** BR-002, BR-003, BR-004, BR-005, BR-006 · **Depends on:** — · **Gated by:** —
**Files:** `packages/domain/src/authority.ts`

## Goal

A pure resolver decides, per entity and field, whether an incoming change applies, is skipped as stale, or is a conflict for human review, following the authority table and source sequence — never by timestamp alone.

## Acceptance

- [ ] Authority table from BR-002 / BR-004 encoded as data, configurable per integration
- [ ] Ordering uses source `sequence` / version before `occurred_at`
- [ ] Generated or agent-generated sources can never overwrite authoritative fields (BR-003)
- [ ] Every decision returns a result record (applied / stale / conflict + reason); nothing is dropped (BR-006)
- [ ] Tests: `tests/unit/domain/authority.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
