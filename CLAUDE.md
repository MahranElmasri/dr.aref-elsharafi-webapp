@AGENTS.md

# berlin-hausaerzte.de (Ärztezentrum Dr. Sharafi und Kollegen)

GP practice site in Berlin-Wedding. Next.js 16 + next-intl (de/en/ar, Arabic is RTL), Tailwind v4 tokens in `app/globals.css`, no CMS.

**Source of truth:** `SPEC.md` — read its Tech Stack, Commands, Code Style and Boundaries before a task. Task status: `tasks/todo.md`.

## Where things live
- Content: typed, zod-validated files in `content/` (schemas in `content/schema.ts`); localized `{ de, en?, ar? }`, read with `pick()`.
- UI strings: `messages/{de,en,ar}.json`. Change all three together.
- Vorsorge-Finder rules: `lib/care.ts` (texts under `care.items` in messages); pinned by `tests/unit/care.test.ts` and the count in `e2e/interaction.spec.ts`.
- Home sections: `components/home/*.tsx`; header/footer in `components/layout/`.
- Styles: plain CSS in `app/globals.css` (`@layer components`), tokens only, logical properties.

## Rules that are easy to break
- **Medical and process wording needs practice sign-off.** Don't invent services, doctor languages, focus areas or coverage claims. Verify GKV/STIKO facts against G-BA/RKI sources and cite them; check the date (rules change in-year).
- Doctor roles and focus areas were corrected by the practice reviewer. Don't revert them to wording from older designs or screenshots.
- Arabic: wrap Latin terms that contain hyphens in LTR isolates with a non-breaking hyphen (`⁦E‑Rezept⁩`), or bidi scrambles them on line wrap. Mirror arrows/directional icons under `[dir="rtl"]`.
- Tap targets ≥ 44px; respect `prefers-reduced-motion` for hover motion.
- Leave the `AGENTS.md` block alone; `next dev` rewrites it.
- Commit only when asked; the user reviews uncommitted changes first.

## Verify
- `pnpm typecheck && pnpm lint && pnpm test` (one known lint warning: unused `CrossMark` in `components/layout/Footer.tsx`).
- E2E: **`pnpm test:e2e`**, which builds first. Plain `playwright test` reuses the last build on port 3400 and can test stale code.
- Visual check: dev server on :3000; screenshot `/de`, `/ar` at 1280 and 390px with Playwright `channel: "chrome"` (bundled Chromium isn't installed). Check that nothing overflows sideways.
- Known flaky test: `e2e/privacy.spec.ts` sometimes times out in `waitForLoadState`, even on a clean tree.
