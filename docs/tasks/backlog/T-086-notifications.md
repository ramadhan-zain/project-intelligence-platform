# T-086 — Notifications

**Phase:** 6 — Workers / background · **Release:** R4 · **Status:** blocked (by T-051, T-038) · **Size:** L
**Satisfies:** FR-12.1, FR-12.2 · **Depends on:** T-051, T-038 · **Gated by:** —
**Files:** `apps/worker/src/jobs/notifications.ts`, `apps/web/src/app/(me)/notifications/`

## Goal

Users get in-app notifications (OQ-026) for the FR-12.1 events, configurable per user and project.

## Acceptance

- [ ] Each FR-12.1 event type produces a notification for the right recipients only
- [ ] Muting a project stops its notifications
- [ ] Tests: `tests/integration/worker/notifications.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
