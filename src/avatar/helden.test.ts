import { describe, expect, it } from "vitest";
import { ONDERWERPEN, reeksenVan } from "@/data/onderwerpen";
import { BASISSEN } from "./Pop";
import { HELDEN, isHeld, letterVan } from "./Held";
import { HELD_CATEGORIEEN, HELD_ITEMS, HELD_START, HELD_UITTREKBAAR } from "./heldenitems";
import { VOGELS } from "./vogels";

describe("helden", () => {
  it("heeft vijf helden om als avatar te kiezen", () => {
    expect(HELDEN.map((h) => h.id)).toEqual(["bliksem", "vlam", "ijs", "wervel", "komeet"]);
    expect(isHeld("vlam")).toBe(true);
    expect(isHeld("noor")).toBe(false);
    expect(isHeld(null)).toBe(false);
  });

  it("deelt geen avatar-ids met de poppen of de vogels", () => {
    const andere = [...BASISSEN.map((b) => b.id), ...VOGELS.map((v) => v.id)];
    for (const h of HELDEN) expect(andere).not.toContain(h.id);
  });

  it("neemt de eerste letter van de naam voor het letterembleem", () => {
    expect(letterVan("mats")).toBe("m");
    expect(letterVan("  ")).toBe("h");
    expect(letterVan(null)).toBe("h");
  });
});

describe("heldenuitrusting", () => {
  it("heeft unieke ids", () => {
    const ids = HELD_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("heeft voor elke reeks van elk onderwerp minstens één beloning", () => {
    const teWinnen = HELD_ITEMS.filter((i) => !i.start).length;
    for (const o of ONDERWERPEN) expect(teWinnen, o.id).toBeGreaterThanOrEqual(reeksenVan(o).length);
  });

  it("geeft een pak, laarzen en handschoenen om mee te beginnen", () => {
    expect(Object.keys(HELD_START).sort()).toEqual(["handschoenen", "laarzen", "pakken"]);
    for (const cat of Object.keys(HELD_START)) expect(HELD_UITTREKBAAR).not.toContain(cat);
  });

  it("heeft in elke categorie iets te winnen", () => {
    for (const c of HELD_CATEGORIEEN) {
      expect(HELD_ITEMS.filter((i) => i.categorie === c.id && !i.start).length, c.id).toBeGreaterThanOrEqual(6);
    }
  });

  it("gebruikt enkel gekende categorieën", () => {
    const gekend = HELD_CATEGORIEEN.map((c) => c.id);
    for (const item of HELD_ITEMS) expect(gekend).toContain(item.categorie);
  });

  it("schrijft namen in kleine letters, zoals de rest van de app", () => {
    for (const item of HELD_ITEMS) expect(item.naam, item.id).toBe(item.naam.toLowerCase());
  });
});
