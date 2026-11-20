# T-002 — Create github remote

**Phase:** 0 — Unblock · **Release:** — · **Status:** done 2026-11-21 — D-005 · **Size:** S
**Satisfies:** tooling · **Depends on:** — · **Gated by:** OQ-027
**Files:** `.github/`, `docs/PROJECT.md`

## Goal

A GitHub repository exists for this code with a decided owner, name, visibility and plan, so CI, Actions settings and the branch ruleset (Gate 6 / Gate 8) can be applied.

## Acceptance

- [x] Repository created by the product owner; URL recorded in `docs/PROJECT.md` and the CHANGELOG compare links
- [x] OQ-027 decided; plan supports rulesets or the gap is recorded
- [x] Actions settings and ruleset applied after explicit approval, read back with `gh api`
- [x] Tests: CI run on the first PR shows `check` and `integration` green

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: repository created by the product owner (D-005), public; Actions already enabled with read-only workflow token. Remaining: first push, then ruleset and merge settings (asked one by one).
- 2026-11-21: closed. Read back with `gh api`: ruleset `protect-default-branch` active on `~DEFAULT_BRANCH` (no deletion, no force-push, linear history, PR required with thread resolution, required checks `check` + `integration`, strict); squash-only merges, delete branch on merge; Actions enabled, workflow token read-only, cannot approve PRs. Repo public, so rulesets work on the free plan (OQ-027 gap moot). PR #1 CI run 44771178603: `check` and `integration` green. Remote recorded in `docs/PROJECT.md` and the CHANGELOG `[Unreleased]` link.
