import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { dirFor, routing } from "@/i18n/routing";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NoticeBar } from "@/components/layout/NoticeBar";
import { alternatesFor, localeUrl, SITE_URL } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

// Namespaces read by "use client" components (Header, LanguageSwitch, live status, CareFinder).
const CLIENT_NAMESPACES = ["common", "lang", "langShort", "brand", "nav", "footer", "status", "days", "care", "contact"] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ogLocale = { de: "de_DE", en: "en_GB", ar: "ar" } as const;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s – ${t("siteName")}` },
    description: t("description"),
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: ogLocale[locale],
      url: localeUrl(locale, "/"),
      images: [{ url: "/assets/hero.jpg", width: 1672, height: 941 }],
    },
    // Preview deployments stay out of search results.
    robots: process.env.VERCEL_ENV === "production" ? undefined : { index: false, follow: false },
  };
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
