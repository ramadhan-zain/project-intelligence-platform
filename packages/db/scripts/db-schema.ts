// `make db-schema`: render docs/db-schema.md from the latest drizzle-kit snapshot (T-021). No database needed.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

interface Column {
  name: string;
  type: string;
  primaryKey: boolean;
  notNull: boolean;
  default?: string | number | boolean;
}
interface ForeignKey {
  name: string;
  tableTo: string;
  columnsFrom: string[];
  columnsTo: string[];
  onDelete?: string;
}
interface Policy {
  name: string;
  for?: string;
  using?: string;
  withCheck?: string;
}
interface Index {
  name: string;
  isUnique: boolean;
  columns: { expression: string }[];
}
interface Table {
  name: string;
  columns: Record<string, Column>;
  indexes: Record<string, Index>;
  foreignKeys: Record<string, ForeignKey>;
  uniqueConstraints: Record<string, { name: string; columns: string[] }>;
  checkConstraints: Record<string, { name: string; value: string }>;
  policies: Record<string, Policy>;
  isRLSEnabled: boolean;
}
interface Snapshot {
  tables: Record<string, Table>;
}

const MIGRATIONS = fileURLToPath(new URL("../migrations", import.meta.url));
const OUT = fileURLToPath(new URL("../../../docs/db-schema.md", import.meta.url));

const migrations = readdirSync(MIGRATIONS)
  .filter((f) => f.endsWith(".sql"))
  .sort();
const latest = readdirSync(`${MIGRATIONS}/meta`)
  .filter((f) => f.endsWith("_snapshot.json"))
  .sort()
  .at(-1);
if (!latest) throw new Error("no drizzle-kit snapshot in migrations/meta");
const snapshot = JSON.parse(readFileSync(`${MIGRATIONS}/meta/${latest}`, "utf8")) as Snapshot;

const code = (s: string) => `\`${s.replace(/\s+/g, " ").replaceAll("|", "\\|")}\``;
const list = (cols: string[]) => cols.join(", ");

function renderTable(t: Table): string {
  const policies = Object.values(t.policies);
  // drizzle-kit enables RLS on any table that declares a policy, even when isRLSEnabled is false.
  const rls = t.isRLSEnabled || policies.length > 0;
  const fks = Object.values(t.foreignKeys);
  const out = [`## ${t.name}`, "", `RLS: ${rls ? "enabled" : "**off**"}`, ""];

  out.push("| Column | Type | Null | Default | Key |", "|---|---|---|---|---|");
  for (const c of Object.values(t.columns)) {
    const refs = fks
      .filter((fk) => fk.columnsFrom.length === 1 && fk.columnsFrom[0] === c.name)
      .map((fk) => `→ ${fk.tableTo}.${fk.columnsTo[0]}`);
    const key = [c.primaryKey ? "PK" : "", ...refs].filter(Boolean).join(" ");
    const dflt = c.default === undefined ? "" : code(String(c.default));
    out.push(`| ${c.name} | ${c.type} | ${c.notNull ? "no" : "yes"} | ${dflt} | ${key} |`);
  }

  const constraints = [
    ...Object.values(t.uniqueConstraints).map((u) => `- unique \`${u.name}\` (${list(u.columns)})`),
    ...Object.values(t.indexes)
      .filter((i) => i.isUnique)
      .map((i) => `- unique index \`${i.name}\` (${list(i.columns.map((c) => c.expression))})`),
    ...fks
      .filter((fk) => fk.columnsFrom.length > 1)
      .map(
        (fk) =>
          `- foreign key \`${fk.name}\` (${list(fk.columnsFrom)}) → ${fk.tableTo} (${list(fk.columnsTo)})`,
      ),
    ...Object.values(t.checkConstraints).map((c) => `- check \`${c.name}\`: ${code(c.value)}`),
    ...Object.values(t.indexes)
      .filter((i) => !i.isUnique)
      .map((i) => `- index \`${i.name}\` (${list(i.columns.map((c) => c.expression))})`),
  ];
  if (constraints.length) out.push("", "Constraints:", "", ...constraints);

  if (policies.length) {
    out.push("", "Policies:", "");
    for (const p of policies) {
      const parts = [
        p.using ? `using ${code(p.using)}` : "",
        p.withCheck ? `check ${code(p.withCheck)}` : "",
      ];
      out.push(`- \`${p.name}\` (${(p.for ?? "all").toLowerCase()}): ${parts.filter(Boolean).join("; ")}`);
    }
  }
  return out.join("\n");
}

const tables = Object.values(snapshot.tables).sort((a, b) => a.name.localeCompare(b.name));
const doc = [
  "# Database schema",
  "",
  "Generated from migrations by `make db-schema`; regenerate whenever a migration lands. Do not edit by hand.",
  "",
  `Migrations: ${migrations.map((m) => `\`${m}\``).join(", ")}. Tenant context functions (\`app.current_org_id()\`,`,
  "`app.current_user_id()`) come from `0000_tenant_context.sql`.",
  "",
  ...tables.map(renderTable).flatMap((t) => [t, ""]),
].join("\n");

writeFileSync(OUT, doc);
console.log(`docs/db-schema.md: ${tables.length} tables from ${latest}`);
