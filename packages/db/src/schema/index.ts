// Drizzle table definitions. Each tenant table carries `organization_id` and gets the RLS policy shown in
// migrations/0000_tenant_context.sql (OQ-004).
export * from "./tenancy.js";
