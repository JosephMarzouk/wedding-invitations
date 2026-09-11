"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Wraps a section so it rises into place the first time it scrolls into view.
 *  Wraps children rather than being built into each section, so server components
 *  (Intro, Events, SaveTheDate) don't need to become client components for this. */
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(32px)",
        transition: "opacity .8s ease, transform .8s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {children}
    </div>
  );
}
