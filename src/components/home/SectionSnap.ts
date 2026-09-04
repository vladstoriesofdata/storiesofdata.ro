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
 *   mobil short intro.json (hero mobile, autoplay, no loop)
 *   1-2-3-4-5.json (background-anim-wrapper, paused / IX2)
 *   portfolio zoom6.json (portfolio, paused / IX2)
 *   connected more dots_loop.json (team, paused / IX2)
 *   SoD_Menu.json (navbar hamburger — no hamburger in this header)
 *   okay.json is not referenced by legacy/index.html
 */
export const SNAP_MQ = "(min-width: 766px)";

const BACKGROUND_ACTIVE = new Set([
  "portfolio",
  "our-team",
  "testimonials",
  "contact",
]);

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

const DURATION_MS = 520;

let snapEnabled = false;
let animating = false;
let started = false;
let pendingSnap: HTMLElement | null = null;
let disableSnap: (() => void) | null = null;

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

function syncNav(sectionName: string | undefined): void {
  const target = sectionName ? navTargetForSection(sectionName) : undefined;
  document.querySelectorAll<HTMLAnchorElement>("header.home-chrome a[data-section-target]").forEach((link) => {
    const on = Boolean(target) && link.dataset.sectionTarget === target;
    if (on) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

function syncDarkHeader(sectionName: string | undefined): void {
  const header = document.querySelector("header.home-chrome");
  if (!(header instanceof HTMLElement)) return;
  header.classList.toggle("is-on-dark", sectionName === "contact");
}

function onActiveSection(sectionName: string | undefined): void {
  applyBackground(sectionName);
  syncNav(sectionName);
  syncDarkHeader(sectionName);
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

function animateScroll(top: number, duration = DURATION_MS): Promise<void> {
  return new Promise((resolve) => {
    const start = scrollY();
    const delta = top - start;
    if (Math.abs(delta) < 1) {
      scrollToY(top);
      resolve();
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      scrollToY(top);
      resolve();
      return;
    }
    const t0 = performance.now();
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      scrollToY(start + delta * easeInOut(p));
      if (p < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

async function snapToElement(el: HTMLElement): Promise<void> {
  onActiveSection(el.dataset.sectionName);
  animating = true;
  try {
    let target: HTMLElement | null = el;
    while (target) {
      onActiveSection(target.dataset.sectionName);
      await animateScroll(targetTop(target));
      syncHash(target);
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
  onActiveSection(el.dataset.sectionName);
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

function setSnapFromMedia(matches: boolean): void {
  if (matches) enableSnap();
  else disableSnap?.();
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
  } else {
    onActiveSection(sections()[currentIndex()]?.dataset.sectionName);
  }
}
