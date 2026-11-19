import { describe, expect, it } from "vitest";
import { alternatesFor, clinicJsonLd, localeUrl, SITE_URL } from "@/lib/seo";

describe("localeUrl", () => {
  it("keeps German unprefixed and prefixes the others", () => {
    expect(localeUrl("de", "/")).toBe(SITE_URL + "/");
    expect(localeUrl("en", "/")).toBe(SITE_URL + "/en");
    expect(localeUrl("ar", "/impressum")).toBe(SITE_URL + "/ar/impressum");
    expect(localeUrl("de", "/datenschutz")).toBe(SITE_URL + "/datenschutz");
  });
});

describe("alternatesFor", () => {
  it("gives a self canonical and every language plus x-default", () => {
    const a = alternatesFor("en", "/impressum");
    expect(a.canonical).toBe(SITE_URL + "/en/impressum");
    expect(a.languages).toEqual({
      de: SITE_URL + "/impressum",
      en: SITE_URL + "/en/impressum",
      ar: SITE_URL + "/ar/impressum",
      "x-default": SITE_URL + "/impressum",
    });
  });
});

describe("clinicJsonLd", () => {
  const ld = clinicJsonLd("de");
  it("describes the practice", () => {
    expect(ld["@type"]).toBe("MedicalClinic");
    expect(ld.address).toMatchObject({ streetAddress: "Müllerstraße 138", postalCode: "13353", addressCountry: "DE" });
    expect(ld.telephone).toBe("+493045490303");
  });
  it("groups days that share a session", () => {
    expect(ld.openingHoursSpecification).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"], opens: "08:00", closes: "13:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Thursday"], opens: "14:00", closes: "17:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday"], opens: "08:00", closes: "14:00" },
    ]);
  });
  it("lists the four doctors", () => {
    expect(ld.member.map((m) => m.name)).toHaveLength(4);
    expect(ld.member[0]).toMatchObject({ "@type": "Physician", name: "Dr. Aref Sharafi" });
  });
});
