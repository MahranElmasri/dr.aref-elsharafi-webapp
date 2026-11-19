import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Privacy } from "@/components/legal/Privacy";
import { LegalPage } from "@/components/legal/LegalPage";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/datenschutz">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacyTitle"), alternates: alternatesFor(locale as Locale, "/datenschutz") };
}

export default async function Page({ params }: PageProps<"/[locale]/datenschutz">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  return (
    <LegalPage title={t("privacyTitle")}>
      <Privacy />
    </LegalPage>
  );
}
