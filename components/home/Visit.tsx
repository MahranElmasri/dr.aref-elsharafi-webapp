import { getLocale, getTranslations } from "next-intl/server";
import { firstVisit } from "@/content/firstVisit";
import { pick } from "@/content/localized";
import { practice } from "@/content/practice";
import type { Locale } from "@/i18n/routing";
import { ConsentMap } from "./ConsentMap";
import { ContactForm } from "./ContactForm";

const Tick = () => (
  <span className="tick" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path d="M20 6 9 17l-5-5" /></svg>
  </span>
);

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export async function Visit() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("visit");
  const c = await getTranslations("contact");
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
          </div>
          <div className="card">
            <h3>{t("firstTitle")}</h3>
            <ul className="check">
              {firstVisit.map((x) => <li key={x.de}><Tick /><span>{pick(x, locale)}</span></li>)}
            </ul>
          </div>
        </div>
        <div className="card contact-card" id="schreiben">
          <div className="contact-intro">
            <h3 id="cf-h">{c("title")}</h3>
            <p>{c("intro")}</p>
            <ul className="cf-notes">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
                <span>{c("urgent")}</span> <a className="ltr" href={`tel:${practice.phone.tel}`}>{practice.phone.display}</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>{c("noHealth")}</span>
              </li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
