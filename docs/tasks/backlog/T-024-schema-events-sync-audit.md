# T-024 — Schema events sync audit

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** ready · **Size:** M
**Satisfies:** FR-2.6, FR-9.7, FR-9.9, FR-10.5 · **Depends on:** T-021 · **Gated by:** —
**Files:** `packages/db/src/schema/events.ts`

## Goal

Raw project events (original payload untouched), sync results, dead-letter events and the audit log are stored; a unique key on source and external event id deduplicates intake.

## Acceptance

- [ ] `INSERT … ON CONFLICT DO NOTHING` on `(integration_id, source_name, external_event_id)` reports duplicates
- [ ] `payload` stored as received (jsonb + raw text hash)
- [ ] Audit log append-only for the app role (no UPDATE / DELETE grant)
- [ ] Tests: `tests/integration/db/events.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
