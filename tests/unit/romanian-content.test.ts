import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { home } from "../../src/data/home";
import { navigation } from "../../src/data/navigation";
import { services } from "../../src/data/services";
import { team } from "../../src/data/team";
import { testimonials } from "../../src/data/testimonials";

const translatedEntries = [
  "articles/become-truly-data-driven-and-you-will-certainly-fail/ro.mdx",
  "articles/full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026/ro.mdx",
  "articles/how-to-turn-your-power-bi-reports-into-a-subscription-based-app/ro.mdx",
  "articles/how-top-companies-capitalize-on-embedded-analytics/ro.mdx",
  "articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026/ro.mdx",
  "articles/microsoft-fabric-medallion-architecture-lessons-learned/ro.mdx",
  "portfolio/a-nobel-prize-data-story/ro.mdx",
  "portfolio/a-romanian-data-story/ro.mdx",
  "portfolio/advanced-matrix-visual-built-with-deneb-in-power-bi/ro.mdx",
  "portfolio/btr-business-case-study/ro.mdx",
  "portfolio/building-a-better-matrix-visual-with-deneb-in-power-bi/ro.mdx",
  "portfolio/category-comparison-bar-chart-power-bi-custom-visual/ro.mdx",
  "portfolio/chainformation-business-case-study/ro.mdx",
  "portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual/ro.mdx",
  "data-stories/lines-on-maps-in-power-bi/ro.mdx",
  "data-stories/redesigning-linkedin-analytics/ro.mdx",
  "legal/privacy-policy/ro.mdx",
  "legal/terms-and-conditions/ro.mdx",
] as const;

const readContent = (entry: string) =>
  readFileSync(resolve(process.cwd(), "src/content", entry), "utf8");

describe("Romanian locale data", () => {
  it("does not alias English homepage objects", () => {
    expect(home.ro).not.toBe(home.en);
    expect(navigation.ro).not.toBe(navigation.en);
    expect(services.ro).not.toBe(services.en);
    expect(team.ro).not.toBe(team.en);
    expect(testimonials.ro).not.toBe(testimonials.en);
  });

  it("marks translated testimonials", () => {
    expect(testimonials.ro.translationNote).toMatch(/traduse din limba engleză/i);
    expect(testimonials.en.translationNote).toBeUndefined();
  });
});

describe("Romanian content entries", () => {
  it.each(translatedEntries)("%s is marked translated", (entry) => {
    expect(readContent(entry)).toContain("translationStatus: translated");
  });

  it("keeps Terms empty after translated metadata", () => {
    const source = readContent("legal/terms-and-conditions/ro.mdx");
    const body = source.replace(/^---[\s\S]*?---/, "").trim();
    expect(body).toBe("<p></p>");
  });
});
