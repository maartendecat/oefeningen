// De avatar om aan te kleden: een hip tienermeisje in fashion-illustratiestijl,
// met dunne contourlijnen in bessenkleur. Alle avatars staan in dezelfde pose,
// zodat elk kledingstuk op elke avatar past.
//
// Van achter naar voor: achterhaar, benen, schoenen, romp en armen,
// onderstuk, truitje of kleedje, shopping, handen, hals en hoofd, voorhaar,
// gezicht, bril en hoofdaccessoire. Daarover valt licht van links (een
// verloop, gemaskeerd op het silhouet), en daarboven de effecten van de
// stemming: windje, zweetdruppel, hartjes.
//
// De animaties zelf staan in globals.css (zoek op "Avatar-animaties").

import { useId, type CSSProperties, type ReactNode } from "react";
import { vindItem, type Item } from "./items";
import { ARM_LINKS, ARM_RECHTS, LIJN, OMLIJND, Streng, hartPad, sterPad, vonkPad } from "./vormen";
import type { Aan } from "@/lib/state";

type Kapsel = "golven" | "staart" | "knot" | "bob" | "vlechten";

/** Hoe de avatar zich voelt; bepaalt gezicht, effecten en beweging. */
export type Stemming = "rust" | "blij" | "juich" | "zwaar" | "verrast" | "draai";

export type Basis = {
  id: string;
  huid: string;
  /** Een iets donkerdere huidtint voor schaduw en neus. */
  schaduw: string;
  haar: string;
  /** Een donkerdere haartint voor lokken en wenkbrauwen. */
  haarDonker: string;
  ogen: string;
  kapsel: Kapsel;
};

export const BASISSEN: Basis[] = [
  { id: "lotte", huid: "#f6d3b8", schaduw: "#e3ad8c", haar: "#d9a441", haarDonker: "#a8742a", ogen: "#3f7f86", kapsel: "golven" },
  { id: "noor", huid: "#f0c2a0", schaduw: "#d69c78", haar: "#6b3e26", haarDonker: "#4a2716", ogen: "#6b4424", kapsel: "staart" },
  { id: "amira", huid: "#8d5a3b", schaduw: "#6e412a", haar: "#2b1a12", haarDonker: "#140b07", ogen: "#3d2414", kapsel: "knot" },
  { id: "fien", huid: "#fbe0cc", schaduw: "#e8b89c", haar: "#e889b0", haarDonker: "#c25f8a", ogen: "#5f8a4e", kapsel: "bob" },
  { id: "yara", huid: "#b5774f", schaduw: "#935a37", haar: "#241a1a", haarDonker: "#0e0909", ogen: "#4d2e1c", kapsel: "vlechten" },
];

export function vindBasis(id: string | null): Basis {
  return BASISSEN.find((b) => b.id === id) ?? BASISSEN[0];
}

// ---- Kleuren -----------------------------------------------------------------

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mengt kleur a met t (0-1) van kleur b. */
export function meng(a: string, b: string, t: number): string {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${m(r1, r2)}${m(g1, g2)}${m(b1, b2)}`;
}

const lichter = (c: string, t: number) => meng(c, "#ffffff", t);
const donkerder = (c: string, t: number) => meng(c, "#2a0f24", t);

/** De verfpot van één avatar: kleuren en verwijzingen naar haar verlopen. */
type Verf = {
  b: Basis;
  haar: string;
  iris: string;
  blos: string;
  lippen: string;
};

function Verlopen({ uid, b }: { uid: string; b: Basis }) {
  return (
    <>
      <linearGradient id={`${uid}-haar`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor={lichter(b.haar, 0.28)} />
        <stop offset="0.45" stopColor={b.haar} />
        <stop offset="1" stopColor={donkerder(b.haar, 0.3)} />
      </linearGradient>
      <radialGradient id={`${uid}-iris`} cx="0.5" cy="0.72" r="0.62">
        <stop offset="0" stopColor={lichter(b.ogen, 0.45)} />
        <stop offset="0.55" stopColor={b.ogen} />
        <stop offset="1" stopColor={donkerder(b.ogen, 0.45)} />
      </radialGradient>
      <radialGradient id={`${uid}-blos`}>
        <stop offset="0" stopColor="#ff6f91" stopOpacity={0.55} />
        <stop offset="1" stopColor="#ff6f91" stopOpacity={0} />
      </radialGradient>
      <linearGradient id={`${uid}-lippen`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9557f" />
        <stop offset="1" stopColor="#a8325e" />
      </linearGradient>
      {/* Licht van linksboven: lichter links, zachte schaduw rechts. */}
      <linearGradient id={`${uid}-licht`} gradientUnits="userSpaceOnUse" x1="58" y1="0" x2="142" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity={0.3} />
        <stop offset="0.42" stopColor="#ffffff" stopOpacity={0} />
        <stop offset="0.6" stopColor="#3b1030" stopOpacity={0} />
        <stop offset="1" stopColor="#3b1030" stopOpacity={0.24} />
      </linearGradient>
      <linearGradient id={`${uid}-onder`} gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="0" y2="372">
        <stop offset="0" stopColor="#3b1030" stopOpacity={0} />
        <stop offset="1" stopColor="#3b1030" stopOpacity={0.14} />
      </linearGradient>
      <radialGradient id={`${uid}-grond`}>
        <stop offset="0" stopColor="#3b1030" stopOpacity={0.26} />
        <stop offset="1" stopColor="#3b1030" stopOpacity={0} />
      </radialGradient>
    </>
  );
}

// ---- Haar -------------------------------------------------------------------

const KAP = "M78 58 Q74 24 100 24 Q126 24 122 58 Q118 38 100 36 Q84 38 78 58 Z";

/** Glanslokken op de kruin, zoals licht dat op haar valt. */
function Glans({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#ffffff" strokeOpacity={0.45} strokeWidth={2.2} strokeLinecap="round" />;
}

function Achterhaar({ v }: { v: Verf }) {
  const { b } = v;
  switch (b.kapsel) {
    case "golven":
      return (
        <g className="haar-zwaai">
          <path
            d="M76 50 Q70 22 100 22 Q130 22 124 50 Q134 80 128 108 Q136 132 126 152 Q112 148 108 132 L92 132 Q88 148 74 152 Q64 132 72 108 Q66 80 76 50 Z"
            fill={v.haar}
            {...OMLIJND}
          />
          <path d="M74 90 Q70 112 76 136 M126 90 Q130 112 124 136" fill="none" stroke={b.haarDonker} strokeWidth={1.4} />
        </g>
      );
    case "staart":
      return (
        <g className="staart-zwaai">
          <path d="M112 28 Q150 34 144 96 Q142 124 128 142 Q134 100 114 60 Z" fill={v.haar} {...OMLIJND} />
          <path d="M126 50 Q138 80 132 118" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
          <Glans d="M132 44 Q142 60 140 84" />
        </g>
      );
    case "knot":
      return (
        <g className="knot-wiebel">
          <circle cx={100} cy={18} r={17} fill={v.haar} {...OMLIJND} />
          <path d="M90 12 Q96 8 102 12 M100 22 Q106 18 112 22" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
          <Glans d="M89 9 Q94 5 100 5" />
        </g>
      );
    case "bob":
      return (
        <g className="haar-zwaai">
          <path
            d="M76 58 Q72 22 100 22 Q128 22 124 58 L128 88 Q118 94 110 86 L90 86 Q82 94 72 88 Z"
            fill={v.haar}
            {...OMLIJND}
          />
        </g>
      );
    case "vlechten":
      return (
        <g className="haar-zwaai">
          <path d="M76 50 Q70 22 100 22 Q130 22 124 50 L132 176 L68 176 Z" fill={v.haar} {...OMLIJND} />
          <path d="M84 70 L80 174 M92 80 L90 174 M108 80 L110 174 M116 70 L120 174" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
        </g>
      );
  }
}

function Voorhaar({ v }: { v: Verf }) {
  const { b } = v;
  switch (b.kapsel) {
    case "golven":
      return (
        <g>
          <path d="M78 60 Q72 22 102 22 Q126 24 122 58 Q118 36 104 34 Q96 46 80 50 Z" fill={v.haar} {...OMLIJND} />
          <path d="M80 60 Q74 80 80 96 Q76 110 82 120 M120 60 Q126 80 120 96 Q124 110 118 120" fill="none" stroke={b.haarDonker} strokeWidth={3} strokeLinecap="round" />
          <Glans d="M88 28 Q98 24 110 27" />
          <Glans d="M81 44 Q82 36 86 32" />
        </g>
      );
    case "staart":
      return (
        <g>
          <path d="M78 56 Q76 26 100 26 Q124 26 122 56 Q116 36 100 36 Q86 38 78 56 Z" fill={v.haar} {...OMLIJND} />
          <path d="M79 50 Q75 62 80 74" fill="none" stroke={b.haar} strokeWidth={3} strokeLinecap="round" />
          <Glans d="M86 32 Q96 27 108 30" />
          <circle cx={116} cy={31} r={6} fill="#f4a7c8" {...OMLIJND} />
          <circle cx={114.5} cy={29.5} r={1.8} fill="#ffffff" opacity={0.6} />
        </g>
      );
    case "knot":
      return (
        <g>
          <path d="M78 60 Q74 28 100 28 Q126 28 122 60 Q120 42 100 40 Q80 42 78 60 Z" fill={v.haar} {...OMLIJND} />
          <path d="M88 32 Q100 28 112 32" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
          <Glans d="M84 38 Q90 33 98 32" />
          <rect x={88} y={30} width={24} height={5} rx={2.5} fill="#f4a7c8" {...OMLIJND} />
        </g>
      );
    case "bob":
      return (
        <g>
          <path d="M78 62 Q72 24 100 24 Q128 24 122 62 Q120 44 108 40 Q96 52 80 50 Z" fill={v.haar} {...OMLIJND} />
          <Glans d="M84 34 Q94 27 106 28" />
          <Glans d="M78 70 Q76 60 78 52" />
          <rect x={108} y={36} width={13} height={4} rx={2} fill="#f7d774" transform="rotate(-22 114 38)" {...OMLIJND} strokeWidth={1} />
          <rect x={110} y={44} width={13} height={4} rx={2} fill="#ffffff" transform="rotate(-22 116 46)" {...OMLIJND} strokeWidth={1} />
        </g>
      );
    case "vlechten":
      return (
        <g>
          <path d={KAP} fill={v.haar} {...OMLIJND} />
          <path d="M100 25 L100 36" fill="none" stroke={b.haarDonker} strokeWidth={1.5} />
          <Glans d="M86 32 Q92 28 97 28" />
          <Glans d="M103 28 Q110 28 115 32" />
          {[78, 122].map((x) => {
            const kant = x < 100 ? -1 : 1;
            return (
              <g key={x} className={kant < 0 ? "vlecht-links" : "vlecht-rechts"}>
                <Streng d={`M${x} 62 Q${x + kant * 4} 110 ${x - kant * 2} 162`} kleur={b.haar} dikte={7} />
                {[76, 94, 112, 130, 146].map((y) => (
                  <path key={y} d={`M${x - 3 + kant * 0.5} ${y} q3 3 6 0`} fill="none" stroke={lichter(b.haar, 0.25)} strokeWidth={1.2} />
                ))}
                <rect x={x - kant * 2 - 5} y={150} width={10} height={6} rx={2} fill="#e8b04a" {...OMLIJND} strokeWidth={1} />
              </g>
            );
          })}
        </g>
      );
  }
}

// ---- Lijf -------------------------------------------------------------------

function Benen({ huid }: { huid: string }) {
  return (
    <g fill={huid} {...OMLIJND}>
      <path d="M79 178 Q77 262 85 352 L95 352 Q99 262 99 178 Z" />
      <path d="M121 178 Q123 262 115 352 L105 352 Q101 262 101 178 Z" />
    </g>
  );
}

function Romp({ huid }: { huid: string }) {
  return (
    <g>
      <Streng d={ARM_LINKS} kleur={huid} dikte={10} />
      <Streng d={ARM_RECHTS} kleur={huid} dikte={10} />
      <path d="M76 100 Q100 94 124 100 L119 164 Q121 172 122 182 L78 182 Q79 172 81 164 Z" fill={huid} {...OMLIJND} />
      <path d="M90 104 Q94 107 98 105 M102 105 Q106 107 110 104" fill="none" stroke={donkerder(huid, 0.12)} strokeWidth={1} />
    </g>
  );
}

function Handen({ huid }: { huid: string }) {
  return (
    <g fill={huid} {...OMLIJND}>
      <ellipse cx={67} cy={211} rx={5.5} ry={6.5} />
      <ellipse cx={133} cy={211} rx={5.5} ry={6.5} />
    </g>
  );
}

function Hoofd({ b }: { b: Basis }) {
  return (
    <g>
      <rect x={94} y={72} width={12} height={28} rx={4} fill={b.huid} {...OMLIJND} />
      <path d="M95 80 Q100 86 105 80 L105 76 L95 76 Z" fill={b.schaduw} />
      <ellipse cx={100} cy={54} rx={21} ry={25} fill={b.huid} {...OMLIJND} />
    </g>
  );
}

// ---- Gezicht ----------------------------------------------------------------

const OGEN_X = [91, 109];

/** Open ogen met iris, pupil, twee lichtjes, ooglid en wimpers. */
function OpenOgen({ v, groot = false }: { v: Verf; groot?: boolean }) {
  const r = groot ? 3.6 : 3;
  return (
    <g className="oog">
      {OGEN_X.map((x) => {
        const kant = x < 100 ? -1 : 1;
        return (
          <g key={x}>
            <ellipse cx={x} cy={58.3} rx={5.2} ry={groot ? 4.6 : 3.8} fill="#ffffff" />
            <circle cx={x} cy={58.6} r={r} fill={v.iris} />
            <circle cx={x} cy={58.8} r={r * 0.45} fill="#1c0d14" />
            <circle cx={x + 1.1} cy={57.3} r={groot ? 1.3 : 1} fill="#ffffff" />
            <circle cx={x - 1} cy={60} r={0.5} fill="#ffffff" opacity={0.9} />
            <path d={`M${x - 6} 57 Q${x} 52 ${x + 6} 57`} fill="none" stroke={LIJN} strokeWidth={2.2} strokeLinecap="round" />
            <path d={`M${x + kant * 6} 57 l${kant * 2} -2 M${x + kant * 4.5} 54.6 l${kant * 1.6} -2`} stroke={LIJN} strokeWidth={1.3} strokeLinecap="round" />
            <path d={`M${x - 4} 62.6 Q${x} 63.8 ${x + 4} 62.6`} fill="none" stroke={v.b.schaduw} strokeWidth={0.9} strokeLinecap="round" />
            <path d={`M${x - 5} 53.2 Q${x} 50.2 ${x + 5} 53.2`} fill="none" stroke={v.b.schaduw} strokeWidth={0.8} strokeLinecap="round" opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
}

/** Dichtgeknepen van inspanning: > < */
function KnijpOgen() {
  return (
    <g fill="none" stroke={LIJN} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M86 54.5 L95.5 58.5 L86 62.5" />
      <path d="M114 54.5 L104.5 58.5 L114 62.5" />
    </g>
  );
}

/** Toegeknepen lachogen: ^ ^ */
function LachOgen() {
  return (
    <g fill="none" stroke={LIJN} strokeWidth={2.4} strokeLinecap="round">
      {OGEN_X.map((x) => (
        <path key={x} d={`M${x - 5.5} 59.5 Q${x} 52.5 ${x + 5.5} 59.5`} />
      ))}
    </g>
  );
}

function Wenkbrauwen({ kleur, stemming }: { kleur: string; stemming: Stemming }) {
  const d = {
    rust: "M85 49 Q91 46 96 48 M104 48 Q109 46 115 49",
    blij: "M85 47.5 Q91 44 96 46.5 M104 46.5 Q109 44 115 47.5",
    juich: "M85 46.5 Q91 43 96 45.5 M104 45.5 Q109 43 115 46.5",
    zwaar: "M85 49 Q91 48.5 96 45.5 M104 45.5 Q109 48.5 115 49",
    draai: "M85 47.5 Q91 44 96 46.5 M104 46.5 Q109 44 115 47.5",
    verrast: "M85 45.5 Q91 41.5 96 44.5 M104 44.5 Q109 41.5 115 45.5",
  }[stemming];
  return <path d={d} fill="none" stroke={kleur} strokeWidth={1.8} strokeLinecap="round" />;
}

function Mond({ v, stemming }: { v: Verf; stemming: Stemming }) {
  switch (stemming) {
    case "blij":
    case "juich":
    case "draai":
      return (
        <g strokeLinejoin="round">
          <path d="M91.5 68 Q100 82 108.5 68 Q100 70 91.5 68 Z" fill="#6b1233" stroke={LIJN} strokeWidth={0.9} />
          <path d="M93.4 68.7 Q100 70.8 106.6 68.7 L105.9 71 Q100 72.8 94.1 71 Z" fill="#ffffff" />
          <path d="M95 76.4 Q100 72.6 105 76.4 Q100 79.4 95 76.4 Z" fill="#ff7a9a" />
        </g>
      );
    case "zwaar":
      return <ellipse cx={103.5} cy={71} rx={2.3} ry={2.8} fill="#7a1f3d" stroke={LIJN} strokeWidth={0.9} />;
    case "verrast":
      return (
        <g>
          <ellipse cx={100} cy={71.5} rx={3.2} ry={4.2} fill="#6b1233" stroke={LIJN} strokeWidth={0.9} />
          <ellipse cx={100} cy={73.8} rx={2} ry={1.2} fill="#ff7a9a" />
        </g>
      );
    default:
      return (
        <g strokeLinejoin="round">
          <path d="M93 69 Q100 78.5 107 69 Q100 71 93 69 Z" fill={v.lippen} stroke="#a8325e" strokeWidth={0.8} />
          <path d="M95 70 Q100 71.8 105 70 L104.2 71.8 Q100 73.4 95.8 71.8 Z" fill="#ffffff" />
          <path d="M97.5 75.2 Q100 76 102.5 75.2" fill="none" stroke="#ffffff" strokeOpacity={0.55} strokeWidth={0.9} strokeLinecap="round" />
        </g>
      );
  }
}

function Gezicht({ v, stemming }: { v: Verf; stemming: Stemming }) {
  const { b } = v;
  const lacht = stemming === "blij" || stemming === "juich" || stemming === "draai";
  const bol = stemming === "zwaar";
  return (
    <g>
      <Wenkbrauwen kleur={b.haarDonker} stemming={stemming} />
      {lacht ? <LachOgen /> : bol ? <KnijpOgen /> : <OpenOgen v={v} groot={stemming === "verrast"} />}
      <path d="M100 60 Q102 65 99 66" fill="none" stroke={b.schaduw} strokeWidth={1.4} strokeLinecap="round" />
      {bol ? (
        // Bolle wangen van het blazen.
        <g>
          <circle cx={85} cy={67} r={6.5} fill={lichter(b.huid, 0.18)} />
          <circle cx={115} cy={67} r={6.5} fill={lichter(b.huid, 0.18)} />
          <ellipse cx={85} cy={67} rx={6} ry={4} fill={v.blos} />
          <ellipse cx={115} cy={67} rx={6} ry={4} fill={v.blos} />
        </g>
      ) : (
        <g>
          <ellipse cx={85.5} cy={65.5} rx={lacht ? 7 : 5.5} ry={lacht ? 4.2 : 3.4} fill={v.blos} />
          <ellipse cx={114.5} cy={65.5} rx={lacht ? 7 : 5.5} ry={lacht ? 4.2 : 3.4} fill={v.blos} />
        </g>
      )}
      <Mond v={v} stemming={stemming} />
      <circle cx={79} cy={66} r={2.2} fill="#e8b04a" stroke="#b9822a" strokeWidth={0.6} />
      <circle cx={121} cy={66} r={2.2} fill="#e8b04a" stroke="#b9822a" strokeWidth={0.6} />
      <circle cx={78.4} cy={65.3} r={0.7} fill="#fff6d6" />
      <circle cx={120.4} cy={65.3} r={0.7} fill="#fff6d6" />
    </g>
  );
}

// ---- Effecten per stemming ---------------------------------------------------

/** "Pfff": windje uit de mond, een wolkje en een zweetdruppel. */
function Windje() {
  return (
    <g>
      <g className="windje" fill="none" stroke="#5f9fe0" strokeWidth={2.4} strokeLinecap="round">
        <path className="wind-lijn" d="M108 70 Q116 66 124 70 T140 70" />
        <path className="wind-lijn" d="M108 74 Q118 79 130 75" />
        <path className="wind-lijn" d="M108 66 Q116 60 128 61" />
        <g className="wind-wolk" fill="#eef7ff" stroke="#5f9fe0" strokeWidth={1.6}>
          <circle cx={146} cy={70} r={5.5} />
          <circle cx={153} cy={66} r={4.5} />
          <circle cx={154} cy={73} r={4} />
        </g>
      </g>
      <path className="zweet" d="M123 38 Q128 45 123 49 Q118 45 123 38 Z" fill="#bfe3ff" stroke="#6fa9e0" strokeWidth={1} />
    </g>
  );
}

const ZWEVERS: [number, number, "hart" | "ster", string][] = [
  [60, 44, "hart", "#ff6fae"],
  [142, 38, "ster", "#f7d774"],
  [48, 96, "ster", "#b9b3d9"],
  [154, 100, "hart", "#e05b8f"],
  [100, 6, "hart", "#ff8fc7"],
  [150, 150, "ster", "#f7d774"],
  [50, 150, "hart", "#ff6fae"],
];

/** Hartjes en sterren die rond haar opstijgen. */
function Juichen() {
  return (
    <g>
      {ZWEVERS.map(([x, y, soort, kleur], i) => (
        <path
          key={i}
          className="zweef"
          style={{ animationDelay: `${i * 0.28}s` }}
          d={soort === "hart" ? hartPad(x, y, 6) : sterPad(x, y, 7)}
          fill={kleur}
          stroke={LIJN}
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

function Blij() {
  return (
    <g>
      <path className="fonkel-kort" d={vonkPad(68, 44, 6)} fill="#f7d774" />
      <path className="fonkel-kort" style={{ animationDelay: "0.12s" }} d={vonkPad(134, 40, 5)} fill="#ffffff" stroke="#f7d774" strokeWidth={1} />
      <path className="fonkel-kort" style={{ animationDelay: "0.24s" }} d={vonkPad(140, 62, 3.5)} fill="#f7d774" />
    </g>
  );
}

function Verrast() {
  return (
    <g className="flits" fill="none" stroke="#f7a8c8" strokeWidth={2.4} strokeLinecap="round">
      <path d="M100 2 L100 10 M76 8 L81 15 M124 8 L119 15" />
    </g>
  );
}

// ---- Samenstellen ------------------------------------------------------------

function tekenItem(item: Item | undefined, uid: string, b: Basis): ReactNode {
  return item ? <g key={item.id}>{item.teken({ uid: `${uid}-${item.id}`, huid: b.huid })}</g> : null;
}

/** Alles wat een silhouet heeft; wordt ook gebruikt als masker voor het licht. */
function Figuur({ v, aan, uid }: { v: Verf; aan: Aan; uid: string }) {
  const { b } = v;
  const kleed = vindItem(aan.kleedjes);
  const t = (id: string | undefined) => tekenItem(vindItem(id), uid, b);
  return (
    <>
      <Achterhaar v={v} />
      <Benen huid={b.huid} />
      {t(aan.schoenen)}
      <Romp huid={b.huid} />
      {kleed ? (
        tekenItem(kleed, uid, b)
      ) : (
        <>
          {t(aan.onder)}
          {t(aan.truitjes)}
        </>
      )}
      {t(aan.tassen)}
      <Handen huid={b.huid} />
      <Hoofd b={b} />
      <Voorhaar v={v} />
    </>
  );
}

/** Het volledige tekenvlak, ruim genoeg voor tassen en ballonnen opzij. */
export const VOLLEDIG = "0 0 200 400";
/** Strak rond de figuur zelf, voor als ze nog niets vasthoudt. */
export const STRAK = "44 0 112 388";
/** Hoofd en schouders, met plaats voor het windje en de hartjes errond. */
export const PORTRET = "48 0 116 116";

/** Een vast getal per avatar-exemplaar, zodat ze niet allemaal tegelijk knipperen. */
function spreiding(uid: string): number {
  let h = 0;
  for (const c of uid) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return h;
}

export function Pop({
  basis,
  aan,
  naam,
  className,
  kader = VOLLEDIG,
  stemming = "rust",
}: {
  basis: Basis;
  aan: Aan;
  naam?: string | null;
  className?: string;
  kader?: string;
  stemming?: Stemming;
}) {
  const uid = useId().replace(/[:«»]/g, "");
  const v: Verf = {
    b: basis,
    haar: `url(#${uid}-haar)`,
    iris: `url(#${uid}-iris)`,
    blos: `url(#${uid}-blos)`,
    lippen: `url(#${uid}-lippen)`,
  };
  const s = spreiding(uid);
  const stijl = {
    "--knipper": `${-(s % 5000)}ms`,
    "--wieg": `${-(s % 3000)}ms`,
  } as CSSProperties;

  return (
    <svg
      viewBox={kader}
      className={`pop stemming-${stemming} ${className ?? ""}`}
      style={stijl}
      role="img"
      aria-label={naam || "avatar"}
    >
      <defs>
        <Verlopen uid={uid} b={basis} />
        <mask id={`${uid}-silhouet`} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="400">
          <g className="masker">
            <Figuur v={v} aan={aan} uid={`${uid}m`} />
            {vindItem(aan.brillen)?.teken({ uid: `${uid}mb`, huid: basis.huid })}
            {vindItem(aan.hoofd)?.teken({ uid: `${uid}mh`, huid: basis.huid })}
          </g>
        </mask>
      </defs>

      <ellipse className="pop-grond" cx={100} cy={378} rx={62} ry={8} fill={`url(#${uid}-grond)`} />
      <g className="pop-sprong">
        <g className="pop-adem">
          <Figuur v={v} aan={aan} uid={uid} />
          <Gezicht v={v} stemming={stemming} />
          {tekenItem(vindItem(aan.brillen), uid, basis)}
          {tekenItem(vindItem(aan.hoofd), uid, basis)}
          <g mask={`url(#${uid}-silhouet)`} pointerEvents="none">
            <rect x={0} y={0} width={200} height={400} fill={`url(#${uid}-licht)`} />
            <rect x={0} y={0} width={200} height={400} fill={`url(#${uid}-onder)`} />
          </g>
        </g>
        {stemming === "zwaar" && <Windje />}
        {stemming === "juich" && <Juichen />}
        {(stemming === "blij" || stemming === "draai") && <Blij />}
        {stemming === "verrast" && <Verrast />}
      </g>
    </svg>
  );
}

/** Eén item als los prentje, voor in de kast en bij de beloning. */
export function ItemPrent({ item, huid = "#f0c2a0", className }: { item: Item; huid?: string; className?: string }) {
  const uid = useId().replace(/[:«»]/g, "");
  return (
    <svg viewBox={item.kader} className={className} role="img" aria-label={item.naam}>
      {item.teken({ uid, huid })}
    </svg>
  );
}
