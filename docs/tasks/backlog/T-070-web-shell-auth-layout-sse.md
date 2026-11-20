# T-070 — Web shell auth layout sse

**Phase:** 8 — UI · **Release:** R1 · **Status:** blocked (by T-030, T-038, T-012) · **Size:** M
**Satisfies:** FR-9.13 · **Depends on:** T-030, T-038, T-012 · **Gated by:** —
**Files:** `apps/web/src/app/`, `apps/web/src/lib/`

## Goal

The web app has sign-in / sign-up / invitation pages, an organization and project switcher, the shell layout (Tailwind + shadcn/ui), the typed API client and one SSE hook that refreshes data on changes.

## Acceptance

- [ ] Sign-in → project list → project page works against the dev stack
- [ ] SSE change refreshes the visible list without reload
- [ ] No database credentials or server secrets in the web bundle
- [ ] Tests: `apps/web/tests/shell.test.tsx`, Playwright smoke `tests/e2e/shell.spec.ts`

## Notes

- 2026-11-20: created by bootstrap.
