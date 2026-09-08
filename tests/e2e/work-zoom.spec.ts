import { expect, test } from "@playwright/test";

const HIDDEN_ZOOM_PAGES = [
  "/portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual/",
  "/portfolio/a-nobel-prize-data-story/",
  "/portfolio/a-romanian-data-story/",
  "/portfolio/advanced-matrix-visual-built-with-deneb-in-power-bi/",
  "/portfolio/category-comparison-bar-chart-power-bi-custom-visual/",
];

test("portfolio zoom reveals a longer view", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/portfolio/btr-business-case-study/");
  const host = page.locator("[data-view-zoom]");
  await expect(host).toBeVisible();
  await expect(host.locator(".cs-planetary-wrapper")).toBeVisible();
  await expect(host.locator(".cs-grassroot-wrapper")).toBeHidden();
  await host.locator("[data-zoom-in]").click();
  await host.locator("[data-zoom-in]").click();
  await expect(host.locator(".cs-grassroot-wrapper")).toBeVisible();
});

test("articles do not have zoom controls", async ({ page }) => {
  await page.goto("/articles/microsoft-fabric-medallion-architecture-lessons-learned/");
  await expect(page.locator("[data-view-zoom]")).toHaveCount(0);
});

for (const path of HIDDEN_ZOOM_PAGES) {
  test(`original-hidden zoom stays off on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);
    await expect(page.locator(".views-nav")).toHaveCount(0);
    await expect(page.locator(".cs-planetary-wrapper")).toBeVisible();
    await expect(page.locator(".cs-mountaintop-wrapper")).toBeHidden();
    await expect(page.locator(".cs-grassroot-wrapper")).toBeHidden();
  });
}

test("LinkedIn story hides zoom and shows the long article", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/data-stories/redesigning-linkedin-analytics/");
  await expect(page.locator(".views-nav")).toHaveCount(0);
  await expect(page.locator(".cs-planetary-wrapper")).toBeHidden();
  await expect(page.locator(".cs-mountaintop-wrapper")).toBeHidden();
  await expect(page.locator(".cs-grassroot-wrapper.analytics-blogpost")).toBeVisible();
});

function contains(parent: { x: number; y: number; width: number; height: number }, child: { x: number; y: number; width: number; height: number }) {
  return (
    child.x >= parent.x - 1 &&
    child.y >= parent.y - 1 &&
    child.x + child.width <= parent.x + parent.width + 1 &&
    child.y + child.height <= parent.y + parent.height + 1
  );
}

test("zoom bar keeps plus, minus, and dots on one row", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/portfolio/btr-business-case-study/");
  const nav = page.locator(".views-nav");
  const zoomOut = nav.locator("[data-zoom-out]");
  const zoomIn = nav.locator("[data-zoom-in]");
  const dots = nav.locator(".views-nav-dot");

  await expect(nav).toBeVisible();
  await expect(zoomIn).toBeVisible();
  await expect(dots).toHaveCount(3);

  const navBox = await nav.boundingBox();
  const outBox = await zoomOut.boundingBox();
  const inBox = await zoomIn.boundingBox();
  expect(navBox).toBeTruthy();
  expect(outBox).toBeTruthy();
  expect(inBox).toBeTruthy();

  expect(contains(navBox!, inBox!), "plus stays inside the bar").toBeTruthy();
  expect(contains(navBox!, outBox!), "minus stays inside the bar").toBeTruthy();
  expect(inBox!.x).toBeGreaterThan(outBox!.x);

  for (const dot of await dots.all()) {
    const box = await dot.boundingBox();
    expect(box).toBeTruthy();
    expect(contains(navBox!, box!)).toBeTruthy();
    expect(box!.x).toBeGreaterThan(outBox!.x);
    expect(box!.x + box!.width).toBeLessThan(inBox!.x + 1);
  }
});

test("Nobel subjects view keeps laureates in three columns and padded body images", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/portfolio/a-nobel-prize-data-story/");
  const host = page.locator("[data-view-zoom]");
  await host.locator(".cs-mountaintop-wrapper").evaluate((el) => {
    el.classList.add("show");
    (el as HTMLElement).hidden = false;
  });

  const grid = host.locator(".cs-mountaintop-wrapper ._3col-image-wrapper");
  const columns = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns);
  expect(columns.split(" ").filter(Boolean).length).toBe(3);

  const cards = grid.locator(".laureate-block");
  await expect(cards).toHaveCount(3);
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(first).toBeTruthy();
  expect(second).toBeTruthy();
  expect(Math.abs(first!.y - second!.y)).toBeLessThan(8);
  expect(second!.x).toBeGreaterThan(first!.x + first!.width / 2);

  const body = host.locator(".cs-mountaintop-wrapper .mv-rich-text");
  await expect(body).toBeVisible();
  const padding = await body.evaluate((el) => getComputedStyle(el).paddingLeft);
  expect(Number.parseFloat(padding)).toBeGreaterThan(80);
});
