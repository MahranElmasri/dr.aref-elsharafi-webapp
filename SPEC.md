# Spec: berlin-hausaerzte.de rebuild (Ärztezentrum Dr. Sharafi und Kollegen)

Status: APPROVED 2026-11-19 (no CMS)
Design source of truth: `design-sample.html` (approved by the builder on 2026-11-19; practice review by Dr. Sharafi pending)

## Assumptions (correct before approval)

1. No CMS (decided 2026-11-19). All content lives in typed files in the repository. The builder makes every content change (closures, notices, hours, team, FAQ) and a push to `main` deploys it. Running cost stays at free tiers. No fixed launch date.
2. Home is one long page with anchors, as in the sample. Separate pages exist only for Impressum and Datenschutz. Per-doctor profile pages are deferred until the practice supplies bios.
3. German is the default locale at `/` with no prefix. English at `/en`, Arabic at `/ar` with `dir="rtl"`.
4. Booking stays a plain outbound link to Doctolib (`praxis-dr-aref-sharafi`). No embed, no API.
5. The contact form sends one email to the practice and stores nothing. It is for non-medical requests only.
6. EN and AR copy from the sample ships marked as draft until a native speaker reviews it; DE is required, EN/AR fall back to DE per field (enforced by the content types).

## Objective

Replace the current brochure site with a fast, trilingual site that lets patients of a GP practice in Berlin-Wedding answer their own questions: are you open, how do I get seen, do you do X, who are the doctors, how do I get there.

- Users: patients and relatives in Wedding (many Arabic-speaking). Content is edited only by the builder.
- Success after three months: more Doctolib bookings, fewer phone calls for hours, directions and insurance questions, and Arabic-speaking patients using `/ar` on their own.
- Out of scope: patient portal, online prescriptions, any form that collects health data, Doctolib embed, analytics with cookies, per-doctor pages, a blog.

## Capability map

One deployable app. Modules are build units, not services.

| Module id | Responsibility | Depends on |
|---|---|---|
| foundation | Next.js scaffold, tokens, fonts, i18n routing, RTL, layout shell (header, footer) | — |
| hours | Pure `getStatus(now, hours, closures)` in Europe/Berlin; week strip and hero status | foundation |
| content | Typed content files per section with `{ de, en?, ar? }` fields, validated at build time; seeded from the sample | foundation |
| home | All home sections from the sample, fed by `content` and `hours` | content, hours |
| contact | Contact form UI plus server action that emails the practice | foundation |
| consent-map | Two-click Google Maps loader | foundation |
| legal-seo | Impressum, Datenschutz, metadata, hreflang, sitemap, JSON-LD | content |
| quality | Playwright, axe, Lighthouse, preview deploy | all |

Build order: foundation → hours → content → home → contact, consent-map → legal-seo → quality

## Tech Stack

Versions are verified against official docs at scaffold time (source-driven-development); pin exact versions in `package.json`.

- Next.js 16 (App Router, React 19, Server Components, static generation, `next/image`, Server Actions), TypeScript strict, pnpm
- Tailwind CSS v4 with tokens in CSS `@theme`, logical properties for RTL
- next-intl for locale routing and UI strings
- zod for content validation at build time and for the contact form
- `next/font/local` (self-hosted): Source Serif 4, DM Sans, Noto Naskh Arabic, IBM Plex Sans Arabic
- shadcn/ui primitives only where needed (Sheet for mobile nav, Accordion for FAQ)
- Email: an EU-hosted transactional provider (see Open Questions), called from a Server Action
- Hosting: Vercel, region `fra1`; Vercel Web Analytics (cookieless)
- Tests: Vitest, Playwright, @axe-core/playwright

## Commands

```
Install:    pnpm install
Dev:        pnpm dev
Build:      pnpm build
Start:      pnpm start
Lint:       pnpm lint
Typecheck:  pnpm typecheck          # tsc --noEmit
Unit:       pnpm test               # vitest run
E2E:        pnpm test:e2e           # playwright test
Content:    pnpm check:content      # validate content/ against zod schemas (also runs in build)
```

## Project Structure

```
app/
  [locale]/
    layout.tsx          → html lang/dir, fonts, header, footer
    page.tsx            → home (sections below)
    impressum/page.tsx
    datenschutz/page.tsx
  sitemap.ts, robots.ts
components/
  layout/               → Header, Footer, NoticeBar, LanguageSwitch
  home/                 → Hero, InfoBar, WeekStrip, Tasks, Services, Steps,
                          CareFinder, Team, Reviews, Faq, Visit, ContactForm
  ui/                   → shadcn primitives actually used
lib/
  hours.ts              → getStatus and helpers (only time logic in the app)
  care.ts               → Vorsorge rules by age and sex
  contact.ts            → zod schema + server action
i18n/
  routing.ts, request.ts
messages/de.json, en.json, ar.json   → UI strings (buttons, labels, errors)
content/
  schema.ts           → zod schemas + Localized<T> type
  practice.ts, hours.ts, closures.ts, notice.ts, doctors.ts, services.ts,
  steps.ts, tasks.ts, faq.ts, reviews.ts
tests/unit/            → *.test.ts (Vitest)
e2e/                   → *.spec.ts (Playwright)
public/assets/         → optimised images (portraits, hero)
design-sample.html     → frozen reference, not shipped
```

## Content model (files in `content/`)

Each file exports typed data checked by zod at build time; a bad entry fails the build instead of breaking the page. Localized fields are `{ de: string; en?: string; ar?: string }`, falling back to `de`.

- `practice.ts`: name, address, phone, email, doctolibUrl, googleMapsUrl, googleMapsEmbedUrl, insuranceNote, accessibilityNote, languages, transit[] (line, stop, note)
- `hours.ts`: seven weekdays, each `sessions[{ from, to }]`
- `closures.ts`: `[{ from, to, message }]`. Overrides status and shows in the notice bar
- `notice.ts`: optional `{ message, start, end }`
- `doctors.ts`: name, role, portrait path, focus[], order
- `services.ts`, `steps.ts`, `tasks.ts`, `faq.ts`: localized titles and texts, as in the sample
- `reviews.ts`: quote, author, meta, tag, rating, source, `consentConfirmed: true` (literal type, so an unconfirmed review cannot compile)
- `lib/care.ts`: Vorsorge rules (logic, reviewed by the practice)

Changing content: edit the file, run `pnpm check:content`, push to `main`; Vercel deploys in about two minutes. Closures with dates in the future can be added ahead of time and switch on and off by themselves, since the status is computed at request time.

## Code Style

```tsx
// components/home/WeekStrip.tsx
import { getTranslations } from "next-intl/server";
import { getStatus, type Hours } from "@/lib/hours";

export async function WeekStrip({ hours, now }: { hours: Hours; now: Date }) {
  const t = await getTranslations("hours");
  const status = getStatus(now, hours, []);
  return (
    <section id="heute" aria-labelledby="week-h" className="mx-auto max-w-6xl px-4">
      <h2 id="week-h" className="font-serif text-2xl">{t("title")}</h2>
      <p aria-live="polite" className="text-sm">{t(status.open ? "openUntil" : "closed", status)}</p>
      {/* … */}
    </section>
  );
}
```

- Server Components by default; `"use client"` only for the slider, care finder, map loader, mobile nav, live status tick and contact form.
- Logical CSS only (`ps-`, `me-`, `start-`); never `left`/`right` for layout.
- Numbers, phones and times wrapped in `<bdi dir="ltr">` or `.ltr` in RTL.
- File names PascalCase for components, kebab or camel for lib; named exports.
- No raw hex in components; tokens from `@theme`.

## Testing Strategy

- Unit (Vitest, `tests/unit`): `hours.ts` first, test-driven: lunch break, Wednesday afternoon, Friday afternoon, weekend, closure override, DST change days (last Sunday of March and October). `care.ts` age/sex rules. Contact zod schema.
- E2E (Playwright, `e2e/`), at 320, 768, 1024 and 1440 px for `/`, `/en`, `/ar`:
  - no horizontal scroll; `dir="rtl"` on `/ar`
  - language switch keeps the section; Doctolib links open in a new tab
  - status under a mocked clock (open, lunch, closed)
  - Google Maps: zero requests to google.com before clicking "Karte laden"
  - contact form: errors next to fields, focus on first invalid, success message
  - review slider: buttons, dots, keyboard
- Accessibility: axe zero violations on all three locales; keyboard walk-through; tap targets ≥ 24 px.
- Performance: Lighthouse mobile ≥ 95 in all four categories on the preview deploy.

## Boundaries

- Always: run `pnpm typecheck && pnpm lint && pnpm test` before marking a task done; keep DE as the source locale; wrap LTR data in RTL; keep Google and other third parties behind user action.
- Ask first: adding any dependency not listed above; choosing the email provider; adding a CMS later; anything that changes medical wording; publishing reviews.
- Never: commit secrets or `.env*`; load third-party scripts, fonts or iframes before consent; store contact-form messages; add health-related fields to any form; publish invented reviews; ship EN/AR copy without the draft flag until reviewed.

## Success Criteria

1. `pnpm build` passes; typecheck, lint, unit and e2e suites green.
2. Home renders every sample section in DE, EN and AR with content from `content/`; AR is fully RTL.
3. A closure added to `content/closures.ts` with future dates shows in the notice bar and status only within its date range, with no further deploy; an invalid content entry fails `pnpm build`.
4. Status is correct for the mocked-clock cases, including DST days.
5. No request to a third-party origin on first load (Network panel / Playwright request log).
6. Contact form delivers one email to the practice address; the server rejects missing fields, invalid email and honeypot hits; nothing is stored; a basic rate limit applies.
7. axe: 0 violations; Lighthouse mobile ≥ 95 ×4; no horizontal scroll at 320 px.
8. Impressum and Datenschutz pages exist with practice-supplied text; Datenschutz covers Google Maps, the contact form and the email provider.
9. JSON-LD `MedicalClinic` with opening hours and one `Physician` per doctor validates.

## Open Questions

1. Email provider for the contact form (EU-hosted, with a data-processing agreement). Candidate needs a decision before the `contact` module.
2. Canonical domain and brand name for metadata (berlin-hausaerzte.de vs. aerztezentrum-sharafi.de).
3. Practice sign-off items: doctor photos (each doctor), medical wording in services, steps and Vorsorge rules, "reply within two working days", transit lines M13/50 and walking time, real reviews with consent.
4. Native-speaker review for EN and AR.
5. How does the practice ask for content changes (email, WhatsApp) and how fast do they need them live?
6. Is the Doctolib "rund um die Uhr" statement still accurate, and are there per-doctor Doctolib links?
