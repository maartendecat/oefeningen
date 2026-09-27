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
});

describe("thema", () => {
  it("volgt uit de avatar", () => {
    expect(themaVan({ avatar: "noor" })).toBe("kleren");
    expect(themaVan({ avatar: null })).toBe("kleren");
    expect(themaVan({ avatar: "kea" })).toBe("vogels");
    // Een verzamelvogel is geen avatar.
    expect(themaVan({ avatar: "merel" })).toBe("kleren");
  });
});
