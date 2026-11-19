import { describe, expect, it } from "vitest";
import * as schema from "@/content/schema";
import { pick } from "@/content/localized";
import { activeOn, noticeItems } from "@/lib/notices";

// Importing the content modules runs their schema.parse: a bad edit throws here.
import "@/content/practice";
import "@/content/hours";
import "@/content/closures";
import "@/content/notice";

describe("content schemas", () => {
  it("rejects localized text without German", () => {
    expect(schema.localized.safeParse({ en: "Hello" }).success).toBe(false);
    expect(schema.localized.safeParse({ de: "  " }).success).toBe(false);
    expect(schema.localized.safeParse({ de: "Hallo", fr: "Bonjour" }).success).toBe(false);
  });

  it("rejects malformed times, reversed and overlapping sessions", () => {
    expect(schema.session.safeParse({ from: "8:00", to: "13:00" }).success).toBe(false);
    expect(schema.session.safeParse({ from: "13:00", to: "08:00" }).success).toBe(false);
    const week = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
    expect(schema.openingHours.safeParse({ ...week, 1: [{ from: "08:00", to: "13:00" }, { from: "12:00", to: "17:00" }] }).success).toBe(false);
    expect(schema.openingHours.safeParse({ ...week, 8: [] }).success).toBe(false);
  });

  it("rejects closures with bad or reversed dates", () => {
    const message = { de: "Urlaub" };
    expect(schema.closure.safeParse({ from: "2026-12-24", to: "2026-12-23", message }).success).toBe(false);
    expect(schema.closure.safeParse({ from: "24.12.2026", to: "2026-12-31", message }).success).toBe(false);
    expect(schema.closure.safeParse({ from: "2026-12-24", to: "2026-12-24", message }).success).toBe(true);
  });
});

describe("pick", () => {
  it("falls back to German", () => {
    expect(pick({ de: "Hallo", en: "Hello" }, "en")).toBe("Hello");
    expect(pick({ de: "Hallo" }, "ar")).toBe("Hallo");
  });
});

describe("notice bar items", () => {
  const closure = { from: "2026-12-24", to: "2027-01-01", message: { de: "Praxisurlaub" } };

  it("shows a closure only within its date range", () => {
    const [item] = noticeItems(null, [closure]);
    expect(activeOn("2026-12-23")(item)).toBe(false);
    expect(activeOn("2026-12-24")(item)).toBe(true);
    expect(activeOn("2027-01-01")(item)).toBe(true);
    expect(activeOn("2027-01-02")(item)).toBe(false);
  });

  it("puts the notice first and shows an undated notice every day", () => {
    const notice = { title: { de: "Hinweis" }, message: { de: "Neu: Online-Termine" } };
    const items = noticeItems(notice, [closure]);
    expect(items.map((i) => i.key)).toEqual(["notice", "closure-2026-12-24"]);
    expect(activeOn("2030-01-01")(items[0])).toBe(true);
  });
});
