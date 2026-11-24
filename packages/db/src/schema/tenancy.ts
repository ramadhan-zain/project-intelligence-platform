// Tenancy, projects and repositories (T-021, FR-1.1–FR-1.7, FR-2.10, FR-10.1).
// Allowed values: OQ-007 (roles), OQ-042 (statuses). RLS: OQ-004, OQ-041.
import { INTEGRATION_MODES } from "@pip/contracts";
import { type SQL, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  foreignKey,
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const ORGANIZATION_ROLES = ["owner", "admin", "member"] as const;
export const MEMBERSHIP_STATUSES = ["invited", "active", "suspended"] as const;
export const PROJECT_ROLES = ["manager", "developer", "designer", "qa", "viewer", "client"] as const;
export const PROJECT_STATUSES = ["planned", "active", "on_hold", "completed", "archived"] as const;
export const PROJECT_VISIBILITIES = ["organization", "members"] as const;
export const REPOSITORY_PROVIDERS = ["github"] as const;
export const INTEGRATION_STATUSES = ["pending", "active", "paused", "error"] as const;

/** `<column> in ('a', 'b')` for a check constraint. */
function oneOf(column: string, values: readonly string[]): SQL {
  return sql.raw(`${column} in (${values.map((v) => `'${v}'`).join(", ")})`);
}

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Standard tenant policy (migrations/0000_tenant_context.sql): the row belongs to the current organization. */
const tenantIsolation = (column = "organization_id") =>
  pgPolicy("tenant_isolation", {
    for: "all",
    using: sql.raw(`${column} = app.current_org_id()`),
    withCheck: sql.raw(`${column} = app.current_org_id()`),
  });

/** Global: a person can belong to several organizations. No RLS (OQ-041); shape follows Better Auth (OQ-002). */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_lower_key").on(sql`lower(${t.email})`)],
);

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    settings: jsonb("settings").notNull().default({}),
    ...timestamps,
  },
  () => [
    tenantIsolation("id"),
    // The organization switcher lists every organization the acting user belongs to (OQ-041).
    pgPolicy("member_read", {
      for: "select",
      using: sql`exists (select 1 from organization_members m
        where m.organization_id = organizations.id and m.user_id = app.current_user_id())`,
    }),
  ],
);

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(),
    status: text("status").notNull().default("invited"),
    ...timestamps,
  },
  (t) => [
    unique("organization_members_organization_user_key").on(t.organizationId, t.userId),
    check("organization_members_role_check", oneOf("role", ORGANIZATION_ROLES)),
    check("organization_members_status_check", oneOf("status", MEMBERSHIP_STATUSES)),
    tenantIsolation(),
    // A user reads their own memberships in any organization (OQ-041).
    pgPolicy("own_membership_read", { for: "select", using: sql`user_id = app.current_user_id()` }),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status").notNull().default("planned"),
    visibility: text("visibility").notNull().default("organization"),
    projectManagerId: uuid("project_manager_id"),
    startDate: date("start_date"),
    targetDate: date("target_date"),
    ...timestamps,
  },
  (t) => [
    // Target of the (project_id, organization_id) foreign keys below: a child stays in its project's organization.
    unique("projects_id_organization_key").on(t.id, t.organizationId),
    // The project manager is a member of the project's organization.
    foreignKey({
      name: "projects_project_manager_fk",
      columns: [t.organizationId, t.projectManagerId],
      foreignColumns: [organizationMembers.organizationId, organizationMembers.userId],
    }),
    check("projects_status_check", oneOf("status", PROJECT_STATUSES)),
    check("projects_visibility_check", oneOf("visibility", PROJECT_VISIBILITIES)),
    check(
      "projects_dates_check",
      sql`target_date is null or start_date is null or target_date >= start_date`,
    ),
    tenantIsolation(),
  ],
);

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull(),
    projectId: uuid("project_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(),
    permissions: text("permissions").array().notNull().default(sql`'{}'::text[]`),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      name: "project_members_project_fk",
      columns: [t.projectId, t.organizationId],
      foreignColumns: [projects.id, projects.organizationId],
    }),
    unique("project_members_project_user_key").on(t.projectId, t.userId),
    check("project_members_role_check", oneOf("role", PROJECT_ROLES)),
    tenantIsolation(),
  ],
);

export const repositories = pgTable(
  "repositories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull(),
    projectId: uuid("project_id").notNull(),
    provider: text("provider").notNull(),
    externalId: text("external_id").notNull(),
    url: text("url").notNull(),
    defaultBranch: text("default_branch").notNull(),
    integrationStatus: text("integration_status").notNull().default("pending"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      name: "repositories_project_fk",
      columns: [t.projectId, t.organizationId],
      foreignColumns: [projects.id, projects.organizationId],
    }),
    unique("repositories_id_project_organization_key").on(t.id, t.projectId, t.organizationId),
    unique("repositories_project_provider_external_key").on(t.projectId, t.provider, t.externalId),
    check("repositories_provider_check", oneOf("provider", REPOSITORY_PROVIDERS)),
    check("repositories_integration_status_check", oneOf("integration_status", INTEGRATION_STATUSES)),
    tenantIsolation(),
  ],
);

/** How one repository is synchronized; exactly one project through its repository (FR-10.1, FR-2.10). */
export const repositoryIntegrations = pgTable(
  "repository_integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull(),
    projectId: uuid("project_id").notNull(),
    repositoryId: uuid("repository_id").notNull(),
    adapterType: text("adapter_type").notNull(),
    adapterVersion: text("adapter_version").notNull(),
    // Non-secret settings only; credentials are stored encrypted (T-027).
    configuration: jsonb("configuration").notNull().default({}),
    syncMode: text("sync_mode").notNull().default("hybrid"),
    status: text("status").notNull().default("pending"),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      name: "repository_integrations_repository_fk",
      columns: [t.repositoryId, t.projectId, t.organizationId],
      foreignColumns: [repositories.id, repositories.projectId, repositories.organizationId],
    }),
    unique("repository_integrations_repository_adapter_key").on(t.repositoryId, t.adapterType),
    check("repository_integrations_sync_mode_check", oneOf("sync_mode", INTEGRATION_MODES)),
    check("repository_integrations_status_check", oneOf("status", INTEGRATION_STATUSES)),
    tenantIsolation(),
  ],
);
