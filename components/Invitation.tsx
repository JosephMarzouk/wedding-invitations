"use client";
import { useState } from "react";
import { nameSweep, useOpening } from "./useOpening";
import { CornerVines, Ornaments } from "./ornaments";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Static design-2 artwork (cut from the reference card): the seal photo and the vine line art
// as alpha masks, so the vines take the couple's accent color.
const ART = "/design2";
const SEAM = "53.5%"; // the fold sits slightly right of centre, like the reference stationery

/** Gold vine line art laid over a paper panel: an alpha mask tinted with the accent color,
 *  anchored to the panel's outer corner so it hugs the edge at any viewport size. */
function PanelVines({ side }: { side: "left" | "right" }) {
  const url = `url(${ART}/vine-${side}.png)`;
  const pos = side === "left" ? "left top" : "right bottom";
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, background: "var(--accent)", opacity: 0.92, WebkitMaskImage: url, maskImage: url, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: pos, maskPosition: pos }} />
  );
}

/** One half of the wax seal, clipped to its panel so it travels with the door and cracks apart
 *  (a few px and degrees) in the first moments of opening. */
function SealHalf({ side, src, crack }: { side: "left" | "right"; src: string; crack: number }) {
  const s = side === "right" ? 1 : -1;
  return (
    <div style={{ position: "absolute", [side === "right" ? "left" : "right"]: "calc(var(--seal-size) / -2)", top: "50%", width: "var(--seal-size)", height: "var(--seal-size)", marginTop: "calc(var(--seal-size) / -2)", clipPath: side === "right" ? "inset(0 0 0 50%)" : "inset(0 50% 0 0)", transform: `translateX(${(s * crack * 3).toFixed(2)}px) rotate(${(s * crack * 5).toFixed(2)}deg)`, filter: "drop-shadow(0 6px 10px rgba(60,10,10,.35))" }}>
      <img src={src} alt="" aria-hidden draggable={false} style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

type Props = { a: string; b: string; image: string; seal?: string; hint: string; rtl: boolean };

/** Design 2 opener: the sealed cream card fills the screen. Scrolling (or a tap) cracks the seal
 *  and swings both panels open in 3D onto the blurred ballroom, where the names write in. */
export default function Invitation({ a, b, image, seal = `${ART}/seal.png`, hint, rtl }: Props) {
  const { ref, p: raw, openCard } = useOpening();
  // Read once at init: it only changes derived numbers after the first scroll, so hydration
  // (where p is 0 on both sides) is unaffected.
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // Reduced motion: no scrubbing — the card is closed, then it is open.
  const p = reduced ? (raw < 0.35 ? 0 : 1) : raw;

  const open = clamp(p / 0.85, 0, 1);
  const crack = clamp(p / 0.12, 0, 1);
  const ornament = clamp((p - 0.55) / 0.35, 0, 1);
  const nameMask = nameSweep(p, rtl);
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
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, color-mix(in srgb, var(--seal) 35%, transparent), transparent 18%), radial-gradient(circle at 84% 72%, color-mix(in srgb, var(--seal) 30%, transparent), transparent 16%)" }} />

          <Ornaments />
          <CornerVines opacity={ornament} />

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
            {/* padding leaves the glow inside the mask box, so the sweep never shows a straight edge */}
            <div style={{ WebkitMaskImage: nameMask, maskImage: nameMask, padding: 72, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={nameStyle}>{a}</div>
              <div style={{ fontStyle: "italic", fontSize: "clamp(28px,4vw,44px)", color: "var(--accent)", lineHeight: 1, margin: "4px 0 8px" }}>&amp;</div>
              <div style={nameStyle}>{b}</div>
            </div>
          </div>
        </div>

        {/* The card: two full-height paper panels meeting on the fold, doors that swing open in 3D */}
        <button
          type="button" aria-label="Open invitation" onClick={openCard}
          style={{ "--seal-size": "clamp(150px, 42vw, 300px)", position: "absolute", inset: 0, display: "block", border: 0, padding: 0, margin: 0, background: "transparent", cursor: "pointer", perspective: "max(1400px, 110vw)", transformStyle: "preserve-3d", transform: `scale(${(1 + open * 0.12).toFixed(3)})`, opacity: 1 - clamp((p - 0.8) / 0.15, 0, 1), pointerEvents: p > 0.9 ? "none" : "auto", willChange: "transform, opacity" } as React.CSSProperties}
        >
          {/* right panel */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: SEAM, right: 0, overflow: "hidden", background: `linear-gradient(90deg, ${paperEdge}, var(--paper) 12%, var(--paper))`, transformOrigin: "right center", transform: `rotateY(${(open * 100).toFixed(2)}deg)`, backfaceVisibility: "hidden", boxShadow: "inset 10px 0 18px -10px rgba(80,30,10,.35)" }}>
            <PanelVines side="right" />
            <SealHalf side="right" src={seal} crack={crack} />
          </div>
          {/* left panel: its right edge is the fold, shadowed onto the right panel */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: SEAM, overflow: "hidden", background: `linear-gradient(270deg, ${paperEdge}, var(--paper) 8%, var(--paper))`, transformOrigin: "left center", transform: `rotateY(${(-open * 100).toFixed(2)}deg)`, backfaceVisibility: "hidden", boxShadow: "10px 0 22px -8px rgba(60,20,8,.45)" }}>
            <PanelVines side="left" />
            <SealHalf side="left" src={seal} crack={crack} />
          </div>
        </button>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "var(--primary)", fontStyle: "italic", fontSize: 15, letterSpacing: ".04em", opacity: 1 - clamp(p / 0.15, 0, 1), pointerEvents: "none" }}>
          <span>{hint}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "bob 1.8s ease-in-out infinite" }}><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>
    </section>
  );
}
