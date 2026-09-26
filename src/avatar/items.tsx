// Alle kleren en spulletjes. Elk item tekent zichzelf in het assenstelsel van
// de avatar (viewBox 0 0 200 400), zodat het op elke avatar past. `kader` is het
// stukje dat getoond wordt als los prentje in de kast.

import type { ReactNode } from "react";
import {
  ARM_LINKS,
  ARM_RECHTS,
  Bloem,
  Geknipt,
  LIJN,
  MOUW_KORT_LINKS,
  MOUW_KORT_RECHTS,
  OMLIJND,
  Paar,
  Streng,
  hartPad,
  sterPad,
  vonkPad,
} from "./vormen";

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
  { id: "hoofd", naam: "hoeden en haar", icoon: "🎀" },
  { id: "brillen", naam: "brillen", icoon: "🕶️" },
  { id: "tassen", naam: "shopping", icoon: "🛍️" },
];

export type Teken = { uid: string; huid: string };

export type Item = {
  id: string;
  naam: string;
  categorie: Categorie;
  /** Startkleren heeft elke avatar van bij het begin. */
  start?: boolean;
  kader: string;
  teken: (t: Teken) => ReactNode;
};

/** Categorieën die ook helemaal uit mogen (anders loopt de avatar in haar ondergoed). */
export const UITTREKBAAR: Categorie[] = ["kleedjes", "hoofd", "brillen", "tassen"];

// ---- Vormen ---------------------------------------------------------------

const TANK = "M81 102 L87 102 Q100 112 113 102 L119 102 L119 166 L81 166 Z";
const CROP = "M78 102 Q100 96 122 102 L120 146 L80 146 Z";
const SHIRT = "M77 100 Q100 94 123 100 L120 168 L80 168 Z";
const HOODIE = "M71 99 Q100 92 129 99 L133 186 L67 186 Z";
const SHORT = "M79 158 L121 158 L125 208 L103 208 L100 190 L97 208 L75 208 Z";
const BROEK = "M79 160 L121 160 L128 348 L104 348 L100 212 L96 348 L72 348 Z";
const WIJD = "M78 156 L122 156 L134 348 L104 348 L100 208 L96 348 L66 348 Z";
const MINI = "M80 158 L120 158 L134 202 L66 202 Z";
const TENNIS = "M80 158 L120 158 L130 198 L70 198 Z";
const TULE = "M80 158 L120 158 L142 264 Q100 272 58 264 Z";
const SNEAKER = "M83 340 L97 340 L100 356 Q101 366 92 366 L72 366 Q66 366 68 358 Q70 350 83 346 Z";
const HOOG = "M72 330 L98 330 L99 360 L66 360 Q62 348 72 336 Z";
const BOOT = "M73 316 L98 316 L98 360 L64 360 Q60 352 72 346 Z";
const VOET = "M85 342 L97 342 L98 362 Q98 366 92 366 L74 366 Q68 366 70 360 Q74 352 85 350 Z";

const DONKER_ROZE = "#e05b8f";
const ROZE = "#f4a7c8";
const BES = "#a8325e";
const MAUVE = "#c86a9a";
const LILA = "#b9b3d9";
const OKER = "#e8b04a";
const JEANS = "#8fb4e3";

/** Een truitje: eerst de mouwen, dan de romp erover. */
function Truitje({
  romp,
  kleur,
  mouwen,
  mouwKleur = kleur,
}: {
  romp: string;
  kleur: string;
  mouwen: "lang" | "kort" | "geen";
  mouwKleur?: string;
}) {
  const dikte = mouwen === "kort" ? 13 : 11;
  return (
    <g>
      {mouwen === "lang" && (
        <>
          <Streng d={ARM_LINKS} kleur={mouwKleur} dikte={dikte} />
          <Streng d={ARM_RECHTS} kleur={mouwKleur} dikte={dikte} />
        </>
      )}
      {mouwen === "kort" && (
        <>
          <Streng d={MOUW_KORT_LINKS} kleur={mouwKleur} dikte={dikte} />
          <Streng d={MOUW_KORT_RECHTS} kleur={mouwKleur} dikte={dikte} />
        </>
      )}
      <path d={romp} fill={kleur} {...OMLIJND} />
    </g>
  );
}

function Tailleband({ y, kleur }: { y: number; kleur: string }) {
  return <rect x={79} y={y} width={42} height={7} fill={kleur} {...OMLIJND} />;
}

/** Een ruitjespatroon van schuine lijnen. */
function Ruitjes({ kleur }: { kleur: string }) {
  const lijnen = [];
  for (let i = -200; i < 300; i += 16) {
    lijnen.push(`M${i} 60 L${i + 300} 360`, `M${i + 300} 60 L${i} 360`);
  }
  return <path d={lijnen.join(" ")} stroke={kleur} strokeWidth={1.5} fill="none" />;
}

function Hengsels({ d }: { d: string }) {
  return <path d={d} fill="none" {...OMLIJND} />;
}

// ---- De items ---------------------------------------------------------------

export const ITEMS: Item[] = [
  // Startkleren
  {
    id: "shirt-start",
    naam: "wit topje",
    categorie: "truitjes",
    start: true,
    kader: "56 88 88 132",
    teken: () => <Truitje romp={TANK} kleur="#ffffff" mouwen="geen" />,
  },
  {
    id: "short-start",
    naam: "jeansshort",
    categorie: "onder",
    start: true,
    kader: "66 150 68 64",
    teken: () => (
      <g>
        <path d={SHORT} fill={JEANS} {...OMLIJND} />
        <Tailleband y={156} kleur="#7aa0d6" />
        <path d="M78 200 L98 200 M102 200 L122 200" stroke="#ffffff" strokeWidth={2} strokeDasharray="2 2" />
      </g>
    ),
  },
  {
    id: "sneaker-start",
    naam: "witte sneakers",
    categorie: "schoenen",
    start: true,
    kader: "58 330 84 44",
    teken: () => (
      <Paar>
        <path d={SNEAKER} fill="#ffffff" {...OMLIJND} />
        <rect x={66} y={364} width={35} height={7} rx={3.5} fill="#e6e0ea" {...OMLIJND} />
      </Paar>
    ),
  },

  // Truitjes
  {
    id: "cardigan",
    naam: "roze cardigan",
    categorie: "truitjes",
    kader: "56 88 88 132",
    teken: () => (
      <g>
        <Truitje romp={TANK} kleur="#ffffff" mouwen="lang" mouwKleur={ROZE} />
        <g fill={ROZE} {...OMLIJND}>
          <path d="M70 98 L92 104 L94 150 L72 152 Z" />
          <path d="M130 98 L108 104 L106 150 L128 152 Z" />
        </g>
        <circle cx={90} cy={120} r={1.8} fill="#ffffff" />
        <circle cx={90} cy={134} r={1.8} fill="#ffffff" />
        <path d={hartPad(81, 124, 4)} fill={DONKER_ROZE} />
      </g>
    ),
  },
  {
    id: "hartjes-shirt",
    naam: "hartjes croptop",
    categorie: "truitjes",
    kader: "56 88 88 132",
    teken: () => (
      <g>
        <Truitje romp={CROP} kleur={ROZE} mouwen="kort" />
        <path d={hartPad(100, 122, 9)} fill="#ffffff" {...OMLIJND} strokeWidth={1.5} />
      </g>
    ),
  },
  {
    id: "jeansjasje",
    naam: "jeansjasje",
    categorie: "truitjes",
    kader: "56 88 88 132",
    teken: () => (
      <g>
        <Truitje romp={CROP} kleur="#ffffff" mouwen="lang" mouwKleur="#7da3d6" />
        <g fill="#7da3d6" {...OMLIJND}>
          <path d="M70 98 L94 104 L92 178 L66 174 Z" />
          <path d="M130 98 L106 104 L108 178 L134 174 Z" />
          <path d="M86 98 L100 110 L114 98 L108 94 L100 102 L92 94 Z" fill="#6f95c9" />
        </g>
        <path d="M76 136 L90 136 M110 136 L124 136" stroke={LIJN} strokeWidth={1.5} />
        <circle cx={90} cy={152} r={1.5} fill={OKER} />
      </g>
    ),
  },
  {
    id: "spencer",
    naam: "ruitjesspencer",
    categorie: "truitjes",
    kader: "56 88 88 132",
    teken: ({ uid }) => (
      <g>
        <Truitje romp={SHIRT} kleur={LILA} mouwen="lang" />
        <Geknipt id={`${uid}-vest`} d="M79 104 L90 104 L100 126 L110 104 L121 104 L120 166 L80 166 Z" fill={BES}>
          <Ruitjes kleur="#f4d9a8" />
        </Geknipt>
      </g>
    ),
  },
  {
    id: "hoodie",
    naam: "lila hoodie",
    categorie: "truitjes",
    kader: "52 88 96 132",
    teken: () => (
      <g>
        <Streng d={ARM_LINKS} kleur="#a386f5" dikte={13} />
        <Streng d={ARM_RECHTS} kleur="#a386f5" dikte={13} />
        <path d={HOODIE} fill="#b69cff" {...OMLIJND} />
        <path d="M80 150 L120 150 L124 178 L76 178 Z" fill="#a386f5" {...OMLIJND} />
        <path d="M84 98 Q100 110 116 98" fill="#9275e8" {...OMLIJND} />
        <path d="M95 104 L94 126 M105 104 L106 126" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />
      </g>
    ),
  },

  {
    id: "streepjestrui",
    naam: "streepjestrui",
    categorie: "truitjes",
    kader: "56 88 88 132",
    teken: ({ uid }) => (
      <g>
        <Streng d={ARM_LINKS} kleur="#fff7ee" dikte={11} />
        <Streng d={ARM_RECHTS} kleur="#fff7ee" dikte={11} />
        <Geknipt id={`${uid}-strepen`} d={SHIRT} fill="#fff7ee">
          {[108, 122, 136, 150, 164].map((y) => (
            <rect key={y} x={60} y={y} width={80} height={6} fill={DONKER_ROZE} />
          ))}
        </Geknipt>
      </g>
    ),
  },
  {
    id: "pailletten-topje",
    naam: "paillettentopje",
    categorie: "truitjes",
    kader: "56 88 88 132",
    teken: () => (
      <g>
        <Truitje romp={TANK} kleur="#d6d0f5" mouwen="geen" />
        {[
          [90, 118], [106, 124], [96, 138], [112, 146], [88, 154], [104, 158],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={vonkPad(x, y, 3.5)} fill="#ffffff" />
        ))}
        {[
          [100, 112], [86, 132], [114, 134], [98, 150],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill={LILA} />
        ))}
      </g>
    ),
  },

  // Rokjes en broeken
  {
    id: "cargobroek",
    naam: "cargobroek",
    categorie: "onder",
    kader: "60 150 80 206",
    teken: () => (
      <g>
        <path d={BROEK} fill="#a9c29f" {...OMLIJND} />
        <g fill="#94b08a" {...OMLIJND}>
          <rect x={72} y={236} width={16} height={22} rx={3} />
          <rect x={112} y={236} width={16} height={22} rx={3} />
        </g>
        <Tailleband y={158} kleur="#8fa885" />
      </g>
    ),
  },
  {
    id: "minirokje",
    naam: "mauve plooirokje",
    categorie: "onder",
    kader: "56 150 88 60",
    teken: () => (
      <g>
        <path d={MINI} fill={MAUVE} {...OMLIJND} />
        <path d="M88 160 L80 202 M100 160 L100 202 M112 160 L120 202" fill="none" {...OMLIJND} strokeWidth={1.5} />
      </g>
    ),
  },
  {
    id: "wijde-jeans",
    naam: "wijde jeans",
    categorie: "onder",
    kader: "58 150 84 206",
    teken: () => (
      <g>
        <path d={WIJD} fill={JEANS} {...OMLIJND} />
        <path d="M86 170 Q84 260 80 346 M114 170 Q116 260 120 346" fill="none" stroke="#6d93c6" strokeWidth={1.5} />
        <Tailleband y={154} kleur="#7aa0d6" />
      </g>
    ),
  },
  {
    id: "tulerok",
    naam: "tulen rok",
    categorie: "onder",
    kader: "52 150 96 126",
    teken: () => (
      <g>
        <path d={TULE} fill="#f9c6dc" {...OMLIJND} />
        {[
          [80, 190], [104, 204], [120, 184], [72, 232], [96, 244], [124, 236], [110, 258],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={vonkPad(x, y, 3.5)} fill="#ffffff" />
        ))}
        <Tailleband y={156} kleur={DONKER_ROZE} />
      </g>
    ),
  },
  {
    id: "tennisrokje",
    naam: "tennisrokje",
    categorie: "onder",
    kader: "60 150 80 56",
    teken: () => (
      <g>
        <path d={TENNIS} fill="#ffffff" {...OMLIJND} />
        <path d="M88 160 L82 198 M100 160 L100 198 M112 160 L118 198" fill="none" stroke="#d9d3e3" strokeWidth={1.5} />
        <path d="M71 190 L129 190" stroke={ROZE} strokeWidth={3} />
      </g>
    ),
  },

  {
    id: "jeansrokje",
    naam: "jeansrokje",
    categorie: "onder",
    kader: "56 150 88 60",
    teken: () => (
      <g>
        <path d={MINI} fill={JEANS} {...OMLIJND} />
        <Tailleband y={156} kleur="#7aa0d6" />
        <path d="M100 163 L100 202" stroke="#6d93c6" strokeWidth={1.5} />
        <circle cx={100} cy={170} r={1.8} fill={OKER} />
        <path d="M68 196 L132 196" stroke="#ffffff" strokeWidth={2} strokeDasharray="2 2" />
      </g>
    ),
  },
  {
    id: "flared-broek",
    naam: "lila flared broek",
    categorie: "onder",
    kader: "60 150 80 206",
    teken: () => (
      <g>
        <path d="M79 160 L121 160 L118 282 L132 348 L104 348 L100 214 L96 348 L68 348 L82 282 Z" fill={LILA} {...OMLIJND} />
        <Tailleband y={158} kleur="#a39cc9" />
      </g>
    ),
  },

  // Kleedjes
  {
    id: "slipdress",
    naam: "satijnen kleedje",
    categorie: "kleedjes",
    kader: "52 90 96 176",
    teken: () => (
      <g>
        <path d="M84 104 L82 96 M116 104 L118 96" stroke={LIJN} strokeWidth={2} />
        <path d="M82 104 Q100 112 118 104 L120 160 L136 254 Q100 264 64 254 L80 160 Z" fill={LILA} {...OMLIJND} />
        <path d="M112 118 Q114 180 124 244" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" opacity={0.6} fill="none" />
      </g>
    ),
  },
  {
    id: "ruitjeskleed",
    naam: "ruitjeskleed",
    categorie: "kleedjes",
    kader: "52 90 96 152",
    teken: ({ uid }) => (
      <g>
        <Truitje romp={SHIRT} kleur="#ffffff" mouwen="kort" />
        <Geknipt
          id={`${uid}-ruit`}
          d="M84 104 L92 104 L94 126 L106 126 L108 104 L116 104 L119 160 L134 228 Q100 236 66 228 L81 160 Z"
          fill={BES}
        >
          <Ruitjes kleur="#f4d9a8" />
        </Geknipt>
      </g>
    ),
  },
  {
    id: "glitterjurk",
    naam: "glitterjurk",
    categorie: "kleedjes",
    kader: "52 90 96 160",
    teken: () => (
      <g>
        <Streng d={MOUW_KORT_LINKS} kleur="#f7d774" dikte={15} />
        <Streng d={MOUW_KORT_RECHTS} kleur="#f7d774" dikte={15} />
        <path d="M78 102 Q100 96 122 102 L120 160 L140 238 Q100 248 60 238 L80 160 Z" fill={OKER} {...OMLIJND} />
        {[
          [90, 122], [110, 134], [96, 150], [84, 186], [112, 176], [100, 206], [74, 222], [126, 220],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={vonkPad(x, y, 4)} fill="#fff6d6" />
        ))}
      </g>
    ),
  },
  {
    id: "zomerjurk",
    naam: "bloemenjurk",
    categorie: "kleedjes",
    kader: "52 90 96 184",
    teken: () => (
      <g>
        <path d="M85 104 L82 96 M115 104 L118 96" stroke={LIJN} strokeWidth={2} />
        <path d="M81 104 Q100 110 119 104 L120 158 L142 266 Q100 276 58 266 L80 158 Z" fill="#fff3d9" {...OMLIJND} />
        <path d="M80 158 Q100 164 120 158" fill="none" stroke={MAUVE} strokeWidth={3} />
        {[
          [90, 126, ROZE], [110, 140, LILA], [78, 200, ROZE], [104, 214, MAUVE], [126, 196, ROZE], [92, 248, LILA], [120, 246, ROZE],
        ].map(([x, y, k]) => (
          <Bloem key={`${x}-${y}`} cx={x as number} cy={y as number} r={4} kleur={k as string} />
        ))}
      </g>
    ),
  },

  {
    id: "balletkleed",
    naam: "balletkleedje",
    categorie: "kleedjes",
    kader: "46 90 108 136",
    teken: () => (
      <g>
        <path d="M85 104 L82 96 M115 104 L118 96" stroke={LIJN} strokeWidth={2} />
        <path d="M80 156 L120 156 L152 214 Q100 226 48 214 Z" fill="#fbd8e8" {...OMLIJND} />
        <path d="M80 156 L120 156 L142 204 Q100 214 58 204 Z" fill="#f9c6dc" {...OMLIJND} />
        <path d="M81 104 Q100 110 119 104 L120 160 L80 160 Z" fill={ROZE} {...OMLIJND} />
        {[
          [70, 200], [90, 210], [112, 208], [132, 200], [100, 188],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={vonkPad(x, y, 3.5)} fill="#ffffff" />
        ))}
        <path d={hartPad(100, 128, 5)} fill={DONKER_ROZE} />
      </g>
    ),
  },
  {
    id: "tuinjurk",
    naam: "jeans tuinjurk",
    categorie: "kleedjes",
    kader: "52 90 96 160",
    teken: () => (
      <g>
        <Truitje romp={SHIRT} kleur="#ffffff" mouwen="kort" />
        <path d="M86 110 L84 100 M114 110 L116 100" stroke="#6d93c6" strokeWidth={4} strokeLinecap="round" />
        <path d="M84 110 L116 110 L119 160 L132 238 Q100 246 68 238 L81 160 Z" fill={JEANS} {...OMLIJND} />
        <rect x={92} y={120} width={16} height={13} rx={2} fill="#7aa0d6" {...OMLIJND} strokeWidth={1.5} />
        <circle cx={87} cy={114} r={2} fill={OKER} />
        <circle cx={113} cy={114} r={2} fill={OKER} />
        <path d={hartPad(100, 126, 3)} fill={ROZE} />
      </g>
    ),
  },

  // Schoenen
  {
    id: "chunky-sneakers",
    naam: "chunky sneakers",
    categorie: "schoenen",
    kader: "58 330 84 48",
    teken: () => (
      <Paar>
        <path d={SNEAKER} fill="#ffffff" {...OMLIJND} />
        <rect x={65} y={362} width={36} height={11} rx={5} fill={ROZE} {...OMLIJND} />
        <path d="M74 356 Q84 350 94 356" stroke={DONKER_ROZE} strokeWidth={3} fill="none" strokeLinecap="round" />
      </Paar>
    ),
  },
  {
    id: "hoge-sneakers",
    naam: "hoge sneakers",
    categorie: "schoenen",
    kader: "58 322 84 52",
    teken: () => (
      <Paar>
        <path d={HOOG} fill={DONKER_ROZE} {...OMLIJND} />
        <path d="M80 338 L94 338 M80 344 L94 344 M80 350 L94 350" stroke="#ffffff" strokeWidth={1.5} />
        <rect x={63} y={358} width={37} height={11} rx={4} fill="#ffffff" {...OMLIJND} />
      </Paar>
    ),
  },
  {
    id: "boots",
    naam: "stoere boots",
    categorie: "schoenen",
    kader: "58 308 84 66",
    teken: () => (
      <Paar>
        <path d={BOOT} fill="#3b2533" {...OMLIJND} />
        <rect x={61} y={358} width={38} height={12} rx={3} fill="#5a3a4c" {...OMLIJND} />
        <path d="M80 326 L94 326 M80 334 L94 334" stroke="#8a6a7c" strokeWidth={1.5} />
      </Paar>
    ),
  },
  {
    id: "mary-janes",
    naam: "lakschoentjes",
    categorie: "schoenen",
    kader: "58 326 84 46",
    teken: () => (
      <Paar>
        <rect x={84} y={332} width={14} height={20} rx={3} fill="#ffffff" {...OMLIJND} />
        <path d="M84 332 Q88 328 91 332 Q94 328 98 332" fill="#ffffff" {...OMLIJND} />
        <path d="M84 350 L98 350 L99 360 Q99 366 92 366 L74 366 Q68 366 70 360 Q74 352 84 350 Z" fill={BES} {...OMLIJND} />
        <path d="M82 354 L98 352" stroke={LIJN} strokeWidth={2.5} />
        <path d="M78 358 L86 358" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
      </Paar>
    ),
  },
  {
    id: "sandalen",
    naam: "sandaaltjes",
    categorie: "schoenen",
    kader: "58 330 84 44",
    teken: ({ huid }) => (
      <Paar>
        <path d={VOET} fill={huid} {...OMLIJND} />
        <rect x={67} y={364} width={33} height={5} rx={2.5} fill={OKER} {...OMLIJND} />
        <path d="M72 358 L98 352 M84 348 L98 346" stroke={DONKER_ROZE} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={84} cy={355} r={2.5} fill={ROZE} {...OMLIJND} strokeWidth={1} />
      </Paar>
    ),
  },

  {
    id: "glitterlaarsjes",
    naam: "glitterlaarsjes",
    categorie: "schoenen",
    kader: "58 308 84 66",
    teken: () => (
      <Paar>
        <path d={BOOT} fill={ROZE} {...OMLIJND} />
        <rect x={61} y={358} width={38} height={12} rx={3} fill="#ffffff" {...OMLIJND} />
        <path d={vonkPad(88, 330, 3.5)} fill="#ffffff" />
        <path d={vonkPad(80, 346, 2.5)} fill="#ffffff" />
      </Paar>
    ),
  },

  // Hoeden en haar (hoofd: ellips rond 100,54, bovenkant op y 29)
  {
    id: "baret",
    naam: "baret",
    categorie: "hoofd",
    kader: "66 6 72 44",
    teken: () => (
      <g {...OMLIJND}>
        <path d="M74 40 Q74 16 104 14 Q134 14 130 36 Q112 46 74 40 Z" fill={BES} />
        <path d="M104 14 L106 8" fill="none" strokeWidth={3} />
        <path d="M80 34 Q104 40 124 32" fill="none" stroke="#c9577f" strokeWidth={1.5} />
      </g>
    ),
  },
  {
    id: "bucket-hat",
    naam: "vissershoedje",
    categorie: "hoofd",
    kader: "60 8 80 48",
    teken: () => (
      <g {...OMLIJND}>
        <path d="M80 40 Q80 14 100 14 Q120 14 120 40 Z" fill={LILA} />
        <path d="M68 44 Q100 30 132 44 L138 52 Q100 40 62 52 Z" fill="#a39cc9" />
        <path d="M82 30 Q100 26 118 30" fill="none" stroke="#8e86b8" strokeWidth={1.5} />
        <path d={hartPad(112, 32, 4)} fill={ROZE} strokeWidth={1} />
      </g>
    ),
  },
  {
    id: "strik",
    naam: "satijnen strik",
    categorie: "hoofd",
    kader: "92 10 52 40",
    teken: () => (
      <g {...OMLIJND} transform="rotate(12 118 28)">
        <path d="M118 28 L98 16 Q94 28 98 40 Z" fill={ROZE} />
        <path d="M118 28 L138 16 Q142 28 138 40 Z" fill={ROZE} />
        <path d="M116 30 L110 46 M120 30 L126 46" fill="none" stroke={ROZE} strokeWidth={4} />
        <circle cx={118} cy={28} r={4.5} fill={DONKER_ROZE} />
      </g>
    ),
  },
  {
    id: "koptelefoon",
    naam: "koptelefoon",
    categorie: "hoofd",
    kader: "64 10 72 60",
    teken: () => (
      <g>
        <Streng d="M77 54 Q76 18 100 17 Q124 18 123 54" kleur={DONKER_ROZE} dikte={5} />
        <g fill={ROZE} {...OMLIJND}>
          <rect x={70} y={46} width={12} height={20} rx={5} />
          <rect x={118} y={46} width={12} height={20} rx={5} />
        </g>
        <path d={hartPad(76, 56, 3)} fill="#ffffff" />
        <path d={hartPad(124, 56, 3)} fill="#ffffff" />
      </g>
    ),
  },
  {
    id: "pet",
    naam: "pet",
    categorie: "hoofd",
    kader: "66 8 68 44",
    teken: () => (
      <g {...OMLIJND}>
        <path d="M79 38 Q80 14 100 14 Q120 14 121 38 Z" fill="#fff3d9" />
        <path d="M76 38 Q100 46 124 38 Q126 46 100 48 Q74 46 76 38 Z" fill={DONKER_ROZE} />
        <circle cx={100} cy={14} r={2.5} fill={DONKER_ROZE} />
        <path d={hartPad(100, 28, 5)} fill={DONKER_ROZE} strokeWidth={1} />
      </g>
    ),
  },
  {
    id: "tiara",
    naam: "tiara",
    categorie: "hoofd",
    kader: "72 8 56 34",
    teken: () => (
      <g {...OMLIJND}>
        <path d="M80 36 Q100 26 120 36 L116 24 L108 30 L100 14 L92 30 L84 24 Z" fill="#f7d774" />
        <circle cx={100} cy={26} r={3} fill={DONKER_ROZE} strokeWidth={1} />
        <circle cx={88} cy={30} r={2} fill={LILA} strokeWidth={1} />
        <circle cx={112} cy={30} r={2} fill={LILA} strokeWidth={1} />
      </g>
    ),
  },

  {
    id: "parelhaarband",
    naam: "parelhaarband",
    categorie: "hoofd",
    kader: "70 16 60 34",
    teken: () => (
      <g>
        <Streng d="M78 46 Q100 18 122 46" kleur="#ffffff" dikte={3} />
        {[0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92].map((t) => (
          <circle
            key={t}
            cx={(1 - t) ** 2 * 78 + 2 * (1 - t) * t * 100 + t ** 2 * 122}
            cy={(1 - t) ** 2 * 46 + 2 * (1 - t) * t * 18 + t ** 2 * 46}
            r={3}
            fill="#fdf6ee"
            {...OMLIJND}
            strokeWidth={1.2}
          />
        ))}
      </g>
    ),
  },
  {
    id: "zonnehoed",
    naam: "zonnehoed",
    categorie: "hoofd",
    kader: "48 6 104 50",
    teken: () => (
      <g {...OMLIJND}>
        <ellipse cx={100} cy={42} rx={48} ry={10} fill="#f2d492" />
        <path d="M80 44 Q80 14 100 14 Q120 14 120 44 Z" fill="#f7e0a8" />
        <path d="M80 34 Q100 38 120 34 L120 41 Q100 45 80 41 Z" fill={ROZE} />
        <Bloem cx={116} cy={38} r={3.5} kleur="#ffffff" />
      </g>
    ),
  },

  // Brillen (ogen op 91,58 en 109,58)
  {
    id: "zonnebril",
    naam: "zonnebril",
    categorie: "brillen",
    kader: "76 44 48 26",
    teken: () => (
      <g>
        <g fill="#3b2533" {...OMLIJND}>
          <path d="M82 52 L98 54 Q98 64 90 64 Q82 64 82 56 Z" />
          <path d="M118 52 L102 54 Q102 64 110 64 Q118 64 118 56 Z" />
        </g>
        <path d="M98 55 L102 55" stroke={LIJN} strokeWidth={2} />
        <path d="M85 56 L89 56 M105 56 L109 56" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" opacity={0.7} />
      </g>
    ),
  },
  {
    id: "hartjesbril",
    naam: "hartjesbril",
    categorie: "brillen",
    kader: "76 44 48 26",
    teken: () => (
      <g>
        <path d="M98 56 L102 56" stroke={LIJN} strokeWidth={2} />
        <path d={hartPad(90, 58, 8)} fill="#f47baecc" {...OMLIJND} />
        <path d={hartPad(110, 58, 8)} fill="#f47baecc" {...OMLIJND} />
      </g>
    ),
  },
  {
    id: "ronde-bril",
    naam: "gouden brilletje",
    categorie: "brillen",
    kader: "76 44 48 26",
    teken: () => (
      <g stroke="#c9922e" strokeWidth={1.8} fill="#ffffff33">
        <circle cx={91} cy={58} r={7} />
        <circle cx={109} cy={58} r={7} />
        <path d="M98 57 Q100 55 102 57" fill="none" />
      </g>
    ),
  },
  {
    id: "sterrenbril",
    naam: "sterrenbril",
    categorie: "brillen",
    kader: "76 42 48 30",
    teken: () => (
      <g>
        <path d="M99 57 L101 57" stroke={LIJN} strokeWidth={2} />
        <path d={sterPad(90, 58, 10)} fill="#f7d774cc" {...OMLIJND} />
        <path d={sterPad(110, 58, 10)} fill="#f7d774cc" {...OMLIJND} />
      </g>
    ),
  },
  {
    id: "retrobril",
    naam: "retrobril",
    categorie: "brillen",
    kader: "76 44 48 26",
    teken: () => (
      <g fill="#c86a9a88" {...OMLIJND}>
        <rect x={81} y={51} width={17} height={13} rx={4} />
        <rect x={102} y={51} width={17} height={13} rx={4} />
        <path d="M98 56 L102 56" fill="none" />
      </g>
    ),
  },

  {
    id: "grote-zonnebril",
    naam: "grote zonnebril",
    categorie: "brillen",
    kader: "76 44 48 28",
    teken: () => (
      <g>
        <path d="M99 56 L101 56" stroke={OKER} strokeWidth={2} />
        <g fill="#f47bae88" stroke={OKER} strokeWidth={2}>
          <circle cx={90} cy={58} r={9} />
          <circle cx={110} cy={58} r={9} />
        </g>
        <path d="M85 54 L88 52 M105 54 L108 52" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
      </g>
    ),
  },

  // Shopping (rechterhand op 134,212)
  {
    id: "shoppingtas",
    naam: "shoppingtas",
    categorie: "tassen",
    kader: "114 200 60 84",
    teken: () => (
      <g>
        <Hengsels d="M128 222 Q128 204 134 208 Q144 202 154 222" />
        <path d="M122 222 L164 222 L168 280 L118 280 Z" fill={BES} {...OMLIJND} />
        <path d={hartPad(143, 250, 10)} fill={ROZE} {...OMLIJND} strokeWidth={1.5} />
        <path d="M162 228 L176 222 L178 236 L166 240 Z" fill={OKER} {...OMLIJND} strokeWidth={1.5} />
      </g>
    ),
  },
  {
    id: "twee-tassen",
    naam: "shoppingtassen",
    categorie: "tassen",
    kader: "118 198 64 78",
    teken: () => (
      <g>
        <Hengsels d="M150 224 Q148 206 136 208" />
        <path d="M146 224 L176 228 L172 270 L142 268 Z" fill={OKER} {...OMLIJND} />
        <Hengsels d="M130 224 Q130 204 136 208 Q146 206 152 222" />
        <path d="M124 224 L158 220 L164 268 L128 272 Z" fill={ROZE} {...OMLIJND} />
        <path d={sterPad(144, 246, 7)} fill="#ffffff" {...OMLIJND} strokeWidth={1.2} />
      </g>
    ),
  },
  {
    id: "bubble-tea",
    naam: "bubble tea",
    categorie: "tassen",
    kader: "120 158 34 70",
    teken: () => (
      <g>
        <path d="M138 184 L142 164" stroke={DONKER_ROZE} strokeWidth={4} strokeLinecap="round" />
        <path d="M127 190 L143 190 L140 224 L130 224 Z" fill="#f2dcc0" {...OMLIJND} />
        <path d="M126 190 Q135 178 144 190 Z" fill="#ffffff" {...OMLIJND} />
        {[
          [132, 218], [137, 220], [134, 214], [139, 215],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.8} fill="#5a3825" />
        ))}
      </g>
    ),
  },
  {
    id: "smartphone",
    naam: "smartphone",
    categorie: "tassen",
    kader: "122 184 30 44",
    teken: () => (
      <g>
        <rect x={127} y={188} width={15} height={27} rx={3} fill={DONKER_ROZE} {...OMLIJND} />
        <circle cx={131} cy={193} r={1.8} fill="#3b2533" />
        <circle cx={131} cy={198} r={1.8} fill="#3b2533" />
        <path d={hartPad(137, 204, 3)} fill="#ffffff" />
        <path d="M142 212 Q148 216 146 222" stroke={OKER} strokeWidth={1.5} fill="none" />
        <path d={sterPad(146, 224, 3)} fill="#f7d774" />
      </g>
    ),
  },
  {
    id: "schoudertasje",
    naam: "schoudertasje",
    categorie: "tassen",
    kader: "74 92 70 86",
    teken: () => (
      <g>
        <path d="M82 100 Q104 130 122 156" fill="none" stroke={OKER} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M110 152 L136 152 L138 174 L108 174 Z" fill={ROZE} {...OMLIJND} />
        <path d="M110 152 L136 152 L134 162 Q123 166 112 162 Z" fill={DONKER_ROZE} {...OMLIJND} />
        <circle cx={123} cy={162} r={2.2} fill={OKER} />
      </g>
    ),
  },
  {
    id: "hondje-in-tas",
    naam: "hondje in de tas",
    categorie: "tassen",
    kader: "112 190 58 78",
    teken: () => (
      <g>
        <Hengsels d="M126 222 Q126 204 133 206 Q144 202 154 222" />
        <g {...OMLIJND}>
          <ellipse cx={142} cy={206} rx={4} ry={8} fill="#8a5a3c" transform="rotate(25 142 206)" />
          <ellipse cx={160} cy={206} rx={4} ry={8} fill="#8a5a3c" transform="rotate(-25 160 206)" />
          <ellipse cx={151} cy={214} rx={10} ry={9} fill="#f2dcc0" />
        </g>
        <circle cx={147} cy={212} r={1.5} fill={LIJN} />
        <circle cx={155} cy={212} r={1.5} fill={LIJN} />
        <ellipse cx={151} cy={217} rx={2} ry={1.5} fill={LIJN} />
        <path d="M120 222 L162 222 L166 264 L116 264 Z" fill={LILA} {...OMLIJND} />
        <path d={hartPad(141, 242, 7)} fill={ROZE} {...OMLIJND} strokeWidth={1.2} />
      </g>
    ),
  },
  {
    id: "ijsje",
    naam: "ijsje",
    categorie: "tassen",
    kader: "120 180 30 58",
    teken: () => (
      <g>
        <g {...OMLIJND}>
          <circle cx={130} cy={200} r={6} fill={ROZE} />
          <circle cx={140} cy={200} r={6} fill="#8ce0c0" />
          <circle cx={135} cy={192} r={6} fill="#fff3d9" />
          <path d="M127 204 L143 204 L135 234 Z" fill="#e6a85c" />
        </g>
        <path d="M131 212 L139 212 M133 220 L137 220" stroke="#b8793a" strokeWidth={1.5} />
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
