"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Links (not buttons) so each language version is crawlable.
export function LanguageSwitch({ className = "lang" }: { className?: string }) {
  const t = useTranslations();
  const current = useLocale();
  const pathname = usePathname();

  return (
    <div className={className} role="group" aria-label={t("common.langLabel")}>
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          lang={locale}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          onClick={(e) => {
            // A locale change swaps <html lang dir>, which needs a full load anyway.
            // Doing it here keeps the current section (#hash).
            const hash = window.location.hash;
            if (!hash || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            window.location.assign(e.currentTarget.href + hash);
          }}
        >
          {/* Visible short code first, so the accessible name contains it (WCAG 2.5.3). */}
          {t(`langShort.${locale}`)}
          <span className="sr-only"> – {t(`lang.${locale}`)}</span>
        </Link>
      ))}
    </div>
  );
}
