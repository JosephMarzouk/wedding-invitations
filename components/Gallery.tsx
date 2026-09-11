"use client";
import { useEffect, useRef, useState } from "react";

const ROT = [-6, 4, -3, 7];
const MOBILE = [{ l: "5%", t: "1%", w: "42%" }, { l: "50%", t: "9%", w: "45%" }, { l: "3%", t: "46%", w: "47%" }, { l: "55%", t: "53%", w: "39%" }];
const DESKTOP = [{ l: "6%", t: "6%", w: "22%" }, { l: "28%", t: "16%", w: "24%" }, { l: "51%", t: "0%", w: "22%" }, { l: "73%", t: "18%", w: "21%" }];
const DUR = [5.2, 6.4, 4.6, 7.1];
const DELAY = [0, -1.7, -3.1, -0.8];

type Card = { rx: number; ry: number; tx: number; ty: number; s: number; active: boolean };
const idle = (): Card => ({ rx: 0, ry: 0, tx: 0, ty: 0, s: 1, active: false });

export default function Gallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [cards, setCards] = useState<Card[]>(() => photos.map(idle));
  const [desk, setDesk] = useState(true);
  // only gates pointer handlers, never markup, so reading it during init is hydration-safe
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const drag = useRef<{ i: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const onResize = () => setDesk(window.innerWidth >= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!photos.length) return null;

  const set = (i: number, patch: Partial<Card>) => setCards((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const tiltFrom = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    return { rx: -ny * 18, ry: nx * 18, tx: -nx * 12, ty: -ny * 12 };
  };
  const onMove = (i: number, e: React.PointerEvent) => {
    if (reduced) return;
    if (drag.current?.i === i) return set(i, { tx: e.clientX - drag.current.x, ty: e.clientY - drag.current.y, s: 1.06, active: true });
    if (e.pointerType === "touch") return;
    set(i, { ...tiltFrom(e), s: 1.05, active: true });
  };
  const onDown = (i: number, e: React.PointerEvent) => {
    if (reduced) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, x: e.clientX, y: e.clientY };
    const t = tiltFrom(e);
    set(i, { rx: t.rx * 1.4, ry: t.ry * 1.4, tx: 0, ty: 0, s: 1.08, active: e.pointerType !== "touch" });
  };
  const onUp = (i: number) => { drag.current = null; set(i, idle()); };
  const onLeave = (i: number) => { if (drag.current?.i === i) return; set(i, idle()); };

  // ponytail: the collage is a 4-slot pattern; extra photos repeat it one row lower.
  const base = desk ? 600 : 660;
  const rows = Math.ceil(photos.length / 4);
  const pos = desk ? DESKTOP : MOBILE;

  return (
    <section style={{ position: "relative", padding: "40px 16px 80px", background: "radial-gradient(ellipse 55% 40% at 22% 25%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%), radial-gradient(ellipse 50% 35% at 80% 65%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%), var(--bg-secondary)" }}>
      <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", height: base * rows, perspective: 1000 }}>
        {photos.map((src, i) => {
          const c = cards[i] ?? idle();
          const k = i % 4, row = Math.floor(i / 4);
          return (
            <div key={src + i} style={{ position: "absolute", left: pos[k].l, top: `calc(${row * base}px + ${pos[k].t})`, width: pos[k].w, animation: `floaty ${DUR[k]}s ease-in-out ${DELAY[k]}s infinite`, zIndex: c.active ? 10 : i + 1 }}>
              <div
                role="img" aria-label={`${alt} — ${i + 1}`}
                onPointerMove={(e) => onMove(i, e)} onPointerDown={(e) => onDown(i, e)} onPointerUp={() => onUp(i)} onPointerCancel={() => onUp(i)} onPointerLeave={() => onLeave(i)}
                style={{
                  background: "var(--bg)", padding: "8px 8px 16px", border: "1px solid var(--accent)",
                  boxShadow: c.active ? "0 40px 70px -20px rgba(0,0,0,.75), 0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent)" : "0 24px 50px -18px rgba(0,0,0,.7)",
                  transform: `translate(${c.tx}px,${c.ty}px) rotate(${ROT[k]}deg) rotateX(${c.rx}deg) rotateY(${c.ry}deg) scale(${c.s})`,
                  transition: c.active ? "box-shadow .3s" : "transform .8s cubic-bezier(.34,1.56,.64,1), box-shadow .5s",
                  transformStyle: "preserve-3d", touchAction: "none", cursor: "grab", userSelect: "none", willChange: "transform",
                }}
              >
                <img src={src} alt="" loading="lazy" draggable={false} style={{ display: "block", width: "100%", aspectRatio: "3/4", objectFit: "cover", pointerEvents: "none" }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
