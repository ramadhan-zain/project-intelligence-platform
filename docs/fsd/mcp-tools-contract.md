# MCP tools contract

**Version:** 0.1 draft (2026-11-20) — to be frozen as 1.0 by T-063.
**Changelog:** 0.1 tool list from source §10.1 (FR-8.1, FR-8.2).
**Schema source:** `packages/contracts/src/mcp/`; snapshot `mcp-tools.schema.json`.

Transport: Streamable HTTP at `/mcp` (OQ-020). Auth: `Authorization: Bearer <API token>`. Every tool
result carries `provenance` per item (source reference, authoritative / generated / agent-generated).

| Tool | Kind | Input | Output |
|---|---|---|---|
| `get_project_overview` | read | `project_id` | name, status, milestones, counts by canonical status, repositories |
| `get_repository_context` | read | `repository_id` | overview, agent instructions, architecture doc refs, conventions, recent activity |
| `get_project_tasks` | read | `project_id`, `status?`, `assignee?`, `repository_id?`, `limit?` | canonical tasks |
| `get_recent_activity` | read | `project_id`, `limit?` (≤ 50), `since?` | events |
| `get_project_requirements` | read | `project_id`, `status?`, `task_id?` | requirements (approved version) |
| `get_technical_decisions` | read | `project_id`, `query?` | decisions (structured text match, no vectors — BR-018) |
| `get_document` | read | `document_id` or `project_id` + `path` | content, version, provenance |
| `get_related_entities` | read | `entity_type`, `entity_id` | linked requirements, tasks, PRs, commits, QA results, decisions |
| `update_task_status` | write | `task_id`, `status`, `note?` | updated task; refused when the task's source owns status (FR-8.3) |
| `add_project_note` | write | `project_id`, `text`, `task_id?` | note (agent-generated) |
| `publish_progress` | write | `project_id`, `task_id?`, `summary`, `status?` | progress event (agent-generated) |
| `create_change_request` | write | `requirement_id`, `description`, `reason`, `impact[]` | CR in `pending` (R4) |
| `submit_implementation_summary` | write | `task_id`, `summary`, `changed_files[]`, `pull_request?` | summary (agent-generated) |

Writes are audited (FR-10.5) and marked agent-generated (BR-012).
