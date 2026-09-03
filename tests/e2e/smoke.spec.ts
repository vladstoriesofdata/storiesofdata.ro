import { expect, test } from "@playwright/test";

test("home is English and has hreflang", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const ro = page.locator('link[rel="alternate"][hreflang="ro"]');
  await expect(ro).toHaveAttribute("href", "https://www.storiesofdata.ro");
});

test("seed article renders", async ({ page }) => {
  await page.goto("/articles/microsoft-fabric-medallion-architecture-lessons-learned");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Microsoft Fabric Medallion Architecture",
  );
});

test("seed portfolio item renders", async ({ page }) => {
  await page.goto("/portfolio/a-romanian-data-story");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A Romanian Data Story",
  );
});

test("seed data story renders", async ({ page }) => {
  await page.goto("/data-stories/lines-on-maps-in-power-bi");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Lines on Maps in Power BI",
  );
});

test("privacy policy renders", async ({ page }) => {
  await page.goto("/privacy-policy");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Privacy policy",
  );
});

test("articles index lists at least six articles", async ({ page }) => {
  await page.goto("/articles/");
  const links = page.locator('a[href^="/articles/"]');
  expect(await links.count()).toBeGreaterThanOrEqual(6);
});

test("unknown path is 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
});
