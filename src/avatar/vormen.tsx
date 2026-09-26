// Kleine tekenhulpjes die door de avatar en de kleren gedeeld worden.
// Alles tekent in hetzelfde assenstelsel: viewBox 0 0 200 400.

import type { ReactNode } from "react";

/** De contourkleur: een donkere bes, zachter dan zwart. */
export const LIJN = "#4a1d3a";
export const LIJNDIKTE = 2;

/** Standaard omlijning voor een groep vormen. */
export const OMLIJND = {
  stroke: LIJN,
  strokeWidth: LIJNDIKTE,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

/** De armen, van schouder over elleboog naar pols. */
export const ARM_LINKS = "M78 104 L67 158 L67 204";
export const ARM_RECHTS = "M122 104 L133 158 L133 204";
export const MOUW_KORT_LINKS = "M78 104 L73 130";
export const MOUW_KORT_RECHTS = "M122 104 L127 130";

/** Een dikke lijn met een contour errond: voor armen en mouwen. */
export function Streng({ d, kleur, dikte }: { d: string; kleur: string; dikte: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={LIJN} strokeWidth={dikte + LIJNDIKTE * 2} />
      <path d={d} stroke={kleur} strokeWidth={dikte} />
    </g>
  );
}

/** Tekent een vorm links en gespiegeld rechts (voor schoenen en zo). */
export function Paar({ children }: { children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform="translate(200 0) scale(-1 1)">{children}</g>
    </>
  );
}

export function hartPad(cx: number, cy: number, s: number): string {
  // s is ongeveer de halve breedte.
  return [
    `M${cx} ${cy + s * 0.9}`,
    `C${cx - s * 1.4} ${cy - s * 0.1} ${cx - s * 0.8} ${cy - s * 1.2} ${cx} ${cy - s * 0.45}`,
    `C${cx + s * 0.8} ${cy - s * 1.2} ${cx + s * 1.4} ${cy - s * 0.1} ${cx} ${cy + s * 0.9}`,
    "Z",
  ].join(" ");
}

export function sterPad(cx: number, cy: number, r: number, punten = 5): string {
  const d: string[] = [];
  for (let i = 0; i < punten * 2; i++) {
    const straal = i % 2 === 0 ? r : r * 0.45;
    const hoek = (Math.PI / punten) * i - Math.PI / 2;
    const x = cx + straal * Math.cos(hoek);
    const y = cy + straal * Math.sin(hoek);
    d.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return d.join(" ") + " Z";
}

export function Bloem({
  cx,
  cy,
  r,
  kleur,
  hart = "#f7d774",
}: {
  cx: number;
  cy: number;
  r: number;
  kleur: string;
  hart?: string;
}) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((h) => (
        <circle
          key={h}
          cx={cx + r * Math.cos(((h - 90) * Math.PI) / 180)}
          cy={cy + r * Math.sin(((h - 90) * Math.PI) / 180)}
          r={r * 0.75}
          fill={kleur}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.6} fill={hart} />
    </g>
  );
}

/** Een omlijnde vorm met een patroon erin, geknipt op die vorm. */
export function Geknipt({
  id,
  d,
  fill,
  children,
}: {
  id: string;
  d: string;
  fill: string;
  children: ReactNode;
}) {
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={fill} />
      <g clipPath={`url(#${id})`}>{children}</g>
      <path d={d} fill="none" {...OMLIJND} />
    </g>
  );
}

/** Een vonkje voor glitter en glans. */
export function vonkPad(cx: number, cy: number, r: number): string {
  const k = r * 0.3;
  return `M${cx} ${cy - r} L${cx + k} ${cy - k} L${cx + r} ${cy} L${cx + k} ${cy + k} L${cx} ${cy + r} L${cx - k} ${cy + k} L${cx - r} ${cy} L${cx - k} ${cy - k} Z`;
}
