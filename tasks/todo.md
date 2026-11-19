# Tasks: berlin-hausaerzte.de rebuild

Plan: `tasks/plan.md`. Spec: `SPEC.md`. Design: `design-sample.html`.
Standard verification for every task: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.

---

## Phase 1: Foundation

### T1: Scaffold the app
**Description:** Create the Next.js 16 App Router project in this folder with TypeScript strict, Tailwind v4, ESLint and pnpm scripts from the spec. Check current versions in the official docs and pin them. Initialise git with a `.gitignore` that excludes `.env*`, `node_modules`, `.next`. Move `design-sample.html` and `assets/` aside so they are not shipped (`design/`).
**Acceptance criteria:**
- [x] `pnpm dev` serves a placeholder page; `pnpm build` passes
- [x] Scripts `typecheck`, `lint`, `test`, `test:e2e`, `check:content` exist (the last two may be stubs)
- [x] `tsconfig` has `strict: true`; versions pinned
**Done 2026-11-19:** next 16.4.6, react 19.3.0, next-intl compatible (4.15.3 peer ^16), tailwind 4.3.5 via @tailwindcss/turbopack, vitest 5.1.1. Scaffold flags `cacheComponents`/`partialPrefetching` removed (static site; avoids next-intl friction). `typecheck` runs `next typegen` first. Design files moved to `design/`.
**Verification:** standard command; open `http://localhost:3000`.
**Dependencies:** None
**Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/globals.css`, `.gitignore`
**Scope:** M

### T2: Design tokens and fonts
**Description:** Port the sample's `:root` tokens (teal palette, spacing, radii, type scale, shadows) into Tailwind `@theme`. Self-host Source Serif 4, DM Sans, Noto Naskh Arabic and IBM Plex Sans Arabic as woff2 via `next/font/local` with Latin/Arabic subsets. Port base styles (focus ring, `.ltr`, `.sr-only`, skip link, buttons).
**Acceptance criteria:**
- [x] Tokens match the sample's hex values; no raw hex outside `globals.css`
- [x] No font request to any external origin
- [x] Buttons and focus ring match the sample
**Done 2026-11-19:** fonts are Fontsource OFL woff2 files in `app/fonts/` (licences alongside), loaded via `app/fonts.ts`; Arabic faces `preload: false`. Colours, type, radii, shadows in `@theme`; spacing stays in `:root` so Tailwind's spacing scale keeps its meaning. Buttons are CSS classes (`.btn-primary`, `.btn-outline`) — no `Button.tsx` needed.
**Verification:** standard; Network panel shows fonts from own origin only.
**Dependencies:** T1
**Files:** `app/globals.css`, `app/fonts.ts`, `app/fonts/*`
**Scope:** M

### T3: i18n routing and RTL
**Description:** Configure next-intl with locales `de` (default, no prefix), `en`, `ar`. Set `<html lang dir>` per locale, `generateStaticParams` for all three, and a language switch that keeps the current hash. Port `:lang(ar)` typography rules.
**Acceptance criteria:**
- [x] `/`, `/en`, `/ar` render; `/ar` has `dir="rtl"`
- [x] Switching language keeps the section anchor
- [x] Unknown locale returns 404
**Done 2026-11-19:** next-intl 4.15.3. Next 16 uses `proxy.ts` (not `middleware.ts`). `localeDetection: false` and `localeCookie: false`: `/` is always German, no cookie, no Accept-Language redirect. The switch uses links (crawlable) and a full load that keeps the `#hash`. 404 via `[...rest]` and `[locale]/not-found.tsx`; it is streamed, so it needs JS to show text (status is 404 regardless).
**Verification:** standard; manual switch on three locales.
**Dependencies:** T1
**Files:** `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`, `proxy.ts`, `app/[locale]/layout.tsx`, `messages/{de,en,ar}.json`
**Scope:** M

### T4: Layout shell
**Description:** Build the notice bar, the floating pill header (brand, nav with active-section highlight, language switch, call and book buttons, mobile menu) and the footer (brand, links, aligned hours, emergency strip, legal row) as in the sample.
**Acceptance criteria:**
- [x] Header and footer match the sample at 375, 800 and 1280 px in DE and AR
- [x] Mobile menu is keyboard-operable and closes on Escape
- [x] All header/footer targets ≥ 24 px
**Done 2026-11-19:** Header is a client component (menu state, Escape, scroll-spy); NoticeBar and Footer are server components. Practice data and hours seeded in `content/practice.ts`, `content/hours.ts`; `content/notice.ts` is `null` (no notice shown). Language switch is a `role=group` with DE/EN/عربي and full names as accessible names. The sample's "Designmuster" flag was dropped from the legal row. Footer year is set at build time.
**Verification:** standard; screenshots vs sample.
**Dependencies:** T2, T3
**Files:** `components/layout/{NoticeBar,Header,MobileNav,Footer,LanguageSwitch}.tsx`, `app/[locale]/layout.tsx`
**Scope:** M

## Checkpoint A: Foundation
- [x] typecheck, lint, build clean
- [x] Shell renders in DE/EN/AR, AR RTL, no horizontal scroll at 320 px
- [ ] Review with human

---

## Phase 2: Data and first slice

### T5: Hours logic (TDD)
**Description:** Write `lib/hours.ts` with `getStatus(now, hours, closures)` returning `{ open, until?, lunch?, next?, day }` in Europe/Berlin. Write the Vitest cases first.
**Acceptance criteria:**
- [x] Tests cover: open morning, lunch break, Wednesday after 14:00, Friday after 13:00, weekend, closure covering today, closure ending tomorrow, both 2026 DST change days
- [x] No dependency on the machine's local timezone (tests run with `TZ=UTC` and `TZ=Asia/Tokyo`)
**Done 2026-11-19:** 17 tests, red then green; `pnpm test:tz` runs them under UTC and Tokyo. Berlin date/time via `Intl.DateTimeFormat`; day offsets use calendar-date arithmetic, so 23/25-hour days don't shift them. `Closure = { from, to, message }`, both dates inclusive.
**Verification:** `pnpm test`
**Dependencies:** T1
**Files:** `lib/hours.ts`, `tests/unit/hours.test.ts`
**Scope:** S

### T6: Content layer
**Description:** Add `content/schema.ts` (zod schemas, `Localized` type, `pick()` fallback helper) and the files `practice.ts`, `hours.ts`, `closures.ts`, `notice.ts` seeded from the sample. Wire `check:content` and run validation in the build. The notice bar reads `notice` and active `closures`.
**Acceptance criteria:**
- [x] An invalid entry (e.g. missing `de`) fails `pnpm check:content` and `pnpm build`
- [x] A closure with future dates shows only within its range (unit test with mocked dates)
- [x] `pick()` falls back to `de`
**Done 2026-11-19:** zod 4.6.7. Content files call `schema.parse` on import, so `check:content` (a Vitest file) and `next build` both fail on bad data (checked with a broken time). Notice bar filters by today's Berlin date in the browser via `useNowMinute` (`useSyncExternalStore`, build time as server snapshot), so future closures switch on by themselves (checked in Chrome). No `scripts/check-content.ts` needed.
**Verification:** standard; break one field on purpose and confirm the build fails.
**Dependencies:** T5
**Files:** `content/schema.ts`, `content/{practice,hours,closures,notice}.ts`, `lib/notices.ts`, `lib/useBerlinNow.ts`, `tests/unit/content.test.ts`
**Scope:** M

### T7: Hero, info bar and week strip
**Description:** Port the hero (rounded photo, translucent panel, CTAs, doctor faces), the five-item info bar and the "Sprechzeiten" week strip. A small client island computes status from `lib/hours.ts` and refreshes each minute.
**Acceptance criteria:**
- [x] Matches the sample at 375/800/1280 in DE and AR
- [ ] Status text correct for mocked open, lunch and closed times (logic covered by 17 unit tests; live "closed, reopens tomorrow" checked in Chrome; mocked-clock UI check moves to T15 Playwright)
- [x] Hero image uses `next/image` with `priority` and responsive sizes
**Done 2026-11-19:** Hero and info bar are server components; `HeroStatus` and `WeekStrip` are client islands sharing `useLiveStatus` (build time as server snapshot, then the browser clock, re-checked each minute). Hero served as WebP (145 KB at 1200 px). No hydration errors; no horizontal scroll at 320/375 in DE/EN/AR. Day names moved to the shared `days` message key.
**Verification:** standard; screenshots; mocked-clock check.
**Dependencies:** T4, T6
**Files:** `components/home/{Hero,InfoBar,WeekStrip,LiveStatus}.tsx`, `app/[locale]/page.tsx`, `public/assets/hero2*.jpg`
**Scope:** M

## Checkpoint B: First vertical slice
- [x] Unit tests green
- [x] Hero and status correct in all locales
- [ ] Review with human

---

## Phase 3: Home sections

### T8: Tasks and services
**Description:** Content files and components for "Wie können wir Ihnen helfen?" (3 tasks) and "Unsere Leistungen" (lead card + 5 cards with included lists and Vorsorge link).
**Acceptance criteria:**
- [x] Copy comes from `content/tasks.ts` and `content/services.ts` in all locales
- [x] Grid matches the sample; no overflow at 320 px
**Done 2026-11-19:** content generated from the sample's dictionary (no retyping) into `content/tasks.ts` and `content/services.ts`; icons in `components/sectionIcons.ts`.
**Verification:** standard; screenshots.
**Dependencies:** T6
**Files:** `content/{tasks,services}.ts`, `components/home/{Tasks,Services,SectionIcon}.tsx`, `components/sectionIcons.ts`
**Scope:** M

### T9: Visit steps and Vorsorge-Finder
**Description:** "So läuft Ihr Besuch ab" band, and the age-based finder. Move the rules into `lib/care.ts` with unit tests; the finder is a client component with labelled input, inline error and live result count.
**Acceptance criteria:**
- [x] `care.ts` tests cover ages 18, 34, 35, 45, 50, 55, 65, 75 and sex filters
- [x] Invalid age shows the error next to the field; nothing is stored or sent
**Done 2026-11-19:** 13 tests written first. The sample has no sex selector: sex-specific items are shown with a "Für Frauen/Für Männer" tag, so the tests check the tags instead of a filter. Checked in Chrome (AR): 45 → 6, 17 → error + aria-invalid (last result stays), 75 → 15, 34 → 3. Item texts in `messages/*.json` under `care.items`.
**Verification:** `pnpm test`; manual keyboard check.
**Dependencies:** T6
**Files:** `content/steps.ts`, `lib/care.ts`, `tests/unit/care.test.ts`, `components/home/{Steps,CareFinder}.tsx`
**Scope:** M

### T10: Team and reviews
**Description:** Doctor cards with circular portraits, and the reviews slider (initials avatars, stars, dots, arrows, keyboard, RTL, no autoplay). `reviews.ts` requires `consentConfirmed: true`; sample reviews keep the "Beispieltext" badge via a `sample: true` flag.
**Acceptance criteria:**
- [x] Slider works with buttons, dots, swipe and arrow keys in LTR and RTL
- [x] A review without consent does not type-check
**Done 2026-11-19:** Consent is enforced by the zod union in `content/schema.ts` (`sample: true` or `consentConfirmed: true` + `source`), so a review without consent fails `check:content` and `next build` (2 tests), not `tsc` itself, since the data is a parsed literal. Sample reviews are dropped when `VERCEL_ENV=production` (verified: no section and no "Beispieltext" in production HTML). Client components now get only the message namespaces they use. Slider checked in Chrome in DE and AR at 1280 and 400 px: next/prev, dots, arrow keys (mirrored in RTL). Fixed a re-snap bug: a zero-length `scrollBy` jumped back to slide 1.
**Verification:** standard; manual slider check in DE and AR.
**Dependencies:** T6
**Files:** `content/{doctors,reviews}.ts`, `components/home/{Team,Reviews,ReviewSlider}.tsx`
**Scope:** M

### T11: FAQ and visit section
**Description:** FAQ accordion, address and contact card, transit list, first-visit checklist and the two-click Google Maps loader.
**Acceptance criteria:**
- [x] No request to any Google origin before clicking "Karte laden"
- [x] After the click the iframe loads with a localized title
- [x] FAQ is keyboard-operable
**Done 2026-11-19:** Checked in Chrome (DE, AR): 0 external resources and 0 iframes before the click; after the click one `www.google.com/maps/embed` iframe with the localized title. The embed URL is schema-checked to `https://www.google.com/maps/embed?…`. The FAQ uses native `<details>/<summary>` (keyboard by default, works without JS); a keyboard e2e check follows in T15. Arabic FAQ phone numbers are wrapped in Unicode isolates so "030 45490303" and "116 117" keep their digit order. The transit "bitte bestätigen" note is hidden in production. FAQ and first-visit texts live in `content/{faq,firstVisit}.ts`.
**Verification:** standard; Network panel check.
**Dependencies:** T6
**Files:** `content/faq.ts`, `components/home/{Faq,Visit,ConsentMap}.tsx`
**Scope:** M

## Checkpoint C: Home complete
- [x] All sample sections present in DE/EN/AR
- [x] No third-party request on first load (resource timing in Chrome, DE and AR)
- [ ] Review with human

---

## Phase 4: Contact, legal, quality

### T12: Contact form
**Description:** Port the form (topics, consent, no-health-data notes). Validate with a shared zod schema on client and server. Server action with honeypot, minimum fill time and a simple rate limit, calling `sendContact()`; provider wired once chosen.
**Acceptance criteria:**
- [x] Server rejects missing fields, bad email, missing consent, honeypot hits
- [x] Errors show next to fields; focus moves to the first invalid one
- [x] Nothing is persisted; message body never logged in production
**Done 2026-11-19:** 16 tests written first (`tests/unit/contact.test.ts`). The schema in `lib/contactSchema.ts` is shared by the browser and the server action (`app/[locale]/actions.ts` calls `handleContact` in `lib/contact.ts`). Bots (honeypot filled, or under 3 s fill time measured in the browser) get a fake success and nothing is sent. Limit: 5 messages per address per 10 min, per instance. When sending fails, the values come back and the visitor is asked to call. The submit button is disabled until JavaScript runs, so a visitor without JS cannot lose a message silently. `sendContact` has no provider yet: dev logs topic and length only; production returns a failure and logs one line without content. Checked in Chrome (DE, AR): empty submit shows 4 errors with focus on Name; a bad email shows only that error; a valid submit shows the "please call" message and keeps the input.
**Verification:** `pnpm test` (schema + action unit tests); manual submit.
**Dependencies:** T4
**Files:** `lib/contact.ts`, `app/[locale]/actions.ts`, `components/home/ContactForm.tsx`, `tests/unit/contact.test.ts`
**Scope:** M

### T13: Legal pages and SEO
**Description:** Impressum and Datenschutz pages (placeholder text clearly marked until the practice supplies it), `generateMetadata` per locale, hreflang alternates, sitemap, robots, JSON-LD `MedicalClinic` with opening hours and `Physician` entries.
**Acceptance criteria:**
- [ ] JSON-LD validates in a schema validator
- [ ] Each locale has correct `lang`, canonical and alternates
**Verification:** standard; view source; validator.
**Dependencies:** T6
**Files:** `app/[locale]/{impressum,datenschutz}/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`
**Scope:** M

### T14: Images
**Description:** Move used images to `public/assets`, serve through `next/image` (AVIF/WebP), set portrait focus, delete unused files (`hero.png`, `hero.jpg`, `praxis.webp`, duplicate PNG) after confirming.
**Acceptance criteria:**
- [ ] Hero LCP image ≤ 200 KB on mobile
- [ ] No unused image in `public/`
**Verification:** build output; Lighthouse image audit.
**Dependencies:** T7, T10
**Files:** `public/assets/*`, components using images
**Scope:** S

### T15: E2E and accessibility suite
**Description:** Playwright specs for the flows in SPEC.md Testing Strategy at 320/768/1024/1440 in all locales, plus axe scans.
**Acceptance criteria:**
- [ ] All specs green; axe 0 violations
- [ ] Request log proves no third-party origin before consent
**Verification:** `pnpm test:e2e`
**Dependencies:** T7–T13
**Files:** `playwright.config.ts`, `e2e/*.spec.ts`
**Scope:** M

### T16: Lighthouse and preview deploy
**Description:** Deploy a preview to Vercel (region fra1), run Lighthouse mobile on `/`, `/en`, `/ar`, fix regressions.
**Acceptance criteria:**
- [ ] Lighthouse mobile ≥ 95 in all four categories on all three locales
- [ ] Preview URL shared for practice review
**Verification:** Lighthouse reports saved under `tasks/reports/`.
**Dependencies:** T15
**Files:** `vercel.json` (if needed), fixes as found
**Scope:** S

## Checkpoint D: Complete
- [ ] SPEC.md success criteria 1–9 met (except items waiting on the practice)
- [ ] Ready for practice review
