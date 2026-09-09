import { describe, expect, it } from "vitest";
import { pageScrollProgress } from "../../src/components/work/scrollScrub";

describe("pageScrollProgress", () => {
  it("is 0 at the top of the page", () => {
    expect(pageScrollProgress(0, 2000, 800)).toBe(0);
  });

  it("is 1 when the page is fully scrolled", () => {
    expect(pageScrollProgress(1200, 2000, 800)).toBe(1);
  });

  it("maps the midpoint of the scroll range", () => {
    expect(pageScrollProgress(600, 2000, 800)).toBe(0.5);
  });

  it("stays at 0 when the page does not scroll", () => {
    expect(pageScrollProgress(0, 800, 800)).toBe(0);
  });

  it("clamps values outside the scroll range", () => {
    expect(pageScrollProgress(-20, 2000, 800)).toBe(0);
    expect(pageScrollProgress(5000, 2000, 800)).toBe(1);
  });
});
