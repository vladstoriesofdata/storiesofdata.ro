import { describe, expect, it } from "vitest";
import {
  absoluteAssetUrl,
  getSiteConfig,
  hreflangLinks,
  peerUrl,
  withBase,
} from "../../src/lib/site";

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

describe("withBase", () => {
  it("leaves root-relative paths unchanged when base is /", () => {
    expect(withBase("/privacy-policy")).toBe("/privacy-policy");
    expect(withBase("/")).toBe("/");
    expect(withBase("/#contact")).toBe("/#contact");
  });

  it("prefixes paths for a GitHub Pages project site", () => {
    expect(withBase("/", "/storiesofdata.ro")).toBe("/storiesofdata.ro");
    expect(withBase("/articles/example", "/storiesofdata.ro/")).toBe(
      "/storiesofdata.ro/articles/example",
    );
    expect(withBase("/#contact", "/storiesofdata.ro")).toBe(
      "/storiesofdata.ro/#contact",
    );
  });

  it("does not prefix hashes or absolute URLs", () => {
    expect(withBase("#contact", "/storiesofdata.ro")).toBe("#contact");
    expect(withBase("https://www.storiesofdata.ro", "/storiesofdata.ro")).toBe(
      "https://www.storiesofdata.ro",
    );
  });
});

describe("absoluteAssetUrl", () => {
  it("resolves hashed assets against the site origin", () => {
    expect(absoluteAssetUrl("/_astro/og.jpg", getSiteConfig(enEnv))).toBe(
      "https://www.storiesofdata.com/_astro/og.jpg",
    );
  });

  it("does not double the GitHub Pages repo path", () => {
    const pages = getSiteConfig({
      PUBLIC_SITE_LOCALE: "en",
      PUBLIC_SITE_URL: "https://vladstoriesofdata.github.io/storiesofdata.ro",
    });
    expect(absoluteAssetUrl("/storiesofdata.ro/_astro/og.jpg", pages)).toBe(
      "https://vladstoriesofdata.github.io/storiesofdata.ro/_astro/og.jpg",
    );
  });
});
