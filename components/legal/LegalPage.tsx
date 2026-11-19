import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";

// Legal texts are German only (the binding version); other locales get a short note.
export async function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  const locale = await getLocale();
  const t = await getTranslations("legal");
  return (
    <main id="inhalt">
      <section className="block">
        <div className="wrap legal-page">
          <h1>{title}</h1>
          {locale !== "de" && <p className="legal-note">{t("germanOnly")}</p>}
          <p className="todo" role="note">{t("draft")}</p>
          <div lang="de" dir="ltr" className="legal-body">{children}</div>
        </div>
      </section>
    </main>
  );
}

/** Part the practice still has to supply; highlighted so it cannot be missed. */
export const Fill = ({ children }: { children: ReactNode }) => <mark className="fill">[{children}]</mark>;
