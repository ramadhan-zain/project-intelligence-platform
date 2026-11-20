import { defineConfig } from "vitest/config";

// Unit + contract tests (every push). Integration tests: vitest.integration.config.ts.
// Coverage gate: 80 % over the pure layers, packages/contracts and packages/domain (NFR-15, OQ-032, T-100).
export default defineConfig({
  resolve: { conditions: ["source"] },
  ssr: { resolve: { conditions: ["source"] } },
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/contract/**/*.test.ts", "packages/*/src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["packages/contracts/src/**/*.ts", "packages/domain/src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/index.ts"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
      reporter: ["text-summary", "lcov"],
    },
  },
});
