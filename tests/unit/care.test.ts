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
    [18, ["checkupY", "chlamydia", "mmr", "td"]],
    [24, ["checkupY", "chlamydia", "cervix", "mmr", "td"]],
    [25, ["checkupY", "cervix", "mmr", "td"]],
    [34, ["breastExam", "cervix", "checkupY", "mmr", "td"]],
    [35, ["breastExam", "cervix", "checkup", "hep", "mmr", "skin", "td"]],
    [45, ["breastExam", "cervix", "checkup", "hep", "mmr", "prostate", "skin", "td"]],
    [50, ["bowel", "breast", "breastExam", "cervix", "checkup", "colon", "hep", "lung", "mmr", "prostate", "skin", "td"]],
    [65, ["aorta", "bowel", "breast", "breastExam", "cervix", "checkup", "colon", "flu", "hep", "lung", "pneumo", "prostate", "skin", "td", "zoster"]],
    [75, ["aorta", "bowel", "breast", "breastExam", "cervix", "checkup", "colon", "covid", "flu", "hep", "lung", "pneumo", "prostate", "rsv", "skin", "td", "zoster"]],
  ])("at %i returns the age-matched recommendations", (age, expected) => {
    expect(keys(age)).toEqual([...expected].sort());
  });

  it("ends the mammography and lung screening after 75", () => {
    expect(keys(76)).not.toContain("breast");
    expect(keys(76)).not.toContain("lung");
  });

  it("offers MMR up to the age of people born in 1971", () => {
    const last = new Date().getFullYear() - 1971;
    expect(keys(last)).toContain("mmr");
    expect(keys(last + 1)).not.toContain("mmr");
  });

  it("tags sex-specific recommendations", () => {
    const sex = Object.fromEntries(careRules.filter((r) => r.sex).map((r) => [r.key, r.sex]));
    expect(sex).toEqual({ aorta: "m", prostate: "m", cervix: "f", breast: "f", chlamydia: "f", breastExam: "f" });
  });

  it("keeps the order: check-ups first, then vaccinations", () => {
    const types = dueFor(75).map((r) => r.type);
    expect(types.indexOf("vacc")).toBeGreaterThan(types.lastIndexOf("exam"));
  });
});
