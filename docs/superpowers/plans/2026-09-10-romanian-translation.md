# Romanian Translation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Romanian site's English fallback copy with faithful, natural Romanian across the homepage, work collections, and available legal content.

**Architecture:** Keep English as the source of truth and preserve the existing `Record<Locale, ...>` data modules plus paired `en.mdx`/`ro.mdx` content entries. Add independent Romanian data objects, localize remaining shared UI labels, translate each Romanian MDX entry without changing its markup structure, and verify every batch with automated guardrails and Astro builds.

**Tech Stack:** Astro 6 static builds, TypeScript locale data, MDX content collections, Vitest, Playwright, npm.

---

## File map

- Create `src/data/ui.ts`: shared navigation, listing-page, legal-link, and menu labels that are currently hardcoded in Astro templates.
- Create `tests/unit/romanian-content.test.ts`: guards locale-object independence, expected translated entries, and the intentionally empty Terms body.
- Modify `src/data/{home,navigation,services,team,testimonials}.ts`: independent Romanian homepage data.
- Modify `src/components/{Header,Footer}.astro`, `src/components/home/Testimonials.astro`, and `src/components/work/WorkMenu.astro`: consume localized shared labels and show the testimonial translation note.
- Modify `src/pages/index.astro`, `src/pages/{articles,portfolio,data-stories}/index.astro`: consume localized page and legal labels.
- Modify all requested `src/content/**/ro.mdx` files: Romanian metadata and body copy.
- Create `playwright.ro.config.ts` and `tests/e2e/homepage-ro.spec.ts`: verify representative Romanian homepage output without changing the existing Playwright configuration.

The pre-existing uncommitted `playwright.config.ts` change is excluded from every task and commit.

### Task 1: Add failing Romanian-content guardrails

**Files:**
- Create: `tests/unit/romanian-content.test.ts`

- [ ] **Step 1: Add the failing unit test**

Create a test that imports the five homepage data modules and reads the expected Romanian MDX entries. Use this complete structure:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { home } from "../../src/data/home";
import { navigation } from "../../src/data/navigation";
import { services } from "../../src/data/services";
import { team } from "../../src/data/team";
import { testimonials } from "../../src/data/testimonials";

const translatedEntries = [
  "articles/become-truly-data-driven-and-you-will-certainly-fail/ro.mdx",
  "articles/full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026/ro.mdx",
  "articles/how-to-turn-your-power-bi-reports-into-a-subscription-based-app/ro.mdx",
  "articles/how-top-companies-capitalize-on-embedded-analytics/ro.mdx",
  "articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026/ro.mdx",
  "articles/microsoft-fabric-medallion-architecture-lessons-learned/ro.mdx",
  "portfolio/a-nobel-prize-data-story/ro.mdx",
  "portfolio/a-romanian-data-story/ro.mdx",
  "portfolio/advanced-matrix-visual-built-with-deneb-in-power-bi/ro.mdx",
  "portfolio/btr-business-case-study/ro.mdx",
  "portfolio/building-a-better-matrix-visual-with-deneb-in-power-bi/ro.mdx",
  "portfolio/category-comparison-bar-chart-power-bi-custom-visual/ro.mdx",
  "portfolio/chainformation-business-case-study/ro.mdx",
  "portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual/ro.mdx",
  "data-stories/lines-on-maps-in-power-bi/ro.mdx",
  "data-stories/redesigning-linkedin-analytics/ro.mdx",
  "legal/privacy-policy/ro.mdx",
  "legal/terms-and-conditions/ro.mdx",
] as const;

const readContent = (entry: string) =>
  readFileSync(resolve(process.cwd(), "src/content", entry), "utf8");

describe("Romanian locale data", () => {
  it("does not alias English homepage objects", () => {
    expect(home.ro).not.toBe(home.en);
    expect(navigation.ro).not.toBe(navigation.en);
    expect(services.ro).not.toBe(services.en);
    expect(team.ro).not.toBe(team.en);
    expect(testimonials.ro).not.toBe(testimonials.en);
  });

  it("marks translated testimonials", () => {
    expect(testimonials.ro.translationNote).toMatch(/traduse din limba engleză/i);
    expect(testimonials.en.translationNote).toBeUndefined();
  });
});

describe("Romanian content entries", () => {
  it.each(translatedEntries)("%s is marked translated", (entry) => {
    expect(readContent(entry)).toContain("translationStatus: translated");
  });

  it("keeps Terms empty after translated metadata", () => {
    const source = readContent("legal/terms-and-conditions/ro.mdx");
    const body = source.replace(/^---[\s\S]*?---/, "").trim();
    expect(body).toBe("<p></p>");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npx vitest run tests/unit/romanian-content.test.ts`

Expected: FAIL because Romanian homepage records alias English, `translationNote` does not exist, and multiple entries remain untranslated.

- [ ] **Step 3: Commit the failing guardrail**

```powershell
git add tests/unit/romanian-content.test.ts
git commit -m "test: add Romanian translation guardrails"
```

### Task 2: Translate homepage and shared UI

**Files:**
- Create: `src/data/ui.ts`
- Modify: `src/data/home.ts`
- Modify: `src/data/navigation.ts`
- Modify: `src/data/services.ts`
- Modify: `src/data/team.ts`
- Modify: `src/data/testimonials.ts`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/home/Testimonials.astro`
- Modify: `src/components/work/WorkMenu.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/articles/index.astro`
- Modify: `src/pages/portfolio/index.astro`
- Modify: `src/pages/data-stories/index.astro`
- Create: `playwright.ro.config.ts`
- Create: `tests/e2e/homepage-ro.spec.ts`

- [ ] **Step 1: Add centralized shared labels**

Create `src/data/ui.ts`:

```ts
import type { Locale } from "../lib/site";

export interface UiCopy {
  menu: string;
  closeMenu: string;
  workMenuLabel: string;
  projects: string;
  articles: string;
  caseStudies: string;
  portfolio: string;
  dataStories: string;
  privacyPolicy: string;
  terms: string;
  legalLabel: string;
}

export const ui: Record<Locale, UiCopy> = {
  en: {
    menu: "menu",
    closeMenu: "Close menu",
    workMenuLabel: "Work",
    projects: "Projects",
    articles: "Articles",
    caseStudies: "Case studies",
    portfolio: "Portfolio",
    dataStories: "Data stories",
    privacyPolicy: "Privacy policy",
    terms: "Terms",
    legalLabel: "Legal",
  },
  ro: {
    menu: "meniu",
    closeMenu: "Închide meniul",
    workMenuLabel: "Proiecte și articole",
    projects: "Proiecte",
    articles: "Articole",
    caseStudies: "Studii de caz",
    portfolio: "Portofoliu",
    dataStories: "Povești bazate pe date",
    privacyPolicy: "Politica de confidențialitate",
    terms: "Termeni și condiții",
    legalLabel: "Informații juridice",
  },
};
```

- [ ] **Step 2: Translate homepage data**

In each existing data module, retain the English object unchanged, add a complete `ro` object matching its interface, and export `{ en, ro }`. Translate every user-facing string, including HTML-bearing strings, while preserving tags and URLs. Keep names, email addresses, phone numbers, brands, and established technical terms unchanged.

In `src/data/testimonials.ts`, extend `TestimonialsCopy` with `translationNote?: string`. Set the Romanian note to `Mărturiile au fost traduse din limba engleză.` and translate the three quotations, roles, and section heading. Do not translate personal names or company names.

- [ ] **Step 3: Wire localized labels**

Import `ui`, select `ui[site.locale]`, and replace hardcoded labels in the listed Astro files. In `Testimonials.astro`, render the optional note immediately after the section heading:

```astro
{copy.translationNote && <p class="testimonials-translation-note">{copy.translationNote}</p>}
```

Add styling that keeps the note visually subordinate and does not change carousel positioning. In the three index routes, localize page title, description, and `<h1>` while continuing to use translated entry metadata for links.

- [ ] **Step 4: Extend Romanian homepage browser coverage**

Create `playwright.ro.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run build:ro && npm run preview:ro -- --host 127.0.0.1 --port 4322",
    port: 4322,
    reuseExistingServer: false,
  },
  use: { baseURL: "http://127.0.0.1:4322" },
});
```

Create `tests/e2e/homepage-ro.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("Romanian homepage renders translated core sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await expect(page.getByText("Servicii și produse", { exact: true })).toBeVisible();
  await expect(page.getByText("Echipa noastră", { exact: true })).toBeVisible();
  await expect(page.getByText("Portofoliu", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Mărturiile au fost traduse din limba engleză.")).toBeVisible();
});
```

Do not alter the pre-existing local `playwright.config.ts` working-tree change.

- [ ] **Step 5: Run focused checks**

Run: `npx vitest run tests/unit/romanian-content.test.ts`

Expected: homepage-object and testimonial-note assertions PASS; MDX status cases may still FAIL until Tasks 3–6.

Run: `npm run build:ro`

Expected: PASS with Romanian homepage and shared chrome rendered.

Run: `npx playwright test tests/e2e/homepage-ro.spec.ts --config=playwright.ro.config.ts`

Expected: 1 passing test.

- [ ] **Step 6: Commit the homepage batch**

```powershell
git add src/data src/components/Header.astro src/components/Footer.astro src/components/home/Testimonials.astro src/components/work/WorkMenu.astro src/pages/index.astro src/pages/articles/index.astro src/pages/portfolio/index.astro src/pages/data-stories/index.astro playwright.ro.config.ts tests/e2e/homepage-ro.spec.ts
git commit -m "feat: translate Romanian homepage and shared UI"
```

### Task 3: Translate all articles

**Files:**
- Modify: `src/content/articles/become-truly-data-driven-and-you-will-certainly-fail/ro.mdx`
- Modify: `src/content/articles/full-pricing-breakdown-for-power-bi-fabric-and-power-bi-embedded-in-2026/ro.mdx`
- Modify: `src/content/articles/how-to-turn-your-power-bi-reports-into-a-subscription-based-app/ro.mdx`
- Modify: `src/content/articles/how-top-companies-capitalize-on-embedded-analytics/ro.mdx`
- Modify: `src/content/articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026/ro.mdx`
- Modify: `src/content/articles/microsoft-fabric-medallion-architecture-lessons-learned/ro.mdx`

- [ ] **Step 1: Translate metadata and bodies**

Use each sibling `en.mdx` as the authoritative source. Translate title, description, headings, paragraphs, captions, list text, table text, and visible labels. Preserve frontmatter dates/tags, imports, JSX components, embedded HTML tags and attributes, CSS classes, image paths, links, code, formulas, product names, and proper nouns. Set every file to `translationStatus: translated`.

- [ ] **Step 2: Verify the article batch**

Run: `npm run build:ro`

Expected: PASS; all six Romanian article routes build without MDX parse errors.

Run: `npx vitest run tests/unit/romanian-content.test.ts`

Expected: the six article status cases PASS.

- [ ] **Step 3: Commit**

```powershell
git add src/content/articles
git commit -m "content: translate Romanian articles"
```

### Task 4: Translate portfolio entries and business case studies

**Files:**
- Modify: `src/content/portfolio/a-nobel-prize-data-story/ro.mdx`
- Modify: `src/content/portfolio/a-romanian-data-story/ro.mdx`
- Modify: `src/content/portfolio/advanced-matrix-visual-built-with-deneb-in-power-bi/ro.mdx`
- Modify: `src/content/portfolio/btr-business-case-study/ro.mdx`
- Modify: `src/content/portfolio/building-a-better-matrix-visual-with-deneb-in-power-bi/ro.mdx`
- Modify: `src/content/portfolio/category-comparison-bar-chart-power-bi-custom-visual/ro.mdx`
- Modify: `src/content/portfolio/chainformation-business-case-study/ro.mdx`
- Modify: `src/content/portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual/ro.mdx`

- [ ] **Step 1: Translate metadata and bodies**

Apply the same fidelity rules as Task 3. Preserve portfolio visuals, `LegacyHtml` wrappers, image ordering, links, custom-visual names, and company names. Translate the BTR and Chainformation case-study narratives in full. Set every file to `translationStatus: translated`.

- [ ] **Step 2: Verify the portfolio batch**

Run: `npm run build:ro`

Expected: PASS; all eight Romanian portfolio routes build.

Run: `npx vitest run tests/unit/romanian-content.test.ts`

Expected: all portfolio status cases PASS.

- [ ] **Step 3: Commit**

```powershell
git add src/content/portfolio
git commit -m "content: translate Romanian portfolio and case studies"
```

### Task 5: Translate both data stories

**Files:**
- Modify: `src/content/data-stories/lines-on-maps-in-power-bi/ro.mdx`
- Modify: `src/content/data-stories/redesigning-linkedin-analytics/ro.mdx`

- [ ] **Step 1: Translate metadata and bodies**

Translate all visible prose and chart annotations represented as content. Preserve technical tokens, images, links, HTML structure, layout classes, and story interactions. Set both files to `translationStatus: translated`.

- [ ] **Step 2: Verify the data-story batch**

Run: `npm run build:ro`

Expected: PASS; both Romanian data-story routes build.

- [ ] **Step 3: Commit**

```powershell
git add src/content/data-stories
git commit -m "content: translate Romanian data stories"
```

### Task 6: Translate legal content without inventing terms

**Files:**
- Modify: `src/content/legal/privacy-policy/ro.mdx`
- Modify: `src/content/legal/terms-and-conditions/ro.mdx`

- [ ] **Step 1: Translate the privacy policy faithfully**

Translate all metadata, headings, paragraphs, and list items from `legal/privacy-policy/en.mdx`. Keep legal meaning, GDPR references, service names, and document structure intact. Correct obvious source-language spelling only when it does not change legal meaning. Set `translationStatus: translated`.

- [ ] **Step 2: Translate Terms metadata only**

Use this complete file:

```mdx
---
title: "Termeni și condiții"
description: "Termeni și condiții"
translationStatus: translated
---

<p></p>
```

- [ ] **Step 3: Verify the legal batch**

Run: `npm run build:ro`

Expected: PASS; the Romanian privacy page renders without an untranslated banner, and Terms renders translated metadata with an empty body.

- [ ] **Step 4: Commit**

```powershell
git add src/content/legal
git commit -m "content: translate Romanian legal pages"
```

### Task 7: Final translation and regression verification

**Files:**
- Modify only files required to resolve failures introduced by Tasks 1–6.

- [ ] **Step 1: Run the complete unit suite**

Run: `npm test`

Expected: PASS with no failed Vitest tests.

- [ ] **Step 2: Run both production builds**

Run: `npm run build`

Expected: PASS; `dist/com` and `dist/ro` are generated.

- [ ] **Step 3: Run browser regression tests**

Run: `npm run test:e2e`

Expected: PASS. If the pre-existing `playwright.config.ts` working-tree modification prevents a clean run, report that separately and do not overwrite or commit it.

- [ ] **Step 4: Search for known fallback markers**

Run:

```powershell
rg "translationStatus: untranslated" src/content -g "ro.mdx"
rg "ro:\s*en" src/data
```

Expected: neither command returns a match.

- [ ] **Step 5: Inspect final repository state**

Run: `git status --short`

Expected: only the pre-existing `playwright.config.ts` modification remains outside committed translation work.

- [ ] **Step 6: Commit any verification-only fixes**

If verification required fixes, stage only those named files and commit:

```powershell
git commit -m "fix: complete Romanian translation verification"
```
