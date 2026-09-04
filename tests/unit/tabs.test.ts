import { describe, expect, it } from "vitest";
import { selectTab } from "../../src/components/home/Tabs";

describe("selectTab", () => {
  it("activates the matching panel id", () => {
    const tabs = [
      { id: "portfolio", selected: true },
      { id: "articles", selected: false },
      { id: "case-studies", selected: false },
    ];
    expect(selectTab(tabs, "articles")).toEqual([
      { id: "portfolio", selected: false },
      { id: "articles", selected: true },
      { id: "case-studies", selected: false },
    ]);
  });

  it("ignores unknown ids", () => {
    const tabs = [{ id: "portfolio", selected: true }];
    expect(selectTab(tabs, "nope")).toEqual(tabs);
  });
});
