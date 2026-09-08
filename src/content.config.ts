import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const translationStatus = z.enum(["translated", "untranslated"]).default("translated");

function pageSchema() {
  return z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    translationStatus,
    tags: z.array(z.string()).default([]),
    zoom: z.boolean().default(true),
  });
}

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/{en,ro}.mdx" }),
  schema: pageSchema(),
});

const portfolio = defineCollection({
  loader: glob({ base: "./src/content/portfolio", pattern: "**/{en,ro}.mdx" }),
  schema: pageSchema(),
});

const dataStories = defineCollection({
  loader: glob({ base: "./src/content/data-stories", pattern: "**/{en,ro}.mdx" }),
  schema: pageSchema(),
});

const legal = defineCollection({
  loader: glob({ base: "./src/content/legal", pattern: "**/{en,ro}.mdx" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    translationStatus,
  }),
});

export const collections = { articles, portfolio, dataStories, legal };
