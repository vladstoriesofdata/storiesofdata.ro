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

test("services show current summaries, discovery CTA and exploration links", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const services = page.locator("#services");
  await expect(services.getByRole("tab")).toHaveText([
    "Microsoft Fabric & Power BI",
    "Embedded Analytics",
    "Data & AI",
    "CFO + BI",
  ]);

  const expected = [
    {
      tab: "Microsoft Fabric & Power BI",
      summary: /We've been working with Power BI since 2018/,
      explorationLabel: "Is it worth hiring a consultancy?",
      exploration: "/articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026",
    },
    {
      tab: "Embedded Analytics",
      summary: /We believe embedded analytics is the future of data analytics/,
      explorationLabel: "Explore Embedded Analytics",
      exploration: "https://embedsy.io/",
    },
    {
      tab: "Data & AI",
      summary: /We build AI on top of your data working on real problems/,
      explorationLabel: "Explore AI Integrations",
      exploration: undefined,
    },
    {
      tab: "CFO + BI",
      summary: /We often work with CFOs/,
      explorationLabel: "Explore CFO + BI",
      exploration: "/services/cfo-bi/",
    },
  ];

  for (const item of expected) {
    await services.getByRole("tab", { name: item.tab }).click();
    const panel = services.locator('[role="tabpanel"]:not([hidden])');
    await expect(panel.locator(".services-stage-summary")).toHaveText(item.summary);
    await expect(panel.locator("li")).toHaveCount(3);

    const cta = panel.getByRole("link", { name: "Book a discovery call" });
    await expect(cta).toHaveAttribute("href", BOOKINGS_URL);

    const exploration = panel.getByRole("link", { name: item.explorationLabel, exact: true });
    if (item.exploration) {
      await expect(exploration).toHaveAttribute("href", item.exploration);
    } else {
      await expect(exploration).toHaveCount(0);
    }
  }

  await services.getByRole("link", { name: "Explore CFO + BI", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/cfo-bi\/$/);
  await expect(page.locator("#cfo-title")).toBeVisible();
});

test("embedded analytics remains a framed placeholder until a source is supplied", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const services = page.locator("#services");
  await services.getByRole("tab", { name: "Embedded Analytics" }).click();

  const visual = services.locator('[data-service-panel="embedded-analytics"] [data-embedded-visual]');
  await expect(visual).toHaveAttribute("data-source", "");
  await expect(visual.locator("[data-embed-frame]")).toBeHidden();
  await expect(visual.locator("[data-embed-placeholder]")).toBeVisible();
  await expect(visual.getByText("Analytics preview coming soon")).toBeVisible();
});
