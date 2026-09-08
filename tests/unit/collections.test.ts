import { describe, expect, it } from "vitest";
import {
  adjacentNav,
  byPubDateDesc,
  entryLocale,
  entrySlug,
  isLocaleEntry,
  pagerKindLabel,
} from "../../src/lib/collections";

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

describe("byPubDateDesc", () => {
  it("sorts newer first and uses slug when dates match", () => {
    const entries = [
      { id: "zeta/en", data: { pubDate: new Date("2026-09-01") } },
      { id: "alpha/en", data: { pubDate: new Date("2026-09-01") } },
      { id: "newest/en", data: { pubDate: new Date("2026-09-02") } },
    ];
    expect(byPubDateDesc(entries).map((entry) => entry.id)).toEqual([
      "newest/en",
      "alpha/en",
      "zeta/en",
    ]);
  });
});

describe("adjacentNav", () => {
  const entries = [
    { id: "first/en" },
    { id: "second/en" },
    { id: "third/en" },
  ];

  it("returns 1-based index, total, and wrapped neighbors", () => {
    expect(adjacentNav(entries, "second/en", "/articles")).toEqual({
      index: 2,
      total: 3,
      prev: { slug: "first", href: "/articles/first/" },
      next: { slug: "third", href: "/articles/third/" },
    });
  });

  it("wraps from the last entry to the first", () => {
    const nav = adjacentNav(entries, "third/en", "/portfolio");
    expect(nav?.index).toBe(3);
    expect(nav?.prev.href).toBe("/portfolio/second/");
    expect(nav?.next.href).toBe("/portfolio/first/");
  });

  it("returns null when the current entry is missing", () => {
    expect(adjacentNav(entries, "missing/en", "/articles")).toBeNull();
  });
});

describe("pagerKindLabel", () => {
  it("uses PROJECT for portfolio and case studies, ARTICLE for articles", () => {
    expect(pagerKindLabel("portfolio", "en")).toBe("PROJECT");
    expect(pagerKindLabel("articles", "en")).toBe("ARTICLE");
    expect(pagerKindLabel("dataStories", "en")).toBe("PROJECT");
  });

  it("uses ARTICOL instead of PROIECT on Romanian articles", () => {
    expect(pagerKindLabel("portfolio", "ro")).toBe("PROIECT");
    expect(pagerKindLabel("articles", "ro")).toBe("ARTICOL");
    expect(pagerKindLabel("dataStories", "ro")).toBe("PROIECT");
  });
});
