# Implementation Plan: berlin-hausaerzte.de rebuild

Spec: `../SPEC.md` (approved 2026-11-19). Design reference: `../design-sample.html`.
Task list: `tasks/todo.md`.

## Overview

Rebuild the approved single-page design as a statically generated Next.js 16 site in DE, EN and AR (RTL), with content in typed files instead of a CMS. Work goes bottom-up: scaffold and layout shell, then the hours logic (test-first) and content layer, then the home sections in vertical slices, then contact form, legal/SEO, and the quality gate.

## Dependency graph

```
T1 scaffold
 ├─ T2 tokens + fonts
 │    └─ T4 layout shell (header, footer, notice) ── needs T3
 ├─ T3 i18n + RTL
 ├─ T5 hours.ts (pure, TDD)
 └─ T6 content schema + files ── needs T5 types
        ├─ T7 hero + info bar + week strip ── needs T4, T5
        ├─ T8 tasks + services
        ├─ T9 steps + care finder (care.ts TDD)
        ├─ T10 team + reviews slider
        ├─ T11 FAQ + visit + consent map
        ├─ T12 contact form + server action
        └─ T13 legal pages + SEO + JSON-LD
T14 images · T15 e2e/axe · T16 Lighthouse + preview deploy (after all)
```

## Architecture decisions

- **Static generation per locale.** All pages are prerendered (`generateStaticParams` for `de|en|ar`). The open/closed status is computed on the client from the static hours and closures, so it is correct at any time without server work and future closures switch themselves on.
- **One time module.** `lib/hours.ts` is pure and the only place that knows about Europe/Berlin time; server and client both import it.
- **Content as code.** `content/*.ts` exports data typed by zod schemas in `content/schema.ts`. `pnpm check:content` and `next build` both run the validation, so a bad edit fails the build, not the page.
- **UI strings vs content.** Short interface strings (buttons, labels, errors) live in `messages/*.json` via next-intl. Practice content (services, FAQ, doctors) lives in `content/` with `{ de, en?, ar? }` fields and a `pick(field, locale)` helper that falls back to `de`.
- **Client islands only where needed.** Status tick, care finder, review slider, map loader, mobile nav, contact form. Everything else is a Server Component.
- **Contact delivery behind one function.** `sendContact(msg)` in `lib/contact.ts`. Until the provider is chosen it logs in dev and returns an error in production, so the UI and validation can ship first.
- **No third-party requests before user action.** Fonts self-hosted, Google Maps behind a click, Doctolib and Google review links are plain links.

## Task list

### Phase 1: Foundation
- [x] T1 Scaffold Next.js 16, TypeScript strict, Tailwind v4, pnpm scripts, git init
- [x] T2 Design tokens in `@theme` and self-hosted fonts
- [x] T3 i18n routing (de default, en, ar) with `dir="rtl"` and language switch
- [x] T4 Layout shell: notice bar, pill header with mobile menu, footer with emergency strip

### Checkpoint A: Foundation
- [x] `pnpm build`, `pnpm typecheck`, `pnpm lint` clean
- [x] `/`, `/en`, `/ar` render the shell; `/ar` is RTL; no horizontal scroll at 320 px
- [ ] Review with human

### Phase 2: Data and first slice
- [x] T5 `lib/hours.ts` getStatus with Vitest (TDD)
- [x] T6 Content schemas, practice/hours/closures/notice files, `check:content`
- [x] T7 Hero, info bar and week strip with live status

### Checkpoint B: First vertical slice
- [x] Unit tests green, including DST and closure cases
- [x] Hero and status match the sample in all three locales
- [ ] Review with human

### Phase 3: Home sections
- [x] T8 "Wie können wir helfen" tasks and services sections
- [x] T9 Visit steps and Vorsorge-Finder (`lib/care.ts`, TDD)
- [x] T10 Team and reviews slider
- [x] T11 FAQ and visit section with transit and consent-gated map

### Checkpoint C: Home complete
- [x] Every sample section present in DE/EN/AR
- [x] No request to google.com before clicking "Karte laden"
- [ ] Review with human

### Phase 4: Contact, legal, quality
- [ ] T12 Contact form, zod schema, server action, honeypot, rate limit
- [ ] T13 Impressum, Datenschutz, metadata, hreflang, sitemap, robots, JSON-LD
- [ ] T14 Image pipeline: optimised hero and portraits, remove unused assets
- [ ] T15 Playwright e2e and axe across locales and widths
- [ ] T16 Lighthouse pass and preview deploy on Vercel fra1

### Checkpoint D: Complete
- [ ] All spec success criteria met (SPEC.md §Success Criteria 1–9, except items waiting on the practice)
- [ ] Ready for practice review

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Next.js 16 / next-intl / Tailwind v4 version mismatch | High | T1 checks official docs and pins exact versions before any feature work |
| DST and timezone bugs in status | High | T5 is test-first with fixed `Date` inputs for both DST change days |
| Arabic typography (line height, mixed LTR numbers) regresses from the sample | Med | Port the sample's `:lang(ar)` and `bdi` rules in T2/T3; AR screenshots at each checkpoint |
| Email provider not chosen when T12 starts | Med | `sendContact` seam; UI and validation ship, delivery wired once chosen |
| Rate limiting on serverless has no shared store | Low | Start with honeypot + per-instance limit + minimum fill time; add a store only if spam appears |
| Font files: licence and subsetting | Low | Use OFL fonts from official sources, subset to Latin + Arabic, `font-display: swap` |
| Content edits break the page | Low | zod validation in build; `check:content` before push |

## Open questions (from SPEC.md)

1. Email provider for the contact form (blocks wiring in T12, not the task).
2. Canonical domain (needed by T13 metadata and sitemap).
3. Who owns the Vercel project and domain (needed by T16).
4. Practice sign-off items and native-speaker review (block launch, not build).
