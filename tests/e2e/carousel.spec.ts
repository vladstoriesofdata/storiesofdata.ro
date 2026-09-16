import { expect, test, type Locator, type Page } from "@playwright/test";

const sections = ["portfolio", "testimonials"] as const;
test.beforeEach(async ({ context }) => {
  // Keep the external consent overlay from intercepting carousel gestures.
  await context.route(/iubenda\.com/, route => route.abort());
});
function carousel(page: Page, section: string, mode = "desktop") {
  return page.locator(`#${section} .${section}-carousel-${mode}`).filter({ visible: true }).first();
}

async function aligned(root: Locator, index: number) {
  await expect(root).toHaveAttribute("data-carousel-index", String(index));
  await expect.poll(() => root.evaluate((el, i) => {
    const frame = el.querySelector("[data-carousel-viewport]")!;
    const viewport = frame.getBoundingClientRect();
    const slide = el.querySelectorAll("[data-slide]")[i].getBoundingClientRect();
    return Math.abs(slide.left - viewport.left - parseFloat(getComputedStyle(frame).paddingLeft));
  }, index)).toBeLessThan(6);
}

for (const section of sections) {
  test(`${section} slides between desktop pages and keeps inactive content inert`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const root = carousel(page, section);
    await expect(root).toHaveAttribute("data-carousel-index", "0");
    const movement = await root.evaluate(async (el) => {
      const first = el.querySelector("[data-slide]")!;
      const before = first.getBoundingClientRect().left;
      (el.querySelector('[data-carousel-dot="1"]') as HTMLElement).click();
      const samples: number[] = [];
      const start = performance.now();
      while (performance.now() - start < 650) {
        await new Promise(requestAnimationFrame);
        samples.push(first.getBoundingClientRect().left - before);
      }
      return samples;
    });
    expect(new Set(movement.map(Math.round)).size).toBeGreaterThan(3);
    await aligned(root, 1);
    await expect(root.locator('[data-carousel-dot="1"]')).toHaveCSS("background-color", "rgb(0, 209, 142)");
    await expect(root.locator('[data-carousel-dot="0"]')).toHaveCSS("background-color", "rgb(51, 51, 51)");
    await expect(root.locator("[data-slide]").first()).toHaveAttribute("inert", "");
    await root.locator('[data-carousel-dot="0"]').click();
    await aligned(root, 0);
    await root.evaluate(async (el) => {
      (el.querySelector('[data-carousel-dot="1"]') as HTMLElement).click();
      await new Promise(resolve => setTimeout(resolve, 100));
      (el.querySelector('[data-carousel-dot="0"]') as HTMLElement).click();
    });
    await aligned(root, 0);
    await expect.poll(() => root.locator("[data-carousel-track]").evaluate(el => el.getAnimations().length)).toBe(0);
    await root.locator('[data-carousel-dot="0"]').click();
    await aligned(root, 0);
  });
}

test("Portfolio dots have the correct colors without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const root = carousel(page, "portfolio");
  await expect(root.locator('[data-carousel-dot="0"]')).toHaveCSS("background-color", "rgb(0, 209, 142)");
  await expect(root.locator('[data-carousel-dot="1"]')).toHaveCSS("background-color", "rgb(51, 51, 51)");
  await context.close();
});

test.describe("mobile touch navigation", () => {
  test.use({ viewport: { width: 375, height: 800 }, hasTouch: true, isMobile: true });
  test("a short drag suppresses its click but preserves the next tap", async ({ page }) => {
    await page.goto("/");
    const root = carousel(page, "portfolio", "mobile");
    await aligned(root, 0);
    const link = root.locator("a[data-slide]").first();
    const href = await link.getAttribute("href");
    // Explicitly include the compatibility click: Chromium's touch slop differs by platform.
    const clickAllowed = await link.evaluate((el) => {
      const pointer = { bubbles: true, pointerId: 1, pointerType: "touch", isPrimary: true, clientY: 80 };
      el.dispatchEvent(new PointerEvent("pointerdown", { ...pointer, clientX: 100 }));
      el.dispatchEvent(new PointerEvent("pointerup", { ...pointer, clientX: 112 }));
      return el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, detail: 1 }));
    });
    expect(clickAllowed).toBe(false);
    await aligned(root, 0);
    await link.tap();
    await expect(page).toHaveURL(new RegExp(href!));
  });
  test("a Portfolio card still opens on a normal tap after swiping", async ({ page, context }) => {
    await page.goto("/");
    const root = carousel(page, "portfolio", "mobile");
    await expect(root).toHaveAttribute("data-carousel-index", "0");
    const viewport = root.locator("[data-carousel-viewport]");
    await viewport.scrollIntoViewIfNeeded();
    const box = (await viewport.boundingBox())!;
    const client = await context.newCDPSession(page);
    const y = box.y + 80;
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 300, y }] });
    await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 140, y }] });
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await aligned(root, 1);
    const link = root.locator("a[data-slide]").nth(1);
    const href = await link.getAttribute("href");
    await link.tap();
    await expect(page).toHaveURL(new RegExp(href!));
    await client.detach();
  });
  for (const section of sections) {
    test(`${section} swipes without opening links and allows vertical scrolling`, async ({ page, context }) => {
      await page.goto("/");
      const root = carousel(page, section, "mobile");
      await expect(root).toHaveAttribute("data-carousel-index", "0");
      await expect(root.locator("[data-carousel-prev]")).toBeHidden();
      await expect(root.locator("[data-carousel-next]")).toBeHidden();
      const viewport = root.locator("[data-carousel-viewport]");
      await viewport.scrollIntoViewIfNeeded();
      const box = (await viewport.boundingBox())!;
      const client = await context.newCDPSession(page);
      const y = Math.min(box.y + 80, 650);
      async function swipe(x: number, dx: number, dy = 0) {
        await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
        for (let i = 1; i <= 6; i++) {
          await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + dx * i / 6, y: y + dy * i / 6 }] });
        }
        await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      }
      const url = page.url();
      await swipe(box.x + box.width - 35, -160);
      await aligned(root, 1);
      expect(page.url()).toBe(url);
      await swipe(box.x + 35, 160);
      await aligned(root, 0);
      await swipe(box.x + 100, 12);
      await aligned(root, 0);
      await swipe(box.x + 35, 160);
      await aligned(root, (await root.locator("[data-slide]").count()) - 1);
      await swipe(box.x + box.width - 35, -160);
      await aligned(root, 0);
      await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + 150, y }] });
      await client.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
      await aligned(root, 0);
      const startY = await page.evaluate(() => window.scrollY);
      await swipe(box.x + 100, 0, -70);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(startY);
      await expect(root).toHaveAttribute("data-carousel-index", "0");
      await client.detach();
    });
  }
});

test("reduced motion, rapid selection, tabs and responsive layouts settle correctly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const section of sections) {
    const root = carousel(page, section);
    await expect(root).toHaveAttribute("data-carousel-index", "0");
    await root.evaluate((el) => {
      for (const i of [1, 0, 1]) (el.querySelector(`[data-carousel-dot="${i}"]`) as HTMLElement).click();
    });
    await aligned(root, 1);
    expect(await root.locator("[data-carousel-track]").evaluate(el => el.getAnimations().length)).toBe(0);
  }
  for (const width of [765, 766, 375, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const tab of await page.locator("#portfolio [role=tab]").all()) {
      await tab.click();
      const root = carousel(page, "portfolio", width <= 765 ? "mobile" : "desktop");
      await expect.poll(() => root.locator("[data-carousel-viewport]").evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

