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
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");

  await expect(page.locator("html")).not.toHaveClass(/homepage-snap/);

  await page.mouse.move(180, 360);
  const startY = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 420);
  await expect
    .poll(async () => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(startY);

  await expect
    .poll(async () => {
      const visible = await page.evaluate(
        () =>
          [...document.querySelectorAll<HTMLElement>(".section")].filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          }).length,
      );
      if (visible > 1) return visible;
      await page.mouse.wheel(0, 480);
      return page.evaluate(
        () =>
          [...document.querySelectorAll<HTMLElement>(".section")].filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          }).length,
      );
    })
    .toBeGreaterThan(1);

  await expect(page.locator("html")).not.toHaveClass(/homepage-snap/);
});
