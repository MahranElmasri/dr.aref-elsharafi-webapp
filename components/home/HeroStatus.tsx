"use client";

import { useLiveStatus } from "./useLiveStatus";

// First item of the hero info bar: live status, links to the weekly hours.
export function HeroStatus({ builtAt }: { builtAt: number }) {
  const s = useLiveStatus(builtAt);
  return (
    <a href="#heute">
      <span className={s.open ? "dot open" : "dot"} aria-hidden="true" />
      <span>
        <b>{s.headline}</b>
        <small>
          {s.open ? (
            <bdi dir="ltr">
              {s.today.map((x, i) => (
                <span key={x.from}>{i > 0 && ", "}<span className="nw">{x.from}–{x.to}</span></span>
              ))}
            </bdi>
          ) : (
            s.detail
          )}
        </small>
      </span>
    </a>
  );
}
