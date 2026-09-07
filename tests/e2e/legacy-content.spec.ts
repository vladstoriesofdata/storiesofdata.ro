import { expect, test } from "@playwright/test";

test("article body keeps images, bold, and bullets", async ({ page }) => {
  await page.goto(
    "/articles/full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026/",
  );

  const image = page.locator(".work-article img").first();
  await expect(image).toBeVisible();
  const width = await image.evaluate((el) => (el as HTMLImageElement).naturalWidth);
  expect(width).toBeGreaterThan(0);

  const strong = page.locator(".work-article p strong").first();
  await expect(strong).toBeVisible();
  await expect(strong).toHaveCSS("font-weight", /^(700|bold)$/);

  const item = page.locator(".work-article ul > li").first();
  await expect(item).toBeVisible();
  await expect(item).toHaveCSS("list-style-type", "disc");
});

test("case study detail view keeps images and bullets", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/data-stories/lines-on-maps-in-power-bi/");
  const host = page.locator("[data-view-zoom]");
  await host.locator("[data-zoom-in]").click();
  await host.locator("[data-zoom-in]").click();

  const image = host.locator(".cs-grassroot-wrapper img").first();
  await expect(image).toBeVisible();
  const width = await image.evaluate((el) => (el as HTMLImageElement).naturalWidth);
  expect(width).toBeGreaterThan(0);

  const item = host.locator(".cs-grassroot-wrapper ul > li").first();
  await expect(item).toBeVisible();
  await expect(item).toHaveCSS("list-style-type", "disc");
});
