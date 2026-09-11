/** Gold botanical line art shared by both hero designs. `<Ornaments />` renders the hidden SVG
 *  symbol defs once; `<CornerVines />` places the vine in the four corners of the names scene. */

const VINE =
  "M0 0 C 50 40, 110 40, 140 100 S 190 190, 250 230 M140 100 C 120 130, 90 140, 60 150 M140 100 C 170 90, 200 60, 240 60 M190 160 C 200 130, 230 120, 260 118 M0 0 C 20 60, 30 110, 20 160 M250 230 C 270 250, 280 275, 282 296";
const LEAVES = [
  "M40 28 q14 -12 26 2 q-14 12 -26 -2z", "M92 46 q14 -12 26 2 q-14 12 -26 -2z", "M118 82 q-6 -18 12 -22 q6 18 -12 22z",
  "M98 138 q14 -12 26 2 q-14 12 -26 -2z", "M70 150 q-16 8 -22 -6 q16 -8 22 6z", "M176 84 q14 -12 26 2 q-14 12 -26 -2z",
  "M212 62 q-6 -18 12 -22 q6 18 -12 22z", "M168 166 q14 -14 26 -2 q-14 12 -26 2z", "M226 128 q14 -12 26 2 q-14 12 -26 -2z",
  "M20 90 q-18 4 -16 -14 q18 -4 16 14z", "M30 140 q18 4 10 20 q-18 -4 -10 -20z", "M210 210 q14 -12 26 2 q-14 12 -26 -2z",
  "M262 258 q-18 4 -16 -14 q18 -4 16 14z",
];
export const ROSE = "M0 0 c 5 -7 15 -5 13 4 c -2 8 -14 8 -15 -2 c -1 -12 16 -15 21 -3 c 5 12 -9 22 -20 15 c -11 -7 -8 -24 4 -28 c 14 -5 26 8 22 22";

export function Ornaments() {
  return (
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
  );
}

const vineBox: React.CSSProperties = { position: "absolute", width: "min(44vw,360px)", height: "min(44vw,360px)" };

export function CornerVines({ opacity }: { opacity: number }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, opacity, transition: "opacity .4s", pointerEvents: "none", filter: "drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 35%, transparent))" }}>
      <svg style={{ ...vineBox, left: "-2%", top: "-2%" }}><use href="#vine" /></svg>
      <svg style={{ ...vineBox, right: "-2%", top: "-2%", transform: "scaleX(-1)" }}><use href="#vine" /></svg>
      <svg style={{ ...vineBox, left: "-2%", bottom: "-2%", transform: "scaleY(-1)" }}><use href="#vine" /></svg>
      <svg style={{ ...vineBox, right: "-2%", bottom: "-2%", transform: "rotate(180deg)" }}><use href="#vine" /></svg>
    </div>
  );
}
