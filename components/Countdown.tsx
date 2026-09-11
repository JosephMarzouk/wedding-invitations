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
    <section style={{ position: "relative", padding: "110px 16px 120px", overflow: "hidden", background: "var(--bg)" }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 className="w-h2">{s.countdownTitle}</h2>

        <div style={{ width: "min(470px,100%)", borderRadius: 28, overflow: "hidden", border: "1px solid var(--hairline)", boxShadow: "0 30px 60px -20px color-mix(in srgb, var(--ink) 35%, transparent)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "20px 56px", background: "var(--ink)", color: "var(--text-on-dark)" }}>
            <span style={{ textAlign: "start", fontSize: 13, letterSpacing: ".3em" }}>{ev.year}</span>
            <span style={{ fontSize: "clamp(20px,3vw,27px)", fontWeight: 600, letterSpacing: ".14em", color: "var(--accent)", textTransform: "uppercase" }}>{ev.month}</span>
            <span style={{ textAlign: "end", fontSize: 13, letterSpacing: ".3em", textTransform: "uppercase" }}>{ev.wdShort}</span>
          </div>
          <div style={{ padding: "36px 24px 30px", background: "var(--bg)", color: "var(--ink)" }}>
            <div style={{ fontSize: "clamp(96px,16vw,124px)", fontWeight: 400, lineHeight: 1, letterSpacing: "-.02em", fontVariantNumeric: "oldstyle-nums" }}>{ev.day}</div>
            <div style={{ width: 64, height: 1, background: "color-mix(in srgb, var(--ink) 25%, transparent)", margin: "26px auto 18px" }} />
            <div style={{ fontSize: 19, letterSpacing: ".32em", textTransform: "uppercase" }}>{ev.weekday}</div>
            <div style={{ fontSize: 28, marginTop: 10, fontVariantNumeric: "oldstyle-nums" }}>{ev.time}</div>
          </div>
        </div>

        {children && <div style={{ marginTop: 30 }}>{children}</div>}

        <div className="w-glass" style={{ width: "min(800px,100%)", marginTop: 30, padding: "28px 24px" }}>
          <div className="w-kicker" style={{ marginBottom: 26, fontSize: "clamp(20px,2.6vw,26px)", letterSpacing: ".24em" }}>{past ? s.justMarried : s.countdown}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "clamp(8px,2vw,18px)" }}>
            {units.map(([label, n]) => {
              const str = val(n);
              return (
                <div key={label} style={{ padding: "clamp(22px,4vw,38px) 4px clamp(18px,3vw,26px)", borderRadius: 18, border: "1px solid var(--glass-border)", background: "var(--bg-secondary)", color: "var(--ink)" }}>
                  <div aria-label={str} style={{ display: "flex", justifyContent: "center", fontSize: "clamp(30px,5vw,44px)", lineHeight: 1, height: "1em", overflow: "hidden", fontVariantNumeric: "oldstyle-nums", direction: "ltr" }}>
                    {n === null ? <span aria-hidden>--</span> : str.split("").map((d, i) => <Digit key={i} d={d} />)}
                  </div>
                  <div style={{ marginTop: 14, fontSize: 11, letterSpacing: ".3em", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
