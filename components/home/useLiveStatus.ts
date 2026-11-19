"use client";

import { useTranslations } from "next-intl";
import { closures } from "@/content/closures";
import { openingHours } from "@/content/hours";
import { getStatus, type Status } from "@/lib/hours";
import { useNowMinute } from "@/lib/useBerlinNow";

export type LiveStatus = Status & { headline: string; detail: string };

/** Current open/closed status with localized text. Re-evaluates every minute. */
export function useLiveStatus(builtAt: number): LiveStatus {
  const t = useTranslations();
  const now = useNowMinute(builtAt);
  const s = getStatus(new Date(now), openingHours, closures);

  if (s.open) return { ...s, headline: t("status.openUntil", { time: s.until! }), detail: "" };

  let detail = "";
  if (s.next) {
    const { offset, day, time } = { ...s.next, time: s.next.at };
    if (s.lunch) detail = t("status.lunch", { time });
    else {
      const days = t.raw("days") as string[];
      const dayWord = offset === 0 ? t("status.today") : offset === 1 ? t("status.tomorrow") : days[day - 1];
      detail = t("status.reopens", { day: dayWord, time });
    }
  }
  return { ...s, headline: t("status.closedNow"), detail };
}
