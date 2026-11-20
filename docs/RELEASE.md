# Release, rollback and hotfix

One version for the whole repo, released as git tag `vX.Y.Z`. Git steps (commit, tag, push, merge) are
done by a person; this file says what and in which order.

## 1. Before the release

- [ ] Every task planned for this release is in `docs/tasks/done/`; `python3 tools/trace.py` is green.
- [ ] CI is green on the default branch at the commit to release.
- [ ] `version` bumped in every manifest: `package.json`, `apps/api/package.json`, `apps/worker/package.json`, `apps/mcp/package.json`, `apps/web/package.json`, `packages/contracts/package.json`, `packages/domain/package.json`, `packages/db/package.json`, `tools/github_mock/package.json` (`node tools/bump-version.mjs X.Y.Z` once T-115 lands).
- [ ] `CHANGELOG.md`: `## [Unreleased]` renamed to `## [X.Y.Z] — YYYY-MM-DD`; **Deployment** section says
      exactly what the operator must do; compare link added at the bottom. Same PR as the bump.
- [ ] Migrations in this release reviewed: each is either reversible (has a tested down step) or listed
      under **Deployment** as "restore from backup to roll back".
- [ ] Load / endurance run if the release touches throughput, queues or retention (`tests/load/`).
- [ ] UAT sections for every changed AC re-run (`docs/uat/UAT.md`).

## 2. Cut

1. Merge the bump PR (squash).
2. Tag the merge commit: `git tag -a vX.Y.Z -m "vX.Y.Z"` then `git push origin vX.Y.Z`.
3. CI builds and pushes images tagged `vX.Y.Z` and `latest` (`.github/workflows/release.yml`; or by hand: `make images`, then for each of `api worker mcp web`: `docker tag pip-$s:X.Y.Z ghcr.io/ramadhan-zain/pip-$s:vX.Y.Z` and push).

## 3. Deploy

1. **Backup first** (`DEPLOYMENT.md` → Backup). Note the backup's file name in the deploy log.
2. Record the version now running: `curl -sI https://$SITE_ADDRESS/health` (value from `infra/prod/.env`) → `X-Release-Version` header. This is the rollback target.
3. Follow `DEPLOYMENT.md` → Upgrade, pinned to `vX.Y.Z` (never `latest` on production).
4. Verify:
   - [ ] health endpoint reports `vX.Y.Z` and every dependency up;
   - [ ] smoke test: sign in; open a project's task board; send a test event with `pip-sync` (or `make mock-github-ping` on staging) and see it on the activity timeline; MCP `get_project_overview` answers from Claude Code; `docker compose -f stack.yml ps` shows every service healthy;
   - [ ] no new errors in logs for 15 minutes.

## 4. Rollback

Roll back when a verify step fails or a severe issue is found after release.

1. Redeploy the previous tag recorded in step 3.2 (`vA.B.C`), pinned.
2. Database:
   - all migrations since `vA.B.C` reversible → run the down steps to `vA.B.C`'s head;
   - otherwise → stop the stack, restore the backup from step 3.1, start `vA.B.C`.
     Data written after the backup is lost: tell the affected organizations before choosing this path.
3. Verify as in step 3.4 against `vA.B.C`.
4. Write down what happened: a backlog task for the fix, and a **Fixed** line ready for the next release.

## 5. Hotfix

For a fix that cannot wait for the next planned release.

1. Branch from the default branch if it holds nothing unreleased; otherwise from the tag:
   `git switch -c hotfix/vX.Y.(Z+1) vX.Y.Z`.
2. Smallest fix + a test that fails without it. Task file as usual (`fix/` work is still a T-nnn).
3. Patch bump in every manifest, `CHANGELOG.md` entry with **Fixed** (and **Deployment** if needed).
4. PR → CI green → merge → tag `vX.Y.(Z+1)` → deploy with section 3.
5. Branched from the tag → bring the fix into the default branch with its own PR (cherry-pick), so the
   next release does not lose it.
