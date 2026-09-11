"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Message, Strings } from "@/lib/wedding";

const MAX = 300;

export function WaxSeal({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, filter: "drop-shadow(0 3px 4px rgba(60,0,8,.45))", animation: "stamp .6s cubic-bezier(.2,.9,.3,1.3) both" }} aria-hidden>
      <defs><radialGradient id="wxs" gradientUnits="userSpaceOnUse" cx="38" cy="32" r="62"><stop offset="0" stopColor="color-mix(in srgb, var(--primary) 70%, #ff4050)" /><stop offset=".55" stopColor="var(--primary)" /><stop offset="1" stopColor="color-mix(in srgb, var(--primary) 70%, black)" /></radialGradient></defs>
      <g fill="url(#wxs)"><circle cx="50" cy="50" r="40" />{[[50, 12], [77, 23], [88, 50], [77, 77], [50, 88], [23, 77], [12, 50], [23, 23]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="15" />)}</g>
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.6" />
      <g fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="2.2" strokeLinecap="round"><path d="M50 62 C 44 60, 42 52, 47 48 C 52 44, 58 47, 56 53 C 54 58, 47 57, 48 52 C 49 49, 53 50, 52 53" /><path d="M50 62 C 48 70, 44 74, 38 80" /><path d="M44 71 c -6 -2 -10 2 -12 6 c 6 2 10 -1 12 -6z" /><path d="M47 66 c 6 -2 10 2 12 6 c -6 2 -10 -1 -12 -6z" /></g>
      <ellipse cx="38" cy="30" rx="16" ry="8" fill="#fff" opacity=".22" transform="rotate(-25 38 30)" />
    </svg>
  );
}

export const Spinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }} aria-hidden><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export async function fetchMessages(weddingId: string) {
  const { data } = await supabase.from("messages").select("id,guest_name,body,created_at").eq("wedding_id", weddingId).eq("approved", true).order("created_at", { ascending: false }).limit(50);
  return (data ?? []) as Message[];
}

type Props = { weddingId: string; coupleLine: string; bg: string; initial: Message[]; strings: Strings };

export default function Guestbook({ weddingId, coupleLine, bg, initial, strings: s }: Props) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [errName, setErrName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [list, setList] = useState(initial);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const en = name.trim() ? "" : s.errName, em = msg.trim() ? "" : s.errMsg;
    setErrName(en); setErrMsg(em); setState("idle");
    if (en || em) return;
    setState("sending");
    const { error } = await supabase.rpc("post_message", { p_wedding_id: weddingId, p_guest_name: name.trim(), p_body: msg.trim() });
    if (error) { setErrMsg(error.message); setState("idle"); return; }
    setList(await fetchMessages(weddingId));
    setName(""); setMsg(""); setState("sent");
  };

  return (
    <section style={{ position: "relative", padding: "120px 16px 140px", overflow: "hidden" }}>
      <img src={bg} alt="" aria-hidden loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* Dark fade over the photo, independent of the page's light theme, so the card below reads clearly. */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, color-mix(in srgb, var(--ink) 18%, transparent) 0%, color-mix(in srgb, var(--ink) 55%, transparent) 35%, color-mix(in srgb, var(--ink) 80%, transparent) 100%)" }} />

      <form onSubmit={submit} noValidate style={{ position: "relative", width: "min(520px,100%)", margin: "0 auto", padding: "40px 30px 34px", borderRadius: 24, background: "var(--glass-strong)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)", boxShadow: "0 30px 60px -20px color-mix(in srgb, var(--ink) 45%, transparent)", display: "flex", flexDirection: "column", gap: 18, textAlign: "start" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0, fontWeight: 400, fontSize: "clamp(30px,4vw,38px)", lineHeight: 1.15, color: "var(--ink)" }}>{s.guestbookTitle}</h2>
          <p style={{ margin: "6px 0 0", fontStyle: "italic", color: "var(--soft)" }}>{s.guestbookSub}</p>
        </div>
        <label className="w-field">{s.yourName}
          <input className="w-input" type="text" value={name} onChange={(e) => { setName(e.target.value); setErrName(""); }} placeholder={s.yourName} autoComplete="name" maxLength={80} />
          {errName && <span role="alert" className="w-err">{errName}</span>}
        </label>
        <label className="w-field">{s.yourMessage}
          <textarea className="w-input" value={msg} onChange={(e) => { setMsg(e.target.value.slice(0, MAX)); setErrMsg(""); }} maxLength={MAX} rows={5} placeholder={`${s.writeFor} ${coupleLine}`} style={{ resize: "vertical" }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            {errMsg && <span role="alert" className="w-err">{errMsg}</span>}
            <span aria-live="polite" style={{ marginInlineStart: "auto", fontSize: 13, letterSpacing: 0, textTransform: "none", color: "var(--soft)", fontVariantNumeric: "tabular-nums" }}>{msg.length}/{MAX}</span>
          </div>
        </label>
        <button type="submit" className="w-btn" disabled={state === "sending"} style={{ marginTop: 6 }}>
          {state === "sending" && <Spinner />}
          {state === "sending" ? s.sending : s.send}
        </button>
        {state === "sent" && (
          <div role="status" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 6 }}>
            <WaxSeal />
            <span style={{ fontStyle: "italic", color: "var(--soft)" }}>{s.sent}</span>
          </div>
        )}
      </form>

      {list.length > 0 && (
        <ul style={{ position: "relative", listStyle: "none", padding: 0, width: "min(520px,100%)", margin: "40px auto 0", display: "flex", flexDirection: "column", gap: 14, textAlign: "start" }}>
          {list.map((m) => (
            <li key={m.id} className="w-glass" style={{ borderRadius: 18, padding: "18px 22px" }}>
              <p style={{ margin: 0, color: "var(--ink)", textWrap: "pretty", whiteSpace: "pre-line" }}>{m.body}</p>
              <div style={{ marginTop: 8, fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--accent)" }}>— {m.guest_name}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
