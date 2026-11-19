import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { alternatesFor, localeUrl } from "@/lib/seo";

const pages = ["/", "/impressum", "/datenschutz"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      alternates: { languages: alternatesFor(locale, path).languages },
    })),
  );
}
