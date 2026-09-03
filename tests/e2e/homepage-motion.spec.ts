import { expect, test } from "@playwright/test";

test("desktop Services nav moves to services-and-products", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");
  await page.locator("header").getByRole("link", { name: "Services" }).click();

  const section = page.locator('[data-section-name="services-and-products"]');
  await expect
    .poll(async () => {
      const hash = new URL(page.url()).hash;
      const inView = await section.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.45 && rect.bottom > 80;
      });
      return hash === "#services" || inView;
    })
    .toBe(true);

  await expect(section).toHaveAttribute("data-section-name", "services-and-products");
});

test("mobile does not apply section snap", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");

  const targetY = await page.evaluate(() => {
    const second = document.querySelectorAll<HTMLElement>(".section")[1];
    if (!second) return 240;
    return window.scrollY + second.getBoundingClientRect().top - 220;
  });

  await page.evaluate((y) => window.scrollTo(0, y), targetY);
  await page.waitForTimeout(700);

  const after = await page.evaluate(() => window.scrollY);
  expect(Math.abs(after - targetY)).toBeLessThan(40);

  const visibleCount = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".section")].filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }).length,
  );
  expect(visibleCount).toBeGreaterThan(1);
});
