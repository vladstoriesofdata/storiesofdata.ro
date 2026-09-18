import { describe, expect, it } from "vitest";
import {
  createServicesState,
  isServiceActive,
  selectService,
  setServicesMode,
} from "../../src/components/home/ServicesInteraction";

describe("services interaction state", () => {
  it("selects a valid service", () => {
    const state = selectService(createServicesState("desktop"), "ai-integrations");

    expect(state.activeId).toBe("ai-integrations");
  });

  it("ignores an unknown service id", () => {
    const state = createServicesState("desktop");

    expect(selectService(state, "not-a-service")).toEqual(state);
  });

  it("keeps exactly one service active after a selection", () => {
    const state = selectService(createServicesState("desktop"), "cfo-bi");
    const active = ["microsoft-fabric", "embedded-analytics", "ai-integrations", "cfo-bi"].filter(
      (id) => isServiceActive(state, id),
    );

    expect(active).toEqual(["cfo-bi"]);
  });

  it("preserves the active service when the responsive mode changes", () => {
    const selected = selectService(createServicesState("desktop"), "embedded-analytics");
    const mobile = setServicesMode(selected, "mobile");

    expect(mobile).toEqual({ activeId: "embedded-analytics", mode: "mobile" });
  });
});
