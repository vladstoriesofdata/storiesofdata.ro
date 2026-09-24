import { describe, expect, it } from "vitest";
import {
  BOOKINGS_URL,
  SERVICE_IDS,
  VISUAL_KINDS,
  services,
} from "../../src/data/services";

describe("services redesign contract", () => {
  it("exposes the approved service ids and visual kinds in locale data", () => {
    for (const locale of ["en", "ro"] as const) {
      expect(services[locale].items.map((service) => service.id)).toEqual(SERVICE_IDS);
      expect(services[locale].items.map((service) => service.visualKind)).toEqual(VISUAL_KINDS);
    }
  });

  it("provides the shared booking link through each primary CTA", () => {
    expect(services.en.cta).toBe("Book a discovery call");
    expect(services.en.items.every((service) => service.primaryCta === services.en.cta)).toBe(true);
    expect(services.en.items.every((service) => service.primaryCtaUrl === BOOKINGS_URL)).toBe(true);
  });

  it("keeps only the supplied deeper exploration URLs", () => {
    expect(services.en.items.map((service) => service.exploration.url)).toEqual([
      undefined,
      "https://embedsy.io/",
      undefined,
      "https://demo.embedsy.io/embed/studio/63",
    ]);
  });

  it("allows embedded analytics visuals to omit their source while retaining an accessible title", () => {
    const service = services.en.items.find((item) => item.id === "embedded-analytics");
    expect(service?.visualTitle).toBeTruthy();
    expect(service?.visualSource).toBeUndefined();
  });
});
