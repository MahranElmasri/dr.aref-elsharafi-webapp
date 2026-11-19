import { getLocale, getTranslations } from "next-intl/server";
import { pick } from "@/content/localized";
import { steps } from "@/content/steps";
import type { Locale } from "@/i18n/routing";

export async function Steps() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("steps");
  return (
    <section className="block tight" id="ablauf" aria-labelledby="steps-h">
      <div className="wrap">
        <div className="section-head minor">
          <h2 id="steps-h">{t("title")}</h2>
          <p>{t("intro")}</p>
        </div>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title.de}>
              <span className="num" aria-hidden="true">{i + 1}</span>
              <h3>{pick(s.title, locale)}</h3>
              <p>{pick(s.text, locale)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
