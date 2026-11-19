import { getLocale, getTranslations } from "next-intl/server";
import { pick } from "@/content/localized";
import { services } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { SectionIcon } from "./SectionIcon";

export async function Services() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("services");
  return (
    <section className="block" id="leistungen" aria-labelledby="services-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="services-h">{t("title")}</h2>
          <p>{t("intro")}</p>
        </div>
        <ul className="cards">
          {services.map((s, i) => (
            <li className={i === 0 ? "card lead" : "card"} key={s.icon}>
              <SectionIcon name={s.icon} />
              <h3>{pick(s.title, locale)}</h3>
              <p>{pick(s.summary, locale)}</p>
              <ul className="incl">
                {s.items.map((item) => <li key={item.de}>{pick(item, locale)}</li>)}
              </ul>
              {s.linksToCareFinder && <a className="more" href="#vorsorge">{t("careLink")}</a>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
