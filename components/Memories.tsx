"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { remoteAssetUrl, type Memory, type Strings } from "@/lib/wedding";

const PAGE_SIZE = 4; // 2x2 grid per page
import { Spinner, WaxSeal } from "./Guestbook";

const MAX_SIDE = 1600;

async function fetchMemories(weddingId: string) {
  const { data } = await supabase.from("memories").select("id,storage_path,guest_name,created_at").eq("wedding_id", weddingId).eq("approved", true).order("created_at", { ascending: false }).limit(60);
  return (data ?? []) as Memory[];
}

type Props = { weddingId: string; coupleLine: string; dateLine: string; initial: Memory[]; strings: Strings };

export default function Memories({ weddingId, coupleLine, dateLine, initial, strings: s }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [mode, setMode] = useState<"idle" | "live" | "shot" | "sending" | "done">("idle");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [list, setList] = useState(initial);
  const [page, setPage] = useState(0);

  const stop = () => { stream.current?.getTracks().forEach((t) => t.stop()); stream.current = null; };
  useEffect(() => stop, []);

  const openCamera = async () => {
    setErr("");
    try {
      const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false });
      stream.current = st;
      setMode("live");
      requestAnimationFrame(() => { if (video.current) { video.current.srcObject = st; video.current.play().catch(() => {}); } });
    } catch {
      setErr(s.cameraError);
    }
  };

  const stamp = async (draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, sw: number, sh: number) => {
    const k = Math.min(1, MAX_SIDE / Math.max(sw, sh));
    const w = Math.round(sw * k), h = Math.round(sh * k);
    const c = canvas.current!;
    c.width = w; c.height = h;
    const ctx = c.getContext("2d")!;
    draw(ctx, w, h);
    await document.fonts.load(`400 ${Math.round(w * 0.09)}px "Pinyon Script"`).catch(() => {});
    // Dark (ink #2B211B) fade, not pure black, then bright on-dark text — the stamp sits on a real
    // photo, so it keeps the same "dark overlay behind on-image text" rule as the rest of the site.
    const g = ctx.createLinearGradient(0, h * 0.62, 0, h);
    g.addColorStop(0, "rgba(43,33,27,0)"); g.addColorStop(1, "rgba(43,33,27,.65)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(43,33,27,.6)"; ctx.shadowBlur = w * 0.01;
    ctx.fillStyle = "#FFFDF8";
    ctx.font = `400 ${Math.round(w * 0.09)}px "Pinyon Script", cursive`;
    ctx.fillText(coupleLine, w / 2, h - h * 0.11);
    ctx.fillStyle = "#B08D57";
    ctx.font = `400 ${Math.round(w * 0.028)}px ${getComputedStyle(c).fontFamily}`;
    ctx.fillText(dateLine, w / 2, h - h * 0.055);
    setMode("shot");
  };

  const takePhoto = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    stamp((ctx, w, h) => ctx.drawImage(v, 0, 0, w, h), v.videoWidth, v.videoHeight).then(stop);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setErr("");
    const bmp = await createImageBitmap(f).catch(() => null);
    if (!bmp) { setErr("Could not read that image."); return; }
    await stamp((ctx, w, h) => ctx.drawImage(bmp, 0, 0, w, h), bmp.width, bmp.height);
    bmp.close();
  };

  const send = async () => {
    const c = canvas.current!;
    setMode("sending"); setErr("");
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.86));
    if (!blob) { setErr("Could not encode the photo."); setMode("shot"); return; }
    const path = `${weddingId}/${crypto.randomUUID()}.jpg`;
    const up = await supabase.storage.from("memories").upload(path, blob, { contentType: "image/jpeg" });
    if (up.error) { setErr(up.error.message); setMode("shot"); return; }
    const { error } = await supabase.rpc("post_memory", { p_wedding_id: weddingId, p_storage_path: path, p_guest_name: name.trim() || null });
    if (error) { setErr(error.message); setMode("shot"); return; }
    setList(await fetchMemories(weddingId));
    setPage(0); // jump back to the page showing the photo they just sent
    setMode("done");
  };

  const reset = () => { stop(); setMode("idle"); };

  return (
    <section style={{ position: "relative", padding: "40px 16px 140px", background: "var(--bg)" }}>
      <div className="w-glass" style={{ width: "min(520px,100%)", margin: "0 auto", padding: "40px 30px 34px", borderRadius: 24, display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 400, fontSize: "clamp(30px,4vw,38px)", lineHeight: 1.15, color: "var(--ink)" }}>{s.memoriesTitle}</h2>
          <p style={{ margin: "6px 0 0", fontStyle: "italic", color: "var(--soft)" }}>{s.memoriesSub}</p>
        </div>

        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: "#000", aspectRatio: "3/4", display: mode === "idle" || mode === "done" ? "none" : "block" }}>
          <video ref={video} playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", display: mode === "live" ? "block" : "none" }} />
          <canvas ref={canvas} style={{ width: "100%", height: "100%", objectFit: "contain", display: mode === "live" ? "none" : "block" }} />
        </div>

        {(mode === "shot" || mode === "sending") && (
          <label className="w-field">{s.nameOptional}
            <input className="w-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={s.nameOptional} autoComplete="name" maxLength={80} />
          </label>
        )}
        {err && <span role="alert" className="w-err">{err}</span>}

        {mode === "idle" && (
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="w-btn" onClick={openCamera} style={{ flex: 1 }}>{s.openCamera}</button>
            {/* No `capture` attribute here (unlike the old fallback) so the OS picker offers the
                photo library, not just the camera — this is the "upload from gallery" path. */}
            <label className="w-pill" style={{ flex: 1, cursor: "pointer", justifyContent: "center", padding: "16px 20px", position: "relative" }}>
              {s.chooseFromGallery}
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
            </label>
          </div>
        )}
        {mode === "live" && <button type="button" className="w-btn" onClick={takePhoto}>{s.takePhoto}</button>}
        {(mode === "shot" || mode === "sending") && (
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="w-pill" onClick={reset} disabled={mode === "sending"} style={{ flex: 1, justifyContent: "center", padding: "16px 20px" }}>{s.retake}</button>
            <button type="button" className="w-btn" onClick={send} disabled={mode === "sending"} style={{ flex: 1.4 }}>
              {mode === "sending" && <Spinner />}
              {mode === "sending" ? s.uploading : s.upload}
            </button>
          </div>
        )}
        {mode === "done" && (
          <div role="status" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <WaxSeal />
            <span style={{ fontStyle: "italic", color: "var(--candle)" }}>{s.uploaded}</span>
            <button type="button" className="w-pill" onClick={reset} style={{ marginTop: 8 }}>{s.openCamera}</button>
          </div>
        )}
      </div>

      {list.length > 0 && (() => {
        const pageCount = Math.ceil(list.length / PAGE_SIZE);
        const shown = list.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
        return (
          <div style={{ width: "min(560px,100%)", margin: "48px auto 0", padding: "0 8px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 22 }}>
              {shown.map((m, i) => (
                <figure key={m.id} style={{ margin: 0, background: "var(--bg)", padding: "6px 6px 12px", border: "1px solid var(--accent)", boxShadow: "0 24px 50px -18px color-mix(in srgb, var(--ink) 45%, transparent)", transform: `rotate(${[-3, 2, -1.5, 3][i % 4]}deg)` }}>
                  {/* remoteAssetUrl, not assetUrl — an uploaded photo's path has no local dev placeholder to fall back to. */}
                  <img src={remoteAssetUrl(`memories/${m.storage_path}`)} alt={m.guest_name ? `${m.guest_name}` : ""} loading="lazy" style={{ display: "block", width: "100%", aspectRatio: "3/4", objectFit: "cover" }} />
                  {m.guest_name && <figcaption style={{ marginTop: 8, fontSize: 12, letterSpacing: ".12em", color: "var(--text-muted)", textTransform: "uppercase" }}>{m.guest_name}</figcaption>}
                </figure>
              ))}
            </div>
            {pageCount > 1 && (
              <nav aria-label="Memory photos" style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 28 }}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i} type="button" onClick={() => setPage(i)} aria-label={`Page ${i + 1}`} aria-current={page === i ? "page" : undefined}
                    style={{
                      width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      border: `1px solid ${page === i ? "var(--primary)" : "var(--glass-border)"}`,
                      background: page === i ? "var(--primary)" : "transparent",
                      color: page === i ? "var(--text-on-dark)" : "var(--ink)",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            )}
          </div>
        );
      })()}
    </section>
  );
}
