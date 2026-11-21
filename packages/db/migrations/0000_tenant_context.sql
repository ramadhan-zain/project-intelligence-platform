-- Tenant context for Row-Level Security (T-020, NFR-6, OQ-004). Applied as the owner role by
-- src/migrate.ts, which creates the non-owner app role `pip_app` first.
--
-- Every tenant table (T-021 onward) carries `organization_id` and gets:
--   ALTER TABLE <t> ENABLE ROW LEVEL SECURITY;
--   CREATE POLICY tenant_isolation ON <t>
--     USING (organization_id = app.current_org_id())
--     WITH CHECK (organization_id = app.current_org_id());
-- Outside withTenant the setting is unset, app.current_org_id() is NULL and the policy matches no row.

CREATE SCHEMA IF NOT EXISTS app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION app.current_org_id() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('app.org_id', true), '')::uuid $$;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION app.current_user_id() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$ SELECT nullif(current_setting('app.user_id', true), '')::uuid $$;
--> statement-breakpoint
GRANT USAGE ON SCHEMA app TO pip_app;
--> statement-breakpoint
GRANT USAGE ON SCHEMA public TO pip_app;
--> statement-breakpoint
-- Tables and sequences the owner creates later are usable by the app role (DML only, never DDL).
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO pip_app;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO pip_app;
