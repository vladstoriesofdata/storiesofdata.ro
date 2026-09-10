import type { Locale } from "../lib/site";

export interface UiCopy {
  menu: string;
  closeMenu: string;
  workMenuLabel: string;
  projects: string;
  articles: string;
  caseStudies: string;
  portfolio: string;
  portfolioMoreDetails: string;
  dataStories: string;
  privacyPolicy: string;
  terms: string;
  legalLabel: string;
  namePlaceholder: string;
  switchToEnglish: string;
  switchToRomanian: string;
  previous: string;
  next: string;
  showPage: string;
  showItem: string;
  showTestimonialsPage: string;
  showTestimonialFrom: string;
  postNavigation: string;
  viewLength: string;
  lessDetail: string;
  summaryView: string;
  keySubjectsView: string;
  detailedView: string;
  moreDetail: string;
}

const en: UiCopy = {
  menu: "menu",
  closeMenu: "Close menu",
  workMenuLabel: "Work",
  projects: "Projects",
  articles: "Articles",
  caseStudies: "Case studies",
  portfolio: "Portfolio",
  portfolioMoreDetails: "MORE DETAILS",
  dataStories: "Data stories",
  privacyPolicy: "Privacy policy",
  terms: "Terms",
  legalLabel: "Legal",
  namePlaceholder: "Your Name",
  switchToEnglish: "Switch to English",
  switchToRomanian: "Switch to Romanian",
  previous: "Previous",
  next: "Next",
  showPage: "Show page {page} of {label}",
  showItem: "Show {title}",
  showTestimonialsPage: "Show testimonials page {page}",
  showTestimonialFrom: "Show testimonial from {name}",
  postNavigation: "Post navigation",
  viewLength: "View length",
  lessDetail: "Less detail",
  summaryView: "Summary view",
  keySubjectsView: "Key subjects view",
  detailedView: "Detailed view",
  moreDetail: "More detail",
};

const ro: UiCopy = {
  menu: "meniu",
  closeMenu: "Închide meniul",
  workMenuLabel: "Proiecte și articole",
  projects: "Proiecte",
  articles: "Articole",
  caseStudies: "Studii de caz",
  portfolio: "Portofoliu",
  portfolioMoreDetails: "MAI MULTE DETALII",
  dataStories: "Povești bazate pe date",
  privacyPolicy: "Politica de confidențialitate",
  terms: "Termeni și condiții",
  legalLabel: "Informații juridice",
  namePlaceholder: "Numele tău",
  switchToEnglish: "Schimbă limba în engleză",
  switchToRomanian: "Schimbă limba în română",
  previous: "Anterior",
  next: "Următor",
  showPage: "Afișează pagina {page} din {label}",
  showItem: "Afișează {title}",
  showTestimonialsPage: "Afișează pagina {page} de mărturii",
  showTestimonialFrom: "Afișează mărturia de la {name}",
  postNavigation: "Navigare între articole",
  viewLength: "Nivel de detaliu",
  lessDetail: "Mai puține detalii",
  summaryView: "Vizualizare rezumat",
  keySubjectsView: "Vizualizarea subiectelor principale",
  detailedView: "Vizualizare detaliată",
  moreDetail: "Mai multe detalii",
};

export const ui: Record<Locale, UiCopy> = { en, ro };

export function formatUi(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (label, [key, value]) => label.replace(`{${key}}`, String(value)),
    template,
  );
}
