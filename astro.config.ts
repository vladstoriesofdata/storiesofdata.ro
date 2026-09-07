import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import copyContentImages from "./scripts/copy-content-images";

const siteUrl = process.env.PUBLIC_SITE_URL ?? "http://localhost:4321";
const base = process.env.PUBLIC_BASE_PATH || "/";

export default defineConfig({
  site: new URL(siteUrl).origin,
  base,
  trailingSlash: "always",
  output: "static",
  integrations: [mdx(), sitemap(), copyContentImages()],
});
