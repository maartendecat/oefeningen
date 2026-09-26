import { describe, expect, it } from "vitest";
import { ALLE_REEKSEN } from "@/data/levels";
import { CATEGORIEEN, ITEMS, STARTKLEREN } from "./items";

describe("kleerkast", () => {
  it("heeft unieke item-ids", () => {
    const ids = ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("heeft voor elke reeks minstens één cadeau", () => {
    const te_winnen = ITEMS.filter((i) => !i.start).length;
    expect(te_winnen).toBeGreaterThanOrEqual(ALLE_REEKSEN.length);
  });

  it("heeft startkleren voor truitje, onderstuk en schoenen", () => {
    expect(Object.keys(STARTKLEREN).sort()).toEqual(["onder", "schoenen", "truitjes"]);
  });

  it("gebruikt enkel gekende categorieën", () => {
    const gekend = CATEGORIEEN.map((c) => c.id);
    for (const item of ITEMS) expect(gekend).toContain(item.categorie);
  });
});
