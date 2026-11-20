# T-082 — Cross org sharing and client portal

**Phase:** 4 — Services / API · **Release:** R4 · **Status:** blocked (by T-026, T-017, T-070) · **Size:** L
**Satisfies:** FR-10.3, FR-10.4, FR-6.5, BR-014, BR-015, AC-23, AC-27, AC-28 · **Depends on:** T-026, T-017, T-070 · **Gated by:** —
**Files:** `apps/api/src/routes/shares.ts`, `apps/web/src/app/(portal)/`

## Goal

Managers share a project with another organization with explicit permissions and can revoke it; client members use a portal that shows only shared information.

## Acceptance

- [ ] Share requires an explicit grant by a project manager / owner; audited
- [ ] Client sees overview, milestones, deliverables, approvals, CRs, release notes, shared docs — nothing internal
- [ ] Revocation takes effect on the next REST, MCP and SSE request
- [ ] Tests: `tests/integration/security/sharing.test.ts`, `tests/e2e/client-portal.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
