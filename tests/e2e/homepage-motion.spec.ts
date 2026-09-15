import { expect, test } from "@playwright/test";

test("mobile hero hands off to visible chapter animations and clears them at services", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");
  const steps = page.locator(".background-anim-wrapper");
  for (const [name, progress] of [
    ["to-shape", 0.2],
    ["we-build-applications", 0.4],
    ["we-embed-analytics", 0.6],
    ["we-design-visualizations", 0.8],
    ["we-are-power-bi-experts", 1],
  ] as const) {
    await page.evaluate((sectionName) => {
      const heading = document.querySelector(`[data-section-name="${sectionName}"] .hero-lede, [data-section-name="${sectionName}"] .hero-chapter-heading`)!;
      const box = heading.getBoundingClientRect();
      const headerBottom = document.querySelector("header.home-chrome")!.getBoundingClientRect().bottom;
      window.scrollTo(0, window.scrollY + box.top + box.height / 2 - headerBottom - 298);
    }, name);
    await expect(steps).toHaveCSS("opacity", "1");
    await expect.poll(() => page.locator(".mobile-intro-wrapper").evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(0.01);
    await expect.poll(async () => Number(await steps.locator("[data-lottie]").getAttribute("data-lottie-progress"))).toBeCloseTo(progress, 2);
  }
  await page.evaluate(() => {
    const services = document.querySelector('[data-section-name="services-and-products"]')!;
    window.scrollTo(0, window.scrollY + services.getBoundingClientRect().top - 108);
  });
  await expect(steps).toHaveCSS("opacity", "0");
});

test("desktop Services nav moves to services-and-products", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");
  await page.locator("header").getByRole("link", { name: /services/i }).click();

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

  const header = page.locator("header.home-chrome");
  const servicesLink = header.getByRole("link", { name: /services/i });
  await expect(servicesLink).toHaveAttribute("aria-current", "true");
  await expect(header).toHaveClass(/is-on-accent/);
  await expect(servicesLink).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(header.locator(".language-switch [aria-current='true']")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );

  await page.evaluate(() => window.__homepageMoveTo?.("portfolio"));
  await expect(header).not.toHaveClass(/is-on-accent/);
  await expect(header.getByRole("link", { name: /portfolio/i })).toHaveCSS("color", "rgb(0, 209, 142)");
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

test("mobile keeps the animation in a band below the header", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");

  const intro = page.locator(".mobile-intro-wrapper");
  await expect(intro).toBeVisible();
  await expect(intro.locator("[data-lottie]")).toHaveAttribute("data-loop", "1");
  await expect(intro.locator("svg")).toBeVisible();
  await page.waitForFunction(() => {
    const header = document.querySelector("header.home-chrome");
    const height = getComputedStyle(document.documentElement).getPropertyValue("--home-header-height");
    return header instanceof HTMLElement && height.trim().endsWith("px") && Number.parseFloat(height) === header.offsetHeight;
  });

  const geometry = await page.evaluate(() => {
    const header = document.querySelector("header.home-chrome");
    const introEl = document.querySelector(".mobile-intro-wrapper");
    const stepsWrap = document.querySelector(".background-anim-wrapper");
    if (!(header instanceof HTMLElement) || !(introEl instanceof HTMLElement) || !(stepsWrap instanceof HTMLElement)) {
      return null;
    }
    const headerBox = header.getBoundingClientRect();
    const introBox = introEl.getBoundingClientRect();
    const stepsStyle = getComputedStyle(stepsWrap);
    return {
      headerBottom: headerBox.bottom,
      introTop: introBox.top,
      introHeight: introBox.height,
      graphicWidth: introEl.querySelector("svg")!.getBoundingClientRect().width,
      bandWidth: introBox.width,
      stepsTop: stepsStyle.top,
      stepsHeight: stepsStyle.height,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry?.introTop ?? 0).toBeCloseTo(geometry?.headerBottom ?? 0, 0);
  expect(geometry?.introHeight).toBe(250);
  expect(geometry?.graphicWidth).toBeCloseTo(geometry?.bandWidth ?? 0, 0);
  expect(geometry?.stepsTop).toBe(`${Math.round(geometry?.headerBottom ?? 0)}px`);
  expect(geometry?.stepsHeight).toBe("250px");
});

test("mobile scroll scrubs the steps morph through what we do", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");

  const steps = page.locator('.background-anim-wrapper [data-lottie][data-scrub="1"]');
  await expect
    .poll(async () => steps.getAttribute("data-lottie-progress"))
    .toBe("0");

  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect
    .poll(async () => Number(await steps.getAttribute("data-lottie-progress")))
    .toBeGreaterThan(0.45);

  await page.evaluate(() => {
    const target = document.querySelector('[data-section-name="we-are-power-bi-experts"]');
    if (!(target instanceof HTMLElement)) return;
    const readLine =
      (document.querySelector("header.home-chrome")?.getBoundingClientRect().bottom ?? 0) + 298;
    const center = target.getBoundingClientRect().top + target.offsetHeight / 2;
    window.scrollTo(0, window.scrollY + center - readLine);
  });
  await expect
    .poll(async () => Number(await steps.getAttribute("data-lottie-progress")))
    .toBeGreaterThan(0.95);
});

test("desktop steps morph stays at the start until What we do scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");

  const steps = page.locator('.background-anim-wrapper [data-lottie][data-scrub="1"]');
  await expect(steps).toHaveAttribute("data-scrub", "1");
  await expect
    .poll(async () => steps.getAttribute("data-lottie-progress"))
    .toBe("0");

  await page.evaluate(() => window.__homepageMoveTo?.("to-shape"));
  await expect
    .poll(async () => Number(await steps.getAttribute("data-lottie-progress")))
    .toBeCloseTo(0.2, 1);

  await page.evaluate(() => window.__homepageMoveTo?.("we-are-power-bi-experts"));
  await expect
    .poll(async () => Number(await steps.getAttribute("data-lottie-progress")))
    .toBeCloseTo(1, 1);
});

test("desktop intro particles extend under the home nav", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof window.__homepageMoveTo === "function");

  const lottie = page.locator(".hero-intro .section-lottie.lottie-desktop");
  await expect(lottie).toBeVisible();

  const geometry = await page.evaluate(() => {
    const graphic = document.querySelector(".hero-intro .section-lottie.lottie-desktop");
    const heading = document.querySelector(".hero-heading");
    const nav = document.querySelector("header.home-chrome");
    if (!(graphic instanceof HTMLElement) || !(heading instanceof HTMLElement) || !(nav instanceof HTMLElement)) {
      return null;
    }
    const graphicBox = graphic.getBoundingClientRect();
    const headingBox = heading.getBoundingClientRect();
    const navBox = nav.getBoundingClientRect();
    return {
      graphicLeft: graphicBox.left,
      graphicWidth: graphicBox.width,
      headingLeft: headingBox.left,
      navRight: navBox.right,
      viewport: window.innerWidth,
    };
  });

  expect(geometry).not.toBeNull();
  expect(geometry?.graphicLeft).toBeLessThanOrEqual(1);
  expect(geometry?.graphicWidth ?? 0).toBeGreaterThan((geometry?.viewport ?? 0) * 0.95);
  expect(geometry?.headingLeft ?? 0).toBeGreaterThan(geometry?.navRight ?? 0);
});
