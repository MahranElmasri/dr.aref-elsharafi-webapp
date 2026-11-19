// Vorsorge-Finder rules: statutory (GKV) check-ups and STIKO vaccination recommendations
// for adults, as of 2025. Medical content: changes need practice sign-off.
// Texts live in messages/*.json under care.items.<key>.

export type CareRule = {
  key: CareKey;
  type: "exam" | "vacc";
  /** First age the recommendation applies */
  min: number;
  /** Last age it applies (inclusive), if it ends */
  max?: number;
  /** Only for women ("f") or men ("m"); shown as a tag, not filtered */
  sex?: "f" | "m";
  /** "p" = at our practice, "s" = at a specialist practice */
  where: "p" | "s";
};

export type CareKey =
  | "checkupY" | "checkup" | "hep" | "skin" | "bowel" | "colon" | "aorta" | "cervix" | "breast" | "prostate"
  | "td" | "flu" | "covid" | "pneumo" | "zoster" | "rsv";

export const careRules: readonly CareRule[] = [
  { key: "checkupY", type: "exam", min: 18, max: 34, where: "p" },
  { key: "checkup", type: "exam", min: 35, where: "p" },
  { key: "hep", type: "exam", min: 35, where: "p" },
  { key: "skin", type: "exam", min: 35, where: "p" },
  { key: "bowel", type: "exam", min: 50, where: "p" },
  { key: "colon", type: "exam", min: 50, where: "s" },
  { key: "aorta", type: "exam", min: 65, sex: "m", where: "p" },
  { key: "cervix", type: "exam", min: 20, sex: "f", where: "s" },
  { key: "breast", type: "exam", min: 50, max: 75, sex: "f", where: "s" },
  { key: "prostate", type: "exam", min: 45, sex: "m", where: "s" },
  { key: "td", type: "vacc", min: 18, where: "p" },
  { key: "flu", type: "vacc", min: 60, where: "p" },
  { key: "covid", type: "vacc", min: 60, where: "p" },
  { key: "pneumo", type: "vacc", min: 60, where: "p" },
  { key: "zoster", type: "vacc", min: 60, where: "p" },
  { key: "rsv", type: "vacc", min: 75, where: "p" },
];

export const MIN_AGE = 18;
export const MAX_AGE = 110;

/** Whole-number age in range, or null. */
export function parseAge(value: string): number | null {
  const v = value.trim();
  if (!/^\d{1,3}$/.test(v)) return null;
  const age = Number(v);
  return age >= MIN_AGE && age <= MAX_AGE ? age : null;
}

/** Recommendations for an age, check-ups before vaccinations. */
export function dueFor(age: number): CareRule[] {
  return careRules.filter((r) => age >= r.min && (r.max === undefined || age <= r.max));
}
