import { defineConfig } from "@playwright/test";

const PORT = 3400;

// Runs against the production build (`pnpm test:e2e` builds first) in the locally installed Chrome.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
    // The visitor's own timezone must not matter: status is always Berlin time.
    timezoneId: "Asia/Tokyo",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    env: { CONTACT_TEST_SINK: "1" },
  },
});
