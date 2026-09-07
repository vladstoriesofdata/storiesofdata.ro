import { resolveLegacyImages } from "../../src/lib/resolveLegacyImages";
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
