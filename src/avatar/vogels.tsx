// Alle vogels om te verzamelen, met hun leefgebied en een weetje. Vijf ervan
// zijn ook startvogel: die kan een kind als avatar kiezen.
//
// Een soort kiest een lichaamsvorm uit vogelvormen.ts en geeft kleuren mee,
// plus een tekening (vlekken, strepen, een masker) die op lijf en kop
// geknipt wordt. De coördinaten van die tekening horen bij de gekozen vorm.

import type { ReactNode } from "react";
import {
  emoe,
  kalkoen,
  kiwi,
  kolibrie,
  pelikaan,
  rechtop,
  renkoekoek,
  roofvogel,
  specht,
  steltloper,
  uil,
  verschuif,
  zangvogel,
  zwemvogel,
  type Geometrie,
} from "./vogelvormen";

export type Leefgebied = "bos" | "veld" | "water";

export const LEEFGEBIEDEN: { id: Leefgebied; naam: string; icoon: string }[] = [
  { id: "bos", naam: "bos", icoon: "🌲" },
  { id: "veld", naam: "veld", icoon: "🌾" },
  { id: "water", naam: "water", icoon: "💧" },
];

/** Welk geluidje de vogel maakt als je erop tikt (zie geluid.ts). */
export type Zang = "tjilp" | "fluit" | "hoe" | "krijs" | "kwak" | "lach" | "roffel" | "klapper" | "zoem" | "gak";

export type Kleuren = {
  lijf: string;
  kop: string;
  buik?: string;
  vleugel: string;
  staart: string;
  snavel: string;
  poot: string;
  /** Een gekleurde iris (anders een donker oog). */
  iris?: string;
  oogring?: string;
};

export type Soort = {
  id: string;
  naam: string;
  gebied: Leefgebied;
  weetje: string;
  /** Kan ook als avatar gekozen worden. */
  start?: boolean;
  vorm: Geometrie;
  kleur: Kleuren;
  /** Extra delen van het silhouet: kuif, oorpluimen, lel. */
  extra?: { d: string; kleur: string; achter?: boolean }[];
  /** Op lijf en kop geknipt. */
  tekening?: ReactNode;
  vleugelTekening?: (i: number) => ReactNode;
  staartTekening?: ReactNode;
  snavelTekening?: ReactNode;
  /** Achter alles (bv. de draadveren van de liervogel). */
  achterlaag?: ReactNode;
  /** Boven alles, ook boven het oog. */
  bovenop?: ReactNode;
  zang: Zang;
};

// ---- Tekenhulpjes ---------------------------------------------------------------

const lijn = (d: string, kleur: string, w: number, extra: object = {}) => (
  <path d={d} fill="none" stroke={kleur} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" {...extra} />
);
const vlak = (d: string, kleur: string) => <path d={d} fill={kleur} />;
const vlek = (cx: number, cy: number, rx: number, ry: number, kleur: string) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={kleur} />
);

/** Evenwijdige strepen, van (x, y0) naar (x + schuin, y1) voor elke x. */
function balken(x0: number, x1: number, stap: number, y0: number, y1: number, schuin: number, kleur: string, w: number) {
  const d: string[] = [];
  for (let x = x0; x <= x1; x += stap) d.push(`M${x} ${y0} L${x + schuin} ${y1}`);
  return lijn(d.join(" "), kleur, w);
}

/** Liggende streepjes in een rooster: bandering op borst en buik. */
function bandjes(x0: number, x1: number, y0: number, y1: number, dx: number, dy: number, lengte: number, kleur: string, w = 1.8) {
  const d: string[] = [];
  let rij = 0;
  for (let y = y0; y <= y1; y += dy, rij++) {
    for (let x = x0 + (rij % 2) * (dx / 2); x <= x1; x += dx) d.push(`M${x - lengte / 2} ${y} Q${x} ${y + 2} ${x + lengte / 2} ${y}`);
  }
  return lijn(d.join(" "), kleur, w);
}

/** Schubjes: kleine boogjes, voor veren. */
function schubben(x0: number, x1: number, y0: number, y1: number, stap: number, kleur: string, w = 1.4) {
  const d: string[] = [];
  let rij = 0;
  for (let y = y0; y <= y1; y += stap * 0.8, rij++) {
    for (let x = x0 + (rij % 2) * (stap / 2); x <= x1; x += stap) d.push(`M${x - stap / 2} ${y} Q${x} ${y + stap * 0.6} ${x + stap / 2} ${y}`);
  }
  return lijn(d.join(" "), kleur, w);
}

function stippen(x0: number, x1: number, y0: number, y1: number, stap: number, r: number, kleur: string) {
  const c: ReactNode[] = [];
  let rij = 0;
  for (let y = y0; y <= y1; y += stap, rij++) {
    for (let x = x0 + (rij % 2) * (stap / 2); x <= x1; x += stap) c.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={kleur} />);
  }
  return <g>{c}</g>;
}

/** Pluizige haartjes (emoe, kiwi). */
function pluis(x0: number, x1: number, y0: number, y1: number, stap: number, kleur: string) {
  const d: string[] = [];
  let rij = 0;
  for (let y = y0; y <= y1; y += stap, rij++) {
    for (let x = x0 + (rij % 2) * (stap / 2); x <= x1; x += stap) d.push(`M${x} ${y} Q${x - 3} ${y + stap * 0.5} ${x - 1} ${y + stap}`);
  }
  return lijn(d.join(" "), kleur, 1.6);
}

// ---- Vormen die meer dan één keer gebruikt worden --------------------------------

const holenuilVorm: Geometrie = {
  ...verschuif(uil(), 0.66, 0, -40),
  poten: "M92 146 L90 180 M84 181 L90 180 L96 181 M108 146 L110 180 M104 181 L110 180 L116 181",
  pootDikte: 3.5,
  kader: "30 30 140 160",
  portret: "54 38 92 92",
};

// Twee brede buitenveren in de vorm van een lier, met omkrullende punten.
const LIER_STAART =
  "M74 134 C56 116 44 90 44 62 C44 46 36 36 24 38 C32 26 52 30 56 48 C60 72 66 100 86 128 Z M84 128 C80 100 84 72 96 52 C102 42 112 34 122 38 C112 40 106 48 104 58 C98 82 96 104 96 126 Z";

// ---- De vogels -------------------------------------------------------------------

export const VOGELS: Soort[] = [
  // ======== Bos ========
  {
    id: "kea",
    naam: "kea",
    gebied: "bos",
    start: true,
    weetje: "een slimme papegaai uit de bergen. hij speelt in de sneeuw.",
    vorm: roofvogel({ snavel: "papegaai", staart: "lang", kop: 1.05 }),
    kleur: { lijf: "#6f8a3a", kop: "#7f9a48", buik: "#879e50", vleugel: "#5f7a2e", staart: "#56702c", snavel: "#45464a", poot: "#6b6b70" },
    tekening: schubben(80, 140, 84, 170, 10, "#3f5420", 1.3),
    vleugelTekening: () => (
      <g>
        {vlak("M70 100 C74 88 92 76 112 80 L114 88 C98 86 84 94 76 108 Z", "#e8682a")}
        {vlak("M76 150 C84 160 88 172 90 186 L70 190 Z", "#3d6e8a")}
        {schubben(76, 120, 96, 170, 10, "#3f5420", 1.2)}
      </g>
    ),
    staartTekening: lijn("M84 186 L108 188", "#3d6e8a", 5),
    zang: "krijs",
  },
  {
    id: "oehoe",
    naam: "amerikaanse oehoe",
    gebied: "bos",
    start: true,
    weetje: "jaagt 's nachts en ziet heel goed in het donker.",
    vorm: uil(),
    kleur: {
      lijf: "#8a6a48",
      kop: "#9a7852",
      buik: "#dcc6a2",
      vleugel: "#6e5238",
      staart: "#6e5238",
      snavel: "#2b2b2b",
      poot: "#e8dcc4",
      iris: "#f5b921",
    },
    extra: [
      { d: "M70 52 L58 18 L90 42 Z", kleur: "#7a5a3c", achter: true },
      { d: "M130 52 L142 18 L110 42 Z", kleur: "#7a5a3c", achter: true },
    ],
    tekening: (
      <g>
        {vlek(84, 70, 18, 17, "#c98b4a")}
        {vlek(116, 70, 18, 17, "#c98b4a")}
        {vlek(100, 102, 16, 8, "#f5efe2")}
        {bandjes(76, 124, 112, 168, 9, 8, 7, "#5a4028")}
        {schubben(64, 136, 40, 56, 9, "#6a4a30", 1.2)}
      </g>
    ),
    vleugelTekening: () => bandjes(56, 146, 100, 170, 8, 9, 6, "#4a3422", 1.6),
    bovenop: lijn("M70 54 L96 62 M130 54 L104 62", "#3a2818", 3.5),
    zang: "hoe",
  },
  {
    id: "helmspecht",
    naam: "helmspecht",
    gebied: "bos",
    weetje: "hakt grote gaten in bomen om mieren te vangen.",
    vorm: specht({ snavelS: 0.85 }),
    kleur: { lijf: "#1e1e22", kop: "#1e1e22", vleugel: "#26262b", staart: "#1e1e22", snavel: "#55555a", poot: "#555" },
    extra: [{ d: "M130 48 C124 32 102 28 84 38 C92 44 94 54 96 64 Z", kleur: "#e0262b", achter: true }],
    tekening: (
      <g>
        {lijn("M130 66 C120 74 106 82 96 104", "#f4f0e8", 5)}
        {lijn("M106 52 L94 56", "#f4f0e8", 3.5)}
        {lijn("M128 70 L116 74", "#d62b2b", 4)}
      </g>
    ),
    vleugelTekening: () => vlek(96, 92, 7, 5, "#f4f0e8"),
    zang: "roffel",
  },
  {
    id: "roodkardinaal",
    naam: "roodkardinaal",
    gebied: "bos",
    weetje: "het mannetje is helemaal rood, met een zwart masker.",
    vorm: zangvogel({ snavel: "kegel", staart: "recht" }),
    kleur: { lijf: "#d4202a", kop: "#dc2a30", buik: "#e4403e", vleugel: "#b0181f", staart: "#a8161d", snavel: "#f2803a", poot: "#8a6060" },
    extra: [{ d: "M110 70 C104 48 114 38 120 30 C126 46 134 56 146 64 Z", kleur: "#dc2a30", achter: true }],
    tekening: vlek(152, 90, 15, 13, "#1a1414"),
    vleugelTekening: () => schubben(60, 118, 108, 160, 10, "#86121a", 1.2),
    zang: "fluit",
  },
  {
    id: "blauwe-gaai",
    naam: "blauwe gaai",
    gebied: "bos",
    weetje: "verstopt eikels en vindt ze later terug.",
    vorm: zangvogel({ snavel: "spits", snavelS: 1.15, staart: "lang" }),
    kleur: { lijf: "#4f86c6", kop: "#5b93d3", buik: "#eef1f6", vleugel: "#3f7cc8", staart: "#3f78c2", snavel: "#1e1e22", poot: "#2e2e36" },
    extra: [{ d: "M108 72 C100 54 108 42 114 34 C120 48 128 56 140 62 Z", kleur: "#5b93d3", achter: true }],
    tekening: (
      <g>
        {vlek(146, 96, 12, 10, "#eef1f6")}
        {lijn("M112 104 C124 116 146 114 156 98 M122 70 C128 76 140 78 150 80", "#1a1a22", 4)}
      </g>
    ),
    vleugelTekening: () => (
      <g>
        {balken(46, 118, 9, 100, 170, -14, "#1a1a22", 2)}
        {vlak("M44 162 C60 158 72 154 84 148 L86 154 C74 160 60 164 44 166 Z", "#f4f6fa")}
      </g>
    ),
    staartTekening: balken(10, 90, 9, 120, 200, 16, "#1a1a22", 1.8),
    zang: "krijs",
  },
  {
    id: "zwartvleugeltangare",
    naam: "zwartvleugel\u00adtangare",
    gebied: "bos",
    weetje: "knalrood, met zwarte vleugels.",
    vorm: zangvogel({ snavel: "kegel", snavelS: 0.85 }),
    kleur: { lijf: "#e3241f", kop: "#e62a22", buik: "#ec3e2e", vleugel: "#141414", staart: "#141414", snavel: "#c8c2aa", poot: "#6a6a6a" },
    vleugelTekening: () => schubben(60, 118, 110, 160, 11, "#3a3a3a", 1.2),
    zang: "fluit",
  },
  {
    id: "kolibrie",
    naam: "robijnkeel\u00adkolibrie",
    gebied: "bos",
    weetje: "kan stil blijven hangen en zelfs achteruit vliegen.",
    vorm: kolibrie(),
    kleur: { lijf: "#4f9a52", kop: "#4f9a52", buik: "#eef0e6", vleugel: "#cfe3df", staart: "#3c6e40", snavel: "#1a1a1a", poot: "#333" },
    tekening: (
      <g>
        {vlek(140, 108, 13, 8, "#d0103a")}
        {vlek(136, 106, 5, 3, "#ff5a7a")}
      </g>
    ),
    vleugelTekening: () => lijn("M110 90 C108 70 110 50 116 36 M114 96 C114 76 116 56 118 40", "#9ab8b4", 1.4),
    zang: "zoem",
  },
  {
    id: "kerkuil",
    naam: "kerkuil",
    gebied: "bos",
    weetje: "hoort een muisje lopen, zelfs in het pikdonker.",
    vorm: uil(),
    kleur: { lijf: "#d8a45a", kop: "#d8a45a", buik: "#fbf5ea", vleugel: "#c9944e", staart: "#c9944e", snavel: "#eadcc8", poot: "#f2e8d8" },
    tekening: (
      <g>
        <path
          d="M100 104 C84 100 62 88 62 66 C62 48 80 42 100 56 C120 42 138 48 138 66 C138 88 116 100 100 104 Z"
          fill="#fffaf2"
          stroke="#b88444"
          strokeWidth={3}
        />
        {lijn("M100 58 L100 80", "#eadcc8", 3)}
        {stippen(80, 124, 118, 164, 11, 1.4, "#b88444")}
      </g>
    ),
    vleugelTekening: () => stippen(52, 150, 104, 168, 9, 1.5, "#7a7a7a"),
    zang: "hoe",
  },
  {
    id: "wilde-kalkoen",
    naam: "wilde kalkoen",
    gebied: "bos",
    weetje: "slaapt 's nachts hoog in een boom.",
    vorm: kalkoen(),
    kleur: { lijf: "#4a3a2e", kop: "#8ab8d8", buik: "#3e3028", vleugel: "#5a4636", staart: "#6a5038", snavel: "#d0c0a0", poot: "#c98f7a" },
    extra: [
      { d: "M142 66 C146 76 146 90 140 94 C134 88 136 76 140 68 Z", kleur: "#d62d3a" },
      { d: "M154 58 C160 62 160 72 156 76 C154 70 152 64 152 60 Z", kleur: "#d62d3a" },
    ],
    tekening: schubben(64, 140, 90, 156, 9, "#a8804a", 1.4),
    vleugelTekening: () => balken(60, 130, 10, 90, 150, -20, "#e8dcc4", 2.2),
    staartTekening: (
      <g>
        {lijn("M48 44 C62 26 96 22 112 38", "#e8dcc4", 5)}
        {lijn("M52 56 C66 38 94 36 106 48", "#2e2218", 4)}
        {lijn("M64 30 L84 110 M44 60 L84 114 M92 24 L88 110 M110 38 L92 112", "#4a3624", 1.6)}
      </g>
    ),
    zang: "gak",
  },
  {
    id: "kookaburra",
    naam: "kookaburra",
    gebied: "bos",
    weetje: "lacht zo luid dat je hem van ver hoort.",
    vorm: zangvogel({ kop: 1.2, snavel: "dolk", snavelS: 1.05, staart: "recht" }),
    kleur: { lijf: "#8a6a4a", kop: "#efe6d6", buik: "#f3ebdc", vleugel: "#6a4e36", staart: "#a85e32", snavel: "#3a3a3a", poot: "#6a6a6a" },
    tekening: (
      <g>
        {lijn("M140 76 C128 78 116 82 104 90", "#5a3e26", 6)}
        {schubben(108, 150, 52, 60, 7, "#b8a88e", 1.2)}
      </g>
    ),
    snavelTekening: vlak("M158 86 Q170 88 188 84 Q172 90 158 90 Z", "#e8dcc4"),
    vleugelTekening: () => stippen(76, 110, 102, 116, 7, 2.2, "#6fb4d8"),
    staartTekening: balken(20, 90, 7, 130, 190, 20, "#4a2a16", 1.8),
    zang: "lach",
  },
  {
    id: "kiwi",
    naam: "kiwi",
    gebied: "bos",
    weetje: "kan niet vliegen en zoekt wormen met de neus aan de punt van zijn snavel.",
    vorm: kiwi(),
    kleur: { lijf: "#8a6a46", kop: "#8a6a46", buik: "#9a7a54", vleugel: "#8a6a46", staart: "#8a6a46", snavel: "#dccca8", poot: "#9a8a72" },
    tekening: pluis(40, 160, 80, 168, 8, "#5e4428"),
    zang: "fluit",
  },
  {
    id: "regenbooglori",
    naam: "regenboog\u00adlori",
    gebied: "bos",
    weetje: "heeft alle kleuren van de regenboog.",
    vorm: roofvogel({ snavel: "papegaai", staart: "lang", kop: 0.95 }),
    kleur: {
      lijf: "#34a044",
      kop: "#2e4fb8",
      buik: "#f4891e",
      vleugel: "#2f9a40",
      staart: "#2f9a40",
      snavel: "#e8352a",
      poot: "#7a7a7a",
      iris: "#e84a1a",
    },
    tekening: (
      <g>
        {vlek(120, 150, 26, 14, "#2e4fb8")}
        {vlek(116, 104, 22, 10, "#e8352a")}
        {lijn("M92 84 C104 90 122 90 136 80", "#b8e03a", 5)}
      </g>
    ),
    vleugelTekening: () => schubben(80, 118, 88, 176, 9, "#1e7a2e", 1.2),
    staartTekening: lijn("M80 196 L104 198", "#e8e03a", 6),
    zang: "krijs",
  },
  {
    id: "liervogel",
    naam: "liervogel",
    gebied: "bos",
    weetje: "doet elk geluid na, zelfs een fototoestel.",
    vorm: { ...zangvogel({ staart: "recht", snavel: "spits" }), staart: LIER_STAART, kader: "0 10 200 180" },
    kleur: { lijf: "#7a6a5a", kop: "#7a6a5a", buik: "#a09282", vleugel: "#6e5a48", staart: "#8a6a4a", snavel: "#333", poot: "#444" },
    achterlaag: lijn(
      "M84 132 C64 100 50 70 52 30 M86 130 C70 100 60 74 64 36 M88 130 C80 100 76 70 78 50 M86 132 C58 110 42 90 38 64",
      "#d8ccbc",
      1.4,
    ),
    staartTekening: balken(10, 110, 6, 20, 140, 6, "#e8d8c0", 1.6),
    vleugelTekening: () => schubben(60, 118, 108, 160, 10, "#56463a", 1.2),
    zang: "fluit",
  },
  {
    id: "grote-bonte-specht",
    naam: "grote bonte specht",
    gebied: "bos",
    weetje: "roffelt op een boom om te laten horen: hier woon ik.",
    vorm: specht({ snavelS: 0.7 }),
    kleur: { lijf: "#1c1c20", kop: "#f4f0e8", buik: "#f4f0e8", vleugel: "#1c1c20", staart: "#1c1c20", snavel: "#444", poot: "#555" },
    tekening: (
      <g>
        {vlak("M90 58 C92 40 110 34 128 44 C122 48 112 50 104 52 Z", "#1c1c20")}
        {lijn("M130 66 C118 72 106 76 100 90 M104 84 C110 90 118 92 124 96", "#1c1c20", 4)}
        {vlek(94, 60, 6, 6, "#d9262b")}
        {vlek(96, 150, 12, 9, "#d9262b")}
      </g>
    ),
    vleugelTekening: () => (
      <g>
        {vlek(98, 98, 7, 12, "#f4f0e8")}
        {balken(70, 110, 8, 120, 164, -6, "#f4f0e8", 2.2)}
      </g>
    ),
    zang: "roffel",
  },
  {
    id: "roodborst",
    naam: "roodborst",
    gebied: "bos",
    weetje: "zingt ook in de winter.",
    vorm: zangvogel({ snavel: "spits", staart: "kort", kop: 1.05 }),
    kleur: { lijf: "#8a7358", kop: "#8a7358", buik: "#f2ede4", vleugel: "#7a6448", staart: "#7a6448", snavel: "#2b2b2b", poot: "#8a6a5a" },
    tekening: vlek(142, 104, 26, 30, "#e8662a"),
    vleugelTekening: () => schubben(60, 118, 108, 160, 10, "#5e4a34", 1.2),
    zang: "fluit",
  },
  {
    id: "vlaamse-gaai",
    naam: "vlaamse gaai",
    gebied: "bos",
    weetje: "doet het geluid van andere vogels na.",
    vorm: zangvogel({ snavel: "kegel", snavelS: 1.1, staart: "recht" }),
    kleur: {
      lijf: "#c9a08a",
      kop: "#d8b8a4",
      buik: "#ecdace",
      vleugel: "#2a2a2a",
      staart: "#1f1f1f",
      snavel: "#3a3a3a",
      poot: "#b89a8a",
      iris: "#9fc4e8",
    },
    tekening: (
      <g>
        {lijn("M150 90 C148 98 142 104 136 106", "#1a1a1a", 4)}
        {lijn("M118 62 L122 70 M126 60 L128 68 M134 60 L134 68", "#2a2a2a", 2)}
        {vlek(146, 104, 8, 6, "#f4ece6")}
      </g>
    ),
    vleugelTekening: () => (
      <g>
        {vlak("M86 100 C98 96 112 98 118 104 L110 124 C100 120 90 116 82 112 Z", "#3b82d8")}
        {balken(84, 118, 5, 98, 126, -6, "#101830", 1.6)}
        {vlak("M64 132 C72 128 80 128 88 132 L84 142 C76 140 70 140 62 142 Z", "#f4f4f4")}
      </g>
    ),
    zang: "krijs",
  },
  {
    id: "boomklever",
    naam: "boomklever",
    gebied: "bos",
    weetje: "loopt met zijn kop naar beneden langs een boom.",
    vorm: specht({ snavel: "spits", snavelS: 1.1 }),
    kleur: { lijf: "#6f86a0", kop: "#6f86a0", buik: "#e8a86a", vleugel: "#5f7690", staart: "#5f7690", snavel: "#3a3a3a", poot: "#8a7a6a" },
    tekening: (
      <g>
        {vlek(122, 76, 14, 10, "#f6f2ea")}
        {lijn("M132 60 L94 54", "#1a1a1a", 4.5)}
      </g>
    ),
    zang: "tjilp",
  },

  // ======== Veld ========
  {
    id: "slechtvalk",
    naam: "slechtvalk",
    gebied: "veld",
    weetje: "de snelste vogel van de wereld als hij naar beneden duikt.",
    vorm: roofvogel({ snavelS: 0.85, kop: 0.95 }),
    kleur: {
      lijf: "#5e6e82",
      kop: "#2e3440",
      buik: "#f0ece2",
      vleugel: "#56667a",
      staart: "#56667a",
      snavel: "#4a5262",
      poot: "#f5c518",
      oogring: "#f5c518",
    },
    tekening: (
      <g>
        {vlek(128, 72, 11, 9, "#f0ece2")}
        {lijn("M124 60 C122 70 118 80 116 88", "#2e3440", 6)}
        {bandjes(98, 136, 112, 164, 8, 7, 6, "#3e4656")}
      </g>
    ),
    vleugelTekening: () => schubben(76, 118, 90, 180, 10, "#3e4c5e", 1.3),
    staartTekening: lijn("M84 166 L112 166 M84 176 L110 176 M84 186 L110 186", "#2e3440", 2.5),
    zang: "krijs",
  },
  {
    id: "roodstaartbuizerd",
    naam: "roodstaart\u00adbuizerd",
    gebied: "veld",
    weetje: "cirkelt hoog boven de velden en zoekt muizen.",
    vorm: roofvogel(),
    kleur: {
      lijf: "#6b4a32",
      kop: "#6b4a32",
      buik: "#f3e8d8",
      vleugel: "#5a3e28",
      staart: "#c8552a",
      snavel: "#3a3a3a",
      poot: "#f0c030",
      iris: "#8a5a2a",
    },
    tekening: (
      <g>
        {bandjes(100, 136, 132, 148, 7, 6, 5, "#5a3e28", 2.4)}
        {vlek(132, 76, 8, 7, "#f3e8d8")}
      </g>
    ),
    vleugelTekening: () => schubben(76, 118, 90, 180, 10, "#8a6848", 1.3),
    zang: "krijs",
  },
  {
    id: "holenuil",
    naam: "holenuil",
    gebied: "veld",
    weetje: "woont in een hol onder de grond.",
    vorm: holenuilVorm,
    kleur: {
      lijf: "#9a7a58",
      kop: "#9a7a58",
      buik: "#efe4d0",
      vleugel: "#8a6a48",
      staart: "#8a6a48",
      snavel: "#c8c0a0",
      poot: "#c8c0b0",
      iris: "#f5c518",
    },
    tekening: (
      <g>
        {stippen(76, 124, 48, 60, 6, 1.3, "#f4ecdc")}
        {bandjes(84, 116, 104, 136, 7, 6, 5, "#7a5a3c", 1.4)}
        {vlek(100, 88, 10, 4, "#f7f2e6")}
      </g>
    ),
    vleugelTekening: () => stippen(60, 140, 100, 150, 7, 1.4, "#f0e6d2"),
    bovenop: lijn("M80 55 L96 59 M120 55 L104 59", "#f7f2e6", 2.6),
    zang: "hoe",
  },
  {
    id: "renkoekoek",
    naam: "renkoekoek",
    gebied: "veld",
    weetje: "rent liever dan dat hij vliegt.",
    vorm: renkoekoek(),
    kleur: { lijf: "#6a5a44", kop: "#5a4a38", buik: "#efe6d4", vleugel: "#5a4a36", staart: "#4a5a4a", snavel: "#3a3a3a", poot: "#6a7a8a" },
    extra: [{ d: "M124 74 C120 58 130 48 146 48 C140 56 142 64 148 72 Z", kleur: "#3e3226", achter: true }],
    tekening: (
      <g>
        {vlek(150, 86, 4, 3, "#e87a2a")}
        {vlek(146, 86, 3, 3, "#4a8ad8")}
        {balken(60, 132, 6, 90, 134, -10, "#8a7a62", 1.4)}
      </g>
    ),
    vleugelTekening: () => stippen(66, 116, 100, 116, 7, 1.4, "#efe6d4"),
    staartTekening: lijn("M12 74 L20 80 M24 82 L32 88", "#f4f0e8", 3),
    zang: "tjilp",
  },
  {
    id: "condor",
    naam: "californische condor",
    gebied: "veld",
    weetje: "een van de grootste vogels die kunnen vliegen.",
    vorm: roofvogel({ kop: 0.85, snavelS: 1 }),
    kleur: { lijf: "#1b1b1f", kop: "#ea916c", vleugel: "#1b1b1f", staart: "#1b1b1f", snavel: "#ece0c4", poot: "#9a8a88", iris: "#c81e1e" },
    extra: [{ d: "M90 78 C98 90 122 96 136 82 L138 94 L130 92 L128 100 L120 96 L114 104 L108 96 L100 102 L96 94 L88 96 Z", kleur: "#1b1b1f" }],
    tekening: vlek(128, 64, 10, 8, "#d8705a"),
    vleugelTekening: () => vlak("M80 118 C90 112 104 114 114 118 L112 132 C100 128 90 128 78 132 Z", "#ecece8"),
    zang: "krijs",
  },
  {
    id: "purpergors",
    naam: "purpergors",
    gebied: "veld",
    weetje: "is blauw, rood en groen tegelijk.",
    vorm: zangvogel({ snavel: "kegel", snavelS: 0.85 }),
    kleur: {
      lijf: "#3a9a4a",
      kop: "#3a5ad0",
      buik: "#e0282a",
      vleugel: "#3a8a44",
      staart: "#7a4aa0",
      snavel: "#7a7a8a",
      poot: "#7a6a6a",
      oogring: "#e0282a",
    },
    tekening: vlek(146, 104, 14, 10, "#e0282a"),
    vleugelTekening: () => schubben(60, 118, 108, 160, 10, "#2a6a34", 1.2),
    zang: "fluit",
  },
  {
    id: "emoe",
    naam: "emoe",
    gebied: "veld",
    weetje: "kan niet vliegen, maar rent heel snel.",
    vorm: emoe(),
    kleur: { lijf: "#6a5a48", kop: "#3a4a5a", buik: "#7a6a56", vleugel: "#6a5a48", staart: "#6a5a48", snavel: "#2a2a2a", poot: "#7a6a58", iris: "#c8742a" },
    tekening: (
      <g>
        {pluis(40, 144, 56, 132, 8, "#463a2c")}
        {vlak("M128 66 C134 54 138 42 142 30 L150 32 C146 46 142 58 140 76 Z", "#7a9ab8")}
      </g>
    ),
    zang: "hoe",
  },
  {
    id: "roze-kaketoe",
    naam: "roze kaketoe",
    gebied: "veld",
    weetje: "roze en grijs, en hangt graag ondersteboven.",
    vorm: roofvogel({ snavel: "papegaai", snavelS: 0.85 }),
    kleur: {
      lijf: "#a8a8b0",
      kop: "#e8708a",
      buik: "#e25a7a",
      vleugel: "#9a9aa4",
      staart: "#8a8a94",
      snavel: "#efe6dc",
      poot: "#9a8a8a",
      oogring: "#e84a6a",
    },
    extra: [{ d: "M98 46 C92 30 106 24 118 32 C112 36 108 40 106 48 Z", kleur: "#f4c8d4", achter: true }],
    tekening: vlek(112, 40, 16, 8, "#f4c8d4"),
    vleugelTekening: () => schubben(76, 118, 90, 180, 10, "#80808a", 1.2),
    zang: "krijs",
  },
  {
    id: "boerenzwaluw",
    naam: "boerenzwaluw",
    gebied: "veld",
    weetje: "vliegt elke winter helemaal naar afrika.",
    vorm: zangvogel({ staart: "gevorkt", vleugelLang: true, snavel: "spits", snavelS: 0.55 }),
    kleur: { lijf: "#1d2c5a", kop: "#1d2c5a", buik: "#f4e8dc", vleugel: "#1a254a", staart: "#1a254a", snavel: "#1a1a1a", poot: "#333" },
    tekening: (
      <g>
        {vlek(151, 78, 7, 6, "#c8402a")}
        {vlek(146, 98, 12, 9, "#c8402a")}
      </g>
    ),
    staartTekening: stippen(40, 70, 160, 172, 10, 1.8, "#f4f0ea"),
    zang: "tjilp",
  },
  {
    id: "torenvalk",
    naam: "torenvalk",
    gebied: "veld",
    weetje: "hangt stil in de lucht boven het gras.",
    vorm: roofvogel({ kop: 0.92, snavelS: 0.8 }),
    kleur: {
      lijf: "#c0683a",
      kop: "#8a9aac",
      buik: "#f2dcc0",
      vleugel: "#b8622e",
      staart: "#8a9aac",
      snavel: "#5a6272",
      poot: "#f5c518",
      oogring: "#f5c518",
    },
    tekening: (
      <g>
        {lijn("M122 62 L120 74", "#3a3a44", 3)}
        {stippen(100, 136, 104, 160, 9, 1.8, "#5a3a24")}
      </g>
    ),
    vleugelTekening: () => stippen(78, 116, 88, 150, 8, 2, "#3a2414"),
    staartTekening: lijn("M84 182 L110 182", "#1a1a1a", 5),
    zang: "krijs",
  },
  {
    id: "ekster",
    naam: "ekster",
    gebied: "veld",
    weetje: "bouwt een nest met een dak erop.",
    vorm: zangvogel({ staart: "lang", snavel: "spits", snavelS: 1.15 }),
    kleur: { lijf: "#141418", kop: "#141418", buik: "#f7f7f4", vleugel: "#141418", staart: "#1a2a50", snavel: "#141418", poot: "#222" },
    tekening: vlek(118, 150, 30, 20, "#141418"),
    vleugelTekening: () => (
      <g>
        {vlak("M118 100 C100 94 84 100 74 112 C88 112 104 110 118 106 Z", "#f7f7f4")}
        {vlak("M58 136 C54 146 48 156 44 162 C60 158 72 152 80 146 Z", "#2a4a9a")}
      </g>
    ),
    staartTekening: lijn("M70 140 L22 190", "#2a6a6a", 3),
    zang: "krijs",
  },
  {
    id: "merel",
    naam: "merel",
    gebied: "veld",
    weetje: "trekt wormen uit het gras.",
    vorm: zangvogel({ snavel: "spits", snavelS: 1.1 }),
    kleur: { lijf: "#1a1a1c", kop: "#1d1d20", vleugel: "#141416", staart: "#141416", snavel: "#f5a623", poot: "#3a3a3a", oogring: "#f5b82e" },
    vleugelTekening: () => schubben(60, 118, 108, 160, 10, "#34343a", 1.2),
    zang: "fluit",
  },
  {
    id: "koolmees",
    naam: "koolmees",
    gebied: "veld",
    weetje: "eet in de winter graag uit een vetbol.",
    vorm: zangvogel({ snavel: "spits", snavelS: 0.7, staart: "recht" }),
    kleur: { lijf: "#6f8a4a", kop: "#141414", buik: "#f2d23a", vleugel: "#5a6a78", staart: "#5a6a78", snavel: "#222", poot: "#6a7a8a" },
    tekening: (
      <g>
        {vlek(134, 90, 14, 9, "#ffffff")}
        {lijn("M142 104 C136 124 128 142 120 160", "#141414", 8)}
        {vlek(142, 100, 12, 6, "#141414")}
      </g>
    ),
    vleugelTekening: () => lijn("M112 106 C96 104 82 110 72 120", "#f4f4f0", 3.5),
    zang: "tjilp",
  },
  {
    id: "pimpelmees",
    naam: "pimpelmees",
    gebied: "veld",
    weetje: "heeft een blauw petje.",
    vorm: zangvogel({ snavel: "spits", snavelS: 0.6, staart: "kort", kop: 1.05 }),
    kleur: { lijf: "#8aa05a", kop: "#f6f6f2", buik: "#f2d63a", vleugel: "#3f7fc8", staart: "#3f7fc8", snavel: "#333", poot: "#6a7a9a" },
    tekening: (
      <g>
        {vlak("M104 72 C108 54 126 50 150 62 C140 64 126 66 110 76 Z", "#3f7fc8")}
        {lijn("M154 80 L106 78", "#1a2a4a", 4)}
        {lijn("M108 96 C120 108 136 110 150 100", "#1a2a4a", 4)}
        {vlek(150, 96, 5, 4, "#1a2a4a")}
      </g>
    ),
    vleugelTekening: () => lijn("M112 108 C96 106 82 112 72 122", "#f4f4f0", 3),
    zang: "tjilp",
  },
  {
    id: "huismus",
    naam: "huismus",
    gebied: "veld",
    weetje: "neemt graag een bad in het zand.",
    vorm: zangvogel({ snavel: "kegel", snavelS: 0.9 }),
    kleur: { lijf: "#9a6a44", kop: "#8a8a88", buik: "#cbc6be", vleugel: "#8a5a36", staart: "#6a4e36", snavel: "#2a2a2a", poot: "#b89a8a" },
    tekening: (
      <g>
        {lijn("M140 72 C128 70 114 72 104 82", "#8a4a26", 6)}
        {vlek(138, 90, 10, 6, "#eeeae4")}
        {vlek(150, 100, 10, 9, "#1e1e1e")}
      </g>
    ),
    vleugelTekening: () => (
      <g>
        {balken(56, 118, 9, 100, 164, -12, "#2e2014", 2.2)}
        {lijn("M110 110 C96 110 84 116 76 124", "#f4f0ea", 3)}
      </g>
    ),
    zang: "tjilp",
  },

  // ======== Water ========
  {
    id: "zeearend",
    naam: "amerikaanse zeearend",
    gebied: "water",
    start: true,
    weetje: "grijpt vissen uit het water met zijn sterke klauwen.",
    vorm: roofvogel({ kop: 1.05, snavelS: 1.1 }),
    kleur: {
      lijf: "#4a3222",
      kop: "#f8f6f0",
      vleugel: "#3f2a1c",
      staart: "#f8f6f0",
      snavel: "#f2b822",
      poot: "#f2b822",
      iris: "#f4e27a",
    },
    tekening: schubben(76, 136, 90, 166, 10, "#34221a", 1.3),
    vleugelTekening: () => schubben(76, 118, 88, 180, 10, "#2a1c12", 1.3),
    staartTekening: lijn("M96 160 L94 190 M104 160 L104 190", "#d8d4c8", 1.4),
    bovenop: lijn("M114 44 C120 42 128 44 134 48", "#b8b0a0", 3.5),
    zang: "krijs",
  },
  {
    id: "papegaaiduiker",
    naam: "papegaai\u00adduiker",
    gebied: "water",
    start: true,
    weetje: "draagt wel tien visjes tegelijk in zijn snavel.",
    vorm: rechtop(),
    kleur: { lijf: "#1a1a1e", kop: "#1a1a1e", buik: "#f7f7f4", vleugel: "#1a1a1e", staart: "#1a1a1e", snavel: "#f0662a", poot: "#f07a2a", oogring: "#e8402a" },
    tekening: (
      <g>
        {vlek(116, 66, 19, 16, "#eceae4")}
        {vlak("M72 96 C84 98 100 94 110 84 L112 92 C100 100 86 104 72 102 Z", "#1a1a1e")}
      </g>
    ),
    snavelTekening: (
      <g>
        {vlak("M127 53.5 L134 56 L134 76 L127 78.5 Z", "#5a6a80")}
        {lijn("M138 58 L138 74", "#f5d040", 2)}
      </g>
    ),
    bovenop: vlak("M114 52 L122 52 L118 49 Z M114 63 L122 63 L118 67 Z", "#6a6a70"),
    zang: "gak",
  },
  {
    id: "ijsvogel",
    naam: "ijsvogel",
    gebied: "water",
    start: true,
    weetje: "duikt kopje-onder om visjes te vangen.",
    vorm: zangvogel({ kop: 1.2, snavel: "dolk", snavelS: 1, staart: "kort" }),
    kleur: { lijf: "#1e86c4", kop: "#1e8ac8", buik: "#f07a2a", vleugel: "#1a74b4", staart: "#1a6aa8", snavel: "#1c1c1c", poot: "#e8502a" },
    tekening: (
      <g>
        {vlek(128, 82, 14, 8, "#f07a2a")}
        {vlek(112, 92, 8, 6, "#ffffff")}
        {vlek(152, 98, 8, 6, "#fbeee0")}
        {lijn("M60 128 C70 110 86 98 104 96", "#4fd0e8", 6)}
        {stippen(112, 150, 56, 70, 6, 1.2, "#6fd8f0")}
      </g>
    ),
    vleugelTekening: () => stippen(60, 116, 104, 150, 7, 1.4, "#6fd8f0"),
    zang: "fluit",
  },
  {
    id: "rode-lepelaar",
    naam: "rode lepelaar",
    gebied: "water",
    weetje: "is roze door wat hij eet.",
    vorm: steltloper({ snavel: "lepel", snavelS: 0.9, hals: "recht" }),
    kleur: {
      lijf: "#f39ab5",
      kop: "#e8e2b0",
      buik: "#f8c8d6",
      vleugel: "#ee7aa2",
      staart: "#ee8a3a",
      snavel: "#b8b6a0",
      poot: "#c8465a",
      iris: "#e22a2a",
    },
    vleugelTekening: () => vlak("M124 86 C112 82 100 84 92 88 L96 98 C106 96 116 96 124 96 Z", "#d02a5a"),
    zang: "gak",
  },
  {
    id: "pelikaan",
    naam: "amerikaanse witte pelikaan",
    gebied: "water",
    weetje: "schept vissen op met de zak onder zijn snavel.",
    vorm: pelikaan(),
    kleur: { lijf: "#f7f7f2", kop: "#f7f7f2", vleugel: "#f0f0ea", staart: "#eaeae4", snavel: "#f0a030", poot: "#f0a030", oogring: "#f0a030" },
    vleugelTekening: () => vlak("M30 126 C44 122 56 120 66 118 L64 128 C52 128 40 128 30 126 Z", "#1c1c1c"),
    zang: "gak",
  },
  {
    id: "ijsduiker",
    naam: "ijsduiker",
    gebied: "water",
    weetje: "duikt heel diep en roept 's nachts heel luid.",
    vorm: zwemvogel({ laag: true, snavel: "dolk", snavelS: 0.75 }),
    kleur: { lijf: "#1a1c20", kop: "#1a2a24", vleugel: "#1a1c20", staart: "#1a1c20", snavel: "#1a1a1a", poot: "#222", iris: "#c81e1e" },
    tekening: (
      <g>
        {lijn("M128 110 L128 104 M132 110 L132 103 M136 110 L136 103 M140 111 L140 104", "#f4f4f0", 1.8)}
        {stippen(50, 124, 118, 128, 6, 1.4, "#f4f4f0")}
      </g>
    ),
    vleugelTekening: () => stippen(56, 124, 122, 134, 6, 1.3, "#f4f4f0"),
    zang: "hoe",
  },
  {
    id: "trompetzwaan",
    naam: "trompetzwaan",
    gebied: "water",
    weetje: "roept als een trompet.",
    vorm: zwemvogel({ hals: "zwaan", snavel: "eend", snavelS: 0.95 }),
    kleur: { lijf: "#fbfbf8", kop: "#fbfbf8", vleugel: "#f2f2ee", staart: "#f2f2ee", snavel: "#1c1c1c", poot: "#222" },
    tekening: vlak("M150 52 C152 50 156 52 158 54 L150 58 Z", "#1c1c1c"),
    vleugelTekening: () => schubben(56, 124, 110, 132, 11, "#d8d8d2", 1.3),
    zang: "gak",
  },
  {
    id: "trompetkraanvogel",
    naam: "trompet\u00adkraanvogel",
    gebied: "water",
    weetje: "danst en springt om een vrouwtje te lokken.",
    vorm: steltloper({ hals: "recht", snavel: "dolk", snavelS: 0.95 }),
    kleur: { lijf: "#f8f8f4", kop: "#f8f8f4", vleugel: "#f2f2ee", staart: "#f2f2ee", snavel: "#4a4a36", poot: "#1c1c1c", iris: "#f5c518" },
    extra: [{ d: "M68 96 C48 100 34 116 40 132 C52 124 62 120 74 112 Z", kleur: "#f4f4f0", achter: true }],
    tekening: (
      <g>
        {vlek(136, 36, 10, 6, "#d62828")}
        {lijn("M146 50 C142 54 136 56 130 56", "#1c1c1c", 4)}
      </g>
    ),
    vleugelTekening: () => vlak("M38 118 C50 118 60 116 70 112 L72 120 C60 122 50 122 38 118 Z", "#1c1c1c"),
    zang: "gak",
  },
  {
    id: "visarend",
    naam: "visarend",
    gebied: "water",
    weetje: "duikt met zijn poten eerst in het water.",
    vorm: roofvogel({ kop: 0.95, snavelS: 1 }),
    kleur: {
      lijf: "#4a3a2e",
      kop: "#f6f4ee",
      buik: "#f7f5f0",
      vleugel: "#4a3a2e",
      staart: "#6a5a4a",
      snavel: "#1c1c1c",
      poot: "#b8c4c8",
      iris: "#f5d82a",
    },
    tekening: (
      <g>
        {lijn("M126 54 C114 58 104 62 94 72", "#4a3a2e", 6)}
        {stippen(104, 134, 92, 100, 6, 1.8, "#7a5a44")}
      </g>
    ),
    vleugelTekening: () => schubben(76, 118, 88, 180, 10, "#34281e", 1.3),
    staartTekening: lijn("M86 166 L110 166 M86 178 L110 178", "#3a2e24", 3),
    zang: "krijs",
  },
  {
    id: "zilverreiger",
    naam: "amerikaanse kleine zilverreiger",
    gebied: "water",
    weetje: "is sneeuwwit en heeft gele voeten.",
    vorm: steltloper({ hals: "s", snavel: "dolk", snavelS: 1 }),
    kleur: { lijf: "#fbfbf8", kop: "#fbfbf8", vleugel: "#f4f4f0", staart: "#f4f4f0", snavel: "#1c1c1c", poot: "#1c1c1c" },
    achterlaag: lijn("M100 84 C80 80 60 86 44 100 M104 82 C82 76 62 82 46 94", "#e8e8e2", 1.6),
    tekening: vlak("M142 38 L146 41 L142 43 Z", "#f5d82a"),
    bovenop: lijn("M82 178 L90 176 L96 178 M104 178 L110 176 L118 178", "#f5d82a", 4),
    zang: "gak",
  },
  {
    id: "wilde-eend",
    naam: "wilde eend",
    gebied: "water",
    weetje: "het mannetje heeft een glanzend groen hoofd.",
    vorm: zwemvogel({ hals: "kort", snavel: "eend" }),
    kleur: { lijf: "#b8b0a4", kop: "#1f6a3a", buik: "#d8d2c8", vleugel: "#8a7a66", staart: "#2a2a2a", snavel: "#f2c230", poot: "#f08a2a" },
    extra: [{ d: "M46 118 C40 108 48 100 54 106 C50 108 50 112 52 116 Z", kleur: "#1a1a1a", achter: true }],
    tekening: (
      <g>
        {vlek(142, 124, 18, 12, "#7a3a26")}
        {lijn("M126 108 C134 112 142 112 150 108", "#ffffff", 3)}
        {vlak("M124 106 C124 96 132 90 140 92 L150 100 C146 104 144 106 146 110 Z", "#1f6a3a")}
      </g>
    ),
    vleugelTekening: () => vlak("M72 122 C84 120 96 120 106 122 L104 130 C94 130 84 130 72 128 Z", "#2a4ac0"),
    zang: "kwak",
  },
  {
    id: "carolina-eend",
    naam: "carolina-eend",
    gebied: "water",
    weetje: "de kuikens springen uit een hoge boom naar beneden.",
    vorm: zwemvogel({ hals: "kort", snavel: "eend", snavelS: 0.85 }),
    kleur: {
      lijf: "#c8b890",
      kop: "#1e5a4a",
      buik: "#7a3024",
      vleugel: "#2a3a5a",
      staart: "#2a2a2a",
      snavel: "#e8402a",
      poot: "#e8a02a",
      iris: "#e82a2a",
      oogring: "#e84a2a",
    },
    extra: [{ d: "M130 78 C114 70 98 80 90 98 C106 94 118 94 128 96 Z", kleur: "#1e4a5a", achter: true }],
    tekening: (
      <g>
        {lijn("M154 84 C142 76 128 76 110 86 M144 98 C132 96 122 98 112 100", "#ffffff", 2.4)}
        {vlak("M146 98 C140 104 136 108 132 108 L138 100 Z", "#ffffff")}
        {stippen(132, 150, 114, 134, 5, 1.1, "#f4ece0")}
        {lijn("M124 118 L128 142", "#ffffff", 2.4)}
        {vlak("M126 108 C126 98 132 92 138 90 L150 98 C146 104 144 108 146 112 Z", "#7a3024")}
      </g>
    ),
    snavelTekening: vlak("M152 86 L158 86 L158 97 L152 97 Z", "#f4f0e8"),
    zang: "kwak",
  },
  {
    id: "canadese-gans",
    naam: "canadese gans",
    gebied: "water",
    weetje: "vliegt met de anderen in de vorm van een v.",
    vorm: zwemvogel({ hals: "gans", snavel: "eend", snavelS: 0.8 }),
    kleur: { lijf: "#8a7a66", kop: "#1a1a1a", buik: "#ece6da", vleugel: "#6e604e", staart: "#1a1a1a", snavel: "#1a1a1a", poot: "#222" },
    tekening: (
      <g>
        {vlak("M122 120 C126 100 134 80 138 62 L154 64 C148 82 142 100 146 122 Z", "#1a1a1a")}
        {vlek(142, 68, 7, 9, "#f7f5f0")}
      </g>
    ),
    vleugelTekening: () => schubben(56, 124, 110, 132, 10, "#b8aa94", 1.4),
    zang: "gak",
  },
  {
    id: "zwarte-zwaan",
    naam: "zwarte zwaan",
    gebied: "water",
    weetje: "helemaal zwart, met een rode snavel.",
    vorm: zwemvogel({ hals: "zwaan", snavel: "eend", snavelS: 0.95 }),
    kleur: { lijf: "#1c1c20", kop: "#1c1c20", vleugel: "#24242a", staart: "#1c1c20", snavel: "#d8262a", poot: "#222", iris: "#d8262a" },
    snavelTekening: lijn("M170 50 L170 60", "#f4f0e8", 2.4),
    vleugelTekening: () => schubben(56, 124, 108, 132, 9, "#6a6a72", 1.4),
    zang: "gak",
  },
  {
    id: "dwergpinguin",
    naam: "dwergpinguïn",
    gebied: "water",
    weetje: "de kleinste pinguïn van de wereld.",
    vorm: rechtop({ snavel: "spits", snavelS: 1.1 }),
    kleur: { lijf: "#3a6aa0", kop: "#3a6aa0", buik: "#f7f7f4", vleugel: "#34608f", staart: "#3a6aa0", snavel: "#2a2a2a", poot: "#f2c8c8", iris: "#aabacb" },
    tekening: vlak("M130 70 C124 78 118 82 110 84 L112 96 C120 92 128 84 132 74 Z", "#f7f7f4"),
    zang: "gak",
  },
  {
    id: "blauwe-reiger",
    naam: "blauwe reiger",
    gebied: "water",
    weetje: "staat heel stil tot er een vis voorbijzwemt.",
    vorm: steltloper({ hals: "s", snavel: "dolk", snavelS: 1.25 }),
    kleur: {
      lijf: "#9aa4ac",
      kop: "#f4f4f0",
      buik: "#e8ecee",
      vleugel: "#8a949c",
      staart: "#8a949c",
      snavel: "#f2c230",
      poot: "#b8a068",
      iris: "#f5d82a",
    },
    extra: [{ d: "M126 34 C112 32 98 36 88 44 C102 42 114 42 126 42 Z", kleur: "#1c1c1c", achter: true }],
    tekening: (
      <g>
        {lijn("M140 34 C132 32 124 34 118 40", "#1c1c1c", 4)}
        {lijn("M124 56 L122 62 M118 64 L118 70 M116 72 L118 78", "#2a2a2a", 2)}
        {vlak("M110 58 C112 54 118 50 124 50 L128 58 C122 60 116 62 112 66 Z", "#f4f4f0")}
      </g>
    ),
    vleugelTekening: () => vlak("M38 118 C52 118 62 116 72 112 L74 120 C62 122 50 122 38 118 Z", "#3a3e44"),
    zang: "gak",
  },
  {
    id: "fuut",
    naam: "fuut",
    gebied: "water",
    weetje: "draagt zijn jongen op zijn rug.",
    vorm: zwemvogel({ hals: "gans", snavel: "dolk", snavelS: 0.6, laag: true }),
    kleur: { lijf: "#7a6450", kop: "#f4f0ea", buik: "#f4f0ea", vleugel: "#6a5440", staart: "#6a5440", snavel: "#d88a8a", poot: "#555", iris: "#c81e1e" },
    extra: [
      { d: "M138 52 C132 38 146 32 158 38 C152 42 150 48 150 56 Z", kleur: "#1a1a1a", achter: true },
      { d: "M136 58 C122 64 122 82 136 86 C140 80 146 76 152 74 Z", kleur: "#b8521e", achter: true },
    ],
    tekening: (
      <g>
        {vlak("M124 120 C128 100 136 80 140 70 L148 72 C144 86 140 102 140 122 Z", "#f4f0ea")}
        {vlak("M132 52 C136 48 148 46 156 52 L146 58 Z", "#1a1a1a")}
      </g>
    ),
    bovenop: (
      <g>
        <ellipse cx={82} cy={114} rx={13} ry={8} fill="#e8e2d8" stroke="#1f1a24" strokeWidth={2.4} />
        <circle cx={94} cy={104} r={6.5} fill="#e8e2d8" stroke="#1f1a24" strokeWidth={2.4} />
        {lijn("M74 110 L78 118 M82 108 L84 118 M90 110 L90 116 M92 99 L96 108", "#1f1a24", 1.8)}
        <circle cx={96} cy={102} r={1.2} fill="#1f1a24" />
        <path d="M100 103 L104 104 L100 106 Z" fill="#e8a0a0" />
      </g>
    ),
    zang: "kwak",
  },
  {
    id: "ooievaar",
    naam: "ooievaar",
    gebied: "water",
    weetje: "klappert met zijn snavel.",
    vorm: steltloper({ hals: "recht", snavel: "dolk", snavelS: 1.25 }),
    kleur: { lijf: "#f8f8f4", kop: "#f8f8f4", vleugel: "#1c1c1c", staart: "#f8f8f4", snavel: "#e0302a", poot: "#e0302a" },
    vleugelTekening: () => vlak("M124 86 C100 78 76 84 62 98 L66 104 C84 96 104 94 126 96 Z", "#f8f8f4"),
    zang: "klapper",
  },
];

export const STARTVOGELS = VOGELS.filter((v) => v.start);

export function vindVogel(id: string | null | undefined): Soort | undefined {
  return VOGELS.find((v) => v.id === id);
}

/** Is dit een vogel die als avatar gekozen kan worden? */
export function isStartvogel(id: string | null | undefined): boolean {
  return STARTVOGELS.some((v) => v.id === id);
}
