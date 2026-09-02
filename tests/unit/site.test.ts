import { describe, expect, it } from "vitest";
import { getSiteConfig, hreflangLinks, peerUrl } from "../../src/lib/site";

const enEnv = {
  PUBLIC_SITE_LOCALE: "en",
  PUBLIC_SITE_URL: "https://www.storiesofdata.com",
};

const roEnv = {
  PUBLIC_SITE_LOCALE: "ro",
  PUBLIC_SITE_URL: "https://www.storiesofdata.ro",
};

describe("getSiteConfig", () => {
  it("builds the English site", () => {
    const site = getSiteConfig(enEnv);
    expect(site.locale).toBe("en");
    expect(site.url).toBe("https://www.storiesofdata.com");
    expect(site.peer.locale).toBe("ro");
    expect(site.peer.url).toBe("https://www.storiesofdata.ro");
  });

  it("builds the Romanian site", () => {
    const site = getSiteConfig(roEnv);
    expect(site.locale).toBe("ro");
    expect(site.peer.locale).toBe("en");
    expect(site.peer.url).toBe("https://www.storiesofdata.com");
  });

  it("rejects an unknown locale", () => {
    expect(() =>
      getSiteConfig({ PUBLIC_SITE_LOCALE: "de", PUBLIC_SITE_URL: "https://x.test" }),
    ).toThrow(/PUBLIC_SITE_LOCALE/);
  });

  it("strips a trailing slash on the site URL", () => {
    const site = getSiteConfig({
      PUBLIC_SITE_LOCALE: "en",
      PUBLIC_SITE_URL: "https://www.storiesofdata.com/",
    });
    expect(site.url).toBe("https://www.storiesofdata.com");
  });
});

describe("hreflangLinks", () => {
  it("emits en, ro, and x-default for a path", () => {
    const links = hreflangLinks("/articles/example", getSiteConfig(enEnv));
    expect(links).toEqual([
      { lang: "en", href: "https://www.storiesofdata.com/articles/example" },
      { lang: "ro", href: "https://www.storiesofdata.ro/articles/example" },
      { lang: "x-default", href: "https://www.storiesofdata.com/articles/example" },
    ]);
  });
});

describe("peerUrl", () => {
  it("points English pages at the .ro host", () => {
    expect(peerUrl("/portfolio/btr-business-case-study", getSiteConfig(enEnv))).toBe(
      "https://www.storiesofdata.ro/portfolio/btr-business-case-study",
    );
  });
});
