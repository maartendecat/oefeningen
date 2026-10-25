import { describe, expect, it } from "vitest";
import {
  AVATARS,
  MIGRATIES,
  VERSIE,
  isLeeg,
  lees,
  magNieuweAvatar,
  nieuwSpel,
  spullenVan,
  sterrenVan,
  themaVan,
  type Spel,
} from "./spel";

const geldig = {
  versie: 1,
  avatar: "noor",
  naam: "juul",
  klaar: ["ikms-1", "ikms-2"],
  kast: ["cardigan", "bestaat-niet-meer"],
  aan: { truitjes: "cardigan", tassen: "ballon" },
  stil: false,
  bijgewerkt: 1234,
};

/** Voortgang van versie 4: een verzameling per thema. */
const versie4 = {
  versie: 4,
  avatar: "noor",
  naam: "juul",
  leerjaar: 1,
  klaar: ["ikms-1"],
  kast: ["cardigan"],
  aan: { truitjes: "cardigan" },
  vogels: [],
  uitrusting: [],
  heldAan: { pakken: "heldenpak-start", laarzen: "laarzen-start", handschoenen: "handschoenen-start" },
  stil: false,
  bijgewerkt: 1,
};

describe("voortgang inlezen", () => {
  it("leest een nieuw spel terug", () => {
    expect(lees(nieuwSpel())).toEqual(nieuwSpel());
  });

  it("ruimt verdwenen kleren op en geeft startkleren", () => {
    const s = lees(geldig)!;
    expect(s.avatars.noor.gewonnen).toEqual(["cardigan"]);
    expect(s.avatars.noor.aan.truitjes).toBe("cardigan");
    expect(s.avatars.noor.aan.tassen).toBeUndefined();
    expect(s.avatars.noor.aan.onder).toBe("short-start");
    expect(s.bijgewerkt).toBe(1234);
  });

  it("aanvaardt oudere voortgang zonder naam of tijdstip", () => {
    const oud: Partial<typeof geldig> = { ...geldig };
    delete oud.naam;
    delete oud.bijgewerkt;
    const s = lees(oud)!;
    expect(s.naam).toBeNull();
    expect(s.bijgewerkt).toBe(0);
  });

  it.each([
    ["niets", null],
    ["tekst", "hallo"],
    ["lijst", []],
    ["zonder versie", { ...geldig, versie: undefined }],
    ["kapotte kast", { ...geldig, kast: "cardigan" }],
    ["rare reeks", { ...geldig, klaar: [1, 2] }],
    ["aan als lijst", { ...geldig, aan: [] }],
    ["kapotte vogels", { ...versie4, vogels: "kea" }],
    ["kapotte uitrusting", { ...versie4, uitrusting: "rode-cape" }],
    ["avatars als lijst", { ...nieuwSpel(), avatars: [] }],
    ["kapotte verzameling", { ...nieuwSpel(), avatars: { noor: { gewonnen: "cardigan", aan: {} } } }],
  ])("weigert %s", (_, data) => {
    expect(lees(data)).toBeNull();
  });

  it("weigert voortgang van een nieuwere versie van de app", () => {
    expect(lees({ ...geldig, versie: VERSIE + 1 })).toBeNull();
  });

  it("heeft een migratiestap voor elke oudere versie", () => {
    for (let v = 1; v < VERSIE; v++) expect(MIGRATIES[v], `migratie ${v} → ${v + 1}`).toBeTypeOf("function");
  });

  it("herkent een leeg spel", () => {
    expect(isLeeg(nieuwSpel())).toBe(true);
    expect(isLeeg(lees(geldig)!)).toBe(false);
  });

  it("zet voortgang van voor de leerjaren in het eerste leerjaar", () => {
    expect(lees(geldig)!.leerjaar).toBe(1);
    expect(lees({ ...geldig, versie: 2, vogels: [] })!.leerjaar).toBe(1);
  });

  it("laat een nieuw profiel zonder leerjaar, en weigert een raar leerjaar", () => {
    expect(nieuwSpel().leerjaar).toBeNull();
    expect(lees({ ...nieuwSpel(), leerjaar: 3 })!.leerjaar).toBe(3);
    expect(lees({ ...nieuwSpel(), leerjaar: 9 })).toBeNull();
    expect(lees({ ...nieuwSpel(), leerjaar: "3" })).toBeNull();
  });

  it("ruimt spullen op die niet meer bestaan of niet bij het thema passen", () => {
    const s = lees({
      ...nieuwSpel(),
      avatar: "kea",
      avatars: {
        kea: { gewonnen: ["merel", "dodo", "merel", "cardigan"], aan: { truitjes: "cardigan" } },
        komeet: {
          gewonnen: ["rode-cape", "jetpack"],
          aan: { capes: "rode-cape", pakken: "jetpack", maskers: "cardigan" },
        },
        "bestaat-niet": { gewonnen: [], aan: {} },
      },
    })!;
    expect(s.avatars.kea).toEqual({ gewonnen: ["merel"], aan: {} });
    expect(s.avatars.komeet).toEqual({
      gewonnen: ["rode-cape"],
      aan: { capes: "rode-cape", pakken: "heldenpak-start", laarzen: "laarzen-start", handschoenen: "handschoenen-start" },
    });
    expect(Object.keys(s.avatars).sort()).toEqual(["kea", "komeet"]);
  });

  it("geeft de actieve avatar altijd een verzameling", () => {
    const s = lees({ ...nieuwSpel(), avatar: "bliksem" })!;
    expect(s.avatars.bliksem.gewonnen).toEqual([]);
    expect(s.avatars.bliksem.aan.pakken).toBe("heldenpak-start");
  });
});

describe("migratie naar een verzameling per avatar", () => {
  it("geeft de spullen van het thema aan de huidige avatar", () => {
    const s = lees(versie4)!;
    expect(s.avatar).toBe("noor");
    expect(Object.keys(s.avatars)).toEqual(["noor"]);
    expect(s.avatars.noor.gewonnen).toEqual(["cardigan"]);
    expect(s.avatars.noor.aan.truitjes).toBe("cardigan");
  });

  it("geeft de spullen van een ander thema aan de eerste avatar van dat thema", () => {
    const s = lees({
      ...versie4,
      vogels: ["merel"],
      uitrusting: ["rode-cape"],
      heldAan: { ...versie4.heldAan, capes: "rode-cape" },
    })!;
    expect(Object.keys(s.avatars).sort()).toEqual([AVATARS.helden[0], AVATARS.vogels[0], "noor"].sort());
    expect(s.avatars[AVATARS.vogels[0]].gewonnen).toEqual(["merel"]);
    expect(s.avatars[AVATARS.helden[0]]).toEqual({
      gewonnen: ["rode-cape"],
      aan: { pakken: "heldenpak-start", laarzen: "laarzen-start", handschoenen: "handschoenen-start", capes: "rode-cape" },
    });
  });

  it("geeft een vogelavatar de vogels", () => {
    const s = lees({ ...versie4, avatar: "kea", kast: ["cardigan"], vogels: ["merel"] })!;
    expect(s.avatars.kea.gewonnen).toEqual(["merel"]);
    expect(s.avatars[AVATARS.kleren[0]].gewonnen).toEqual(["cardigan"]);
  });

  it("maakt geen avatars voor een profiel dat nog niets deed", () => {
    const s = lees({ ...versie4, avatar: null, kast: [] })!;
    expect(s.avatars).toEqual({});
  });
});

describe("thema", () => {
  it("volgt uit de avatar", () => {
    expect(themaVan({ avatar: "noor" })).toBe("kleren");
    expect(themaVan({ avatar: null })).toBe("kleren");
    expect(themaVan({ avatar: "kea" })).toBe("vogels");
    expect(themaVan({ avatar: "komeet" })).toBe("helden");
    // Een verzamelvogel is geen avatar.
    expect(themaVan({ avatar: "merel" })).toBe("kleren");
  });
});

describe("sterren", () => {
  const met = (avatar: string, aantal: number, extra: Spel["avatars"] = {}): Spel => ({
    ...nieuwSpel(),
    avatar,
    avatars: { ...extra, [avatar]: { gewonnen: spullenVan(themaVan({ avatar })).slice(0, aantal), aan: {} } },
  });

  it("geeft een ster per derde, en drie als alles gewonnen is", () => {
    const totaal = spullenVan("vogels").length;
    expect(sterrenVan(met("kea", 0))).toBe(0);
    expect(sterrenVan(met("kea", Math.ceil(totaal / 3) - 1))).toBe(0);
    expect(sterrenVan(met("kea", Math.ceil(totaal / 3)))).toBe(1);
    expect(sterrenVan(met("kea", Math.ceil((totaal * 2) / 3) - 1))).toBe(1);
    expect(sterrenVan(met("kea", Math.ceil((totaal * 2) / 3)))).toBe(2);
    expect(sterrenVan(met("kea", totaal - 1))).toBe(2);
    expect(sterrenVan(met("kea", totaal))).toBe(3);
  });

  it("laat een nieuwe avatar toe zodra alle begonnen avatars twee sterren hebben", () => {
    const tweeDerde = Math.ceil((spullenVan("kleren").length * 2) / 3);
    expect(magNieuweAvatar(nieuwSpel())).toBe(true);
    expect(magNieuweAvatar(met("noor", 1))).toBe(false);
    expect(magNieuweAvatar(met("noor", tweeDerde - 1))).toBe(false);
    expect(magNieuweAvatar(met("noor", tweeDerde))).toBe(true);
    // Een avatar zonder iets gewonnen telt niet mee.
    const vol = met("noor", tweeDerde).avatars;
    expect(magNieuweAvatar(met("lotte", 0, vol))).toBe(true);
    expect(magNieuweAvatar(met("lotte", 1, vol))).toBe(false);
  });
});
