"use client";

import { berlinParts } from "@/lib/hours";
import { activeOn } from "@/lib/notices";
import { useNowMinute } from "@/lib/useBerlinNow";

type Item = { key: string; title: string; message: string; from?: string; to?: string };

export function NoticeBarClient({ label, builtAt, items }: { label: string; builtAt: number; items: Item[] }) {
  const date = berlinParts(new Date(useNowMinute(builtAt))).date;
  const active = items.filter(activeOn(date));
  if (!active.length) return null;
  return (
    <div className="notice" role="region" aria-label={label}>
      {active.map((i) => (
        <div className="wrap" key={i.key}>
          <strong>{i.title}</strong>
          <span>{i.message}</span>
        </div>
      ))}
    </div>
  );
}
