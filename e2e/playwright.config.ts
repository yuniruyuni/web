import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  // Snapshot configuration
  snapshotDir: "./__snapshots__",
  snapshotPathTemplate:
    "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
    ignoreHTTPSErrors: true,
    colorScheme: "light",
    timezoneId: "Asia/Tokyo",
    locale: "ja-JP",
  },

  projects: process.env.CI
    ? [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ]
    : [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ],

  webServer: {
    // client の static を生成してから server を起動する。
    // server 側の watch:run が STATIC_DIR=../client/static を見るので、
    // ここでは事前に client build を走らせる必要がある。
    command:
      "bun run --filter @web/client build && bun run --filter @web/server watch:run",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
