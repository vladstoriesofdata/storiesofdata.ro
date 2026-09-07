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
  await page.goto("/portfolio/advanced-matrix-visual-built-with-deneb-in-power-bi");
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
