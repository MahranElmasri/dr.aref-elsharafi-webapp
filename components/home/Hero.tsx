import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { practice } from "@/content/practice";
import { AlertLineIcon, CalendarIcon, ChatIcon, PhoneIcon, PinIcon, ShieldIcon } from "@/components/icons";
import hero from "@/public/assets/hero.jpg";
import aref from "@/public/assets/dr.aref.jpg";
import nahas from "@/public/assets/dr.nahas.jpg";
import zoghbi from "@/public/assets/dr.zoghbi.jpg";
import koeniger from "@/public/assets/dr.koeniger.jpg";
import { HeroStatus } from "./HeroStatus";

const faces = [aref, nahas, zoghbi, koeniger];

// Focus areas under the booking buttons. Stroke icons, 24×24, decorative.
const focus = [
  { key: "general", d: ["M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1", "M8 15a6 6 0 0 0 12 0v-3"], circle: true },
  { key: "internal", d: ["M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z", "M3.2 12h6.3l.5-1 2 4.5 2-7 1.5 3.5h5.3"] },
  { key: "prevention", d: ["M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z", "M9 12h6M12 9v6"] },
  { key: "diagnostics", d: ["M22 12h-4l-3 9L9 3l-3 9H2"] },
] as const;

export async function Hero({ builtAt }: { builtAt: number }) {
  const t = await getTranslations("hero");
  const newTab = (await getTranslations("footer"))("newTab");

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-stage">
          <Image
            className="hero-img"
            src={hero}
            alt={t("alt")}
            priority
            quality={85}
            sizes="(min-width: 1280px) 1136px, (min-width: 768px) calc(100vw - 64px), calc(100vw - 32px)"
            placeholder="blur"
          />
          <div className="hero-panel">
            <h1>{t.rich("title", { l: (c) => <span className="hero-line">{c}</span>, sub: (c) => <span className="hero-sub">{c}</span> })}</h1>
            <p className="lede">{t.rich("lede", { bdi: (c) => <bdi>{c}</bdi> })}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={practice.doctolibUrl} target="_blank" rel="noopener">
                <CalendarIcon />
                <span>{t("book")}</span>
                <span className="sr-only"> {newTab}</span>
              </a>
              <a className="btn btn-outline" href={`tel:${practice.phone.tel}`}>
                <PhoneIcon />
                <span className="ltr">{practice.phone.display}</span>
              </a>
            </div>
            {/* <p className="hero-note">{t("bookNote")}</p> */}
            <ul className="hero-focus" aria-label={t("focus.label")}>
              {focus.map((f) => (
                <li key={f.key}>
                  <span className="hf-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {f.d.map((d) => <path key={d} d={d} />)}
                      {"circle" in f && <circle cx="20" cy="10" r="2" />}
                    </svg>
                  </span>
                  <span>{t(`focus.${f.key}`)}</span>
                </li>
              ))}
            </ul>
            <a className="hero-team" href="#team">
              <span className="faces" aria-hidden="true">
                {faces.map((f) => (
                  <Image key={f.src} src={f} alt="" width={40} height={40} sizes="40px" />
                ))}
              </span>
              <span>{t("team")}</span>
            </a>
          </div>
        </div>
        <ul className="hero-info">
          <li className="hi-status"><HeroStatus builtAt={builtAt} /></li>
          <li><ShieldIcon /><span><b>{t("insurance")}</b><small>{t("insuranceHint")}</small></span></li>
          <li><PinIcon /><span><b><bdi>{practice.street}</bdi></b><small>{t("access")}</small><small>{t.rich("transit", { ubahn: (c) => <span className="chip ubahn">{c}</span>, tram: (c) => <span className="chip tram">{c}</span>, nw: (c) => <span className="nowrap">{c}</span> })}</small></span></li>
          <li><ChatIcon /><span><b>{t("languages")}</b><small>{t("languagesHint")}</small></span></li>
          <li className="hi-em">
            <AlertLineIcon />
            <span>
              <b>{t("emAfter")}</b>
              <small>
                <a href="tel:116117"><bdi dir="ltr">116 117</bdi></a>
                <span>{t("listSep")}</span>
                <span>{t("emLife")}</span> <a href="tel:112"><bdi dir="ltr">112</bdi></a>
              </small>
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
