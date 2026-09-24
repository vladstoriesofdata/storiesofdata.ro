import { expect, test } from "@playwright/test";

test("desktop services tabs swap the active two-column panel within a 1366 by 768 viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");

  const services = page.locator("#services [data-services]");
  const controls = services.locator("[data-services-controls]");
  await expect(services).toHaveAttribute("data-services-mode", "desktop");
  await expect(controls).toHaveRole("tablist");
  await expect(controls.getByRole("tab")).toHaveText([
    "Microsoft Fabric",
    "Embedded Analytics",
    "AI Integrations",
    "CFO + BI",
  ]);

  await controls.getByRole("tab", { name: "AI Integrations" }).click();
  await expect(controls.getByRole("tab", { name: "AI Integrations" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(services.locator('[data-service-panel="microsoft-fabric"]')).toBeHidden();

  const panel = services.locator('[data-service-panel="ai-integrations"]');
  await expect(panel).toBeVisible();
  await expect(
    panel.getByRole("heading", { name: "Put AI to work on real business problems." }),
  ).toBeVisible();

  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");
  await page.evaluate(() => window.__homepageMoveTo?.("services"));
  await expect
    .poll(async () => services.evaluate((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.45 && rect.bottom > 80;
    }))
    .toBe(true);

  const layout = await page.evaluate(() => {
    const controls = document.querySelector<HTMLElement>("#services [data-services-controls]");
    const copy = document.querySelector<HTMLElement>(
      '#services [data-service-panel="ai-integrations"] .services-stage-copy',
    );
    const visual = document.querySelector<HTMLElement>(
      '#services [data-service-panel="ai-integrations"] .services-stage-visual',
    );
    if (!controls || !copy || !visual) return null;

    const tabRows = [...controls.children].map((tab) => tab.getBoundingClientRect().top);
    const copyBox = copy.getBoundingClientRect();
    const visualBox = visual.getBoundingClientRect();
    return {
      controlsUseOneRow: Math.max(...tabRows) - Math.min(...tabRows) < 2,
      isTwoColumn: copyBox.right < visualBox.left,
      activePanelFitsViewport: visualBox.bottom <= window.innerHeight,
      pageFitsViewportWidth: document.documentElement.scrollWidth <= window.innerWidth,
    };
  });

  expect(layout).toEqual({
    controlsUseOneRow: true,
    isTwoColumn: true,
    activePanelFitsViewport: true,
    pageFitsViewportWidth: true,
  });
});

test("mobile services act as a one-open-at-a-time accordion", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  const services = page.locator("#services [data-services]");
  const controls = services.locator("[data-services-controls]");
  const fabricItem = services.locator('[data-service-accordion-item="microsoft-fabric"]');
  const aiItem = services.locator('[data-service-accordion-item="ai-integrations"]');
  const fabric = fabricItem.getByRole("button", { name: "Microsoft Fabric" });
  const ai = aiItem.getByRole("button", { name: "AI Integrations" });
  await expect(services).toHaveAttribute("data-services-mode", "mobile");
  await expect(controls).not.toHaveAttribute("role", "tablist");
  await expect(fabric).toHaveAttribute("aria-expanded", "true");
  await expect(ai).toHaveAttribute("aria-expanded", "false");
  await expect(fabric.locator("+ [data-service-panel]")).toHaveCount(1);
  await expect(ai.locator("+ [data-service-panel]")).toHaveCount(1);

  await ai.click();
  await expect(fabric).toHaveAttribute("aria-expanded", "false");
  await expect(ai).toHaveAttribute("aria-expanded", "true");
  await expect(ai.locator("+ [data-service-panel]")).toBeVisible();
  await expect(services.locator('[data-service-panel]:not([hidden])')).toHaveCount(1);
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
