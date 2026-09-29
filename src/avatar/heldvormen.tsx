// De vormen van een superheld, in stripstijl: dikke donkere contouren en
// vlakke kleuren met één harde schaduwkant. Alles tekent in hetzelfde
// assenstelsel als de pop (viewBox 0 0 200 400, voeten op y 372), zodat de
// animaties van de pop ook voor de helden werken.
//
// De pose: stoer rechtop met de benen wat uit elkaar, de linkerhand in de
// zij (vuist op 74,181) en de rechterarm langs het lijf (vuist op 144,202).

import type { ReactNode } from "react";

/** De contourkleur van de strip: bijna zwart, met een tikje blauw. */
export const HELDLIJN = "#1b1530";
export const HELDDIKTE = 3;

export const STRIP = {
  stroke: HELDLIJN,
  strokeWidth: HELDDIKTE,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

/** Armen: van schouder over elleboog naar pols. */
export const ARM_L = "M77 108 L56 146 L70 174";
export const ARM_R = "M123 108 L140 150 L144 192";
/** Het stuk van de onderarm waar een handschoen of armband komt. */
export const MANCHET_L = "M63 160 L69 172";
export const MANCHET_R = "M142 172 L143.5 188";
export const VUIST_L = { x: 73, y: 181 };
export const VUIST_R = { x: 144, y: 202 };
export const VUIST_R_STRAAL = 9;

export const ROMP = "M70 104 Q100 96 130 104 L126 150 Q121 168 123 192 L77 192 Q79 168 74 150 Z";
export const BEEN_L = "M77 190 L100 190 L99 200 L93 262 L89 340 L69 340 L72 262 Z";
export const BEEN_R = "M123 190 L100 190 L101 200 L107 262 L111 340 L131 340 L128 262 Z";
/** Onderbroek over het pak, zoals het hoort bij een echte held. */
export const BROEKJE = "M77 176 L123 176 L124 202 Q112 206 103 212 L100 204 L97 212 Q88 206 76 202 Z";
/** Een laars (links; gespiegeld met Paar). Bovenrand op y 300. */
export const LAARS = "M69 300 L92 300 L91 350 Q93 360 91 370 L58 370 Q50 370 53 361 Q57 353 69 350 Z";

/** Het hoofd: groot, zoals bij een kind. Ogen op (90, 61) en (110, 61). */
export const HOOFD = { cx: 100, cy: 58, rx: 26, ry: 28 };
export const OGEN = [90, 110];
export const OOG_Y = 61;
/** Midden van de borst, voor het embleem. */
export const BORST = { x: 100, y: 132 };

/** Een dikke lijn met contour errond: voor armen en mouwen. */
export function Arm({ d, kleur, dikte = 15 }: { d: string; kleur: string; dikte?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={HELDLIJN} strokeWidth={dikte + HELDDIKTE * 2} />
      <path d={d} stroke={kleur} strokeWidth={dikte} />
    </g>
  );
}

/**
 * Vormen die samen één silhouet vormen, zonder lijnen ertussen: eerst alles
 * dik in de lijnkleur, dan alles in de kleur erover (zoals bij de vogels).
 */
export function Silhouet({ kleur, children }: { kleur: string; children: ReactNode }) {
  return (
    <g>
      <g fill={HELDLIJN} stroke={HELDLIJN} strokeWidth={HELDDIKTE * 2} strokeLinejoin="round">
        {children}
      </g>
      <g fill={kleur}>{children}</g>
    </g>
  );
}

/** Een omlijnde vorm met iets erin (patroon, schaduw), geknipt op die vorm. */
export function Knip({ id, d, fill, children }: { id: string; d: string; fill: string; children?: ReactNode }) {
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={fill} />
      {children && <g clipPath={`url(#${id})`}>{children}</g>}
      <path d={d} fill="none" {...STRIP} />
    </g>
  );
}

// ---- Krachten: de vormpjes die rond een held vliegen ---------------------------

export type Kracht = "bliksem" | "vuur" | "ijs" | "wind" | "ster";

export function bliksemPad(x: number, y: number, s: number): string {
  const p = (dx: number, dy: number) => `${(x + dx * s).toFixed(1)} ${(y + dy * s).toFixed(1)}`;
  return `M${p(0.2, -1)} L${p(-0.5, 0.1)} L${p(0, 0.1)} L${p(-0.3, 1)} L${p(0.55, -0.2)} L${p(0.05, -0.2)} L${p(0.45, -1)} Z`;
}

export function vlamPad(x: number, y: number, s: number): string {
  const p = (dx: number, dy: number) => `${(x + dx * s).toFixed(1)} ${(y + dy * s).toFixed(1)}`;
  return `M${p(0, -1)} Q${p(0.35, -0.45)} ${p(0.6, 0.15)} Q${p(0.75, 0.9)} ${p(0, 1)} Q${p(-0.75, 0.9)} ${p(-0.6, 0.15)} Q${p(-0.45, -0.2)} ${p(-0.15, -0.25)} Q${p(-0.1, -0.6)} ${p(0, -1)} Z`;
}

export function kristalPad(x: number, y: number, s: number): string {
  const d: string[] = [];
  for (let i = 0; i < 3; i++) {
    const h = (Math.PI / 3) * i;
    const dx = Math.sin(h) * s;
    const dy = Math.cos(h) * s;
    d.push(`M${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)} L${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`);
  }
  return d.join(" ");
}

export function wervelPad(x: number, y: number, s: number): string {
  return `M${x - s} ${y} Q${x - s} ${y - s} ${x} ${y - s} Q${x + s} ${y - s} ${x + s} ${y} Q${x + s} ${y + s * 0.7} ${x} ${y + s * 0.7} Q${x - s * 0.5} ${y + s * 0.7} ${x - s * 0.5} ${y + s * 0.1} Q${x - s * 0.4} ${y - s * 0.4} ${x + s * 0.1} ${y - s * 0.3}`;
}
