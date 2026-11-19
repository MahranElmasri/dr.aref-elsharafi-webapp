"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { practice } from "@/content/practice";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { LanguageSwitch } from "./LanguageSwitch";
import { navItems } from "./navItems";

export function Header() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Highlight the nav link of the section in view.
  useEffect(() => {
    const targets = navItems
      .map((i) => document.getElementById(i.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((el) => spy.observe(el));
    return () => spy.disconnect();
  }, []);

  return (
    <header className="site">
      <div className="wrap">
        <div className="navbar">
          <Link className="brand" href="/">
            <span className="brand-text">
              <b>{t("brand.name")}</b>
              <span>{t("brand.sub")}</span>
            </span>
          </Link>
          <nav className={open ? "main open" : "main"} id="mainnav" aria-label={t("nav.label")}>
            <ul onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={`/${item.href}`} aria-current={active === item.href ? "true" : undefined}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitch className="lang lang-in-menu" />
          </nav>
          <LanguageSwitch className="lang lang-bar" />
          <a className="btn btn-outline btn-icon nav-call" href={`tel:${practice.phone.tel}`}>
            <PhoneIcon />
            <span className="sr-only">{t("nav.call")}</span>
          </a>
          <a className="btn btn-primary bar-book" href={practice.doctolibUrl} target="_blank" rel="noopener">
            {t("nav.book")}
            <span className="sr-only"> {t("footer.newTab")}</span>
          </a>
          <button
            ref={toggleRef}
            className="btn btn-outline btn-icon menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mainnav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{t("nav.menu")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
