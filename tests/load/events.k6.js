// Load test skeleton (T-104). Runs before a release, not in CI:
//   k6 run -e BASE_URL=http://localhost:8088 tests/load/events.k6.js
// Grows into event-intake load at OQ-003 volumes once T-037 exists.

import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: { http_req_duration: ["p(95)<300"], http_req_failed: ["rate<0.01"] },
};

export default function () {
  const res = http.get(`${__ENV.BASE_URL || "http://localhost:8088"}/health`);
  check(res, { "status 200": (r) => r.status === 200 });
}
