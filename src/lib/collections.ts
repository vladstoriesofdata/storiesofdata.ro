import type { Locale } from "./site";

export type PagerKind = "portfolio" | "articles" | "dataStories";

export interface AdjacentItem {
  slug: string;
  href: string;
}

export interface AdjacentNav {
  index: number;
  total: number;
  prev: AdjacentItem;
  next: AdjacentItem;
}

const PAGER_KIND_LABEL: Record<Locale, Record<PagerKind, string>> = {
  en: { portfolio: "PROJECT", articles: "ARTICLE", dataStories: "PROJECT" },
  ro: { portfolio: "PROIECT", articles: "ARTICOL", dataStories: "PROIECT" },
};

export function entrySlug(id: string): string {
  return id.replace(/\/(en|ro)$/, "");
}

export function entryLocale(id: string): Locale {
  if (id.endsWith("/ro")) return "ro";
  if (id.endsWith("/en")) return "en";
  throw new Error(`Content id '${id}' must end with /en or /ro`);
}

export function isLocaleEntry(id: string, locale: Locale): boolean {
  return entryLocale(id) === locale;
}

export function byPubDateDesc<T extends { id: string; data: { pubDate: Date } }>(
  entries: T[],
): T[] {
  return [...entries].sort((a, b) => {
    const date = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    if (date !== 0) return date;
    return entrySlug(a.id).localeCompare(entrySlug(b.id));
  });
}

export function adjacentNav(
  entries: { id: string }[],
  currentId: string,
  hrefBase: string,
): AdjacentNav | null {
  const index = entries.findIndex((entry) => entry.id === currentId);
  if (index < 0 || entries.length === 0) return null;
  const total = entries.length;
  const prev = entries[(index - 1 + total) % total];
  const next = entries[(index + 1) % total];
  return {
    index: index + 1,
    total,
    prev: { slug: entrySlug(prev.id), href: `${hrefBase}/${entrySlug(prev.id)}/` },
    next: { slug: entrySlug(next.id), href: `${hrefBase}/${entrySlug(next.id)}/` },
  };
}

export function pagerKindLabel(kind: PagerKind, locale: Locale): string {
  return PAGER_KIND_LABEL[locale][kind];
}
