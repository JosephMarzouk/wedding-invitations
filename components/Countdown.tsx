"use client";
import { useEffect, useState, type ReactNode } from "react";
import { eventParts, type Strings } from "@/lib/wedding";

function Digit({ d }: { d: string }) {
  return (
    <div aria-hidden style={{ height: "1em", transform: `translateY(-${d}em)`, transition: "transform .55s cubic-bezier(.2,.8,.2,1)" }}>
      {"0123456789".split("").map((n) => <div key={n} style={{ height: "1em" }}>{n}</div>)}
    </div>
  );
}

type Props = { iso: string; locale: string; strings: Strings; children?: ReactNode };

export default function Countdown({ iso, locale, strings: s, children }: Props) {
  const [now, setNow] = useState<number | null>(null); // null until mounted: avoids hydration mismatch
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => { cancelAnimationFrame(raf); clearInterval(id); };
  }, []);

  const ev = eventParts(iso, locale);
  const diff = now === null ? null : Math.max(0, ev.target - now);
  const past = now !== null && ev.target - now <= 0;
  const val = (n: number | null) => (n === null ? "--" : String(n).padStart(2, "0"));
  const units = [
    [s.days, diff === null ? null : Math.floor(diff / 86400000)],
    [s.hrs, diff === null ? null : Math.floor(diff / 3600000) % 24],
    [s.min, diff === null ? null : Math.floor(diff / 60000) % 60],
    [s.sec, diff === null ? null : Math.floor(diff / 1000) % 60],
  ] as const;

  return (
    <section style={{ position: "relative", padding: "110px 16px 120px", overflow: "hidden", background: "linear-gradient(180deg, var(--bg), color-mix(in srgb, var(--primary) 18%, var(--bg)) 50%, var(--bg))" }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 className="w-h2">{s.countdownTitle}</h2>

        <div style={{ width: "min(470px,100%)", borderRadius: 28, overflow: "hidden", border: "1px solid rgba(255,255,255,.28)", boxShadow: "0 30px 60px -20px rgba(0,0,0,.6)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "20px 56px", background: "#0B0A0A", color: "#E4CFA4" }}>
            <span style={{ textAlign: "start", fontSize: 13, letterSpacing: ".3em" }}>{ev.year}</span>
            <span style={{ fontSize: "clamp(20px,3vw,27px)", fontWeight: 600, letterSpacing: ".14em", color: "#F7E4CC", textTransform: "uppercase" }}>{ev.month}</span>
            <span style={{ textAlign: "end", fontSize: 13, letterSpacing: ".3em", textTransform: "uppercase" }}>{ev.wdShort}</span>
          </div>
          <div style={{ padding: "36px 24px 30px", background: "rgba(255,255,255,.55)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", color: "#111" }}>
            <div style={{ fontSize: "clamp(96px,16vw,124px)", fontWeight: 400, lineHeight: 1, letterSpacing: "-.02em", fontVariantNumeric: "oldstyle-nums" }}>{ev.day}</div>
            <div style={{ width: 64, height: 1, background: "#4a4644", margin: "26px auto 18px" }} />
            <div style={{ fontSize: 19, letterSpacing: ".32em", textTransform: "uppercase" }}>{ev.weekday}</div>
            <div style={{ fontSize: 28, marginTop: 10, fontVariantNumeric: "oldstyle-nums" }}>{ev.time}</div>
          </div>
        </div>

        {children && <div style={{ marginTop: 30 }}>{children}</div>}

        <div className="w-glass" style={{ width: "min(800px,100%)", marginTop: 30, padding: "28px 24px" }}>
          <div className="w-kicker" style={{ marginBottom: 26, fontSize: "clamp(20px,2.6vw,26px)", letterSpacing: ".24em", color: "var(--soft)" }}>{past ? s.justMarried : s.countdown}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "clamp(8px,2vw,18px)" }}>
            {units.map(([label, n]) => {
              const str = val(n);
              return (
                <div key={label} style={{ padding: "clamp(22px,4vw,38px) 4px clamp(18px,3vw,26px)", borderRadius: 18, border: "1px solid rgba(255,255,255,.22)", background: "rgba(255,255,255,.28)", color: "#161414" }}>
                  <div aria-label={str} style={{ display: "flex", justifyContent: "center", fontSize: "clamp(30px,5vw,44px)", lineHeight: 1, height: "1em", overflow: "hidden", fontVariantNumeric: "oldstyle-nums", direction: "ltr" }}>
                    {n === null ? <span aria-hidden>--</span> : str.split("").map((d, i) => <Digit key={i} d={d} />)}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "#2a2626" }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
