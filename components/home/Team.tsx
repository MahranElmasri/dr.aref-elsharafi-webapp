import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { doctors } from "@/content/doctors";
import { pick } from "@/content/localized";
import type { Locale } from "@/i18n/routing";
import aref from "@/public/assets/dr.aref.jpg";
import nahas from "@/public/assets/dr.nahas.jpg";
import zoghbi from "@/public/assets/dr.zoghbi.jpg";
import koeniger from "@/public/assets/dr.koeniger.jpg";

const portraits = { aref, nahas, zoghbi, koeniger };

export async function Team() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("team");
  return (
    <section className="block tight" id="team" aria-labelledby="team-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="team-h">{t("title")}</h2>
          <p>{t("intro")}</p>
        </div>
        <ul className="team">
          {doctors.map((d, i) => {
            const labelId = `focus-${d.portrait}`;
            return (
              <li className="doc" key={d.name}>
                <div className="portrait">
                  <Image src={portraits[d.portrait]} alt={t("portraitOf", { name: d.name })} sizes="168px" placeholder="blur" />
                </div>
                <div className="body">
                  <h3 lang="de" dir="ltr">{d.name}</h3>
                  <p className="role">{pick(d.role, locale)}</p>
                  <p className="focus-label" id={labelId}>{t("focusLabel")}</p>
                  <ul className="focus" aria-labelledby={labelId}>
                    {d.focus.map((f) => <li key={`${i}-${f.de}`}>{pick(f, locale)}</li>)}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
