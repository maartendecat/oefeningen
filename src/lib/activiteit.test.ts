import { describe, expect, it } from "vitest";
import { TAFEL_LEVELS } from "@/data/maaltafels";
import { dagVan, laatsteDagen, nieuweReeksen } from "./activiteit";

describe("dagtellers", () => {
  it("telt een dag in Belgische tijd", () => {
    // 23:30 UTC op 31 maart is al 1 april in Brussel.
    expect(dagVan(Date.UTC(2026, 2, 31, 23, 30))).toBe("2026-04-01");
  });

  it("geeft de laatste dagen zonder gaten, ook rond het zomeruur", () => {
    const dagen = laatsteDagen(5, Date.UTC(2026, 2, 31, 10));
    expect(dagen).toEqual(["2026-03-27", "2026-03-28", "2026-03-29", "2026-03-30", "2026-03-31"]);
  });

  it("telt enkel reeksen die nieuw klaar zijn, per onderwerp", () => {
    const tafel = TAFEL_LEVELS[0].reeksen[0].id;
    expect(nieuweReeksen({ klaar: ["ikms-1"] }, { klaar: ["ikms-1", "ikms-2", tafel, "zomaar"] })).toEqual({
      lezen: 1,
      maaltafels: 1,
      onbekend: 1,
    });
  });
});
