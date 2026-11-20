import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { openingHours, weekdays } from "@/content/hours";
import { practice } from "@/content/practice";
import { AlertIcon, CrossMark } from "@/components/icons";
import { navItems } from "./navItems";

export async function Footer() {
  const t = await getTranslations();
  const days = t.raw("days") as string[];

  return (
    <footer className="site">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <p className="foot-name">
             
              <span>{t("brand.name")}</span>
            </p>
            <address>
              <bdi>{practice.street}, {practice.postalCode} {practice.city}</bdi>
            </address>
            <ul className="foot-contact">
              <li><a className="ltr" href={`tel:${practice.phone.tel}`}>{practice.phone.display}</a></li>
              <li><a href={`mailto:${practice.email}`}>{practice.email}</a></li>
            </ul>
            <a className="btn foot-book" href={practice.doctolibUrl} target="_blank" rel="noopener">
              {t("nav.book")}
              <span className="sr-only"> {t("footer.newTab")}</span>
            </a>
          </div>
          <div>
            <h2>{t("footer.pages")}</h2>
            <ul className="foot-links">
              {navItems.map((item) => (
                <li key={item.href}><Link href={`/${item.href}`}>{t(`nav.${item.key}`)}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t("status.title")}</h2>
            <ul className="foot-hours">
              {weekdays.map((d) => {
                const sessions = openingHours[d];
                return (
                  <li key={d}>
                    <span>{days[d - 1]}</span>
                    {sessions.length ? (
                      <span className="ltr">
                        {sessions.map((s, i) => (
                          <span key={s.from}>
                            {i > 0 && ", "}
                            <span className="nw">{s.from}–{s.to}</span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="closed">{t("status.closed")}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="foot-em" role="group" aria-labelledby="foot-em-h">
          <p className="foot-em-title" id="foot-em-h"><AlertIcon /><span>{t("footer.emTitle")}</span></p>
          <p><a href="tel:112"><bdi dir="ltr">112</bdi></a> <span>{t("footer.em112")}</span></p>
          <p><a href="tel:116117"><bdi dir="ltr">116 117</bdi></a> <span>{t("footer.em116")}</span></p>
          <p><a href="tel:+493019240"><bdi dir="ltr">030 19240</bdi></a> <span>{t("footer.em19240")}</span></p>
        </div>
        <div className="legal">
          <bdi>© {new Date().getFullYear()} {practice.name}</bdi>
          <Link href="/impressum">{t("footer.imprint")}</Link>
          <Link href="/datenschutz">{t("footer.privacy")}</Link>
        </div>
      </div>
    </footer>
  );
}
