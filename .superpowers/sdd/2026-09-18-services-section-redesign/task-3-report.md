# Task 3 report — redesigned services integration

## Scope

Updated the stale homepage services interaction coverage and added responsive integration assertions. No production files changed: the committed service stage already supplies the required desktop tabs, mobile accordion behavior, CTA destinations, empty exploration controls, Embedded Analytics placeholder, and portfolio tabs.

## Coverage added and retained

- Replaced the obsolete `Power BI` tab test with the four current service labels in their required order: Microsoft Fabric, Embedded Analytics, AI Integrations, and CFO + BI.
- At 1366 × 768, verifies desktop mode, a horizontal single-row tablist, tab selection/panel replacement, a two-column active panel, and no horizontal viewport overflow.
- At 375 × 800, verifies mobile mode removes tab semantics, exposes accordion `aria-expanded` states, and keeps exactly one service panel open after switching to AI Integrations.
- Preserved the existing portfolio Articles tab/carousel test.
- Added the missing integrated assertion for the Embedded Analytics empty-source state: its source attribute is empty, the iframe is hidden, and the framed placeholder/status remain visible.
- Existing service copy coverage verifies every discovery CTA uses `BOOKINGS_URL`, Microsoft Fabric and AI Integrations have no exploration link while their URLs are absent, and Embedded Analytics and CFO + BI retain their supplied exploration URLs.

## Verification

- The original stale `homepage-tabs.spec.ts` run could not launch Chromium inside the workspace sandbox: `browserType.launch: spawn EPERM`. The same focused suite ran successfully after approved sandbox escalation, so browser verification was completed.
- `npx playwright test tests/e2e/homepage-tabs.spec.ts tests/e2e/homepage-copy.spec.ts tests/e2e/services-visuals.spec.ts --reporter=list` — 9 passed.
- `npm test` — 13 files and 89 tests passed.
- `npm run build:com` — succeeded; 23 static pages built.
- `npm run build:ro` — succeeded; 23 static pages built.

Both locale builds retain Astro/Vite's existing `lottie-web` warning about `eval` in the dependency. It is outside this test-only change.
