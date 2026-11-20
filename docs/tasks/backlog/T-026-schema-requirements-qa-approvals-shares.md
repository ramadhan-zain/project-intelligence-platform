# T-026 — Schema requirements qa approvals shares

**Phase:** 3 — Persistence · **Release:** R1 · **Status:** blocked (by T-021) · **Size:** M
**Satisfies:** FR-2.3, FR-2.8, FR-2.9, FR-2.11 · **Depends on:** T-021 · **Gated by:** —
**Files:** `packages/db/src/schema/collaboration.ts`

## Goal

Requirements with versions, change requests, approvals, QA results, design references and project shares exist in the schema, so release 4 builds on a complete canonical model.

## Acceptance

- [ ] Requirement versions immutable once approved
- [ ] Approval references `(entity_type, entity_id)`; QA result references task and/or requirement
- [ ] `project_shares` carries the FR-10.4 permission flags and `revoked_at`
- [ ] Tests: `tests/integration/db/collaboration.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
