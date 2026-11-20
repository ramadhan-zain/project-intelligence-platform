/** Queue names shared by api (producer) and worker (consumer). See ARCHITECTURE.md §2. */
export const QUEUES = {
  events: "events",
  sync: "sync",
  reports: "reports",
  notifications: "notifications",
} as const;

/** Header carrying the running release version on /health (Gate 7, T-112). */
export const RELEASE_VERSION_HEADER = "x-release-version";
