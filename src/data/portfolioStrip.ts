import type { ImageMetadata } from "astro";
import type { Locale } from "../lib/site";
import { coverForSlug, type CoverFit } from "./covers";

export interface StripItem {
  slug: string;
  title: string;
  description: string;
  hrefBase: "/portfolio" | "/articles" | "/data-stories";
  cover: ImageMetadata;
  fit: CoverFit;
}

export interface StripTab {
  id: "portfolio" | "articles" | "case-studies";
  label: string;
  items: StripItem[];
}

function item(
  hrefBase: StripItem["hrefBase"],
  slug: string,
  title: string,
  description: string,
): StripItem {
  const cover = coverForSlug(slug);
  return { slug, title, description, hrefBase, cover: cover.image, fit: cover.fit };
}

const en: StripTab[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    items: [
      item(
        "/portfolio",
        "advanced-matrix-visual-built-with-deneb-in-power-bi",
        "Advanced matrix visual build with Deneb in Power BI",
        "How to visualize a metric on two categorical axes in a novel, but still useful way",
      ),
      item(
        "/portfolio",
        "a-nobel-prize-data-story",
        "A nobel prize data Story",
        "We created this project to explore the reasons why the people and organizations were awarded the Nobel Prize.",
      ),
      item(
        "/portfolio",
        "multi-line-chart-with-custom-tooltips-power-bi-custom-visual",
        "Multi Line Chart with Tooltips",
        "A powerful Power BI custom visual available on the Microsoft AppSource that helps visualize multiple categories on a time series.",
      ),
      item(
        "/portfolio",
        "category-comparison-bar-chart-power-bi-custom-visual",
        "Category Comparison Bar Chart",
        "A bar chart that you've probably never seen before. \n\nA powerful Power BI custom visual available on the Microsoft AppSource that helps visualize and compare a category against the others.",
      ),
      item(
        "/portfolio",
        "a-romanian-data-story",
        "A ROMANIAN DATA STORY",
        "A Romanian Data Story is an exploration of data about Romania. This is a series of visualizations exploring different topics, like demographics, income, migration, health, and more concerning Romanian citizens. The data is collected mainly from the national bureau of Statistics of Romania (INSS). The series also includes a running weekly post on LinkedIn where more details are shared about each topic.",
      ),
      item(
        "/portfolio",
        "btr-business-case-study",
        "Power BI and Data Management for a US-based Construction Company",
        "How we helped a US construction company manage hundreds of sites effortlessly with Power BI - Beyond regular reporting in Power BI.",
      ),
      item(
        "/portfolio",
        "chainformation-business-case-study",
        "How a Swedish SaaS Leveraged Power BI Embedded for Data Analytics in Their Mature Product",
        "How we helped a platform revolutionize data insights for multi location brands and frenchises.",
      ),
    ],
  },
  {
    id: "articles",
    label: "Articles",
    items: [
      item(
        "/articles",
        "is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026",
        "Is it worth hiring a Microsoft Fabric consultancy in 2026",
        "Meta description: Planning to partner with Microsoft Fabric experts? We've built real Fabric solutions since 2018. Let's talk about yours.",
      ),
      item(
        "/articles",
        "full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026",
        "Full pricing breakdown for Power BI, Fabric and Power BI Embedded in 2026",
        "Learn the difference between the main Microsoft data analytics products and which pricing plan is best for your use case.",
      ),
      item(
        "/articles",
        "become-truly-data-driven-and-you-will-certainly-fail",
        "Become truly data-driven and you will certainly fail",
        "Being truly data-driven can lead to failure. Learn why intuition matters in decision-making, and how data should inform questions, not just answers.",
      ),
      item(
        "/articles",
        "how-top-companies-capitalize-on-embedded-analytics",
        "How top companies capitalize on embedded analytics",
        "How embedded analytics and personalizations drive user acquisition and signal trust.",
      ),
      item(
        "/articles",
        "how-to-turn-your-power-bi-reports-into-a-subscription-based-app",
        "How to turn your Power BI reports into a subscription-based app",
        "What is a semantic layer, how a YouTuber capitalized on trust and how to productize your own data.",
      ),
      item(
        "/articles",
        "microsoft-fabric-medallion-architecture-lessons-learned",
        "Microsoft Fabric Medallion Architecture: Lessons Learned",
        "Learn how we migrated to a Microsoft Fabric medallion architecture and lowered compute costs by 42%.",
      ),
    ],
  },
  {
    id: "case-studies",
    label: "Case Studies",
    items: [
      item(
        "/data-stories",
        "lines-on-maps-in-power-bi",
        "Lines on Maps in Power BI",
        "A short walkthrough of how to plot spatial data as linestrings in Power BI.",
      ),
      item(
        "/data-stories",
        "redesigning-linkedin-analytics",
        "Redesigning LinkedIn Analytics",
        "LinkedIn must know nobody is using their analytics. In this exercise, I look at how the LinkedIn analytics page could offer so much more insights and I dive into the details of redesigning the page.",
      ),
    ],
  },
];

const ro: StripTab[] = [
  {
    id: "portfolio",
    label: "Portofoliu",
    items: [
      item(
        "/portfolio",
        "advanced-matrix-visual-built-with-deneb-in-power-bi",
        "Vizualizare matrix avansată, construită cu Deneb în Power BI",
        "Cum să vizualizezi o măsură pe două axe categoriale într-un mod nou, dar în continuare util.",
      ),
      item(
        "/portfolio",
        "a-nobel-prize-data-story",
        "O poveste despre date și Premiul Nobel",
        "Am creat acest proiect pentru a explora motivele pentru care oamenii și organizațiile au primit Premiul Nobel.",
      ),
      item(
        "/portfolio",
        "multi-line-chart-with-custom-tooltips-power-bi-custom-visual",
        "Multi Line Chart with Tooltips",
        "O vizualizare personalizată Power BI performantă, disponibilă în Microsoft AppSource, care ajută la reprezentarea mai multor categorii într-o serie temporală.",
      ),
      item(
        "/portfolio",
        "category-comparison-bar-chart-power-bi-custom-visual",
        "Category Comparison Bar Chart",
        "Un grafic cu bare cum probabil nu ai mai văzut.\n\nO vizualizare personalizată Power BI performantă, disponibilă în Microsoft AppSource, care ajută la reprezentarea și compararea unei categorii cu celelalte.",
      ),
      item(
        "/portfolio",
        "a-romanian-data-story",
        "A ROMANIAN DATA STORY",
        "A Romanian Data Story este o explorare a datelor despre România. Seria cuprinde vizualizări despre diverse subiecte relevante pentru cetățenii români, precum demografia, veniturile, migrația și sănătatea. Datele provin în principal de la Institutul Național de Statistică din România (INS). Seria include și postări săptămânale pe LinkedIn, unde prezentăm mai multe detalii despre fiecare subiect.",
      ),
      item(
        "/portfolio",
        "btr-business-case-study",
        "Power BI și managementul datelor pentru o companie de construcții din SUA",
        "Cum am ajutat o companie de construcții din SUA să gestioneze fără efort sute de șantiere cu Power BI, dincolo de raportarea obișnuită în Power BI.",
      ),
      item(
        "/portfolio",
        "chainformation-business-case-study",
        "Cum a folosit un produs SaaS suedez Power BI Embedded pentru analiza datelor",
        "Cum am ajutat o platformă să transforme radical perspectivele oferite de date pentru branduri și francize cu mai multe locații.",
      ),
    ],
  },
  {
    id: "articles",
    label: "Articole",
    items: [
      item(
        "/articles",
        "is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026",
        "Merită să colaborezi cu o firmă de consultanță Microsoft Fabric în 2026?",
        "Plănuiești să colaborezi cu experți Microsoft Fabric? Construim soluții reale în Microsoft Fabric din 2018. Hai să discutăm despre proiectul tău.",
      ),
      item(
        "/articles",
        "full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026",
        "Ghid complet de prețuri pentru Power BI, Microsoft Fabric și Power BI Embedded în 2026",
        "Află care sunt diferențele dintre principalele produse Microsoft pentru analiza datelor și ce plan tarifar se potrivește cel mai bine nevoilor tale.",
      ),
      item(
        "/articles",
        "become-truly-data-driven-and-you-will-certainly-fail",
        "Dacă te bazezi exclusiv pe date, vei eșua cu siguranță",
        "A te baza exclusiv pe date poate duce la eșec. Află de ce intuiția contează în luarea deciziilor și cum ar trebui datele să fundamenteze întrebările, nu doar răspunsurile.",
      ),
      item(
        "/articles",
        "how-top-companies-capitalize-on-embedded-analytics",
        "Cum valorifică marile companii analiza integrată",
        "Cum analiza integrată și personalizarea contribuie la atragerea utilizatorilor și transmit încredere.",
      ),
      item(
        "/articles",
        "how-to-turn-your-power-bi-reports-into-a-subscription-based-app",
        "Cum să-ți transformi rapoartele Power BI într-o aplicație pe bază de abonament",
        "Ce este un semantic layer, cum a valorificat un creator YouTube încrederea publicului și cum îți poți transforma propriile date într-un produs.",
      ),
      item(
        "/articles",
        "microsoft-fabric-medallion-architecture-lessons-learned",
        "Microsoft Fabric Medallion Architecture: lecții învățate",
        "Află cum am migrat la o Medallion Architecture în Microsoft Fabric și am redus costurile de procesare cu 42%.",
      ),
    ],
  },
  {
    id: "case-studies",
    label: "Studii de caz",
    items: [
      item(
        "/data-stories",
        "lines-on-maps-in-power-bi",
        "Linii pe hărți în Power BI",
        "Un scurt ghid despre reprezentarea datelor spațiale sub formă de linii în Power BI.",
      ),
      item(
        "/data-stories",
        "redesigning-linkedin-analytics",
        "Regândirea LinkedIn Analytics",
        "LinkedIn știe probabil că aproape nimeni nu îi folosește instrumentele de analiză. În acest exercițiu analizez cum ar putea pagina LinkedIn Analytics să ofere mult mai multe perspective și prezint în detaliu reproiectarea ei.",
      ),
    ],
  },
];

export const portfolioStrip: Record<Locale, StripTab[]> = { en, ro };
