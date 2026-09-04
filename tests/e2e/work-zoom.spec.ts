import { expect, test } from "@playwright/test";

test("portfolio zoom reveals a longer view", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/portfolio/a-romanian-data-story");
  const host = page.locator("[data-view-zoom]");
  await expect(host).toBeVisible();
  await expect(host.locator(".cs-planetary-wrapper")).toBeVisible();
  await expect(host.locator(".cs-grassroot-wrapper")).toBeHidden();
  await host.locator("[data-zoom-in]").click();
  await host.locator("[data-zoom-in]").click();
  await expect(host.locator(".cs-grassroot-wrapper")).toBeVisible();
});

test("articles do not have zoom controls", async ({ page }) => {
  await page.goto("/articles/microsoft-fabric-medallion-architecture-lessons-learned");
  await expect(page.locator("[data-view-zoom]")).toHaveCount(0);
});
