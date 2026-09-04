import type { ImageMetadata } from "astro";
import biPricing from "../assets/covers/bi-pricing.svg";
import btr from "../assets/covers/btr.png";
import categoryBar from "../assets/covers/category-bar.jpg";
import chainformation from "../assets/covers/chainformation.png";
import chord from "../assets/covers/chord.gif";
import dataDriven from "../assets/covers/data-driven.png";
import embeddedAnalytics from "../assets/covers/embedded-analytics.png";
import fabricConsultancy from "../assets/covers/fabric-consultancy.webp";
import fallback from "../assets/covers/fallback.png";
import linesOnMaps from "../assets/covers/lines-on-maps.gif";
import linkedin from "../assets/covers/linkedin.png";
import matrix from "../assets/covers/matrix.png";
import multiLine from "../assets/covers/multi-line.png";
import qualtrim from "../assets/covers/qualtrim.png";
import romanianStory from "../assets/covers/romanian-story.png";

export type CoverFit = "cover" | "contain";

export interface CoverAsset {
  image: ImageMetadata;
  fit: CoverFit;
}

function cover(image: ImageMetadata, fit: CoverFit = "contain"): CoverAsset {
  return { image, fit };
}

const covers: Record<string, CoverAsset> = {
  "a-nobel-prize-data-story": cover(chord, "cover"),
  "a-romanian-data-story": cover(romanianStory, "cover"),
  "advanced-matrix-visual-built-with-deneb-in-power-bi": cover(matrix, "cover"),
  "become-truly-data-driven-and-you-will-certainly-fail": cover(dataDriven, "cover"),
  "btr-business-case-study": cover(btr, "contain"),
  "category-comparison-bar-chart-power-bi-custom-visual": cover(categoryBar, "cover"),
  "chainformation-business-case-study": cover(chainformation, "contain"),
  "full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026": cover(biPricing, "contain"),
  "how-to-turn-your-power-bi-reports-into-a-subscription-based-app": cover(qualtrim, "contain"),
  "how-top-companies-capitalize-on-embedded-analytics": cover(embeddedAnalytics, "cover"),
  "is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026": cover(fabricConsultancy, "contain"),
  "lines-on-maps-in-power-bi": cover(linesOnMaps, "cover"),
  "microsoft-fabric-medallion-architecture-lessons-learned": cover(fallback, "contain"),
  "multi-line-chart-with-custom-tooltips-power-bi-custom-visual": cover(multiLine, "cover"),
  "redesigning-linkedin-analytics": cover(linkedin, "cover"),
};

export function coverForSlug(slug: string): CoverAsset {
  return covers[slug] ?? cover(fallback, "contain");
}
