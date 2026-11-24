/** Architecture constraints (NFR-11, BR-001). Extended by T-103 and T-107. */
module.exports = {
  forbidden: [
    {
      name: "web-no-db",
      comment: "apps/web talks to the API only; it never imports packages/db.",
      severity: "error",
      from: { path: "^apps/web" },
      to: { path: "^packages/db" },
    },
    {
      name: "domain-is-pure",
      comment: "packages/domain has no I/O dependencies.",
      severity: "error",
      from: { path: "^packages/domain/src" },
      to: { path: "^(packages/db|apps/)|node_modules/(postgres|ioredis|bullmq|fastify)" },
    },
    {
      name: "db-postgres-only",
      comment: "PostgreSQL is the only store of record; packages/db never touches Redis (NFR-2).",
      severity: "error",
      from: { path: "^packages/db" },
      to: { path: "node_modules/(ioredis|redis|bullmq)" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(\\.next|dist|coverage)/" },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: { conditionNames: ["source", "import", "default"] },
  },
};
