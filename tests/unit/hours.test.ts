import { describe, expect, it } from "vitest";
import { getStatus, type Closure } from "@/lib/hours";
import { openingHours } from "@/content/hours";

// Instants are given in UTC; comments show Berlin local time.
const at = (iso: string) => new Date(iso);
const status = (iso: string, closures: Closure[] = []) => getStatus(at(iso), openingHours, closures);
const msg = { de: "Praxisurlaub" };

describe("getStatus: regular week (CET, UTC+1)", () => {
  it("is open on Monday morning until the end of the session", () => {
    // Mon 2026-11-23 09:00
    expect(status("2026-11-23T08:00:00Z")).toMatchObject({ open: true, until: "13:00", day: 1 });
  });

  it("opens exactly at 08:00 and closes exactly at 13:00", () => {
    expect(status("2026-11-23T07:00:00Z")).toMatchObject({ open: true, until: "13:00" });
    expect(status("2026-11-23T12:00:00Z")).toMatchObject({ open: false, lunch: true });
  });

  it("is closed before opening and reopens the same day", () => {
    // Mon 07:30
    expect(status("2026-11-23T06:30:00Z")).toMatchObject({
      open: false, lunch: false, next: { offset: 0, day: 1, at: "08:00" },
    });
  });

  it("is in the lunch break and reopens at 14:00", () => {
    // Mon 13:30
    expect(status("2026-11-23T12:30:00Z")).toMatchObject({
      open: false, lunch: true, next: { offset: 0, day: 1, at: "14:00" },
    });
  });

  it("is open in the afternoon session until 17:00", () => {
    // Tue 15:00
    expect(status("2026-11-24T14:00:00Z")).toMatchObject({ open: true, until: "17:00", day: 2 });
  });

  it("is closed on Wednesday after 14:00 and reopens Thursday", () => {
    // Wed 2026-11-25 15:00
    expect(status("2026-11-25T14:00:00Z")).toMatchObject({
      open: false, lunch: false, day: 3, next: { offset: 1, day: 4, at: "08:00" },
    });
  });

  it("is closed on Friday after 13:00 and reopens Monday", () => {
    // Fri 2026-11-27 13:30
    expect(status("2026-11-27T12:30:00Z")).toMatchObject({
      open: false, lunch: false, day: 5, next: { offset: 3, day: 1, at: "08:00" },
    });
  });

  it("is closed at the weekend", () => {
    // Sat 2026-11-28 10:00, Sun 2026-11-29 23:30
    expect(status("2026-11-28T09:00:00Z")).toMatchObject({ open: false, day: 6, next: { offset: 2, day: 1 } });
    expect(status("2026-11-29T22:30:00Z")).toMatchObject({ open: false, day: 7, next: { offset: 1, day: 1 } });
  });

  it("uses Berlin's date, not UTC's, around midnight", () => {
    // 2026-11-23T23:30Z is already Tue 00:30 in Berlin
    expect(status("2026-11-23T23:30:00Z")).toMatchObject({ day: 2, next: { offset: 0, day: 2, at: "08:00" } });
  });

  it("returns today's sessions", () => {
    expect(status("2026-11-25T08:00:00Z").today).toEqual([{ from: "08:00", to: "14:00" }]);
  });
});

describe("getStatus: closures", () => {
  const holiday: Closure = { from: "2026-12-22", to: "2027-01-02", message: msg };

  it("is closed during a closure and reopens on the first open day after it", () => {
    // Wed 2026-12-23 10:00 → reopens Mon 2027-01-04
    const s = status("2026-12-23T09:00:00Z", [holiday]);
    expect(s).toMatchObject({ open: false, lunch: false, closure: holiday, today: [] });
    expect(s.next).toEqual({ offset: 12, day: 1, at: "08:00" });
  });

  it("covers the first and last day of the range", () => {
    expect(status("2026-12-22T09:00:00Z", [holiday]).open).toBe(false);
    expect(status("2027-01-02T09:00:00Z", [holiday]).closure).toEqual(holiday);
    expect(status("2027-01-04T09:00:00Z", [holiday])).toMatchObject({ open: true, closure: undefined });
  });

  it("skips a closure that ends tomorrow when finding the next opening", () => {
    const short: Closure = { from: "2026-11-23", to: "2026-11-24", message: msg };
    // Mon 10:00 → reopens Wed
    expect(status("2026-11-23T09:00:00Z", [short]).next).toEqual({ offset: 2, day: 3, at: "08:00" });
  });

  it("ignores closures in the future for today's status", () => {
    expect(status("2026-11-23T08:00:00Z", [holiday])).toMatchObject({ open: true, closure: undefined });
  });

  it("skips a future closure that starts tomorrow when the practice closes today", () => {
    const fromTue: Closure = { from: "2026-11-24", to: "2026-11-24", message: msg };
    // Mon 18:00 → Tue closed → reopens Wed
    expect(status("2026-11-23T17:00:00Z", [fromTue]).next).toEqual({ offset: 2, day: 3, at: "08:00" });
  });
});

describe("getStatus: daylight saving time 2026", () => {
  it("handles the spring change (Sun 29 March, CET → CEST)", () => {
    // Fri 2026-03-27 07:30 CET (06:30Z): not yet open
    expect(status("2026-03-27T06:30:00Z")).toMatchObject({ open: false, next: { offset: 0, at: "08:00" } });
    // Sat 2026-03-28 10:00 → Mon, across the 23-hour Sunday
    expect(status("2026-03-28T09:00:00Z").next).toEqual({ offset: 2, day: 1, at: "08:00" });
    // Mon 2026-03-30 08:30 CEST is 06:30Z
    expect(status("2026-03-30T06:30:00Z")).toMatchObject({ open: true, day: 1, until: "13:00" });
  });

  it("handles the autumn change (Sun 25 October, CEST → CET)", () => {
    // Fri 2026-10-23 09:30 CEST is 07:30Z
    expect(status("2026-10-23T07:30:00Z")).toMatchObject({ open: true, day: 5 });
    // Sat 2026-10-24 10:00 → Mon, across the 25-hour Sunday
    expect(status("2026-10-24T08:00:00Z").next).toEqual({ offset: 2, day: 1, at: "08:00" });
    // Mon 2026-10-26 07:30 CET is 06:30Z: closed; 08:30 CET is 07:30Z: open
    expect(status("2026-10-26T06:30:00Z").open).toBe(false);
    expect(status("2026-10-26T07:30:00Z")).toMatchObject({ open: true, until: "13:00" });
  });
});
