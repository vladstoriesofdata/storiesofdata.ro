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

- The focused e2e suite was run before the data change; it failed against the legacy implementation as expected.
- `npm run build:com` could not complete because parallel visual work currently imports the missing `src/components/home/services/EmbeddedAnalyticsVisual.astro`.
- `npx vitest run tests/unit/services-contract.test.ts` reports one stale assertion: it requires every exploration URL to equal `BOOKINGS_URL`, conflicting with the Task 2B requirement that Fabric and AI have no exploration URL.

## Scope

Only `src/data/services.ts`, `tests/e2e/homepage-copy.spec.ts`, and this report are included in this task commit. Parallel worktree changes were left untouched.
