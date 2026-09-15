/**
 * Homepage motion inventory (from legacy/index.html — no jQuery / webflow.js).
 *
 * Snap sections (clone `.section[data-section-name]`):
 *   what-we-do, to-shape, we-build-applications, we-embed-analytics,
 *   we-design-visualizations, we-are-power-bi-experts, services-and-products,
 *   portfolio, our-team, testimonials, contact
 * Nav still has six items. Extra what-we-do chapter slides snap individually
 * (to-shape, we-build-applications, …) and keep the “what we do” nav highlight.
 *
 * data-w-id interactions noted but not restored as Webflow IX2:
 *   2026ea46-… navbar, c1469a58-… menu lottie, 1a6b2ab7-… mobile intro,
 *   01b20563-… background steps, d9f1c9dc-… scroll-snap-wrapper,
 *   e56dbd6a-… / 1a1a279e-… hero + desktop intro, chapter fade wrappers,
 *   c047ee45-… services, b9b527c5-… / c8d9f489-… portfolio + zoom lottie,
 *   af7049fe-… / cd206e42-… team + dots lottie, 1ec183ec-… testimonials,
 *   eff519c1-… contact
 *
 * Homepage Lottie nodes (data-animation-type="lottie"):
 *   desktop intro loop_2.json (hero desktop, loop+autoplay)
 *   desktop intro loop_2.json (hero mobile, loop+autoplay in the header band)
 *   1-2-3-4-5.json (background-anim-wrapper, paused / IX2)
 *   portfolio zoom6.json (portfolio, paused / IX2)
 *   connected more dots_loop.json (team, paused / IX2)
 *   SoD_Menu.json (navbar hamburger — no hamburger in this header)
 *   okay.json is not referenced by legacy/index.html
 */
import { setLottieProgress } from "./lottieGraphics";

export const SNAP_MQ = "(min-width: 766px)";

const BACKGROUND_ACTIVE = new Set([
  "portfolio",
  "our-team",
  "testimonials",
  "contact",
]);

const STEPS_SECTIONS = [
  "what-we-do",
  "to-shape",
  "we-build-applications",
  "we-embed-analytics",
  "we-design-visualizations",
  "we-are-power-bi-experts",
] as const;

export function stepsProgressForSection(sectionName: string | undefined): number {
  if (!sectionName) return 0;
  const index = STEPS_SECTIONS.indexOf(sectionName as (typeof STEPS_SECTIONS)[number]);
  if (index === -1) return 1;
  return index / (STEPS_SECTIONS.length - 1);
}

/** Scroll progress (0–1) through a block, matching Webflow SCROLLING_IN_VIEW. */
export function scrollProgressThroughBlock(
  top: number,
  height: number,
  y: number,
  viewportHeight: number,
): number {
  const max = height - viewportHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, (y - top) / max));
}

/** Maps what-we-do scroll progress to steps Lottie progress (legacy IX2 keyframes 25–70). */
export function stepsProgressFromWhatWeDoScroll(scrollProgress: number): number {
  if (scrollProgress <= 0.25) return 0;
  if (scrollProgress >= 0.7) return 1;
  return (scrollProgress - 0.25) / 0.45;
}

/** Viewport Y where chapter copy should sit on mobile (below the fixed animation band). */
export function mobileReadingLine(root: ParentNode = document): number {
  const docEl = root instanceof Document ? root.documentElement : document.documentElement;
  const header = root.querySelector("header.home-chrome");
  const headerBottom = header instanceof HTMLElement ? header.getBoundingClientRect().bottom : 60;
  const animHeight =
    Number.parseFloat(getComputedStyle(docEl).getPropertyValue("--mobile-anim-height")) || 250;
  return headerBottom + animHeight + 48;
}

export function interpolateProgressAlongCenters(
  readLine: number,
  points: { progress: number; center: number }[],
): number {
  if (points.length === 0) return 0;
  if (readLine <= points[0].center) return 0;
  if (readLine >= points[points.length - 1].center) return 1;

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    if (readLine >= start.center && readLine <= end.center) {
      const t = (readLine - start.center) / (end.center - start.center);
      return start.progress + t * (end.progress - start.progress);
    }
  }

  return 1;
}

function sectionReadingAnchor(el: HTMLElement): number {
  const anchor =
    el.querySelector<HTMLElement>(".hero-heading, .hero-lede, .hero-chapter-heading") ?? el;
  const rect = anchor.getBoundingClientRect();
  return rect.top + rect.height / 2;
}

/** Scrub the steps morph to match whichever chapter headline is in the reading zone. */
export function stepsProgressFromReadingLine(readLine: number, root: ParentNode = document): number {
  const points = STEPS_SECTIONS.map((name, index) => {
    const el =
      root.querySelector<HTMLElement>(`[data-section-name="${name}"]`) ??
      root.querySelector<HTMLElement>(`#${name}`);
    if (!el) return null;
    return {
      progress: index / (STEPS_SECTIONS.length - 1),
      center: sectionReadingAnchor(el),
    };
  }).filter((point): point is { progress: number; center: number } => point !== null);

  return interpolateProgressAlongCenters(readLine, points);
}

function activeSectionAtReadingLine(readLine: number): string | undefined {
  let best: string | undefined;
  let bestDist = Infinity;
  for (const name of STEPS_SECTIONS) {
    const el = findSection(name);
    if (!el) continue;
    const dist = Math.abs(sectionReadingAnchor(el) - readLine);
    if (dist < bestDist) {
      bestDist = dist;
      best = name;
    }
  }
  return best;
}

export function stepsVisibleFromWhatWeDoScroll(scrollProgress: number): boolean {
  return scrollProgress >= 0.24 && scrollProgress < 0.901;
}

export const HASH_TO_SECTION: Record<string, string> = {
  "what-we-do": "what-we-do",
  "to-shape": "to-shape",
  "we-build-applications": "we-build-applications",
  "we-embed-analytics": "we-embed-analytics",
  "we-design-visualizations": "we-design-visualizations",
  "we-are-power-bi-experts": "we-are-power-bi-experts",
  services: "services-and-products",
  "services-and-products": "services-and-products",
  team: "our-team",
  "our-team": "our-team",
  portfolio: "portfolio",
  testimonials: "testimonials",
  contact: "contact",
};

const WHAT_WE_DO_SECTIONS = new Set([
  "what-we-do",
  "to-shape",
  "we-build-applications",
  "we-embed-analytics",
  "we-design-visualizations",
  "we-are-power-bi-experts",
]);

export function navTargetForSection(sectionName: string): string {
  if (WHAT_WE_DO_SECTIONS.has(sectionName)) return "what-we-do";
  return sectionName;
}

export type HeaderTone = "default" | "accent" | "dark";

export function headerToneForSection(sectionName: string | undefined): HeaderTone {
  if (sectionName === "contact") return "dark";
  if (sectionName === "services-and-products") return "accent";
  return "default";
}

const DURATION_MS = 520;

let snapEnabled = false;
let animating = false;
let started = false;
let pendingSnap: HTMLElement | null = null;
let disableSnap: (() => void) | null = null;
let disableMobileScroll: (() => void) | null = null;

declare global {
  interface Window {
    __homepageMoveTo?: (sectionName: string) => void;
  }
}

export function sectionNameFromHash(hash: string): string | undefined {
  const key = hash.replace(/^#/, "").trim();
  return HASH_TO_SECTION[key];
}

function sections(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(".section[data-section-name]")];
}

function findSection(name: string): HTMLElement | null {
  const normalized = name.replace(/^#/, "").trim();
  const sectionName = HASH_TO_SECTION[normalized] ?? normalized;
  return (
    document.querySelector<HTMLElement>(`[data-section-name="${sectionName}"]`) ??
    document.getElementById(normalized)
  );
}

function headerOffset(): number {
  const header = document.querySelector("header");
  if (!(header instanceof HTMLElement)) return 0;
  if (header.classList.contains("home-chrome") && window.matchMedia(SNAP_MQ).matches) {
    return 0;
  }
  return header.offsetHeight;
}

function scrollY(): number {
  return window.scrollY || document.body.scrollTop || document.documentElement.scrollTop;
}

function scrollToY(top: number): void {
  window.scrollTo(0, top);
  document.body.scrollTop = top;
  document.documentElement.scrollTop = top;
}

function targetTop(el: HTMLElement): number {
  const raw = scrollY() + el.getBoundingClientRect().top - headerOffset();
  const max = Math.max(
    0,
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight,
  );
  return Math.max(0, Math.min(raw, max));
}

function syncHash(el: HTMLElement): void {
  if (!el.id) return;
  const next = `#${el.id}`;
  if (location.hash !== next) {
    history.replaceState(null, "", next);
  }
}

function applyBackground(sectionName: string | undefined): void {
  const wrapper = document.querySelector(".background-anim-wrapper");
  if (!(wrapper instanceof HTMLElement) || !sectionName) return;
  wrapper.classList.toggle("active", BACKGROUND_ACTIVE.has(sectionName));
}

function applyStepsProgress(progress: number): void {
  setLottieProgress(progress);
}

function syncHomeHeaderHeight(): void {
  const header = document.querySelector("header.home-chrome");
  if (!(header instanceof HTMLElement)) return;
  document.documentElement.style.setProperty("--home-header-height", `${header.offsetHeight}px`);
}

function stepsScrollBlock(): { top: number; height: number } | null {
  const first = findSection(STEPS_SECTIONS[0]);
  const last = findSection(STEPS_SECTIONS[STEPS_SECTIONS.length - 1]);
  if (!(first instanceof HTMLElement) || !(last instanceof HTMLElement)) return null;
  const top = scrollY() + first.getBoundingClientRect().top;
  const bottom = scrollY() + last.getBoundingClientRect().bottom;
  return { top, height: bottom - top };
}

function syncMobileScroll(): void {
  if (snapEnabled || animating) return;
  syncHomeHeaderHeight();
  const block = stepsScrollBlock();
  if (!block) return;

  const whatWeDoProgress = scrollProgressThroughBlock(
    block.top,
    block.height,
    scrollY(),
    window.innerHeight,
  );
  const readLine = mobileReadingLine();
  const services = findSection("services-and-products");
  const inHero = !services || services.getBoundingClientRect().top > readLine - 48;
  const progress = stepsProgressFromReadingLine(readLine);
  const stepsSection = inHero ? activeSectionAtReadingLine(readLine) : undefined;
  const sectionName = stepsSection ?? sections()[currentIndex()]?.dataset.sectionName;

  applyBackground(sectionName);
  syncNav(sectionName);
  syncHeaderTone(sectionName);

  const wrapper = document.querySelector(".background-anim-wrapper");
  if (wrapper instanceof HTMLElement) {
    wrapper.classList.toggle(
      "mobile-steps-visible",
      inHero && progress > 0,
    );
  }

  applyStepsProgress(progress);
  document.documentElement.style.setProperty(
    "--mobile-intro-opacity",
    String(inHero ? Math.max(0, 1 - progress / 0.2) : 0),
  );
  document.documentElement.style.setProperty("--what-we-do-scroll", String(whatWeDoProgress));
}

function syncNav(sectionName: string | undefined): void {
  const target = sectionName ? navTargetForSection(sectionName) : undefined;
  document.querySelectorAll<HTMLAnchorElement>("header.home-chrome a[data-section-target]").forEach((link) => {
    const on = Boolean(target) && link.dataset.sectionTarget === target;
    if (on) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function syncHeaderTone(sectionName: string | undefined): void {
  const header = document.querySelector("header.home-chrome");
  if (!(header instanceof HTMLElement)) return;
  const tone = headerToneForSection(sectionName);
  header.classList.toggle("is-on-dark", tone === "dark");
  header.classList.toggle("is-on-accent", tone === "accent");
}

function onActiveSection(sectionName: string | undefined, options?: { scrub?: boolean }): void {
  applyBackground(sectionName);
  syncNav(sectionName);
  syncHeaderTone(sectionName);
  if (options?.scrub !== false) applyStepsProgress(stepsProgressForSection(sectionName));
}

function currentIndex(): number {
  const list = sections();
  let best = 0;
  let bestDist = Infinity;
  for (const [i, el] of list.entries()) {
    const dist = Math.abs(el.getBoundingClientRect().top - headerOffset());
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function animateScroll(
  top: number,
  duration = DURATION_MS,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const start = scrollY();
    const delta = top - start;
    const finish = (progress: number) => {
      onProgress?.(progress);
      resolve();
    };
    if (Math.abs(delta) < 1) {
      scrollToY(top);
      finish(1);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      scrollToY(top);
      finish(1);
      return;
    }
    const t0 = performance.now();
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      scrollToY(start + delta * easeInOut(p));
      onProgress?.(p);
      if (p < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

async function snapToElement(el: HTMLElement): Promise<void> {
  animating = true;
  try {
    let fromName = sections()[currentIndex()]?.dataset.sectionName;
    let target: HTMLElement | null = el;
    while (target) {
      const toName = target.dataset.sectionName;
      onActiveSection(toName, { scrub: false });
      const fromProgress = stepsProgressForSection(fromName);
      const toProgress = stepsProgressForSection(toName);
      await animateScroll(targetTop(target), DURATION_MS, (progress) => {
        applyStepsProgress(fromProgress + (toProgress - fromProgress) * progress);
      });
      applyStepsProgress(toProgress);
      syncHash(target);
      fromName = toName;
      target = pendingSnap;
      pendingSnap = null;
    }
  } finally {
    animating = false;
  }
}

export function moveTo(sectionName: string): void {
  const el = findSection(sectionName);
  if (!el) return;
  onActiveSection(el.dataset.sectionName, { scrub: false });
  if (!snapEnabled) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    syncHash(el);
    return;
  }
  if (animating) {
    pendingSnap = el;
    return;
  }
  void snapToElement(el);
}

function go(delta: number): void {
  if (animating) return;
  const list = sections();
  const next = Math.max(0, Math.min(list.length - 1, currentIndex() + delta));
  const el = list[next];
  if (el) void snapToElement(el);
}

function enableSnap(): void {
  if (disableSnap) return;
  snapEnabled = true;
  document.documentElement.classList.add("homepage-snap");

  const onWheel = (event: WheelEvent) => {
    if (!snapEnabled) return;
    if (animating) {
      event.preventDefault();
      return;
    }
    if (event.deltaY > 8) {
      event.preventDefault();
      go(1);
    } else if (event.deltaY < -8) {
      event.preventDefault();
      go(-1);
    }
  };

  const onKey = (event: KeyboardEvent) => {
    if (!snapEnabled) return;
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.closest("input, textarea, select, [contenteditable='true']")
    ) {
      return;
    }
    if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      go(1);
    } else if (event.key === "ArrowUp" || event.key === "PageUp") {
      event.preventDefault();
      go(-1);
    }
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  onActiveSection(sections()[currentIndex()]?.dataset.sectionName);

  disableSnap = () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    document.documentElement.classList.remove("homepage-snap");
    snapEnabled = false;
    disableSnap = null;
  };
}

function enableMobileScroll(): void {
  if (disableMobileScroll) return;
  syncHomeHeaderHeight();
  syncMobileScroll();
  const onMobileLayout = () => {
    syncHomeHeaderHeight();
    syncMobileScroll();
  };
  window.addEventListener("scroll", syncMobileScroll, { passive: true });
  window.addEventListener("resize", onMobileLayout);
  disableMobileScroll = () => {
    window.removeEventListener("scroll", syncMobileScroll);
    window.removeEventListener("resize", onMobileLayout);
    document.documentElement.style.removeProperty("--what-we-do-scroll");
    document.documentElement.style.removeProperty("--mobile-intro-opacity");
    document.querySelector(".background-anim-wrapper")?.classList.remove("mobile-steps-visible");
    disableMobileScroll = null;
  };
}

function setSnapFromMedia(matches: boolean): void {
  if (matches) {
    disableMobileScroll?.();
    enableSnap();
    return;
  }
  disableSnap?.();
  enableMobileScroll();
}

function interceptPageHashes(): void {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a[href^='#']");
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.closest("header")) return;
    const name = sectionNameFromHash(link.getAttribute("href") ?? "");
    if (!name) return;
    event.preventDefault();
    moveTo(name);
  });
}

export function initHomepageSnap(): void {
  if (started) return;
  started = true;
  window.__homepageMoveTo = moveTo;
  interceptPageHashes();

  const media = window.matchMedia(SNAP_MQ);
  setSnapFromMedia(media.matches);
  media.addEventListener("change", (event) => setSnapFromMedia(event.matches));

  const initial = sectionNameFromHash(location.hash);
  if (initial) {
    requestAnimationFrame(() => moveTo(initial));
  } else if (media.matches) {
    onActiveSection(sections()[currentIndex()]?.dataset.sectionName);
  } else {
    syncMobileScroll();
  }
}
