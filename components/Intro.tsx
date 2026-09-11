export default function Intro({ heading, body }: { heading: string; body: string }) {
  return (
    <section style={{ padding: "96px 16px 0", background: "var(--bg)" }}>
      <h2 style={{ margin: "0 auto 14px", maxWidth: "22ch", fontWeight: 400, fontSize: "clamp(28px,4.5vw,40px)", lineHeight: 1.15, color: "var(--ink)", textWrap: "balance" }}>{heading}</h2>
      <p style={{ maxWidth: "34ch", margin: "0 auto", fontStyle: "italic", fontSize: "clamp(18px,2.2vw,22px)", color: "var(--candle)", textWrap: "pretty" }}>{body}</p>
    </section>
  );
}
