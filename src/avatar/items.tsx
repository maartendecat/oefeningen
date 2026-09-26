// Alle kleren en spulletjes. Elk item tekent zichzelf in het assenstelsel van
// de pop (viewBox 0 0 200 360), zodat het op elke pop past. `kader` is het
// stukje dat getoond wordt als los prentje in de kast.

import type { ReactNode } from "react";
import { Bloem, Geknipt, OMLIJNING, Paar, hartPad, sterPad } from "./vormen";

export type Categorie =
  | "truitjes"
  | "onder"
  | "kleedjes"
  | "schoenen"
  | "hoofd"
  | "brillen"
  | "tassen";

export const CATEGORIEEN: { id: Categorie; naam: string; icoon: string }[] = [
  { id: "truitjes", naam: "truitjes", icoon: "👚" },
  { id: "onder", naam: "rokjes en broeken", icoon: "👖" },
  { id: "kleedjes", naam: "kleedjes", icoon: "👗" },
  { id: "schoenen", naam: "schoenen", icoon: "👟" },
  { id: "hoofd", naam: "hoeden", icoon: "👑" },
  { id: "brillen", naam: "brillen", icoon: "👓" },
  { id: "tassen", naam: "tassen en meer", icoon: "👜" },
];

export type Teken = { uid: string; huid: string };

export type Item = {
  id: string;
  naam: string;
  categorie: Categorie;
  /** Startkleren heeft elke pop van bij het begin. */
  start?: boolean;
  kader: string;
  teken: (t: Teken) => ReactNode;
};

/** Categorieën die ook helemaal uit mogen (anders loopt de pop in haar ondergoed). */
export const UITTREKBAAR: Categorie[] = ["kleedjes", "hoofd", "brillen", "tassen"];

// ---- Vormen ---------------------------------------------------------------

const SHIRT_KORT =
  "M68 128 Q100 118 132 128 L150 160 L134 170 L130 158 L131 214 L69 214 L70 158 L66 170 L50 160 Z";
const SHIRT_LANG =
  "M68 128 Q100 118 132 128 L158 214 L143 219 L130 162 L131 214 L69 214 L70 162 L57 219 L42 214 Z";
const TOPJE = "M74 130 Q100 124 126 130 L131 214 L69 214 Z";
const SHORT = "M69 206 L131 206 L133 246 L104 246 L100 228 L96 246 L67 246 Z";
const BROEK = "M69 206 L131 206 L128 320 L102 320 L100 238 L98 320 L72 320 Z";
const LEGGING = "M70 206 L130 206 L124 318 L103 318 L100 238 L97 318 L76 318 Z";
const ROK_A = "M71 206 L129 206 L146 260 L54 260 Z";
const KLEED_KORT =
  "M70 128 Q100 118 130 128 L146 150 L134 160 L130 152 L128 196 L150 268 Q100 280 50 268 L72 196 L70 152 L66 160 L54 150 Z";
const KLEED_LANG =
  "M70 128 Q100 118 130 128 L148 146 L136 162 L130 152 L128 196 L160 312 Q100 324 40 312 L72 196 L70 152 L64 162 L52 146 Z";
const SNEAKER =
  "M78 314 L99 314 L99 330 Q99 338 91 338 L70 338 Q63 338 65 331 Q67 324 78 321 Z";
const LAARS =
  "M77 280 L99 280 L99 330 Q99 338 91 338 L70 338 Q63 338 65 331 Q67 324 77 320 Z";
const BALLERINA =
  "M79 326 L99 326 L99 332 Q99 338 91 338 L70 338 Q63 338 65 333 Q68 328 79 326 Z";

function Hals({ huid }: { huid: string }) {
  return <path d="M87 124 Q100 138 113 124 Z" fill={huid} />;
}

function Hand({ x, huid }: { x: number; huid: string }) {
  return <circle cx={x} cy={224} r={9} fill={huid} />;
}

const streep = (y: number, h: number, kleur: string, key?: string | number) => (
  <rect key={key ?? y} x={30} y={y} width={140} height={h} fill={kleur} />
);

// ---- De items ---------------------------------------------------------------

export const ITEMS: Item[] = [
  // Startkleren
  {
    id: "shirt-start",
    naam: "wit t-shirt",
    categorie: "truitjes",
    start: true,
    kader: "36 110 128 116",
    teken: ({ huid }) => (
      <g>
        <path d={SHIRT_KORT} fill="#f5f7ff" stroke={OMLIJNING} strokeOpacity={0.2} strokeWidth={2} />
        <Hals huid={huid} />
      </g>
    ),
  },
  {
    id: "short-start",
    naam: "blauwe short",
    categorie: "onder",
    start: true,
    kader: "44 196 112 64",
    teken: () => (
      <g>
        <path d={SHORT} fill="#4d7cfe" />
        <rect x={69} y={204} width={62} height={7} fill="#3a63d6" />
      </g>
    ),
  },
  {
    id: "sneaker-start",
    naam: "witte sneakers",
    categorie: "schoenen",
    start: true,
    kader: "56 300 88 48",
    teken: () => (
      <Paar>
        <path d={SNEAKER} fill="#ffffff" stroke={OMLIJNING} strokeOpacity={0.3} strokeWidth={2} />
        <path d="M65 334 L99 334" stroke="#c9c9d6" strokeWidth={4} />
      </Paar>
    ),
  },

  // Truitjes
  {
    id: "hartjes-shirt",
    naam: "hartjes t-shirt",
    categorie: "truitjes",
    kader: "36 110 128 116",
    teken: ({ huid }) => (
      <g>
        <path d={SHIRT_KORT} fill="#ff6fae" />
        <Hals huid={huid} />
        <path d={hartPad(100, 168, 16)} fill="#ffffff" />
        <path d={hartPad(100, 168, 9)} fill="#ff2e7e" />
      </g>
    ),
  },
  {
    id: "streepjestrui",
    naam: "streepjestrui",
    categorie: "truitjes",
    kader: "36 110 128 116",
    teken: ({ uid, huid }) => (
      <g>
        <Geknipt id={`${uid}-strepen`} d={SHIRT_LANG} fill="#ffffff">
          {[134, 154, 174, 194, 214].map((y) => streep(y, 9, "#2f54eb"))}
        </Geknipt>
        <Hals huid={huid} />
      </g>
    ),
  },
  {
    id: "regenboogtop",
    naam: "regenboogtopje",
    categorie: "truitjes",
    kader: "36 110 128 116",
    teken: ({ uid }) => (
      <Geknipt id={`${uid}-regenboog`} d={TOPJE} fill="#ff4d4d">
        {["#ff4d4d", "#ff9f1c", "#ffd23f", "#3ddc97", "#4d9dfe", "#9b5de5"].map((k, i) =>
          streep(124 + i * 15, 15, k),
        )}
      </Geknipt>
    ),
  },
  {
    id: "sterrentrui",
    naam: "sterrentrui",
    categorie: "truitjes",
    kader: "36 110 128 116",
    teken: ({ huid }) => (
      <g>
        <path d={SHIRT_LANG} fill="#7b3fe4" />
        <Hals huid={huid} />
        {[
          [86, 156, 7],
          [112, 150, 5],
          [104, 178, 9],
          [80, 196, 5],
          [120, 196, 6],
        ].map(([x, y, r]) => (
          <path key={`${x}-${y}`} d={sterPad(x, y, r)} fill="#ffd23f" />
        ))}
      </g>
    ),
  },
  {
    id: "bloesje",
    naam: "geel bloesje",
    categorie: "truitjes",
    kader: "36 110 128 116",
    teken: ({ huid }) => (
      <g>
        <path d={SHIRT_KORT} fill="#ffd23f" />
        <Hals huid={huid} />
        <path d="M86 124 L100 136 L94 144 Z M114 124 L100 136 L106 144 Z" fill="#ffffff" />
        {[152, 172, 192].map((y) => (
          <circle key={y} cx={100} cy={y} r={3} fill="#e0a800" />
        ))}
      </g>
    ),
  },

  // Rokjes en broeken
  {
    id: "tutu",
    naam: "roze tutu",
    categorie: "onder",
    kader: "44 196 112 72",
    teken: () => {
      const franje = (y: number) =>
        `M69 ${y - 44} L131 ${y - 44} L152 ${y} Q141 ${y + 7} 131 ${y} Q121 ${y + 7} 110 ${y} Q100 ${y + 7} 90 ${y} Q79 ${y + 7} 69 ${y} Q58 ${y + 7} 48 ${y} Z`;
      return (
        <g>
          <path d={franje(256)} fill="#ffb3d9" />
          <path d={franje(246)} fill="#ff8fc7" />
          <rect x={68} y={204} width={64} height={8} rx={3} fill="#ff4fa3" />
        </g>
      );
    },
  },
  {
    id: "jeans",
    naam: "jeansbroek",
    categorie: "onder",
    kader: "50 196 100 130",
    teken: () => (
      <g>
        <path d={BROEK} fill="#3d6fb6" />
        <rect x={69} y={204} width={62} height={7} fill="#2f5a99" />
        <path d="M84 216 Q86 280 85 318 M116 216 Q114 280 115 318" stroke="#9ec1f0" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
      </g>
    ),
  },
  {
    id: "ruitrokje",
    naam: "ruitjesrok",
    categorie: "onder",
    kader: "44 196 112 72",
    teken: ({ uid }) => (
      <Geknipt id={`${uid}-ruit`} d={ROK_A} fill="#e63946">
        {[60, 80, 100, 120, 140].map((x) => (
          <rect key={`v${x}`} x={x - 3} y={200} width={6} height={70} fill="#1d3557" opacity={0.45} />
        ))}
        {[218, 236, 254].map((y) => streep(y, 5, "#1d3557cc"))}
      </Geknipt>
    ),
  },
  {
    id: "stippenrok",
    naam: "stippenrok",
    categorie: "onder",
    kader: "44 196 112 72",
    teken: ({ uid }) => (
      <Geknipt id={`${uid}-stip`} d={ROK_A} fill="#3ddc97">
        {[
          [80, 218], [100, 224], [120, 216], [70, 242], [92, 246], [114, 244], [134, 250], [60, 256],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={5} fill="#ffffff" />
        ))}
      </Geknipt>
    ),
  },
  {
    id: "glitterlegging",
    naam: "glitterlegging",
    categorie: "onder",
    kader: "50 196 100 130",
    teken: () => (
      <g>
        <path d={LEGGING} fill="#b15cff" />
        {[
          [82, 230], [90, 262], [84, 296], [114, 238], [110, 276], [116, 304], [100, 214],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={sterPad(x, y, 4, 4)} fill="#fff4b0" />
        ))}
      </g>
    ),
  },

  // Kleedjes
  {
    id: "prinsessenjurk",
    naam: "prinsessenjurk",
    categorie: "kleedjes",
    kader: "30 110 140 214",
    teken: ({ huid }) => (
      <g>
        <path d={KLEED_LANG} fill="#8ecae6" />
        <Hals huid={huid} />
        <circle cx={62} cy={146} r={13} fill="#bde0f3" />
        <circle cx={138} cy={146} r={13} fill="#bde0f3" />
        <path d="M72 196 Q100 204 128 196" stroke="#ffd23f" strokeWidth={4} fill="none" />
        {[
          [70, 250], [100, 280], [130, 250], [86, 300], [118, 300], [100, 230],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={sterPad(x, y, 5, 4)} fill="#ffffff" />
        ))}
      </g>
    ),
  },
  {
    id: "bloemenjurk",
    naam: "bloemenjurk",
    categorie: "kleedjes",
    kader: "40 110 120 176",
    teken: ({ huid }) => (
      <g>
        <path d={KLEED_KORT} fill="#ffe066" />
        <Hals huid={huid} />
        {[
          [88, 160, "#ff6fae"], [114, 180, "#4d9dfe"], [76, 236, "#ff6fae"], [104, 250, "#9b5de5"], [128, 232, "#ff6fae"], [100, 212, "#3ddc97"],
        ].map(([x, y, k]) => (
          <Bloem key={`${x}-${y}`} cx={x as number} cy={y as number} r={5} kleur={k as string} hart="#ffffff" />
        ))}
      </g>
    ),
  },
  {
    id: "regenboogjurk",
    naam: "regenboogjurk",
    categorie: "kleedjes",
    kader: "40 110 120 176",
    teken: ({ uid, huid }) => (
      <g>
        <Geknipt id={`${uid}-rbj`} d={KLEED_KORT} fill="#ff4d4d">
          {["#ff4d4d", "#ff9f1c", "#ffd23f", "#3ddc97", "#4d9dfe", "#9b5de5", "#ff6fae"].map((k, i) =>
            streep(118 + i * 23, 23, k),
          )}
        </Geknipt>
        <Hals huid={huid} />
      </g>
    ),
  },
  {
    id: "sterrenkleed",
    naam: "sterrenkleed",
    categorie: "kleedjes",
    kader: "40 110 120 176",
    teken: ({ huid }) => (
      <g>
        <path d={KLEED_KORT} fill="#1b1f5e" />
        <Hals huid={huid} />
        {[
          [90, 150, 5], [114, 166, 4], [100, 188, 6], [74, 230, 6], [104, 240, 8], [132, 226, 5], [86, 262, 4], [120, 262, 5],
        ].map(([x, y, r]) => (
          <path key={`${x}-${y}`} d={sterPad(x, y, r)} fill="#ffd23f" />
        ))}
      </g>
    ),
  },

  // Schoenen
  {
    id: "roze-sneakers",
    naam: "roze sneakers",
    categorie: "schoenen",
    kader: "56 300 88 48",
    teken: () => (
      <Paar>
        <path d={SNEAKER} fill="#ff6fae" />
        <path d="M65 334 L99 334" stroke="#ffffff" strokeWidth={4} />
        <path d="M84 318 L94 322 M82 324 L94 326" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />
      </Paar>
    ),
  },
  {
    id: "laarzen",
    naam: "rode laarzen",
    categorie: "schoenen",
    kader: "56 270 88 76",
    teken: () => (
      <Paar>
        <path d={LAARS} fill="#e63946" />
        <rect x={76} y={278} width={24} height={7} rx={2} fill="#c1121f" />
        <path d="M65 335 L99 335" stroke="#6d0f18" strokeWidth={3} />
      </Paar>
    ),
  },
  {
    id: "ballerinas",
    naam: "glitterballerina's",
    categorie: "schoenen",
    kader: "56 310 88 36",
    teken: () => (
      <Paar>
        <path d={BALLERINA} fill="#f4c542" />
        <path d={sterPad(86, 329, 4, 4)} fill="#ffffff" />
      </Paar>
    ),
  },
  {
    id: "sandalen",
    naam: "sandaaltjes",
    categorie: "schoenen",
    kader: "56 310 88 36",
    teken: ({ huid }) => (
      <Paar>
        <path d={SNEAKER} fill={huid} />
        <path d="M64 336 L99 336" stroke="#8d5a3b" strokeWidth={4} strokeLinecap="round" />
        <path d="M68 330 L98 324 M78 322 L98 318" stroke="#3ddc97" strokeWidth={4} strokeLinecap="round" />
      </Paar>
    ),
  },
  {
    id: "rolschaatsen",
    naam: "rolschaatsen",
    categorie: "schoenen",
    kader: "56 300 88 56",
    teken: () => (
      <Paar>
        <path d={SNEAKER} fill="#4d9dfe" />
        <rect x={64} y={336} width={36} height={4} rx={2} fill="#9aa0b5" />
        <circle cx={71} cy={344} r={5} fill="#ffd23f" />
        <circle cx={93} cy={344} r={5} fill="#ffd23f" />
      </Paar>
    ),
  },

  // Hoeden en haarspulletjes
  {
    id: "kroon",
    naam: "kroon",
    categorie: "hoofd",
    kader: "60 0 80 50",
    teken: () => (
      <g>
        <path d="M76 42 L78 12 L90 28 L100 6 L110 28 L122 12 L124 42 Z" fill="#ffd23f" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />
        <circle cx={88} cy={36} r={3.5} fill="#ff4d8d" />
        <circle cx={100} cy={34} r={4} fill="#4d9dfe" />
        <circle cx={112} cy={36} r={3.5} fill="#3ddc97" />
      </g>
    ),
  },
  {
    id: "pet",
    naam: "pet",
    categorie: "hoofd",
    kader: "56 8 112 56",
    teken: () => (
      <g>
        <path d="M63 52 Q63 18 100 16 Q137 18 137 52 Z" fill="#ff5a36" />
        <path d="M100 44 L158 46 Q168 52 158 58 L100 56 Z" fill="#d63d1f" />
        <circle cx={100} cy={17} r={4} fill="#d63d1f" />
        <path d={sterPad(100, 36, 8)} fill="#ffffff" />
      </g>
    ),
  },
  {
    id: "strik",
    naam: "grote strik",
    categorie: "hoofd",
    kader: "92 8 64 50",
    teken: () => (
      <g transform="rotate(15 124 32)">
        <path d="M124 32 L102 18 Q96 32 102 46 Z" fill="#ff4fa3" />
        <path d="M124 32 L146 18 Q152 32 146 46 Z" fill="#ff4fa3" />
        <circle cx={124} cy={32} r={6} fill="#d6007a" />
      </g>
    ),
  },
  {
    id: "bloemenkrans",
    naam: "bloemenkrans",
    categorie: "hoofd",
    kader: "56 18 88 50",
    teken: () => (
      <g>
        {[
          [66, 56, "#ff6fae"], [73, 42, "#ffd23f"], [85, 32, "#9b5de5"], [100, 28, "#ff6fae"], [115, 32, "#4d9dfe"], [127, 42, "#ffd23f"], [134, 56, "#ff6fae"],
        ].map(([x, y, k]) => (
          <Bloem key={`${x}`} cx={x as number} cy={y as number} r={4.5} kleur={k as string} hart="#ffffff" />
        ))}
      </g>
    ),
  },
  {
    id: "eenhoorn",
    naam: "eenhoorn-diadeem",
    categorie: "hoofd",
    kader: "56 0 88 64",
    teken: () => (
      <g>
        <path d="M66 58 Q100 20 134 58" stroke="#ff8fc7" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M70 44 L72 24 L84 36 Z M130 44 L128 24 L116 36 Z" fill="#ffffff" stroke="#ff8fc7" strokeWidth={2} strokeLinejoin="round" />
        <path d="M92 36 L100 2 L108 36 Z" fill="#ffd23f" stroke="#e0a800" strokeWidth={2} strokeLinejoin="round" />
        <path d="M95 26 L105 22 M97 16 L103 13" stroke="#e0a800" strokeWidth={2} />
      </g>
    ),
  },
  {
    id: "zomerhoed",
    naam: "zomerhoed",
    categorie: "hoofd",
    kader: "30 4 140 58",
    teken: () => (
      <g>
        <ellipse cx={100} cy={44} rx={66} ry={13} fill="#f2d492" />
        <path d="M70 46 Q70 10 100 10 Q130 10 130 46 Z" fill="#f7e0a8" />
        <path d="M70 36 Q100 42 130 36 L130 45 Q100 51 70 45 Z" fill="#ff6fae" />
        <Bloem cx={124} cy={40} r={5} kleur="#ffffff" />
      </g>
    ),
  },

  // Brillen (ogen op 87,78 en 113,78)
  {
    id: "ronde-bril",
    naam: "ronde bril",
    categorie: "brillen",
    kader: "58 62 84 32",
    teken: () => (
      <g stroke="#3b2f4a" strokeWidth={3} fill="none">
        <circle cx={87} cy={78} r={10} fill="#ffffff40" />
        <circle cx={113} cy={78} r={10} fill="#ffffff40" />
        <path d="M97 77 Q100 74 103 77 M77 77 L64 74 M123 77 L136 74" />
      </g>
    ),
  },
  {
    id: "hartjesbril",
    naam: "hartjesbril",
    categorie: "brillen",
    kader: "58 62 84 32",
    teken: () => (
      <g>
        <path d="M98 76 Q100 73 102 76 M76 76 L64 73 M124 76 L136 73" stroke="#ff2e7e" strokeWidth={3} fill="none" />
        <path d={hartPad(87, 79, 12)} fill="#ff6faecc" stroke="#ff2e7e" strokeWidth={3} />
        <path d={hartPad(113, 79, 12)} fill="#ff6faecc" stroke="#ff2e7e" strokeWidth={3} />
      </g>
    ),
  },
  {
    id: "sterrenbril",
    naam: "sterrenbril",
    categorie: "brillen",
    kader: "58 60 84 36",
    teken: () => (
      <g>
        <path d="M98 76 Q100 73 102 76 M76 76 L64 73 M124 76 L136 73" stroke="#e0a800" strokeWidth={3} fill="none" />
        <path d={sterPad(87, 79, 14)} fill="#ffd23fcc" stroke="#e0a800" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={sterPad(113, 79, 14)} fill="#ffd23fcc" stroke="#e0a800" strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    ),
  },
  {
    id: "zonnebril",
    naam: "zonnebril",
    categorie: "brillen",
    kader: "58 62 84 32",
    teken: () => (
      <g>
        <path d="M98 75 L102 75 M75 76 L64 73 M125 76 L136 73" stroke="#222" strokeWidth={3} />
        <rect x={74} y={70} width={25} height={16} rx={7} fill="#222" />
        <rect x={101} y={70} width={25} height={16} rx={7} fill="#222" />
        <path d="M78 74 L84 74 M105 74 L111 74" stroke="#ffffff99" strokeWidth={2} strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "kattenbril",
    naam: "kattenbril",
    categorie: "brillen",
    kader: "58 60 84 36",
    teken: () => (
      <g stroke="#9b5de5" strokeWidth={3} strokeLinejoin="round">
        <path d="M97 76 Q100 73 103 76 M76 75 L64 72 M124 75 L136 72" fill="none" />
        <path d="M74 70 L99 73 Q99 88 87 88 Q76 88 76 78 Z" fill="#e0c3ff80" />
        <path d="M126 70 L101 73 Q101 88 113 88 Q124 88 124 78 Z" fill="#e0c3ff80" />
      </g>
    ),
  },

  // Tassen en meer (handen op 46,224 en 154,224)
  {
    id: "handtas",
    naam: "roze handtas",
    categorie: "tassen",
    kader: "8 196 76 88",
    teken: () => (
      <g transform="translate(46 224) scale(1.4) translate(-46 -224)">
        <path d="M36 236 Q46 206 56 236" stroke="#d6007a" strokeWidth={3.5} fill="none" />
        <path d="M28 234 L64 234 L68 264 L24 264 Z" fill="#ff6fae" stroke="#d6007a" strokeWidth={2} strokeLinejoin="round" />
        <circle cx={46} cy={242} r={3} fill="#ffd23f" />
      </g>
    ),
  },
  {
    id: "hartjestas",
    naam: "hartjestas",
    categorie: "tassen",
    kader: "8 196 76 92",
    teken: () => (
      <g transform="translate(46 224) scale(1.4) translate(-46 -224)">
        <path d="M34 244 Q46 206 58 244" stroke="#c1121f" strokeWidth={3.5} fill="none" />
        <path d={hartPad(46, 254, 18)} fill="#e63946" />
        <path d={hartPad(40, 248, 4)} fill="#ffffff88" />
      </g>
    ),
  },
  {
    id: "schoudertas",
    naam: "schoudertas",
    categorie: "tassen",
    kader: "60 120 104 112",
    teken: () => (
      <g>
        <path d="M76 128 L136 204" stroke="#7a4b2a" strokeWidth={5} strokeLinecap="round" />
        <rect x={124} y={196} width={34} height={28} rx={6} fill="#b5763c" />
        <path d="M124 202 Q141 218 158 202 L158 202 Q158 196 152 196 L130 196 Q124 196 124 202 Z" fill="#8f5a2b" />
        <circle cx={141} cy={210} r={3} fill="#ffd23f" />
      </g>
    ),
  },
  {
    id: "ballon",
    naam: "ballon",
    categorie: "tassen",
    kader: "138 42 60 120",
    teken: ({ huid }) => (
      <g>
        <path d="M154 222 Q172 160 168 98" stroke="#555" strokeWidth={1.5} fill="none" />
        <path d="M164 98 L172 98 L168 92 Z" fill="#e63946" />
        <ellipse cx={168} cy={70} rx={20} ry={24} fill="#e63946" />
        <ellipse cx={161} cy={61} rx={5} ry={8} fill="#ffffff66" transform="rotate(20 161 61)" />
        <Hand x={154} huid={huid} />
      </g>
    ),
  },
  {
    id: "ijsje",
    naam: "ijsje",
    categorie: "tassen",
    kader: "132 180 44 66",
    teken: ({ huid }) => (
      <g>
        <circle cx={148} cy={204} r={8} fill="#ff8fc7" />
        <circle cx={160} cy={204} r={8} fill="#8ce0c0" />
        <circle cx={154} cy={195} r={8} fill="#8d5a3b" />
        <path d="M143 208 L165 208 L154 240 Z" fill="#e6a85c" />
        <path d="M147 214 L160 214 M150 222 L158 222" stroke="#b8793a" strokeWidth={1.5} />
        <Hand x={154} huid={huid} />
      </g>
    ),
  },
];

export const STARTKLEREN = Object.fromEntries(
  ITEMS.filter((i) => i.start).map((i) => [i.categorie, i.id]),
) as Partial<Record<Categorie, string>>;

export function vindItem(id: string | undefined): Item | undefined {
  return id ? ITEMS.find((i) => i.id === id) : undefined;
}
