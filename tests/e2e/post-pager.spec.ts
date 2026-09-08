import { expect, test } from "@playwright/test";

test("article pager uses ARTICLE and moves to the next article", async ({ page }) => {
  await page.goto("/articles/microsoft-fabric-medallion-architecture-lessons-learned/");
  const pager = page.locator("nav.post-pager");
  await expect(pager).toBeVisible();
  await expect(pager.locator(".post-pager-kind")).toHaveText("ARTICLE");
  await expect(pager.locator(".post-pager-index")).toHaveText("6");
  await expect(pager.locator(".post-pager-total")).toHaveText("6");

  await pager.getByRole("link", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/articles\/become-truly-data-driven-and-you-will-certainly-fail\/?$/);
  await expect(page.locator("nav.post-pager .post-pager-kind")).toHaveText("ARTICLE");
  await expect(page.locator("nav.post-pager .post-pager-index")).toHaveText("1");
});

test("portfolio pager uses PROJECT and wraps to the previous project", async ({ page }) => {
  await page.goto("/portfolio/a-romanian-data-story/");
  const pager = page.locator("nav.post-pager");
  await expect(pager).toBeVisible();
  await expect(pager.locator(".post-pager-kind")).toHaveText("PROJECT");
  await expect(pager.locator(".post-pager-index")).toHaveText("1");
  await expect(pager.locator(".post-pager-total")).toHaveText("8");

  await pager.getByRole("link", { name: "Previous" }).click();
  await expect(page).toHaveURL(/\/portfolio\/.+/);
  await expect(page.locator("nav.post-pager .post-pager-index")).toHaveText("8");
});

test("case study pager stays in data stories and uses PROJECT", async ({ page }) => {
  await page.goto("/data-stories/lines-on-maps-in-power-bi/");
  const pager = page.locator("nav.post-pager");
  await expect(pager).toBeVisible();
  await expect(pager.locator(".post-pager-kind")).toHaveText("PROJECT");
  await expect(pager.locator(".post-pager-index")).toHaveText("1");
  await expect(pager.locator(".post-pager-total")).toHaveText("2");

  await pager.getByRole("link", { name: "Next" }).click();
  await expect(page).toHaveURL(/\/data-stories\/redesigning-linkedin-analytics\/?$/);
  await expect(page.locator("nav.post-pager .post-pager-kind")).toHaveText("PROJECT");
});
