# Task 2B report — English service copy

## Status

Implemented the approved English business-owner copy in `src/data/services.ts` and added focused service-copy assertions to `tests/e2e/homepage-copy.spec.ts`.

## Changes

- Replaced the legacy service shape and HTML-string help content with `tabLabel`, `headline`, `summary`, `benefits`, `primaryCta`, `exploration`, and visual metadata.
- Added the four services in the required order: Microsoft Fabric, Embedded Analytics, AI Integrations, and CFO + BI.
- Added exactly three benefits per service.
- Set every English primary CTA to `Book a discovery call`.
- Kept `BOOKINGS_URL` as the shared CTA destination used by the e2e assertion.
- Added the known Embedded Analytics and CFO + BI exploration URLs.
- Left Fabric and AI exploration URLs absent.
- Kept Romanian data structurally valid with placeholder-level localized copy for later review.

## Verification

- The focused e2e suite reaches the browser but cannot launch Chromium in this environment (`spawn EPERM`).
- `npm test` passes: 13 test files and 89 tests.
- `npm run build:com` passes: 23 pages built. Astro reports the existing `lottie-web` `eval` warning.
- The contract assertions now verify the shared booking URL through `primaryCtaUrl` and verify only the supplied exploration URLs.

## Scope

The first copy commit was followed by a test-alignment fix removing the obsolete Data Visualization assertion and updating the service contract checks. Parallel worktree changes were left untouched.
