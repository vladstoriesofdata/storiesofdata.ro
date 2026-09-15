# Portfolio and Testimonials Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Match the original horizontal slide motion in Portfolio and Testimonials, correct Portfolio pagination colors, and enable mobile swipe navigation with Previous/Next buttons hidden.

**Architecture:** Extend the existing shared carousel controller with a clipped viewport and horizontal track. Keep the existing desktop/mobile carousel instances and page groupings; use one navigation function for dots, buttons, and swipes.

**Tech Stack:** Astro, TypeScript, CSS, Vitest, Playwright. No new runtime dependencies.

**Spec:** The user-approved design from this task is recorded below as the acceptance criteria. The user requested this plan file after approving the in-chat design on 2026-09-15.

## Acceptance criteria and global constraints

- Portfolio pagination dots are green (`var(--color-accent)`) when active and black (`var(--color-ink)`) when inactive, including initial server-rendered state.
- Testimonials retain their existing correct dot colors.
- Both sections slide horizontally for 500ms with `ease` easing, matching the attributes in `legacy/index.html` (`data-duration="500"`, `data-easing="ease"`, `data-animation="slide"`).
- Clicking a later dot moves the track left; clicking an earlier dot moves it right. Clicking the active dot does nothing.
- Desktop grouping remains four Portfolio cards and two Testimonials per page. Mobile remains one card per slide.
- At widths of 765px and below, Previous/Next buttons are hidden and both sections support left/right swipe navigation.
- Pagination dots remain visible, tappable, and synchronized with the selected slide.
- Vertical page scrolling remains usable. Swiping a linked Portfolio card must not accidentally open its link.
- Honor `prefers-reduced-motion: reduce` by settling immediately rather than animating.
- Keep non-active slides out of keyboard navigation and the accessibility tree.
- Preserve existing card content, links, tab behavior, localization, and independent carousel state.
- Preserve current navigation wraparound semantics. At the last slide, a forward swipe selects the first; at the first, a backward swipe selects the last. A track may slide back across its range at these boundaries; seamless infinite looping is outside this change.
- Do not add autoplay, a carousel library, or desktop arrow controls. Desktop Portfolio arrows are already hidden; Testimonials already use dots only.

## Current implementation

- `src/components/home/Carousel.ts` changes `slide.hidden` immediately, updates `data-carousel-index`, and assigns dot `aria-current` values. It has no swipe handling.
- `src/components/home/PortfolioStrip.astro` renders separate desktop/mobile instances for each Portfolio tab. Initial Portfolio dots do not have `aria-current`.
- `src/components/home/Testimonials.astro` renders desktop/mobile instances with correct initial dot states.
- `src/styles/chrome.css` defines both carousel layouts, hidden-slide rules, dot colors, and the 765px breakpoint.
- `tests/unit/carousel.test.ts` already verifies forward/backward wrapping and empty collections.
- `tests/e2e/homepage-tabs.spec.ts` exercises Portfolio tab changes. `tests/e2e/homepage-motion.spec.ts` exercises homepage section navigation.
- `playwright.config.ts` starts an English build by default. Romanian checks require an explicitly started Romanian preview.

## Task 1: Animated shared carousel and Portfolio dot colors

**Files:**
- Modify: `src/components/home/Carousel.ts`
- Modify: `src/components/home/PortfolioStrip.astro`
- Modify: `src/components/home/Testimonials.astro`
- Modify: `src/styles/chrome.css`
- Create: `tests/e2e/carousel.spec.ts`

**Interfaces:**
- Keep `initCarousel(root: ParentNode = document): void`, `nextIndex`, and `prevIndex` exports.
- Add `[data-carousel-viewport]` and `[data-carousel-track]` inside each existing `[data-carousel]` instance. Keep controls outside the viewport.
- Keep `[data-slide]`, `[data-carousel-dot]`, and `data-carousel-index` as the navigation and test hooks.
- Use one internal `goTo(next: number): void` per instance to validate targets, update track position, accessibility, height, and dots.

- [x] **Step 1: Add browser behavior coverage and reproduce the failures.**

In `tests/e2e/carousel.spec.ts`, test both desktop selectors at 1280 × 800: `.portfolio-panel:not([hidden]) .portfolio-carousel-desktop` and `.testimonials-carousel-desktop`. Click their second dot, verify the active state and a changing track position during the transition, then wait for the final selected slide to occupy the viewport. Check a return click and an active-dot no-op. Verify Portfolio colors before and after selection:

```ts
await expect(carousel.locator('[data-carousel-dot="0"]')).toHaveCSS('background-color', 'rgb(0, 209, 142)');
await expect(carousel.locator('[data-carousel-dot="1"]')).toHaveCSS('background-color', 'rgb(51, 51, 51)');
await carousel.locator('[data-carousel-dot="1"]').click();
await expect(carousel).toHaveAttribute('data-carousel-index', '1');
```

For animation coverage, sample the computed track transform on successive animation frames while a transition is active; assert an intermediate position exists, followed by the correct final slide position. Do not rely solely on a declared CSS duration or a fixed timeout.

Run: `npx playwright test tests/e2e/carousel.spec.ts`

Expected before implementation: failures for Portfolio colors and missing animated track.

- [x] **Step 2: Add viewport/track markup to all four carousel variants.**

Wrap the existing slide loop without changing its contents:

```html
<div data-carousel-viewport>
  <div data-carousel-track>
    <!-- Existing slide loop remains here. -->
  </div>
</div>
```

Keep initial inactive slides `hidden` for the pre-initialization fallback. Set Portfolio dot `aria-current={pageIndex === 0 ? "true" : "false"}` on desktop and the equivalent `slideIndex` expression on mobile.

- [x] **Step 3: Add shared layout and motion styles.**

Use these rules as the basis, scoped to the new carousel attributes:

```css
[data-carousel-viewport] { overflow: hidden; min-width: 0; }
[data-carousel-track] {
  display: flex;
  align-items: flex-start;
  transition: transform 500ms ease;
}
[data-carousel-track] > [data-slide] {
  flex: 0 0 100%;
  min-width: 0;
  box-sizing: border-box;
}
.portfolio-carousel-dot { background: var(--color-ink); }
.portfolio-carousel-dot[aria-current="true"] { background: var(--color-accent); }
@media (prefers-reduced-motion: reduce) {
  [data-carousel-track] { transition: none; }
}
```

Ensure each track occupies its viewport width, so percentage translation advances one full page. Keep card shadows and keyboard focus outlines visible with suitable viewport inset space. Account for the existing Portfolio grid top margin when measuring height.

- [x] **Step 4: Replace hide/show navigation with track navigation.**

On initialization, unhide slides in the enhanced track and set its initial position without an entry animation. For every selection, use:

```ts
track.style.transform = `translateX(-${index * 100}%)`;
slides.forEach((slide, i) => {
  slide.inert = i !== index;
  slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
});
```

Update dots and `data-carousel-index` in the same function. Preserve button callbacks through `nextIndex` and `prevIndex`. Reject invalid or unchanged targets. Allow rapid dot clicks to retarget the CSS transition from its current visual position rather than queue animations.

Use `ResizeObserver` to size the viewport for the active slide, including its vertical margins, and recalculate after images/fonts load or a hidden tab becomes visible. During a slide transition, allow enough height for both outgoing and incoming content; settle to the selected height at completion. Do not wait for `transitionend` in reduced-motion mode. Guard hidden/zero-width carousel measurements so tab switches and breakpoint changes recover correctly. Empty carousels should return safely; one-slide carousels should remain stable.

- [x] **Step 5: Verify desktop behavior and reduced motion.**

Extend browser coverage to rapid dot changes, offscreen links being inert, reduced motion, Portfolio tab switches, and resizing from desktop to mobile and back. Check for clipped content, horizontal page overflow, and excessive empty space under short slides.

Run: `npx vitest run tests/unit/carousel.test.ts`

Run: `npx playwright test tests/e2e/carousel.spec.ts tests/e2e/homepage-tabs.spec.ts tests/e2e/homepage-motion.spec.ts`

Expected: all selected tests pass, including actual intermediate movement with normal motion and immediate settling with reduced motion.

## Task 2: Mobile swipe navigation and hidden buttons

**Files:**
- Modify: `src/components/home/Carousel.ts`
- Modify: `src/styles/chrome.css`
- Extend: `tests/e2e/carousel.spec.ts`

**Interfaces:**
- Swipe listeners attach to `[data-carousel-viewport]` and use Task 1's internal `goTo` function.
- Swipe gestures act only when `matchMedia('(max-width: 765px)').matches` and there are at least two slides.
- Use Pointer Events for touch/pen input. Ignore secondary pointers and mouse dragging.

- [x] **Step 1: Add mobile behavior checks before implementation.**

At 375 × 800 with touch input enabled, verify both sections advance on a left swipe and return on a right swipe. Verify dots follow the selection and no Previous/Next button is visible. Test a short gesture, a primarily vertical gesture, and a cancelled pointer sequence: none should change slides. Test first/last wrapping and a Portfolio card swipe that leaves the URL unchanged.

Run: `npx playwright test tests/e2e/carousel.spec.ts`

Expected before implementation: mobile swipe and hidden Portfolio button checks fail.

- [x] **Step 2: Hide mobile controls and preserve vertical touch scrolling.**

```css
@media (max-width: 765px) {
  .portfolio-carousel-btn { display: none; }
  [data-carousel-viewport] { touch-action: pan-y pinch-zoom; }
}
```

Retain button markup so existing localized-label assertions remain valid. Testimonials require no new buttons or button markup changes.

- [x] **Step 3: Implement a deliberate horizontal swipe.**

Record the primary pointer ID and starting coordinates. On release, accept a gesture only when its horizontal distance is at least 40px and greater than 1.25 times its vertical distance:

```ts
const horizontalSwipe = Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.25;
if (horizontalSwipe) {
  goTo(dx < 0 ? nextIndex(index, slides.length) : prevIndex(index, slides.length));
}
```

Reset tracking on `pointercancel`, lost capture, or a breakpoint change. Suppress the click immediately generated by a recognized swipe using a scoped capture listener and a short-lived flag; normal subsequent taps and keyboard activation must work. Do not prevent default on ordinary taps or vertical scrolling. Slides animate after gesture release; continuous finger-following drag is not required.

- [ ] **Step 4: Verify real touch behavior and regression coverage.**

Automated touch checks and responsive visual review completed; physical-device pinch-zoom confirmation remains a manual follow-up.

Use browser touch input for at least one end-to-end swipe case; dispatched Pointer Events alone do not prove native scrolling works. Manually confirm vertical scrolling and pinch zoom on a touch-capable browser/device. Check 375px, 765px, 766px, and 1280px widths, both sections, all Portfolio tabs, ordinary card taps, and interrupted gestures.

Run: `npx playwright test tests/e2e/carousel.spec.ts tests/e2e/homepage-tabs.spec.ts tests/e2e/homepage-motion.spec.ts`

Expected: all selected tests pass and no page overflow or accidental navigation occurs.

## Final validation and handoff

- [x] Run `npm test` and `npm run build` to validate unit tests and both English/Romanian production builds.
- [x] With no other server occupying port 4321, run `npm run preview:ro -- --host 127.0.0.1 --port 4321`, then run `npx playwright test tests/e2e/homepage-ro.spec.ts tests/e2e/carousel.spec.ts`. The existing Playwright configuration reuses the running server outside CI. Stop only the preview process started for this check afterward.
- [x] Review the final diff for unintended content, layout, or localization changes. Preserve the unrelated existing untracked `tmp-review-t4.py` file.
- [x] Report changed files, passing checks, and any verification that could not be completed. This plan authorizes no deployment or publication.

## Implementation record — 2026-09-15

- Implemented on `codex/carousel-motion-mobile-swipe` in the existing checkout.
- Portfolio dots reuse the Testimonials ink color (`#333`) and accent green (`#00d18e`). The original test example assumed pure black; corrected to the existing design token.
- Added a 40px track gap and 16px viewport inset to preserve shadows/focus outlines while avoiding adjacent-slide peeking and narrow-screen overflow. Translation includes that gap.
- Transition height includes only pages involved in the current movement, then settles to the selected page.
- Browser tests block the external consent script so it cannot intercept gestures. Native touch input verifies swipes, wraparound, cancellation, vertical scrolling, and normal taps after a swipe. The tap case runs separately from the cancelled-touch/scroll sequence.
- Verification: 76 unit tests passed; 7 carousel browser tests passed in English; 9 carousel/Romanian-page checks passed against the Romanian production build; 6 existing homepage motion/tab checks passed. English and Romanian production builds passed (existing lottie-web eval warning).
- Romanian preview used port 4331 with a temporary test config to avoid disrupting the English server on 4321.
- Desktop Portfolio and mobile Testimonials screenshots visually reviewed. Physical-device pinch zoom was not tested; CSS preserves pinch zoom with `touch-action: pan-y pinch-zoom`.
- Independent review found no blocking issue; its height and interaction-coverage observations were addressed.
- No publication, deployment, or merge performed.
