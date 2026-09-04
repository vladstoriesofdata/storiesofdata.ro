# Original Visual Recreation Implementation Plan

> **For agentic workers:** Execute **exactly one task per chat window**. Do not start the next task in the same conversation. Do not run the whole plan with subagent-driven-development. After the task, follow **Chat handoff protocol** below.
>
> Spec: `docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md`
> Branch: `Prepare-for-production`
> Do not re-scaffold Astro. Do not import `webflow.js` or the full Webflow CSS file.

**Goal:** Restyle the existing Astro dual-domain site so it matches storiesofdata.com: left homepage nav, full-viewport sections, portfolio tabs, WorkChrome rail, and three-level zoom on portfolio/case studies.

**Architecture:** Hybrid restyle. Keep collections and URLs. Two visual shells (`HomeChrome` / `WorkChrome`) plus simple `DocChrome`. Small TypeScript modules (`Tabs`, `Carousel`, `ViewZoom`) plus CSS in `tokens.css`, `chrome.css`, and scoped `legacy-work.css`. `legacy/` is the visual spec.

**Tech stack:** Astro 6 static, existing MDX collections, Vitest, Playwright, local Akrobat fonts, existing Lottie + `SectionSnap`.

---

## Chat handoff protocol (required)

This plan is executed **one task per new chat**. The user pastes the **Next chat prompt** into a new window.

### When you start a chat

1. Read this plan and the spec.
2. Do **only** the task named in the prompt (the first unchecked task if the prompt is stale).
3. Follow every checkbox step. Commit as the last step of the task.

### When the task is complete (before you stop)

1. In this plan file, mark that task’s steps `- [x]`.
2. Update the **Task status** table to `Done` for that task and `In progress` is not used across chats — the next chat starts fresh.
3. Replace the **Next chat prompt** section at the top of this file with the **Handoff prompt** from the *following* unchecked task. If this was the last task, set Next chat prompt to: `All visual-recreation plan tasks are done. Do not start new restyle work unless asked.`
4. Commit the plan file together with the task code (same commit is fine) so the next chat sees the checkboxes.
5. In your reply to the user, paste the **Next chat prompt** inside a fenced code block so they can copy it into a new chat.
6. **Stop.** Do not begin the next task.

### Do not

- Skip the plan update.
- Leave “Next chat prompt” pointing at a finished task.
- Commit `.superpowers/` brainstorm files.
- Force-push or change git config.

---

## Next chat prompt

Copy everything in the block below into a **new** chat:

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 4)

Do Task 4 only: BaseLayout chrome + Header shells + language switch.
Do not start Task 5.

When finished: check off Task 4 in the plan, put Task 5’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

## Task status

| Task | Title | Status |
| --- | --- | --- |
| 1 | Design tokens, Akrobat fonts, zoom icons | Done |
| 2 | Homepage navigation data | Done |
| 3 | Tabs, Carousel, ViewZoom modules | Done |
| 4 | BaseLayout chrome + Header shells + language switch | Todo |
| 5 | HomeChrome CSS + What we do / Hero | Todo |
| 6 | Services tabs UI | Todo |
| 7 | Portfolio strip tabs + carousel | Todo |
| 8 | Team, testimonials, contact footer | Todo |
| 9 | WorkChrome rail, menu, indexes, article layout | Todo |
| 10 | Restore zoom HTML, legacy-work CSS, ViewZoom UI | Todo |
| 11 | Playwright coverage and smoke-test updates | Todo |

---

## File map

```text
src/assets/fonts/Akrobat-*.otf          # copied from legacy (Task 1)
src/assets/brand/zoom-*.svg             # copied from legacy (Task 1)
src/assets/brand/team-*.jpg             # copied when Team is restyled (Task 8)
src/styles/tokens.css                   # palette + font tokens (Task 1)
src/styles/global.css                   # @font-face, base (Task 1)
src/styles/chrome.css                   # Home/Work/Doc chrome (Tasks 4–9)
src/styles/legacy-work.css              # scoped cloned class names (Task 10)
src/data/navigation.ts                  # no Articles; what we do (Task 2)
src/components/home/Tabs.ts             # (Task 3)
src/components/home/Carousel.ts         # (Task 3)
src/components/work/ViewZoom.ts         # (Task 3, wired Task 10)
src/layouts/BaseLayout.astro            # chrome prop (Task 4)
src/components/Header.astro             # three shells (Tasks 4, 9)
src/components/LanguageSwitch.astro     # EN + RO (Task 4)
src/components/Footer.astro             # DocChrome only (Task 4 / 8)
src/pages/index.astro                   # chrome="home" (Task 5)
src/components/home/*.astro             # section layouts (Tasks 5–8)
src/layouts/ArticleLayout.astro         # chrome="work" (Task 9)
src/pages/{articles,portfolio,data-stories}/**  # chrome (Task 9)
src/content/portfolio/**/{en,ro}.mdx    # restore wrappers (Task 10)
src/content/data-stories/**/{en,ro}.mdx
tests/unit/navigation.test.ts           # Task 2
tests/unit/tabs.test.ts                 # Task 3
tests/unit/carousel.test.ts             # Task 3
tests/unit/view-zoom.test.ts            # Task 3
tests/e2e/*.spec.ts                     # Task 11
```

Visual reference (do not load as production CSS):

- `legacy/index.html`
- `legacy/portfolio/a-romanian-data-story/index.html`
- `legacy/assets/cdn.prod.website-files.com/6405ef20051268cd8ed6af48/css/storiesofdata.webflow.shared.f3f633232.css`

---

### Task 1: Design tokens, Akrobat fonts, zoom icons

**Files:**
- Create: `src/assets/fonts/Akrobat-Regular.otf`, `Akrobat-SemiBold.otf`, `Akrobat-Bold.otf`, `Akrobat-ExtraBold.otf`, `Akrobat-Black.otf`
- Create: `src/assets/brand/zoom-in-active.svg`, `zoom-in-inactive.svg`, `zoom-out-active.svg`, `zoom-out-inactive.svg`
- Modify: `src/styles/tokens.css`, `src/styles/global.css`, `.gitignore`
- Test: none yet (assets + CSS variables only)

- [x] **Step 1: Ignore brainstorm artifacts**

Append to `.gitignore`:

```
.superpowers/
```

- [x] **Step 2: Copy fonts**

From `legacy/assets/cdn.prod.website-files.com/6405ef20051268cd8ed6af48/` copy and rename:

| Legacy file | Destination |
| --- | --- |
| `6405f328448cacbb14fe26ae_Akrobat-Regular.otf` | `src/assets/fonts/Akrobat-Regular.otf` |
| `6405f3284aff8b415d4eeea0_Akrobat-SemiBold.otf` | `src/assets/fonts/Akrobat-SemiBold.otf` |
| `6405f327430eec508578ed42_Akrobat-Bold.otf` | `src/assets/fonts/Akrobat-Bold.otf` |
| `6405f327d2eb320f356fb662_Akrobat-ExtraBold.otf` | `src/assets/fonts/Akrobat-ExtraBold.otf` |
| `6405f327d2fd132e3c661198_Akrobat-Black.otf` | `src/assets/fonts/Akrobat-Black.otf` |

- [x] **Step 3: Copy zoom icons**

Same legacy folder (filenames contain spaces):

| Legacy file | Destination |
| --- | --- |
| `641c7d09ad835563f35003e3_zoom in_active.svg` | `src/assets/brand/zoom-in-active.svg` |
| `641c7d0803f827b9232cb920_zoom in_inactive.svg` | `src/assets/brand/zoom-in-inactive.svg` |
| `641c7c6e101fcb387a702ae3_zoom out_active.svg` | `src/assets/brand/zoom-out-active.svg` |
| `641c7c6e371b0d73d5a51df2_zoom out_inactive.svg` | `src/assets/brand/zoom-out-inactive.svg` |

- [x] **Step 4: Expand tokens**

Replace `src/styles/tokens.css` with:

```css
@font-face {
  font-family: "Akrobat";
  src: url("../assets/fonts/Akrobat-Regular.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Akrobat";
  src: url("../assets/fonts/Akrobat-SemiBold.otf") format("opentype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Akrobat";
  src: url("../assets/fonts/Akrobat-Bold.otf") format("opentype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Akrobat";
  src: url("../assets/fonts/Akrobat-ExtraBold.otf") format("opentype");
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Akrobat";
  src: url("../assets/fonts/Akrobat-Black.otf") format("opentype");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

:root {
  --color-ink: #333333;
  --color-accent: #00d18e;
  --color-paper: #ffffff;
  --color-canvas: #f3f3f3;
  --color-canvas-2: #f7f7f7;
  --color-rail: #333333;
  --color-muted: #828282;
  --font-sans: "Montserrat", system-ui, sans-serif;
  --font-mono: "Inconsolata", ui-monospace, monospace;
  --font-nav: "Akrobat", "Montserrat", sans-serif;
  --nav-width: 200px;
  --rail-width: 80px;
  --snap-min: 766px;
}
```

If `@font-face` in `tokens.css` fails to resolve from `global.css` import, move the `@font-face` blocks into `global.css` and keep `:root` in `tokens.css`.

- [x] **Step 5: Point global body at tokens only**

Keep `global.css` importing `./tokens.css`. Do not restyle the header into a left rail yet.

- [x] **Step 6: Commit (include this plan with Task 1 checked and Next chat prompt replaced by Task 2’s handoff)**

```
git add .gitignore src/assets/fonts src/assets/brand/zoom-*.svg src/styles/tokens.css src/styles/global.css docs/superpowers/plans/2026-09-03-original-visual-recreation.md
git commit -m "feat: add Akrobat fonts and original-site color tokens"
```

**Handoff prompt (for after Task 1):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 2)

Do Task 2 only: Homepage navigation data.
Do not start Task 3.

When finished: check off Task 2 in the plan, put Task 3’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 2: Homepage navigation data

**Files:**
- Modify: `src/data/navigation.ts`
- Create: `tests/unit/navigation.test.ts`

- [x] **Step 1: Write the failing test**

Create `tests/unit/navigation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { navigation } from "../../src/data/navigation";

describe("navigation", () => {
  it("matches the original homepage items plus no Articles", () => {
    expect(navigation.en.map((item) => item.label)).toEqual([
      "what we do",
      "services",
      "portfolio",
      "team",
      "testimonials",
      "contact",
    ]);
    expect(navigation.en.some((item) => /article/i.test(item.label))).toBe(false);
  });

  it("uses hash targets SectionSnap already understands", () => {
    expect(navigation.en.map((item) => item.homeHref)).toEqual([
      "#what-we-do",
      "#services",
      "#portfolio",
      "#team",
      "#testimonials",
      "#contact",
    ]);
  });

  it("keeps Romanian labels identical until translation exists", () => {
    expect(navigation.ro).toEqual(navigation.en);
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/navigation.test.ts`

Expected: FAIL (Articles still present / labels capitalized).

- [x] **Step 3: Update `src/data/navigation.ts`**

```ts
import type { Locale } from "../lib/site";

export interface NavItem {
  label: string;
  href: string;
  homeHref: string;
}

const en: NavItem[] = [
  { label: "what we do", href: "/#what-we-do", homeHref: "#what-we-do" },
  { label: "services", href: "/#services", homeHref: "#services" },
  { label: "portfolio", href: "/#portfolio", homeHref: "#portfolio" },
  { label: "team", href: "/#team", homeHref: "#team" },
  { label: "testimonials", href: "/#testimonials", homeHref: "#testimonials" },
  { label: "contact", href: "/#contact", homeHref: "#contact" },
];

/** Romanian copy pending; English until translated. */
export const navigation: Record<Locale, NavItem[]> = {
  en,
  ro: en,
};
```

- [x] **Step 4: Run tests**

Run: `npm test -- tests/unit/navigation.test.ts`

Expected: PASS.

Also run: `npx playwright test tests/e2e/homepage-motion.spec.ts`

The Services link name is still “services” (case-insensitive role match). If the test fails on exact name `"Services"`, change it to `/services/i` in that spec in this task.

- [x] **Step 5: Commit with plan checkboxes + Next chat prompt → Task 3**

```
git commit -m "feat: restore original homepage nav items without Articles"
```

**Handoff prompt (for after Task 2):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 3)

Do Task 3 only: Tabs, Carousel, ViewZoom modules.
Do not start Task 4.

When finished: check off Task 3 in the plan, put Task 4’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 3: Tabs, Carousel, ViewZoom modules

**Files:**
- Create: `src/components/home/Tabs.ts`, `src/components/home/Carousel.ts`, `src/components/work/ViewZoom.ts`
- Create: `tests/unit/tabs.test.ts`, `tests/unit/carousel.test.ts`, `tests/unit/view-zoom.test.ts`
- Modify: `vitest.config.ts` if DOM tests need `environment: "jsdom"`. Prefer **no jsdom**: keep helpers pure and test those; put DOM wiring in functions that accept a `ParentNode` and use `happy-dom` only if needed. If Vitest cannot query DOM, add `environment: "node"` tests for pure helpers only, and a tiny `init*` that uses `document` tested via happy-dom.

Preferred split (no new dependency): export pure helpers and test those. `init*` can be thin wrappers used later.

- [x] **Step 1: Failing tests for view order**

Create `tests/unit/view-zoom.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  VIEW_ORDER,
  nextView,
  prevView,
  wrapperSelector,
} from "../../src/components/work/ViewZoom";

describe("ViewZoom helpers", () => {
  it("orders summary → subjects → detail", () => {
    expect(VIEW_ORDER).toEqual(["summary", "subjects", "detail"]);
  });

  it("advances and stops at detail", () => {
    expect(nextView("summary")).toBe("subjects");
    expect(nextView("subjects")).toBe("detail");
    expect(nextView("detail")).toBe("detail");
  });

  it("retreats and stops at summary", () => {
    expect(prevView("detail")).toBe("subjects");
    expect(prevView("subjects")).toBe("summary");
    expect(prevView("summary")).toBe("summary");
  });

  it("maps to cloned wrapper classes", () => {
    expect(wrapperSelector("summary")).toBe(".cs-planetary-wrapper");
    expect(wrapperSelector("subjects")).toBe(".cs-mountaintop-wrapper");
    expect(wrapperSelector("detail")).toBe(".cs-grassroot-wrapper");
  });
});
```

Create `tests/unit/tabs.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { selectTab } from "../../src/components/home/Tabs";

describe("selectTab", () => {
  it("activates the matching panel id", () => {
    const tabs = [
      { id: "portfolio", selected: true },
      { id: "articles", selected: false },
      { id: "case-studies", selected: false },
    ];
    expect(selectTab(tabs, "articles")).toEqual([
      { id: "portfolio", selected: false },
      { id: "articles", selected: true },
      { id: "case-studies", selected: false },
    ]);
  });

  it("ignores unknown ids", () => {
    const tabs = [{ id: "portfolio", selected: true }];
    expect(selectTab(tabs, "nope")).toEqual(tabs);
  });
});
```

Create `tests/unit/carousel.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { nextIndex, prevIndex } from "../../src/components/home/Carousel";

describe("carousel indexes", () => {
  it("wraps forward", () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(nextIndex(2, 3)).toBe(0);
  });

  it("wraps backward", () => {
    expect(prevIndex(0, 3)).toBe(2);
    expect(prevIndex(1, 3)).toBe(0);
  });

  it("stays at 0 when empty", () => {
    expect(nextIndex(0, 0)).toBe(0);
    expect(prevIndex(0, 0)).toBe(0);
  });
});
```

- [x] **Step 2: Run tests — expect FAIL**

Run: `npm test -- tests/unit/view-zoom.test.ts tests/unit/tabs.test.ts tests/unit/carousel.test.ts`

- [x] **Step 3: Implement modules**

`src/components/work/ViewZoom.ts`:

```ts
export type WorkView = "summary" | "subjects" | "detail";

export const VIEW_ORDER: WorkView[] = ["summary", "subjects", "detail"];

const WRAPPERS: Record<WorkView, string> = {
  summary: ".cs-planetary-wrapper",
  subjects: ".cs-mountaintop-wrapper",
  detail: ".cs-grassroot-wrapper",
};

export function wrapperSelector(view: WorkView): string {
  return WRAPPERS[view];
}

export function nextView(current: WorkView): WorkView {
  const i = VIEW_ORDER.indexOf(current);
  return VIEW_ORDER[Math.min(i + 1, VIEW_ORDER.length - 1)];
}

export function prevView(current: WorkView): WorkView {
  const i = VIEW_ORDER.indexOf(current);
  return VIEW_ORDER[Math.max(i - 1, 0)];
}

export function applyView(root: ParentNode, view: WorkView): void {
  for (const name of VIEW_ORDER) {
    const el = root.querySelector(wrapperSelector(name));
    if (!(el instanceof HTMLElement)) continue;
    const on = name === view;
    el.classList.toggle("hide", !on);
    el.classList.toggle("show", on);
    el.hidden = !on;
  }
}

export function initViewZoom(root: ParentNode = document): void {
  const host = root.querySelector("[data-view-zoom]");
  if (!(host instanceof HTMLElement)) return;
  let view: WorkView = "summary";
  applyView(host, view);

  const sync = () => {
    applyView(host, view);
    host.dataset.view = view;
  };

  host.querySelector("[data-zoom-in]")?.addEventListener("click", (event) => {
    event.preventDefault();
    view = nextView(view);
    sync();
  });
  host.querySelector("[data-zoom-out]")?.addEventListener("click", (event) => {
    event.preventDefault();
    view = prevView(view);
    sync();
  });
  host.querySelectorAll<HTMLElement>("[data-zoom-view]").forEach((dot) => {
    dot.addEventListener("click", (event) => {
      event.preventDefault();
      const next = dot.dataset.zoomView;
      if (next === "summary" || next === "subjects" || next === "detail") {
        view = next;
        sync();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!event.ctrlKey) return;
    if (event.key === "s" || event.key === "S") {
      event.preventDefault();
      view = nextView(view);
      sync();
    }
    if (event.key === "q" || event.key === "Q") {
      event.preventDefault();
      view = prevView(view);
      sync();
    }
  });
}
```

`src/components/home/Tabs.ts`:

```ts
export interface TabState {
  id: string;
  selected: boolean;
}

export function selectTab(tabs: TabState[], id: string): TabState[] {
  if (!tabs.some((tab) => tab.id === id)) return tabs;
  return tabs.map((tab) => ({ ...tab, selected: tab.id === id }));
}

export function initTabs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll<HTMLElement>('[role="tab"]')];
    const panels = [...group.querySelectorAll<HTMLElement>('[role="tabpanel"]')];

    const activate = (id: string) => {
      for (const tab of tabs) {
        const on = tab.dataset.tab === id;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
      }
      for (const panel of panels) {
        const on = panel.dataset.tabPanel === id;
        panel.hidden = !on;
      }
    };

    group.addEventListener("click", (event) => {
      const tab = (event.target as Element | null)?.closest<HTMLElement>('[role="tab"]');
      if (!tab || !group.contains(tab) || !tab.dataset.tab) return;
      activate(tab.dataset.tab);
    });

    const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    activate(selected?.dataset.tab ?? tabs[0]?.dataset.tab ?? "");
  });
}
```

`src/components/home/Carousel.ts`:

```ts
export function nextIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return (index + 1) % length;
}

export function prevIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return (index - 1 + length) % length;
}

export function initCarousel(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-carousel]").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll<HTMLElement>("[data-slide]")];
    let index = 0;

    const show = () => {
      slides.forEach((slide, i) => {
        slide.hidden = i !== index;
      });
      carousel.dataset.carouselIndex = String(index);
    };

    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", (event) => {
      event.preventDefault();
      index = nextIndex(index, slides.length);
      show();
    });
    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", (event) => {
      event.preventDefault();
      index = prevIndex(index, slides.length);
      show();
    });
    carousel.querySelectorAll<HTMLElement>("[data-carousel-dot]").forEach((dot) => {
      dot.addEventListener("click", (event) => {
        event.preventDefault();
        const next = Number(dot.dataset.carouselDot);
        if (Number.isInteger(next) && next >= 0 && next < slides.length) {
          index = next;
          show();
        }
      });
    });
    show();
  });
}
```

- [x] **Step 4: Run tests — expect PASS**

Run: `npm test`

- [x] **Step 5: Commit with plan update + Next chat prompt → Task 4**

```
git commit -m "feat: add tabs, carousel, and work-view zoom helpers"
```

**Handoff prompt (for after Task 3):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 4)

Do Task 4 only: BaseLayout chrome + Header shells + language switch.
Do not start Task 5.

When finished: check off Task 4 in the plan, put Task 5’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 4: BaseLayout chrome + Header shells + language switch

**Files:**
- Modify: `src/layouts/BaseLayout.astro`, `src/layouts/ArticleLayout.astro`, `src/components/Header.astro`, `src/components/LanguageSwitch.astro`, `src/components/Footer.astro`, `src/pages/index.astro`, `src/pages/privacy-policy.astro`, `src/pages/terms-and-conditions.astro`, `src/pages/404.astro`, `src/pages/articles/index.astro`, `src/pages/articles/[slug].astro`, `src/pages/portfolio/index.astro`, `src/pages/portfolio/[slug].astro`, `src/pages/data-stories/index.astro`, `src/pages/data-stories/[slug].astro`
- Create: `src/styles/chrome.css`

- [ ] **Step 1: Add `chrome` prop to BaseLayout**

```ts
type Chrome = "home" | "work" | "doc";
```

Default `chrome` to `"doc"`. Pass it to `Header` and `body data-chrome={chrome}`. Import `../styles/chrome.css`. Render `<Footer />` only when `chrome === "doc"`. Homepage contact will own legal links in Task 8.

Set `chrome="home"` on `src/pages/index.astro`. Set `chrome="work"` via `ArticleLayout` for all article/portfolio/data-story pages **and** their index pages. Legal + 404 stay `doc`.

- [ ] **Step 2: Language switch shows EN and RO**

`LanguageSwitch.astro` must render both labels. Current locale is a `<span>` (not a link), peer locale is the existing `peerUrl` `<a>`. Current locale uses `color: var(--color-accent)`. `aria-current="true"` on the current span.

- [ ] **Step 3: Header shells**

`Header.astro` takes `chrome` + `path`.

- `home`: `<header class="site-header home-chrome">` — logo-black, `LanguageSwitch` under logo, `<nav>` of `navigation` items with `data-section-target` as today. Keep the existing click handler that calls `__homepageMoveTo`.
- `work`: `<header class="site-header work-chrome">` — logo-mark → `/`, `LanguageSwitch`. Menu list can be a placeholder `<button type="button" aria-expanded="false">menu</button>` until Task 9. Do not use the homepage section list as the work rail labels.
- `doc`: compact top bar, logo-black → `/`, `LanguageSwitch`, no section nav.

- [ ] **Step 4: Minimal chrome.css so home is a left rail on desktop**

Use `legacy` `.navbar` as spec: fixed left, `width: var(--nav-width)`, `height: 100vh`, transparent background. Logo top, nav bottom, `font-family: var(--font-nav)`, `text-transform: uppercase`, `font-weight: 900`. Main content `margin-left: var(--nav-width)` when `body[data-chrome="home"]` and `min-width: 766px`.

Mobile: header becomes a top bar; nav collapses behind a button. Use existing `SoD_Menu.json` Lottie only if it is already in `src/assets/lottie/`; otherwise a text “menu” button. Do not add Webflow.

Work chrome: `body[data-chrome="work"]` `padding-left: var(--rail-width)` on desktop; header `background: var(--color-rail)`, width `var(--rail-width)`, logo-mark white-on-dark.

Doc chrome: normal top header, `max-width: 48rem` main.

- [ ] **Step 5: Verify**

Run: `npm run dev` and open `/`, `/privacy-policy`, `/articles/microsoft-fabric-medallion-architecture-lessons-learned`.

Expect: homepage left nav (desktop), no Articles, EN/RO pair; legal still readable; article page has dark rail stub.

Run: `npx playwright test tests/e2e/homepage-motion.spec.ts tests/e2e/smoke.spec.ts` and fix selectors if header structure broke them (prefer `header .home-chrome` or `getByRole('link', { name: /services/i })`).

- [ ] **Step 6: Commit with plan update + Next chat prompt → Task 5**

```
git commit -m "feat: add home, work, and doc chrome shells"
```

**Handoff prompt (for after Task 4):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 5)

Do Task 5 only: HomeChrome CSS + What we do / Hero.
Do not start Task 6.

When finished: check off Task 5 in the plan, put Task 6’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 5: HomeChrome CSS + What we do / Hero

**Files:**
- Modify: `src/components/home/Hero.astro`, `src/styles/chrome.css`, `src/pages/index.astro` if needed
- Test: `tests/e2e/homepage-motion.spec.ts` still passes

- [ ] **Step 1: Match hero to `legacy/index.html` first viewport**

`Hero.astro` section `data-section-name="what-we-do"` stays. Desktop: Lottie full-bleed behind content (`opacity` as on live site, not the current 0.35 wash unless the clone uses that). Headline sits bottom of the viewport: “The specialized” heavy, “data analytics team” lighter — split `copy.hero.heading` in the component if needed rather than changing `home.ts` copy strings (do not rewrite business meaning).

Chapters: do not dump all chapters into the first viewport. Follow `legacy/index.html`: extra `.section` blocks for later what-we-do chapters **or** in-section scroll inside `#what-we-do`. Prefer extra `.section` elements with `data-section-name` values already listed in `SectionSnap.ts` comments (`to-shape`, `we-build-applications`, …) **only if** you also extend `HASH_TO_SECTION` so they are reachable. If that would break the six-item nav, keep chapters inside `#what-we-do` as sequential full-viewport slides that snap as separate `.section` nodes but share nav highlight “what we do” (same `data-section-name="what-we-do"` is invalid if snap requires unique names). **Decision for this task:** use unique `data-section-name` values from the clone for extra slides, and keep nav “what we do” pointing at the first one. Extra slides are not separate nav items.

- [ ] **Step 2: Chrome polish**

Active nav link: `color: var(--color-accent)` when that section is current. Header on home is `position: fixed; z-index: 20` (clone navbar). Sticky header from `global.css` homepage-snap rules must not become a top bar on desktop.

- [ ] **Step 3: Verify in the browser** at `http://localhost:4321` desktop 1280 and mobile 375. Compare to https://www.storiesofdata.com/#what-we-do (ignore cookie modal).

Run: `npx playwright test tests/e2e/homepage-motion.spec.ts`

- [ ] **Step 4: Commit with plan update + Next chat prompt → Task 6**

```
git commit -m "feat: restyle homepage what-we-do hero to match original"
```

**Handoff prompt (for after Task 5):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 6)

Do Task 6 only: Services tabs UI.
Do not start Task 7.

When finished: check off Task 6 in the plan, put Task 7’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 6: Services tabs UI

**Files:**
- Modify: `src/components/home/Services.astro`, `src/pages/index.astro` (script)
- Modify: `src/styles/chrome.css`

- [ ] **Step 1: Markup**

One `data-section-name="services-and-products"` section. Heading “Services and products”. `data-tabs` with four `[role=tab]` using `item.title` from `src/data/services.ts`. One visible `[role=tabpanel]` at a time with benefits + help lists. CTA link `#contact` class pill button (`border-radius: 40px`, `background: var(--color-accent)`, `font-family: var(--font-nav)`, uppercase).

- [ ] **Step 2: Init tabs**

In `src/pages/index.astro` script, after snap init:

```ts
import { initTabs } from "../components/home/Tabs";
initTabs();
```

- [ ] **Step 3: Style from clone `.portfolio-tabs` / services tab look** — white pills, shadow `0 1px 3px #0003`, current tab darker text. One viewport on desktop.

- [ ] **Step 4: Browser-check** `/#services`. Click each tab; panel text changes; others hidden.

- [ ] **Step 5: Commit with plan update + Next chat prompt → Task 7**

```
git commit -m "feat: restore homepage services as tabs"
```

**Handoff prompt (for after Task 6):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 7)

Do Task 7 only: Portfolio strip tabs + carousel.
Do not start Task 8.

When finished: check off Task 7 in the plan, put Task 8’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 7: Portfolio strip tabs + carousel

**Files:**
- Modify: `src/components/home/PortfolioStrip.astro`, `src/pages/index.astro`
- Modify: `src/styles/chrome.css`

- [ ] **Step 1: Load three collections** in `PortfolioStrip.astro` (already loads portfolio). Also `getCollection("articles")` and `getCollection("dataStories")`, filter with `isLocaleEntry`, sort by `pubDate` desc.

- [ ] **Step 2: Markup**

Section `id="portfolio"` `data-section-name="portfolio"`. Keep Lottie. `data-tabs` pills: Portfolio / Articles / Case Studies (`data-tab="portfolio"|"articles"|"case-studies"`). Default selected: Portfolio.

Each panel is `data-carousel` with cards as `[data-slide]` links:

- Portfolio → `/portfolio/${slug}`
- Articles → `/articles/${slug}`
- Case Studies → `/data-stories/${slug}`

Card: title + description + “MORE DETAILS”. Prev/next buttons `data-carousel-prev` / `data-carousel-next`. Optional dots.

- [ ] **Step 3: Init**

```ts
import { initCarousel } from "../components/home/Carousel";
initTabs();
initCarousel();
```

(Tabs already imported in Task 6.)

- [ ] **Step 4: Style** — light canvas background `#f7f7f7`, pill tabs like clone `.portfolio-tabs`, cards as white panels. Match `legacy/index.html` portfolio section.

- [ ] **Step 5: Browser-check** click Articles tab, cards change to article titles; Case Studies shows data-stories titles; carousel next wraps.

- [ ] **Step 6: Commit with plan update + Next chat prompt → Task 8**

```
git commit -m "feat: restore homepage portfolio tabs and carousel"
```

**Handoff prompt (for after Task 7):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 8)

Do Task 8 only: Team, testimonials, contact footer.
Do not start Task 9.

When finished: check off Task 8 in the plan, put Task 9’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 8: Team, testimonials, contact footer

**Files:**
- Modify: `src/components/home/Team.astro`, `src/components/home/Testimonials.astro`, `src/pages/index.astro`, `src/styles/chrome.css`, `src/data/team.ts` (add `photo` paths)
- Create: team photos under `src/assets/brand/` copied from `legacy/assets/...` (search `legacy/index.html` for Vlad / Irinel image `src`)
- Modify: `src/components/ContactForm.astro` styles to pill button / clone form fields
- Test: `tests/e2e/smoke.spec.ts` still finds Services heading, Our Team, contact form

- [ ] **Step 1: Team layout** — photos, name, uppercase role, bio, mailto. Lottie stays. Match clone team section.

- [ ] **Step 2: Testimonials** — `data-carousel` of quotes, name, company link. Not a stacked list on desktop.

- [ ] **Step 3: Contact section** — dark full-viewport (`background: var(--color-rail); color: var(--color-paper)`). White logo optional inside section. Form, email, phone. Privacy + terms links here (homepage has no Doc footer). Switch home header logo to `logo-white.svg` when contact is active if clone does (can be CSS `header.home-chrome.is-on-dark` toggled in `SectionSnap` or a small script watching `data-section-name="contact"`). If that risks snap regressions, skip logo swap and only darken the section; note it in the commit message.

- [ ] **Step 4: Browser-check** team, testimonials carousel, contact contrast, form still disabled without endpoint.

Run: `npx playwright test tests/e2e/smoke.spec.ts tests/e2e/homepage-motion.spec.ts`

- [ ] **Step 5: Commit with plan update + Next chat prompt → Task 9**

```
git commit -m "feat: restyle team, testimonials, and contact to match original"
```

**Handoff prompt (for after Task 8):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 9)

Do Task 9 only: WorkChrome rail, menu, indexes, article layout.
Do not start Task 10.

When finished: check off Task 9 in the plan, put Task 10’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 9: WorkChrome rail, menu, indexes, article layout

**Files:**
- Modify: `src/components/Header.astro`, `src/layouts/ArticleLayout.astro`, index and `[slug]` pages under articles/portfolio/data-stories, `src/styles/chrome.css`
- Create: `src/components/work/WorkMenu.astro` if the menu markup is large

- [ ] **Step 1: Work menu data**

In Header (or WorkMenu), `getCollection` for articles, portfolio, dataStories (locale-filtered). Render three groups: projects (`/portfolio/...`), articles (`/articles/...`), case studies (`/data-stories/...`). Current page link gets `aria-current="page"`.

Slide-out: button `aria-expanded`, panel `hidden` until open, overlay click closes. Match clone: panel to the right of the 80px rail, dark background.

- [ ] **Step 2: ArticleLayout**

`chrome="work"`. Include a visually hidden `<h1>{title}</h1>` **only if** the MDX does not already output an `h1` (portfolio MDX often uses `h2`/`h3` inside wrappers). Smoke tests currently require an `h1` on some slugs — keep one accessible heading with the frontmatter title if missing.

Untranslated banner in the content column (`margin` so it is not under the rail).

Do not add ViewZoom UI yet.

- [ ] **Step 3: Indexes**

`/articles`, `/portfolio`, `/data-stories` use `chrome="work"` and a simple list of links. Not in homepage nav.

- [ ] **Step 4: Browser-check** open an article (long-form, no zoom control), open a portfolio slug, open `/articles`. Menu lists siblings. EN/RO in the rail still uses `peerUrl`.

- [ ] **Step 5: Commit with plan update + Next chat prompt → Task 10**

```
git commit -m "feat: restore work-page dark rail and sibling menu"
```

**Handoff prompt (for after Task 9):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 10)

Do Task 10 only: Restore zoom HTML, legacy-work CSS, ViewZoom UI.
Do not start Task 11.

When finished: check off Task 10 in the plan, put Task 11’s handoff prompt into “Next chat prompt”, commit code + plan, paste the Next chat prompt in your reply, and stop.
```

---

### Task 10: Restore zoom HTML, legacy-work CSS, ViewZoom UI

**Files:**
- Create: `src/styles/legacy-work.css`, `src/components/work/ViewZoomBar.astro`
- Modify: `src/layouts/ArticleLayout.astro` or portfolio/data-story slug pages only
- Modify: `src/content/portfolio/**/{en,ro}.mdx`, `src/content/data-stories/**/{en,ro}.mdx` as needed
- Optional create: `scripts/restore-zoom-wrappers.mjs` (run once, commit MDX output)

- [ ] **Step 1: Restore wrappers from legacy**

For each slug under `legacy/portfolio/*/index.html` and `legacy/data-stories/*/index.html`, the page contains `.cs-planetary-wrapper`, `.cs-mountaintop-wrapper`, `.cs-grassroot-wrapper`. Current MDX often has planetary (+ maybe grassroot) only.

Write and run a Node script that, per slug+locale:

1. Reads the legacy HTML (Romanian files do not exist in `legacy/`; copy English wrappers into both `en.mdx` and `ro.mdx`).
2. Extracts the three wrapper outer HTML strings.
3. Rewrites the MDX `legacy-html` `set:html` payload to `planetary + mountaintop + grassroot` in that order, keeping `class="legacy-html"`.

Do not pull `<head>` or `case-study-nav`. Fix image paths so they stay `./images/...` as in current MDX (rewrite `../../assets/cdn...` to the images already copied next to the MDX). If an image is missing, copy it from legacy into `src/content/<collection>/<slug>/images/`.

If a wrapper is empty in legacy, keep the empty wrapper.

- [ ] **Step 2: ViewZoomBar + init**

Only on `path` matching `/portfolio/` or `/data-stories/` slugs (not `/articles/`). Wrap content:

```html
<div class="legacy-html" data-view-zoom>
  <slot /> <!-- MDX already has .legacy-html; avoid double wrap: put data-view-zoom on the existing wrapper via a small MDX parent in the page -->
</div>
```

Cleaner: in `src/pages/portfolio/[slug].astro` and `data-stories/[slug].astro` wrap `<Content />` with:

```html
<div data-view-zoom data-view="summary">
  <Content />
  <ViewZoomBar />
</div>
```

`ViewZoomBar.astro`: minus (`data-zoom-out`), three dots (`data-zoom-view="summary|subjects|detail"`), plus (`data-zoom-in`). Tooltips: “Less detail” / “Summary view” / “Key subjects view” / “Detailed view” / “More detail”. Use the copied zoom SVGs as button backgrounds.

Script on those pages only:

```ts
import { initViewZoom } from "../../components/work/ViewZoom";
initViewZoom();
```

Default view summary: hide mountaintop and grassroot until zoom.

- [ ] **Step 3: `legacy-work.css`**

Import from BaseLayout when `chrome==="work"` or always (file should be unused on home). Scope under `[data-view-zoom]` and `.legacy-html`.

Port from the shared Webflow CSS **only** rules for: `.cs-planetary-wrapper`, `.cs-mountaintop-wrapper`, `.cs-grassroot-wrapper`, `.hide`/`.show`, `.current-cs-thumbnail`, `.pv-embedd-wrapper`, iframe fill, `.projects-nav`, prev/next, `.cs-title`, `.tag`, `.w-richtext` basics. Point `url(...)` at `/` public or content images, never hashed CDN paths.

Do not copy the entire `storiesofdata.webflow.shared.*.css` file.

- [ ] **Step 4: Articles**

Confirm `/articles/[slug]` has **no** `data-view-zoom` and no ViewZoomBar.

- [ ] **Step 5: Browser-check**

Open `/portfolio/a-romanian-data-story`: summary card first; zoom in twice to longer copy; Ctrl+Q back. Open `/articles/is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026`: no zoom bar.

Empty zoom level: remain on that level (helpers already clamp).

- [ ] **Step 6: Commit with plan update + Next chat prompt → Task 11**

```
git commit -m "feat: restore portfolio three-level zoom from the original site"
```

**Handoff prompt (for after Task 10):**

```
Work on branch `Prepare-for-production` at c:\Misc\storiesofdata.ro\storiesofdata.ro.

You are executing ONE task from the visual recreation plan, then stopping.

Read and follow:
- docs/superpowers/specs/2026-09-03-original-visual-recreation-design.md
- docs/superpowers/plans/2026-09-03-original-visual-recreation.md (Chat handoff protocol + Task 11)

Do Task 11 only: Playwright coverage and smoke-test updates.
This is the last task. When finished: check off Task 11, set Next chat prompt to the all-done message in the handoff protocol, commit, paste that message, and stop.
```

---

### Task 11: Playwright coverage and smoke-test updates

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`, `tests/e2e/homepage-motion.spec.ts`
- Create: `tests/e2e/homepage-tabs.spec.ts`, `tests/e2e/work-zoom.spec.ts`

- [ ] **Step 1: Adjust smoke tests**

`tests/e2e/smoke.spec.ts`:

- Home still has team heading and contact form.
- Language switch: `getByRole('link', { name: /Switch to Romanian/i })` still present (or update aria-label if Task 4 changed it).
- Portfolio/data-story pages: do **not** require a visible `h1` that duplicates zoom titles. Assert `data-view-zoom` exists on `/portfolio/a-romanian-data-story` and does **not** exist on `/articles/microsoft-fabric-medallion-architecture-lessons-learned`.
- Nav: homepage header has `what we do` and has no Articles link.

- [ ] **Step 2: Homepage tabs e2e**

Create `tests/e2e/homepage-tabs.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("services tabs swap the panel", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const group = page.locator("#services [data-tabs], [data-section-name='services-and-products'] [data-tabs]");
  await expect(group).toBeVisible();
  await group.getByRole("tab", { name: "Power BI" }).click();
  await expect(group.getByRole("tab", { name: "Power BI" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Building reports").first()).toBeVisible();
});

test("portfolio tabs swap carousel cards", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const group = page.locator("#portfolio [data-tabs]");
  await group.getByRole("tab", { name: /Articles/i }).click();
  await expect(group.getByRole("tab", { name: /Articles/i })).toHaveAttribute("aria-selected", "true");
  await expect(
    page.locator('#portfolio [data-tab-panel="articles"] a[href^="/articles/"]').first(),
  ).toBeVisible();
});
```

Fix locators if IDs differ; keep the assertions.

- [ ] **Step 3: Zoom e2e**

Create `tests/e2e/work-zoom.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("portfolio zoom reveals a longer view", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/portfolio/a-romanian-data-story");
  const host = page.locator("[data-view-zoom]");
  await expect(host).toBeVisible();
  await expect(host.locator(".cs-planetary-wrapper")).toBeVisible();
  await expect(host.locator(".cs-grassroot-wrapper")).toBeHidden();
  await host.locator("[data-zoom-in]").click();
  await host.locator("[data-zoom-in]").click();
  await expect(host.locator(".cs-grassroot-wrapper")).toBeVisible();
});

test("articles do not have zoom controls", async ({ page }) => {
  await page.goto("/articles/microsoft-fabric-medallion-architecture-lessons-learned");
  await expect(page.locator("[data-view-zoom]")).toHaveCount(0);
});
```

- [ ] **Step 4: Run e2e**

Run: `npx playwright test`

Expected: all pass. If preview build is slow, that is normal (`playwright.config.ts` builds `dist/com`).

Fix product code if tests fail for real UI bugs; do not weaken assertions that encode the spec.

- [ ] **Step 5: Commit with plan: Task 11 Done, Next chat prompt = all-done message**

```
git commit -m "test: cover original nav, portfolio tabs, and work-page zoom"
```

**Handoff prompt (for after Task 11):** none. Protocol all-done text:

```
All visual-recreation plan tasks are done. Do not start new restyle work unless asked.
```

---

## Self-review (spec coverage)

| Spec item | Task |
| --- | --- |
| Tokens, Akrobat, accent `#00d18e` | 1 |
| Nav without Articles, + what we do | 2 |
| Tabs / carousel / zoom helpers | 3 |
| HomeChrome / WorkChrome / DocChrome | 4, 5, 9 |
| EN/RO under logo / in rail | 4 |
| Hero + sections | 5, 6, 7, 8 |
| Portfolio / Articles / Case Studies pills | 7 |
| Team, testimonials, dark contact | 8 |
| Work rail + sibling menu | 9 |
| Three-level zoom + restore MDX | 10 |
| No zoom on articles | 10, 11 |
| Playwright | 11 |
| No full Webflow CSS / no webflow.js | 1–11 (stated) |
| Dual-domain language switch unchanged | 4 (`peerUrl`) |