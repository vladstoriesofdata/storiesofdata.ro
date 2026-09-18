# Task 2C report — service visuals and micro-interactions

## Scope

Created the five owned visual components under `src/components/home/services/`. `ServiceVisual.astro` accepts the shared `Service` contract through `service` and dispatches to the correct visual from `visualKind`, which lets the responsive service stage render each visual without coupling to its implementation.

## Delivered behavior

- Added one shared warm-white/light-grey visual frame using the existing charcoal, accent-green, typography, and responsive token system.
- Added the Microsoft Fabric diagram with selectable Finance, CRM, Operations, Spreadsheets, and External systems sources, a trusted-data layer, reports/applications/decisions outcomes, and an `aria-live` outcome label.
- Added the three-state AI explorer for automation, company knowledge, and prediction/change detection. Each state exposes a business input, AI capability, and concrete business outcome.
- Added the four-capability CFO + BI illustration. Native buttons select Financial clarity, Fractional CFO leadership, Reliable business data, or Intelligent data platform while preserving visible connections and updating a concrete example.
- Added the Embedded Analytics adapter. It carries an explicit iframe title, keeps the iframe source deferred until the visual intersects, displays loading/readiness status, and remains useful when the currently absent source is empty. A configured source supplies an external failure fallback link.
- All local actions use native buttons with visible `:focus-visible` states, so click, Enter, and Space work without hover. Motion is limited to short CSS transitions inside `prefers-reduced-motion: no-preference`.

## Tests and verification

- No component unit test was added: this repository has no Astro DOM test harness, and a source-text or snapshot test would not exercise the browser behavior. The local interactions stay intentionally small and use native semantic controls.
- `npm run build:com` completed successfully; Astro generated 23 pages.
- `npx playwright test tests/e2e/homepage-copy.spec.ts --grep "services use business-owner copy"` passed: 1 test, confirming the wireframe stage renders all four service panels and mounts the visual dispatcher.
- Checked the generated English homepage markup for the Fabric, Embedded Analytics, AI, and CFO + BI visual roots and their interactive data attributes.

The build retains the pre-existing `lottie-web` warning about `eval` in the dependency.

## Follow-up

The embedded analytics source remains intentionally empty until a final source is supplied. The existing adapter will defer-load it and expose its configured fallback link when that data is added.
