import type { Locale } from "../lib/site";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  href: string;
  person: "jess" | "joshua" | "timo";
  logo: "balancepoint" | "flex" | "flowtraders";
}

export interface TestimonialMapPin {
  id: string;
  company: string;
  location: string;
  size: string;
  top: string;
  left: string;
  compact?: boolean;
}

export interface TestimonialsCopy {
  heading: string;
  items: Testimonial[];
}

const en: TestimonialsCopy = {
  heading: "Testimonials",
  items: [
    {
      quote:
        "We have worked together for 4 years now. To be able to develop a professional online relationship with someone that has brought us such efficiency in our process is remarkable. We started out needing someone to look at what we do from a new angle, a fresh start. Vlad has been able to offer deep technical expertise as well as a talent for design. The result has been a product that has exceeded my expectations. He is very capable, proficient and when our requests have exceeded his knowledge, he has pushed himself to continue to learn and provide options for our needs.",
      name: "Jess Cary",
      role: "managing partner",
      company: "Balance Point",
      href: "https://www.isolvedhcm.com/welcome/balancepoint",
      person: "jess",
      logo: "balancepoint",
    },
    {
      quote:
        "I have been working with Stories of Data since 2017. From a short term independent contractor to a long term solution, Stories of Data have become an integral part of our US-based team. It started needing help on an Excel spreadsheet and has blossomed into a data/marketing/logistic/jack-of-all-trades relationship for our company. I could never have imagined how our business relies on Stories of Data – and – now I can’t imagine life without the team.",
      name: "Joshua Chernikoff",
      role: "founder",
      company: "Flex Academies",
      href: "https://flexacademies.com/",
      person: "joshua",
      logo: "flex",
    },
    {
      quote:
        "The reasons why I personally enjoy working with Vlad are the same ones that made his last assignment with Flow Traders a success. He communicates very well and also listens attentively to his client’s needs. He knows what he can deliver and always sticks to his commitments while going the extra mile. He also learned very quickly what the divers group of traders needed from him and made this project work despite very little guidance provided. I highly recommend Vlad Mihanta to anyone who wants to have the work done right the first time. He always delivers!",
      name: "Timo Pentner",
      role: "head of it",
      company: "Flow Traders",
      href: "https://www.flowtraders.com/",
      person: "timo",
      logo: "flowtraders",
    },
  ],
};

/** Client locations on the testimonials world map (clone positions). */
export const testimonialMapPins: TestimonialMapPin[] = [
  { id: "chainformation", company: "Chainformation", location: "Malmo, Sweden", size: "0.55em", top: "18.5%", left: "53.2%", compact: true },
  { id: "flow-traders", company: "Flow traders", location: "Amsterdam, NL", size: "0.35em", top: "19.8%", left: "51.5%", compact: true },
  { id: "ecosulis", company: "Ecosulis", location: "London, UK", size: "0.5em", top: "19.55%", left: "49.7%", compact: true },
  { id: "spie", company: "Spie", location: "zurich, switzerland", size: "0.35em", top: "21.5%", left: "52.65%", compact: true },
  { id: "bi-samurai", company: "BI Samurai", location: "olten, switzerland", size: "0.3em", top: "21.5%", left: "52.2%", compact: true },
  { id: "fintechos", company: "FintechOS", location: "Bucharest, Romania", size: "0.55em", top: "21.95%", left: "56.3%", compact: true },
  { id: "novoinsights", company: "Novo Insights", location: "Elmhurst, IL, US", size: "0.5em", top: "21.5%", left: "28.6%", compact: true },
  { id: "umojo", company: "umojo", location: "Chicago, US", size: "1em", top: "22%", left: "27.5%", compact: true },
  { id: "jdmedical", company: "JD Medical Services", location: "Dalton GA, US", size: "0.7em", top: "23.4%", left: "28%", compact: true },
  { id: "balancepoint", company: "Balance PoinT", location: "Glen Rock, NJ, US", size: "1em", top: "23.1%", left: "31.8%", compact: true },
  { id: "flexacademies", company: "flex academies", location: "Washington DC, US", size: "0.8em", top: "24.2%", left: "30.8%", compact: true },
  { id: "cpa", company: "360 CPA", location: "Athens, GA, US", size: "0.8em", top: "24.2%", left: "28.8%", compact: true },
  { id: "missiondrivenfinance", company: "Mission Driven Finance", location: "San Diego, US", size: "1em", top: "26%", left: "21%" },
  { id: "brightquery", company: "BrightQuery", location: "Irvine, CA, US", size: "1.3em", top: "24.8%", left: "19.3%", compact: true },
  { id: "downhome", company: "Downhome Solutions", location: "Seattle, WA, US", size: "1.7em", top: "21%", left: "18.2%" },
];

/** Romanian copy pending; English until translated. */
export const testimonials: Record<Locale, TestimonialsCopy> = {
  en,
  ro: en,
};
