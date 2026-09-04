import type { Locale } from "../lib/site";

export interface NavItem {
  label: string;
  href: string;
  homeHref: string;
}

const en: NavItem[] = [
  { label: "what we do", href: "/#what-we-do", homeHref: "#what-we-do" },
  { label: "services", href: "/#services", homeHref: "#services" },
  { label: "portfolio", href: "/#portfolio", homeHref: "#portfolio" },
  { label: "team", href: "/#team", homeHref: "#team" },
  { label: "testimonials", href: "/#testimonials", homeHref: "#testimonials" },
  { label: "contact", href: "/#contact", homeHref: "#contact" },
];

/** Romanian copy pending; English until translated. */
export const navigation: Record<Locale, NavItem[]> = {
  en,
  ro: en,
};
