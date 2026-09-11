import { formatClock, type Strings, type WeddingConfig } from "@/lib/wedding";

type Ev = WeddingConfig["events"][number];

function VenueCard({ ev, image, locale, city, s }: { ev: Ev; image: string; locale: string; city: string; s: Strings }) {
  const ar = locale === "ar";
  const main = ar ? ev.titleAr ?? ev.title : ev.title;
  const secondary = ar ? (ev.titleAr ? ev.title : undefined) : ev.titleAr;
  return (
    <div style={{ width: "min(520px,100%)", margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ position: "relative", height: "min(78vh,620px)", borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 60px -20px color-mix(in srgb, var(--shade) 45%, transparent)" }}>
        <img src={image} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        {/* Dark fade (not the light page bg) so the text below stays readable over the photo. */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, color-mix(in srgb, var(--shade) 4%, transparent) 30%, color-mix(in srgb, var(--shade) 55%, transparent) 65%, color-mix(in srgb, var(--shade) 88%, transparent) 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 28px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, letterSpacing: ".32em", textTransform: "uppercase", color: "var(--accent)" }}>{ev.type}</div>
          <h2 style={{ margin: 0, fontWeight: 400, fontSize: "clamp(26px,4vw,34px)", lineHeight: 1.15, color: "var(--text-on-dark)", textWrap: "balance" }}>{main}</h2>
          {secondary && (
            <div lang={ar ? "en" : "ar"} dir={ar ? "ltr" : "rtl"} style={{ fontFamily: ar ? "var(--font-latin), serif" : "var(--font-arabic), serif", fontSize: "clamp(20px,3vw,26px)", lineHeight: 1.5, color: "var(--text-on-dark)" }}>{secondary}</div>
          )}
          <div style={{ marginTop: 6, fontSize: 18, color: "var(--text-on-dark)", opacity: .85, fontVariantNumeric: "oldstyle-nums" }}>
            {formatClock(ev.start, locale)} – {formatClock(ev.end, locale)}
          </div>
        </div>
      </div>
      <div className="w-glass" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18, background: "var(--bg-secondary)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, textAlign: "start" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 3 }}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: "var(--ink)", textWrap: "pretty" }}>{main}, {city}</p>
        </div>
        <a className="w-btn" href={ev.mapsUrl} target="_blank" rel="noopener noreferrer">
          {s.openMaps}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
        </a>
      </div>
    </div>
  );
}

type Props = { events: Ev[]; images: string[]; locale: string; city: string; strings: Strings };

export default function Events({ events, images, locale, city, strings }: Props) {
  if (!events.length) return null;
  return (
    <section style={{ position: "relative", padding: "40px 16px 110px", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", gap: 40 }}>
      {events.map((ev, i) => (
        <VenueCard key={ev.title + i} ev={ev} image={ev.image ?? images[i % images.length]} locale={locale} city={city} s={strings} />
      ))}
    </section>
  );
}
