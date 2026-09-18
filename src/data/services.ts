import type { Locale } from "../lib/site";

export const BOOKINGS_URL =
  "https://bookings.cloud.microsoft/bookwithme/user/440681fea4204d06ae738c987e7a2ba0%40storiesofdata.com?anonymous&ismsaljsauthenabled";

export const SERVICE_IDS = ["microsoft-fabric", "embedded-analytics", "ai-integrations", "cfo-bi"] as const;
export const VISUAL_KINDS = ["fabric", "embedded-analytics", "ai-integrations", "cfo-bi"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];
export type ServiceVisualKind = (typeof VISUAL_KINDS)[number];

export interface ServiceExploration {
  label: string;
  url?: string;
}

export interface Service {
  id: ServiceId;
  tabLabel: string;
  headline: string;
  summary: string;
  benefits: string[];
  primaryCta: string;
  exploration: ServiceExploration;
  visualKind: ServiceVisualKind;
  visualDescription: string;
  visualTitle: string;
  visualSource?: string;
}

export interface ServicesCopy {
  heading: string;
  cta: string;
  items: Service[];
}

type ServiceSeed = Omit<Service, "id">;

function withIds(items: ServiceSeed[]): Service[] {
  return items.map((item, index) => ({ ...item, id: SERVICE_IDS[index] }));
}

const discoveryCta = "Book a discovery call";

const en: ServicesCopy = {
  heading: "Services and products",
  cta: discoveryCta,
  items: withIds([
    {
      tabLabel: "Microsoft Fabric",
      headline: "One connected view of your business.",
      summary: "We connect finance, sales, operations, spreadsheets, and external systems in one dependable data foundation. Automated data movement and trusted business definitions lead to reports, dashboards, and data applications people can use.",
      benefits: ["Make decisions using consistent, trusted numbers", "Replace repetitive reporting and spreadsheet work", "See business performance across departments in one place"],
      primaryCta: discoveryCta,
      exploration: { label: "Explore Microsoft Fabric" },
      visualKind: "fabric",
      visualDescription: "Connected business data flowing into trusted decisions",
      visualTitle: "Microsoft Fabric",
    },
    {
      tabLabel: "Embedded Analytics",
      headline: "Give customers analytics under your own brand.",
      summary: "We deliver secure reports and data experiences inside your branded portal or software product. Your customers and partners get useful analytics in the experience they already know.",
      benefits: ["Launch a polished analytics experience faster", "Control branding, access, and customer experience", "Create more value and revenue from existing data"],
      primaryCta: discoveryCta,
      exploration: { label: "Explore Embedded Analytics", url: "https://embedsy.io/" },
      visualKind: "embedded-analytics",
      visualDescription: "Secure analytics embedded inside a branded product experience",
      visualTitle: "Embedded Analytics",
    },
    {
      tabLabel: "AI Integrations",
      headline: "Put AI to work on real business problems.",
      summary: "We combine automation and assistants with forecasting and machine learning that support daily work. Practical use cases include document processing, knowledge assistants, workflow automation, demand forecasting, anomaly detection, and recommendations.",
      benefits: ["Reduce repetitive manual work", "Help teams find and use company knowledge", "Anticipate changes and identify problems earlier"],
      primaryCta: discoveryCta,
      exploration: { label: "Explore AI Integrations" },
      visualKind: "ai-integrations",
      visualDescription: "Automation and assistants turning business data into action",
      visualTitle: "AI Integrations",
    },
    {
      tabLabel: "CFO + BI",
      headline: "Financial leadership and analytics, working as one team.",
      summary: "Flexible CFO leadership is supported by analysts and data specialists who bring the numbers together. We focus on meaningful financial metrics, planning and advice, reliable data, system integration, and ongoing business reviews.",
      benefits: ["Understand what drives profitability and cash flow", "Plan ahead with stronger financial models", "Turn disconnected operational and financial data into clear decisions"],
      primaryCta: discoveryCta,
      exploration: { label: "Explore CFO + BI", url: "https://demo.embedsy.io/embed/studio/63" },
      visualKind: "cfo-bi",
      visualDescription: "Financial leadership and reliable data working together",
      visualTitle: "CFO + BI",
    },
  ]),
};

const ro: ServicesCopy = {
  heading: "Servicii și produse",
  cta: "Programează o discuție",
  items: withIds([
    { tabLabel: "Microsoft Fabric", headline: "O perspectivă conectată asupra afacerii tale.", summary: "Conectăm datele importante ale afacerii într-o bază de date clară și de încredere.", benefits: ["Decizii bazate pe date coerente", "Mai puțină muncă repetitivă", "O imagine comună asupra performanței"], primaryCta: "Programează o discuție", exploration: { label: "Explorează Microsoft Fabric" }, visualKind: "fabric", visualDescription: "Date de business conectate", visualTitle: "Microsoft Fabric" },
    { tabLabel: "Analiză integrată", headline: "Oferă clienților analize sub propriul brand.", summary: "Livrăm rapoarte și experiențe de date sigure în portalul sau produsul tău.", benefits: ["Lansezi mai rapid o experiență de analiză", "Controlezi brandul și accesul", "Creezi valoare din datele existente"], primaryCta: "Programează o discuție", exploration: { label: "Explorează analiza integrată", url: "https://embedsy.io/" }, visualKind: "embedded-analytics", visualDescription: "Analize integrate într-un produs", visualTitle: "Analiză integrată" },
    { tabLabel: "Integrări AI", headline: "Pune AI-ul la lucru pentru probleme reale.", summary: "Combinăm automatizarea și asistenții inteligenți cu prognoze și recomandări utile.", benefits: ["Reduci munca manuală", "Găsești mai ușor cunoștințele companiei", "Identifici mai devreme schimbările"], primaryCta: "Programează o discuție", exploration: { label: "Explorează integrările AI" }, visualKind: "ai-integrations", visualDescription: "Automatizare și asistenți inteligenți", visualTitle: "Integrări AI" },
    { tabLabel: "CFO + BI", headline: "Leadership financiar și analiză, într-o singură echipă.", summary: "Leadership-ul financiar flexibil este susținut de analiști și specialiști în date.", benefits: ["Înțelegi profitabilitatea și fluxul de numerar", "Planifici cu modele financiare mai bune", "Transformi datele în decizii clare"], primaryCta: "Programează o discuție", exploration: { label: "Explorează CFO + BI", url: "https://demo.embedsy.io/embed/studio/63" }, visualKind: "cfo-bi", visualDescription: "Leadership financiar și date de încredere", visualTitle: "CFO + BI" },
  ]),
};

export const services: Record<Locale, ServicesCopy> = { en, ro };
