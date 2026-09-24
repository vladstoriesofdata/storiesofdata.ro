import { expect, test } from "@playwright/test";

test("Fabric highlights the selected source's own inbound path", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const visual = page.locator('[data-service-visual="microsoft-fabric"] [data-fabric-visual]');
  const inboundPaths = visual.locator(".fabric-inbound-path");
  await expect(inboundPaths).toHaveCount(5);

  await visual.getByRole("button", { name: "Spreadsheets" }).click();
  await expect(visual).toHaveAttribute("data-active-source", "spreadsheets");
  await expect(visual.locator(".fabric-inbound-path--spreadsheets")).toHaveCSS(
    "background-color",
    "rgb(0, 209, 142)",
  );
});

test("CFO + BI highlights the selected capability's relationships", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByRole("tab", { name: "CFO + BI" }).click();

  const visual = page.locator('[data-service-visual="cfo-bi"] [data-cfo-visual]');
  await visual.getByRole("button", { name: "Reliable business data" }).click();
  await expect(visual).toHaveAttribute("data-active-capability", "data");

  const dataConnections = visual.locator(".connection-data");
  await expect(dataConnections).toHaveCount(3);
  for (const connection of await dataConnections.all()) {
    await expect(connection).toHaveCSS("background-color", "rgb(0, 209, 142)");
  }
});

test("Embedded Analytics keeps its fallback hidden until loading fails", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.getByRole("tab", { name: "Embedded Analytics" }).click();

  const visual = page.locator('[data-service-visual="embedded-analytics"] [data-embedded-visual]');
  await expect(visual.locator("[data-embed-placeholder]")).toBeVisible();
  await expect(visual.locator("[data-embed-fallback]")).toBeHidden();
});
