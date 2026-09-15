import { describe, expect, it } from "vitest";
import { frameForProgress } from "../../src/components/home/lottieGraphics";
import {
  headerToneForSection,
  interpolateProgressAlongCenters,
  scrollProgressThroughBlock,
  stepsProgressForSection,
  stepsProgressFromWhatWeDoScroll,
  stepsVisibleFromWhatWeDoScroll,
} from "../../src/components/home/SectionSnap";

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

describe("scrollProgressThroughBlock", () => {
  it("returns 0 at the top and 1 at the bottom of a scrollable block", () => {
    expect(scrollProgressThroughBlock(0, 2000, 0, 800)).toBe(0);
    expect(scrollProgressThroughBlock(0, 2000, 1200, 800)).toBe(1);
    expect(scrollProgressThroughBlock(0, 2000, 600, 800)).toBeCloseTo(0.5);
  });
});

describe("stepsProgressFromWhatWeDoScroll", () => {
  it("matches the legacy mobile keyframes before the steps morph begins", () => {
    expect(stepsProgressFromWhatWeDoScroll(0.24)).toBe(0);
    expect(stepsProgressFromWhatWeDoScroll(0.25)).toBe(0);
  });

  it("scrubs through the middle of the what-we-do block", () => {
    expect(stepsProgressFromWhatWeDoScroll(0.475)).toBeCloseTo(0.5);
    expect(stepsProgressFromWhatWeDoScroll(0.7)).toBe(1);
    expect(stepsProgressFromWhatWeDoScroll(0.9)).toBe(1);
  });
});

describe("stepsVisibleFromWhatWeDoScroll", () => {
  it("shows the steps graphic only during the mobile scroll window", () => {
    expect(stepsVisibleFromWhatWeDoScroll(0.2)).toBe(false);
    expect(stepsVisibleFromWhatWeDoScroll(0.3)).toBe(true);
    expect(stepsVisibleFromWhatWeDoScroll(0.24)).toBe(true);
    expect(stepsVisibleFromWhatWeDoScroll(0.901)).toBe(false);
  });
});

describe("interpolateProgressAlongCenters", () => {
  it("maps the reading line to chapter progress", () => {
    const points = [
      { progress: 0, center: 300 },
      { progress: 0.2, center: 700 },
      { progress: 0.4, center: 1100 },
      { progress: 0.6, center: 1500 },
      { progress: 0.8, center: 1900 },
      { progress: 1, center: 2300 },
    ];

    expect(interpolateProgressAlongCenters(300, points)).toBe(0);
    expect(interpolateProgressAlongCenters(2300, points)).toBe(1);
    expect(interpolateProgressAlongCenters(1500, points)).toBeCloseTo(0.6);
    expect(interpolateProgressAlongCenters(1300, points)).toBeCloseTo(0.5);
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
