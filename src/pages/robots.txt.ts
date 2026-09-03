import type { APIRoute } from "astro";
import { getSiteConfig } from "../lib/site";

export const GET: APIRoute = ({ site }) => {
  const config = getSiteConfig(import.meta.env);
  const sitemap = `${config.url}/sitemap-index.xml`;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
};
