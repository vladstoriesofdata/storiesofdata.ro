# Romanian Translation Design

## Goal

Publish complete, natural Romanian copy for the homepage, articles, portfolio, case studies, privacy policy, and the available terms-and-conditions metadata while preserving the existing bilingual static-site architecture and public URLs.

## Scope

The translation covers:

- all homepage copy, including navigation, services, team biographies, contact copy, form labels, and testimonials;
- all six entries in `src/content/articles`;
- all eight entries in `src/content/portfolio`, including the BTR and Chainformation business case studies;
- both entries in `src/content/data-stories`;
- the privacy-policy entry;
- the title and description of the terms-and-conditions entry.

The terms-and-conditions body remains empty because neither the repository nor the live English URL contains authoritative source text. Drafting new legal terms is outside this translation task.

## Editorial Direction

Romanian copy must sound natural and professional rather than follow English syntax literally. Established product names and technical terms remain in English where Romanian practitioners ordinarily use them, including Microsoft Fabric, Power BI, SaaS, semantic model, data pipeline, Power BI Embedded, Deneb, D3, TypeScript, and Report Builder.

Meaning, factual claims, numbers, links, and calls to action must remain faithful to the English source. Translation must not introduce new marketing promises or legal obligations.

Client testimonials are translated for Romanian readers. The Romanian testimonials section includes one visible note stating that the quotations were translated from English; names, roles, companies, and outbound links remain accurate.

## Content and Code Changes

Homepage locale modules will receive independent Romanian values instead of aliasing the English objects through `ro: en`. This applies to `home.ts`, `navigation.ts`, `services.ts`, `team.ts`, and `testimonials.ts`. The testimonials data and component may gain a localized translation note, but existing layout and interaction behavior must remain unchanged.

Each requested `ro.mdx` file will be translated in place. Existing frontmatter fields, embedded HTML, component imports, heading hierarchy, CSS classes, image references, links, and structural markup will be preserved. Romanian titles and descriptions replace English metadata. Completed entries will use `translationStatus: translated`.

The English locale files are the source of truth and will not be rewritten as part of this work.

## Work Sequence

Translation proceeds in independently verifiable batches:

1. shared homepage and navigation copy;
2. articles;
3. portfolio and data stories;
4. privacy policy and terms metadata;
5. repository-wide Romanian-content verification.

After each content batch, the Romanian Astro build must succeed before the next batch begins.

## Validation

Validation must confirm:

- TypeScript and Astro accept all changed locale data and MDX;
- `npm run build:ro` succeeds after each batch;
- the final full build succeeds for both domains;
- all translated entries have `translationStatus: translated`;
- no requested Romanian page still contains an untranslated banner;
- homepage Romanian data no longer aliases the English objects;
- links, images, imported components, and embedded HTML remain valid;
- existing automated tests pass, including relevant homepage and smoke coverage.

The existing uncommitted `playwright.config.ts` modification predates this work and must not be changed or included in translation commits.
