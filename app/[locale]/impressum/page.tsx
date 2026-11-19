import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Imprint } from "@/components/legal/Imprint";
import { LegalPage } from "@/components/legal/LegalPage";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/impressum">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("imprintTitle"), alternates: alternatesFor(locale as Locale, "/impressum") };
}

export default async function Page({ params }: PageProps<"/[locale]/impressum">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  return (
    <LegalPage title={t("imprintTitle")}>
      <Imprint />
    </LegalPage>
  );
}
