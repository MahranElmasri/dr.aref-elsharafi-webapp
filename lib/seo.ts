import { closures } from "@/content/closures";
import { doctors } from "@/content/doctors";
import { openingHours, weekdays } from "@/content/hours";
import { practice } from "@/content/practice";
import { routing, type Locale } from "@/i18n/routing";

/** Canonical origin (decided 2026-11-19). aerztezentrum-sharafi.de should redirect here. */
export const SITE_URL = "https://berlin-hausaerzte.de";

/** Absolute URL of a page in a locale. German has no prefix ("as-needed" routing). */
export function localeUrl(locale: Locale, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  if (path === "/") return SITE_URL + (prefix || "/");
  return SITE_URL + prefix + path;
}

export function alternatesFor(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localeUrl(l, path);
  languages["x-default"] = localeUrl(routing.defaultLocale, path);
  return { canonical: localeUrl(locale, path), languages };
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// Practice location, from the Google Maps place link.
const GEO = { latitude: 52.5496962, longitude: 13.3523806 };

function openingHoursSpecification() {
  const groups = new Map<string, string[]>();
  for (const d of weekdays) {
    for (const s of openingHours[d]) {
      const key = `${s.from}-${s.to}`;
      groups.set(key, [...(groups.get(key) ?? []), dayNames[d - 1]]);
    }
  }
  return [...groups].map(([key, dayOfWeek]) => {
    const [opens, closes] = key.split("-");
    return { "@type": "OpeningHoursSpecification" as const, dayOfWeek, opens, closes };
  });
}

export function clinicJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${SITE_URL}/#praxis`,
    name: practice.name,
    url: localeUrl(locale, "/"),
    telephone: practice.phone.tel,
    email: practice.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: practice.street,
      postalCode: practice.postalCode,
      addressLocality: practice.city,
      addressCountry: "DE",
    },
    geo: { "@type": "GeoCoordinates", ...GEO },
    hasMap: practice.googleMapsUrl,
    medicalSpecialty: "PrimaryCare",
    isAcceptingNewPatients: true,
    availableLanguage: ["de", "en", "ar"],
    openingHoursSpecification: openingHoursSpecification(),
    // Closed days override the regular hours (validFrom/validThrough inclusive).
    specialOpeningHoursSpecification: closures.map((c) => ({
      "@type": "OpeningHoursSpecification" as const,
      validFrom: c.from,
      validThrough: c.to,
      opens: "00:00",
      closes: "00:00",
    })),
    potentialAction: { "@type": "ReserveAction", target: practice.doctolibUrl },
    member: doctors.map((d) => ({ "@type": "Physician" as const, name: d.name })),
  };
}

/** JSON for a <script type="application/ld+json">, safe against "</script>" in content. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
