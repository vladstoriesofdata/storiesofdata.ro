import type { Locale } from "./site";

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
