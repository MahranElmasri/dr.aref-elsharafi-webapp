import { getLocale, getTranslations } from "next-intl/server";
import { pick } from "@/content/localized";
import { practice } from "@/content/practice";
import { reviews } from "@/content/reviews";
import type { Locale } from "@/i18n/routing";
import { ReviewSlider } from "./ReviewSlider";

// Invented placeholder reviews never reach the production site.
const showSamples = process.env.VERCEL_ENV !== "production";

const initials = (name: string) =>
  name.replace(/\b(und|and)\b|و /g, " ").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const Star = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" /></svg>
);

export async function Reviews() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("reviews");
  const newTab = (await getTranslations("footer"))("newTab");
  const visible = reviews.filter((r) => showSamples || !("sample" in r));
  // No approved reviews yet: keep only the Google links, no quotes and no "in their words" intro.
  const hasReviews = visible.length > 0;

  return (
    <section className="block" id="stimmen" aria-labelledby="rev-h">
      <div className="wrap">
        <div className="section-head minor">
          <h2 id="rev-h">{t(hasReviews ? "title" : "titleEmpty")}</h2>
          {hasReviews && <p>{t("intro")}</p>}
        </div>
        {hasReviews && <ReviewSlider
          labels={{
            carousel: t("carousel"), prev: t("prev"), next: t("next"),
            goto: visible.map((_, i) => t("goto", { n: i + 1, total: visible.length })),
          }}
        >
          {visible.map((r, i) => {
            const author = pick(r.author, locale);
            return (
              <li className="review" key={i} aria-roledescription="slide" aria-label={t("slide", { n: i + 1, total: visible.length })}>
                <figure>
                  <div className="rev-top">
                    <span className="stars" role="img" aria-label={t("stars", { rating: r.rating, max: 5 })}>
                      {Array.from({ length: r.rating }, (_, k) => <Star key={k} />)}
                    </span>
                    <svg className="qmark" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M13 8C7.5 9.6 4 13.8 4 19.5 4 23.4 6.3 26 9.6 26c2.8 0 4.9-2.1 4.9-4.8 0-2.6-1.9-4.5-4.4-4.7.6-2.6 2.6-4.6 5.4-5.6zm15 0c-5.5 1.6-9 5.8-9 11.5 0 3.9 2.3 6.5 5.6 6.5 2.8 0 4.9-2.1 4.9-4.8 0-2.6-1.9-4.5-4.4-4.7.6-2.6 2.6-4.6 5.4-5.6z" /></svg>
                  </div>
                  <blockquote><p>{pick(r.quote, locale)}</p></blockquote>
                  <figcaption>
                    <span className={`avatar av${i % 5}`} aria-hidden="true">{initials(author)}</span>
                    <span className="who"><b><bdi>{author}</bdi></b><small>{pick(r.meta, locale)}</small></span>
                    <span className="rtag">{pick(r.tag, locale)}</span>
                  </figcaption>
                </figure>
                {"sample" in r && (
                  <p className="sample" title={t("sampleNote")}>
                    <span>{t("sample")}</span><span className="sr-only">: {t("sampleNote")}</span>
                  </p>
                )}
              </li>
            );
          })}
        </ReviewSlider>}
        <div className="rev-foot">
          <p>{t("footText")}</p>
          <div className="rev-actions">
            <a className="btn btn-primary" href={practice.googleMapsUrl} target="_blank" rel="noopener">
              {t("write")}<span className="sr-only"> {newTab}</span>
            </a>
            <a className="btn btn-outline" href={practice.googleMapsUrl} target="_blank" rel="noopener">
              {t("read")}<span className="sr-only"> {newTab}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
