/** Rewrite cloned `./images/` URLs so they work with or without a trailing slash. */
export function resolveLegacyImages(html: string, pathname: string): string {
  const pagePath = pathname.replace(/\/+$/, "");
  if (!pagePath) return html;
  return html
    .replaceAll("./images/", `${pagePath}/images/`)
    .replaceAll("url(./images/", `url(${pagePath}/images/`);
}
