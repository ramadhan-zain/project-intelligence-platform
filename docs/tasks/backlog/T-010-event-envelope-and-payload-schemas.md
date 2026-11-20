# T-010 — Event envelope and payload schemas

**Phase:** 1 — Contracts · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** FR-9.2, FR-9.15 · **Depends on:** — · **Gated by:** —
**Files:** `packages/contracts/src/events/`, `packages/contracts/snapshots/event-envelope.schema.json`, `docs/fsd/event-envelope-contract.md`

## Goal

The event envelope and every v1 payload schema are defined once in `packages/contracts` with zod, exported as JSON Schema, and the event contract doc is frozen at 1.0.

## Acceptance

- [ ] Envelope schema matches every row of `event-envelope-contract.md`; unknown `event_type` rejected
- [ ] Payload schemas resolved by `(event_type, schema_version)`; an unsupported version fails with a clear issue
- [ ] JSON Schema snapshot committed; contract doc version line says `1.0 frozen <date> (T-010)`
- [ ] Tests: `tests/unit/contracts/envelope.test.ts`, `tests/contract/snapshots.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
