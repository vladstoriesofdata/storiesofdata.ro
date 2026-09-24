# Services Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan. Establish the shared contract first, then dispatch the three isolated workstreams concurrently and integrate their results centrally.

**Goal:** Redesign the homepage services section as a single-screen editorial split stage for business owners, covering Microsoft Fabric, Embedded Analytics, AI Integrations, and CFO + BI.

**Architecture:** The section uses one data-driven service model and one responsive DOM structure. At widths of 766px and above it behaves as an accessible horizontal tab interface with a stable 42/58 copy-to-visual split; below 766px it becomes a one-open-at-a-time vertical accordion. Service visuals are independent Astro components selected through a shared visual type, while a dedicated interaction module owns tabs, accordion state, keyboard behavior, lazy iframe activation, and responsive mode changes.

**Tech Stack:** Astro 6, TypeScript 7, scoped Astro CSS, existing site design tokens, Vitest, and Playwright. Add no new frontend dependency.

**Spec:** Approved design decisions from the planning conversation on 2026-09-18 are captured in the Design Baseline section below.

## Global Constraints

- Address business owners directly and explain outcomes before technology.
- Use the service order: Microsoft Fabric, Embedded Analytics, AI Integrations, CFO + BI.
- Use the existing `766px` desktop breakpoint.
- Fit the complete active desktop experience within a `1366 x 768` viewport.
- Use an approximately 42% copy and 58% visual desktop split.
- Use a vertical, single-open accordion on mobile.
- On mobile, render headline and text, benefits, actions, then the visual.
- Select Microsoft Fabric initially.
- Use **Book a discovery call** as the primary CTA on every service.
- Point every primary CTA to `https://bookings.cloud.microsoft/bookwithme/user/440681fea4204d06ae738c987e7a2ba0%40storiesofdata.com?anonymous&ismsaljsauthenabled`.
- Support a configurable deeper-exploration label and URL on every service.
- Hide the exploration control when its URL has not been supplied.
- Use predefined visual states without accepting visitor data.
- Make hover supplementary; every action must work by click and keyboard.
- Respect `prefers-reduced-motion`.
- Complete and approve English before translating the final copy to Romanian.
- Preserve the user's unrelated untracked files `original-motion.json` and `tmp-review-t4.py`.

---

## Design Baseline

### Information hierarchy

The section heading is followed by the four service controls and one stable active panel. Every service uses the same left-column hierarchy:

1. Outcome-led headline
2. Two or three short explanatory sentences
3. Three concise business benefits
4. Primary discovery-call CTA
5. Secondary deeper-exploration link

The right column uses one consistent Stories of Data frame: warm white or light-grey background, charcoal typography and linework, green accents, Akrobat for prominent labels, Public Sans for supporting text, and generous whitespace. Motion is short and purposeful, with no decorative loop.

### Content direction

#### Microsoft Fabric

**Working headline:** One connected view of your business.

Explain how Stories of Data connects finance, sales, operations, spreadsheets, and external systems; automates data movement; establishes trusted business definitions; and delivers reports, dashboards, and custom data applications.

Benefits:

- Make decisions using consistent, trusted numbers
- Replace repetitive reporting and spreadsheet work
- See business performance across departments in one place

#### Embedded Analytics

**Working headline:** Give customers analytics under your own brand.

Explain embedded analytics in plain language: secure reports and data experiences delivered inside a branded portal or software product, including for external customers and partners.

Benefits:

- Launch a polished analytics experience faster
- Control branding, access, and customer experience
- Create more value and revenue from existing data

Known exploration destination: `https://embedsy.io/`

#### AI Integrations

**Working headline:** Put AI to work on real business problems.

Combine automation and assistants with forecasting and machine learning. Use recognizable examples such as document processing, internal knowledge assistants, workflow automation, demand forecasting, anomaly detection, and recommendations.

Benefits:

- Reduce repetitive manual work
- Help teams find and use company knowledge
- Anticipate changes and identify problems earlier

#### CFO + BI

**Working headline:** Financial leadership and analytics, working as one team.

Present flexible CFO leadership supported by analysts and data specialists. Cover meaningful financial metrics, planning and advice, reliable data, system integration, and ongoing business reviews.

Benefits:

- Understand what drives profitability and cash flow
- Plan ahead with stronger financial models
- Turn disconnected operational and financial data into clear decisions

Known exploration destination: `https://demo.embedsy.io/embed/studio/63`

### Visual direction

- **Microsoft Fabric:** A line-based system diagram connects finance, CRM, operations, spreadsheets, and external services to a trusted data layer, then to reports, applications, and decisions. Selecting a source highlights its complete path and updates one short outcome label.
- **Embedded Analytics:** User-supplied content appears in a responsive iframe inside the shared visual frame. It loads only when first activated and provides a branded loading treatment and a usable fallback link.
- **AI Integrations:** Visitors choose Automate repetitive work, Find and use company knowledge, or Predict and detect change. The visual updates from business input through AI capability to a concrete outcome.
- **CFO + BI:** A local interactive illustration presents Financial clarity, Fractional CFO leadership, Reliable business data, and Intelligent data platform as one connected service. Selecting a capability highlights its relationship to the other three and shows a short example.

---

## File Map and Ownership

| File | Owner | Responsibility |
|---|---|---|
| `src/data/services.ts` | Copy agent | Localized service copy, URLs, visual types, and shared interfaces |
| `src/components/home/Services.astro` | Wireframe agent | Editorial-stage markup and responsive service-item structure |
| `src/components/home/ServicesInteraction.ts` | Wireframe agent | Desktop tab and mobile accordion behavior |
| `src/components/home/services/ServiceVisual.astro` | Visual agent | Select the visual component from the service ID |
| `src/components/home/services/FabricVisual.astro` | Visual agent | Connected-business illustration |
| `src/components/home/services/EmbeddedAnalyticsVisual.astro` | Visual agent | Lazy iframe frame, loading state, and fallback |
| `src/components/home/services/AiIntegrationsVisual.astro` | Visual agent | Business-challenge AI explorer |
| `src/components/home/services/CfoBiVisual.astro` | Visual agent | Four-capability CFO + BI interaction |
| `src/styles/chrome.css` | Wireframe agent | Section-level layout and removal of obsolete services rules |
| `src/pages/index.astro` | Lead agent | Replace the generic service interaction initialization |
| `tests/unit/services-interaction.test.ts` | Wireframe agent | State and responsive behavior tests |
| `tests/e2e/homepage-tabs.spec.ts` | Lead agent | Integrated desktop and mobile interaction tests |
| `tests/e2e/homepage-copy.spec.ts` | Copy agent, then lead agent | Service names, CTA destinations, exploration links, and iframe fallback |
| `tests/unit/romanian-content.test.ts` | Localization phase | Verify independent Romanian content after translation |

Visual-specific styles stay scoped inside their Astro components. The wireframe agent owns all shared section layout rules, preventing parallel agents from editing the same CSS.

---

## Task 1: Establish the Shared Contract

**Owner:** Lead agent, completed before parallel dispatch.

**Files:**

- Modify: `src/data/services.ts`
- Reference: `src/components/home/Services.astro`
- Reference: `src/components/home/Tabs.ts`

**Produces:**

- `ServiceId = "microsoft-fabric" | "embedded-analytics" | "ai-integrations" | "cfo-bi"`
- `ServiceVisualKind = "fabric" | "embedded-analytics" | "ai-integrations" | "cfo-bi"`
- A `Service` interface containing `id`, `tabLabel`, `headline`, `summary`, `benefits`, `primaryCta`, `exploration`, `visualKind`, and `visualDescription`
- An optional embedded-analytics configuration containing the final iframe source and accessible title

- [ ] Define the stable IDs and service interfaces.
- [ ] Define the DOM data attributes used by `ServicesInteraction.ts`.
- [ ] Define a single source for the Microsoft Bookings URL.
- [ ] Define the 42/58 layout and visual aspect-ratio contract.
- [ ] Confirm the three agent scopes do not overlap.
- [ ] Run `npm run build:com` and confirm the contract compiles before dispatch.
- [ ] Commit with `refactor: define services redesign contract`.

---

## Task 2A: Wireframe and Responsive Interaction

**Owner:** Wireframe agent. Run concurrently with Tasks 2B and 2C.

**Files:**

- Modify: `src/components/home/Services.astro`
- Create: `src/components/home/ServicesInteraction.ts`
- Modify: `src/styles/chrome.css`
- Create: `tests/unit/services-interaction.test.ts`

**Consumes:** The service interfaces, stable IDs, DOM attributes, and visual-size contract from Task 1.

**Produces:** An accessible responsive shell that renders copy and visual slots without owning their contents.

- [ ] Write failing unit tests for selecting a valid service, ignoring an unknown service, preserving one active service, and switching between desktop and mobile state models.
- [ ] Run `npx vitest run tests/unit/services-interaction.test.ts` and confirm the tests fail for the missing module.
- [ ] Build the service-item markup with one copy of each content panel.
- [ ] Implement desktop tab semantics at widths of 766px and above.
- [ ] Implement click, Enter, Space, Home, End, Left Arrow, and Right Arrow behavior.
- [ ] Implement mobile `aria-expanded` accordion semantics below 766px.
- [ ] Keep exactly one mobile item open and open Microsoft Fabric initially.
- [ ] Preserve the active service when the viewport crosses the breakpoint.
- [ ] Place text, benefits, actions, and the visual in that order on mobile.
- [ ] Implement the stable 42/58 desktop grid and fixed panel footprint.
- [ ] Add visible focus indicators and reduced-motion rules.
- [ ] Remove obsolete benefits/help-list service styling from `src/styles/chrome.css`.
- [ ] Run the unit test and `npm run build:com`.
- [ ] Commit with `feat: build responsive services stage`.

---

## Task 2B: English Copy and Service Positioning

**Owner:** Copy agent. Run concurrently with Tasks 2A and 2C.

**Files:**

- Modify: `src/data/services.ts`
- Modify: `tests/e2e/homepage-copy.spec.ts`

**Consumes:** The service interface and URL conventions from Task 1.

**Produces:** Complete English content within the desktop height budget.

- [ ] Write assertions for the four service labels in their approved order.
- [ ] Write assertions for the shared Book a discovery call label and exact Microsoft Bookings URL.
- [ ] Write assertions for the known Embedsy and CFO + BI exploration URLs.
- [ ] Run `npx playwright test tests/e2e/homepage-copy.spec.ts` and confirm the new assertions fail against the old content.
- [ ] Replace the current four English service entries with the approved services.
- [ ] Finalize one headline, a two-to-three-sentence summary, and exactly three benefits per service.
- [ ] Keep primary language focused on business outcomes.
- [ ] Add a configurable exploration label and optional URL to every service.
- [ ] Set the Embedded Analytics and CFO + BI URLs supplied in the design baseline.
- [ ] Leave Fabric and AI exploration URLs absent until supplied; verify their controls are not rendered.
- [ ] Add clear visual descriptions and iframe loading/failure copy.
- [ ] Run `npm run build:com` and the updated copy test.
- [ ] Commit with `copy: rewrite services for business owners`.

---

## Task 2C: Visuals and Micro-interactions

**Owner:** Visual agent. Run concurrently with Tasks 2A and 2B.

**Files:**

- Create: `src/components/home/services/ServiceVisual.astro`
- Create: `src/components/home/services/FabricVisual.astro`
- Create: `src/components/home/services/EmbeddedAnalyticsVisual.astro`
- Create: `src/components/home/services/AiIntegrationsVisual.astro`
- Create: `src/components/home/services/CfoBiVisual.astro`

**Consumes:** The service IDs, visual kinds, visual descriptions, and dimension contract from Task 1.

**Produces:** Four visual components with the same external frame and independent internal behavior.

- [ ] Create the shared visual frame using existing Stories of Data tokens.
- [ ] Build the Fabric source-to-data-to-outcome diagram.
- [ ] Add selectable Fabric business areas with click, keyboard, and supplementary hover behavior.
- [ ] Build the three-state AI challenge-to-outcome explorer.
- [ ] Build the four-capability CFO + BI local preview.
- [ ] Make the CFO + BI visual communicate one joined service through persistent connections between all four capabilities.
- [ ] Build the Embedded Analytics iframe wrapper with a deferred source, accessible title, loading treatment, and failure fallback.
- [ ] Prevent visual animation under `prefers-reduced-motion`.
- [ ] Check every visual at its agreed desktop dimensions and at 360px width.
- [ ] Run `npm run build:com`.
- [ ] Commit with `feat: add interactive service visuals`.

---

## Task 3: Integrate the Parallel Workstreams

**Owner:** Lead agent after Tasks 2A, 2B, and 2C complete.

**Files:**

- Modify: `src/components/home/Services.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/chrome.css`
- Modify: `tests/e2e/homepage-tabs.spec.ts`
- Modify: `tests/e2e/homepage-copy.spec.ts`

**Consumes:** All deliverables from Tasks 2A, 2B, and 2C.

**Produces:** One integrated English services experience.

- [ ] Review every agent summary and diff before combining changes.
- [ ] Confirm no agent modified another agent's owned files.
- [ ] Connect each service entry to `ServiceVisual.astro`.
- [ ] Replace service use of the generic `initTabs()` with `initServicesInteraction()` while preserving portfolio tabs.
- [ ] Add the shared primary and optional exploration actions to the left column.
- [ ] Lazy-load the Embedded Analytics iframe only on first activation.
- [ ] Verify switching services does not change the section's outer height.
- [ ] Update the desktop Playwright test to activate all four services.
- [ ] Add a keyboard-navigation test for desktop tabs.
- [ ] Add a 390 x 844 mobile test for the single-open accordion and content order.
- [ ] Add a 1366 x 768 test that each active service's content remains within the viewport when the services section is aligned to the viewport.
- [ ] Add tests confirming missing exploration URLs render no empty link.
- [ ] Run `npm test`.
- [ ] Run `npm run test:e2e`.
- [ ] Run `npm run build:com`.
- [ ] Commit with `feat: integrate redesigned services section`.

---

## Task 4: English Visual Review and Refinement

**Owner:** Lead agent with user review.

**Review sizes:**

- 1366 x 768
- 1440 x 900
- 390 x 844
- 360 x 800

- [ ] Review copy length and scanability in every service.
- [ ] Review active-panel stability and surrounding page movement.
- [ ] Review CTA prominence and exploration-link consistency.
- [ ] Review visual legibility and interaction clarity without instructions.
- [ ] Review consistency between local visuals and iframe presentation.
- [ ] Review mobile order, spacing, and accordion state changes.
- [ ] Review keyboard focus and reduced-motion behavior.
- [ ] Review iframe loading and failure states.
- [ ] Apply approved refinements within the owning files.
- [ ] Repeat the focused Playwright tests after every material layout change.
- [ ] Obtain explicit approval for the finalized English design before translation.

---

## Task 5: Romanian Localization

**Owner:** Localization workstream after Task 4 approval.

**Files:**

- Modify: `src/data/services.ts`
- Modify: `tests/unit/romanian-content.test.ts`
- Modify: relevant service visual components when labels are localized inside them

**Consumes:** Final, approved English copy and fixed component dimensions.

**Produces:** An independent Romanian translation that fits the approved design.

- [ ] Translate the final copy by meaning and business tone rather than word for word.
- [ ] Translate visual labels, loading text, fallback text, and accessibility descriptions.
- [ ] Preserve product names consistently.
- [ ] Verify the Romanian object does not alias the English object.
- [ ] Check longer Romanian strings at all four review sizes.
- [ ] Adjust Romanian wording before changing the approved layout dimensions.
- [ ] Run `npm test`.
- [ ] Run `npm run test:e2e` for both configured locales.
- [ ] Run the full `npm run build` command.
- [ ] Commit with `copy: localize redesigned services in Romanian`.

---

## Final Acceptance Criteria

- [ ] The four approved services appear in the approved order.
- [ ] Desktop uses a stable editorial split stage.
- [ ] Every active service fits at 1366 x 768 without section-level scrolling.
- [ ] Mobile uses a one-open-at-a-time accordion.
- [ ] Text and actions precede the visual on mobile.
- [ ] All primary actions use the supplied Microsoft Bookings URL.
- [ ] Every service supports a deeper-exploration link.
- [ ] Missing exploration URLs create no empty or broken control.
- [ ] Embedded Analytics loads the supplied iframe content only when needed.
- [ ] Iframe failure provides a usable route to the complete experience.
- [ ] Fabric, AI, and CFO + BI use guided micro-interactions.
- [ ] Tabs, accordion controls, and visual states work by keyboard.
- [ ] Focus indicators are visible.
- [ ] Reduced-motion preferences are respected.
- [ ] Existing portfolio tabs continue to work.
- [ ] English and Romanian builds pass before release.
- [ ] `npm test`, `npm run test:e2e`, and `npm run build` pass.

## Inputs Required Before Final Completion

- The Embedded Analytics iframe content or source.
- The deeper-exploration URL for Microsoft Fabric.
- The deeper-exploration URL for AI Integrations.

These inputs do not require a layout redesign. The iframe source completes Task 2C; the two exploration URLs update data only.
