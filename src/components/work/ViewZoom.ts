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
