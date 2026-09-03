import type { Locale } from "../lib/site";

export interface NavItem {
  label: string;
  href: string;
  homeHref: string;
}

const en: NavItem[] = [
  { label: "Services", href: "/#services", homeHref: "#services" },
  { label: "Articles", href: "/articles", homeHref: "/articles" },
  { label: "Portfolio", href: "/#portfolio", homeHref: "#portfolio" },
  { label: "Team", href: "/#team", homeHref: "#team" },
  { label: "Testimonials", href: "/#testimonials", homeHref: "#testimonials" },
  { label: "Contact", href: "/#contact", homeHref: "#contact" },
];

/** Romanian copy pending; English until translated. */
export const navigation: Record<Locale, NavItem[]> = {
  en,
  ro: en,
};
