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
      carousel.querySelectorAll<HTMLElement>("[data-carousel-dot]").forEach((dot) => {
        const on = dot.dataset.carouselDot === String(index);
        dot.setAttribute("aria-current", on ? "true" : "false");
      });
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
