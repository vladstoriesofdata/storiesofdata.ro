import { describe, expect, it } from "vitest";
import { navigation } from "../../src/data/navigation";

describe("navigation", () => {
  it("matches the original homepage items plus no Articles", () => {
    expect(navigation.en.map((item) => item.label)).toEqual([
      "what we do",
      "services",
      "portfolio",
      "team",
      "testimonials",
      "contact",
    ]);
    expect(navigation.en.some((item) => /article/i.test(item.label))).toBe(false);
  });

  it("uses hash targets SectionSnap already understands", () => {
    expect(navigation.en.map((item) => item.homeHref)).toEqual([
      "#what-we-do",
      "#services",
      "#portfolio",
      "#team",
      "#testimonials",
      "#contact",
    ]);
  });

  it("keeps Romanian labels identical until translation exists", () => {
    expect(navigation.ro).toEqual(navigation.en);
  });
});
