import { openingHours as schema, type Weekday } from "./schema";

export type { OpeningHours, Session, Weekday } from "./schema";

// Regular opening hours, Berlin local time. 1 = Monday … 7 = Sunday.
// Source: berlin-hausaerzte.de
const fullDay = [
  { from: "08:00", to: "13:00" },
  { from: "14:00", to: "17:00" },
];

export const openingHours = schema.parse({
  1: fullDay,
  2: fullDay,
  3: [{ from: "08:00", to: "14:00" }],
  4: fullDay,
  5: [{ from: "08:00", to: "13:00" }],
  6: [],
  7: [],
});

export const weekdays: Weekday[] = [1, 2, 3, 4, 5, 6, 7];
