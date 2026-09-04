import { describe, expect, it } from "vitest";
import {
  VIEW_ORDER,
  nextView,
  prevView,
  wrapperSelector,
} from "../../src/components/work/ViewZoom";

describe("ViewZoom helpers", () => {
  it("orders summary → subjects → detail", () => {
    expect(VIEW_ORDER).toEqual(["summary", "subjects", "detail"]);
  });

  it("advances and stops at detail", () => {
    expect(nextView("summary")).toBe("subjects");
    expect(nextView("subjects")).toBe("detail");
    expect(nextView("detail")).toBe("detail");
  });

  it("retreats and stops at summary", () => {
    expect(prevView("detail")).toBe("subjects");
    expect(prevView("subjects")).toBe("summary");
    expect(prevView("summary")).toBe("summary");
  });

  it("maps to cloned wrapper classes", () => {
    expect(wrapperSelector("summary")).toBe(".cs-planetary-wrapper");
    expect(wrapperSelector("subjects")).toBe(".cs-mountaintop-wrapper");
    expect(wrapperSelector("detail")).toBe(".cs-grassroot-wrapper");
  });
});
