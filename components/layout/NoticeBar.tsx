import { getLocale, getTranslations } from "next-intl/server";
import { notice } from "@/content/notice";
import { pick } from "@/content/localized";
import type { Locale } from "@/i18n/routing";

export async function NoticeBar() {
  if (!notice) return null;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("notice");
  return (
    <div className="notice" role="region" aria-label={t("label")}>
      <div className="wrap">
        <strong>{pick(notice.title, locale)}</strong>
        <span>{pick(notice.message, locale)}</span>
      </div>
    </div>
  );
}
