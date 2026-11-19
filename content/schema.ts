import { z } from "zod";

// Every content file is parsed with these schemas when it is imported, so a bad
// edit fails `pnpm check:content` and `pnpm build` instead of breaking the page.

/** German is required; English and Arabic fall back to German when missing. */
export const localized = z.strictObject({
  de: z.string().trim().min(1, "German text is required"),
  en: z.string().trim().min(1).optional(),
  ar: z.string().trim().min(1).optional(),
});

/** Wall-clock time in Berlin, zero-padded: "08:00". */
export const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use "HH:MM", e.g. "08:00"');

/** Berlin calendar date: "2026-12-24". */
export const date = z.iso.date();

export const session = z
  .strictObject({ from: time, to: time })
  .refine((s) => s.from < s.to, { message: "Session must end after it starts" });

const daySessions = z
  .array(session)
  .refine((list) => list.every((s, i) => i === 0 || list[i - 1].to <= s.from), {
    message: "Sessions must be in order and must not overlap",
  });

export const openingHours = z.strictObject({
  1: daySessions, 2: daySessions, 3: daySessions, 4: daySessions,
  5: daySessions, 6: daySessions, 7: daySessions,
});

export const closure = z
  .strictObject({ from: date, to: date, message: localized })
  .refine((c) => c.from <= c.to, { message: "Closure must end on or after its start date" });

export const notice = z
  .strictObject({ title: localized, message: localized, from: date.optional(), to: date.optional() })
  .refine((n) => !n.from || !n.to || n.from <= n.to, { message: "Notice must end on or after its start date" });

export const practice = z.strictObject({
  name: z.string().min(1),
  street: z.string().min(1),
  postalCode: z.string().regex(/^\d{5}$/),
  city: z.string().min(1),
  phone: z.strictObject({ display: z.string().min(1), tel: z.string().regex(/^\+\d{6,15}$/) }),
  email: z.email(),
  doctolibUrl: z.url({ protocol: /^https$/ }),
  googleMapsUrl: z.url({ protocol: /^https$/ }),
  /** Loaded only after the visitor clicks "Karte laden". */
  googleMapsEmbedUrl: z.url({ protocol: /^https$/, hostname: /^www\.google\.com$/ }).refine((u) => u.startsWith("https://www.google.com/maps/embed?")),
});

export const serviceIcon = z.enum(["practice", "checkup", "vaccine", "lab", "chronic", "home"]);
export const service = z.strictObject({
  icon: serviceIcon,
  title: localized,
  summary: localized,
  items: z.array(localized).min(1),
  linksToCareFinder: z.literal(true).optional(),
});

export const task = z.strictObject({
  icon: z.enum(["calendar", "prescription", "sicknote"]),
  title: localized,
  text: localized,
  action: z.enum(["book", "call"]),
});

export const step = z.strictObject({ title: localized, text: localized });

export const doctor = z.strictObject({
  name: z.string().min(1),
  portrait: z.enum(["aref", "nahas", "zoghbi", "koeniger"]),
  role: localized,
  focus: z.array(localized),
});

const reviewBase = {
  quote: localized,
  author: localized,
  meta: localized,
  tag: localized,
  rating: z.number().int().min(1).max(5),
};
/** A review is either a marked placeholder, or real with the author's confirmed consent. */
export const review = z.union([
  z.strictObject({ ...reviewBase, sample: z.literal(true) }),
  z.strictObject({ ...reviewBase, consentConfirmed: z.literal(true), source: z.enum(["google", "jameda", "doctolib", "direct"]) }),
]);

export const faqItem = z.strictObject({ q: localized, a: localized });

export type Localized = z.infer<typeof localized>;
export type Session = z.infer<typeof session>;
export type OpeningHours = z.infer<typeof openingHours>;
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Closure = z.infer<typeof closure>;
export type Notice = z.infer<typeof notice>;
export type Review = z.infer<typeof review>;
