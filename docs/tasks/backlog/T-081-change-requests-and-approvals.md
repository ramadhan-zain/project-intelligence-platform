# T-081 — Change requests and approvals

**Phase:** 4 — Services / API · **Release:** R4 · **Status:** blocked (by T-080) · **Size:** L
**Satisfies:** FR-5.8, FR-5.9, FR-2.9, BR-011, AC-24 · **Depends on:** T-080 · **Gated by:** —
**Files:** `apps/api/src/routes/change-requests.ts`, `apps/api/src/routes/approvals.ts`

## Goal

Change requests against approved requirements carry reason and impact and go through an approval workflow (including client approvers); approval creates a new requirement version and keeps the original.

## Acceptance

- [ ] CR approval → new requirement version; original approved version unchanged and viewable
- [ ] Clients with approval permission can submit approvals and CRs; others cannot
- [ ] MCP `create_change_request` now creates real CRs
- [ ] Tests: `tests/integration/api/change-requests.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
