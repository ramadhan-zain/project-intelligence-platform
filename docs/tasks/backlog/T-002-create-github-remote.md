# T-002 — Create github remote

**Phase:** 0 — Unblock · **Release:** — · **Status:** ready · **Size:** S
**Satisfies:** tooling · **Depends on:** — · **Gated by:** OQ-027
**Files:** `.github/`, `docs/PROJECT.md`

## Goal

A GitHub repository exists for this code with a decided owner, name, visibility and plan, so CI, Actions settings and the branch ruleset (Gate 6 / Gate 8) can be applied.

## Acceptance

- [ ] Repository created by the product owner; URL recorded in `docs/PROJECT.md` and the CHANGELOG compare links
- [ ] OQ-027 decided; plan supports rulesets or the gap is recorded
- [ ] Actions settings and ruleset applied after explicit approval, read back with `gh api`
- [ ] Tests: CI run on the first PR shows `check` and `integration` green

## Notes

- 2026-11-20: created by bootstrap.
- 2026-11-20: repository created by the product owner (D-005), public; Actions already enabled with read-only workflow token. Remaining: first push, then ruleset and merge settings (asked one by one).
