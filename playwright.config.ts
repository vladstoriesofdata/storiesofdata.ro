import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run build:com && npm run preview:com -- --host 127.0.0.1 --port 4321",
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://127.0.0.1:4321" },
});
