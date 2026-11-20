# Glossary

One meaning per term. Code, UI labels and docs use the spelling in the **Term** column.

| Term | Meaning | Source ref | Not to be confused with |
|---|---|---|---|
| AC-n | Acceptance criterion of the platform as a whole, defined in `PIP-dev-spec.md` §8 | §16 | a requirement's own acceptance criteria (field of a Requirement record) |
| Activity timeline | Time-ordered list of a project's events shown in the dashboard | §15 Phase 1 | audit log |
| Adapter | Component that translates a source's structure (files, issues, tool) into canonical entities and events; may be a config file, script, Action, CLI, plugin or service | §4.2 | integration (the stored connection record) |
| Adapter version | Version of an adapter's behaviour, recorded on each integration, independent of the platform version | §17.2 | platform release version `vX.Y.Z` |
| Agent-generated | Marking on information produced by an AI agent until a person reviews or accepts it | §10.3 | AI-generated summary |
| AI-generated summary | Derived, non-authoritative text produced by an LLM with recorded provenance | §9.4, §9.5 | authoritative record |
| API token | Personal access token a user creates for agents / MCP, bound to one organization (OQ-020) | §10.1 | integration token |
| Approval | Explicit record that a person accepted or rejected an entity (requirement, CR, design, deliverable) | §5.1 | PR approval on GitHub |
| Audit log | Append-only record of sensitive write operations: actor, action, target, before / after, time | §12.3 | activity timeline, project event |
| Authoritative source | The system whose value wins for a given entity / field (BR-002) | §2.3 | latest update |
| Branch state | One of four states of a capability: canonical, active branch, merged, released | §6.4 | PR status |
| Canonical data model | The platform's internal, standardized entity model that every source maps into | §2.1 | a repository's own file structure |
| Canonical status | One of `backlog`, `todo`, `in_progress`, `in_review`, `blocked`, `done`, `cancelled` | §4.6 | original status (the source's own value, kept as metadata) |
| Change request (CR) | Traceable proposal to modify an approved requirement, code `CR-nnn` | §7.3 | pull request |
| Client | User role of a person from an organization a project is shared with; sees only shared information | §8.5, §12.2 | the product's customer — this is an internal product (D-004) |
| Conflict | Two sources updating the same entity / field with no clear authority; flagged for human review | §4.8 | duplicate event |
| Context engine | Service that assembles minimal project context for agents from structured records | §9.1 | LLM |
| Dead-letter | Store of events that failed processing after all retries; inspectable and replayable | §11.2 | discarded event |
| Deduplication | Ignoring an event already processed, identified by source and external event id | §11.2 | conflict resolution |
| Delivery risk | Deterministic warning flag on a project (OQ-014) | §8.2 | project health score |
| Design reference | Link to a design artefact (e.g. Figma URL) with title, links and approval (OQ-012) | §8.3 | design specification |
| Design specification | Project document of type `specification` linked to a requirement (OQ-031) | §7.4 | design reference |
| Document category | Value of a document's `type`: `overview`, `architecture`, …, `custom` | §4.7 | document format (markdown, json) |
| Envelope | Standard JSON wrapper of every integration event: id, type, schema version, scope, source, entity, time, payload | §11.1 | payload |
| Full resynchronization | Re-reading every source of one repository and reconciling | §17.2 | initial synchronization |
| Gantt view | Project schedule: tasks as bars from start to due date, grouped by milestone, with dependency links (D-006, OQ-035) | D-006 | activity timeline |
| GitHub App | GitHub's installable app model used for webhooks and API access | §3.2 | GitHub OAuth (user login) |
| Hybrid mode | Integration mode: push events for increments plus scheduled pulls for consistency; default | §4.5 | — |
| Implementation summary | Structured report an agent publishes about work done on a task | §10.1 | AI-generated summary |
| Incremental synchronization | Re-reading only sources changed since the last run | §15 Phase 2 | full resynchronization |
| Initial synchronization | First full read after a repository is connected | §15 Phase 2 | full resynchronization |
| Integration | Stored connection of one repository to the platform: adapter type, version, config, mode, status | §5.1 | adapter |
| Integration token | Secret credential scoped to one integration, used by push adapters (OQ-021) | §12.3 | API token |
| Kanban view | Task board layout with one column per canonical status; drag-to-move only for platform-owned status (D-006) | D-006 | task list view |
| Management | User role with organization-wide, cross-project read access | §8.6 | project manager |
| MCP | Model Context Protocol; the platform exposes tools to AI agents through an MCP server | §10.1 | REST API |
| Milestone | Named project target with a date that tasks and requirements belong to (OQ-008) | §8.2 | release |
| Organization | Tenant: a company or organizational unit; owns projects | §5.1 | GitHub organization |
| Original status | A task's status value as written in its source, stored next to the canonical status | §4.6 | canonical status |
| Platform task | Work item tracked by the product (canonical Task entity) | §5.1 | bootstrap task `T-nnn` in `docs/tasks/` |
| PM | Project manager role | §8.2 | product owner |
| Progress rule | Configurable, explainable formula that turns task data into a progress figure (OQ-006) | §8.6 | commit statistics |
| Project event | Stored, normalized event with its original payload | §5.1 | audit log entry |
| Provenance | Where a record came from: source type, location, external id, version / commit, generator | §2.3 | — |
| Pull mode | Integration mode where the platform fetches repository information on a schedule | §4.5 | pull request |
| Push mode | Integration mode where the repository side sends events | §4.5 | git push |
| Requirement | Versioned business requirement record with code `REQ-nnn` inside the product | §7.2 | `FR-x.y` IDs of this repository's own spec |
| Row-Level Security (RLS) | PostgreSQL feature that filters rows per session settings; used for tenant isolation | §12.3 | application-level authorization |
| Share | Explicit grant of one project to another organization with listed permissions | §12.2 | organization membership |
| Source ownership | Rule naming which source may change a given entity / field | §4.8 | user permission |
| Source reference | Pointer from a record to its origin (repository, path, reference, commit) | §4.6 | provenance (wider) |
| SSE | Server-Sent Events, one-way HTTP stream used for realtime dashboard updates | §11.3 | WebSocket |
| T-nnn | Bootstrap development task of this repository in `docs/tasks/` | — | platform task |
