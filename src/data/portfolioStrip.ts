import type { ImageMetadata } from "astro";
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

export const PORTFOLIO_STRIP_TABS: StripTab[] = [
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
