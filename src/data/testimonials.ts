import type { Locale } from "../lib/site";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  href: string;
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
    },
    {
      quote:
        "I have been working with Stories of Data since 2017. From a short term independent contractor to a long term solution, Stories of Data have become an integral part of our US-based team. It started needing help on an Excel spreadsheet and has blossomed into a data/marketing/logistic/jack-of-all-trades relationship for our company. I could never have imagined how our business relies on Stories of Data – and – now I can’t imagine life without the team.",
      name: "Joshua Chernikoff",
      role: "founder",
      company: "Flex Academies",
      href: "https://flexacademies.com/",
    },
    {
      quote:
        "The reasons why I personally enjoy working with Vlad are the same ones that made his last assignment with Flow Traders a success. He communicates very well and also listens attentively to his client’s needs. He knows what he can deliver and always sticks to his commitments while going the extra mile. He also learned very quickly what the divers group of traders needed from him and made this project work despite very little guidance provided. I highly recommend Vlad Mihanta to anyone who wants to have the work done right the first time. He always delivers!",
      name: "Timo Pentner",
      role: "head of it",
      company: "Flow Traders",
      href: "https://www.flowtraders.com/",
    },
  ],
};

/** Romanian copy pending; English until translated. */
export const testimonials: Record<Locale, TestimonialsCopy> = {
  en,
  ro: en,
};
