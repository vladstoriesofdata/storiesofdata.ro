import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";

const DESKTOP_MQ = "(min-width: 766px)";

type When = "desktop" | "mobile" | "always";

const instances = new Map<HTMLElement, AnimationItem>();
let io: IntersectionObserver | null = null;
let mo: MutationObserver | null = null;
let media: MediaQueryList | null = null;
let lastDesktop = false;
let started = false;

function whenOf(node: HTMLElement): When {
  const value = node.dataset.lottieWhen;
  if (value === "desktop" || value === "mobile") return value;
  return "always";
}

function shouldMount(node: HTMLElement): boolean {
  if (!node.isConnected) return false;
  const when = whenOf(node);
  if (when === "always") return true;
  const desktop = window.matchMedia(DESKTOP_MQ).matches;
  return when === "desktop" ? desktop : !desktop;
}

function destroyNode(node: HTMLElement): void {
  const animation = instances.get(node);
  if (animation) {
    animation.destroy();
    instances.delete(node);
  }
  delete node.dataset.lottieReady;
  node.replaceChildren();
}

function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

export function frameForProgress(totalFrames: number, progress: number): number {
  const frames = Math.max(0, totalFrames - 1);
  return clampProgress(progress) * frames;
}

function applyProgress(node: HTMLElement, animation: AnimationItem, progress: number): void {
  const t = clampProgress(progress);
  node.dataset.lottieProgress = String(t);
  animation.goToAndStop(frameForProgress(animation.totalFrames, t), true);
}

export function setLottieProgress(progress: number, root: ParentNode = document): void {
  const t = clampProgress(progress);
  for (const node of root.querySelectorAll<HTMLElement>('[data-lottie][data-scrub="1"]')) {
    node.dataset.lottieProgress = String(t);
    const animation = instances.get(node);
    if (animation?.isLoaded) applyProgress(node, animation, t);
  }
}

function mountNode(node: HTMLElement): void {
  if (!shouldMount(node) || instances.has(node)) return;
  const src = node.dataset.src;
  if (!src) return;

  node.dataset.lottieReady = "1";
  const loop = node.dataset.loop === "1";
  const autoplay = node.dataset.autoplay === "1";
  const scrub = node.dataset.scrub === "1";
  const animation = lottie.loadAnimation({
    container: node,
    renderer: "svg",
    loop,
    autoplay: autoplay && !scrub,
    path: src,
    rendererSettings: {
      preserveAspectRatio: node.dataset.preserveAspectRatio || "xMidYMid meet",
      hideOnTransparent: true,
    },
  });
  instances.set(node, animation);

  if (scrub) {
    animation.addEventListener("DOMLoaded", () => {
      if (instances.get(node) !== animation) return;
      applyProgress(node, animation, Number(node.dataset.lottieProgress ?? 0));
    });
    return;
  }

  if (!autoplay) {
    animation.addEventListener("DOMLoaded", () => {
      if (instances.get(node) === animation) animation.play();
    });
  }
}

function observeEligible(): void {
  if (!io) return;
  for (const node of document.querySelectorAll<HTMLElement>("[data-lottie]")) {
    if (shouldMount(node) && !instances.has(node)) io.observe(node);
    else io.unobserve(node);
  }
}

function syncBreakpoint(): void {
  const desktop = window.matchMedia(DESKTOP_MQ).matches;
  lastDesktop = desktop;
  for (const node of document.querySelectorAll<HTMLElement>("[data-lottie]")) {
    if (whenOf(node) === "always") continue;
    if (shouldMount(node)) {
      if (!instances.has(node)) io?.observe(node);
    } else {
      io?.unobserve(node);
      destroyNode(node);
    }
  }
  lottie.resize();
}

function onResize(): void {
  const desktop = window.matchMedia(DESKTOP_MQ).matches;
  if (desktop !== lastDesktop) {
    syncBreakpoint();
    return;
  }
  lottie.resize();
}

function onMediaChange(): void {
  syncBreakpoint();
}

function sweepDisconnected(): void {
  for (const node of [...instances.keys()]) {
    if (!node.isConnected) destroyNode(node);
  }
}

export function teardownLottieGraphics(): void {
  io?.disconnect();
  io = null;
  mo?.disconnect();
  mo = null;
  media?.removeEventListener("change", onMediaChange);
  media = null;
  window.removeEventListener("resize", onResize);
  document.removeEventListener("pagehide", teardownLottieGraphics);
  for (const node of [...instances.keys()]) destroyNode(node);
  started = false;
}

export function initLottieGraphics(): void {
  if (started) {
    observeEligible();
    return;
  }
  started = true;
  lastDesktop = window.matchMedia(DESKTOP_MQ).matches;

  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof HTMLElement)) continue;
        mountNode(entry.target);
        io?.unobserve(entry.target);
      }
    },
    { rootMargin: "80px" },
  );

  mo = new MutationObserver(sweepDisconnected);
  mo.observe(document.body, { childList: true, subtree: true });

  media = window.matchMedia(DESKTOP_MQ);
  media.addEventListener("change", onMediaChange);
  window.addEventListener("resize", onResize);
  document.addEventListener("pagehide", teardownLottieGraphics);

  observeEligible();
}
