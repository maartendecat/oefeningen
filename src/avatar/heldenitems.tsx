// De uitrusting van de superhelden. Net als de kleren van de pop tekent elk
// item zichzelf in het assenstelsel van de avatar (viewBox 0 0 200 400), zodat
// het op elke held past. `kader` is het stukje dat getoond wordt als los
// prentje in het hoofdkwartier.

import type { ReactNode } from "react";
import {
  ARM_L,
  ARM_R,
  Arm,
  BEEN_L,
  BEEN_R,
  BORST,
  BROEKJE,
  HELDLIJN,
  Knip,
  LAARS,
  MANCHET_L,
  MANCHET_R,
  ROMP,
  STRIP,
  VUIST_L,
  VUIST_R,
  bliksemPad,
  kristalPad,
  vlamPad,
} from "./heldvormen";
import { Paar, hartPad, sterPad, vonkPad } from "./vormen";

export type HeldCategorie =
  | "pakken"
  | "capes"
  | "maskers"
  | "emblemen"
  | "helmen"
  | "laarzen"
  | "handschoenen"
  | "gadgets";

export const HELD_CATEGORIEEN: { id: HeldCategorie; naam: string; icoon: string }[] = [
  { id: "pakken", naam: "pakken", icoon: "🦸" },
  { id: "capes", naam: "capes", icoon: "🧣" },
  { id: "maskers", naam: "maskers", icoon: "🎭" },
  { id: "emblemen", naam: "emblemen", icoon: "⭐" },
  { id: "helmen", naam: "helmen", icoon: "⛑️" },
  { id: "laarzen", naam: "laarzen", icoon: "🥾" },
  { id: "handschoenen", naam: "handschoenen", icoon: "🧤" },
  { id: "gadgets", naam: "gadgets", icoon: "🛡️" },
];

export type HeldTeken = {
  uid: string;
  huid: string;
  /** De eerste letter van de naam van de held, voor het letterembleem. */
  letter: string;
};

export type HeldItem = {
  id: string;
  naam: string;
  categorie: HeldCategorie;
  /** De startuitrusting heeft elke held van bij het begin. */
  start?: boolean;
  kader: string;
  teken: (t: HeldTeken) => ReactNode;
  /** Wat achter het lijf hangt (de lap van een cape). */
  achter?: (t: HeldTeken) => ReactNode;
};

export type HeldAan = Partial<Record<HeldCategorie, string>>;

/** Wat ook helemaal uit mag; een pak, laarzen en handschoenen heeft een held altijd. */
export const HELD_UITTREKBAAR: HeldCategorie[] = ["capes", "maskers", "emblemen", "helmen", "gadgets"];

// ---- Kleuren -------------------------------------------------------------------

const ROOD = "#e63946";
const ROOD_D = "#b82232";
const GEEL = "#ffcc1a";
const GEEL_D = "#e0a100";
const BLAUW = "#2f6fe0";
const BLAUW_D = "#1f4fb0";
const MARINE = "#1d3f9a";
const ZILVER = "#c3ccd6";
const ZILVER_D = "#8d99a8";
const GOUD = "#f5b800";
const GOUD_D = "#c98a00";
const IJS = "#a8e4ff";
const WIT = "#ffffff";

// ---- Pakken ------------------------------------------------------------------

/**
 * Een heldenpak: mouwen, benen en romp, met een harde schaduw op de rechterkant.
 * `patroon` komt over romp en benen, geknipt op het pak.
 */
function Pak({
  uid,
  kleur,
  schaduw,
  mouw = kleur,
  patroon,
  broekje,
  riem,
}: {
  uid: string;
  kleur: string;
  schaduw: string;
  mouw?: string;
  patroon?: ReactNode;
  broekje?: string;
  riem?: string;
}) {
  return (
    <g>
      <Arm d={ARM_L} kleur={mouw} />
      <Arm d={ARM_R} kleur={mouw} />
      <path d="M127 116 L140 150 L143 184" fill="none" stroke={schaduw} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      {[BEEN_L, BEEN_R].map((d, i) => (
        <Knip key={d} id={`${uid}-been${i}`} d={d} fill={kleur}>
          <path d={i === 0 ? "M91 190 L101 190 L95 345 L86 345 Z" : "M121 190 L140 190 L140 345 L125 345 Z"} fill={schaduw} />
          {patroon}
        </Knip>
      ))}
      <Knip id={`${uid}-romp`} d={ROMP} fill={kleur}>
        <path d="M114 96 L140 96 L140 200 L112 200 Q116 150 114 96 Z" fill={schaduw} />
        {patroon}
      </Knip>
      <path d="M80 114 Q77 128 80 142" fill="none" stroke={WIT} strokeWidth={3} strokeLinecap="round" opacity={0.45} />
      {broekje && (
        <Knip id={`${uid}-broekje`} d={BROEKJE} fill={broekje}>
          <path d="M112 170 L130 170 L130 215 L106 215 Z" fill={HELDLIJN} opacity={0.18} />
        </Knip>
      )}
      {riem && (
        <g>
          <rect x={76} y={172} width={48} height={9} rx={2} fill={riem} {...STRIP} />
          <rect x={94} y={170} width={12} height={13} rx={2} fill={GEEL} {...STRIP} strokeWidth={2.2} />
        </g>
      )}
    </g>
  );
}

/** Vlammetjes onderaan, voor het vuurpak en de vuurhandschoenen. */
function Vlammen({ punten, y, s }: { punten: number[]; y: number; s: number }) {
  return (
    <g>
      {punten.map((x) => (
        <g key={x}>
          <path d={vlamPad(x, y, s)} fill={GEEL} />
          <path d={vlamPad(x, y + s * 0.3, s * 0.55)} fill="#fff3b0" />
        </g>
      ))}
    </g>
  );
}

// ---- Capes ---------------------------------------------------------------------

/** De lap van een cape, van de schouders tot `onder`, `wijd` naar buiten. */
function capePad(onder: number, wijd: number, rand: "recht" | "golf" | "scheur" | "vleugel" = "golf"): string {
  const l = 100 - wijd;
  const r = 100 + wijd;
  const begin = `M76 102 Q100 112 124 102 L${r} ${onder}`;
  switch (rand) {
    case "recht":
      return `${begin} Q100 ${onder + 10} ${l} ${onder} Z`;
    case "golf": {
      const stap = (r - l) / 4;
      let d = begin;
      for (let i = 1; i <= 4; i++) {
        d += ` Q${r - stap * (i - 0.5)} ${onder + (i % 2 ? 10 : -4)} ${r - stap * i} ${onder}`;
      }
      return `${d} Z`;
    }
    case "scheur": {
      const tanden = [
        [0.12, 14], [0.2, -6], [0.32, 18], [0.4, -2], [0.5, 12], [0.6, -8], [0.7, 16], [0.8, 0], [0.9, 12],
      ];
      return `${begin} ${tanden.map(([t, dy]) => `L${(r - (r - l) * t).toFixed(1)} ${onder + dy}`).join(" ")} L${l} ${onder} Z`;
    }
    case "vleugel": {
      // Uitgeschulpt als vleermuisvleugels.
      const stap = (r - l) / 5;
      let d = begin;
      for (let i = 1; i <= 5; i++) {
        d += ` Q${r - stap * (i - 0.5)} ${onder - 22} ${r - stap * i} ${onder}`;
      }
      return `${d} Z`;
    }
  }
}

/** Het stukje cape dat over de schouders valt, met een gesp. */
function CapeVoor({ kleur, gesp = GOUD }: { kleur: string; gesp?: string }) {
  return (
    <g>
      <Paar>
        <path d="M68 110 Q72 99 86 99 L86 108 Q76 108 68 110 Z" fill={kleur} {...STRIP} />
        <circle cx={86} cy={106} r={4.5} fill={gesp} {...STRIP} strokeWidth={2} />
      </Paar>
    </g>
  );
}

const CAPE_KADER = "36 90 128 264";

// ---- Maskers ------------------------------------------------------------------

/** Twee oogvormige gaten, om uit een masker te knippen. */
const OOGGATEN =
  "M83.5 61 a6.5 8 0 1 0 13 0 a6.5 8 0 1 0 -13 0 Z M103.5 61 a6.5 8 0 1 0 13 0 a6.5 8 0 1 0 -13 0 Z";
const DOMINO =
  "M72 57 Q78 47 92 51 Q100 54 108 51 Q122 47 128 57 Q130 68 118 71 Q106 73 100 65 Q94 73 82 71 Q70 68 72 57 Z";
const KAT =
  "M68 50 Q80 50 92 52 Q100 55 108 52 Q120 50 132 50 Q128 66 118 71 Q106 73 100 65 Q94 73 82 71 Q72 66 68 50 Z";
const MASKER_KADER = "62 36 76 44";

// ---- Emblemen -----------------------------------------------------------------

const { x: BX, y: BY } = BORST;
const EMBLEEM_KADER = "80 112 40 40";

// ---- Laarzen -------------------------------------------------------------------

const LAARS_KADER = "46 292 108 84";

function Laarzen({ kleur, schaduw, rand }: { kleur: string; schaduw: string; rand?: string }) {
  return (
    <Paar>
      <path d={LAARS} fill={kleur} {...STRIP} />
      <path d="M84 302 L91 302 L90 350 Q92 360 90 368 L80 368 Q86 340 84 302 Z" fill={schaduw} />
      <path d={LAARS} fill="none" {...STRIP} />
      <path d="M55 364 L91 364" stroke={HELDLIJN} strokeWidth={2} />
      {rand && <path d="M66 298 L95 298 L94 312 L67 312 Z" fill={rand} {...STRIP} />}
    </Paar>
  );
}

// ---- Handschoenen ---------------------------------------------------------------

const HAND_KADER = "44 134 112 82";

function Handschoenen({ kleur, manchet = kleur, groot = 9.5 }: { kleur: string; manchet?: string; groot?: number }) {
  return (
    <g>
      <Arm d={MANCHET_L} kleur={manchet} dikte={19} />
      <Arm d={MANCHET_R} kleur={manchet} dikte={19} />
      {[VUIST_L, VUIST_R].map(({ x, y }) => (
        <g key={x}>
          <circle cx={x} cy={y} r={groot} fill={kleur} {...STRIP} />
          <path d={`M${x - groot * 0.6} ${y - 1} Q${x} ${y + 2} ${x + groot * 0.6} ${y - 1}`} fill="none" stroke={HELDLIJN} strokeWidth={1.6} strokeLinecap="round" />
          <circle cx={x - groot * 0.35} cy={y - groot * 0.35} r={groot * 0.22} fill={WIT} opacity={0.6} />
        </g>
      ))}
    </g>
  );
}

// ---- De items -------------------------------------------------------------------

const PAK_KADER = "40 92 120 256";

export const HELD_ITEMS: HeldItem[] = [
  // Startuitrusting
  {
    id: "heldenpak-start",
    naam: "blauw heldenpak",
    categorie: "pakken",
    start: true,
    kader: PAK_KADER,
    teken: ({ uid }) => <Pak uid={uid} kleur={BLAUW} schaduw={BLAUW_D} broekje={ROOD} riem={GEEL} />,
  },
  {
    id: "laarzen-start",
    naam: "blauwe laarzen",
    categorie: "laarzen",
    start: true,
    kader: LAARS_KADER,
    teken: () => <Laarzen kleur={MARINE} schaduw="#142c70" rand={MARINE} />,
  },
  {
    id: "handschoenen-start",
    naam: "blauwe handschoenen",
    categorie: "handschoenen",
    start: true,
    kader: HAND_KADER,
    teken: () => <Handschoenen kleur={MARINE} />,
  },

  // Pakken
  {
    id: "flitspak",
    naam: "flitspak",
    categorie: "pakken",
    kader: PAK_KADER,
    teken: ({ uid }) => (
      <Pak
        uid={uid}
        kleur={ROOD}
        schaduw={ROOD_D}
        riem={GEEL_D}
        patroon={
          <g>
            <path d="M60 110 L130 150 L130 162 L60 122 Z" fill={GEEL} />
            <path d="M69 190 L75 190 L71 345 L65 345 Z M125 190 L131 190 L135 345 L129 345 Z" fill={GEEL} />
          </g>
        }
      />
    ),
  },
  {
    id: "ninjapak",
    naam: "ninjapak",
    categorie: "pakken",
    kader: PAK_KADER,
    teken: ({ uid }) => (
      <g>
        <Pak
          uid={uid}
          kleur="#34344a"
          schaduw="#22222f"
          patroon={
            <path
              d="M60 240 L140 250 M60 252 L140 262 M60 300 L140 310 M60 312 L140 322"
              stroke="#56566e"
              strokeWidth={4}
            />
          }
        />
        <path d="M76 170 L124 170 L124 182 L76 182 Z" fill={ROOD} {...STRIP} />
        <path d="M118 176 L132 206 L124 208 L114 182 Z" fill={ROOD} {...STRIP} />
        <path d="M82 104 L100 132 L118 104" fill="none" stroke="#56566e" strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "drakenpak",
    naam: "drakenpak",
    categorie: "pakken",
    kader: PAK_KADER,
    teken: ({ uid }) => {
      const schubben: string[] = [];
      for (let y = 110; y < 350; y += 12) {
        for (let x = 60 + ((y / 12) % 2) * 6; x < 142; x += 12) schubben.push(`M${x - 6} ${y} Q${x} ${y + 8} ${x + 6} ${y}`);
      }
      return (
        <g>
          <Pak
            uid={uid}
            kleur="#2fae5a"
            schaduw="#20854a"
            mouw="#2fae5a"
            patroon={<path d={schubben.join(" ")} fill="none" stroke="#1d7a40" strokeWidth={1.6} />}
          />
          <path d="M88 110 L112 110 L110 188 L90 188 Z" fill="#c8e86a" {...STRIP} />
          <path d="M90 124 L110 124 M90 138 L110 138 M91 152 L109 152 M91 166 L109 166" stroke="#8fb33c" strokeWidth={2} />
        </g>
      );
    },
  },
  {
    id: "robotpak",
    naam: "robotpak",
    categorie: "pakken",
    kader: PAK_KADER,
    teken: ({ uid }) => (
      <g>
        <Pak
          uid={uid}
          kleur={ZILVER}
          schaduw={ZILVER_D}
          patroon={<path d="M60 150 L140 150 M60 230 L140 230 M60 290 L140 290" stroke={ZILVER_D} strokeWidth={2.5} />}
        />
        {[
          [80, 112], [120, 112], [82, 184], [118, 184], [82, 226], [118, 226],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} fill={ZILVER_D} stroke={HELDLIJN} strokeWidth={1} />
        ))}
        <g fill="#8d99a8" {...STRIP}>
          <rect x={72} y={252} width={22} height={16} rx={4} />
          <rect x={106} y={252} width={22} height={16} rx={4} />
        </g>
        <circle className="gloei" cx={100} cy={168} r={5} fill="#5ff2ff" {...STRIP} strokeWidth={2} />
      </g>
    ),
  },
  {
    id: "sterrenpak",
    naam: "sterrenpak",
    categorie: "pakken",
    kader: PAK_KADER,
    teken: ({ uid }) => (
      <Pak
        uid={uid}
        kleur="#5b3fc4"
        schaduw="#432c9c"
        broekje="#2b1d6e"
        riem={GOUD}
        patroon={
          <g>
            {[
              [82, 116, 4], [118, 150, 3], [84, 160, 3], [80, 214, 4], [120, 230, 4], [86, 278, 3],
              [116, 296, 3.5], [78, 322, 3], [124, 332, 3], [112, 116, 2.5],
            ].map(([x, y, r]) => (
              <path key={`${x}-${y}`} className="fonkel" d={sterPad(x, y, r)} fill={y % 2 ? "#fff3b0" : WIT} />
            ))}
          </g>
        }
      />
    ),
  },
  {
    id: "vuurpak",
    naam: "vuurpak",
    categorie: "pakken",
    kader: PAK_KADER,
    teken: ({ uid }) => (
      <Pak
        uid={uid}
        kleur="#ff7a1a"
        schaduw="#d85c08"
        riem={ROOD_D}
        patroon={
          <g>
            <path d="M60 350 L60 300 Q66 280 72 300 Q76 270 82 296 Q88 276 94 300 Q100 272 106 300 Q112 276 118 296 Q124 270 128 300 Q134 280 140 300 L140 350 Z" fill={ROOD} />
            <path d="M60 350 L60 320 Q66 306 72 322 Q78 300 86 322 Q94 304 100 322 Q106 304 114 322 Q122 300 128 322 Q134 306 140 320 L140 350 Z" fill={GEEL} />
          </g>
        }
      />
    ),
  },

  // Capes
  {
    id: "rode-cape",
    naam: "korte rode cape",
    categorie: "capes",
    kader: CAPE_KADER,
    achter: () => <path d={capePad(236, 38, "golf")} fill={ROOD} {...STRIP} />,
    teken: () => <CapeVoor kleur={ROOD} />,
  },
  {
    id: "zwarte-cape",
    naam: "lange zwarte cape",
    categorie: "capes",
    kader: CAPE_KADER,
    achter: ({ uid }) => (
      <g>
        {/* Een hoge kraag achter het hoofd. */}
        <path d="M70 104 L60 60 L84 84 L100 70 L116 84 L140 60 L130 104 Z" fill={ROOD_D} {...STRIP} />
        <Knip id={`${uid}-voering`} d={capePad(350, 52, "recht")} fill="#26243a">
          <path d="M40 330 Q100 346 160 330 L160 370 L40 370 Z" fill={ROOD_D} />
        </Knip>
      </g>
    ),
    teken: () => <CapeVoor kleur="#26243a" gesp={ROOD} />,
  },
  {
    id: "sterrencape",
    naam: "sterrencape",
    categorie: "capes",
    kader: CAPE_KADER,
    achter: ({ uid }) => (
      <Knip id={`${uid}-sterren`} d={capePad(320, 48, "golf")} fill={BLAUW_D}>
        {[
          [62, 200], [138, 190], [58, 280], [142, 270], [70, 316], [130, 312], [54, 240], [146, 234],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} className="fonkel" d={sterPad(x, y, 5)} fill={WIT} />
        ))}
      </Knip>
    ),
    teken: () => <CapeVoor kleur={BLAUW_D} gesp={WIT} />,
  },
  {
    id: "gouden-cape",
    naam: "gouden cape",
    categorie: "capes",
    kader: CAPE_KADER,
    achter: ({ uid }) => (
      <Knip id={`${uid}-goud`} d={capePad(330, 50, "recht")} fill={GOUD}>
        <path d="M130 100 L160 100 L160 360 L140 360 Z" fill={GOUD_D} />
        <path d="M58 200 Q54 260 60 320" fill="none" stroke="#fff3b0" strokeWidth={4} strokeLinecap="round" />
        <path className="fonkel" d={vonkPad(62, 180, 6)} fill={WIT} />
        <path className="fonkel" d={vonkPad(142, 300, 5)} fill={WIT} />
      </Knip>
    ),
    teken: () => <CapeVoor kleur={GOUD} gesp={ROOD} />,
  },
  {
    id: "strijderscape",
    naam: "strijderscape",
    categorie: "capes",
    kader: CAPE_KADER,
    achter: () => (
      <g>
        <path d={capePad(300, 44, "scheur")} fill="#6b5b4a" {...STRIP} />
        <path d="M66 180 L62 250 M134 180 L138 250" stroke="#54473a" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ),
    teken: () => <CapeVoor kleur="#6b5b4a" gesp={ZILVER} />,
  },
  {
    id: "vleugelcape",
    naam: "vleugelcape",
    categorie: "capes",
    kader: "20 90 160 220",
    achter: () => (
      <g>
        <path d={capePad(290, 76, "vleugel")} fill="#6a2c91" {...STRIP} />
        <path d="M100 110 L40 280 M100 110 L70 290 M100 110 L130 290 M100 110 L160 280" stroke="#4f1f6e" strokeWidth={2.5} />
      </g>
    ),
    teken: () => <CapeVoor kleur="#6a2c91" gesp={GEEL} />,
  },

  // Maskers (ogen op 90,61 en 110,61)
  {
    id: "rood-masker",
    naam: "rood oogmasker",
    categorie: "maskers",
    kader: MASKER_KADER,
    teken: () => (
      <g>
        <path d="M126 60 Q136 62 140 74 M126 63 Q132 68 132 80" fill="none" stroke={ROOD} strokeWidth={4} strokeLinecap="round" />
        <path d={`${DOMINO} ${OOGGATEN}`} fill={ROOD} fillRule="evenodd" {...STRIP} strokeWidth={2.4} />
      </g>
    ),
  },
  {
    id: "zwart-masker",
    naam: "zwart kattenmasker",
    categorie: "maskers",
    kader: MASKER_KADER,
    teken: () => (
      <g>
        <path d={`${KAT} ${OOGGATEN}`} fill="#26243a" fillRule="evenodd" {...STRIP} strokeWidth={2.4} />
        <path d="M76 54 Q84 51 90 52" fill="none" stroke="#5a5874" strokeWidth={2} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "vizierbril",
    naam: "vizierbril",
    categorie: "maskers",
    kader: MASKER_KADER,
    teken: () => (
      <g>
        <path d="M72 58 L66 60 M128 58 L134 60" stroke={HELDLIJN} strokeWidth={5} strokeLinecap="round" />
        <rect x={72} y={52} width={56} height={17} rx={8.5} fill="#38d6ff99" {...STRIP} strokeWidth={2.4} />
        <path d="M78 57 L92 57" stroke={WIT} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      </g>
    ),
  },
  {
    id: "ninjamasker",
    naam: "ninjamasker",
    categorie: "maskers",
    kader: "62 44 76 52",
    teken: () => (
      <g>
        <path d="M73 66 Q100 72 127 66 Q128 80 118 87 Q100 95 82 87 Q72 80 73 66 Z" fill="#34344a" {...STRIP} strokeWidth={2.4} />
        <path d="M86 78 Q100 82 114 78" fill="none" stroke="#56566e" strokeWidth={2} />
      </g>
    ),
  },
  {
    id: "robotvizier",
    naam: "robotvizier",
    categorie: "maskers",
    kader: MASKER_KADER,
    teken: ({ uid }) => (
      <g>
        <rect x={68} y={50} width={64} height={22} rx={6} fill={ZILVER} {...STRIP} strokeWidth={2.4} />
        <Knip id={`${uid}-scherm`} d="M74 55 L126 55 L126 67 L74 67 Z" fill="#ff4d2e">
          <rect className="scan" x={74} y={55} width={10} height={12} fill="#ffd0c4" opacity={0.8} />
        </Knip>
      </g>
    ),
  },
  {
    id: "vlindermasker",
    naam: "vlindermasker",
    categorie: "maskers",
    kader: MASKER_KADER,
    teken: () => (
      <g>
        <path
          d={`M100 58 Q92 44 78 42 Q66 44 70 56 Q66 70 80 72 Q94 72 100 64 Q106 72 120 72 Q134 70 130 56 Q134 44 122 42 Q108 44 100 58 Z ${OOGGATEN}`}
          fill="#e05bb0"
          fillRule="evenodd"
          {...STRIP}
          strokeWidth={2.4}
        />
        <circle cx={74} cy={50} r={2.5} fill={GEEL} />
        <circle cx={126} cy={50} r={2.5} fill={GEEL} />
        <path d="M98 52 Q94 42 90 38 M102 52 Q106 42 110 38" fill="none" stroke={HELDLIJN} strokeWidth={2} strokeLinecap="round" />
      </g>
    ),
  },

  // Emblemen (midden van de borst)
  {
    id: "embleem-bliksem",
    naam: "bliksem",
    categorie: "emblemen",
    kader: EMBLEEM_KADER,
    teken: () => (
      <g>
        <circle cx={BX} cy={BY} r={15} fill={GEEL} {...STRIP} />
        <path d={bliksemPad(BX - 2, BY, 12)} fill={ROOD} {...STRIP} strokeWidth={2} />
      </g>
    ),
  },
  {
    id: "embleem-ster",
    naam: "ster",
    categorie: "emblemen",
    kader: EMBLEEM_KADER,
    teken: () => (
      <g>
        <circle cx={BX} cy={BY} r={15} fill={WIT} {...STRIP} />
        <path d={sterPad(BX, BY + 1, 12)} fill={GOUD} {...STRIP} strokeWidth={2} />
      </g>
    ),
  },
  {
    id: "embleem-vlam",
    naam: "vlam",
    categorie: "emblemen",
    kader: EMBLEEM_KADER,
    teken: () => (
      <g>
        <path d={`M${BX} ${BY - 17} L${BX + 16} ${BY} L${BX} ${BY + 17} L${BX - 16} ${BY} Z`} fill="#26243a" {...STRIP} />
        <path d={vlamPad(BX, BY + 1, 11)} fill="#ff7a1a" {...STRIP} strokeWidth={2} />
        <path d={vlamPad(BX, BY + 5, 6)} fill={GEEL} />
      </g>
    ),
  },
  {
    id: "embleem-schild",
    naam: "schild",
    categorie: "emblemen",
    kader: EMBLEEM_KADER,
    teken: () => (
      <g>
        <path d={`M${BX - 14} ${BY - 14} L${BX + 14} ${BY - 14} L${BX + 14} ${BY} Q${BX + 12} ${BY + 12} ${BX} ${BY + 17} Q${BX - 12} ${BY + 12} ${BX - 14} ${BY} Z`} fill={ZILVER} {...STRIP} />
        <path d={`M${BX - 3} ${BY - 14} L${BX + 3} ${BY - 14} L${BX + 3} ${BY + 15} L${BX - 3} ${BY + 15} Z`} fill={ROOD} />
        <path d={`M${BX - 14} ${BY - 4} L${BX + 14} ${BY - 4} L${BX + 14} ${BY + 2} L${BX - 13} ${BY + 2} Z`} fill={ROOD} />
        <path d={`M${BX - 14} ${BY - 14} L${BX + 14} ${BY - 14} L${BX + 14} ${BY} Q${BX + 12} ${BY + 12} ${BX} ${BY + 17} Q${BX - 12} ${BY + 12} ${BX - 14} ${BY} Z`} fill="none" {...STRIP} />
      </g>
    ),
  },
  {
    id: "embleem-hart",
    naam: "hart",
    categorie: "emblemen",
    kader: EMBLEEM_KADER,
    teken: () => (
      <g>
        <circle cx={BX} cy={BY} r={15} fill={WIT} {...STRIP} />
        <path d={hartPad(BX, BY + 1, 10)} fill={ROOD} {...STRIP} strokeWidth={2} />
      </g>
    ),
  },
  {
    id: "embleem-letter",
    naam: "letter van je naam",
    categorie: "emblemen",
    kader: EMBLEEM_KADER,
    teken: ({ letter }) => (
      <g>
        <path d={`M${BX} ${BY - 17} L${BX + 17} ${BY} L${BX} ${BY + 17} L${BX - 17} ${BY} Z`} fill={GEEL} {...STRIP} />
        <text
          x={BX}
          y={BY + 6.5}
          textAnchor="middle"
          fontSize={19}
          fontWeight={700}
          fontFamily="var(--font-andika), system-ui, sans-serif"
          fill={ROOD}
          stroke={HELDLIJN}
          strokeWidth={1}
        >
          {letter}
        </text>
      </g>
    ),
  },

  // Helmen en hoofddeksels (hoofd: 74-126, 30-86)
  {
    id: "vleugelhelm",
    naam: "vleugelhelm",
    categorie: "helmen",
    kader: "46 10 108 60",
    teken: () => (
      <g>
        <Paar>
          <path d="M76 42 Q58 26 50 30 Q58 34 56 38 Q48 38 48 44 Q58 44 60 46 Q54 50 58 54 Q68 48 78 50 Z" fill={WIT} {...STRIP} strokeWidth={2.4} />
        </Paar>
        <path d="M72 50 Q70 24 100 22 Q130 24 128 50 Q100 42 72 50 Z" fill={ZILVER} {...STRIP} />
        <path d="M112 28 Q124 34 124 46" fill="none" stroke={ZILVER_D} strokeWidth={3} strokeLinecap="round" />
        <path d="M80 36 Q86 30 94 28" fill="none" stroke={WIT} strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "ridderhelm",
    naam: "ridderhelm",
    categorie: "helmen",
    kader: "62 0 76 90",
    teken: () => (
      <g>
        <path d="M100 22 Q98 6 112 2 Q108 12 118 10 Q110 18 106 24 Z" fill={ROOD} {...STRIP} strokeWidth={2.2} />
        <path d="M70 70 Q66 22 100 20 Q134 22 130 70 L122 84 L122 52 Q100 44 78 52 L78 84 Z" fill={ZILVER} {...STRIP} />
        <path d="M76 40 Q100 30 124 40 L124 50 Q100 42 76 50 Z" fill={ZILVER_D} {...STRIP} strokeWidth={2.2} />
        <path d="M84 45 L116 45" stroke={HELDLIJN} strokeWidth={2} strokeDasharray="4 3" />
        <path d="M76 30 Q84 24 94 23" fill="none" stroke={WIT} strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "antennes",
    naam: "antennes",
    categorie: "helmen",
    kader: "66 0 68 52",
    teken: () => (
      <g>
        <g className="antenne-links">
          <path d="M86 38 Q80 20 76 10" fill="none" stroke={HELDLIJN} strokeWidth={3} strokeLinecap="round" />
          <circle cx={76} cy={9} r={5} fill="#7bf06a" {...STRIP} strokeWidth={2.2} />
        </g>
        <g className="antenne-rechts">
          <path d="M114 38 Q120 20 124 10" fill="none" stroke={HELDLIJN} strokeWidth={3} strokeLinecap="round" />
          <circle cx={124} cy={9} r={5} fill="#7bf06a" {...STRIP} strokeWidth={2.2} />
        </g>
        <path d="M74 44 Q100 26 126 44" fill="none" stroke={HELDLIJN} strokeWidth={9} strokeLinecap="round" />
        <path d="M74 44 Q100 26 126 44" fill="none" stroke="#7a7f8f" strokeWidth={4} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "hoofdband",
    naam: "ninja-hoofdband",
    categorie: "helmen",
    kader: "70 30 80 50",
    teken: () => (
      <g>
        <g className="linten">
          <path d="M124 44 Q136 44 146 54 L140 58 Q134 50 124 50 Z" fill={ROOD} {...STRIP} strokeWidth={2.2} />
          <path d="M124 48 Q134 54 138 68 L132 68 Q130 58 124 52 Z" fill={ROOD} {...STRIP} strokeWidth={2.2} />
        </g>
        <path d="M74 44 Q100 36 126 44 L126 52 Q100 44 74 52 Z" fill={ROOD} {...STRIP} strokeWidth={2.4} />
        <circle cx={100} cy={45} r={3} fill={ZILVER} stroke={HELDLIJN} strokeWidth={1.4} />
      </g>
    ),
  },
  {
    id: "kroontje",
    naam: "kroontje",
    categorie: "helmen",
    kader: "78 0 50 40",
    teken: () => (
      <g transform="rotate(12 104 22)">
        <path d="M86 30 L84 10 L94 20 L103 6 L112 20 L122 10 L120 30 Z" fill={GOUD} {...STRIP} strokeWidth={2.4} />
        <path d="M86 30 L120 30 L120 34 L86 34 Z" fill={GOUD_D} {...STRIP} strokeWidth={2} />
        <circle cx={103} cy={23} r={3} fill={ROOD} stroke={HELDLIJN} strokeWidth={1.2} />
        <path className="fonkel" d={vonkPad(92, 22, 3)} fill={WIT} />
      </g>
    ),
  },
  {
    id: "astronautenhelm",
    naam: "astronautenhelm",
    categorie: "helmen",
    kader: "54 8 92 108",
    teken: () => (
      <g>
        <circle cx={100} cy={58} r={42} fill="#bfe8ff44" {...STRIP} />
        <path d="M72 34 Q84 22 100 20" fill="none" stroke={WIT} strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        <path d="M128 76 Q124 86 116 92" fill="none" stroke={WIT} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        <path d="M66 92 Q100 108 134 92 L134 104 Q100 118 66 104 Z" fill={WIT} {...STRIP} />
        <circle cx={100} cy={106} r={3} fill={ROOD} stroke={HELDLIJN} strokeWidth={1.2} />
      </g>
    ),
  },

  // Laarzen
  {
    id: "rode-laarzen",
    naam: "rode laarzen",
    categorie: "laarzen",
    kader: LAARS_KADER,
    teken: () => <Laarzen kleur={ROOD} schaduw={ROOD_D} rand={GEEL} />,
  },
  {
    id: "raketlaarzen",
    naam: "raketlaarzen",
    categorie: "laarzen",
    kader: "46 292 108 100",
    teken: () => (
      <g>
        <Paar>
          <g className="raketvlam">
            <path d="M62 370 Q70 392 74 372 Q80 394 86 370 Z" fill="#ff7a1a" {...STRIP} strokeWidth={2} />
            <path d="M68 370 Q72 382 74 370 Q78 384 80 370 Z" fill={GEEL} />
          </g>
        </Paar>
        <Laarzen kleur={ZILVER} schaduw={ZILVER_D} rand={ROOD} />
        <Paar>
          <rect x={62} y={326} width={10} height={16} rx={3} fill={ROOD} {...STRIP} strokeWidth={2} />
        </Paar>
      </g>
    ),
  },
  {
    id: "gouden-laarzen",
    naam: "gouden laarzen",
    categorie: "laarzen",
    kader: "40 292 120 84",
    teken: () => (
      <g>
        <Laarzen kleur={GOUD} schaduw={GOUD_D} rand={GOUD_D} />
        <Paar>
          <path d="M68 318 Q56 308 46 312 Q54 316 52 320 Q46 322 48 328 Q58 324 68 330 Z" fill={WIT} {...STRIP} strokeWidth={2} />
          <path className="fonkel" d={vonkPad(80, 334, 4)} fill={WIT} />
        </Paar>
      </g>
    ),
  },
  {
    id: "ninjasloffen",
    naam: "ninjasloffen",
    categorie: "laarzen",
    kader: "46 318 108 58",
    teken: () => (
      <Paar>
        <path d="M68 328 L91 328 L91 350 Q93 360 91 370 L58 370 Q50 370 53 361 Q57 353 68 350 Z" fill="#34344a" {...STRIP} />
        <path d="M75 356 L75 370" stroke={HELDLIJN} strokeWidth={2} />
        <path d="M66 334 L92 342 M66 342 L92 334" stroke={ROOD} strokeWidth={2.5} strokeLinecap="round" />
      </Paar>
    ),
  },
  {
    id: "robotvoeten",
    naam: "robotvoeten",
    categorie: "laarzen",
    kader: LAARS_KADER,
    teken: () => (
      <Paar>
        <path d="M68 300 L93 300 L93 346 L68 346 Z" fill={ZILVER} {...STRIP} />
        <path d="M50 346 L95 346 L95 370 L50 370 Q46 358 50 346 Z" fill={ZILVER_D} {...STRIP} />
        <path d="M68 318 L93 318" stroke={ZILVER_D} strokeWidth={3} />
        <circle className="gloei" cx={80} cy={332} r={4} fill="#5ff2ff" {...STRIP} strokeWidth={1.6} />
        <path d="M60 358 L86 358" stroke={HELDLIJN} strokeWidth={2} strokeDasharray="3 4" />
      </Paar>
    ),
  },
  {
    id: "veerlaarzen",
    naam: "veerlaarzen",
    categorie: "laarzen",
    kader: LAARS_KADER,
    teken: () => (
      <Paar>
        <path d="M66 356 L86 358 L66 362 L86 364 L66 368 L86 370" fill="none" stroke={ZILVER_D} strokeWidth={3} strokeLinecap="round" />
        <path d="M69 300 L92 300 L91 344 Q92 350 90 356 L58 356 Q50 356 53 348 Q57 342 69 340 Z" fill="#12b3a8" {...STRIP} />
        <path d="M66 298 L95 298 L94 310 L67 310 Z" fill={GEEL} {...STRIP} />
        <path d="M60 370 L92 370" stroke={HELDLIJN} strokeWidth={4} strokeLinecap="round" />
      </Paar>
    ),
  },

  // Handschoenen (vuisten op 73,181 en 144,202)
  {
    id: "bokshandschoenen",
    naam: "bokshandschoenen",
    categorie: "handschoenen",
    kader: HAND_KADER,
    teken: () => <Handschoenen kleur={ROOD} manchet={WIT} groot={12.5} />,
  },
  {
    id: "gouden-armbanden",
    naam: "gouden armbanden",
    categorie: "handschoenen",
    kader: HAND_KADER,
    teken: () => (
      <g>
        <Arm d={MANCHET_L} kleur={GOUD} dikte={20} />
        <Arm d={MANCHET_R} kleur={GOUD} dikte={20} />
        <path d={sterPad(66, 166, 4)} fill={ROOD} />
        <path d={sterPad(142.8, 180, 4)} fill={ROOD} />
      </g>
    ),
  },
  {
    id: "klauwhandschoenen",
    naam: "klauwhandschoenen",
    categorie: "handschoenen",
    kader: HAND_KADER,
    teken: () => (
      <g>
        <g fill={ZILVER} {...STRIP} strokeWidth={2}>
          <path d="M66 186 L58 202 L70 190 Z M72 189 L68 206 L77 190 Z M78 188 L80 204 L83 187 Z" />
          <path d="M138 208 L136 226 L142 210 Z M144 210 L145 228 L148 210 Z M149 207 L154 224 L152 206 Z" />
        </g>
        <Handschoenen kleur="#3a3a4e" />
      </g>
    ),
  },
  {
    id: "ijshandschoenen",
    naam: "ijshandschoenen",
    categorie: "handschoenen",
    kader: HAND_KADER,
    teken: () => (
      <g>
        <Handschoenen kleur={IJS} manchet="#6cc6f0" />
        {[
          [60, 172], [80, 190], [150, 212], [136, 190],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} className="fonkel" d={kristalPad(x, y, 5)} stroke={WIT} strokeWidth={2} strokeLinecap="round" />
        ))}
      </g>
    ),
  },
  {
    id: "robotarmen",
    naam: "robotarmen",
    categorie: "handschoenen",
    kader: HAND_KADER,
    teken: () => (
      <g>
        <Arm d="M56 146 L70 174" kleur={ZILVER} dikte={19} />
        <Arm d="M140 150 L144 192" kleur={ZILVER} dikte={19} />
        <path d="M58 156 L67 152 M137 168 L147 167" stroke={ZILVER_D} strokeWidth={2.5} />
        <rect x={63} y={172} width={20} height={18} rx={4} fill={ZILVER_D} {...STRIP} />
        <rect x={134} y={193} width={20} height={18} rx={4} fill={ZILVER_D} {...STRIP} />
        <circle className="gloei" cx={73} cy={181} r={3} fill="#5ff2ff" />
        <circle className="gloei" cx={144} cy={202} r={3} fill="#5ff2ff" />
      </g>
    ),
  },
  {
    id: "vuurhandschoenen",
    naam: "vuurhandschoenen",
    categorie: "handschoenen",
    kader: "44 128 112 88",
    teken: () => (
      <g>
        <g className="flakker">
          <path d={vlamPad(62, 172, 10)} fill="#ff7a1a" {...STRIP} strokeWidth={2} />
          <path d={vlamPad(152, 196, 10)} fill="#ff7a1a" {...STRIP} strokeWidth={2} />
        </g>
        <Handschoenen kleur="#ff7a1a" manchet={ROOD} />
        <Vlammen punten={[73]} y={181} s={4} />
        <Vlammen punten={[144]} y={202} s={4} />
      </g>
    ),
  },

  // Gadgets (rechtervuist op 144,202)
  {
    id: "schild",
    naam: "schild",
    categorie: "gadgets",
    kader: "126 186 60 60",
    teken: () => (
      <g>
        <circle cx={158} cy={216} r={26} fill={ROOD} {...STRIP} />
        <circle cx={158} cy={216} r={19} fill={WIT} />
        <circle cx={158} cy={216} r={13} fill={ROOD} />
        <circle cx={158} cy={216} r={8} fill={BLAUW} />
        <path d={sterPad(158, 217, 7)} fill={WIT} />
        <path d="M140 204 Q146 196 156 194" fill="none" stroke={WIT} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      </g>
    ),
  },
  {
    id: "hamer",
    naam: "magische hamer",
    categorie: "gadgets",
    kader: "126 186 48 110",
    teken: () => (
      <g>
        <path d="M145 190 L150 264" stroke={HELDLIJN} strokeWidth={9} strokeLinecap="round" />
        <path d="M145 190 L150 264" stroke="#8a5a3c" strokeWidth={5} strokeLinecap="round" />
        <rect x={132} y={258} width={36} height={28} rx={4} fill={ZILVER} {...STRIP} />
        <path d="M150 262 L150 282" stroke={ZILVER_D} strokeWidth={3} />
        <path className="fonkel" d={bliksemPad(166, 250, 8)} fill={GEEL} {...STRIP} strokeWidth={1.5} />
      </g>
    ),
  },
  {
    id: "lasso",
    naam: "gouden lasso",
    categorie: "gadgets",
    kader: "126 190 50 80",
    teken: () => (
      <g fill="none" strokeLinecap="round">
        {[0, 5, 10].map((d) => (
          <ellipse key={d} cx={152 + d * 0.4} cy={236 + d * 0.6} rx={14 - d * 0.3} ry={22 - d * 0.4} stroke={HELDLIJN} strokeWidth={6} />
        ))}
        {[0, 5, 10].map((d) => (
          <ellipse key={d} cx={152 + d * 0.4} cy={236 + d * 0.6} rx={14 - d * 0.3} ry={22 - d * 0.4} stroke={GOUD} strokeWidth={3} />
        ))}
        <path className="fonkel" d={vonkPad(166, 222, 4)} fill={WIT} stroke="none" />
      </g>
    ),
  },
  {
    id: "toverstaf",
    naam: "toverstaf",
    categorie: "gadgets",
    kader: "134 138 46 72",
    teken: () => (
      <g>
        <path d="M144 204 L166 160" stroke={HELDLIJN} strokeWidth={8} strokeLinecap="round" />
        <path d="M144 204 L166 160" stroke="#6a2c91" strokeWidth={4} strokeLinecap="round" />
        <path d={sterPad(167, 156, 11)} fill={GEEL} {...STRIP} strokeWidth={2.2} />
        <path className="fonkel" d={vonkPad(176, 146, 4)} fill={WIT} />
        <path className="fonkel" d={vonkPad(156, 144, 3)} fill={GEEL} />
      </g>
    ),
  },
  {
    id: "zaklamp",
    naam: "zaklamp",
    categorie: "gadgets",
    kader: "132 190 68 80",
    teken: () => (
      <g>
        <path className="gloei" d="M160 214 L200 240 L200 270 L154 226 Z" fill="#fff3b0" opacity={0.75} />
        <path d="M138 196 L156 210 L152 216 L134 202 Z" fill="#3a3a4e" {...STRIP} strokeWidth={2.2} />
        <path d="M154 206 L162 212 L154 224 L148 218 Z" fill={GEEL} {...STRIP} strokeWidth={2.2} />
      </g>
    ),
  },
  {
    id: "heldenhond",
    naam: "heldenhond",
    categorie: "gadgets",
    kader: "140 296 60 80",
    teken: () => (
      <g>
        <path d="M156 318 Q146 330 150 364 L178 364 Q178 332 168 318 Z" fill={ROOD} {...STRIP} strokeWidth={2.4} />
        <g className="kwispel">
          <path d="M184 352 Q194 344 192 334" fill="none" stroke={HELDLIJN} strokeWidth={7} strokeLinecap="round" />
          <path d="M184 352 Q194 344 192 334" fill="none" stroke="#d99a5a" strokeWidth={3.5} strokeLinecap="round" />
        </g>
        <path d="M154 370 Q150 340 164 330 Q182 330 186 352 Q188 370 180 370 Z" fill="#d99a5a" {...STRIP} strokeWidth={2.4} />
        <circle cx={164} cy={318} r={13} fill="#d99a5a" {...STRIP} strokeWidth={2.4} />
        <path d="M152 312 Q146 322 152 330 Q156 324 156 314 Z M176 312 Q182 322 176 330 Q172 324 172 314 Z" fill="#8a5a3c" {...STRIP} strokeWidth={2} />
        <path d="M154 314 Q164 310 174 314 L174 320 Q164 316 154 320 Z" fill="#26243a" />
        <circle cx={159} cy={318} r={1.8} fill={WIT} />
        <circle cx={169} cy={318} r={1.8} fill={WIT} />
        <ellipse cx={164} cy={325} rx={3} ry={2.2} fill={HELDLIJN} />
        <path d="M160 328 Q164 332 168 328" fill="none" stroke={HELDLIJN} strokeWidth={1.5} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "robotje",
    naam: "robotje",
    categorie: "gadgets",
    kader: "142 118 50 64",
    teken: () => (
      <g className="zweef-traag">
        <path d="M167 128 L167 120" stroke={HELDLIJN} strokeWidth={2.5} />
        <circle cx={167} cy={118} r={3} fill={ROOD} stroke={HELDLIJN} strokeWidth={1.4} />
        <rect x={152} y={128} width={30} height={24} rx={7} fill={ZILVER} {...STRIP} />
        <rect x={157} y={134} width={20} height={11} rx={4} fill="#26243a" />
        <circle className="gloei" cx={162} cy={139.5} r={2.4} fill="#5ff2ff" />
        <circle className="gloei" cx={172} cy={139.5} r={2.4} fill="#5ff2ff" />
        <path d="M158 152 L162 166 L172 166 L176 152 Z" fill={ZILVER_D} {...STRIP} strokeWidth={2.2} />
        <path className="raketvlam" d="M162 168 Q167 180 172 168 Z" fill="#ff7a1a" />
      </g>
    ),
  },
];

export const HELD_START = Object.fromEntries(
  HELD_ITEMS.filter((i) => i.start).map((i) => [i.categorie, i.id]),
) as HeldAan;

export function vindHeldItem(id: string | undefined): HeldItem | undefined {
  return id ? HELD_ITEMS.find((i) => i.id === id) : undefined;
}
