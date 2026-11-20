import { getLocale, getTranslations } from "next-intl/server";
import { faq } from "@/content/faq";
import { pick } from "@/content/localized";
import type { Locale } from "@/i18n/routing";

// Native <details>: keyboard-operable (Enter/Space) and works without JavaScript.
export async function Faq() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("faq");
  return (
    <section className="block" id="fragen" aria-labelledby="faq-h">
      <div className="wrap">
        <div className="section-head minor">
          <h2 id="faq-h">{t("title")}</h2>
        </div>
        <div className="faq">
          {faq.map((f) => (
            <details key={f.q.de}>
              <summary>
                <h3>{pick(f.q, locale)}</h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <p>{pick(f.a, locale)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
