"use client";

import { useSyncExternalStore } from "react";

// Current time for static pages. During hydration React uses the server snapshot
// (the build time), so markup matches; then it switches to the real clock and
// re-renders once a minute.
const MINUTE = 60_000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, MINUTE);
  return () => clearInterval(id);
}

// Snapshot must be stable between minute ticks, so round down to the minute.
const minuteNow = () => Math.floor(Date.now() / MINUTE) * MINUTE;

/** Epoch ms of the current minute; `serverNow` (epoch ms) during SSR and hydration. */
export function useNowMinute(serverNow: number): number {
  return useSyncExternalStore(subscribe, minuteNow, () => serverNow);
}
