import { SERVICE_IDS, type ServiceId } from "../../data/services";

export type ServicesMode = "desktop" | "mobile";

export interface ServicesState {
  activeId: ServiceId;
  mode: ServicesMode;
}

function isServiceId(id: string): id is ServiceId {
  return SERVICE_IDS.includes(id as ServiceId);
}

export function createServicesState(mode: ServicesMode): ServicesState {
  return { activeId: "microsoft-fabric", mode };
}

export function selectService(state: ServicesState, id: string): ServicesState {
  return isServiceId(id) ? { ...state, activeId: id } : state;
}

export function setServicesMode(state: ServicesState, mode: ServicesMode): ServicesState {
  return { ...state, mode };
}

export function isServiceActive(state: ServicesState, id: string): boolean {
  return state.activeId === id;
}

function modeForViewport(matchesDesktop: boolean): ServicesMode {
  return matchesDesktop ? "desktop" : "mobile";
}

export function initServicesInteraction(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-services]").forEach((group) => {
    const controls = [...group.querySelectorAll<HTMLButtonElement>("[data-service-control]")];
    const desktopControls = controls.filter((control) => control.dataset.serviceControlKind === "desktop");
    const panels = [...group.querySelectorAll<HTMLElement>("[data-service-panel]")];
    const controlsContainer = group.querySelector<HTMLElement>("[data-services-controls]");
    const media = window.matchMedia("(min-width: 766px)");
    const initialId = desktopControls.find((control) => control.dataset.serviceControl === "microsoft-fabric")
      ?.dataset.serviceControl;
    let state = initialId && isServiceId(initialId)
      ? { activeId: initialId, mode: modeForViewport(media.matches) }
      : createServicesState(modeForViewport(media.matches));

    const render = () => {
      const isDesktop = state.mode === "desktop";
      group.dataset.servicesMode = state.mode;
      if (isDesktop) controlsContainer?.setAttribute("role", "tablist");
      else controlsContainer?.removeAttribute("role");

      controls.forEach((control) => {
        const active = isServiceActive(state, control.dataset.serviceControl ?? "");
        const isDesktopControl = control.dataset.serviceControlKind === "desktop";
        control.hidden = isDesktop ? !isDesktopControl : isDesktopControl;
        control.tabIndex = isDesktopControl && isDesktop && !active ? -1 : 0;
        if (isDesktopControl && isDesktop) {
          control.setAttribute("role", "tab");
          control.setAttribute("aria-selected", String(active));
          control.removeAttribute("aria-expanded");
        } else {
          control.removeAttribute("role");
          control.removeAttribute("aria-selected");
          control.setAttribute("aria-expanded", String(active));
        }
      });

      panels.forEach((panel) => {
        const active = isServiceActive(state, panel.dataset.servicePanel ?? "");
        panel.hidden = !active;
        panel.setAttribute("role", isDesktop ? "tabpanel" : "region");
        panel.setAttribute(
          "aria-labelledby",
          `${isDesktop ? "services-tab" : "services-accordion"}-${panel.dataset.servicePanel}`,
        );
      });
    };

    const activate = (id: string) => {
      state = selectService(state, id);
      render();
    };

    group.addEventListener("click", (event) => {
      const control = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-service-control]");
      if (!control || !group.contains(control) || !control.dataset.serviceControl) return;
      activate(control.dataset.serviceControl);
    });

    group.addEventListener("keydown", (event) => {
      if (state.mode !== "desktop") return;
      const control = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-service-control]");
      if (!control || !group.contains(control)) return;

      const index = desktopControls.indexOf(control);
      if (index < 0) return;

      let nextIndex: number | undefined;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = desktopControls.length - 1;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + desktopControls.length) % desktopControls.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % desktopControls.length;
      if (event.key === "Enter" || event.key === " ") nextIndex = index;
      if (nextIndex === undefined) return;

      event.preventDefault();
      const nextControl = desktopControls[nextIndex];
      if (!nextControl?.dataset.serviceControl) return;
      activate(nextControl.dataset.serviceControl);
      nextControl.focus();
    });

    media.addEventListener("change", (event) => {
      state = setServicesMode(state, modeForViewport(event.matches));
      render();
    });

    render();
  });
}
