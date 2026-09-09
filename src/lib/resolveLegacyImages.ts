/** Rewrite cloned `./images/` URLs so they work with or without a trailing slash. */
export function resolveLegacyImages(html: string, pathname: string): string {
  const pagePath = pathname.replace(/\/+$/, "");
  if (!pagePath) return html;
  return html
    .replaceAll("./images/", `${pagePath}/images/`)
    .replaceAll("url(./images/", `url(${pagePath}/images/`);
}

const ANALYTICS_LOTTIE = 'class="stickyimg-gv analytics-anim"';
const DESKTOP_ONLY =
  '<div class="warning-mobile-wrapper"><p class="centered">For the best experience this article is only available on desktop.</p></div>';

/** Restore the LinkedIn scrollytelling hooks that Webflow IX2 used to provide. */
export function enhanceAnalyticsLayout(html: string): string {
  let out = html;
  if (out.includes(ANALYTICS_LOTTIE) && !out.includes("data-lottie")) {
    out = out.replace(
      ANALYTICS_LOTTIE,
      `${ANALYTICS_LOTTIE} data-lottie data-scrub="1"`,
    );
  }
  if (out.includes("analytics-blogpost") && !out.includes("warning-mobile-wrapper")) {
    out += DESKTOP_ONLY;
  }
  return out;
}
