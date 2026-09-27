// De lichaamsvormen van de vogels. Elke vorm is een set paden in een eigen
// tekenvlak van 200 × 200 (de vogel kijkt naar rechts, de poten staan op
// `grond`). Een soort kiest een vorm en geeft kleuren en een tekening mee
// (zie vogels.tsx); de vorm bepaalt waar kop, oog, snavel en vleugel zitten.
//
// Paden gebruiken enkel absolute M, L, C, Q en Z, zodat `verschuif` ze kan
// verschalen en verplaatsen.

export type Punt = [number, number];
export type Oog = { x: number; y: number; r: number };

export type Snavelsoort =
  | "kegel"
  | "spits"
  | "dolk"
  | "lang"
  | "haak"
  | "papegaai"
  | "eend"
  | "lepel"
  | "duiker"
  | "pelikaan"
  | "kort"
  | "uil";

export type Geometrie = {
  staart: string;
  /** Lijf en hals samen. */
  lijf: string;
  kop: string;
  /** Een lichtere vlek op borst en buik; wordt geknipt op het lijf. */
  buik: string;
  /** Eén of twee vleugels (een uil kijkt ons aan en heeft er twee). */
  vleugels: { d: string; schouder: Punt }[];
  /** Poten als lijnen. */
  poten: string;
  pootDikte: number;
  ogen: Oog[];
  snavel: { d: string; lijn?: string };
  /** Midden en straal van de kop, voor effecten en het portret. */
  kop0: { x: number; y: number; r: number };
  grond: number;
  /** Zwemvogels: alles onder deze lijn zit onder water. */
  water?: number;
  /** Spechten hangen aan een stuk boomstam. */
  stam?: boolean;
  kader: string;
  portret: string;
};

// ---- Hulpjes ------------------------------------------------------------------

export function ellips(cx: number, cy: number, rx: number, ry: number): string {
  // Vier kwartbogen als kubische bezier, zodat verschuif het pad begrijpt.
  const k = 0.5523;
  return [
    `M${cx - rx} ${cy}`,
    `C${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry} ${cx} ${cy - ry}`,
    `C${cx + rx * k} ${cy - ry} ${cx + rx} ${cy - ry * k} ${cx + rx} ${cy}`,
    `C${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}`,
    `C${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}`,
    "Z",
  ].join(" ");
}

export const cirkel = (cx: number, cy: number, r: number) => ellips(cx, cy, r, r);

const rond = (n: number) => Math.round(n * 10) / 10;

/** Verschaalt (rond 100, grond) en verplaatst alle punten van een pad. */
export function verschuifPad(d: string, s: number, dx: number, dy: number, oy = 176): string {
  return d.replace(/(-?\d*\.?\d+)[ ,]+(-?\d*\.?\d+)/g, (_, x, y) => {
    const nx = 100 + (parseFloat(x) - 100) * s + dx;
    const ny = oy + (parseFloat(y) - oy) * s + dy;
    return `${rond(nx)} ${rond(ny)}`;
  });
}

/** Dezelfde vorm, groter of kleiner en verplaatst (bv. een uil op lange poten). */
export function verschuif(g: Geometrie, s: number, dx = 0, dy = 0): Geometrie {
  const p = (d: string) => verschuifPad(d, s, dx, dy, g.grond);
  const pt = ([x, y]: Punt): Punt => [100 + (x - 100) * s + dx, g.grond + (y - g.grond) * s + dy];
  return {
    ...g,
    staart: p(g.staart),
    lijf: p(g.lijf),
    kop: p(g.kop),
    buik: p(g.buik),
    vleugels: g.vleugels.map((v) => ({ d: p(v.d), schouder: pt(v.schouder) })),
    poten: p(g.poten),
    pootDikte: g.pootDikte * s,
    ogen: g.ogen.map((o) => {
      const [x, y] = pt([o.x, o.y]);
      return { x, y, r: o.r * s };
    }),
    snavel: { d: p(g.snavel.d), lijn: g.snavel.lijn && p(g.snavel.lijn) },
    kop0: (() => {
      const [x, y] = pt([g.kop0.x, g.kop0.y]);
      return { x, y, r: g.kop0.r * s };
    })(),
  };
}

/**
 * Een snavel die vastzit op (x, y) aan de voorkant van de kop en naar rechts
 * wijst; s verschaalt, `hoek` draait hem naar beneden (graden).
 */
export function snavel(soort: Snavelsoort, x: number, y: number, s = 1, hoek = 0): { d: string; lijn?: string } {
  const P = (dx: number, dy: number) => {
    const h = (hoek * Math.PI) / 180;
    const rx = dx * s * Math.cos(h) - dy * s * Math.sin(h);
    const ry = dx * s * Math.sin(h) + dy * s * Math.cos(h);
    return `${rond(x + rx)} ${rond(y + ry)}`;
  };
  switch (soort) {
    case "kegel":
      return { d: `M${P(-2, -8)} Q${P(9, -7)} ${P(17, 0)} Q${P(9, 6)} ${P(-2, 8)} Z`, lijn: `M${P(0, 0.5)} L${P(14, 0.2)}` };
    case "spits":
      return { d: `M${P(-2, -5)} Q${P(8, -4)} ${P(16, 0.5)} Q${P(8, 3.5)} ${P(-2, 5)} Z`, lijn: `M${P(0, 0.5)} L${P(12, 0.8)}` };
    case "dolk":
      return { d: `M${P(-2, -7)} Q${P(16, -5)} ${P(34, 0.5)} Q${P(16, 4)} ${P(-2, 7)} Z`, lijn: `M${P(0, 0.8)} L${P(30, 0.8)}` };
    case "lang":
      return { d: `M${P(-2, -3.2)} Q${P(20, -2.4)} ${P(44, 0.6)} Q${P(20, 2.2)} ${P(-2, 3.4)} Z` };
    case "haak":
      return {
        d: `M${P(-3, -9)} Q${P(10, -12)} ${P(16, -3)} Q${P(19, 4)} ${P(14, 11)} Q${P(13, 4)} ${P(8, 3)} L${P(-3, 7)} Z`,
        lijn: `M${P(0, 2)} Q${P(6, 3)} ${P(9, 3)}`,
      };
    case "papegaai":
      return {
        d: `M${P(-4, -12)} Q${P(14, -16)} ${P(20, -2)} Q${P(22, 10)} ${P(13, 18)} Q${P(14, 8)} ${P(8, 5)} Q${P(6, 11)} ${P(-3, 12)} Z`,
        lijn: `M${P(-2, 3)} Q${P(4, 2)} ${P(8, 5)}`,
      };
    case "eend":
      return {
        d: `M${P(-3, -6)} Q${P(8, -8)} ${P(21, -3)} Q${P(26, 1)} ${P(21, 5)} Q${P(8, 6)} ${P(-3, 5)} Z`,
        lijn: `M${P(0, 1)} Q${P(12, 2)} ${P(22, 1.5)}`,
      };
    case "lepel":
      return {
        d: `M${P(-2, -4.5)} Q${P(20, -3)} ${P(34, -3)} Q${P(46, -9)} ${P(50, -1)} Q${P(50, 7)} ${P(38, 4)} Q${P(20, 4)} ${P(-2, 4.5)} Z`,
      };
    case "duiker":
      // De clownsnavel van de papegaaiduiker: hoog en driehoekig.
      return { d: `M${P(-3, -13)} Q${P(14, -8)} ${P(22, 1)} Q${P(14, 9)} ${P(-3, 13)} Z`, lijn: `M${P(0, 1)} L${P(19, 1)}` };
    case "pelikaan":
      return {
        d: `M${P(-2, -6)} Q${P(30, -5)} ${P(62, 1)} Q${P(66, 5)} ${P(60, 7)} Q${P(40, 26)} ${P(14, 22)} Q${P(2, 18)} ${P(-2, 7)} Z`,
        lijn: `M${P(0, 1)} Q${P(30, 2)} ${P(62, 3)}`,
      };
    case "kort":
      return { d: `M${P(-2, -4)} Q${P(7, -3)} ${P(10, 1)} Q${P(6, 4)} ${P(-2, 4)} Z` };
    case "uil":
      // Recht van voren: een klein haakje tussen de ogen.
      return { d: `M${x - 5 * s} ${y} Q${x} ${y - 3 * s} ${x + 5 * s} ${y} Q${x + 2 * s} ${y + 9 * s} ${x} ${y + 13 * s} Q${x - 2 * s} ${y + 9 * s} ${x - 5 * s} ${y} Z` };
  }
}

// ---- Vormen -------------------------------------------------------------------

export type Staartsoort = "kort" | "recht" | "gevorkt" | "lang" | "op";

const ZANG_STAART: Record<Staartsoort, string> = {
  kort: "M72 134 L50 160 Q48 168 58 166 L86 146 Z",
  recht: "M72 132 L38 170 Q34 178 44 178 L86 146 Z",
  gevorkt: "M72 132 L30 180 L50 168 L46 190 L86 146 Z",
  lang: "M72 132 L14 190 Q10 198 22 196 L86 146 Z",
  op: "M66 130 L36 98 Q30 92 26 100 L60 146 Z",
};

/** Zangvogels, ijsvogels, gaaien: schuin op een tak. */
export function zangvogel({
  staart = "recht",
  kop = 1,
  snavel: sn = "spits",
  snavelS = 1,
  vleugelLang = false,
}: {
  staart?: Staartsoort;
  kop?: number;
  snavel?: Snavelsoort;
  snavelS?: number;
  vleugelLang?: boolean;
} = {}): Geometrie {
  const r = 25 * kop;
  const kx = 130;
  const ky = 82 - (kop - 1) * 8;
  return {
    staart: ZANG_STAART[staart],
    lijf: "M58 128 C56 100 80 88 104 88 C128 88 146 100 144 124 C142 148 120 158 100 158 C78 158 60 150 58 128 Z",
    kop: cirkel(kx, ky, r),
    buik: ellips(124, 136, 34, 32),
    vleugels: [
      {
        d: vleugelLang
          ? "M118 100 C96 92 74 104 62 122 C50 142 40 162 26 184 C58 168 92 150 106 134 C118 122 122 108 118 100 Z"
          : "M118 100 C96 92 74 104 64 124 C56 140 50 152 44 162 C66 158 92 148 106 134 C118 122 122 108 118 100 Z",
        schouder: [114, 102],
      },
    ],
    poten: "M98 156 L94 176 M86 177 L94 176 L102 177 M112 154 L114 176 M106 177 L114 176 L122 177",
    pootDikte: 3,
    ogen: [{ x: kx + r * 0.36, y: ky - r * 0.2, r: 5 * Math.sqrt(kop) }],
    snavel: snavel(sn, kx + r * 0.9, ky + r * 0.1, snavelS),
    kop0: { x: kx, y: ky, r },
    grond: 176,
    kader: "0 20 200 180",
    portret: `${kx - r * 1.85} ${ky - r * 1.7} ${r * 4} ${r * 4}`,
  };
}

/** Spechten en boomklevers: tegen een stam, de staart als steun. */
export function specht({ snavel: sn = "dolk", snavelS = 0.75 }: { snavel?: Snavelsoort; snavelS?: number } = {}): Geometrie {
  return {
    staart: "M84 140 L70 194 L88 188 L98 146 Z",
    lijf: "M78 150 C66 120 70 88 92 76 C112 66 128 80 126 106 C124 134 106 158 78 150 Z",
    kop: cirkel(112, 60, 21),
    buik: ellips(116, 118, 20, 40),
    vleugels: [
      {
        d: "M104 82 C88 80 78 96 76 116 C74 132 76 148 82 162 C96 146 106 126 110 106 C112 94 110 86 104 82 Z",
        schouder: [102, 86],
      },
    ],
    poten: "M88 118 L74 122 M70 116 L74 122 L70 128 M88 136 L74 140 M70 134 L74 140 L70 146",
    pootDikte: 3,
    ogen: [{ x: 118, y: 56, r: 4.5 }],
    snavel: snavel(sn, 130, 62, snavelS),
    kop0: { x: 112, y: 60, r: 21 },
    grond: 176,
    stam: true,
    kader: "20 20 170 180",
    portret: "66 18 92 92",
  };
}

/** Roofvogels en papegaaien: rechtop op een tak. */
export function roofvogel({
  snavel: sn = "haak",
  snavelS = 1,
  staart = "recht",
  kop = 1,
}: {
  snavel?: Snavelsoort;
  snavelS?: number;
  staart?: "recht" | "lang";
  kop?: number;
} = {}): Geometrie {
  const r = 24 * kop;
  return {
    staart: staart === "lang" ? "M92 150 L78 198 L102 200 L114 152 Z" : "M92 152 L84 192 L108 192 L112 152 Z",
    lijf: "M78 84 C90 70 118 70 128 86 C138 104 134 140 118 162 C110 170 92 170 86 160 C72 136 68 104 78 84 Z",
    kop: cirkel(116, 58, r),
    buik: ellips(116, 126, 22, 42),
    vleugels: [
      {
        d: "M112 80 C92 74 78 90 76 112 C74 136 80 160 88 184 C98 168 108 150 112 128 C116 110 118 90 112 80 Z",
        schouder: [106, 84],
      },
    ],
    poten: "M98 164 L96 176 M88 179 L96 176 L100 180 M112 164 L114 176 M108 180 L114 176 L122 179",
    pootDikte: 6,
    ogen: [{ x: 124, y: 52, r: 5 }],
    snavel: snavel(sn, 116 + r * 0.9, 60, snavelS),
    kop0: { x: 116, y: 58, r },
    grond: 176,
    kader: "20 10 170 190",
    portret: "68 14 96 96",
  };
}

/** Uilen kijken ons recht aan. */
export function uil(): Geometrie {
  return {
    staart: "M86 164 L84 182 L116 182 L114 164 Z",
    lijf: "M60 110 C60 82 78 70 100 70 C122 70 140 82 140 110 C142 146 124 172 100 172 C76 172 58 146 60 110 Z",
    kop: ellips(100, 70, 40, 34),
    buik: ellips(100, 132, 28, 36),
    vleugels: [
      { d: "M66 94 C54 110 54 142 68 168 C78 154 82 128 80 102 Z", schouder: [70, 98] },
      { d: "M134 94 C146 110 146 142 132 168 C122 154 118 128 120 102 Z", schouder: [130, 98] },
    ],
    poten: "M90 170 L86 180 M95 171 L95 181 M105 171 L105 181 M110 170 L114 180",
    pootDikte: 4,
    ogen: [
      { x: 84, y: 68, r: 11 },
      { x: 116, y: 68, r: 11 },
    ],
    snavel: snavel("uil", 100, 76, 1),
    kop0: { x: 100, y: 70, r: 38 },
    grond: 180,
    kader: "20 10 160 180",
    portret: "48 12 104 104",
  };
}

/** Reigers, lepelaars, ooievaars, kraanvogels: lange hals en lange poten. */
export function steltloper({
  snavel: sn = "dolk",
  snavelS = 1.3,
  hals = "s",
}: {
  snavel?: Snavelsoort;
  snavelS?: number;
  hals?: "s" | "recht";
} = {}): Geometrie {
  const kop = hals === "s" ? { x: 132, y: 40 } : { x: 136, y: 46 };
  const nek =
    hals === "s"
      ? "M112 86 C104 70 108 58 124 50 L140 44 C132 58 120 64 132 88 Z"
      : "M114 88 C118 72 124 60 128 50 L144 50 C138 62 134 76 134 90 Z";
  return {
    staart: "M62 98 L38 110 L62 116 Z",
    lijf: "M56 98 C60 80 96 72 124 80 C140 86 142 102 130 112 C112 126 76 126 62 116 C54 110 54 104 56 98 Z " + nek,
    kop: cirkel(kop.x, kop.y, 12),
    buik: ellips(116, 110, 26, 14),
    vleugels: [
      {
        d: "M124 86 C100 78 76 84 62 98 C56 106 48 112 38 118 C70 124 104 118 120 106 C128 100 128 90 124 86 Z",
        schouder: [118, 90],
      },
    ],
    poten: "M92 120 L90 176 M82 178 L90 176 L96 178 M106 120 L110 176 M104 178 L110 176 L118 178",
    pootDikte: 3.5,
    ogen: [{ x: kop.x + 4, y: kop.y - 3, r: 3.2 }],
    snavel: snavel(sn, kop.x + 10, kop.y + 1, snavelS),
    kop0: { x: kop.x, y: kop.y, r: 12 },
    grond: 176,
    kader: "20 10 180 180",
    portret: `${kop.x - 36} ${kop.y - 26} 76 76`,
  };
}

/** Eenden, zwanen, ganzen, futen, duikers: zwemmend, onderkant onder water. */
export function zwemvogel({
  hals = "kort",
  snavel: sn = "eend",
  snavelS = 1,
  laag = false,
}: {
  hals?: "kort" | "zwaan" | "gans";
  snavel?: Snavelsoort;
  snavelS?: number;
  laag?: boolean;
} = {}): Geometrie {
  const kop =
    hals === "zwaan" ? { x: 148, y: 52, r: 13 } : hals === "gans" ? { x: 146, y: 62, r: 15 } : { x: 140, y: 90, r: 18 };
  const nek = {
    kort: "M124 118 C122 106 126 98 134 92 L150 100 C144 106 142 112 146 122 Z",
    zwaan: "M112 122 C100 104 100 80 116 64 C124 56 134 50 144 48 L150 60 C140 62 132 68 128 76 C122 88 126 104 136 120 Z",
    gans: "M122 120 C126 100 134 80 138 62 L154 64 C148 82 142 100 146 122 Z",
  }[hals];
  const romp = laag
    ? "M34 132 C40 118 70 114 100 114 C124 114 142 120 150 132 C148 150 124 156 96 156 C66 156 40 150 34 132 Z"
    : "M40 124 C44 108 70 102 100 104 C124 106 140 112 148 128 C146 146 126 154 96 154 C66 154 44 146 40 124 Z";
  return {
    staart: laag ? "M40 130 L22 122 L40 142 Z" : "M46 122 L28 104 L48 136 Z",
    lijf: `${romp} ${nek}`,
    kop: cirkel(kop.x, kop.y, kop.r),
    buik: ellips(136, 132, 24, 22),
    vleugels: [
      {
        d: laag
          ? "M126 124 C104 118 72 118 50 128 C70 140 104 140 124 134 Z"
          : "M126 116 C104 106 72 108 52 120 C70 134 104 136 124 128 Z",
        schouder: [120, 118],
      },
    ],
    poten: "",
    pootDikte: 0,
    ogen: [{ x: kop.x + kop.r * 0.3, y: kop.y - kop.r * 0.25, r: 3.8 }],
    snavel: snavel(sn, kop.x + kop.r * 0.85, kop.y + kop.r * 0.1, snavelS),
    kop0: kop,
    grond: 150,
    water: 146,
    kader: "10 20 190 150",
    portret: `${kop.x - kop.r * 2.6} ${kop.y - kop.r * 2.2} ${kop.r * 5} ${kop.r * 5}`,
  };
}

/** Rechtopstaande zeevogels: papegaaiduiker en pinguïn. */
export function rechtop({ snavel: sn = "duiker", snavelS = 1 }: { snavel?: Snavelsoort; snavelS?: number } = {}): Geometrie {
  return {
    staart: "M84 160 L72 172 L92 170 Z",
    lijf: "M72 112 C70 82 86 66 106 66 C126 66 138 84 136 112 C136 146 124 170 104 170 C84 170 72 150 72 112 Z",
    kop: cirkel(108, 64, 26),
    buik: ellips(116, 124, 20, 46),
    vleugels: [{ d: "M94 96 C82 110 80 136 86 154 C98 140 104 118 102 98 Z", schouder: [96, 98] }],
    poten: "M98 168 L94 176 M86 177 L94 176 L100 177 M114 168 L116 176 M110 177 L116 176 L124 177",
    pootDikte: 5,
    ogen: [{ x: 118, y: 58, r: 4.6 }],
    snavel: snavel(sn, 130, 66, snavelS),
    kop0: { x: 108, y: 64, r: 26 },
    grond: 176,
    kader: "30 20 150 170",
    portret: "58 16 100 100",
  };
}

/** Kolibrie: hangt stil in de lucht, de vleugels omhoog. */
export function kolibrie(): Geometrie {
  return {
    staart: "M76 128 L48 150 L64 150 L56 166 L86 138 Z",
    lijf: "M70 132 C66 112 86 98 108 98 C124 98 134 108 128 120 C120 136 96 148 70 132 Z",
    kop: cirkel(132, 94, 17),
    buik: ellips(110, 130, 24, 12),
    vleugels: [{ d: "M106 102 C92 76 96 46 114 24 C124 48 122 80 112 104 Z", schouder: [108, 102] }],
    poten: "",
    pootDikte: 0,
    ogen: [{ x: 138, y: 90, r: 4 }],
    snavel: snavel("lang", 147, 96, 1),
    kop0: { x: 132, y: 94, r: 17 },
    grond: 160,
    kader: "30 10 170 170",
    portret: "90 52 84 84",
  };
}

/** Pelikaan: groot lijf, korte poten, reuzensnavel. */
export function pelikaan(): Geometrie {
  return {
    staart: "M44 112 L26 118 L44 126 Z",
    lijf: "M40 116 C40 90 70 80 100 84 C124 88 136 104 130 126 C122 146 92 152 70 146 C50 140 40 130 40 116 Z M118 92 C120 80 126 72 134 68 L148 72 C140 80 136 90 130 104 Z",
    kop: cirkel(142, 64, 15),
    buik: ellips(110, 120, 26, 24),
    vleugels: [
      { d: "M118 92 C96 84 66 90 50 106 C44 114 36 120 30 126 C62 132 100 124 116 110 C122 104 122 96 118 92 Z", schouder: [112, 96] },
    ],
    poten: "M86 146 L84 176 M76 178 L84 176 L90 178 M104 144 L106 176 M100 178 L106 176 L114 178",
    pootDikte: 5,
    ogen: [{ x: 146, y: 60, r: 3.4 }],
    snavel: snavel("pelikaan", 154, 66, 0.72, 22),
    kop0: { x: 142, y: 64, r: 15 },
    grond: 176,
    kader: "10 20 190 170",
    portret: "104 30 76 76",
  };
}

/** Emoe: groot, pluizig, lange hals en sterke poten. */
export function emoe(): Geometrie {
  return {
    staart: "M40 90 L30 104 L46 106 Z",
    lijf: "M40 96 C40 66 70 54 100 56 C128 58 146 76 142 100 C138 124 110 134 84 132 C58 130 40 118 40 96 Z M124 70 C132 56 136 44 140 30 L154 32 C150 48 146 62 142 84 Z",
    kop: cirkel(148, 28, 12),
    buik: ellips(116, 110, 28, 20),
    vleugels: [],
    poten: "M88 128 L84 176 M72 178 L84 176 L90 178 M106 128 L112 176 M104 178 L112 176 L122 178",
    pootDikte: 7,
    ogen: [{ x: 152, y: 24, r: 3.4 }],
    snavel: snavel("eend", 158, 30, 0.55),
    kop0: { x: 148, y: 28, r: 12 },
    grond: 176,
    kader: "10 0 180 190",
    portret: "110 -8 80 80",
  };
}

/** Kiwi: een bol zonder vleugels, met een lange snavel naar de grond. */
export function kiwi(): Geometrie {
  return {
    staart: "M44 130 L38 134 L44 138 Z",
    lijf: cirkel(96, 124, 48) + " " + ellips(96, 128, 56, 40),
    kop: cirkel(140, 108, 18),
    buik: ellips(104, 150, 36, 16),
    vleugels: [],
    poten: "M86 162 L84 176 M76 178 L84 176 L90 178 M106 162 L108 176 M102 178 L108 176 L116 178",
    pootDikte: 6,
    ogen: [{ x: 146, y: 104, r: 3.2 }],
    snavel: snavel("lang", 154, 114, 1.1, 36),
    kop0: { x: 140, y: 108, r: 18 },
    grond: 176,
    kader: "20 50 180 140",
    portret: "96 70 80 80",
  };
}

/** Wilde kalkoen: een waaier van staartveren achter een rond lijf. */
export function kalkoen(): Geometrie {
  return {
    staart: "M74 118 C40 110 24 70 40 42 C58 18 96 14 116 34 C104 60 96 90 90 120 Z",
    lijf: "M64 120 C62 94 86 82 110 86 C132 90 142 108 136 128 C128 150 104 156 86 152 C70 148 64 136 64 120 Z M124 96 C128 84 134 74 140 66 L152 70 C146 80 140 92 138 104 Z",
    kop: cirkel(146, 62, 11),
    buik: ellips(118, 128, 22, 24),
    vleugels: [{ d: "M118 96 C98 90 78 100 72 118 C70 128 72 136 76 142 C96 138 112 126 118 112 C122 104 122 98 118 96 Z", schouder: [112, 98] }],
    poten: "M96 150 L94 176 M86 178 L94 176 L100 178 M112 148 L114 176 M108 178 L114 176 L122 178",
    pootDikte: 5,
    ogen: [{ x: 149, y: 59, r: 3 }],
    snavel: snavel("spits", 156, 64, 0.7),
    kop0: { x: 146, y: 62, r: 11 },
    grond: 176,
    kader: "10 0 180 190",
    portret: "110 30 70 70",
  };
}

/** Renkoekoek: horizontaal, lange staart schuin omhoog, lange poten. */
export function renkoekoek(): Geometrie {
  return {
    staart: "M66 108 L10 72 Q4 68 6 78 L60 122 Z",
    lijf: "M58 112 C60 96 82 88 104 90 C124 92 136 102 132 116 C126 130 104 136 84 134 C66 132 56 124 58 112 Z",
    kop: cirkel(138, 84, 17),
    buik: ellips(118, 124, 20, 12),
    vleugels: [{ d: "M118 98 C98 92 78 98 64 110 C82 122 104 122 118 112 Z", schouder: [112, 100] }],
    poten: "M92 132 L88 176 M80 178 L88 176 L94 178 M106 132 L112 176 M106 178 L112 176 L120 178",
    pootDikte: 3.5,
    ogen: [{ x: 143, y: 80, r: 3.6 }],
    snavel: snavel("dolk", 153, 86, 0.75),
    kop0: { x: 138, y: 84, r: 17 },
    grond: 176,
    kader: "0 40 200 150",
    portret: "96 44 80 80",
  };
}
