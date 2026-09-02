# Astro Dual-Domain Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Handoff:** This file is the continuation point for a new chat. Do not re-open the stack or domain-model debate. Locked decisions below are final unless the user explicitly changes them. Work on branch `Prepare-for-production`. Do not change files until the user asks to implement; if they already asked, start at Task 1.

**Goal:** Turn the Webflow HTML clone of storiesofdata.com into one Astro project that statically builds English for `.com` and Romanian for `.ro`, with content collections as the source of truth.

**Architecture:** One repo, bilingual source, monolingual domains. Each deploy is a single-language static site (`SITE_LOCALE=en|ro`). Do not use Astro `i18n.domains` — that API requires SSR. Keep public URL paths (`/articles/...`, `/portfolio/...`, `/data-stories/...`). Move the current clone into `legacy/` and treat it as a visual/content reference, not as production source.

**Tech stack:** Astro 6 (static), `@astrojs/mdx`, `@astrojs/sitemap`, TypeScript (strict), Vitest for `src/lib`, Playwright for smoke tests, npm, `cross-env` (Windows). Hosting is two static deploys of `dist/com` and `dist/ro` (Azure Static Web Apps preferred later; CI in this plan only has to produce both artifacts).

---

## Handoff context (read this first)

### Current repo (as of 2026-09-02)

- Git branch: `Prepare-for-production` (from `main`, clone of https://www.storiesofdata.com).
- No `package.json`. Production “site” is duplicated Webflow HTML plus hashed CDN files under `assets/cdn.prod.website-files.com/...`.
- Clone tooling: `scripts/clone_site.py`, `scripts/rewrite_cdn.py`, `scripts/fixup_assets.py`.
- Live `.com` is still Webflow. This repo is for a production-ready rebuild that will serve both domains.

### Pages already cloned

**Home:** `index.html` (sections: what we do, services, portfolio, team, testimonials, contact).

**Legal:** `privacy-policy/index.html`. `terms-and-conditions` was in the crawler seed list but is **not** in this clone — recreate from the live `.com` page during legal-page work.

**Articles (6):**

- `articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026`
- `articles/full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026`
- `articles/become-truly-data-driven-and-you-will-certainly-fail`
- `articles/how-top-companies-capitalize-on-embedded-analytics`
- `articles/microsoft-fabric-medallion-architecture-lessons-learned`
- `articles/how-to-turn-your-power-bi-reports-into-a-subscription-based-app`

**Portfolio (8):**

- `portfolio/advanced-matrix-visual-built-with-deneb-in-power-bi`
- `portfolio/building-a-better-matrix-visual-with-deneb-in-power-bi`
- `portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual`
- `portfolio/category-comparison-bar-chart-power-bi-custom-visual`
- `portfolio/a-romanian-data-story`
- `portfolio/a-nobel-prize-data-story`
- `portfolio/btr-business-case-study`
- `portfolio/chainformation-business-case-study`

**Data stories (2):**

- `data-stories/lines-on-maps-in-power-bi`
- `data-stories/redesigning-linkedin-analytics`

### Locked decisions

1. **One Astro project for both domains from day one.**
2. **Astro + content collections** (Content Layer: `src/content.config.ts` + `glob` loader).
3. **Bilingual source, monolingual domains:**
   - `https://www.storiesofdata.com` → English only
   - `https://www.storiesofdata.ro` → Romanian only
4. Language switcher changes **domain**, not a `/en` or `/ro` prefix.
5. English is the source of truth. Every content entry gets `en.mdx` and `ro.mdx`. Romanian starts as an English copy with `translationStatus: untranslated` until real translation exists. The `.ro` build still publishes those pages and shows a short “not yet translated” banner when untranslated.
6. `hreflang` on every page: `en`, `ro`, and `x-default` (x-default → `.com`).
7. Do not keep hashed Webflow CDN paths as the asset model. Brand files go to `src/assets/brand/`. Per-entry images live next to the MDX.
8. Third-party IDs (GA `G-BW55TZPSK3`, Clarity `k1u65f5low`, Iubenda site `3966669` / policy `81160121`) move to env vars. Same IDs are fine until marketing asks for per-domain properties.
9. Contact form: POST to `PUBLIC_FORM_ENDPOINT` (Formspree-compatible). If the env var is empty, render the form disabled so local preview does not 404-post.
10. Visual goal: same IA, brand, and copy as the clone. First ship is correct URLs, SEO, content, and a clean layout using the existing palette (`#00d18e`, `#333333`, Montserrat / Inconsolata). Homepage motion from the clone **must still ship** — it is a required later pass (Task 14), not an optional nice-to-have. That pass restores desktop section-snap scrolling (today: jQuery Scrollify on `.section` at `min-width: 766px`), nav clicks that move between those sections, and the Lottie / scroll-triggered graphics. Do not leave the site permanently as a static long-scroll page.

### Explicit non-goals for this plan

- No CMS (Sanity/Decap). Git + MDX is the CMS.
- No Next.js, no Astro SSR adapter, no Node host.
- No rewriting business copy except locale scaffolding.
- No DNS/cutover of live `.com` in this plan. CI builds both sites; pointing domains is a later ops step.

---

## Target file map

```text
legacy/                              # moved clone (HTML, assets/, old scripts/)
src/
  content.config.ts                  # articles, portfolio, dataStories collections
  content/
    articles/<slug>/{en,ro}.mdx
    articles/<slug>/images/
    portfolio/<slug>/{en,ro}.mdx
    portfolio/<slug>/images/
    data-stories/<slug>/{en,ro}.mdx
    data-stories/<slug>/images/
    legal/{privacy-policy,terms-and-conditions}/{en,ro}.mdx
  data/
    site.ts                          # re-export getSiteConfig
    navigation.ts
    services.ts
    team.ts
    testimonials.ts
    home.ts                          # homepage strings per locale
  lib/
    site.ts                          # locale, URLs, hreflang (unit-tested)
    collections.ts                   # slug + locale filters (unit-tested)
    seo.ts
  layouts/
    BaseLayout.astro
    ArticleLayout.astro
  components/
    Header.astro
    Footer.astro
    LanguageSwitch.astro
    Seo.astro
    UntranslatedBanner.astro
    ContactForm.astro
    Analytics.astro
    CookieBanner.astro
    home/SectionSnap.ts             # later pass: desktop section snap
    home/LottieGraphic.astro      # later pass: scroll-triggered Lottie
  pages/
    index.astro
    404.astro
    privacy-policy.astro
    terms-and-conditions.astro
    articles/index.astro
    articles/[slug].astro
    portfolio/index.astro
    portfolio/[slug].astro
    data-stories/index.astro
    data-stories/[slug].astro
  styles/
    tokens.css
    global.css
  assets/brand/
public/
  robots.txt
  favicon.ico
scripts/migrate-legacy-page.mjs      # one-off HTML → MDX helper
tests/
  unit/site.test.ts
  unit/collections.test.ts
  e2e/smoke.spec.ts
  e2e/homepage-motion.spec.ts        # later pass (Task 14)
astro.config.ts
playwright.config.ts
vitest.config.ts
package.json
.env.example
.github/workflows/build.yml
```

---

## Task 1: Park the clone under `legacy/`

**Files:**
- Move: `index.html`, `articles/`, `portfolio/`, `data-stories/`, `privacy-policy/`, `assets/`, `scripts/` → `legacy/`
- Keep: `.git/`, this plan file, existing git history

- [ ] **Step 1: Create `legacy/` and move clone inputs**

PowerShell (this machine):

```powershell
New-Item -ItemType Directory -Force -Path legacy | Out-Null
Move-Item -Path index.html, articles, portfolio, data-stories, privacy-policy, assets, scripts -Destination legacy
```

Expected: repo root no longer has `index.html`. `legacy/index.html` and `legacy/scripts/clone_site.py` exist. `docs/` stays at repo root.

- [ ] **Step 2: Verify git still sees the moves**

```powershell
git status
```

Expected: renames/deletes of the cloned site, `legacy/` added. No surprise deletes of `.git`.

- [ ] **Step 3: Commit**

```powershell
git add -A
git commit -m "chore: move Webflow clone into legacy/ before Astro scaffold"
```

---

## Task 2: Scaffold Astro at the repo root

**Files:**
- Create: `package.json`, `astro.config.ts`, `tsconfig.json`, `.gitignore`, `.env.example`, `src/pages/index.astro`

- [ ] **Step 1: Scaffold a minimal Astro 6 TypeScript project in-place**

Do **not** run the interactive wizard in a subdirectory. From repo root, after Task 1:

```powershell
npm create astro@latest . -- --template minimal --install --git false --yes
```

If the CLI refuses a non-empty directory, create the files manually instead:

`package.json`:

```json
{
  "name": "storiesofdata",
  "type": "module",
  "version": "0.0.1",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "dev": "cross-env PUBLIC_SITE_LOCALE=en PUBLIC_SITE_URL=http://localhost:4321 astro dev",
    "dev:ro": "cross-env PUBLIC_SITE_LOCALE=ro PUBLIC_SITE_URL=http://localhost:4321 astro dev",
    "build:com": "cross-env PUBLIC_SITE_LOCALE=en PUBLIC_SITE_URL=https://www.storiesofdata.com astro build --outDir dist/com",
    "build:ro": "cross-env PUBLIC_SITE_LOCALE=ro PUBLIC_SITE_URL=https://www.storiesofdata.ro astro build --outDir dist/ro",
    "build": "npm run build:com && npm run build:ro",
    "preview:com": "astro preview --outDir dist/com",
    "preview:ro": "astro preview --outDir dist/ro",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "astro": "astro"
  }
}
```

Then:

```powershell
npm install astro @astrojs/mdx @astrojs/sitemap
npm install -D typescript vitest @playwright/test cross-env
```

- [ ] **Step 2: Add `.gitignore` and `.env.example`**

`.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.env
.env.local
test-results/
playwright-report/
```

`.env.example`:

```
PUBLIC_SITE_LOCALE=en
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_FORM_ENDPOINT=
PUBLIC_GA_ID=G-BW55TZPSK3
PUBLIC_CLARITY_ID=k1u65f5low
PUBLIC_IUBENDA_SITE_ID=3966669
PUBLIC_IUBENDA_POLICY_ID=81160121
PUBLIC_GOOGLE_SITE_VERIFICATION=JLjm6wIyTtC7Gv_0iXyLSNs_1KhYnHqZtgm2aDtLhR0
```

- [ ] **Step 3: Point `astro.config.ts` at a static site URL from env**

```ts
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

const site = process.env.PUBLIC_SITE_URL ?? "http://localhost:4321";

export default defineConfig({
  site,
  output: "static",
  integrations: [mdx(), sitemap()],
});
```

Do **not** set `i18n.domains`. Do **not** set `output: "server"`.

- [ ] **Step 4: Dev server smoke**

```powershell
npm run dev
```

Expected: `http://localhost:4321` serves the Astro starter. Stop the server after checking.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json astro.config.ts tsconfig.json .gitignore .env.example src
git commit -m "chore: scaffold Astro 6 static project at repo root"
```

---

## Task 3: Site config helper (TDD)

**Files:**
- Create: `src/lib/site.ts`
- Test: `tests/unit/site.test.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: Write the failing tests**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
});
```

`tests/unit/site.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getSiteConfig, hreflangLinks, peerUrl } from "../../src/lib/site";

const enEnv = {
  PUBLIC_SITE_LOCALE: "en",
  PUBLIC_SITE_URL: "https://www.storiesofdata.com",
};

const roEnv = {
  PUBLIC_SITE_LOCALE: "ro",
  PUBLIC_SITE_URL: "https://www.storiesofdata.ro",
};

describe("getSiteConfig", () => {
  it("builds the English site", () => {
    const site = getSiteConfig(enEnv);
    expect(site.locale).toBe("en");
    expect(site.url).toBe("https://www.storiesofdata.com");
    expect(site.peer.locale).toBe("ro");
    expect(site.peer.url).toBe("https://www.storiesofdata.ro");
  });

  it("builds the Romanian site", () => {
    const site = getSiteConfig(roEnv);
    expect(site.locale).toBe("ro");
    expect(site.peer.locale).toBe("en");
    expect(site.peer.url).toBe("https://www.storiesofdata.com");
  });

  it("rejects an unknown locale", () => {
    expect(() =>
      getSiteConfig({ PUBLIC_SITE_LOCALE: "de", PUBLIC_SITE_URL: "https://x.test" }),
    ).toThrow(/PUBLIC_SITE_LOCALE/);
  });

  it("strips a trailing slash on the site URL", () => {
    const site = getSiteConfig({
      PUBLIC_SITE_LOCALE: "en",
      PUBLIC_SITE_URL: "https://www.storiesofdata.com/",
    });
    expect(site.url).toBe("https://www.storiesofdata.com");
  });
});

describe("hreflangLinks", () => {
  it("emits en, ro, and x-default for a path", () => {
    const links = hreflangLinks("/articles/example", getSiteConfig(enEnv));
    expect(links).toEqual([
      { lang: "en", href: "https://www.storiesofdata.com/articles/example" },
      { lang: "ro", href: "https://www.storiesofdata.ro/articles/example" },
      { lang: "x-default", href: "https://www.storiesofdata.com/articles/example" },
    ]);
  });
});

describe("peerUrl", () => {
  it("points English pages at the .ro host", () => {
    expect(peerUrl("/portfolio/btr-business-case-study", getSiteConfig(enEnv))).toBe(
      "https://www.storiesofdata.ro/portfolio/btr-business-case-study",
    );
  });
});
```

- [ ] **Step 2: Run tests and confirm they fail**

```powershell
npx vitest run tests/unit/site.test.ts
```

Expected: FAIL because `src/lib/site.ts` does not exist.

- [ ] **Step 3: Implement `src/lib/site.ts`**

```ts
export type Locale = "en" | "ro";

export interface SiteConfig {
  locale: Locale;
  url: string;
  name: string;
  peer: { locale: Locale; url: string };
}

const PEER: Record<Locale, { locale: Locale; url: string }> = {
  en: { locale: "ro", url: "https://www.storiesofdata.ro" },
  ro: { locale: "en", url: "https://www.storiesofdata.com" },
};

export interface SiteEnv {
  PUBLIC_SITE_LOCALE?: string;
  PUBLIC_SITE_URL?: string;
}

function stripSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function joinUrl(base: string, path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (suffix === "/") return stripSlash(base);
  return `${stripSlash(base)}${suffix}`;
}

export function getSiteConfig(env: SiteEnv): SiteConfig {
  const locale = env.PUBLIC_SITE_LOCALE;
  if (locale !== "en" && locale !== "ro") {
    throw new Error("PUBLIC_SITE_LOCALE must be 'en' or 'ro'");
  }
  const url = env.PUBLIC_SITE_URL;
  if (!url) {
    throw new Error("PUBLIC_SITE_URL is required");
  }
  return {
    locale,
    url: stripSlash(url),
    name: "Stories of Data",
    peer: PEER[locale],
  };
}

export function absoluteUrl(path: string, site: SiteConfig): string {
  return joinUrl(site.url, path);
}

export function peerUrl(path: string, site: SiteConfig): string {
  return joinUrl(site.peer.url, path);
}

export function hreflangLinks(
  path: string,
  site: SiteConfig,
): { lang: string; href: string }[] {
  const en = joinUrl("https://www.storiesofdata.com", path);
  const ro = joinUrl("https://www.storiesofdata.ro", path);
  return [
    { lang: "en", href: en },
    { lang: "ro", href: ro },
    { lang: "x-default", href: en },
  ];
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```powershell
npx vitest run tests/unit/site.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add vitest.config.ts tests/unit/site.test.ts src/lib/site.ts
git commit -m "feat: add dual-domain site config helpers"
```

---

## Task 4: Content collections + slug helpers (TDD)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/collections.ts`
- Test: `tests/unit/collections.test.ts`
- Create: `src/content/articles/microsoft-fabric-medallion-architecture-lessons-learned/en.mdx`
- Create: `src/content/articles/microsoft-fabric-medallion-architecture-lessons-learned/ro.mdx`

- [ ] **Step 1: Write collection helper tests**

`tests/unit/collections.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { entryLocale, entrySlug, isLocaleEntry } from "../../src/lib/collections";

describe("entrySlug", () => {
  it("strips the locale suffix", () => {
    expect(entrySlug("microsoft-fabric-medallion-architecture-lessons-learned/en")).toBe(
      "microsoft-fabric-medallion-architecture-lessons-learned",
    );
  });
});

describe("entryLocale", () => {
  it("reads the trailing locale", () => {
    expect(entryLocale("a-romanian-data-story/ro")).toBe("ro");
  });
});

describe("isLocaleEntry", () => {
  it("matches the active locale only", () => {
    expect(isLocaleEntry("lines-on-maps-in-power-bi/en", "en")).toBe(true);
    expect(isLocaleEntry("lines-on-maps-in-power-bi/en", "ro")).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests and confirm they fail**

```powershell
npx vitest run tests/unit/collections.test.ts
```

Expected: FAIL because `src/lib/collections.ts` does not exist.

- [ ] **Step 3: Implement helpers and the collection schema**

`src/lib/collections.ts`:

```ts
import type { Locale } from "./site";

export function entrySlug(id: string): string {
  return id.replace(/\/(en|ro)$/, "");
}

export function entryLocale(id: string): Locale {
  if (id.endsWith("/ro")) return "ro";
  if (id.endsWith("/en")) return "en";
  throw new Error(`Content id '${id}' must end with /en or /ro`);
}

export function isLocaleEntry(id: string, locale: Locale): boolean {
  return entryLocale(id) === locale;
}
```

`src/content.config.ts` — glob **both** locales (`{en,ro}.mdx`), never `en.mdx` only:

```ts
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
```

Seed article `src/content/articles/microsoft-fabric-medallion-architecture-lessons-learned/en.mdx`:

```mdx
---
title: "Microsoft Fabric Medallion Architecture: Lessons Learned"
description: "Learn how we migrated to a Microsoft Fabric medallion architecture and lowered compute costs by 42%."
pubDate: 2026-01-15
translationStatus: translated
tags:
  - fabric
  - medallion
---

A practical account of migrating an older data platform to a Fabric medallion architecture.
```

Seed `ro.mdx` with the same body and `translationStatus: untranslated`. Copy title/description from English for now.

- [ ] **Step 4: Run unit tests**

```powershell
npx vitest run tests/unit/collections.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/content.config.ts src/lib/collections.ts src/content/articles tests/unit/collections.test.ts
git commit -m "feat: add typed content collections for articles, portfolio, and stories"
```

---

## Task 5: Base layout, SEO, 404

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Seo.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/LanguageSwitch.astro`
- Create: `src/pages/404.astro`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Tokens + global CSS**

`src/styles/tokens.css`:

```css
:root {
  --color-ink: #333333;
  --color-accent: #00d18e;
  --color-paper: #ffffff;
  --font-sans: "Montserrat", system-ui, sans-serif;
  --font-mono: "Inconsolata", ui-monospace, monospace;
}
```

`src/styles/global.css`:

```css
@import "./tokens.css";

html,
body {
  margin: 0;
  color: var(--color-ink);
  background: var(--color-paper);
  font-family: var(--font-sans);
}

a {
  color: inherit;
}
```

- [ ] **Step 2: SEO + layout**

`src/components/Seo.astro`:

```astro
---
import { getSiteConfig, hreflangLinks, absoluteUrl } from "../lib/site";

interface Props {
  title: string;
  description: string;
  path: string;
}

const { title, description, path } = Astro.props;
const site = getSiteConfig(import.meta.env);
const canonical = absoluteUrl(path, site);
const alternates = hreflangLinks(path, site);
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content="website" />
{alternates.map((link) => (
  <link rel="alternate" hreflang={link.lang} href={link.href} />
))}
```

`src/components/LanguageSwitch.astro`:

```astro
---
import { getSiteConfig, peerUrl } from "../lib/site";

interface Props {
  path: string;
}

const { path } = Astro.props;
const site = getSiteConfig(import.meta.env);
const label = site.locale === "en" ? "RO" : "EN";
---
<a href={peerUrl(path, site)} hreflang={site.peer.locale}>{label}</a>
```

`src/components/Header.astro`:

```astro
---
import LanguageSwitch from "./LanguageSwitch.astro";

interface Props {
  path: string;
}

const { path } = Astro.props;
---
<header>
  <a href="/">Stories of Data</a>
  <nav>
    <a href="/#services">Services</a>
    <a href="/articles">Articles</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/#contact">Contact</a>
    <LanguageSwitch path={path} />
  </nav>
</header>
```

`src/components/Footer.astro`:

```astro
<footer>
  <a href="/privacy-policy">Privacy policy</a>
  <a href="/terms-and-conditions">Terms</a>
</footer>
```

`src/layouts/BaseLayout.astro`:

```astro
---
import { getSiteConfig } from "../lib/site";
import Seo from "../components/Seo.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
  path: string;
}

const { title, description, path } = Astro.props;
const site = getSiteConfig(import.meta.env);
---
<!doctype html>
<html lang={site.locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Montserrat:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <Seo title={title} description={description} path={path} />
  </head>
  <body>
    <Header path={path} />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 3: Temporary homepage + 404**

`src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout
  title="Microsoft Fabric and Power BI Consultancy Romania"
  description="Stories of Data is a Microsoft Fabric and Power BI consultancy agency in Romania who have helped over 30 customers bring clarity to their data."
  path="/"
>
  <h1>Stories of Data</h1>
</BaseLayout>
```

`src/pages/404.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="Page not found" description="This page does not exist." path="/404">
  <h1>Page not found</h1>
</BaseLayout>
```

- [ ] **Step 4: Build both locales**

```powershell
npm run build
```

Expected: `dist/com/index.html` has `lang="en"` and hreflang to `.ro`. `dist/ro/index.html` has `lang="ro"` and hreflang to `.com`.

- [ ] **Step 5: Commit**

```powershell
git add src/layouts src/components src/pages src/styles
git commit -m "feat: add shared layout, SEO, and language switcher"
```

---

## Task 6: Article routes from collections

**Files:**
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/components/UntranslatedBanner.astro`
- Create: `src/pages/articles/index.astro`
- Create: `src/pages/articles/[slug].astro`

- [ ] **Step 1: Dynamic article page**

`src/pages/articles/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import { getSiteConfig } from "../../lib/site";
import { entrySlug, isLocaleEntry } from "../../lib/collections";
import ArticleLayout from "../../layouts/ArticleLayout.astro";
import UntranslatedBanner from "../../components/UntranslatedBanner.astro";

export async function getStaticPaths() {
  const site = getSiteConfig(import.meta.env);
  const entries = await getCollection("articles", (entry) =>
    isLocaleEntry(entry.id, site.locale),
  );
  return entries.map((entry) => ({
    params: { slug: entrySlug(entry.id) },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const path = `/articles/${entrySlug(entry.id)}`;
---
<ArticleLayout title={entry.data.title} description={entry.data.description} path={path}>
  {entry.data.translationStatus === "untranslated" && <UntranslatedBanner />}
  <h1>{entry.data.title}</h1>
  <Content />
</ArticleLayout>
```

Listing page `src/pages/articles/index.astro` lists the same filtered collection, newest `pubDate` first, linking to `/articles/${slug}`.

`UntranslatedBanner.astro` English string: `This page is not translated yet.` Romanian string: `Această pagină nu este încă tradusă.` Pick copy from `site.locale`.

- [ ] **Step 2: Build and inspect output**

```powershell
npm run build:com
```

Expected: `dist/com/articles/microsoft-fabric-medallion-architecture-lessons-learned/index.html` exists.

```powershell
npm run build:ro
```

Expected: the same path exists under `dist/ro/` and includes the untranslated banner.

- [ ] **Step 3: Commit**

```powershell
git add src/pages/articles src/layouts/ArticleLayout.astro src/components/UntranslatedBanner.astro
git commit -m "feat: render article collection pages per locale"
```

---

## Task 7: Playwright smoke tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Playwright config against the English preview**

`playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run build:com && npm run preview:com -- --host 127.0.0.1 --port 4321",
    port: 4321,
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: "http://127.0.0.1:4321" },
});
```

- [ ] **Step 2: Write smoke tests**

`tests/e2e/smoke.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("home is English and has hreflang", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const ro = page.locator('link[rel="alternate"][hreflang="ro"]');
  await expect(ro).toHaveAttribute("href", "https://www.storiesofdata.ro/");
});

test("seed article renders", async ({ page }) => {
  await page.goto("/articles/microsoft-fabric-medallion-architecture-lessons-learned");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Microsoft Fabric Medallion Architecture",
  );
});

test("unknown path is 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
});
```

- [ ] **Step 3: Install browsers and run**

```powershell
npx playwright install chromium
npx playwright test
```

Expected: 3 passing tests.

- [ ] **Step 4: Commit**

```powershell
git add playwright.config.ts tests/e2e/smoke.spec.ts
git commit -m "test: add Playwright smoke coverage for home, article, and 404"
```

---

## Task 8: Portfolio, data-stories, and legal routes

**Files:**
- Create: `src/pages/portfolio/index.astro`
- Create: `src/pages/portfolio/[slug].astro`
- Create: `src/pages/data-stories/index.astro`
- Create: `src/pages/data-stories/[slug].astro`
- Create: `src/pages/privacy-policy.astro`
- Create: `src/pages/terms-and-conditions.astro`
- Create: one seed MDX per remaining collection so `getStaticPaths` is not empty

`src/pages/portfolio/[slug].astro`:

```astro
---
import { getCollection, render } from "astro:content";
import { getSiteConfig } from "../../lib/site";
import { entrySlug, isLocaleEntry } from "../../lib/collections";
import ArticleLayout from "../../layouts/ArticleLayout.astro";
import UntranslatedBanner from "../../components/UntranslatedBanner.astro";

export async function getStaticPaths() {
  const site = getSiteConfig(import.meta.env);
  const entries = await getCollection("portfolio", (entry) =>
    isLocaleEntry(entry.id, site.locale),
  );
  return entries.map((entry) => ({
    params: { slug: entrySlug(entry.id) },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const path = `/portfolio/${entrySlug(entry.id)}`;
---
<ArticleLayout title={entry.data.title} description={entry.data.description} path={path}>
  {entry.data.translationStatus === "untranslated" && <UntranslatedBanner />}
  <h1>{entry.data.title}</h1>
  <Content />
</ArticleLayout>
```

`src/pages/data-stories/[slug].astro` is the same file with `getCollection("dataStories", ...)` and `path = `/data-stories/${entrySlug(entry.id)}``.

`src/pages/privacy-policy.astro`:

```astro
---
import { getEntry, render } from "astro:content";
import { getSiteConfig } from "../lib/site";
import BaseLayout from "../layouts/BaseLayout.astro";
import UntranslatedBanner from "../components/UntranslatedBanner.astro";

const site = getSiteConfig(import.meta.env);
const entry = await getEntry("legal", `privacy-policy/${site.locale}`);
if (!entry) throw new Error(`Missing legal/privacy-policy/${site.locale}.mdx`);
const { Content } = await render(entry);
---
<BaseLayout title={entry.data.title} description={entry.data.description} path="/privacy-policy">
  {entry.data.translationStatus === "untranslated" && <UntranslatedBanner />}
  <h1>{entry.data.title}</h1>
  <Content />
</BaseLayout>
```

`src/pages/terms-and-conditions.astro` uses `getEntry("legal", `terms-and-conditions/${site.locale}`)` and `path="/terms-and-conditions"`.

Seed:

- `src/content/portfolio/a-romanian-data-story/{en,ro}.mdx`
- `src/content/data-stories/lines-on-maps-in-power-bi/{en,ro}.mdx`
- `src/content/legal/privacy-policy/{en,ro}.mdx` — extract body from `legacy/privacy-policy/index.html`
- `src/content/legal/terms-and-conditions/{en,ro}.mdx` — copy from live https://www.storiesofdata.com/terms-and-conditions if still missing locally

- [ ] **Step 1: Add the four route files plus two legal pages, using the same `getCollection` + `isLocaleEntry` pattern as `src/pages/articles/[slug].astro`.**
- [ ] **Step 2: Extend `tests/e2e/smoke.spec.ts` with one portfolio URL, one data-story URL, and `/privacy-policy`.**
- [ ] **Step 3: Run `npx playwright test` — expected: all pass.**
- [ ] **Step 4: Commit**

```powershell
git add src/pages/portfolio src/pages/data-stories src/pages/privacy-policy.astro src/pages/terms-and-conditions.astro src/content tests/e2e/smoke.spec.ts
git commit -m "feat: add portfolio, data-story, and legal routes"
```

---

## Task 9: Migrate remaining clone pages into MDX

**Files:**
- Create: `scripts/migrate-legacy-page.mjs`
- Create: every remaining `src/content/**/{en,ro}.mdx` listed in Handoff context

Do not invent new slugs. Use the exact folder names from `legacy/`.

- [ ] **Step 1: Write a one-off extractor**

`scripts/migrate-legacy-page.mjs` reads a `legacy/**/index.html`, pulls `<title>`, meta description, and the main article/case-study inner HTML (the node after the case-study nav; inspect `legacy/articles/microsoft-fabric-medallion-architecture-lessons-learned/index.html` for the real selector). It writes `src/content/<type>/<slug>/en.mdx` with that HTML inside the MDX body (HTML in MDX is valid). Then it copies the file to `ro.mdx` and sets `translationStatus: untranslated`.

Copy images referenced by that page from `legacy/assets/...` into `src/content/<type>/<slug>/images/` and rewrite `src` to relative `./images/<name>`. Prefer a human-readable filename (from the suffix after `_` when present, otherwise keep the hash).

- [ ] **Step 2: Run it for every leftover slug**

Work collection by collection. After each collection, `npm run build` must succeed.

Checklist (tick in this plan file as you go):

Articles: 5 remaining after the seed (consultancy-2026, pricing-2026, data-driven, embedded-analytics, subscription-app).

Portfolio: 7 remaining after `a-romanian-data-story`.

Data stories: 1 remaining (`redesigning-linkedin-analytics`).

- [ ] **Step 3: Add a Playwright test that visits `/articles/` and asserts at least 6 links.**
- [ ] **Step 4: Commit**

```powershell
git add scripts/migrate-legacy-page.mjs src/content tests/e2e
git commit -m "feat: migrate cloned articles, portfolio, and data stories to MDX"
```

---

## Task 10: Homepage composition from `src/data`

**Files:**
- Create: `src/data/navigation.ts`
- Create: `src/data/services.ts`
- Create: `src/data/team.ts`
- Create: `src/data/testimonials.ts`
- Create: `src/data/home.ts`
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/Services.astro`
- Create: `src/components/home/PortfolioStrip.astro`
- Create: `src/components/home/Team.astro`
- Create: `src/components/home/Testimonials.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/ContactForm.astro` (create)

Extract copy from `legacy/index.html`. Each data file exports `Record<Locale, ...>`. Components read `getSiteConfig(import.meta.env).locale` and pick that record.

Navigation anchors stay `#services`, `#portfolio`, `#team`, `#testimonials`, `#contact` on the homepage, and `/#services` etc. from inner pages.

Contact form fields: name, email, message (match the clone; if the clone has extra fields, keep them).

```astro
---
const endpoint = import.meta.env.PUBLIC_FORM_ENDPOINT;
const disabled = !endpoint;
---
<form method="POST" action={endpoint || "#contact"} aria-disabled={disabled}>
  <label>Name <input name="name" required disabled={disabled} /></label>
  <label>Email <input type="email" name="email" required disabled={disabled} /></label>
  <label>Message <textarea name="message" required disabled={disabled}></textarea></label>
  <button type="submit" disabled={disabled}>Send</button>
  {disabled && <p>Contact form is not configured in this environment.</p>}
</form>
```

- [ ] **Step 1: Add data modules and homepage section components; compose them in `index.astro`.**
- [ ] **Step 2: Playwright: home contains Services, Team, and the contact form.**
- [ ] **Step 3: Commit**

```powershell
git add src/data src/components/home src/components/ContactForm.astro src/pages/index.astro tests/e2e
git commit -m "feat: rebuild homepage from typed locale data"
```

---

## Task 11: Analytics, cookies, robots

**Files:**
- Create: `src/components/Analytics.astro`
- Create: `src/components/CookieBanner.astro`
- Create: `public/robots.txt`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Load GA and Clarity only when their public env IDs are set.** Gate them behind Iubenda as the clone does (scripts already in `legacy/index.html` head). Pass `lang: site.locale` into `_iub.csConfiguration`.
- [ ] **Step 2: `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://www.storiesofdata.com/sitemap-index.xml
```

`robots.txt` is copied as-is to both builds, so do **not** hardcode one host. Generate it from `src/pages/robots.txt.ts`:

```ts
import type { APIRoute } from "astro";
import { getSiteConfig } from "../lib/site";

export const GET: APIRoute = ({ site }) => {
  const config = getSiteConfig(import.meta.env);
  const sitemap = `${config.url}/sitemap-index.xml`;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`);
};
```

Delete `public/robots.txt` if you add this endpoint so it cannot clash.

- [ ] **Step 3: Confirm `dist/com/robots.txt` cites `.com` and `dist/ro/robots.txt` cites `.ro`.**
- [ ] **Step 4: Commit**

```powershell
git add src/components/Analytics.astro src/components/CookieBanner.astro src/pages/robots.txt.ts src/layouts/BaseLayout.astro
git commit -m "feat: add per-domain robots, analytics, and cookie banner"
```

---

## Task 12: Brand assets and drop Webflow runtime

**Files:**
- Create: `src/assets/brand/` (logos, favicon, default OG image)
- Modify: Header/Footer/Seo to import those assets
- Do not copy the entire `legacy/assets/cdn.prod.website-files.com` tree into `public/`

Copy at least:

- `legacy/assets/cdn.prod.website-files.com/6405ef20051268cd8ed6af48/640afc579331c315829f89e7_SoD_logo_black.svg` → `src/assets/brand/logo-black.svg`
- `.../640afc54d086fd1ad89d3260_SoD_logo_white.svg` → `src/assets/brand/logo-white.svg`
- `.../640aea7c2e2b16ce3b0118ac_SoD_logo mark.svg` → `src/assets/brand/logo-mark.svg`
- `.../640b019094c46d81898b96d4_SoD_favicon.jpg` → `public/favicon.ico` (convert or keep jpg as `public/favicon.jpg` and point `<link rel="icon">`)
- `.../65eec34a4a0b7ff56c04e22c_bold_portfolio_SoD_OGI.jpg` → `src/assets/brand/og-default.jpg`

Remove any remaining `webflow.js`, Webflow badge, `data-wf-*` attributes, and “Go to storiesofdata.com homepage” tooltip copy. Inner-page nav must say the current site name and link to `/`.

Schema.org JSON-LD `url` and `logo` must use `getSiteConfig`, never `https://www.storiesofdata.com` on the `.ro` build.

- [ ] **Step 1: Copy brand files and switch components to them.**
- [ ] **Step 2: `rg "storiesofdata.com" src dist/ro` — the only allowed hits in `dist/ro` are hreflang/canonical-alternate/`peer` URLs, not body copy claiming the page *is* `.com`.**
- [ ] **Step 3: Commit**

```powershell
git add src/assets/brand public src
git commit -m "feat: use local brand assets and remove Webflow chrome"
```

---

## Task 13: CI builds both sites

**Files:**
- Create: `.github/workflows/build.yml`

```yaml
name: build
on:
  push:
    branches: ["Prepare-for-production", "main"]
  pull_request:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: site-com
          path: dist/com
      - uses: actions/upload-artifact@v4
        with:
          name: site-ro
          path: dist/ro
```

Do not add Azure/Cloudflare deploy secrets in this task. Shipping the two artifacts is the success criterion.

- [ ] **Step 1: Add the workflow.**
- [ ] **Step 2: Run `npm test`, `npx playwright test`, and `npm run build` locally — all must pass.**
- [ ] **Step 3: Commit**

```powershell
git add .github/workflows/build.yml
git commit -m "ci: test and build English and Romanian static sites"
```

---

## Task 14: Restore homepage motion (required later pass)

**Do this after Tasks 1–13.** First ship may go live without it. The rebuild is not complete until this task is done.

**Files:**
- Create: `src/components/home/SectionSnap.ts`
- Create: `src/components/home/LottieGraphic.astro`
- Modify: `src/pages/index.astro` and homepage section components so each block is a `.section` with `data-section-name` matching the clone (`what-we-do`, `services-and-products`, `our-team`, `portfolio`, `testimonials`, `contact`)
- Create: `tests/e2e/homepage-motion.spec.ts`
- Copy Lottie JSON from `legacy/assets/` into `src/assets/lottie/` (only the files the homepage actually plays)

Reference behavior in `legacy/index.html` (scrollify init around the `$.scrollify({ section: ".section" ...})` block, plus `Webflow.require("lottie")`).

Do **not** bring back `webflow.js` or jQuery as the production runtime. Rebuild the behavior with a small Astro client island (`client:load` on the homepage only).

Required behavior to match the clone:

1. **Desktop (`min-width: 766px`):** scrolling snaps from full-screen section to full-screen section. Scrollbars stay hidden during snap, same as Scrollify `scrollbars: false`.
2. **Nav clicks** (What we do, Services, Team, Portfolio, Testimonials, Contact) move to that section instead of a raw `scrollIntoView` jump.
3. **`background-anim-wrapper`** gets class `active` on portfolio, our-team, testimonials, and contact (same `before` hook as the clone).
4. **Below 766px:** normal document scroll, no snap (Scrollify is currently gated on that media query).
5. **Lottie graphics** play/resize on the homepage. Copy the JSON the clone uses; wire `lottie-web` (or the already-vendored `lottie.min.js`) as an island. On window resize, call `lottie.resize()` like the clone.

- [ ] **Step 1: Inventory motion from the clone**

Open `legacy/index.html` and list every `.section`, every `data-w-id` interaction, and every `.lottie-animation*` node. Put that list in the commit message or a short comment at the top of `SectionSnap.ts`. Do not skip a graphic that is visible on the live homepage.

- [ ] **Step 2: Implement section snap + nav move**

`SectionSnap.ts` should expose `initHomepageSnap()` and `moveTo(sectionName: string)`. Header/footer nav buttons call `moveTo`. Destroy/disable snap under `766px`.

- [ ] **Step 3: Implement Lottie islands**

Each homepage Lottie is a `LottieGraphic.astro` with `client:visible`, a JSON src from `src/assets/lottie/`, and autoplay/loop matching the clone.

- [ ] **Step 4: Playwright**

`tests/e2e/homepage-motion.spec.ts` (viewport 1280×800):

- clicking Services changes the active section to `services-and-products` (hash or `data-section-name` on the in-view section)
- viewport 375×800: snap is not applied (page scrolls; more than one section can be partially visible)

Run:

```powershell
npx playwright test tests/e2e/homepage-motion.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/components/home src/pages/index.astro src/assets/lottie tests/e2e/homepage-motion.spec.ts
git commit -m "feat: restore homepage section snap and Lottie motion"
```

---

## Verification (done when all of this is true)

- `npm run build` produces `dist/com` and `dist/ro`.
- `.com` HTML is `lang="en"`; `.ro` HTML is `lang="ro"`.
- Article/portfolio/data-story URLs match the clone.
- Adding a page means adding `src/content/<type>/<slug>/{en,ro}.mdx`, not copying HTML.
- `legacy/` is unused at runtime.
- Unit + Playwright tests pass.
- Homepage motion is restored (Task 14): desktop section snap, section nav, Lottie/scroll graphics. First ship may omit this; the project is not done until Task 14 is checked off.

---

## New-chat starter prompt

Paste this into a new agent chat:

> Continue implementation from `docs/superpowers/plans/2026-09-02-astro-dual-domain-site.md` on branch `Prepare-for-production`. Decisions in that file are locked. Start at the first unchecked task. Do not re-scaffold if Astro is already at the repo root. Use superpowers:subagent-driven-development or execute the tasks inline, my choice: inline unless I say otherwise.
