import localFont from "next/font/local";

// Self-hosted (GDPR): no request to Google Fonts. Files from Fontsource, OFL licences in ./fonts/licenses.
export const sourceSerif = localFont({
  src: "./fonts/source-serif-4-latin.woff2",
  weight: "200 900",
  variable: "--font-source-serif",
  display: "swap",
});

export const dmSans = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  weight: "100 1000",
  variable: "--font-dm-sans",
  display: "swap",
});

// Arabic faces only carry Arabic glyphs; Latin falls through to the families above.
// Not preloaded, so German and English pages never fetch them unless Arabic text appears.
export const notoNaskh = localFont({
  src: "./fonts/noto-naskh-arabic.woff2",
  weight: "400 700",
  variable: "--font-noto-naskh",
  display: "swap",
  preload: false,
});

export const plexArabic = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-arabic-400.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-sans-arabic-500.woff2", weight: "500" },
  ],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

export const fontVariables = [sourceSerif, dmSans, notoNaskh, plexArabic]
  .map((f) => f.variable)
  .join(" ");
