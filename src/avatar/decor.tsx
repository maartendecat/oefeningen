// Het landschap waarin de gewonnen vogels wonen: één breed panorama van
// 3000 × 1000 met van links naar rechts bos, veld en water, zoals het
// spelersbord van Wingspan. Elke vogel heeft een vaste plek (`PLEKKEN`):
// het punt waar zijn poten staan, hoe groot hij is en of hij gespiegeld,
// ondersteboven of half in het water staat. Het decor is getekend rond die
// plekken: takken onder de vogels op een tak, een stam achter de spechten.

import type { ReactNode } from "react";
import { VOGELLIJN } from "./Vogel";
import type { Leefgebied } from "./vogels";

export const BREEDTE = 3000;
export const HOOGTE = 1000;

/** Waar elk leefgebied begint (x), om naartoe te scrollen. */
export const GEBIED_X: Record<Leefgebied, number> = { bos: 0, veld: 1060, water: 2020 };

export type Plek = {
  x: number;
  y: number;
  /** Schaal ten opzichte van het tekenvlak van de vogel. */
  k: number;
  spiegel?: boolean;
  /** Ondersteboven (de boomklever, de kaketoe aan een tak). */
  draai?: boolean;
  /** Staat met de poten in het water: het water komt ervoor. */
  waden?: boolean;
};

export const PLEKKEN: Record<string, Plek> = {
  // ---- Bos ----
  zwartvleugeltangare: { x: 60, y: 300, k: 0.7, spiegel: true },
  helmspecht: { x: 184, y: 540, k: 0.9 },
  kea: { x: 300, y: 386, k: 0.9 },
  "vlaamse-gaai": { x: 268, y: 616, k: 0.75 },
  "wilde-kalkoen": { x: 330, y: 862, k: 1.0 },
  oehoe: { x: 370, y: 480, k: 0.85, spiegel: true },
  "grote-bonte-specht": { x: 532, y: 600, k: 0.85 },
  roodkardinaal: { x: 560, y: 336, k: 0.7 },
  "blauwe-gaai": { x: 670, y: 336, k: 0.75 },
  kolibrie: { x: 574, y: 700, k: 0.6 },
  kiwi: { x: 660, y: 862, k: 0.75 },
  kerkuil: { x: 736, y: 460, k: 0.78 },
  regenbooglori: { x: 800, y: 250, k: 0.72, spiegel: true },
  roodborst: { x: 780, y: 802, k: 0.6 },
  boomklever: { x: 822, y: 600, k: 0.75, draai: true },
  kookaburra: { x: 986, y: 370, k: 0.78 },
  liervogel: { x: 980, y: 862, k: 0.85, spiegel: true },

  // ---- Veld ----
  renkoekoek: { x: 1150, y: 872, k: 0.85 },
  boerenzwaluw: { x: 1170, y: 718, k: 0.6 },
  slechtvalk: { x: 1262, y: 422, k: 0.8 },
  merel: { x: 1320, y: 876, k: 0.65 },
  huismus: { x: 1392, y: 700, k: 0.55, spiegel: true },
  torenvalk: { x: 1330, y: 332, k: 0.7, spiegel: true },
  holenuil: { x: 1470, y: 880, k: 0.7 },
  ekster: { x: 1510, y: 332, k: 0.7, spiegel: true },
  roodstaartbuizerd: { x: 1592, y: 432, k: 0.85 },
  "roze-kaketoe": { x: 1492, y: 474, k: 0.7, draai: true },
  koolmees: { x: 1676, y: 582, k: 0.6 },
  pimpelmees: { x: 1768, y: 540, k: 0.6, spiegel: true },
  emoe: { x: 1720, y: 880, k: 1.25 },
  condor: { x: 1880, y: 684, k: 1.0 },
  purpergors: { x: 1964, y: 760, k: 0.6, spiegel: true },

  // ---- Water ----
  zeearend: { x: 2060, y: 402, k: 1.0 },
  trompetkraanvogel: { x: 2104, y: 824, k: 1.15 },
  ijsvogel: { x: 2214, y: 620, k: 0.62 },
  "blauwe-reiger": { x: 2250, y: 850, k: 1.2, waden: true },
  zilverreiger: { x: 2350, y: 852, k: 1.05, waden: true, spiegel: true },
  "rode-lepelaar": { x: 2446, y: 856, k: 1.05, waden: true },
  ooievaar: { x: 2540, y: 372, k: 1.0 },
  "wilde-eend": { x: 2590, y: 822, k: 0.7 },
  ijsduiker: { x: 2570, y: 968, k: 0.8 },
  "carolina-eend": { x: 2730, y: 826, k: 0.65, spiegel: true },
  visarend: { x: 2700, y: 432, k: 0.9, spiegel: true },
  fuut: { x: 2750, y: 972, k: 0.75 },
  "canadese-gans": { x: 2850, y: 900, k: 0.85, spiegel: true },
  "zwarte-zwaan": { x: 2930, y: 976, k: 0.85, spiegel: true },
  trompetzwaan: { x: 2660, y: 900, k: 0.9 },
  papegaaiduiker: { x: 2880, y: 682, k: 0.72 },
  dwergpinguin: { x: 2944, y: 690, k: 0.62, spiegel: true },
  pelikaan: { x: 2930, y: 560, k: 0.9, spiegel: true },
};

/** De lijn van het water; waadvogels staan eronder met hun poten. */
export const WATERLIJN = 790;

// ---- Tekenhulpjes ----------------------------------------------------------------

const OMLIJN = { stroke: VOGELLIJN, strokeWidth: 4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const HOUT = "#8a6a4a";
const HOUT_DONKER = "#6a4e34";

/** Een tak als dikke lijn met een contour. */
function Tak({ d, dik = 14 }: { d: string; dik?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={VOGELLIJN} strokeWidth={dik + 8} />
      <path d={d} stroke={HOUT} strokeWidth={dik} />
    </g>
  );
}

function Stam({ x, breed, top, voet = 870 }: { x: number; breed: number; top: number; voet?: number }) {
  const l = x - breed / 2;
  const r = x + breed / 2;
  return (
    <g>
      <path d={`M${l - 14} ${voet} Q${l} ${voet - 30} ${l + 4} ${top} L${r - 4} ${top} Q${r} ${voet - 30} ${r + 14} ${voet} Z`} fill={HOUT} {...OMLIJN} />
      <path
        d={`M${l + 12} ${top + 60} Q${l + 8} ${top + 160} ${l + 14} ${top + 260} M${r - 14} ${top + 200} Q${r - 10} ${top + 300} ${r - 16} ${top + 420} M${x} ${top + 380} Q${x - 4} ${top + 460} ${x + 2} ${voet - 40}`}
        fill="none"
        stroke={HOUT_DONKER}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Een bladerkruin als een tros bollen, in twee tinten. */
function Kruin({ bollen, kleur, licht }: { bollen: [number, number, number][]; kleur: string; licht: string }) {
  return (
    <g>
      {bollen.map(([x, y, r], i) => <circle key={`c${i}`} cx={x} cy={y} r={r + 4} fill={VOGELLIJN} />)}
      {bollen.map(([x, y, r], i) => <circle key={`k${i}`} cx={x} cy={y} r={r} fill={kleur} />)}
      {bollen.map(([x, y, r], i) => <circle key={`l${i}`} cx={x - r * 0.25} cy={y - r * 0.3} r={r * 0.55} fill={licht} />)}
    </g>
  );
}

function Wolk({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g fill="#ffffff" opacity={0.95}>
      <ellipse cx={x} cy={y} rx={70 * s} ry={26 * s} />
      <circle cx={x - 26 * s} cy={y - 16 * s} r={28 * s} />
      <circle cx={x + 18 * s} cy={y - 24 * s} r={34 * s} />
    </g>
  );
}

function Gras({ x0, x1, y, kleur }: { x0: number; x1: number; y: number; kleur: string }) {
  const d: string[] = [];
  for (let x = x0; x < x1; x += 22) {
    const h = 14 + ((x * 7) % 13);
    d.push(`M${x} ${y} Q${x + 3} ${y - h / 2} ${x + 6} ${y - h}`);
  }
  return <path d={d.join(" ")} fill="none" stroke={kleur} strokeWidth={4} strokeLinecap="round" />;
}

function Varen({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const bladen: ReactNode[] = [];
  for (let i = -3; i <= 3; i++) {
    const h = (i * 18 * Math.PI) / 180;
    const ex = x + Math.sin(h) * 70 * s;
    const ey = y - Math.cos(h) * 60 * s;
    bladen.push(
      <path key={i} d={`M${x} ${y} Q${(x + ex) / 2 + i * 6} ${(y + ey) / 2 - 20 * s} ${ex} ${ey}`} fill="none" stroke="#3e7a36" strokeWidth={9 * s} strokeLinecap="round" />,
    );
  }
  return <g>{bladen}</g>;
}

function Bloem({ x, y, kleur }: { x: number; y: number; kleur: string }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x} ${y + 40}`} stroke="#3e7a36" strokeWidth={4} />
      {[0, 72, 144, 216, 288].map((h) => (
        <circle key={h} cx={x + 9 * Math.cos((h * Math.PI) / 180)} cy={y + 9 * Math.sin((h * Math.PI) / 180)} r={7} fill={kleur} stroke={VOGELLIJN} strokeWidth={1.5} />
      ))}
      <circle cx={x} cy={y} r={5} fill="#ffd23f" />
    </g>
  );
}

function Riet({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g>
      <path d={`M${x} ${y} Q${x + 6} ${y - h / 2} ${x + 2} ${y - h}`} fill="none" stroke="#6a8a3a" strokeWidth={5} strokeLinecap="round" />
      <path d={`M${x + 2} ${y - h} m-5 0 a5 16 0 1 0 10 0 a5 16 0 1 0 -10 0`} fill="#7a4e2a" stroke={VOGELLIJN} strokeWidth={2} transform={`translate(0 14)`} />
    </g>
  );
}

function Paal({ x, top, voet, breed = 22 }: { x: number; top: number; voet: number; breed?: number }) {
  return <path d={`M${x - breed / 2} ${voet} L${x - breed / 2 + 2} ${top} L${x + breed / 2 - 2} ${top} L${x + breed / 2} ${voet} Z`} fill={HOUT} {...OMLIJN} />;
}

function Nest({ x, y, breed = 90 }: { x: number; y: number; breed?: number }) {
  return (
    <g>
      <path d={`M${x - breed / 2} ${y - 6} Q${x} ${y + 30} ${x + breed / 2} ${y - 6} Z`} fill="#9a7a4a" {...OMLIJN} />
      <path d={`M${x - breed / 2 + 8} ${y} L${x + breed / 2 - 10} ${y + 6} M${x - breed / 2 + 14} ${y + 10} L${x + breed / 2 - 16} ${y + 2}`} stroke="#6a4e2a" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

function Rots({ d, kleur = "#9a9a92" }: { d: string; kleur?: string }) {
  return <path d={d} fill={kleur} {...OMLIJN} />;
}

// ---- Het decor ------------------------------------------------------------------

/** Alles achter de vogels. */
export function Decor() {
  return (
    <g>
      <defs>
        <linearGradient id="lucht" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ecdf0" />
          <stop offset="0.7" stopColor="#d4eef8" />
        </linearGradient>
        <linearGradient id="meer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fb2d8" />
          <stop offset="1" stopColor="#2f7aa8" />
        </linearGradient>
      </defs>

      {/* Lucht, zon, wolken */}
      <rect x={0} y={0} width={BREEDTE} height={HOOGTE} fill="url(#lucht)" />
      <circle cx={1330} cy={140} r={62} fill="#ffe27a" />
      <circle cx={1330} cy={140} r={84} fill="#ffe27a" opacity={0.3} />
      <Wolk x={560} y={110} />
      <Wolk x={1060} y={190} s={0.8} />
      <Wolk x={1820} y={120} s={1.1} />
      <Wolk x={2380} y={200} s={0.9} />
      <Wolk x={2860} y={110} />

      {/* Heuvels en bergen in de verte */}
      <path d="M0 640 L180 420 L300 520 L460 360 L640 560 L760 480 L900 620 L1100 520 L1300 640 L0 700 Z" fill="#a8c4d8" />
      <path d="M430 400 L460 360 L492 402 L476 396 L462 408 Z" fill="#ffffff" />
      <path d="M150 456 L180 420 L208 452 L190 448 L178 460 Z" fill="#ffffff" />
      <path d="M1000 700 Q1300 560 1600 660 Q1900 560 2200 680 L2200 760 L1000 760 Z" fill="#b8d89a" />
      <path d="M2100 690 Q2400 600 2700 680 Q2860 640 3000 670 L3000 760 L2100 760 Z" fill="#9cc4a8" />

      {/* ---- Bos ---- */}
      <Kruin
        kleur="#3e7a36"
        licht="#5a9a44"
        bollen={[[40, 170, 110], [170, 110, 120], [300, 170, 100], [120, 250, 90], [240, 260, 80]]}
      />
      <Kruin
        kleur="#2e6a3a"
        licht="#4a8a44"
        bollen={[[430, 150, 110], [560, 110, 120], [680, 170, 110], [500, 230, 90], [620, 250, 80]]}
      />
      <Kruin
        kleur="#3a7630"
        licht="#58963e"
        bollen={[[780, 130, 110], [900, 90, 120], [1010, 150, 100], [860, 220, 90], [960, 240, 80]]}
      />
      <path d="M0 860 Q260 830 520 850 Q780 870 1060 850 L1060 1000 L0 1000 Z" fill="#4e8a3a" {...OMLIJN} />
      <Stam x={128} breed={70} top={180} />
      <Stam x={470} breed={74} top={160} />
      <Stam x={880} breed={70} top={160} />
      {/* Takken onder de vogels */}
      <Tak d="M110 300 Q60 296 10 306" />
      <Tak d="M150 386 Q250 378 360 392" />
      <Tak d="M150 616 Q220 610 310 622" dik={12} />
      <Tak d="M440 480 Q380 474 300 486" />
      <Tak d="M500 336 Q600 326 720 340" />
      <Tak d="M860 460 Q800 454 690 464" />
      <Tak d="M860 250 Q820 244 760 254" dik={12} />
      <Tak d="M910 370 Q960 364 1040 374" />
      {/* Bosbodem */}
      <Varen x={60} y={866} s={0.9} />
      <Varen x={420} y={868} />
      <Varen x={860} y={870} s={0.8} />
      <path d="M740 862 L744 804 L820 804 L824 862 Z" fill={HOUT} {...OMLIJN} />
      <ellipse cx={782} cy={804} rx={40} ry={9} fill="#c8a878" stroke={VOGELLIJN} strokeWidth={4} />
      <Bloem x={540} y={740} kleur="#e84a8a" />
      <Bloem x={610} y={760} kleur="#f07a2a" />
      <Bloem x={640} y={730} kleur="#e84a8a" />

      {/* ---- Veld ---- */}
      <path d="M1040 860 Q1300 850 1560 870 Q1800 884 2040 860 L2040 1000 L1040 1000 Z" fill="#8ab84a" {...OMLIJN} />
      <Gras x0={1060} x1={2020} y={872} kleur="#6a9a34" />
      {/* Hek met draad */}
      {[1110, 1250, 1390].map((x) => (
        <Paal key={x} x={x} top={700} voet={880} breed={20} />
      ))}
      <path d="M1100 720 L1400 720 M1100 780 L1400 780" stroke="#5a5a5a" strokeWidth={3} />
      {/* Hoge palen voor de slechtvalk en de torenvalk */}
      <Paal x={1262} top={422} voet={700} breed={18} />
      <Paal x={1330} top={332} voet={880} breed={18} />
      {/* Dode boom voor buizerd, ekster en kaketoe */}
      <path d="M1540 880 L1550 560 L1520 440 L1500 330 M1550 560 L1600 432 M1546 474 L1480 474" fill="none" stroke={VOGELLIJN} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1540 880 L1550 560 L1520 440 L1500 330 M1550 560 L1600 432 M1546 474 L1480 474" fill="none" stroke="#9a8a78" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <Tak d="M1490 332 L1540 332" dik={10} />
      <Tak d="M1570 432 L1630 432" dik={10} />
      {/* Hol van de holenuil */}
      <ellipse cx={1480} cy={884} rx={60} ry={24} fill="#6a4e2a" stroke={VOGELLIJN} strokeWidth={4} />
      <ellipse cx={1480} cy={888} rx={36} ry={12} fill="#2a1c10" />
      {/* Meidoorn voor de mezen */}
      <Kruin kleur="#5a9a3a" licht="#7ab84e" bollen={[[1720, 520, 80], [1650, 560, 60], [1790, 560, 60]]} />
      <path d="M1720 880 L1720 600" stroke={VOGELLIJN} strokeWidth={26} strokeLinecap="round" />
      <path d="M1720 880 L1720 600" stroke={HOUT} strokeWidth={18} strokeLinecap="round" />
      <Tak d="M1720 582 L1640 582" dik={10} />
      <Tak d="M1720 540 L1800 540" dik={10} />
      {/* Rots voor de condor, struik voor de gors */}
      <Rots d="M1800 884 L1820 720 L1870 684 L1930 692 L1960 760 L1970 884 Z" />
      <path d="M1840 740 L1880 720 M1900 780 L1940 770" stroke="#7a7a72" strokeWidth={4} strokeLinecap="round" />
      <Kruin kleur="#4e8a3a" licht="#6aa44a" bollen={[[1990, 800, 50], [1950, 820, 36]]} />
      <Tak d="M1990 760 L1940 760" dik={8} />
      {[1130, 1600, 1850].map((x, i) => (
        <Bloem key={x} x={x} y={836 - i * 6} kleur={["#f5d02a", "#e84a8a", "#8a5ae8"][i]} />
      ))}

      {/* ---- Water ---- */}
      <path d="M2020 860 Q2080 840 2170 800 L2200 800 L2200 1000 L2020 1000 Z" fill="#e8d4a2" {...OMLIJN} />
      <rect x={2170} y={WATERLIJN} width={BREEDTE - 2170} height={HOOGTE - WATERLIJN} fill="url(#meer)" />
      <path d={`M2170 ${WATERLIJN} L${BREEDTE} ${WATERLIJN}`} stroke="#d4eef8" strokeWidth={6} />
      {/* Dode boom aan de oever voor de zeearend */}
      <path d="M2040 850 L2050 560 L2060 410 M2050 560 L2010 500" fill="none" stroke={VOGELLIJN} strokeWidth={28} strokeLinecap="round" />
      <path d="M2040 850 L2050 560 L2060 410 M2050 560 L2010 500" fill="none" stroke="#9a8a78" strokeWidth={20} strokeLinecap="round" />
      <Tak d="M2030 404 L2092 404" dik={12} />
      {/* Tak over het water voor de ijsvogel */}
      <Tak d="M2120 700 Q2180 640 2250 622" dik={10} />
      {/* Palen met nesten voor ooievaar en visarend */}
      <Paal x={2540} top={380} voet={WATERLIJN + 10} breed={20} />
      <Nest x={2540} y={378} breed={110} />
      <Paal x={2700} top={440} voet={WATERLIJN + 10} breed={20} />
      <Nest x={2700} y={438} breed={90} />
      {/* Rotsen in het water */}
      <Rots d="M2840 800 L2860 700 L2900 670 L2960 680 L3000 720 L3000 800 Z" />
      <Rots d="M2900 690 L2920 580 L2960 556 L3000 566 L3000 700 Z" kleur="#a8a8a0" />
      <path d="M2880 720 L2920 700 M2940 610 L2970 600" stroke="#7a7a72" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** Voor de waadvogels: het water over hun poten, en riet vooraan. */
export function Voorgrond() {
  return (
    <g pointerEvents="none">
      <rect x={2170} y={WATERLIJN + 30} width={340} height={HOOGTE - WATERLIJN - 30} fill="#3f8cb8" opacity={0.55} />
      <path
        d={`M2190 ${WATERLIJN + 32} Q2230 ${WATERLIJN + 24} 2270 ${WATERLIJN + 32} T2350 ${WATERLIJN + 32} T2430 ${WATERLIJN + 32} T2510 ${WATERLIJN + 32}`}
        fill="none"
        stroke="#d4eef8"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {[2176, 2190, 2204, 2514, 2528].map((x, i) => (
        <Riet key={x} x={x} y={HOOGTE} h={170 + (i % 3) * 30} />
      ))}
      <Gras x0={0} x1={1040} y={1000} kleur="#3e7a36" />
    </g>
  );
}
