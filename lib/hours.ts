import type { Closure, OpeningHours, Session, Weekday } from "@/content/schema";

// The only place in the app that knows about time. Everything is computed in
// Europe/Berlin regardless of the server's or visitor's own timezone.

export type { Closure };

export type Status = {
  /** Berlin weekday, 1 = Monday … 7 = Sunday */
  day: Weekday;
  open: boolean;
  /** End of the current session, when open ("13:00") */
  until?: string;
  /** Closed now but another session follows later today */
  lunch: boolean;
  /** Next opening, when closed. offset = calendar days from today */
  next?: { offset: number; day: Weekday; at: string };
  /** Sessions that apply today (empty on closed days and during a closure) */
  today: Session[];
  /** The closure covering today, if any */
  closure?: Closure;
};

const TZ = "Europe/Berlin";
const SEARCH_DAYS = 60;

const berlinFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Berlin calendar date ("2026-11-23") and wall-clock time ("09:05") for an instant. */
export function berlinParts(now: Date): { date: string; time: string } {
  const p = Object.fromEntries(berlinFormat.formatToParts(now).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

// Calendar arithmetic on plain dates (UTC noon avoids any DST edge).
const toUtc = (date: string) => new Date(`${date}T12:00:00Z`);
const addDays = (date: string, n: number) => {
  const d = toUtc(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const weekdayOf = (date: string) => (((toUtc(date).getUTCDay() + 6) % 7) + 1) as Weekday;

const closureOn = (date: string, closures: readonly Closure[]) =>
  closures.find((c) => c.from <= date && date <= c.to);

export function getStatus(now: Date, hours: OpeningHours, closures: readonly Closure[] = []): Status {
  const { date, time } = berlinParts(now);
  const day = weekdayOf(date);
  const closure = closureOn(date, closures);
  const today = closure ? [] : hours[day];

  // Times are zero-padded "HH:MM", so string comparison is chronological.
  const current = today.find((s) => s.from <= time && time < s.to);
  if (current) return { day, open: true, until: current.to, lunch: false, today, closure };

  const laterToday = today.find((s) => s.from > time);
  if (laterToday) {
    const lunch = today.some((s) => s.to <= time);
    return { day, open: false, lunch, next: { offset: 0, day, at: laterToday.from }, today, closure };
  }

  for (let offset = 1; offset <= SEARCH_DAYS; offset++) {
    const d = addDays(date, offset);
    if (closureOn(d, closures)) continue;
    const wd = weekdayOf(d);
    const first = hours[wd][0];
    if (first) return { day, open: false, lunch: false, next: { offset, day: wd, at: first.from }, today, closure };
  }
  return { day, open: false, lunch: false, today, closure };
}
