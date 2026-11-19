"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Labels = { carousel: string; prev: string; next: string; goto: string[] };

// Scroll-snap slider: buttons, dots, swipe and arrow keys. Never moves on its own.
export function ReviewSlider({ labels, children }: { labels: Labels; children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const [perView, setPerView] = useState(1);
  const n = labels.goto.length;

  const slides = () => Array.from(track.current?.children ?? []) as HTMLElement[];
  const isRtl = () => document.documentElement.dir === "rtl";

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const tr = el.getBoundingClientRect();
    const rtl = document.documentElement.dir === "rtl";
    let best = 0, bestD = Infinity;
    (Array.from(el.children) as HTMLElement[]).forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(rtl ? tr.right - r.right : r.left - tr.left);
      if (d < bestD) { bestD = d; best = i; }
    });
    const w = (el.children[0] as HTMLElement | undefined)?.getBoundingClientRect().width || 1;
    setCurrent(best);
    setPerView(Math.max(1, Math.round(el.clientWidth / w)));
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(sync, 80); };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync);
    document.fonts?.ready.then(sync);
    sync();
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("resize", sync); clearTimeout(timer); };
  }, [sync]);

  const go = (i: number) => {
    const el = track.current, target = slides()[Math.max(0, Math.min(n - 1, i))];
    if (!el || !target) return;
    const tr = el.getBoundingClientRect(), r = target.getBoundingClientRect();
    const left = isRtl() ? r.right - tr.right : r.left - tr.left;
    // Already there: a zero-length scroll can make the browser re-snap to another slide.
    if (Math.abs(left) < 1) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left, behavior: reduce ? "auto" : "smooth" });
  };

  const onKey = (e: KeyboardEvent) => {
    const step = isRtl() ? -1 : 1;
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + step); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(current - step); }
  };

  return (
    <div className="rev-carousel" role="region" aria-roledescription="carousel" aria-label={labels.carousel}>
      <ul className="reviews" ref={track} tabIndex={0} onKeyDown={onKey}>{children}</ul>
      <div className="rev-controls">
        <div className="rev-dots">
          {labels.goto.map((label, i) => (
            <button
              key={i} type="button" className="dot-btn" aria-label={label}
              hidden={i > n - perView} aria-current={i === current ? "true" : "false"} onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="rev-arrows">
          <button className="btn btn-outline btn-icon rev-prev" type="button" aria-label={labels.prev} disabled={current <= 0} onClick={() => go(current - 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button className="btn btn-outline btn-icon rev-next" type="button" aria-label={labels.next} disabled={current >= n - perView} onClick={() => go(current + 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
