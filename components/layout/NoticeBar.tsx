import { getLocale, getTranslations } from "next-intl/server";
import { closures } from "@/content/closures";
import { pick } from "@/content/localized";
import { notice } from "@/content/notice";
import type { Locale } from "@/i18n/routing";
import { BUILT_AT } from "@/lib/buildTime";
import { noticeItems } from "@/lib/notices";
import { NoticeBarClient } from "./NoticeBarClient";

// Pages are static, so the date filter also runs in the browser: a closure added
// ahead of time appears and disappears on its own dates without a new deploy.
export async function NoticeBar() {
  const items = noticeItems(notice, closures);
  if (!items.length) return null;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("notice");
  return (
    <NoticeBarClient
      label={t("label")}
      builtAt={BUILT_AT}
      items={items.map((i) => ({
        key: i.key, from: i.from, to: i.to,
        title: i.title ? pick(i.title, locale) : t("closedTitle"),
        message: pick(i.message, locale),
      }))}
    />
  );
}
