import type { Locale } from "../lib/site";

export interface HeroChapter {
  heading: string;
  subheading: string;
  paragraphs: string[];
}

export interface HomeCopy {
  title: string;
  description: string;
  hero: {
    heading: string;
    lede: string;
    chapters: HeroChapter[];
  };
  portfolio: {
    heading: string;
    viewAll: string;
  };
  contact: {
    heading: string;
    subheading: string;
    body: string;
    email: string;
    phone: string;
    phoneHref: string;
  };
  form: {
    name: string;
    email: string;
    message: string;
    messagePlaceholder: string;
    privacy: string;
    privacyLink: string;
    submit: string;
    unconfigured: string;
  };
}

const en: HomeCopy = {
  title: "Microsoft Fabric and Power BI Consultancy Romania",
  description:
    "Stories of Data is a Microsoft Fabric and Power BI consultancy agency in Romania who have helped over 30 customers bring clarity to their data.",
  hero: {
    heading: "The specialized data analytics team",
    lede: "Bringing clarity to your Microsoft Fabric projects",
    chapters: [
      {
        heading: "Make your data work for you:",
        subheading: "we build data-driven applications",
        paragraphs: [
          "We have the necessary tools and processes to turn your data into valuable products, such as platforms to track investments, monetize datasets, and transform Excel models into user-friendly apps.",
          "Our data-driven solutions make data a part of the business logic, allowing for deeper analysis and insights. We help productize your services, particularly those with large amounts of data like financial, accounting, and analytical services.",
        ],
      },
      {
        heading: "Increase your SaaS value with data that is actually used by your users",
        subheading:
          "We Build Contextual Analytics That Makes Reporting Useful and Customers Turning Back For Insights",
        paragraphs: [
          "We help you unlock the power of data in existing third party platforms and startup products. By embedding customized data visualizations into these platforms, we empower users to make sense of complex data and make informed decisions.",
          "Our contextual analytics solution makes data readily available and interpretable without requiring users to export their data, therefore increasing the overall value of the platform.",
        ],
      },
      {
        heading: "Visualize what you couldn’t before",
        subheading: "We Build Custom-Made Visualizations That Help You Tell Your Story In A Unique Way",
        paragraphs: [
          "We design custom data visualizations that provide new and innovative ways to analyze and interpret your data. We help our clients gain valuable insights into their business operations, allowing them to make more informed decisions.",
          "Whether you need a dashboard that provides real-time performance metrics or a custom data visualization that highlights key trends and patterns, we have the expertise to help you unlock the full potential of your data and use it to drive business outcomes.",
        ],
      },
      {
        heading: "Become a data-driven and data-augmented organization with Power BI",
        subheading: "We Help Organizations Build Their Power BI. Everything there is in Power BI.",
        paragraphs: [
          "We are experts in Power BI, one of the most powerful business intelligence tools available. We develop intuitive and user-friendly data models tailored to your exact business needs, allowing you to gain deeper insights into your data and make more informed business decisions.",
          "We are experts at designing and developing custom visuals, building semantic models and managing Power BI tenants, ensuring that your data is secure and properly managed. Whether you are looking to improve your reporting, gain better insights or analyze trends, we have the experience and processes to help you achieve your goals using Power BI.",
        ],
      },
    ],
  },
  portfolio: {
    heading: "Portfolio",
    viewAll: "See all portfolio",
  },
  contact: {
    heading: "Get in touch",
    subheading: "Let’s talk about what you’re hoping Fabric can do for you.",
    body: "Bring us your situation. We will tell you honestly whether Fabric fits, what it will take, and what you can expect from working with us.",
    email: "info@storiesofdata.com",
    phone: "+40 741 234 567",
    phoneHref: "+40741234567",
  },
  form: {
    name: "Name",
    email: "Email",
    message: "What are you hoping fabric can do?",
    messagePlaceholder: "Describe your data situation. No need to have all the answers.",
    privacy: "By submitting this form you agree to our",
    privacyLink: "Privacy Policy",
    submit: "Send message",
    unconfigured: "Contact form is not configured in this environment.",
  },
};

/** Romanian copy pending; English until translated. */
export const home: Record<Locale, HomeCopy> = {
  en,
  ro: en,
};
