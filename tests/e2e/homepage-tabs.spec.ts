import { expect, test } from "@playwright/test";

test("services tabs swap the panel", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const group = page.locator("#services [data-tabs], [data-section-name='services-and-products'] [data-tabs]");
  await expect(group).toBeVisible();
  await group.getByRole("tab", { name: "Power BI" }).click();
  await expect(group.getByRole("tab", { name: "Power BI" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Building reports").first()).toBeVisible();
});

test("portfolio tabs swap carousel cards", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const group = page.locator("#portfolio [data-tabs]");
  await group.getByRole("tab", { name: /Articles/i }).click();
  await expect(group.getByRole("tab", { name: /Articles/i })).toHaveAttribute("aria-selected", "true");
  await expect(
    page.locator('#portfolio [data-tab-panel="articles"] a[href^="/articles/"]').first(),
  ).toBeVisible();
});
