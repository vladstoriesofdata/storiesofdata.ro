import type { Locale } from "../lib/site";

export const BOOKINGS_URL =
  "https://bookings.cloud.microsoft/bookwithme/user/440681fea4204d06ae738c987e7a2ba0%40storiesofdata.com?anonymous&ismsaljsauthenabled";

export const SERVICE_IDS = [
  "microsoft-fabric",
  "embedded-analytics",
  "ai-integrations",
  "cfo-bi",
] as const;

export const VISUAL_KINDS = [
  "fabric",
  "embedded-analytics",
  "ai-integrations",
  "cfo-bi",
] as const;

export type ServiceId = (typeof SERVICE_IDS)[number];
export type ServiceVisualKind = (typeof VISUAL_KINDS)[number];

export interface ServiceExploration {
  label: string;
  url?: string;
}

interface LegacyService {
  title: string;
  benefitsHeading: string;
  benefits: string[];
  helpHeading: string;
  help: string[];
}

export interface Service extends LegacyService {
  id: ServiceId;
  tabLabel: string;
  headline: string;
  summary: string;
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

interface LegacyServicesCopy {
  heading: string;
  cta: string;
  items: LegacyService[];
}

function withContract(copy: LegacyServicesCopy): ServicesCopy {
  return {
    heading: copy.heading,
    cta: copy.cta,
    items: copy.items.map((item, index) => ({
      ...item,
      id: SERVICE_IDS[index],
      tabLabel: item.title,
      headline: item.title,
      summary: item.help[0] ?? "",
      primaryCta: copy.cta,
      exploration: { label: copy.cta, url: BOOKINGS_URL },
      visualKind: VISUAL_KINDS[index],
      visualDescription: item.title,
      visualTitle: item.title,
    })),
  };
}

const en: LegacyServicesCopy = {
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
        'Designing and developing custom visuals for Power BI using D3 & Typescript. Here are the visuals we already created:<br/>- <a href="/portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual/" target="_blank" class="services-link">Multi Line Chart with Tooltips</a><br/>- <a href="/portfolio/category-comparison-bar-chart-power-bi-custom-visual/" target="_blank" class="services-link">Category Comparison Bar Chart</a>',
        'Designing and developing personalized visuals for Power using <a href="https://bisamurai.com/product/html-vizcreator-cert-visual-for-power-bi/" target="_blank" rel="noreferrer" class="services-link">BI Samurai’s HTML Visual</a> and <a href="https://deneb-viz.github.io/" target="_blank" rel="noreferrer" class="services-link">Deneb</a>.',
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

const ro: LegacyServicesCopy = {
  heading: "Servicii și produse",
  cta: "începe un proiect",
  items: [
    {
      title: "Aplicații bazate pe date",
      benefitsHeading: "Beneficii pentru tine",
      benefits: [
        "Îți transformi rapid ideea într-un produs",
        "Îți lansezi rapid produsul pe piață",
      ],
      helpHeading: "te ajutăm cu",
      help: [
        "Proiectarea și implementarea unor aplicații complete care folosesc datele tale",
        "Transformarea foilor de calcul Excel complexe în aplicații web",
      ],
    },
    {
      title: "Analiză contextuală în produsul tău SaaS",
      benefitsHeading: "Beneficii pentru tine",
      benefits: [
        "Crești gradul de retenție al produsului tău SaaS",
        "Crești veniturile prin valoarea suplimentară generată din datele tale",
        "Îți valorifici datele la întregul potențial",
        "Oferi fiecărui utilizator, nu doar conducerii, perspective relevante pentru el",
        "Îți pui datele la lucru mai repede decât concurența",
      ],
      helpHeading: "te ajutăm cu",
      help: [
        "Integrarea unor vizualizări programatice care folosesc datele tale și comunică cu aplicația",
        "Proiectarea interacțiunilor personalizate dintre aplicație și perspectivele oferite de date",
        "Proiectarea și construirea unui semantic model pentru produsul tău SaaS",
      ],
    },
    {
      title: "Vizualizarea datelor",
      benefitsHeading: "Beneficii pentru tine",
      benefits: [
        "Creezi proprietate intelectuală",
        "Îți exprimi valorile sau perspectivele în moduri unice, care atrag atenția",
        "Vizualizezi ceea ce până acum nu puteai",
      ],
      helpHeading: "te ajutăm cu",
      help: [
        'Proiectarea și dezvoltarea de vizualizări personalizate pentru Power BI folosind D3 și TypeScript. Iată vizualizările pe care le-am creat deja:<br/>- <a href="/portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual/" target="_blank" class="services-link">Multi Line Chart with Tooltips</a><br/>- <a href="/portfolio/category-comparison-bar-chart-power-bi-custom-visual/" target="_blank" class="services-link">Category Comparison Bar Chart</a>',
        'Proiectarea și dezvoltarea de vizualizări personalizate pentru Power BI folosind <a href="https://bisamurai.com/product/html-vizcreator-cert-visual-for-power-bi/" target="_blank" rel="noreferrer" class="services-link">BI Samurai’s HTML Visual</a> și <a href="https://deneb-viz.github.io/" target="_blank" rel="noreferrer" class="services-link">Deneb</a>.',
      ],
    },
    {
      title: "Power BI",
      benefitsHeading: "Beneficii pentru tine",
      benefits: [
        "Îți înțelegi datele și ai încredere în ele",
        "Iei decizii pe baza unor date în care ai încredere",
        "Ai o imagine completă asupra întregului ecosistem de date",
        "Rămâi înaintea concurenței obținând mai repede perspective relevante",
        "Îți valorifici datele pentru a-ți atinge obiectivele de business",
        "Le oferi colegilor informațiile de care au nevoie pentru a lua decizii bazate pe date",
      ],
      helpHeading: "te ajutăm cu",
      help: [
        "Construirea rapoartelor",
        "Construirea unui semantic model",
        "Administrarea tenant-urilor Power BI",
        "Publicarea aplicațiilor Power BI și a aplicațiilor-șablon",
        "Migrarea de la alte platforme BI la Power BI",
        "Implementarea Power BI Embedded",
        "Construirea rapoartelor cu Report Builder",
        "Construirea vizualizărilor personalizate Power BI",
        "Consultanță privind securitatea, guvernanța și licențierea Power BI",
      ],
    },
  ],
};

export const services: Record<Locale, ServicesCopy> = {
  en: withContract(en),
  ro: withContract(ro),
};
