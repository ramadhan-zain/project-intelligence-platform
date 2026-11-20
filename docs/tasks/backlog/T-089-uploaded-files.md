# T-089 — Uploaded files

**Phase:** 4 — Services / API · **Release:** R4 · **Status:** gated (by OQ-025) · **Size:** M
**Satisfies:** FR-11.3 · **Depends on:** T-035 · **Gated by:** OQ-025
**Files:** `apps/api/src/routes/uploads.ts`

## Goal

Users upload files as project documents into the storage decided by OQ-025, with checksum, size limit and visibility.

## Acceptance

- [ ] Upload, download, version and delete respect visibility
- [ ] Over-limit and disallowed types refused
- [ ] Tests: `tests/integration/api/uploads.test.ts`

## Notes

- 2026-11-20: created by bootstrap.
