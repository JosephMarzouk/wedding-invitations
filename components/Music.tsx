"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = { src: string; autoplayOnTap: boolean; playLabel: string; pauseLabel: string; rtl: boolean };

export default function Music({ src, autoplayOnTap, playLabel, pauseLabel, rtl }: Props) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const userStopped = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(!autoplayOnTap);

  const start = useCallback(() => {
    if (userStopped.current) return;
    if (!audio.current) {
      const el = new Audio(src);
      el.loop = true;
      el.volume = 0.6;
      // Keep the button in sync with playback state from any cause (tab hidden, OS media key, etc.).
      el.onplay = () => setPlaying(true);
      el.onpause = () => setPlaying(false);
      audio.current = el;
    }
    audio.current.play().catch(() => {}).finally(() => setShown(true));
  }, [src]);

  // Hero fires "wedding:open" when the guest taps the card or scrolls it open.
  useEffect(() => {
    if (!autoplayOnTap) return;
    window.addEventListener("wedding:open", start);
    return () => window.removeEventListener("wedding:open", start);
  }, [autoplayOnTap, start]);

  // Never keep playing once the guest leaves the tab or closes/navigates away.
  useEffect(() => {
    const pause = () => audio.current?.pause();
    const onVisibility = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", pause);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", pause);
      pause();
    };
  }, []);

  const toggle = () => {
    if (playing) { userStopped.current = true; audio.current?.pause(); setPlaying(false); }
    else { userStopped.current = false; start(); }
  };

  return (
    <button
      type="button" onClick={toggle} aria-label={playing ? pauseLabel : playLabel} aria-pressed={playing}
      style={{ position: "fixed", [rtl ? "left" : "right"]: 18, bottom: 18, zIndex: 50, width: 54, height: 54, borderRadius: "50%", border: "1px solid var(--hairline)", background: "color-mix(in srgb, var(--bg) 55%, transparent)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 12px 30px -10px rgba(0,0,0,.7)", opacity: shown ? 1 : 0, pointerEvents: shown ? "auto" : "none", transition: "opacity .5s, background .2s" }}
    >
      <span aria-hidden style={{ position: "absolute", inset: -1, borderRadius: "50%", border: "1px solid var(--hairline)", animation: playing ? "ring 2.4s ease-out infinite" : "none" }} />
      {playing ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" /></svg>
      )}
    </button>
  );
}
