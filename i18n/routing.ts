import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en", "ar"],
  defaultLocale: "de",
  // German at "/", English at "/en", Arabic at "/ar".
  localePrefix: "as-needed",
  // No Accept-Language redirect and no NEXT_LOCALE cookie: "/" is always German,
  // visitors pick a language with the switch. Keeps URLs predictable and sets no cookie.
  localeDetection: false,
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

export const rtlLocales: ReadonlySet<Locale> = new Set(["ar"]);
export const dirFor = (locale: Locale) => (rtlLocales.has(locale) ? "rtl" : "ltr");
