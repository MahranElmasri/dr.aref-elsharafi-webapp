import { getLocale, getTranslations } from "next-intl/server";
import { firstVisit } from "@/content/firstVisit";
import { pick } from "@/content/localized";
import { practice } from "@/content/practice";
import type { Locale } from "@/i18n/routing";
import { ConsentMap } from "./ConsentMap";

// Internal reminder for the practice; never shown on the production site.
const showTodo = process.env.VERCEL_ENV !== "production";

const Tick = () => (
  <span className="tick" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>
  </span>
);

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export async function Visit() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("visit");
  const newTab = (await getTranslations("footer"))("newTab");
  return (
    <section className="block tight" id="kontakt" aria-labelledby="visit-h">
      <div className="wrap">
        <div className="section-head minor">
          <h2 id="visit-h">{t("title")}</h2>
        </div>
        <div className="visit">
          <div className="card">
            <h3>{t("addressTitle")}</h3>
            <address>
              <bdi>{practice.street}</bdi><br /><bdi>{practice.postalCode} {practice.city}</bdi>
            </address>
            <ul className="contact-list">
              <li>{t("phone")}: <a className="ltr" href={`tel:${practice.phone.tel}`}>{practice.phone.display}</a></li>
              <li>{t("email")}: <a className="ltr" href={`mailto:${practice.email}`}>{practice.email}</a></li>
            </ul>
            <ConsentMap
              embedUrl={practice.googleMapsEmbedUrl} placeUrl={practice.googleMapsUrl} title={t("mapTitle")}
              consent={t("mapConsent")} load={t("mapLoad")} open={t("mapOpen")} newTab={newTab}
            />
            <h4 className="transit-h">{t("transitTitle")}</h4>
            <ul className="transit">
              <li>
                <span className="line u6" role="img" aria-label={t("lineU6")}>U6</span>
                <span><b>{t("stopSee")}</b><small>{t("walk1")}</small></span>
              </li>
              <li>
                <span className="line tram"><svg {...svg}><rect x="5" y="4" width="14" height="13" rx="3" /><path d="M5 11h14M9 21l-1.5-4M15 21l1.5-4M9 2h6" /></svg></span>
                <span><b>{t("tramLines")}</b><small>{t("tramStop")}</small></span>
              </li>
              <li>
                <span className="line walk"><svg {...svg}><circle cx="13" cy="4" r="2" /><path d="m9 21 2-6 3 3v3M7 12l2-4 4-1 3 4 3 1M11 15l-1-4" /></svg></span>
                <span><b>{t("stepFree")}</b><small>{t("stepFreeHint")}</small></span>
              </li>
            </ul>
            {showTodo && <p className="todo">{t("transitTodo")}</p>}
          </div>
          <div className="card">
            <h3>{t("firstTitle")}</h3>
            <ul className="check">
              {firstVisit.map((x) => <li key={x.de}><Tick /><span>{pick(x, locale)}</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
