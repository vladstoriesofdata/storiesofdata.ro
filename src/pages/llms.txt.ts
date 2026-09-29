import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { home } from "../data/home";
import { byPubDateDesc, entrySlug, isLocaleEntry } from "../lib/collections";
import { absoluteUrl, getSiteConfig } from "../lib/site";

const labels = {
  en: {
    overview: "Overview",
    homepage: "Homepage",
    services: "Services",
    servicesDescription: "Microsoft Fabric, Power BI, embedded analytics, and custom data visualizations.",
    contact: "Contact",
    contactDescription: "Discuss a data analytics project with Stories of Data.",
    articles: "Articles",
    dataStories: "Data stories",
    portfolio: "Portfolio",
    browse: "Browse all entries in this section.",
  },
  ro: {
    overview: "Prezentare generală",
    homepage: "Pagina principală",
    services: "Servicii",
    servicesDescription: "Microsoft Fabric, Power BI, analiză integrată și vizualizări de date personalizate.",
    contact: "Contact",
    contactDescription: "Discută un proiect de analiză a datelor cu Stories of Data.",
    articles: "Articole",
    dataStories: "Povești cu date",
    portfolio: "Portofoliu",
    browse: "Explorează toate materialele din această secțiune.",
  },
};

function markdownText(value: string): string {
  return value.replace(/\s+/g, " ").trim().replace(/[\\[\]*_`]/g, "\\$&");
}

export const GET: APIRoute = async () => {
  const site = getSiteConfig(import.meta.env);
  const copy = labels[site.locale];
  const description = markdownText(home[site.locale].description);
  const link = (title: string, path: string, summary: string) =>
    `- [${markdownText(title)}](${absoluteUrl(path, site)}): ${markdownText(summary)}`;

  const sections = await Promise.all(
    ([
      { collection: "articles", path: "/articles/", title: copy.articles },
      { collection: "dataStories", path: "/data-stories/", title: copy.dataStories },
      { collection: "portfolio", path: "/portfolio/", title: copy.portfolio },
    ] as const).map(async ({ collection, path, title }) => {
      const entries = await getCollection(collection, (entry) =>
        isLocaleEntry(entry.id, site.locale),
      );
      return [
        `## ${title}`,
        "",
        link(title, path, copy.browse),
        ...byPubDateDesc(entries).map((entry) =>
          link(entry.data.title, `${path}${entrySlug(entry.id)}/`, entry.data.description),
        ),
      ].join("\n");
    }),
  );

  const body = [
    `# ${site.name}`,
    `> ${description}`,
    `## ${copy.overview}`,
    [
      link(copy.homepage, "/", home[site.locale].description),
      link(copy.services, "/#services", copy.servicesDescription),
      link(copy.contact, "/#contact", copy.contactDescription),
    ].join("\n"),
    ...sections,
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
