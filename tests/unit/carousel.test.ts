import { describe, expect, it } from "vitest";
import { nextIndex, prevIndex } from "../../src/components/home/Carousel";

describe("carousel indexes", () => {
  it("wraps forward", () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(nextIndex(2, 3)).toBe(0);
  });

  it("wraps backward", () => {
    expect(prevIndex(0, 3)).toBe(2);
    expect(prevIndex(1, 3)).toBe(0);
  });

  it("stays at 0 when empty", () => {
    expect(nextIndex(0, 0)).toBe(0);
    expect(prevIndex(0, 0)).toBe(0);
  });
});
