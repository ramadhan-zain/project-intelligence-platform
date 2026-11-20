import { type HealthResponse, RELEASE_VERSION_HEADER } from "@pip/contracts";

export const dynamic = "force-dynamic";

export function GET() {
  const version = process.env.RELEASE_VERSION ?? "0.0.0-dev";
  const body: HealthResponse = { status: "ok", service: "web", version, dependencies: {} };
  return Response.json(body, { headers: { [RELEASE_VERSION_HEADER]: version } });
}
