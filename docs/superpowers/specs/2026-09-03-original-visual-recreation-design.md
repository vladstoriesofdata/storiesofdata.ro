# Recreate storiesofdata.com visual design in Astro

Date: 2026-09-03
Status: approved
Branch: `Prepare-for-production`
Reference: live `https://www.storiesofdata.com`, clone in `legacy/`
Related plan: `docs/superpowers/plans/2026-09-02-astro-dual-domain-site.md` (content/SEO already shipped; this spec is visual chrome only)

## Goal

Make the Astro dual-domain site look and behave like the original Webflow site: same layout, type, color, homepage motion, portfolio tabs, and three-level work-page zoom. Keep the existing Astro project, content collections, and public URLs. Do not re-scaffold, do not import `webflow.js`, and do not dump the entire Webflow stylesheet into production.

## Locked product decisions

- Target look: recreate the original, not a “close enough” top-nav restyle.
- Scope: entire public site (homepage chrome and inner-page chrome).
- Method: hybrid restyle. Our CSS and small TypeScript modules; `legacy/` is the visual spec. Port only the CSS needed for cloned MDX class names.
- Homepage left nav matches original items, plus EN/RO under the logo. No standalone Articles item.
- Homepage Portfolio section uses pill tabs **Portfolio / Articles / Case Studies** that swap a card carousel. Case Studies = `dataStories` collection.
- Portfolio and data-story detail pages include the original **three-length zoom** (summary / key subjects / detailed).
- Language switch still changes domain (`.com` ↔ `.ro`), not a path prefix.
- English remains source of truth. Romanian copy is out of scope here.

## Non-goals

- Rewriting business copy or translating Romanian.
- CMS, SSR, Astro `i18n.domains`, DNS cutover.
- Importing the full Webflow CSS file or Webflow runtime.
- Pixel-matching unused Webflow styleguide pages.
- Changing public paths (`/articles/...`, `/portfolio/...`, `/data-stories/...`).
- Enabling the contact form unless `PUBLIC_FORM_ENDPOINT` is already set.

## Architecture

One static Astro 6 site, two builds (`SITE_LOCALE=en|ro`). Visual chrome is two layouts selected by page type:

| Chrome | Pages | Shell |
| --- | --- | --- |
| **HomeChrome** | `/` | Fixed left text nav, full-viewport sections, Lottie, section snap on desktop |
| **WorkChrome** | `/articles/[slug]`, `/portfolio/[slug]`, `/data-stories/[slug]`, and the three index listings | Dark ~80px left rail, logo mark → home, slide-out sibling menu, EN/RO |
| **DocChrome** | `/privacy-policy`, `/terms-and-conditions`, `/404` | Brand + readable document. Not the work rail. |

`BaseLayout.astro` keeps head/SEO/analytics/cookies. It accepts a `chrome` prop (`home` \| `work` \| `doc`) so Header/Footer render the right shell.

Content stays in collections. Homepage strings stay in `src/data/*`. MDX bodies that already contain cloned Webflow HTML stay as-is; we wrap them and restore any zoom-level HTML the migration dropped.

## Visual tokens

Expand `src/styles/tokens.css` from the clone (do not invent a new palette):

- Ink: `#333333`
- Accent: `#00d18e` (canonical; clone `--green-2` `#00cf8c` is treated as the same green)
- Paper: `#ffffff`
- Canvas: `#f3f3f3` / `#f7f7f7`
- Rail: `#333333`
- Muted: `#828282`

Fonts:

- **Akrobat** — nav, buttons, all-caps labels. Copy `.otf` files from `legacy/assets/...` into `src/assets/fonts/` and load locally (no extra CDN).
- **Montserrat** — headings (already loaded).
- **Inconsolata** — body copy (already loaded).

Brand assets already in `src/assets/brand/` (`logo-black.svg`, `logo-white.svg`, `logo-mark.svg`). Copy zoom-in/out SVGs from the clone into `src/assets/brand/` as needed.

## Homepage (HomeChrome)

### Left nav

Desktop: fixed left column.

- Logo (black, swaps to white on the dark contact section) at the top.
- EN/RO under the logo. Current language in accent green. Link uses existing `peerUrl()`.
- Bottom stack, all-caps Akrobat: What we do, Services, Portfolio, Team, Testimonials, Contact.
- Active section in green.
- On `/`, clicks call existing `window.__homepageMoveTo`. Off-home (if DocChrome ever reuses these labels), links are `/#section`.

Mobile (`max-width: 765px`): no section snap (already the rule). Compact header / hamburger instead of the tall left rail. Same section targets.

### Sections

Each desktop section is one viewport, matching current `SectionSnap` (`min-width: 766px`). Keep existing Lottie files and scroll-triggered play.

1. **What we do** — floating-dot intro Lottie; first viewport is the bottom headline “The specialized / data analytics team”. Further chapter copy follows `legacy/index.html` (in-section scroll or extra slides), not a long stacked article on first paint.
2. **Services** — original service tabs (Data-Driven Apps, Contextual Analytics, Data Visualization, Power BI) swap one “you benefit / we help with” panel. Green pill “start a project” → Contact. Data stays in `src/data/services.ts`.
3. **Portfolio** — pill tabs Portfolio / Articles / Case Studies swap a card carousel. Cards link to existing detail URLs. Tab state is client-only; default tab is Portfolio. Data from the three collections.
4. **Team** — photos + bio as on .com. Data in `src/data/team.ts`.
5. **Testimonials** — quote carousel, not a stacked list. Data in `src/data/testimonials.ts`.
6. **Contact** — dark full-screen footer: form, email, phone, privacy/terms. White logo and white nav. Form remains disabled when `PUBLIC_FORM_ENDPOINT` is empty.

### Components to add or reshape

- `Header.astro` — HomeChrome vs WorkChrome vs DocChrome.
- `components/home/Services.astro` — tabbed panel.
- `components/home/PortfolioStrip.astro` — tabs + carousel.
- `components/home/Team.astro`, `Testimonials.astro`, contact block — match clone layout.
- `components/home/Tabs.ts` — accessible tabs (keyboard, `aria-selected`).
- `components/home/Carousel.ts` — prev/next and dots like the clone.

## Inner work pages (WorkChrome)

### Shell

- Dark ~80px left rail, logo mark → `/`.
- Menu control opens a slide-out list of siblings, grouped like the clone (projects / articles / case studies).
- EN/RO in the rail.
- Untranslated banner sits in the content column, not over the rail.

### Three-level zoom (portfolio + data stories only)

Not a browser zoom. Three lengths of the same piece, as on .com:

| Level | Clone wrapper | Tooltip | Role |
| --- | --- | --- | --- |
| 1 | `.cs-planetary-wrapper` | Summary view | Card / embed |
| 2 | `.cs-mountaintop-wrapper` | Key subjects view | Medium length |
| 3 | `.cs-grassroot-wrapper` | Detailed view | Full article |

UI: minus / plus and three dots, bottom-right (`views-nav`). Keyboard: Ctrl+Q less detail, Ctrl+S more detail. Default level is Summary.

Articles (`/articles/[slug]`) do **not** get this control. They are a single long document with WorkChrome.

Implementation:

- Restore any medium/full HTML the MDX migration dropped by copying from `legacy/portfolio/*/index.html` and `legacy/data-stories/*/index.html`.
- If a piece only ever had a summary (hero-only leftovers), longer levels stay empty, same as the original.
- `components/work/ViewZoom.ts` shows one wrapper at a time (`hide` / `show` classes). Do not depend on Webflow IX2.
- Prev/next project controls already in MDX stay wired to existing URLs.

### Listing indexes

`/articles`, `/portfolio`, `/data-stories` remain as URLs for direct hits. Style them with WorkChrome as simple lists. They are not in the homepage nav.

### Legal / 404

DocChrome: logo home, readable type, existing MDX. No work rail, no zoom.

## CSS strategy

Three stylesheets, not one Webflow dump:

1. `tokens.css` — colors, fonts, spacing used everywhere.
2. `chrome.css` — HomeChrome, WorkChrome, DocChrome, buttons, tabs, carousels, zoom control.
3. `legacy-work.css` — scoped under `.legacy-html` for cloned class names (`cs-planetary-wrapper`, cards, embeds, tags). Port only rules those pages need, with local font/image URLs.

Do not load `legacy/assets/.../storiesofdata.webflow.shared.*.css` as a production stylesheet.

## Data and content changes

- `src/data/navigation.ts` — drop Articles; restore “What we do”; keep hash targets aligned with `data-section-name`.
- Portfolio tab mapping is fixed: Portfolio collection → Portfolio tab; articles collection → Articles tab; dataStories → Case Studies tab. Do not add a `kind` frontmatter field.
- MDX: restore missing zoom-level wrappers from `legacy/` where the clone has them.

## Interactions (no Webflow runtime)

| Behavior | Module |
| --- | --- |
| Desktop section snap, nav clicks | existing `SectionSnap.ts` |
| Lottie play/pause | existing `LottieGraphic.astro` |
| Services + portfolio tabs | `Tabs.ts` |
| Portfolio / testimonials carousels | `Carousel.ts` |
| Work slide-out menu | small script in WorkChrome header |
| Summary / key subjects / detailed | `ViewZoom.ts` |

Do not reintroduce jQuery Scrollify or `webflow.js`.

## Testing

- Unit: locale/URL helpers unchanged unless nav helpers move.
- Playwright smoke: homepage loads; left-nav labels; EN/RO points at peer domain.
- Playwright homepage: desktop snap still works; services tabs swap panel; portfolio tabs swap carousel cards.
- Playwright work page: open a portfolio slug that has three wrappers; zoom +/− and dots switch visible length; articles slug has no zoom control.
- Manual: side-by-side with live `.com` for homepage, one article, one portfolio zoom page, contact, mobile width.

## Error handling

- Missing Lottie or font: page still reads; graphics degrade quietly.
- Contact form: stay disabled without endpoint (existing).
- Empty zoom level: show the empty state, do not jump to another level.
- Untranslated banner: existing component, WorkChrome content column.

## Success criteria

A visitor comparing live `.com` and the Astro preview should recognize the same chrome: left homepage nav, full-viewport sections, portfolio pills, dark work rail, and three-length zoom on portfolio/case studies. Differences that remain on purpose: EN/RO, no Webflow badge, dual-domain hreflang, disabled local form.
