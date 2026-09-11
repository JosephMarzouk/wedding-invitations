"use client";
import { useEffect, useRef, useState } from "react";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

const VINE =
  "M0 0 C 50 40, 110 40, 140 100 S 190 190, 250 230 M140 100 C 120 130, 90 140, 60 150 M140 100 C 170 90, 200 60, 240 60 M190 160 C 200 130, 230 120, 260 118 M0 0 C 20 60, 30 110, 20 160 M250 230 C 270 250, 280 275, 282 296";
const LEAVES = [
  "M40 28 q14 -12 26 2 q-14 12 -26 -2z", "M92 46 q14 -12 26 2 q-14 12 -26 -2z", "M118 82 q-6 -18 12 -22 q6 18 -12 22z",
  "M98 138 q14 -12 26 2 q-14 12 -26 -2z", "M70 150 q-16 8 -22 -6 q16 -8 22 6z", "M176 84 q14 -12 26 2 q-14 12 -26 -2z",
  "M212 62 q-6 -18 12 -22 q6 18 -12 22z", "M168 166 q14 -14 26 -2 q-14 12 -26 2z", "M226 128 q14 -12 26 2 q-14 12 -26 -2z",
  "M20 90 q-18 4 -16 -14 q18 -4 16 14z", "M30 140 q18 4 10 20 q-18 -4 -10 -20z", "M210 210 q14 -12 26 2 q-14 12 -26 -2z",
  "M262 258 q-18 4 -16 -14 q18 -4 16 14z",
];
const ROSE = "M0 0 c 5 -7 15 -5 13 4 c -2 8 -14 8 -15 -2 c -1 -12 16 -15 21 -3 c 5 12 -9 22 -20 15 c -11 -7 -8 -24 4 -28 c 14 -5 26 8 22 22";
const ROSE_SM = "M0 0 c 3 -4 9 -3 8 2 c -1 5 -8 5 -9 -1 c -1 -7 10 -9 13 -2 c 3 7 -5 13 -12 9 c -7 -4 -5 -14 2 -17 c 8 -3 16 5 13 13";

const vineBox: React.CSSProperties = { position: "absolute", width: "min(44vw,360px)", height: "min(44vw,360px)" };

type Props = { a: string; b: string; dateLine: string; kicker: string; image: string; overlay: string; scrollCue: string; rtl: boolean };

export default function Hero({ a, b, dateLine, kicker, image, overlay, scrollCue, rtl }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const announced = useRef(false);

  const announceOpen = () => {
    if (announced.current) return;
    announced.current = true;
    window.dispatchEvent(new Event("wedding:open"));
  };

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
  }, []);

  const openCard = () => {
    const el = ref.current;
    if (!el) return;
    announced.current = false;
    announceOpen();
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight, behavior: "smooth" });
  };

  const open = clamp(p / 0.85, 0, 1);
  const dir = rtl ? -1 : 1;
  const start = rtl ? "right" : "left";
  const end = rtl ? "left" : "right";
  const ornament = clamp((p - 0.55) / 0.35, 0, 1);
  const namesClip = Math.round(100 - clamp((p - 0.55) / 0.4, 0, 1) * 100);
  const nameStyle: React.CSSProperties = {
    fontFamily: "var(--font-script)", fontSize: "clamp(56px,12vw,128px)", lineHeight: 1.1, color: "var(--candle)",
    textShadow: "0 0 24px color-mix(in srgb, var(--candle) 45%, transparent), 0 0 60px color-mix(in srgb, var(--primary) 35%, transparent)", padding: "0 .25em",
  };

  return (
    <section ref={ref} style={{ position: "relative", height: "200vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* Names scene behind the doors */}
        <div style={{ position: "absolute", inset: 0, background: "var(--bg)" }}>
          <img src={image} alt="" aria-hidden style={{ position: "absolute", inset: "-6%", width: "112%", height: "112%", objectFit: "cover", filter: "blur(18px) saturate(.9)", transform: `scale(${(1.1 - 0.1 * p).toFixed(3)})`, transformOrigin: "center", willChange: "transform" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, color-mix(in srgb, var(--bg) 72%, transparent) 0%, color-mix(in srgb, var(--primary) 30%, color-mix(in srgb, var(--bg) 55%, transparent)) 45%, color-mix(in srgb, var(--bg) 90%, transparent) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 22%, color-mix(in srgb, var(--primary) 35%, transparent), transparent 18%), radial-gradient(circle at 84% 72%, color-mix(in srgb, var(--primary) 30%, transparent), transparent 16%), radial-gradient(circle at 70% 18%, color-mix(in srgb, var(--candle) 14%, transparent), transparent 12%)" }} />

          <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
            <defs>
              <symbol id="vine" viewBox="0 0 300 300">
                <g fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={VINE} />
                  <g fill="var(--accent)" fillOpacity=".3">{LEAVES.map((d) => <path key={d} d={d} />)}</g>
                  <g strokeWidth="1.2">
                    <path transform="translate(150 105)" d={ROSE} />
                    <path transform="translate(250 230) scale(.75)" d={ROSE} />
                    <path transform="translate(60 152) scale(.6)" d={ROSE} />
                    <path transform="translate(260 118) scale(.55)" d={ROSE} />
                  </g>
                </g>
              </symbol>
            </defs>
          </svg>
          <div aria-hidden style={{ position: "absolute", inset: 0, opacity: ornament, transition: "opacity .4s", pointerEvents: "none", filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 35%, transparent))" }}>
            <svg style={{ ...vineBox, left: "-2%", top: "-2%" }}><use href="#vine" /></svg>
            <svg style={{ ...vineBox, right: "-2%", top: "-2%", transform: "scaleX(-1)" }}><use href="#vine" /></svg>
            <svg style={{ ...vineBox, left: "-2%", bottom: "-2%", transform: "scaleY(-1)" }}><use href="#vine" /></svg>
            <svg style={{ ...vineBox, right: "-2%", bottom: "-2%", transform: "rotate(180deg)" }}><use href="#vine" /></svg>
          </div>

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
            <div className="w-kicker" style={{ marginBottom: "clamp(8px,2vh,22px)", opacity: ornament, transition: "opacity .4s" }}>{kicker}</div>
            <div style={{ clipPath: rtl ? `inset(0 0 0 ${namesClip}%)` : `inset(0 ${namesClip}% 0 0)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={nameStyle}>{a}</div>
              <div style={{ fontStyle: "italic", fontSize: "clamp(28px,4vw,44px)", color: "var(--accent)", lineHeight: 1, margin: "4px 0 8px" }}>&amp;</div>
              <div style={nameStyle}>{b}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "clamp(10px,2.5vh,28px)", color: "var(--soft)", fontSize: "clamp(14px,1.8vw,18px)", letterSpacing: ".3em", fontVariantNumeric: "oldstyle-nums", opacity: ornament, transition: "opacity .4s" }}>
              <svg width="26" height="26" viewBox="0 0 30 30" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round"><path transform="translate(9 12)" d={ROSE_SM} /></svg>
              <span>{dateLine}</span>
              <svg width="26" height="26" viewBox="0 0 30 30" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" style={{ transform: "scaleX(-1)" }}><path transform="translate(9 12)" d={ROSE_SM} /></svg>
            </div>
          </div>
        </div>

        {/* Full-screen doors */}
        <button
          type="button" aria-label="Open invitation" onClick={openCard}
          style={{ position: "absolute", inset: 0, display: "block", border: 0, padding: 0, margin: 0, background: "transparent", cursor: "pointer", perspective: 1600, transformStyle: "preserve-3d", opacity: 1 - clamp((p - 0.85) / 0.12, 0, 1), pointerEvents: p > 0.85 ? "none" : "auto" }}
        >
          {/* end panel (42%) */}
          <div style={{ position: "absolute", top: 0, bottom: 0, [end]: 0, width: "42%", background: `linear-gradient(to ${end}, color-mix(in srgb, var(--primary) 96%, white) 0%, var(--primary) 82%, color-mix(in srgb, var(--primary) 70%, black) 100%)`, transformOrigin: `${end} center`, transform: `rotateY(${(dir * open * 100).toFixed(2)}deg)`, backfaceVisibility: "hidden", boxShadow: `inset ${dir * 40}px 0 60px -30px rgba(0,0,0,.75)` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, marginTop: -6, background: "linear-gradient(90deg, color-mix(in srgb, var(--accent) 70%, black), var(--accent))", transform: `rotate(${-dir * 1.2}deg)`, transformOrigin: `${start} center` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1.5, marginTop: 6, background: "linear-gradient(90deg, color-mix(in srgb, var(--accent) 70%, black), var(--accent))", transform: `rotate(${dir * 1.4}deg)`, transformOrigin: `${start} center` }} />
          </div>
          {/* start panel (58%) with bouquet + seal */}
          <div style={{ position: "absolute", top: 0, bottom: 0, [start]: 0, width: "58%", background: `linear-gradient(to ${end}, color-mix(in srgb, var(--primary) 96%, white) 0%, var(--primary) 80%, color-mix(in srgb, var(--primary) 80%, black) 100%)`, transformOrigin: `${start} center`, transform: `rotateY(${(-dir * open * 100).toFixed(2)}deg)`, backfaceVisibility: "hidden", boxShadow: `${dir * 24}px 0 50px -10px rgba(0,0,0,.7)` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, marginTop: -6, background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 70%, black))", transform: `rotate(${dir * 1.2}deg)`, transformOrigin: `${end} center` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1.5, marginTop: 6, background: "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 70%, black))", transform: `rotate(${-dir * 1.4}deg)`, transformOrigin: `${end} center` }} />
            <svg viewBox="0 0 200 320" aria-hidden style={{ position: "absolute", left: "50%", top: "50%", width: "min(44vw,260px)", height: "auto", transform: "translate(-56%,-58%)" }} fill="none" stroke="color-mix(in srgb, var(--accent) 80%, white)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M100 300 C 96 250, 92 200, 96 150 M100 300 C 106 250, 112 200, 118 160 M100 300 C 94 260, 80 220, 70 190 M100 300 C 110 270, 130 240, 140 200" />
              <path d="M96 150 C 80 140, 76 120, 84 106 C 92 92, 108 96, 110 110 C 112 124, 100 134, 90 128 C 82 122, 86 108, 96 112 M84 106 C 74 96, 78 78, 92 74 C 104 70, 116 82, 112 96" />
              <path d="M118 160 C 110 150, 112 134, 124 130 C 136 126, 146 138, 140 150 C 134 162, 118 160, 118 148 M124 130 C 122 118, 132 108, 144 112 C 154 116, 156 130, 148 138" />
              <path d="M70 190 C 60 184, 60 172, 68 168 C 76 164, 84 172, 80 180 C 76 188, 66 186, 66 178" />
              <path d="M140 200 C 136 190, 142 180, 152 182 C 160 184, 162 196, 154 200 C 146 204, 138 198, 140 190" />
              <g fill="color-mix(in srgb, var(--accent) 80%, white)" fillOpacity=".18"><path d="M92 220 q-22 -6 -26 -28 q22 6 26 28z" /><path d="M108 240 q22 -8 30 -30 q-22 8 -30 30z" /><path d="M88 262 q-20 -2 -30 -18 q20 2 30 18z" /><path d="M112 200 q24 -4 34 -22 q-24 4 -34 22z" /><path d="M84 176 q-16 -14 -14 -30 q16 14 14 30z" /><path d="M124 176 q10 -18 28 -22 q-10 18 -28 22z" /><path d="M100 96 q-6 -18 4 -30 q6 18 -4 30z" /><path d="M148 152 q14 -8 26 0 q-14 8 -26 0z" /></g>
              <path d="M60 236 c -14 -6 -22 -22 -16 -36 M140 236 c 14 -6 22 -22 16 -36" />
            </svg>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: "clamp(120px,28vw,190px)", aspectRatio: "1", transform: "translate(-56%,-30%)" }}>
              <img src={overlay} alt="" aria-hidden style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 5px 8px rgba(0,0,0,.55))" }} />
              <div style={{ position: "absolute", inset: "6%", borderRadius: "50%", overflow: "hidden", pointerEvents: "none", mixBlendMode: "soft-light" }}>
                <div style={{ position: "absolute", top: "-20%", left: 0, width: "45%", height: "140%", background: "linear-gradient(90deg, rgba(255,245,220,0), rgba(255,245,220,.9), rgba(255,245,220,0))", animation: "sheen 4.5s ease-in-out infinite" }} />
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", top: 0, bottom: 0, [start]: "58%", width: "14%", transform: `translateX(${-dir * 50}%)`, background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,.55) 50%, rgba(0,0,0,0))", opacity: 1 - clamp(p / 0.2, 0, 1), pointerEvents: "none" }} />
        </button>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "var(--accent)", fontStyle: "italic", fontSize: 15, letterSpacing: ".04em", opacity: 1 - clamp(p / 0.15, 0, 1), pointerEvents: "none" }}>
          <span>{scrollCue}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "bob 1.8s ease-in-out infinite" }}><path d="m6 9 6 6 6-6" /></svg>
        </div>
      </div>
    </section>
  );
}
