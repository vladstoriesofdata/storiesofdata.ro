import { describe, expect, it } from "vitest";
import { frameForProgress } from "../../src/components/home/lottieGraphics";
import { headerToneForSection, stepsProgressForSection } from "../../src/components/home/SectionSnap";

describe("stepsProgressForSection", () => {
  it("keeps the morphing steps graphic at the start on the first viewport", () => {
    expect(stepsProgressForSection("what-we-do")).toBe(0);
    expect(stepsProgressForSection(undefined)).toBe(0);
  });

  it("reveals only the first portion after the first scroll", () => {
    expect(stepsProgressForSection("to-shape")).toBeCloseTo(0.2);
  });

  it("scrubs through the remaining What we do chapters", () => {
    expect(stepsProgressForSection("we-build-applications")).toBeCloseTo(0.4);
    expect(stepsProgressForSection("we-embed-analytics")).toBeCloseTo(0.6);
    expect(stepsProgressForSection("we-design-visualizations")).toBeCloseTo(0.8);
    expect(stepsProgressForSection("we-are-power-bi-experts")).toBe(1);
  });

  it("holds the last frame on services and later sections", () => {
    expect(stepsProgressForSection("services-and-products")).toBe(1);
    expect(stepsProgressForSection("portfolio")).toBe(1);
  });
});

describe("headerToneForSection", () => {
  it("uses a light current-item color on the green services section", () => {
    expect(headerToneForSection("services-and-products")).toBe("accent");
  });

  it("keeps the dark contact header and default elsewhere", () => {
    expect(headerToneForSection("contact")).toBe("dark");
    expect(headerToneForSection("portfolio")).toBe("default");
    expect(headerToneForSection("what-we-do")).toBe("default");
    expect(headerToneForSection(undefined)).toBe("default");
  });
});

describe("frameForProgress", () => {
  it("maps 0 to the first frame and 1 to the last", () => {
    expect(frameForProgress(251, 0)).toBe(0);
    expect(frameForProgress(251, 1)).toBe(250);
    expect(frameForProgress(251, 0.2)).toBeCloseTo(50);
  });
});
