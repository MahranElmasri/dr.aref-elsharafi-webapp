import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { dirFor, routing } from "@/i18n/routing";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NoticeBar } from "@/components/layout/NoticeBar";
import { fontVariables } from "../fonts";
import "../globals.css";

// Namespaces read by "use client" components (Header, LanguageSwitch, live status, CareFinder).
const CLIENT_NAMESPACES = ["common", "lang", "langShort", "brand", "nav", "footer", "status", "days", "care", "contact"] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");
  // Client components only receive the namespaces they use.
  const all = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, all[ns]]));

  return (
    <html lang={locale} dir={dirFor(locale)} className={fontVariables}>
      <body>
        <a className="skip" href="#inhalt">{t("skip")}</a>
        <NextIntlClientProvider messages={clientMessages}>
          <NoticeBar />
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
