export default function ClosingNote({ text }: { text: string }) {
  return (
    <section style={{ padding: "120px 24px 150px", textAlign: "center", background: "var(--bg)" }}>
      <div style={{ width: 60, height: 1, background: "var(--hairline)", margin: "0 auto 28px" }} />
      <p style={{ margin: 0, fontFamily: "var(--font-script)", fontSize: "clamp(34px,6vw,64px)", lineHeight: 1.25, color: "var(--ink)" }}>{text}</p>
    </section>
  );
}
