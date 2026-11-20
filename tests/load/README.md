# Load and endurance tests

Run before a release (`docs/RELEASE.md` §1), not on every push. Tool: [k6](https://k6.io).
Reports go to `tests/load/reports/` (HTML ignored by git; keep a short summary per release in this file).

| Script         | Proves                                          | Task  |
| -------------- | ----------------------------------------------- | ----- |
| `events.k6.js` | baseline latency of the stack through the proxy | T-104 |
