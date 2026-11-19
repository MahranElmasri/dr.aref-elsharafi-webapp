import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { practice } from "@/content/practice";
import { AlertLineIcon, CalendarIcon, ChatIcon, PhoneIcon, PinIcon, ShieldIcon } from "@/components/icons";
import hero from "@/public/assets/hero2.jpg";
import aref from "@/public/assets/dr.aref.jpg";
import nahas from "@/public/assets/dr.nahas.jpg";
import zoghbi from "@/public/assets/dr.zoghbi.jpg";
import koeniger from "@/public/assets/dr.koeniger.jpg";
import { HeroStatus } from "./HeroStatus";

const faces = [aref, nahas, zoghbi, koeniger];

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
            sizes="(min-width: 1280px) 1136px, calc(100vw - 32px)"
            placeholder="blur"
          />
          <div className="hero-panel">
            <h1>{t("title")}</h1>
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
            <p className="hero-note">{t("bookNote")}</p>
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
          <li><PinIcon /><span><b><bdi>{practice.street}</bdi></b><small>{t("access")}</small></span></li>
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
