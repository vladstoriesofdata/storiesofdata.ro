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
