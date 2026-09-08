import { describe, expect, it } from "vitest";
import {
  VIEW_ORDER,
  initialView,
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

  it("starts on subjects when the summary wrapper is already hidden", () => {
    expect(initialView({ classList: { contains: (token: string) => token === "hide" } })).toBe("subjects");
    expect(initialView({ classList: { contains: () => false } })).toBe("summary");
    expect(initialView(null)).toBe("summary");
  });
});
