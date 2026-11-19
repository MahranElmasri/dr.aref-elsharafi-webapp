import type { Locale } from "@/i18n/routing";
import type { Localized } from "./schema";

export type { Localized };

export const pick = (value: Localized, locale: Locale): string => value[locale] ?? value.de;
