import type { Locale } from "@/i18n/routing";

// German is required; English and Arabic fall back to German when missing.
export type Localized = { de: string; en?: string; ar?: string };

export const pick = (value: Localized, locale: Locale): string => value[locale] ?? value.de;
