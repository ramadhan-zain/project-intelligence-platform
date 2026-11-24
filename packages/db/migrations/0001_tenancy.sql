CREATE TABLE "organization_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'invited' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_members_organization_user_key" UNIQUE("organization_id","user_id"),
	CONSTRAINT "organization_members_role_check" CHECK (role in ('owner', 'admin', 'member')),
	CONSTRAINT "organization_members_status_check" CHECK (status in ('invited', 'active', 'suspended'))
);
--> statement-breakpoint
ALTER TABLE "organization_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "project_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"permissions" text[] DEFAULT '{}'::text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_members_project_user_key" UNIQUE("project_id","user_id"),
	CONSTRAINT "project_members_role_check" CHECK (role in ('manager', 'developer', 'designer', 'qa', 'viewer', 'client'))
);
--> statement-breakpoint
ALTER TABLE "project_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'planned' NOT NULL,
	"visibility" text DEFAULT 'organization' NOT NULL,
	"project_manager_id" uuid,
	"start_date" date,
	"target_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_id_organization_key" UNIQUE("id","organization_id"),
	CONSTRAINT "projects_status_check" CHECK (status in ('planned', 'active', 'on_hold', 'completed', 'archived')),
	CONSTRAINT "projects_visibility_check" CHECK (visibility in ('organization', 'members')),
	CONSTRAINT "projects_dates_check" CHECK (target_date is null or start_date is null or target_date >= start_date)
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"external_id" text NOT NULL,
	"url" text NOT NULL,
	"default_branch" text NOT NULL,
	"integration_status" text DEFAULT 'pending' NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "repositories_id_project_organization_key" UNIQUE("id","project_id","organization_id"),
	CONSTRAINT "repositories_project_provider_external_key" UNIQUE("project_id","provider","external_id"),
	CONSTRAINT "repositories_provider_check" CHECK (provider in ('github')),
	CONSTRAINT "repositories_integration_status_check" CHECK (integration_status in ('pending', 'active', 'paused', 'error'))
);
--> statement-breakpoint
ALTER TABLE "repositories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "repository_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"repository_id" uuid NOT NULL,
	"adapter_type" text NOT NULL,
	"adapter_version" text NOT NULL,
	"configuration" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sync_mode" text DEFAULT 'hybrid' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "repository_integrations_repository_adapter_key" UNIQUE("repository_id","adapter_type"),
	CONSTRAINT "repository_integrations_sync_mode_check" CHECK (sync_mode in ('push', 'pull', 'hybrid')),
	CONSTRAINT "repository_integrations_status_check" CHECK (status in ('pending', 'active', 'paused', 'error'))
);
--> statement-breakpoint
ALTER TABLE "repository_integrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_fk" FOREIGN KEY ("project_id","organization_id") REFERENCES "public"."projects"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_project_manager_fk" FOREIGN KEY ("organization_id","project_manager_id") REFERENCES "public"."organization_members"("organization_id","user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_project_fk" FOREIGN KEY ("project_id","organization_id") REFERENCES "public"."projects"("id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repository_integrations" ADD CONSTRAINT "repository_integrations_repository_fk" FOREIGN KEY ("repository_id","project_id","organization_id") REFERENCES "public"."repositories"("id","project_id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_key" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE POLICY "tenant_isolation" ON "organization_members" AS PERMISSIVE FOR ALL TO public USING (organization_id = app.current_org_id()) WITH CHECK (organization_id = app.current_org_id());--> statement-breakpoint
CREATE POLICY "own_membership_read" ON "organization_members" AS PERMISSIVE FOR SELECT TO public USING (user_id = app.current_user_id());--> statement-breakpoint
CREATE POLICY "tenant_isolation" ON "organizations" AS PERMISSIVE FOR ALL TO public USING (id = app.current_org_id()) WITH CHECK (id = app.current_org_id());--> statement-breakpoint
CREATE POLICY "member_read" ON "organizations" AS PERMISSIVE FOR SELECT TO public USING (exists (select 1 from organization_members m
        where m.organization_id = organizations.id and m.user_id = app.current_user_id()));--> statement-breakpoint
CREATE POLICY "tenant_isolation" ON "project_members" AS PERMISSIVE FOR ALL TO public USING (organization_id = app.current_org_id()) WITH CHECK (organization_id = app.current_org_id());--> statement-breakpoint
CREATE POLICY "tenant_isolation" ON "projects" AS PERMISSIVE FOR ALL TO public USING (organization_id = app.current_org_id()) WITH CHECK (organization_id = app.current_org_id());--> statement-breakpoint
CREATE POLICY "tenant_isolation" ON "repositories" AS PERMISSIVE FOR ALL TO public USING (organization_id = app.current_org_id()) WITH CHECK (organization_id = app.current_org_id());--> statement-breakpoint
CREATE POLICY "tenant_isolation" ON "repository_integrations" AS PERMISSIVE FOR ALL TO public USING (organization_id = app.current_org_id()) WITH CHECK (organization_id = app.current_org_id());