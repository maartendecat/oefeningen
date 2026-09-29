// De superheld: een kind in een stoere heldenpose, getekend in stripstijl.
// Alle helden staan in dezelfde pose, zodat elk stuk uitrusting op elke held
// past (zie heldvormen.tsx voor de maten).
//
// Van achter naar voor: de lap van de cape, achterhaar, lijf (onder het pak),
// pak, laarzen, embleem, schouderstuk van de cape, gadget, vuisten en
// handschoenen, hals en hoofd, gezicht, voorhaar, masker en helm. Daarboven
// de effecten van de stemming; bij het juichen vliegt de eigen kracht rond.
//
// De animaties zijn die van de pop (globals.css, "Avatar-animaties"), plus
// een paar eigen voor de cape en de gadgets ("Heldenthema").

import { useId, type CSSProperties, type ReactNode } from "react";
import { HELD_START, vindHeldItem, type HeldAan, type HeldItem } from "./heldenitems";
import {
  ARM_L,
  ARM_R,
  Arm,
  BEEN_L,
  BEEN_R,
  HELDLIJN,
  HOOFD,
  OGEN,
  OOG_Y,
  ROMP,
  STRIP,
  Silhouet,
  VUIST_L,
  VUIST_R,
  bliksemPad,
  kristalPad,
  vlamPad,
  wervelPad,
  type Kracht,
} from "./heldvormen";
import { Blij, Verrast, Windje, meng, type Stemming } from "./Pop";
import { sterPad } from "./vormen";

type Kapsel = "stekels" | "krullen" | "lok" | "staart" | "knotjes";

export type HeldBasis = {
  id: string;
  naam: string;
  huid: string;
  /** Een donkerdere huidtint voor de schaduwkant en de neus. */
  schaduw: string;
  haar: string;
  haarDonker: string;
  ogen: string;
  kapsel: Kapsel;
  kracht: Kracht;
  sproeten?: boolean;
};

export const HELDEN: HeldBasis[] = [
  { id: "bliksem", naam: "bliksem", huid: "#f7d5bb", schaduw: "#dfae8e", haar: "#f5c526", haarDonker: "#c08e10", ogen: "#3a7bd5", kapsel: "stekels", kracht: "bliksem" },
  { id: "vlam", naam: "vlam", huid: "#f9dcc6", schaduw: "#e4b192", haar: "#e0481f", haarDonker: "#9e2c12", ogen: "#3f8a4f", kapsel: "krullen", kracht: "vuur", sproeten: true },
  { id: "ijs", naam: "ijs", huid: "#80502f", schaduw: "#613a20", haar: "#231914", haarDonker: "#0b0806", ogen: "#3b2414", kapsel: "lok", kracht: "ijs" },
  { id: "wervel", naam: "wervel", huid: "#dca47c", schaduw: "#bd8159", haar: "#231a20", haarDonker: "#050304", ogen: "#4a2c1a", kapsel: "staart", kracht: "wind" },
  { id: "komeet", naam: "komeet", huid: "#5e3824", schaduw: "#452818", haar: "#1f140e", haarDonker: "#000000", ogen: "#2b1a10", kapsel: "knotjes", kracht: "ster" },
];

export function isHeld(id: string | null | undefined): boolean {
  return HELDEN.some((h) => h.id === id);
}

export function vindHeld(id: string | null): HeldBasis {
  return HELDEN.find((h) => h.id === id) ?? HELDEN[0];
}

/** De letter voor het letterembleem: de eerste letter van de naam. */
export function letterVan(naam: string | null | undefined): string {
  return naam?.trim().charAt(0) || "h";
}

// ---- Haar ---------------------------------------------------------------------

/** Een wolk van rondjes met één buitenlijn: voor krullen en knotjes. */
function Wolk({ kleur, rondjes }: { kleur: string; rondjes: [number, number, number][] }) {
  return (
    <Silhouet kleur={kleur}>
      {rondjes.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
      ))}
    </Silhouet>
  );
}

const KRULLEN: [number, number, number][] = [
  [76, 44, 10], [84, 32, 11], [98, 26, 12], [112, 30, 11], [123, 40, 10], [128, 54, 8], [72, 56, 8],
];

function Achterhaar({ b }: { b: HeldBasis }) {
  switch (b.kapsel) {
    case "krullen":
      return <Wolk kleur={b.haar} rondjes={[...KRULLEN, [70, 68, 8], [130, 68, 8]]} />;
    case "staart":
      return (
        <g className="staart-zwaai">
          <path d="M112 30 Q152 34 148 96 Q146 128 132 150 Q138 102 116 62 Z" fill={b.haar} {...STRIP} />
          <path d="M128 52 Q140 82 134 120" fill="none" stroke={b.haarDonker} strokeWidth={2} />
          <rect x={116} y={30} width={12} height={9} rx={3} transform="rotate(30 122 34)" fill="#e63946" {...STRIP} strokeWidth={2} />
        </g>
      );
    case "knotjes":
      return (
        <g className="knot-wiebel">
          <Wolk kleur={b.haar} rondjes={[[76, 28, 13], [70, 36, 9], [84, 20, 9], [124, 28, 13], [130, 36, 9], [116, 20, 9]]} />
        </g>
      );
    default:
      return null;
  }
}

function Voorhaar({ b }: { b: HeldBasis }) {
  switch (b.kapsel) {
    case "stekels":
      return (
        <g>
          <path
            d="M72 62 Q68 40 78 30 L72 16 L88 24 L92 6 L103 20 L114 4 L116 22 L130 14 L125 32 Q134 44 128 62 Q124 46 112 42 L104 50 L96 40 L86 48 Q76 48 72 62 Z"
            fill={b.haar}
            {...STRIP}
          />
          <path d="M92 16 L96 32 M114 12 L110 30 M80 28 L88 38" fill="none" stroke={b.haarDonker} strokeWidth={2} strokeLinecap="round" />
          <path d="M100 26 L104 36" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
        </g>
      );
    case "krullen":
      return (
        <g>
          <Wolk kleur={b.haar} rondjes={[[80, 40, 8], [91, 36, 8], [103, 36, 8], [114, 38, 8], [122, 46, 7]]} />
          <path d="M88 26 Q94 22 100 23" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" opacity={0.5} />
        </g>
      );
    case "lok":
      return (
        <g>
          <path d="M73 58 Q70 26 100 26 Q130 26 127 58 Q122 40 106 38 Q90 38 80 44 Q75 50 73 58 Z" fill={b.haar} {...STRIP} />
          {/* De witte lok: een beetje ijs in het haar. */}
          <path d="M104 27 Q118 30 120 46 Q112 40 106 39 Q106 32 104 27 Z" fill="#eef8ff" {...STRIP} strokeWidth={2} />
        </g>
      );
    case "staart":
      return (
        <g>
          <path d="M73 60 Q70 26 100 26 Q130 26 127 58 Q120 38 98 36 Q86 44 78 44 Q74 50 73 60 Z" fill={b.haar} {...STRIP} />
          <path d="M84 30 Q94 26 104 28" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        </g>
      );
    case "knotjes":
      return (
        <g>
          <path d="M73 58 Q71 30 100 30 Q129 30 127 58 Q122 42 100 41 Q78 42 73 58 Z" fill={b.haar} {...STRIP} />
          <path d="M100 30 L100 40" stroke={b.haarDonker} strokeWidth={2} />
          <path d="M82 36 Q88 32 95 32" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
        </g>
      );
  }
}

// ---- Lijf en hoofd ---------------------------------------------------------------

function Lijf({ b }: { b: HeldBasis }) {
  return (
    <g>
      <Arm d={ARM_L} kleur={b.huid} />
      <Arm d={ARM_R} kleur={b.huid} />
      <g fill={b.huid} {...STRIP}>
        <path d={BEEN_L} />
        <path d={BEEN_R} />
        <path d={ROMP} />
      </g>
    </g>
  );
}

function Vuisten({ b }: { b: HeldBasis }) {
  return (
    <g fill={b.huid} {...STRIP}>
      <circle cx={VUIST_L.x} cy={VUIST_L.y} r={8.5} />
      <circle cx={VUIST_R.x} cy={VUIST_R.y} r={8.5} />
    </g>
  );
}

function Hoofd({ b }: { b: HeldBasis }) {
  return (
    <g>
      <rect x={92} y={78} width={16} height={26} rx={4} fill={b.huid} {...STRIP} />
      <path d="M93 86 Q100 92 107 86 L107 82 L93 82 Z" fill={b.schaduw} />
      <ellipse cx={74} cy={62} rx={4.5} ry={6.5} fill={b.huid} {...STRIP} />
      <ellipse cx={126} cy={62} rx={4.5} ry={6.5} fill={b.huid} {...STRIP} />
      <ellipse cx={HOOFD.cx} cy={HOOFD.cy} rx={HOOFD.rx} ry={HOOFD.ry} fill={b.huid} {...STRIP} />
      {/* De harde schaduwkant van de strip. */}
      <path d="M118 40 Q128 58 118 80 Q124 70 124 58 Q124 46 118 40 Z" fill={b.schaduw} opacity={0.7} />
    </g>
  );
}

// ---- Gezicht ------------------------------------------------------------------

function OpenOgen({ b, groot }: { b: HeldBasis; groot: boolean }) {
  const rx = groot ? 6.5 : 5.5;
  const ry = groot ? 8 : 7;
  return (
    <g className="oog">
      {OGEN.map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={OOG_Y} rx={rx} ry={ry} fill="#ffffff" stroke={HELDLIJN} strokeWidth={1.8} />
          <circle cx={x + 0.8} cy={OOG_Y + 1} r={groot ? 3.8 : 4} fill={b.ogen} />
          <circle cx={x + 0.8} cy={OOG_Y + 1} r={2} fill={HELDLIJN} />
          <circle cx={x + 2.2} cy={OOG_Y - 1.2} r={1.5} fill="#ffffff" />
        </g>
      ))}
    </g>
  );
}

function LachOgen() {
  return (
    <g fill="none" stroke={HELDLIJN} strokeWidth={3} strokeLinecap="round">
      {OGEN.map((x) => (
        <path key={x} d={`M${x - 6} ${OOG_Y + 2} Q${x} ${OOG_Y - 6} ${x + 6} ${OOG_Y + 2}`} />
      ))}
    </g>
  );
}

function KnijpOgen() {
  return (
    <g fill="none" stroke={HELDLIJN} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M85 ${OOG_Y - 4} L95 ${OOG_Y} L85 ${OOG_Y + 4}`} />
      <path d={`M115 ${OOG_Y - 4} L105 ${OOG_Y} L115 ${OOG_Y + 4}`} />
    </g>
  );
}

function Wenkbrauwen({ kleur, stemming }: { kleur: string; stemming: Stemming }) {
  // Stoer: de binnenkant een beetje lager.
  const d = {
    rust: "M82 50 L96 53 M104 53 L118 50",
    blij: "M82 48 Q89 45 96 49 M104 49 Q111 45 118 48",
    juich: "M82 47 Q89 43 96 47 M104 47 Q111 43 118 47",
    draai: "M82 48 Q89 45 96 49 M104 49 Q111 45 118 48",
    zwaar: "M82 52 L96 49 M104 49 L118 52",
    verrast: "M82 45 Q89 41 96 44 M104 44 Q111 41 118 45",
  }[stemming];
  return <path d={d} fill="none" stroke={kleur} strokeWidth={3.4} strokeLinecap="round" />;
}

function Mond({ stemming }: { stemming: Stemming }) {
  switch (stemming) {
    case "blij":
    case "juich":
    case "draai":
      return (
        <g strokeLinejoin="round">
          <path d="M89 72 Q100 88 111 72 Z" fill="#7a1f2e" stroke={HELDLIJN} strokeWidth={2.2} />
          <path d="M91 72.5 L109 72.5 L108 75.5 L92 75.5 Z" fill="#ffffff" />
          <path d="M95 81 Q100 77 105 81 Q100 84 95 81 Z" fill="#ff7a8a" />
        </g>
      );
    case "zwaar":
      return <ellipse cx={103} cy={76} rx={3} ry={3.4} fill="#7a1f2e" stroke={HELDLIJN} strokeWidth={1.8} />;
    case "verrast":
      return <ellipse cx={100} cy={76} rx={4} ry={5} fill="#7a1f2e" stroke={HELDLIJN} strokeWidth={1.8} />;
    default:
      // Een zelfzeker glimlachje, een beetje scheef.
      return <path d="M91 74 Q101 80 109 71" fill="none" stroke={HELDLIJN} strokeWidth={2.6} strokeLinecap="round" />;
  }
}

function Gezicht({ b, stemming }: { b: HeldBasis; stemming: Stemming }) {
  const lacht = stemming === "blij" || stemming === "juich" || stemming === "draai";
  return (
    <g>
      <Wenkbrauwen kleur={b.haarDonker} stemming={stemming} />
      {lacht ? <LachOgen /> : stemming === "zwaar" ? <KnijpOgen /> : <OpenOgen b={b} groot={stemming === "verrast"} />}
      <path d="M100 63 Q103 68 99 70" fill="none" stroke={b.schaduw} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={82} cy={71} rx={5} ry={3} fill="#ff6f6f" opacity={0.3} />
      <ellipse cx={118} cy={71} rx={5} ry={3} fill="#ff6f6f" opacity={0.3} />
      {b.sproeten && (
        <g fill={meng(b.huid, "#8a3a1a", 0.45)}>
          {[
            [80, 68], [84, 70], [79, 72], [120, 68], [116, 70], [121, 72],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} />
          ))}
        </g>
      )}
      <Mond stemming={stemming} />
    </g>
  );
}

// ---- Krachten ------------------------------------------------------------------

const KRACHT_KLEUR: Record<Kracht, [string, string]> = {
  bliksem: ["#ffcc1a", "#fff3b0"],
  vuur: ["#ff7a1a", "#ffcc1a"],
  ijs: ["#a8e4ff", "#ffffff"],
  wind: ["#8fd8c8", "#e6fffa"],
  ster: ["#ffcc1a", "#ffffff"],
};

function krachtVorm(k: Kracht, x: number, y: number, kleur: string): ReactNode {
  switch (k) {
    case "bliksem":
      return <path d={bliksemPad(x, y, 9)} fill={kleur} {...STRIP} strokeWidth={1.8} />;
    case "vuur":
      return <path d={vlamPad(x, y, 8)} fill={kleur} {...STRIP} strokeWidth={1.8} />;
    case "ijs":
      return (
        <g>
          <path d={kristalPad(x, y, 8)} stroke={HELDLIJN} strokeWidth={5} strokeLinecap="round" />
          <path d={kristalPad(x, y, 8)} stroke={kleur} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      );
    case "wind":
      return (
        <g fill="none" strokeLinecap="round">
          <path d={wervelPad(x, y, 8)} stroke={HELDLIJN} strokeWidth={5} />
          <path d={wervelPad(x, y, 8)} stroke={kleur} strokeWidth={2.4} />
        </g>
      );
    case "ster":
      return <path d={sterPad(x, y, 9)} fill={kleur} {...STRIP} strokeWidth={1.8} />;
  }
}

const ZWEVERS: [number, number][] = [
  [52, 44], [148, 36], [40, 110], [162, 100], [100, 0], [156, 160], [44, 170],
];

/** De eigen kracht vliegt rond de held. */
function Juichen({ kracht }: { kracht: Kracht }) {
  const [a, b] = KRACHT_KLEUR[kracht];
  return (
    <g>
      {ZWEVERS.map(([x, y], i) => (
        <g key={i} className="zweef" style={{ animationDelay: `${i * 0.26}s` }}>
          {krachtVorm(kracht, x, y, i % 2 ? b : a)}
        </g>
      ))}
    </g>
  );
}

// ---- Samenstellen ---------------------------------------------------------------

export const HELD_VOLLEDIG = "0 0 200 400";
/** Hoofd en schouders, even groot als het portret van de pop. */
export const HELD_PORTRET = "36 -4 128 128";

function spreiding(uid: string): number {
  let h = 0;
  for (const c of uid) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return h;
}

export function Held({
  basis,
  aan = HELD_START,
  naam,
  className,
  kader = HELD_VOLLEDIG,
  stemming = "rust",
}: {
  basis: HeldBasis;
  aan?: HeldAan;
  naam?: string | null;
  className?: string;
  kader?: string;
  stemming?: Stemming;
}) {
  const uid = useId().replace(/[:«»]/g, "");
  const t = { uid, huid: basis.huid, letter: letterVan(naam) };
  const item = (id: string | undefined) => vindHeldItem(id);
  const teken = (i: HeldItem | undefined) => (i ? <g key={i.id}>{i.teken({ ...t, uid: `${uid}-${i.id}` })}</g> : null);
  const cape = item(aan.capes);
  const s = spreiding(uid);
  const stijl = { "--knipper": `${-(s % 5000)}ms`, "--wieg": `${-(s % 3000)}ms` } as CSSProperties;

  return (
    <svg
      viewBox={kader}
      className={`pop held stemming-${stemming} ${className ?? ""}`}
      style={stijl}
      role="img"
      aria-label={naam || "avatar"}
    >
      <ellipse className="pop-grond" cx={100} cy={374} rx={64} ry={8} fill={HELDLIJN} opacity={0.18} />
      <g className="pop-sprong">
        <g className="pop-adem">
          {cape?.achter && <g className="cape-wapper">{cape.achter({ ...t, uid: `${uid}-achter` })}</g>}
          <Achterhaar b={basis} />
          <Lijf b={basis} />
          {teken(item(aan.pakken))}
          {teken(item(aan.laarzen))}
          {teken(item(aan.emblemen))}
          {teken(cape)}
          {teken(item(aan.gadgets))}
          <Vuisten b={basis} />
          {teken(item(aan.handschoenen))}
          <Hoofd b={basis} />
          <Gezicht b={basis} stemming={stemming} />
          <Voorhaar b={basis} />
          {teken(item(aan.maskers))}
          {teken(item(aan.helmen))}
        </g>
        {stemming === "zwaar" && <Windje />}
        {stemming === "juich" && <Juichen kracht={basis.kracht} />}
        {(stemming === "blij" || stemming === "draai") && <Blij />}
        {stemming === "verrast" && <Verrast />}
      </g>
    </svg>
  );
}

/** Eén stuk uitrusting als los prentje, voor in het hoofdkwartier en bij de beloning. */
export function HeldItemPrent({
  item,
  huid = "#f7d5bb",
  naam,
  className,
}: {
  item: HeldItem;
  huid?: string;
  naam?: string | null;
  className?: string;
}) {
  const uid = useId().replace(/[:«»]/g, "");
  const t = { uid, huid, letter: letterVan(naam) };
  return (
    <svg viewBox={item.kader} className={`held-prent ${className ?? ""}`} role="img" aria-label={item.naam}>
      {item.achter?.({ ...t, uid: `${uid}-a` })}
      {item.teken(t)}
    </svg>
  );
}
