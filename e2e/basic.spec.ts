import { expect, test } from "@playwright/test";

test("トップページが開く", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("yuniruyuni.net");
});

test("#content セクションが存在する", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#content")).toBeVisible();
});

test("OGP メタデータが設定されている", async ({ page }) => {
  await page.goto("/");
  const ogTitle = await page
    .locator('meta[property="og:title"]')
    .getAttribute("content");
  expect(ogTitle).toBe("yuniruyuni.net");
});
