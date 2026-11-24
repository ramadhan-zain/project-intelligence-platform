# Database schema

Generated from migrations by `make db-schema`; regenerate whenever a migration lands. Do not edit by hand.

Migrations: `0000_tenant_context.sql`, `0001_tenancy.sql`. Tenant context functions (`app.current_org_id()`,
`app.current_user_id()`) come from `0000_tenant_context.sql`.

## organization_members

RLS: enabled

| Column | Type | Null | Default | Key |
|---|---|---|---|---|
| id | uuid | no | `gen_random_uuid()` | PK |
| organization_id | uuid | no |  | → organizations.id |
| user_id | uuid | no |  | → users.id |
| role | text | no |  |  |
| status | text | no | `'invited'` |  |
| created_at | timestamp with time zone | no | `now()` |  |
| updated_at | timestamp with time zone | no | `now()` |  |

Constraints:

- unique `organization_members_organization_user_key` (organization_id, user_id)
- check `organization_members_role_check`: `role in ('owner', 'admin', 'member')`
- check `organization_members_status_check`: `status in ('invited', 'active', 'suspended')`

Policies:

- `tenant_isolation` (all): using `organization_id = app.current_org_id()`; check `organization_id = app.current_org_id()`
- `own_membership_read` (select): using `user_id = app.current_user_id()`

## organizations

RLS: enabled

| Column | Type | Null | Default | Key |
|---|---|---|---|---|
| id | uuid | no | `gen_random_uuid()` | PK |
| name | text | no |  |  |
| slug | text | no |  |  |
| settings | jsonb | no | `'{}'::jsonb` |  |
| created_at | timestamp with time zone | no | `now()` |  |
| updated_at | timestamp with time zone | no | `now()` |  |

Constraints:

- unique `organizations_slug_unique` (slug)

Policies:

- `tenant_isolation` (all): using `id = app.current_org_id()`; check `id = app.current_org_id()`
- `member_read` (select): using `exists (select 1 from organization_members m where m.organization_id = organizations.id and m.user_id = app.current_user_id())`

## project_members

RLS: enabled

| Column | Type | Null | Default | Key |
|---|---|---|---|---|
| id | uuid | no | `gen_random_uuid()` | PK |
| organization_id | uuid | no |  |  |
| project_id | uuid | no |  |  |
| user_id | uuid | no |  | → users.id |
| role | text | no |  |  |
| permissions | text[] | no | `'{}'::text[]` |  |
| created_at | timestamp with time zone | no | `now()` |  |
| updated_at | timestamp with time zone | no | `now()` |  |

Constraints:

- unique `project_members_project_user_key` (project_id, user_id)
- foreign key `project_members_project_fk` (project_id, organization_id) → projects (id, organization_id)
- check `project_members_role_check`: `role in ('manager', 'developer', 'designer', 'qa', 'viewer', 'client')`

Policies:

- `tenant_isolation` (all): using `organization_id = app.current_org_id()`; check `organization_id = app.current_org_id()`

## projects

RLS: enabled

| Column | Type | Null | Default | Key |
|---|---|---|---|---|
| id | uuid | no | `gen_random_uuid()` | PK |
| organization_id | uuid | no |  | → organizations.id |
| name | text | no |  |  |
| description | text | yes |  |  |
| status | text | no | `'planned'` |  |
| visibility | text | no | `'organization'` |  |
| project_manager_id | uuid | yes |  |  |
| start_date | date | yes |  |  |
| target_date | date | yes |  |  |
| created_at | timestamp with time zone | no | `now()` |  |
| updated_at | timestamp with time zone | no | `now()` |  |

Constraints:

- unique `projects_id_organization_key` (id, organization_id)
- foreign key `projects_project_manager_fk` (organization_id, project_manager_id) → organization_members (organization_id, user_id)
- check `projects_status_check`: `status in ('planned', 'active', 'on_hold', 'completed', 'archived')`
- check `projects_visibility_check`: `visibility in ('organization', 'members')`
- check `projects_dates_check`: `target_date is null or start_date is null or target_date >= start_date`

Policies:

- `tenant_isolation` (all): using `organization_id = app.current_org_id()`; check `organization_id = app.current_org_id()`

## repositories

RLS: enabled

| Column | Type | Null | Default | Key |
|---|---|---|---|---|
| id | uuid | no | `gen_random_uuid()` | PK |
| organization_id | uuid | no |  |  |
| project_id | uuid | no |  |  |
| provider | text | no |  |  |
| external_id | text | no |  |  |
| url | text | no |  |  |
| default_branch | text | no |  |  |
| integration_status | text | no | `'pending'` |  |
| last_synced_at | timestamp with time zone | yes |  |  |
| created_at | timestamp with time zone | no | `now()` |  |
| updated_at | timestamp with time zone | no | `now()` |  |

Constraints:

- unique `repositories_id_project_organization_key` (id, project_id, organization_id)
- unique `repositories_project_provider_external_key` (project_id, provider, external_id)
- foreign key `repositories_project_fk` (project_id, organization_id) → projects (id, organization_id)
- check `repositories_provider_check`: `provider in ('github')`
- check `repositories_integration_status_check`: `integration_status in ('pending', 'active', 'paused', 'error')`

Policies:

- `tenant_isolation` (all): using `organization_id = app.current_org_id()`; check `organization_id = app.current_org_id()`

## repository_integrations

RLS: enabled

| Column | Type | Null | Default | Key |
|---|---|---|---|---|
| id | uuid | no | `gen_random_uuid()` | PK |
| organization_id | uuid | no |  |  |
| project_id | uuid | no |  |  |
| repository_id | uuid | no |  |  |
| adapter_type | text | no |  |  |
| adapter_version | text | no |  |  |
| configuration | jsonb | no | `'{}'::jsonb` |  |
| sync_mode | text | no | `'hybrid'` |  |
| status | text | no | `'pending'` |  |
| created_at | timestamp with time zone | no | `now()` |  |
| updated_at | timestamp with time zone | no | `now()` |  |

Constraints:

- unique `repository_integrations_repository_adapter_key` (repository_id, adapter_type)
- foreign key `repository_integrations_repository_fk` (repository_id, project_id, organization_id) → repositories (id, project_id, organization_id)
- check `repository_integrations_sync_mode_check`: `sync_mode in ('push', 'pull', 'hybrid')`
- check `repository_integrations_status_check`: `status in ('pending', 'active', 'paused', 'error')`

Policies:

- `tenant_isolation` (all): using `organization_id = app.current_org_id()`; check `organization_id = app.current_org_id()`

## users

RLS: **off**

| Column | Type | Null | Default | Key |
|---|---|---|---|---|
| id | uuid | no | `gen_random_uuid()` | PK |
| email | text | no |  |  |
| name | text | no |  |  |
| email_verified | boolean | no | `false` |  |
| image | text | yes |  |  |
| created_at | timestamp with time zone | no | `now()` |  |
| updated_at | timestamp with time zone | no | `now()` |  |

Constraints:

- unique index `users_email_lower_key` (lower("email"))
