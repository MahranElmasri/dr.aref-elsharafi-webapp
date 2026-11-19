import type { Closure, Notice } from "@/content/schema";

/** Notice-bar entries for a Berlin calendar date ("2026-12-24"). */
export type NoticeItem = { key: string; title: Notice["title"] | null; message: Notice["message"]; from?: string; to?: string };

export function noticeItems(notice: Notice | null, closures: readonly Closure[]): NoticeItem[] {
  const items: NoticeItem[] = closures.map((c) => ({
    key: `closure-${c.from}`, title: null, message: c.message, from: c.from, to: c.to,
  }));
  if (notice) items.unshift({ key: "notice", title: notice.title, message: notice.message, from: notice.from, to: notice.to });
  return items;
}

export const activeOn = (date: string) => (item: { from?: string; to?: string }) =>
  (!item.from || item.from <= date) && (!item.to || date <= item.to);
