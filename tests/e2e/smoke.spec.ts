import { expect, test } from "@playwright/test";

test("home is English and has hreflang", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const ro = page.locator('link[rel="alternate"][hreflang="ro"]');
  await expect(ro).toHaveAttribute("href", "https://www.storiesofdata.ro");
});

test("homepage header has original nav without Articles", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("header.home-chrome nav");
  await expect(nav.getByRole("link", { name: /what we do/i })).toBeVisible();
  await expect(nav.getByRole("link", { name: /articles/i })).toHaveCount(0);
});

test("language switch points at the Romanian domain", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: /Switch to Romanian/i });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "https://www.storiesofdata.ro");
});

test("seed article renders without zoom", async ({ page }) => {
  await page.goto("/articles/microsoft-fabric-medallion-architecture-lessons-learned");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Microsoft Fabric Medallion Architecture",
  );
  await expect(page.locator("[data-view-zoom]")).toHaveCount(0);
});

test("content images are served from the article path", async ({ request }) => {
  const response = await request.get(
    "/articles/how-to-turn-your-power-bi-reports-into-a-subscription-based-app/images/fea503ab.png",
  );
  expect(response.status()).toBe(200);
});

test("seed portfolio item has three-level zoom", async ({ page }) => {
  await page.goto("/portfolio/a-romanian-data-story");
  await expect(page.locator("[data-view-zoom]")).toBeVisible();
});

test("seed data story renders with zoom", async ({ page }) => {
  await page.goto("/data-stories/lines-on-maps-in-power-bi");
  await expect(page.locator("[data-view-zoom]")).toBeVisible();
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

test("home contains Services, Team, and the contact form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Services and products" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Our Team" })).toBeVisible();
  const form = page.locator("#contact form");
  await expect(form).toBeVisible();
  await expect(form.locator('[name="name"]')).toBeVisible();
  await expect(form.locator('[name="email"]')).toBeVisible();
  await expect(form.locator('[name="message"]')).toBeVisible();
});
