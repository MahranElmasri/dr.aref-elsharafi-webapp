"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { openingHours, weekdays } from "@/content/hours";
import { useLiveStatus } from "./useLiveStatus";

export function WeekStrip({ builtAt }: { builtAt: number }) {
  const t = useTranslations();
  const s = useLiveStatus(builtAt);
  const days = t.raw("days") as string[];

  return (
    <section id="heute" aria-labelledby="today-h">
      <div className="wrap">
        <div className="today">
          <div className="today-head">
            <h2 id="today-h">{t("status.title")}</h2>
            <p className="status" aria-live="polite">
              <span className={s.open ? "dot open" : "dot"} aria-hidden="true" />
              {/* Headline only: the reopening detail sits in the hero info bar right above. */}
              <span className="status-text">{s.headline}</span>
            </p>
          </div>
          <ol className="week">
            {weekdays.map((d) => {
              const sessions = openingHours[d];
              const isToday = d === s.day;
              return (
                <li key={d} className={isToday ? "is-today" : undefined} aria-current={isToday ? "date" : undefined}>
                  <span>
                    {days[d - 1]}
                    {/* aria-current already announces today; the tag is the visible cue. */}
                    {isToday && <span className="today-tag" aria-hidden="true">{t("status.today")}</span>}
                  </span>
                  {sessions.length ? (
                    <span className="ltr">
                      {sessions.map((x, i) => (
                        <Fragment key={x.from}>
                          {i > 0 && <span className="sr-only">, </span>}
                          <span className="nw">{x.from}–{x.to}</span>
                        </Fragment>
                      ))}
                    </span>
                  ) : (
                    <span className="closed">{t("status.closed")}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
