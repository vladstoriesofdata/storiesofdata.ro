import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/homepage-ro.spec.ts",
  webServer: {
    command: "npm run build:ro && npm run preview:ro -- --host 127.0.0.1 --port 4322",
    port: 4322,
    reuseExistingServer: false,
  },
  use: {
    baseURL: "http://127.0.0.1:4322",
  },
});
