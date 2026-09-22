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
  benefits: (
    | string
    | {
        text: string;
        link: { label: string; url: string };
      }
  )[];
  primaryCta: string;
  primaryCtaUrl: string;
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
      tabLabel: "Microsoft Fabric & Power BI",
      headline: "One connected view of your business.",
      summary: "We've been working with Power BI since 2018 and with Fabric since its release. If you're building your data stack on Fabric and need help or need to take your Fabric to the next level, you came to the right people. But...do you even need a data agency? We've helped dozens of customers:",
      benefits: [
        "Advise on data architecture, licensing and reporting with Fabric and Power BI", 
        "Build production-ready and scalable data platforms", 
        {
          text: "Reduce the cost of Fabric and Power BI licenses.",
          link: {
            label: "Here's a use case",
            url: "/articles/microsoft-fabric-medallion-architecture-lessons-learned",
          },
        },
      ],
      primaryCta: discoveryCta,
      primaryCtaUrl: BOOKINGS_URL,
      exploration: { label: "Is it worth hiring a consultancy?", url: "/articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026" },
      visualKind: "fabric",
      visualDescription: "Connected business data flowing into trusted decisions",
      visualTitle: "Microsoft Fabric",
    },
    {
      tabLabel: "Embedded Analytics",
      headline: "Give customers analytics under your own brand.",
      summary: "We believe embedded analytics is the future of data analytics. We know the tools and we even built the tools to make embedded analytics easy and real in your business. We built embedsy.io where we give customers a data platform where they can embed Power BI reports securely without the hassle. We help +10 customers with:",
      benefits: [
        "Monetizing their data with embedded analytics", 
        "Advise on Power BI Embedded implementations", 
        "Building data portals and data products"
      ],
      primaryCta: discoveryCta,
      primaryCtaUrl: BOOKINGS_URL,
      exploration: { label: "Explore Embedded Analytics", url: "https://embedsy.io/" },
      visualKind: "embedded-analytics",
      visualDescription: "Secure analytics embedded inside a branded product experience",
      visualTitle: "Embedded Analytics",
    },
    {
      tabLabel: "Data & AI",
      headline: "Put AI to work on real business problems.",
      summary: "We build AI on top of your data working on real problems where artificial intelligence and machine learning models are material to the solution. Our AI team helped so far on:",
      benefits: [
        "Detecting asphalt defects", 
        "Detecting animals that use man-made crossings", 
        "Processing clinical data for more accurate predictions"
      ],
      primaryCta: discoveryCta,
      primaryCtaUrl: BOOKINGS_URL,
      exploration: { label: "Explore AI Integrations" },
      visualKind: "ai-integrations",
      visualDescription: "Automation and assistants turning business data into action",
      visualTitle: "AI Integrations",
    },
    {
      tabLabel: "CFO + BI",
      headline: "Financial leadership and analytics, working as one team.",
      summary: "We often work with CFOs. We found that we bring the most value to a business when we work together. CFOs know what to ask and what data they need, we know how to source it and model it, make it available, and trustworthy. We often help with:",
      benefits: [
        "Bringing clarity to operational and financial data", 
        "Integrating data and insights in the thinking process of executives", 
        "Just cleaning up the data and making it trustworthy"
      ],
      primaryCta: discoveryCta,
      primaryCtaUrl: BOOKINGS_URL,
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
    {
      tabLabel: "Microsoft Fabric și Power BI",
      headline: "O perspectivă unitară asupra afacerii tale.",
      summary: "Lucrăm cu Power BI din 2018 și cu Fabric încă de la lansare. Dacă îți construiești ecosistemul de date pe Fabric și ai nevoie de ajutor sau vrei să duci platforma Fabric la următorul nivel, ai ajuns la oamenii potriviți. Dar... chiar ai nevoie de o agenție de date? Am ajutat zeci de clienți cu:",
      benefits: [
        "Consultanță pentru arhitectura datelor, licențiere și raportare cu Fabric și Power BI",
        "Construirea unor platforme de date scalabile, pregătite pentru producție",
        {
          text: "Reducerea costurilor licențelor Fabric și Power BI.",
          link: {
            label: "Iată un exemplu",
            url: "/articles/microsoft-fabric-medallion-architecture-lessons-learned",
          },
        },
      ],
      primaryCta: "Programează o discuție",
      primaryCtaUrl: BOOKINGS_URL,
      exploration: { label: "Merită să colaborezi cu o firmă de consultanță?", url: "/articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026" },
      visualKind: "fabric",
      visualDescription: "Date de business conectate, transformate în decizii de încredere",
      visualTitle: "Microsoft Fabric",
    },
    {
      tabLabel: "Analiză integrată",
      headline: "Oferă clienților analize sub propriul brand.",
      summary: "Credem că analiza integrată reprezintă viitorul analizei de date. Cunoaștem instrumentele și chiar am construit soluții care fac analiza integrată ușor de implementat și de folosit în afacerea ta. Am creat embedsy.io, o platformă de date prin care clienții pot integra în siguranță rapoarte Power BI, fără bătăi de cap. Până acum, am ajutat peste 10 clienți cu:",
      benefits: [
        "Monetizarea datelor prin analiză integrată",
        "Consultanță pentru implementări Power BI Embedded",
        "Construirea de portaluri și produse de date",
      ],
      primaryCta: "Programează o discuție",
      primaryCtaUrl: BOOKINGS_URL,
      exploration: { label: "Explorează analiza integrată", url: "https://embedsy.io/" },
      visualKind: "embedded-analytics",
      visualDescription: "Analize sigure, integrate într-o experiență de produs sub propriul brand",
      visualTitle: "Analiză integrată",
    },
    {
      tabLabel: "Date și AI",
      headline: "Pune AI-ul la lucru pentru probleme reale.",
      summary: "Construim soluții AI bazate pe datele tale, pentru probleme reale în care inteligența artificială și modelele de învățare automată sunt esențiale. Până acum, echipa noastră de AI a contribuit la:",
      benefits: [
        "Detectarea defectelor din asfalt",
        "Detectarea animalelor care folosesc pasajele construite de oameni",
        "Prelucrarea datelor clinice pentru predicții mai precise",
      ],
      primaryCta: "Programează o discuție",
      primaryCtaUrl: BOOKINGS_URL,
      exploration: { label: "Explorează integrările AI" },
      visualKind: "ai-integrations",
      visualDescription: "Automatizări și asistenți care transformă datele companiei în acțiuni",
      visualTitle: "Integrări AI",
    },
    {
      tabLabel: "CFO + BI",
      headline: "Leadership financiar și analiză, într-o singură echipă.",
      summary: "Lucrăm adesea cu directori financiari și am constatat că aducem cea mai mare valoare unei companii atunci când lucrăm împreună. Directorii financiari știu ce întrebări să pună și de ce date au nevoie, iar noi știm cum să le colectăm și să le modelăm, astfel încât să fie disponibile și de încredere. Îi ajutăm adesea cu:",
      benefits: [
        "Clarificarea datelor operaționale și financiare",
        "Integrarea datelor și informațiilor în procesul decizional al conducerii",
        "Curățarea datelor și transformarea lor într-o sursă de încredere",
      ],
      primaryCta: "Programează o discuție",
      primaryCtaUrl: BOOKINGS_URL,
      exploration: { label: "Explorează CFO + BI", url: "https://demo.embedsy.io/embed/studio/63" },
      visualKind: "cfo-bi",
      visualDescription: "Leadership financiar și date de încredere care lucrează împreună",
      visualTitle: "CFO + BI",
    },
  ]),
};

export const services: Record<Locale, ServicesCopy> = { en, ro };
