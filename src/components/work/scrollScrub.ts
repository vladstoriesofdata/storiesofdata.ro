import { setLottieProgress } from "../home/lottieGraphics";

export function pageScrollProgress(
  scrollY: number,
  scrollHeight: number,
  viewportHeight: number,
): number {
  const max = scrollHeight - viewportHeight;
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, scrollY / max));
}

export function initScrollScrub(root: ParentNode = document): void {
  const node = root.querySelector<HTMLElement>(
    ".stickyimg-gv.analytics-anim[data-lottie]",
  );
  if (!node) return;

  const sync = () => {
    const doc = document.documentElement;
    setLottieProgress(
      pageScrollProgress(window.scrollY, doc.scrollHeight, doc.clientHeight),
    );
  };

  sync();
  window.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
}
