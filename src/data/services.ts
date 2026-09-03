import type { Locale } from "../lib/site";

export interface Service {
  title: string;
  benefitsHeading: string;
  benefits: string[];
  helpHeading: string;
  help: string[];
}

export interface ServicesCopy {
  heading: string;
  cta: string;
  items: Service[];
}

const en: ServicesCopy = {
  heading: "Services and products",
  cta: "start a project",
  items: [
    {
      title: "Data-Driven Apps",
      benefitsHeading: "You benefit by",
      benefits: [
        "Transforming your idea into a product fast",
        "Taking your product to market fast",
      ],
      helpHeading: "we help with",
      help: [
        "Designing and implementing full-fledged applications that use your data",
        "Transforming those complex Excel spreadsheets into web apps",
      ],
    },
    {
      title: "Contextual Analytics in your SaaS",
      benefitsHeading: "You benefit by",
      benefits: [
        "Increasing the “stickyness” of your SaaS",
        "Increasing revenues from the additional created value generated from your data",
        "Using your data to its full potential",
        "Empowering every user, not only the C-suite, with insights that matter to them",
        "Putting your data to work faster than the competition",
      ],
      helpHeading: "we help with",
      help: [
        "Embedding programmatic visualizations that use your data and communicate with your application",
        "Designing custom interactions between your application and data insights",
        "Designing and building the data semantic model for your SaaS",
      ],
    },
    {
      title: "Data Visualization",
      benefitsHeading: "You benefit by",
      benefits: [
        "Creating intellectual property",
        "Expressing your values or insights in unique, eye-catching ways",
        "Visualizing what you couldn’t visualize before",
      ],
      helpHeading: "we help with",
      help: [
        "Designing and developing custom visuals for Power BI using D3 & Typescript",
        "Designing and developing personalized visuals for Power using BI Samurai’s HTML Visual and Deneb",
      ],
    },
    {
      title: "Power BI",
      benefitsHeading: "You benefit by",
      benefits: [
        "Understanding & trusting your data",
        "Making decisions with data you trust",
        "Having a complete overview over your data landscape",
        "Staying ahead of the competition by arriving to insights faster",
        "Leveraging your data to achieve your business goals",
        "Enabling your workforce with the facts they need to make data-driven decisions",
      ],
      helpHeading: "we help with",
      help: [
        "Building reports",
        "Building semantic models",
        "Managing Power BI tenants",
        "Deploying Power BI apps and template apps",
        "Migrating from other BI platforms to Power BI",
        "Implementing Power BI Embedded",
        "Building reports with Report Builder",
        "Building Power BI custom visuals",
        "Guidance on Power BI security, governance & licensing",
      ],
    },
  ],
};

/** Romanian copy pending; English until translated. */
export const services: Record<Locale, ServicesCopy> = {
  en,
  ro: en,
};
