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

test("unknown path is 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
});
