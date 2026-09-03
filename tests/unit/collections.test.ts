import { describe, expect, it } from "vitest";
import { entryLocale, entrySlug, isLocaleEntry } from "../../src/lib/collections";

describe("entrySlug", () => {
  it("strips the locale suffix", () => {
    expect(entrySlug("microsoft-fabric-medallion-architecture-lessons-learned/en")).toBe(
      "microsoft-fabric-medallion-architecture-lessons-learned",
    );
  });
});

describe("entryLocale", () => {
  it("reads the trailing locale", () => {
    expect(entryLocale("a-romanian-data-story/ro")).toBe("ro");
  });
});

describe("isLocaleEntry", () => {
  it("matches the active locale only", () => {
    expect(isLocaleEntry("lines-on-maps-in-power-bi/en", "en")).toBe(true);
    expect(isLocaleEntry("lines-on-maps-in-power-bi/en", "ro")).toBe(false);
  });
});
