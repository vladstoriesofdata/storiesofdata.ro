import { expect, test } from "@playwright/test";
import { BOOKINGS_URL } from "../../src/data/services";

test("homepage chapters keep original bold, italic, and embedsy link", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const strong = page.locator('[data-section-name="we-build-applications"] strong').first();
  await expect(strong).toHaveText("turn your data into valuable products");
  await expect(strong).toHaveCSS("font-weight", /^(700|bold)$/);

  const embedsy = page.getByRole("link", { name: "embedsy.io" });
  await expect(embedsy).toBeVisible();
  await expect(embedsy).toHaveAttribute("href", "https://embedsy.io/");

  const em = page.locator('[data-section-name="we-are-power-bi-experts"] em');
  await expect(em).toHaveText(/Everything/);
  await expect(em).toHaveCSS("font-style", "italic");
});

test("hero lede keeps Bringing and clarity on one line", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const bringing = page.locator(".hero-lede-heavy");
  const clarity = page.locator(".hero-lede-accent");
  const after = page.locator(".hero-lede-light");
  const bringingBox = await bringing.boundingBox();
  const clarityBox = await clarity.boundingBox();
  const afterBox = await after.boundingBox();

  expect(bringingBox).toBeTruthy();
  expect(clarityBox).toBeTruthy();
  expect(afterBox).toBeTruthy();
  expect(Math.abs((bringingBox?.y ?? 0) - (clarityBox?.y ?? 0))).toBeLessThan(8);
  expect((afterBox?.y ?? 0)).toBeGreaterThan((bringingBox?.y ?? 0) + 20);

  await expect(after).toHaveCSS("font-weight", "400");
  await expect(page.locator(".hero-heading-light")).toHaveCSS("color", "rgb(51, 51, 51)");
});

test("services visualization tab keeps original visual links", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const group = page.locator("#services [data-tabs]");
  await group.getByRole("tab", { name: "Data Visualization" }).click();

  await expect(
    group.getByRole("link", { name: "Multi Line Chart with Tooltips" }),
  ).toBeVisible();
  await expect(group.getByRole("link", { name: "Deneb" })).toBeVisible();
  await expect(group.getByRole("link", { name: /BI Samurai/ })).toBeVisible();
});

test("services use business-owner copy and the shared discovery CTA", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const services = page.locator("#services");
  await expect(services.getByRole("tab")).toHaveText([
    "Microsoft Fabric",
    "Embedded Analytics",
    "AI Integrations",
    "CFO + BI",
  ]);

  const expected = [
    {
      tab: "Microsoft Fabric",
      headline: "One connected view of your business.",
      exploration: undefined,
    },
    {
      tab: "Embedded Analytics",
      headline: "Give customers analytics under your own brand.",
      exploration: "https://embedsy.io/",
    },
    {
      tab: "AI Integrations",
      headline: "Put AI to work on real business problems.",
      exploration: undefined,
    },
    {
      tab: "CFO + BI",
      headline: "Financial leadership and analytics, working as one team.",
      exploration: "https://demo.embedsy.io/embed/studio/63",
    },
  ];

  for (const item of expected) {
    await services.getByRole("tab", { name: item.tab }).click();
    const panel = services.locator('[role="tabpanel"]:not([hidden])');
    await expect(panel.getByRole("heading", { name: item.headline })).toBeVisible();
    await expect(panel.locator("li")).toHaveCount(3);

    const cta = panel.getByRole("link", { name: "Book a discovery call" });
    await expect(cta).toHaveAttribute("href", BOOKINGS_URL);

    const exploration = panel.getByRole("link", { name: /Explore/ });
    if (item.exploration) {
      await expect(exploration).toHaveAttribute("href", item.exploration);
    } else {
      await expect(exploration).toHaveCount(0);
    }
  }
});
