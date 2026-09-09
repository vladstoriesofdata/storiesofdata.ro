import {
  enhanceAnalyticsLayout,
  resolveLegacyImages,
} from "../../src/lib/resolveLegacyImages";
import { describe, expect, it } from "vitest";

describe("resolveLegacyImages", () => {
  it("prefixes ./images/ with the page path even without a trailing slash", () => {
    const html =
      '<img src="./images/chart.png" srcset="./images/chart-p-500.png 500w" />';
    expect(resolveLegacyImages(html, "/articles/example")).toBe(
      '<img src="/articles/example/images/chart.png" srcset="/articles/example/images/chart-p-500.png 500w" />',
    );
  });

  it("strips a trailing slash from the page path", () => {
    expect(
      resolveLegacyImages('<img src="./images/a.png" />', "/portfolio/btr/"),
    ).toBe('<img src="/portfolio/btr/images/a.png" />');
  });
});

describe("enhanceAnalyticsLayout", () => {
  it("marks the LinkedIn Lottie for scroll scrubbing", () => {
    const html =
      '<div class="stickyimg-gv analytics-anim" data-src="./images/okay.json"></div>';
    expect(enhanceAnalyticsLayout(html)).toContain("data-lottie");
    expect(enhanceAnalyticsLayout(html)).toContain('data-scrub="1"');
  });

  it("adds the desktop-only warning for the analytics article", () => {
    const html = '<div class="cs-grassroot-wrapper analytics-blogpost"></div>';
    expect(enhanceAnalyticsLayout(html)).toContain("warning-mobile-wrapper");
    expect(enhanceAnalyticsLayout(html)).toContain("only available on desktop");
  });

  it("leaves unrelated cloned HTML alone", () => {
    const html = '<div class="cs-grassroot-wrapper"></div>';
    expect(enhanceAnalyticsLayout(html)).toBe(html);
  });
});
