// Regular opening hours, Europe/Berlin local time. Weekday 1 = Monday … 7 = Sunday.
// Source: berlin-hausaerzte.de
export type Session = { from: string; to: string };
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type OpeningHours = Record<Weekday, Session[]>;

const fullDay: Session[] = [
  { from: "08:00", to: "13:00" },
  { from: "14:00", to: "17:00" },
];

export const openingHours: OpeningHours = {
  1: fullDay,
  2: fullDay,
  3: [{ from: "08:00", to: "14:00" }],
  4: fullDay,
  5: [{ from: "08:00", to: "13:00" }],
  6: [],
  7: [],
};

export const weekdays: Weekday[] = [1, 2, 3, 4, 5, 6, 7];
