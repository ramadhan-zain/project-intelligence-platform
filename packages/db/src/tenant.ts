import { sql } from "drizzle-orm";
import type { Database } from "./types.js";

/** The organization (and acting user, if any) every tenant query and job runs as (NFR-6, NFR-10). */
export interface TenantContext {
  orgId: string;
  /** Absent for system jobs that act for an organization without a user. */
  userId?: string | null;
}

export type TenantTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || !UUID.test(value)) {
    throw new TypeError(`tenant context: ${name} must be a UUID`);
  }
}

/**
 * Runs `fn` in one transaction with `app.org_id` / `app.user_id` set transaction-locally
 * (`set_config(..., true)` = `SET LOCAL`), so RLS policies see the tenant and the setting never
 * outlives the transaction on a pooled connection (OQ-004).
 */
export async function withTenant<T>(
  db: Database,
  ctx: TenantContext,
  fn: (tx: TenantTransaction) => Promise<T>,
): Promise<T> {
  assertUuid(ctx.orgId, "orgId");
  if (ctx.userId != null) assertUuid(ctx.userId, "userId");
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.org_id', ${ctx.orgId}, true), set_config('app.user_id', ${ctx.userId ?? ""}, true)`,
    );
    return fn(tx);
  });
}
