import { createServer, type Server } from "node:http";
import { type HealthResponse, RELEASE_VERSION_HEADER } from "@pip/contracts";
import { releaseVersion } from "./lib/version.js";

// MCP tools arrive with T-063 / T-064 (Streamable HTTP at /mcp, OQ-020). Skeleton serves /health only.
export function buildMcpServer(): Server {
  const version = releaseVersion();
  return createServer((req, res) => {
    if (req.url === "/health") {
      const body: HealthResponse = { status: "ok", service: "mcp", version, dependencies: {} };
      res.writeHead(200, { "content-type": "application/json", [RELEASE_VERSION_HEADER]: version });
      res.end(JSON.stringify(body));
      return;
    }
    if (req.url?.startsWith("/mcp")) {
      res.writeHead(501, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "not_implemented", message: "MCP tools land with T-063" }));
      return;
    }
    res.writeHead(404).end();
  });
}
