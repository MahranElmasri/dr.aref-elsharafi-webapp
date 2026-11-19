import { describe, expect, it } from "vitest";
import { careRules, dueFor, parseAge } from "@/lib/care";

const keys = (age: number) => dueFor(age).map((r) => r.key).sort();

describe("parseAge", () => {
  it("accepts whole ages from 18 to 110", () => {
    expect(parseAge("18")).toBe(18);
    expect(parseAge(" 45 ")).toBe(45);
    expect(parseAge("110")).toBe(110);
  });
  it("rejects empty, out-of-range and non-integer input", () => {
    for (const v of ["", "17", "111", "45.5", "abc", "-3", "4e1"]) expect(parseAge(v)).toBeNull();
  });
});

describe("dueFor", () => {
  it.each([
    [18, ["checkupY", "td"]],
    [34, ["cervix", "checkupY", "td"]],
    [35, ["cervix", "checkup", "hep", "skin", "td"]],
    [45, ["cervix", "checkup", "hep", "prostate", "skin", "td"]],
    [50, ["bowel", "breast", "cervix", "checkup", "colon", "hep", "prostate", "skin", "td"]],
    [55, ["bowel", "breast", "cervix", "checkup", "colon", "hep", "prostate", "skin", "td"]],
    [65, ["aorta", "bowel", "breast", "cervix", "checkup", "colon", "covid", "flu", "hep", "pneumo", "prostate", "skin", "td", "zoster"]],
    [75, ["aorta", "bowel", "breast", "cervix", "checkup", "colon", "covid", "flu", "hep", "pneumo", "prostate", "rsv", "skin", "td", "zoster"]],
  ])("at %i returns the age-matched recommendations", (age, expected) => {
    expect(keys(age)).toEqual([...expected].sort());
  });

  it("ends the mammography screening after 75", () => {
    expect(keys(76)).not.toContain("breast");
  });

  it("tags sex-specific recommendations", () => {
    const sex = Object.fromEntries(careRules.filter((r) => r.sex).map((r) => [r.key, r.sex]));
    expect(sex).toEqual({ aorta: "m", prostate: "m", cervix: "f", breast: "f" });
  });

  it("keeps the order: check-ups first, then vaccinations", () => {
    const types = dueFor(75).map((r) => r.type);
    expect(types.indexOf("vacc")).toBeGreaterThan(types.lastIndexOf("exam"));
  });
});
