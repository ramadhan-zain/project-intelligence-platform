# T-051 — Event processor

**Phase:** 6 — Workers / background · **Release:** R2 · **Status:** blocked (by T-050, T-016, T-022) · **Size:** L
**Satisfies:** FR-2.1, FR-2.14, FR-9.1, FR-9.8, FR-9.9, BR-006, AC-5, AC-6, AC-8 · **Depends on:** T-050, T-016, T-022 · **Gated by:** —
**Files:** `apps/worker/src/processors/events.ts`

## Goal

The event processor normalizes each stored event, resolves authority per field, writes records and version rows in one transaction, records the sync result, and notifies SSE — with no LLM call.

## Acceptance

- [ ] Task event from an adapter creates / updates the canonical task with source reference
- [ ] Duplicate or replayed events produce no duplicate tasks or activity
- [ ] Conflicts recorded and listed for review; nothing discarded
- [ ] Every processed event has exactly one sync result row
- [ ] Tests: `tests/integration/worker/event-processor.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
