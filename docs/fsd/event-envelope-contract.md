# Event envelope contract

**Version:** 0.1 draft (2026-11-20) — to be frozen as 1.0 by T-010.
**Changelog:** 0.1 initial draft from source §11.1 (FR-9.2).
**Schema source:** `packages/contracts/src/events/envelope.ts`; snapshot `packages/contracts/snapshots/event-envelope.schema.json`.

Endpoint: `POST /api/integrations/events` — `Authorization: Bearer <integration token>` (OQ-021),
`Content-Type: application/json`. One envelope per request, or `{"events": [...]}` up to 100.

## Envelope

| Field | Type | Req. | Notes |
|---|---|---|---|
| `event_id` | string, 1–200 | yes | Sender-unique id. Dedup key is `(source.name, event_id)` within the integration (FR-9.6) |
| `event_type` | enum `EventType` | yes | see below |
| `schema_version` | integer ≥ 1 | yes | payload schema version for this `event_type` (FR-9.15) |
| `organization_id` | string | yes | must match the token's organization |
| `project_id` | string | yes | must match the token's project |
| `repository_id` | string \| null | no | required for `git.*`, `task.*` from repository adapters |
| `source.type` | enum `repository_adapter` · `git_provider` · `agent` · `cli` · `manual` · `external_service` | yes | |
| `source.name` | string | yes | e.g. `markdown-adapter`, `claude-code` |
| `source.adapter_version` | string | no | semver of the adapter (FR-3.18) |
| `entity.type` | enum `task` · `document` · `requirement` · `decision` · `pull_request` · `commit` · `branch` · `release` · `qa_result` · `approval` · `note` | yes | |
| `entity.external_id` | string | yes | id in the source system |
| `occurred_at` | RFC 3339 timestamp | yes | when it happened at the source |
| `sequence` | integer | no | per-entity monotonic counter at the source; used by BR-005 ordering |
| `payload` | object | yes | validated against the schema for `(event_type, schema_version)` |

## Event types (v1)

| `event_type` | Payload (v1) |
|---|---|
| `task.created`, `task.updated` | canonical task (adapter-contract.md §Task) — partial allowed for `updated` |
| `task.deleted` | `{}` |
| `documentation.updated` | canonical document (adapter-contract.md §Document) |
| `documentation.deleted` | `{ path }` |
| `decision.published` | `{ title, context, decision, consequences, source }` |
| `progress.published` | `{ task_external_id?, summary, status?, details? }` — marked agent-generated (BR-012) |
| `implementation.summary` | `{ task_external_id, summary, changed_files[], pull_request?, commits[] }` |
| `git.push`, `git.pull_request`, `git.release` | normalized from GitHub, see github-integration.md |

## Responses

| Code | Body | Meaning |
|---|---|---|
| 202 | `{ accepted: [event_id], duplicates: [event_id] }` | stored (and queued) or already known |
| 400 | `{ error: "validation", issues: [...] }` | envelope or payload invalid; nothing stored |
| 401 | `{ error: "unauthenticated" }` | token missing / invalid / revoked |
| 403 | `{ error: "forbidden" }` | scope mismatch (org / project / repository) |
| 503 | `{ error: "unavailable" }` | database down; sender retries |
