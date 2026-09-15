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
    const viewport = carousel.querySelector<HTMLElement>("[data-carousel-viewport]");
    const track = carousel.querySelector<HTMLElement>("[data-carousel-track]");
    if (!viewport || !track || !slides.length || carousel.dataset.carouselIndex !== undefined) return;
    const dots = [...carousel.querySelectorAll<HTMLElement>("[data-carousel-dot]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 765px)");
    let index = 0;
    let transitioning = false;
    const movingSlides = new Set<number>();
    let settleTimer: ReturnType<typeof setTimeout>;

    const updateHeight = () => {
      if (!viewport.clientWidth) return;
      const heights = (transitioning ? [...movingSlides].map(i => slides[i]) : [slides[index]]).map((slide) => {
        const style = getComputedStyle(slide);
        return slide.getBoundingClientRect().height + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      });
      viewport.style.height = `${Math.ceil(Math.max(...heights))}px`;
    };
    const settle = () => {
      clearTimeout(settleTimer);
      transitioning = false;
      movingSlides.clear();
      updateHeight();
    };

    const show = () => {
      track.style.transform = `translateX(calc(-${index * 100}% - ${index * 40}px))`;
      slides.forEach((slide, i) => {
        slide.hidden = false;
        slide.inert = i !== index;
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      carousel.dataset.carouselIndex = String(index);
      dots.forEach((dot) => {
        const on = dot.dataset.carouselDot === String(index);
        dot.setAttribute("aria-current", on ? "true" : "false");
      });
      updateHeight();
    };

    const goTo = (next: number) => {
      if (!Number.isInteger(next) || next < 0 || next >= slides.length || next === index) return;
      movingSlides.add(index);
      movingSlides.add(next);
      index = next;
      transitioning = !reducedMotion.matches;
      clearTimeout(settleTimer);
      show();
      // A hidden tab or interrupted transition may not emit transitionend.
      if (transitioning) settleTimer = setTimeout(settle, 550);
    };
    track.addEventListener("transitionend", (event) => {
      if (event.target === track && event.propertyName === "transform") settle();
    });
    reducedMotion.addEventListener("change", settle);
    const observer = new ResizeObserver(updateHeight);
    observer.observe(track);
    slides.forEach((slide) => observer.observe(slide));

    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", (event) => {
      event.preventDefault();
      goTo(nextIndex(index, slides.length));
    });
    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", (event) => {
      event.preventDefault();
      goTo(prevIndex(index, slides.length));
    });
    dots.forEach((dot) => {
      dot.addEventListener("click", (event) => {
        event.preventDefault();
        goTo(Number(dot.dataset.carouselDot));
      });
    });

    let gesture: { id: number; x: number; y: number } | undefined;
    let suppressClickUntil = 0;
    const resetGesture = () => { gesture = undefined; };
    viewport.addEventListener("pointerdown", (event) => {
      suppressClickUntil = 0;
      if (!mobile.matches || slides.length < 2 || !event.isPrimary || event.pointerType === "mouse") return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    });
    viewport.addEventListener("pointerup", (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      resetGesture();
      if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy) * 1.25) return;
      suppressClickUntil = performance.now() + 500;
      goTo(dx < 0 ? nextIndex(index, slides.length) : prevIndex(index, slides.length));
    });
    viewport.addEventListener("pointercancel", resetGesture);
    viewport.addEventListener("lostpointercapture", resetGesture);
    mobile.addEventListener("change", resetGesture);
    viewport.addEventListener("click", (event) => {
      if (event.detail > 0 && performance.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        suppressClickUntil = 0;
      }
    }, true);
    show();
  });
}
