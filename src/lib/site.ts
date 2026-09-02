export type Locale = "en" | "ro";

export interface SiteConfig {
  locale: Locale;
  url: string;
  name: string;
  peer: { locale: Locale; url: string };
}

const PEER: Record<Locale, { locale: Locale; url: string }> = {
  en: { locale: "ro", url: "https://www.storiesofdata.ro" },
  ro: { locale: "en", url: "https://www.storiesofdata.com" },
};

export interface SiteEnv {
  PUBLIC_SITE_LOCALE?: string;
  PUBLIC_SITE_URL?: string;
}

function stripSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function joinUrl(base: string, path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (suffix === "/") return stripSlash(base);
  return `${stripSlash(base)}${suffix}`;
}

export function getSiteConfig(env: SiteEnv): SiteConfig {
  const locale = env.PUBLIC_SITE_LOCALE;
  if (locale !== "en" && locale !== "ro") {
    throw new Error("PUBLIC_SITE_LOCALE must be 'en' or 'ro'");
  }
  const url = env.PUBLIC_SITE_URL;
  if (!url) {
    throw new Error("PUBLIC_SITE_URL is required");
  }
  return {
    locale,
    url: stripSlash(url),
    name: "Stories of Data",
    peer: PEER[locale],
  };
}

export function absoluteUrl(path: string, site: SiteConfig): string {
  return joinUrl(site.url, path);
}

export function peerUrl(path: string, site: SiteConfig): string {
  return joinUrl(site.peer.url, path);
}

export function hreflangLinks(
  path: string,
  site: SiteConfig,
): { lang: string; href: string }[] {
  const en = joinUrl("https://www.storiesofdata.com", path);
  const ro = joinUrl("https://www.storiesofdata.ro", path);
  return [
    { lang: "en", href: en },
    { lang: "ro", href: ro },
    { lang: "x-default", href: en },
  ];
}
