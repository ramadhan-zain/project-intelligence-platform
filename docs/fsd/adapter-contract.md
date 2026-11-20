# Repository adapter contract

**Version:** 0.1 draft (2026-11-20) — to be frozen as 1.0 by T-011.
**Changelog:** 0.1 initial draft from source §4.2–§4.7 (FR-3.1–FR-3.12), config shape per OQ-016.
**Schema source:** `packages/contracts/src/adapter/`; snapshots `project-sync.schema.json`,
`canonical-task.schema.json`, `canonical-document.schema.json`.

## Logical operations (FR-3.5)

| Operation | Needed in mode | Input → output |
|---|---|---|
| `discover()` | pull, hybrid | repository at commit → list of sources (tasks, docs, decisions, requirements) |
| `getTasks()` | pull, hybrid | task source → canonical tasks |
| `getDocuments()` | pull, hybrid | doc sources → canonical documents |
| `getRequirements()` | optional | → requirement candidates (never auto-approved, BR-011) |
| `getDecisions()` | optional | → technical decisions |
| `normalize()` | all | external item → canonical entity |
| `publishEvent()` | push, hybrid | canonical change → envelope (event-envelope-contract.md) |
| `resolveReference()` | all | canonical entity → source location (path, anchor, URL) |
| `healthCheck()` | all | → `{ status: ok | degraded | down, detail }` |

Built-in adapters (Markdown tasks, docs discovery) implement these in `apps/worker` (OQ-034). Custom
adapters may implement only `publishEvent()` by posting envelopes.

## `.project-sync.yaml` v1 (OQ-016)

| Key | Type | Req. | Notes |
|---|---|---|---|
| `version` | `1` | yes | |
| `platform.project_id`, `platform.integration_id` | string | yes | |
| `repository.name`, `repository.default_branch` | string | yes | |
| `synchronization.mode` | `push` · `pull` · `hybrid` | no | default `hybrid` (FR-3.8) |
| `synchronization.events` | list of event types | no | default all |
| `tasks.source` | `markdown` · `json` · `github_issues` · `none` | no | |
| `tasks.path` | string | if markdown/json | |
| `tasks.mapping.id_pattern` | regex string | if markdown | e.g. `TASK-\d+` |
| `tasks.mapping.title` | `heading` · `line` | no | default `heading` |
| `tasks.mapping.description` | `body` · `none` | no | |
| `tasks.mapping.status` | map external → canonical status | no | unknown external values → `todo` + warning in diagnostics |
| `documentation.sources[]` | `{ path, type }` (path may be a glob) | no | `type` = document category, default by discovery |
| `decisions.path` | string | no | folder of ADR-style Markdown |
| `activity.include_commits`, `activity.include_pull_requests` | bool | no | default true |

Without the file, discovery falls back to conventions (FR-3.14): `CLAUDE.md`/`AGENTS.md` →
`agent_instructions`; `README.md` → `overview`; `docs/**/architecture*.md`, `system-design*.md` →
`architecture`; `*requirements*.md`, `*specification*.md` → `requirements`/`specification`;
`BACKLOG.md`, `TASKS.md` → task source candidates (reported, not parsed, until mapped).

## Canonical task (FR-3.9, FR-3.10)

| Field | Type | Notes |
|---|---|---|
| `external_id` | string | |
| `title` | string | |
| `description` | string \| null | |
| `status` | canonical status | mapped |
| `original_status` | string | source value, kept as metadata |
| `priority` | `low` · `medium` · `high` · `urgent` \| null | |
| `type` | `task` · `bug` | OQ-013 |
| `assignee.external_id` | string \| null | |
| `labels` | string[] | |
| `source` | `{ type, path?, reference, url? }` | FR-2.14 |
| `relationships` | `{ requirement_ids[], parent_task_id? }` | |
| `updated_at` | timestamp | |

## Canonical document (FR-3.11, FR-3.12)

| Field | Type | Notes |
|---|---|---|
| `external_id` | string | stable per source path |
| `title` | string | first heading or filename |
| `type` | document category | unknown → `custom` + `metadata.original_type` |
| `format` | `markdown` · `json` · `text` | |
| `content` | string | |
| `source` | `{ repository_id, path, branch, commit_sha }` | |
| `visibility` | `organization` · `project` · `shared` · `private` | |
| `version` | integer | platform-assigned on change |
| `updated_at` | timestamp | |
