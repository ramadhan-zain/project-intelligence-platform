import { buildMcpServer } from "./server.js";

const port = Number(process.env.MCP_PORT ?? 3002);
const server = buildMcpServer();
server.listen(port, "0.0.0.0", () => console.log(JSON.stringify({ msg: "mcp listening", port })));

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
