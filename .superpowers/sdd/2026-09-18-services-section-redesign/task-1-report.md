# Task 1 report — shared services redesign contract

## Scope

Updated `src/data/services.ts` to establish the shared service data contract while keeping the current `Services.astro` and locale data consumers compiling. No layout, visual, interaction, Romanian copy, or dependency changes were made.

## Contract

- Added stable service IDs: `microsoft-fabric`, `embedded-analytics`, `ai-integrations`, and `cfo-bi`.
- Added visual kinds matching those four services.
- Added `ServiceExploration` with a required label and optional URL.
- Added `id`, `tabLabel`, `headline`, `summary`, `benefits`, `primaryCta`, `exploration`, `visualKind`, and `visualDescription` to the shared `Service` model.
- Added `visualTitle` for accessible visual naming and optional `visualSource`, allowing embedded analytics to render without a source today.
- Added the shared `BOOKINGS_URL` constant and attached it to each service exploration.
- Kept the legacy `title`, `benefitsHeading`, `helpHeading`, and `help` fields on the model so existing consumers continue to compile.
- Adapted the existing English and Romanian entries through a small contract adapter; final English copy remains for the later copy task.

## Verification

- Added `tests/unit/services-contract.test.ts`; confirmed it failed before implementation and passed after implementation.
- `npm test` — 12 files, 84 tests passed.
- `npm run build:com` — Astro build completed successfully; 23 pages generated.

The build emits the existing `lottie-web` `eval` warning from a dependency.

## Follow-up

The adapter currently derives placeholder contract fields from the existing legacy copy. The later English copy/layout tasks should replace those values with approved final headlines, summaries, CTAs, exploration labels, visual descriptions, and accessible titles.
