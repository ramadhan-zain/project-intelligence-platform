# T-114 — Backup and restore

**Phase:** 10 — Deployment · **Release:** R1 · **Status:** blocked (by T-111) · **Size:** M
**Satisfies:** NFR-13 · **Depends on:** T-111 · **Gated by:** —
**Files:** `infra/backup/`, `docs/DEPLOYMENT.md`

## Goal

Nightly PostgreSQL backups with rotation, and a restore drill that meets the RPO / RTO of OQ-003.

## Acceptance

- [ ] Backup file created nightly, kept 14 days
- [ ] Restore drill on a scratch host within RTO, recorded
- [ ] Tests: manual drill, recorded in task Notes

## Notes

- 2026-11-20: created by bootstrap.
