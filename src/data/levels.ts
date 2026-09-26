// De leesinhoud, in de volgorde van Veilig leren lezen (kim-versie).
//
// Elk level brengt één nieuwe klank (of bij de start een handvol). Een reeks
// telt altijd tien oefeningen en loopt op in moeilijkheid: eerst losse
// woordjes, dan een paar woorden samen, dan korte zinnetjes.
//
// Regels die de test in levels.test.ts bewaakt:
// - enkel kleine letters, als leesteken hoogstens . of ? op het einde;
// - elk woord gebruikt alleen klanken die op dat moment al gekend zijn;
// - elk woord heeft één klinker en nooit twee medeklinkers naast elkaar
//   (dus geen "kast" of "skip": clusters komen pas in kern 7).

export type Reeks = {
  id: string;
  oefeningen: string[];
};

export type Level = {
  id: string;
  kern: string;
  /** De klanken die in dit level nieuw zijn. */
  nieuw: string[];
  reeksen: Reeks[];
};

export const LEVELS: Level[] = [
  {
    id: "ikms",
    kern: "start",
    nieuw: ["i", "k", "m", "s"],
    reeksen: [
      {
        id: "ikms-1",
        oefeningen: [
          "ik", "is", "kim", "sim", "mis", "mik",
          "ik mik", "ik mis", "ik mis kim.", "ik mis sim.",
        ],
      },
      {
        id: "ikms-2",
        oefeningen: [
          "sim", "kim", "mik", "sik", "mis", "ik",
          "mis ik", "ik mik.", "ik mis sim.", "mis ik kim?",
        ],
      },
    ],
  },
  {
    id: "p",
    kern: "kern 1",
    nieuw: ["p"],
    reeksen: [
      {
        id: "p-1",
        oefeningen: [
          "kip", "pim", "sip", "kim", "sim",
          "ik mis kip.", "pim is sip.", "is kip sip?", "ik mis pim.", "sim is sip.",
        ],
      },
      {
        id: "p-2",
        oefeningen: [
          "sip", "kip", "pim", "mis", "mik",
          "ik mik.", "kip is sip.", "is pim sip?", "mis ik kip?", "kim is sip.",
        ],
      },
    ],
  },
  {
    id: "aa",
    kern: "kern 1",
    nieuw: ["aa"],
    reeksen: [
      {
        id: "aa-1",
        oefeningen: [
          "aap", "aas", "kaas", "maak", "maas",
          "ik maak", "aap is sip.", "ik mis kaas.", "is aap sip?", "ik maak kaas.",
        ],
      },
      {
        id: "aa-2",
        oefeningen: [
          "kaap", "kaak", "aap", "kaas", "pim",
          "maak kaas", "kim is aap.", "is kaas sip?", "ik mis aap.", "maak ik kaas?",
        ],
      },
      {
        id: "aa-3",
        oefeningen: [
          "maas", "aas", "kaas", "aap", "kaak",
          "ik maak", "sim is aap.", "is pim aap?", "ik mis kaas.", "maak ik kaas?",
        ],
      },
    ],
  },
  {
    id: "r",
    kern: "kern 1",
    nieuw: ["r"],
    reeksen: [
      {
        id: "r-1",
        oefeningen: [
          "raam", "raap", "rik", "maar", "saar",
          "ik raak", "rik is sip.", "saar is aap.", "is saar sip?", "ik mis rik.",
        ],
      },
      {
        id: "r-2",
        oefeningen: [
          "paar", "raak", "rik", "raam", "saar",
          "maak raam", "ik raak kim.", "is rik aap?", "ik maak raap.", "maar ik mis saar.",
        ],
      },
      {
        id: "r-3",
        oefeningen: [
          "maar", "raam", "raap", "paar", "rik",
          "raak maar", "maak maar", "saar is sip.", "maak maar kaas.",
          "rik is aap maar saar is kip.",
        ],
      },
    ],
  },
  {
    id: "e",
    kern: "kern 1",
    nieuw: ["e"],
    reeksen: [
      {
        id: "e-1",
        oefeningen: [
          "mes", "rek", "rem", "sem", "es",
          "ik rem", "rem maar", "sem is sip.", "ik mis mes.", "is sem aap?",
        ],
      },
      {
        id: "e-2",
        oefeningen: [
          "mep", "pek", "rek", "rem", "mes",
          "ik rek", "raak mes", "is sem sip?", "ik raak sem.", "rem maar sem.",
        ],
      },
      {
        id: "e-3",
        oefeningen: [
          "sem", "mes", "rem", "es", "rek",
          "rem maar", "ik maak rek.", "sem is aap.",
          "saar is sip. ik mis sem.", "sem is kip maar kim is aap.",
        ],
      },
    ],
  },
  {
    id: "v",
    kern: "kern 1",
    nieuw: ["v"],
    reeksen: [
      {
        id: "v-1",
        oefeningen: [
          "vis", "vaas", "vaak", "vaar", "ver",
          "ik vis", "vaar maar", "ik vaar.", "ik mis vis.", "is vis sip?",
        ],
      },
      {
        id: "v-2",
        oefeningen: [
          "vis", "ver", "vaas", "vaak", "raam",
          "raak vaas", "vis maar", "is saar ver?", "ik vis vaak.", "ik mis vaak kaas.",
        ],
      },
      {
        id: "v-3",
        oefeningen: [
          "vaar", "ver", "vis", "vaas", "mes",
          "ik vaar ver", "vaak vis ik.", "is vis kaas?", "vaar ik ver?",
          "sem is ver maar ik mis sem.",
        ],
      },
    ],
  },
  {
    id: "n",
    kern: "kern 2",
    nieuw: ["n"],
    reeksen: [
      {
        id: "n-1",
        oefeningen: [
          "in", "en", "pen", "ren", "maan",
          "ik ren", "ren maar", "kim en sim.", "ik mis pen.", "ren naar kim.",
        ],
      },
      {
        id: "n-2",
        oefeningen: [
          "naam", "nek", "kin", "maan", "naar",
          "vis en kaas", "aap en kip", "is maan ver?", "ik ren naar sem.",
          "ren maar naar rik.",
        ],
      },
      {
        id: "n-3",
        oefeningen: [
          "nep", "pin", "vin", "ren", "naam",
          "pen in vaas", "ren naar maan", "is naam kim?", "ik vis in maas.",
          "ik ren naar maan maar maan is ver.",
        ],
      },
    ],
  },
  {
    id: "t",
    kern: "kern 2",
    nieuw: ["t"],
    reeksen: [
      {
        id: "t-1",
        oefeningen: [
          "tik", "tim", "pet", "net", "met",
          "ik tik", "met pet", "tim met pet.", "is tim sip?", "ik ren met tim.",
        ],
      },
      {
        id: "t-2",
        oefeningen: [
          "tip", "pit", "vet", "rit", "maat",
          "tik maar", "vis in net", "kip is vet.", "ik tik met pen.",
          "tim is ver maar ik ren.",
        ],
      },
      {
        id: "t-3",
        oefeningen: [
          "taak", "maat", "tin", "net", "tim",
          "ik tik.", "pim en tim", "is pet vet?", "ik ren met tim naar maan.",
          "ik vis met net in maas.",
        ],
      },
    ],
  },
  {
    id: "ee",
    kern: "kern 2",
    nieuw: ["ee"],
    reeksen: [
      {
        id: "ee-1",
        oefeningen: [
          "nee", "mee", "eet", "peer", "veer",
          "ik eet", "ren mee", "ik eet peer.", "kim eet kaas.", "is peer vet?",
        ],
      },
      {
        id: "ee-2",
        oefeningen: [
          "meer", "veer", "teen", "reep", "neem",
          "neem mee", "eet maar", "tim eet reep.", "aap eet peer.", "ik neem veer mee.",
        ],
      },
      {
        id: "ee-3",
        oefeningen: [
          "keer", "ree", "keek", "meer", "reep",
          "eet mee", "ree is ver.", "ik keek naar maan.", "ik eet vis met mes.",
          "tim eet peer en ik eet reep.",
        ],
      },
    ],
  },
  {
    id: "b",
    kern: "kern 2",
    nieuw: ["b"],
    reeksen: [
      {
        id: "b-1",
        oefeningen: [
          "ben", "bes", "bek", "baas", "beer",
          "ik ben", "ik ben kim.", "beer is sip.", "ben ik baas?", "beer eet bes.",
        ],
      },
      {
        id: "b-2",
        oefeningen: [
          "baan", "beet", "bit", "been", "ben",
          "baas ben ik", "ik ben tim.", "is beer baas?", "beer eet vis.",
          "aap beet in peer.",
        ],
      },
      {
        id: "b-3",
        oefeningen: [
          "beer", "baas", "bes", "bek", "ben",
          "ik ben baas", "beer eet reep.", "is saar baas?", "bes in bek.",
          "ik ben aap maar tim is beer.",
        ],
      },
    ],
  },
  {
    id: "oo",
    kern: "kern 2",
    nieuw: ["oo"],
    reeksen: [
      {
        id: "oo-1",
        oefeningen: [
          "oor", "roos", "boot", "boom", "oom",
          "roos in vaas", "aap in boom", "ik ben boos.", "beer eet noot.",
          "oom tim is boos.",
        ],
      },
      {
        id: "oo-2",
        oefeningen: [
          "rook", "kook", "poot", "noot", "boos",
          "ik kook", "kook maar", "ik kook vis.", "aap eet noot.", "ik ren naar boot.",
        ],
      },
      {
        id: "oo-3",
        oefeningen: [
          "boom", "boot", "toon", "poot", "oom",
          "is boom ver?", "roos in vaas.", "ik mis oom toon.",
          "ik vaar met oom in boot.", "beer is boos maar aap is sip.",
        ],
      },
    ],
  },
];

export type ReeksPlek = {
  reeks: Reeks;
  level: Level;
  /** Positie over alle levels heen, vanaf 0. */
  index: number;
};

/** Alle reeksen achter elkaar, in speelvolgorde. */
export const ALLE_REEKSEN: ReeksPlek[] = LEVELS.flatMap((level) =>
  level.reeksen.map((reeks) => ({ reeks, level })),
).map((plek, index) => ({ ...plek, index }));

export function vindReeks(id: string): ReeksPlek | undefined {
  return ALLE_REEKSEN.find((p) => p.reeks.id === id);
}

/** Alle klanken die gekend zijn na het level met deze index. */
export function gekendeKlanken(levelIndex: number): Set<string> {
  return new Set(LEVELS.slice(0, levelIndex + 1).flatMap((l) => l.nieuw));
}
