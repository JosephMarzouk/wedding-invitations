"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Custom-duration smooth scroll (rather than the browser's native "smooth", whose speed can't be
// set) so the tap-to-open pace is deliberately controllable — 1300ms, ~500ms slower than a typical
// default smooth scroll of this distance.
const OPEN_DURATION_MS = 1300;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** The scroll-scrubbed opener both hero designs share: `p` is 0..1 progress through the tall
 *  sticky section (`ref`), `openCard` scrolls to the end of it, and "wedding:open" fires the
 *  first time the card opens either way (Music listens for it). */
export function useOpening() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const announced = useRef(false);

  const announceOpen = useCallback(() => {
    if (announced.current) return;
    announced.current = true;
    window.dispatchEvent(new Event("wedding:open"));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const max = el.offsetHeight - window.innerHeight;
      const np = clamp(max > 0 ? (window.scrollY - el.offsetTop) / max : 1, 0, 1);
      setP(np);
      if (np > 0.4) announceOpen();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [announceOpen]);

  const openCard = () => {
    const el = ref.current;
    if (!el) return;
    announced.current = false;
    announceOpen();
    const target = el.offsetTop + el.offsetHeight - window.innerHeight;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, target);
      return;
    }
    const startY = window.scrollY;
    const diff = target - startY;
    const startTime = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / OPEN_DURATION_MS);
      // behavior: "instant" — the page sets CSS scroll-behavior: smooth globally, which would
      // otherwise turn every one of these per-frame calls into its own competing native scroll.
      window.scrollTo({ top: startY + diff * easeInOutCubic(t), behavior: "instant" });
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return { ref, p, openCard };
}
