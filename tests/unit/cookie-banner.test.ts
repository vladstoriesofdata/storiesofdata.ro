import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const banner = readFileSync(
  new URL("../../src/components/CookieBanner.astro", import.meta.url),
  "utf8",
);

describe("CookieBanner", () => {
  it("does not leave Iubenda's US privacy widget at the end of posts", () => {
    expect(banner).toContain("usPreferencesWidgetDisplay: false");
    expect(banner).toMatch(/\.iub__us-widget\s*\{[^}]*display:\s*none\s*!important/);
  });
});
