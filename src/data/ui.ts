import type { Locale } from "../lib/site";

export interface UiCopy {
  menu: string;
  closeMenu: string;
  workMenuLabel: string;
  projects: string;
  articles: string;
  caseStudies: string;
  portfolio: string;
  dataStories: string;
  privacyPolicy: string;
  terms: string;
  legalLabel: string;
}

const en: UiCopy = {
  menu: "menu",
  closeMenu: "Close menu",
  workMenuLabel: "Work",
  projects: "Projects",
  articles: "Articles",
  caseStudies: "Case studies",
  portfolio: "Portfolio",
  dataStories: "Data stories",
  privacyPolicy: "Privacy policy",
  terms: "Terms",
  legalLabel: "Legal",
};

const ro: UiCopy = {
  menu: "meniu",
  closeMenu: "Închide meniul",
  workMenuLabel: "Proiecte și articole",
  projects: "Proiecte",
  articles: "Articole",
  caseStudies: "Studii de caz",
  portfolio: "Portofoliu",
  dataStories: "Povești bazate pe date",
  privacyPolicy: "Politica de confidențialitate",
  terms: "Termeni și condiții",
  legalLabel: "Informații juridice",
};

export const ui: Record<Locale, UiCopy> = { en, ro };
