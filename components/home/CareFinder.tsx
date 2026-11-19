"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { practice } from "@/content/practice";
import { dueFor, MAX_AGE, MIN_AGE, parseAge, type CareRule } from "@/lib/care";

// Runs entirely in the browser: the age is never stored or sent.
export function CareFinder() {
  const t = useTranslations("care");
  const newTab = useTranslations("footer")("newTab");
  const [value, setValue] = useState("45");
  const [shown, setShown] = useState(45);
  const age = parseAge(value);
  // Keep the last valid result visible while the visitor is still typing.
  if (age !== null && age !== shown) setShown(age);
  const due = dueFor(shown);

  const item = (r: CareRule) => (
    <li key={r.key}>
      <b>{t(`items.${r.key}.title`)}</b>
      <p>{t(`items.${r.key}.detail`)}</p>
      <span className="tags">
        {r.where === "p" ? <span className="tag here">{t("atPractice")}</span> : <span className="tag">{t("atSpecialist")}</span>}
        {r.sex && <span className="tag">{r.sex === "f" ? t("forWomen") : t("forMen")}</span>}
      </span>
    </li>
  );

  return (
    <section className="block tight" id="vorsorge" aria-labelledby="care-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="care-h">{t("title")}</h2>
          <p>{t("intro")}</p>
        </div>
        <div className="care">
          <div className="care-form">
            <label htmlFor="age">{t("ageLabel")}</label>
            <div className="age-field">
              <input
                id="age" type="number" inputMode="numeric" min={MIN_AGE} max={MAX_AGE} step={1}
                value={value} onChange={(e) => setValue(e.target.value)}
                aria-invalid={age === null} aria-describedby="age-err care-note"
              />
              <span>{t("ageUnit")}</span>
            </div>
            <p className="field-error" id="age-err" hidden={age !== null}>{t("ageError")}</p>
            <p className="care-count" aria-live="polite">{t("count", { age: shown, count: due.length })}</p>
            <p className="care-note" id="care-note">{t("note")}</p>
            <a className="btn btn-outline" href={practice.doctolibUrl} target="_blank" rel="noopener">
              {t("book")}<span className="sr-only"> {newTab}</span>
            </a>
          </div>
          <div className="care-lists">
            <div><h3>{t("exams")}</h3><ul className="care-list">{due.filter((r) => r.type === "exam").map(item)}</ul></div>
            <div><h3>{t("vacc")}</h3><ul className="care-list">{due.filter((r) => r.type === "vacc").map(item)}</ul></div>
          </div>
        </div>
      </div>
    </section>
  );
}
