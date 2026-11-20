# GitHub integration

**Version:** 0.1 draft (2026-11-20) — to be frozen as 1.0 by T-040.
**Changelog:** 0.1 consumed webhook events and mapping (FR-4.1–FR-4.5).

GitHub owns this contract; this file records what the platform consumes and how it maps. The mock in
`tools/github_mock` replays recorded payloads of each event below for dev and CI.

## App

* GitHub App, installed per organization or repository (FR-4.1). Permissions (read-only): Contents,
  Metadata, Pull requests, Issues. Events: `installation`, `installation_repositories`, `create`, `push`,
  `pull_request`, `pull_request_review`, `release`.
* Webhook URL `https://<domain>/api/webhooks/github`; secret in `GITHUB_WEBHOOK_SECRET`; App id and private
  key in `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY` (encrypted at rest in the DB if per-org apps are added).
* Signature `X-Hub-Signature-256` verified on the raw body before parsing (NFR-9). Dedup key
  `X-GitHub-Delivery`.

## Mapping (FR-4.3)

| GitHub event / action | Platform event | Records |
|---|---|---|
| `installation_repositories.added` | `git.repository_connected` | repository integration status → `connected`, enqueue initial sync |
| `create` (ref_type branch) | `git.branch_created` | branch; task links from branch name |
| `push` | `git.push` + `git.commit_created` per commit | commits, changed files, task links from messages; doc/task source changes → incremental sync |
| `pull_request.opened` / `edited` / `synchronize` | `git.pull_request` (opened / updated) | PR; task links from title / body / branch |
| `pull_request_review.submitted` (approved / changes_requested) | `git.pull_request` (approved / changes_requested) | PR review state |
| `pull_request.closed` merged=true / false | `git.pull_request` (merged / closed) | PR; merged state of linked work (FR-4.9) |
| `release.published` | `git.release` | release; released state (OQ-018) |
