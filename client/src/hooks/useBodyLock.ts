/**
 * Locks page scroll while an overlay is open. A counter keeps nested overlays
 * from unlocking early, and the previous inline value is restored on release.
 */
import { useEffect } from "react";

let locks = 0;
let previousOverflow = "";
let previousPadding = "";

function lock() {
  if (locks === 0) {
    const body = document.body;
    previousOverflow = body.style.overflow;
    previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    // compensate for the vanishing scrollbar so the layout does not jump
    if (gap > 0) body.style.paddingRight = `${gap}px`;
  }
  locks += 1;
}

function unlock() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPadding;
  }
}

export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}

/** Escape-to-dismiss for any overlay. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onEscape]);
}
