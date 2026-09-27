import { describe, expect, it } from "vitest";
import { LEERJAREN, ONDERWERPEN, onderwerpenVoor, reeksenVan, vindReeks } from "./onderwerpen";

describe("onderwerpen", () => {
  it("heeft unieke reeks-ids over alle onderwerpen heen", () => {
    const ids = ONDERWERPEN.flatMap(reeksenVan).map((p) => p.reeksId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("geeft elk leerjaar met inhoud minstens één onderwerp", () => {
    expect(LEERJAREN).toEqual([1, 3]);
    expect(onderwerpenVoor(1).map((o) => o.id)).toEqual(["lezen"]);
    expect(onderwerpenVoor(3).map((o) => o.id)).toEqual(["maaltafels"]);
    expect(onderwerpenVoor(null)).toEqual([]);
  });

  it("vindt een reeks en haar onderwerp terug", () => {
    expect(vindReeks("ikms-1")?.onderwerp.id).toBe("lezen");
    expect(vindReeks("tafel-7-2")?.onderwerp.soort).toBe("som");
  });
});
