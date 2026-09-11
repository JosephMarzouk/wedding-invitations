"use client";
import { useState } from "react";
import { useOpening } from "./useOpening";
import { CornerVines, Ornaments } from "./ornaments";
import { WaxSeal } from "./Guestbook";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Gold vine line art on the two paper panels: it grows from the top-left corner of the left
// panel and the bottom-right corner of the right one.
const PANEL_VINES = {
  left: {
    path: "M0 0 C 30 50, 70 60, 80 110 S 110 170, 90 210 M0 0 C 40 10, 80 0, 110 40 M80 110 C 100 100, 120 110, 140 100 M90 210 C 70 220, 60 240, 40 250",
    leaves: ["M50 68 q-10 12 -22 2 q12 -10 22 -2z", "M68 88 q12 8 4 20 q-10 -8 -4 -20z", "M92 142 q-12 6 -18 -6 q12 -6 18 6z", "M102 180 q12 6 6 18 q-10 -6 -6 -18z", "M122 104 q8 12 -6 16 q-6 -12 6 -16z", "M62 230 q-12 6 -18 -6 q12 -6 18 6z", "M90 28 q8 12 -6 16 q-6 -12 6 -16z"],
    align: "xMinYMin", pos: { left: 0, top: 0 },
  },
  right: {
    path: "M200 300 C 170 250, 130 240, 120 190 S 90 130, 110 90 M200 300 C 160 290, 120 300, 90 260 M120 190 C 100 200, 80 190, 60 200 M110 90 C 130 80, 140 60, 160 50",
    leaves: ["M150 232 q10 -12 22 -2 q-12 10 -22 2z", "M132 212 q-12 -8 -4 -20 q10 8 4 20z", "M108 158 q12 -6 18 6 q-12 6 -18 -6z", "M98 120 q-12 -6 -6 -18 q10 6 6 18z", "M78 196 q-8 -12 6 -16 q6 12 -6 16z", "M138 70 q12 -6 18 6 q-12 6 -18 -6z", "M110 272 q-8 -12 6 -16 q6 12 -6 16z"],
    align: "xMaxYMax", pos: { right: 0, bottom: 0 },
  },
} as const;

function PanelVine({ side }: { side: "left" | "right" }) {
  const v = PANEL_VINES[side];
  return (
    <svg viewBox="0 0 200 300" preserveAspectRatio={`${v.align} meet`} aria-hidden style={{ position: "absolute", ...v.pos, width: "100%", height: "60%" }} fill="none" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round">
      <path d={v.path} />
      <g fill="var(--accent)" fillOpacity=".35">{v.leaves.map((d) => <path key={d} d={d} />)}</g>
    </svg>
  );
}

/** One half of the wax seal, clipped to its panel so it travels with the door and cracks apart
 *  (a few px and degrees) in the first moments of opening. Both halves carry the same sheen, in
 *  sync, so it reads as one candlelight sweep across the whole seal. */
function SealHalf({ side, crack }: { side: "left" | "right"; crack: number }) {
  const s = side === "right" ? 1 : -1;
  return (
    <div style={{ position: "absolute", [side === "right" ? "left" : "right"]: -48, top: "50%", width: 96, height: 96, marginTop: -48, clipPath: side === "right" ? "inset(0 0 0 50%)" : "inset(0 50% 0 0)", transform: `translateX(${(s * crack * 3).toFixed(2)}px) rotate(${(s * crack * 5).toFixed(2)}deg)` }}>
      <WaxSeal size="100%" stamp={false} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: 0, width: "45%", height: "140%", background: "linear-gradient(90deg, rgba(255,240,220,0), rgba(255,240,220,.45), rgba(255,240,220,0))", animation: "sheen 4.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

type Props = { a: string; b: string; image: string; hint: string; rtl: boolean };

/** Design 2 opener: a sealed cream card in a candlelit night. Scrolling (or a tap) cracks the
 *  seal, swings both panels open in 3D and scales the card up so the guest passes through it
 *  into the blurred ballroom, where the names write in. */
export default function Invitation({ a, b, image, hint, rtl }: Props) {
  const { ref, p: raw, openCard } = useOpening();
  // Read once at init: it only changes derived numbers after the first scroll, so hydration
  // (where p is 0 on both sides) is unaffected.
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // Reduced motion: no scrubbing — the card is closed, then it is open.
  const p = reduced ? (raw < 0.35 ? 0 : 1) : raw;

  const open = clamp(p / 0.85, 0, 1);
  const crack = clamp(p / 0.12, 0, 1);
  const ornament = clamp((p - 0.55) / 0.35, 0, 1);
  const namesClip = Math.round(100 - clamp((p - 0.55) / 0.4, 0, 1) * 100);
  const nameStyle: React.CSSProperties = {
    fontFamily: "var(--font-script)", fontSize: "clamp(56px,12vw,128px)", lineHeight: 1.1, color: "var(--candle)",
    textShadow: "0 0 24px color-mix(in srgb, var(--candle) 45%, transparent), 0 0 60px color-mix(in srgb, var(--seal) 35%, transparent)", padding: "0 .25em",
  };
  const paperEdge = "color-mix(in srgb, var(--paper) 90%, var(--accent))";

  return (
    <section ref={ref} style={{ position: "relative", height: "200vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* The ballroom and the names, revealed behind the doors */}
        <div style={{ position: "absolute", inset: 0, background: "var(--bg)" }}>
          <img src={image} alt="" aria-hidden style={{ position: "absolute", inset: "-6%", width: "112%", height: "112%", objectFit: "cover", filter: "blur(18px) saturate(.9)", transform: `scale(${(1.1 - 0.1 * p).toFixed(3)})`, transformOrigin: "center", willChange: "transform" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, color-mix(in srgb, var(--shade) 72%, transparent) 0%, color-mix(in srgb, color-mix(in srgb, var(--primary) 30%, var(--shade)) 55%, transparent) 45%, color-mix(in srgb, var(--shade) 90%, transparent) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, color-mix(in srgb, var(--seal) 35%, transparent), transparent 18%), radial-gradient(circle at 84% 72%, color-mix(in srgb, var(--seal) 30%, transparent), transparent 16%), radial-gradient(circle at 70% 18%, color-mix(in srgb, var(--paper) 14%, transparent), transparent 12%), radial-gradient(circle at 24% 80%, color-mix(in srgb, var(--paper) 10%, transparent), transparent 14%)" }} />

          <Ornaments />
          <CornerVines opacity={ornament} />

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
            <div style={{ clipPath: rtl ? `inset(0 0 0 ${namesClip}%)` : `inset(0 ${namesClip}% 0 0)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={nameStyle}>{a}</div>
              <div style={{ fontStyle: "italic", fontSize: "clamp(28px,4vw,44px)", color: "var(--accent)", lineHeight: 1, margin: "4px 0 8px" }}>&amp;</div>
              <div style={nameStyle}>{b}</div>
            </div>
          </div>
        </div>

        {/* Night with a breathing candle glow; fades away as the doors open */}
        <div style={{ position: "absolute", inset: 0, background: "var(--bg)", opacity: 1 - clamp((p - 0.05) / 0.5, 0, 1), pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: "50%", top: "50%", width: "min(120vw,900px)", height: "min(120vw,900px)", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, color-mix(in srgb, var(--candle) 22%, transparent) 0%, color-mix(in srgb, var(--seal) 12%, transparent) 35%, transparent 70%)", animation: "glow 6s ease-in-out infinite" }} />
        </div>

        {/* Hanging florals on the landing */}
        <div aria-hidden style={{ position: "absolute", inset: 0, opacity: 1 - clamp(p / 0.3, 0, 1), pointerEvents: "none", filter: "drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 30%, transparent))" }}>
          <svg style={{ position: "absolute", left: "2%", top: -8, width: "min(28vw,200px)", height: "min(46vw,330px)", animation: "sway 7s ease-in-out infinite", transformOrigin: "top center" }}><use href="#hang" /></svg>
          <svg style={{ position: "absolute", right: "2%", top: -8, width: "min(28vw,200px)", height: "min(46vw,330px)", transform: "scaleX(-1)", animation: "sway 8.5s ease-in-out -2s infinite reverse", transformOrigin: "top center" }}><use href="#hang" /></svg>
        </div>

        {/* The card */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, perspective: 1400, opacity: 1 - clamp((p - 0.8) / 0.15, 0, 1), pointerEvents: p > 0.9 ? "none" : "auto" }}>
          <button
            type="button" aria-label="Open invitation" onClick={openCard}
            style={{ position: "relative", display: "block", height: "min(72vh,740px)", aspectRatio: "9 / 16", maxWidth: "88vw", border: 0, padding: 0, background: "transparent", cursor: "pointer", transform: `scale(${(1 + open * 1.8).toFixed(3)})`, transformStyle: "preserve-3d", willChange: "transform" }}
          >
            {/* right panel */}
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "44%", background: `linear-gradient(90deg, ${paperEdge}, var(--paper) 40%, var(--paper))`, transformOrigin: "right center", transform: `rotateY(${(open * 112).toFixed(2)}deg)`, backfaceVisibility: "hidden", boxShadow: "inset 6px 0 14px -8px rgba(80,30,10,.35)" }}>
              <PanelVine side="right" />
              <SealHalf side="right" crack={crack} />
            </div>
            {/* left panel, overlapping the seam */}
            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "56.5%", background: `linear-gradient(270deg, ${paperEdge}, var(--paper) 30%, var(--paper))`, transformOrigin: "left center", transform: `rotateY(${(-open * 112).toFixed(2)}deg)`, backfaceVisibility: "hidden", boxShadow: "8px 0 18px -6px rgba(60,20,8,.45)" }}>
              <PanelVine side="left" />
              <SealHalf side="left" crack={crack} />
            </div>
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "var(--accent)", fontStyle: "italic", fontSize: 15, letterSpacing: ".04em", opacity: 1 - clamp(p / 0.15, 0, 1) }}>
            <span>{hint}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "bob 1.8s ease-in-out infinite" }}><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </div>
    </section>
  );
}
