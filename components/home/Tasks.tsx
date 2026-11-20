import { getLocale, getTranslations } from "next-intl/server";
import { pick } from "@/content/localized";
import { practice } from "@/content/practice";
import { tasks } from "@/content/tasks";
import { PhoneIcon } from "@/components/icons";
import type { Locale } from "@/i18n/routing";
import { SectionIcon } from "./SectionIcon";

export async function Tasks() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  return (
    <section className="block tight" id="anliegen" aria-labelledby="tasks-h">
      <div className="wrap">
        <div className="section-head minor">
          <h2 id="tasks-h">{t("tasks.title")}</h2>
        </div>
        <ul className="tasks">
          {tasks.map((task) => (
            <li className="card task" key={task.icon}>
              <SectionIcon name={task.icon} />
              <h3>{pick(task.title, locale)}</h3>
              <p className="task-lede">{pick(task.lede, locale)}</p>
              <ul className="task-points">
                {task.points.map((point) => (
                  <li key={point.de}>{pick(point, locale)}</li>
                ))}
              </ul>
              {task.action === "book" ? (
                <a className="btn btn-primary" href={practice.doctolibUrl} target="_blank" rel="noopener">
                  {t("tasks.book")}
                  <span className="sr-only"> {t("footer.newTab")}</span>
                </a>
              ) : (
                <a className="btn btn-outline" href={`tel:${practice.phone.tel}`}>
                  <PhoneIcon />
                  <span>{t("nav.call")}</span> <span className="ltr">{practice.phone.display}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
