import { describe, expect, it } from "vitest";
import { MIGRATIES, VERSIE, isLeeg, lees, nieuwSpel, themaVan } from "./spel";

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

describe("voortgang inlezen", () => {
  it("leest een nieuw spel terug", () => {
    expect(lees(nieuwSpel())).toEqual(nieuwSpel());
  });

  it("ruimt verdwenen kleren op en geeft startkleren", () => {
    const s = lees(geldig)!;
    expect(s.kast).toEqual(["cardigan"]);
    expect(s.aan.truitjes).toBe("cardigan");
    expect(s.aan.tassen).toBeUndefined();
    expect(s.aan.onder).toBe("short-start");
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

  it("geeft voortgang van voor de vogels een lege vogelverzameling", () => {
    expect(lees(geldig)!.vogels).toEqual([]);
  });

  it("ruimt vogels op die niet meer bestaan", () => {
    const s = lees({ ...geldig, versie: 2, vogels: ["kea", "dodo", "kea"] })!;
    expect(s.vogels).toEqual(["kea"]);
  });

  it("weigert een kapotte vogelverzameling", () => {
    expect(lees({ ...geldig, versie: 2, vogels: "kea" })).toBeNull();
  });

  it("geeft voortgang van voor de helden een lege uitrusting en de startuitrusting", () => {
    const s = lees({ ...geldig, versie: 3, vogels: [], leerjaar: 1 })!;
    expect(s.uitrusting).toEqual([]);
    expect(s.heldAan).toEqual({ pakken: "heldenpak-start", laarzen: "laarzen-start", handschoenen: "handschoenen-start" });
  });

  it("ruimt heldenspullen op die niet meer bestaan, en houdt de held aangekleed", () => {
    const s = lees({
      ...nieuwSpel(),
      uitrusting: ["rode-cape", "jetpack", "rode-cape"],
      heldAan: { capes: "rode-cape", pakken: "jetpack", maskers: "cardigan" },
    })!;
    expect(s.uitrusting).toEqual(["rode-cape"]);
    expect(s.heldAan).toEqual({
      capes: "rode-cape",
      pakken: "heldenpak-start",
      laarzen: "laarzen-start",
      handschoenen: "handschoenen-start",
    });
  });

  it("weigert een kapotte heldenuitrusting", () => {
    expect(lees({ ...nieuwSpel(), uitrusting: "rode-cape" })).toBeNull();
    expect(lees({ ...nieuwSpel(), heldAan: [] })).toBeNull();
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
