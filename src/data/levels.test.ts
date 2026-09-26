import { describe, expect, it } from "vitest";
import { hak, isKlinker, kaal, woorden } from "@/lib/klanken";
import { ALLE_REEKSEN, LEVELS, gekendeKlanken } from "./levels";

describe("klanken hakken", () => {
  it("neemt de langste klank", () => {
    expect(hak("kaas")).toEqual(["k", "aa", "s"]);
    expect(hak("been")).toEqual(["b", "ee", "n"]);
    expect(hak("boot")).toEqual(["b", "oo", "t"]);
    expect(hak("vis")).toEqual(["v", "i", "s"]);
  });
});

describe("leesinhoud", () => {
  it.each(LEVELS.map((l) => [l.id, l.reeksen.length]))("level %s heeft minstens 4 reeksen", (_, aantal) => {
    expect(aantal).toBeGreaterThanOrEqual(4);
  });

  it("heeft unieke reeks-ids", () => {
    const ids = ALLE_REEKSEN.map((p) => p.reeks.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  LEVELS.forEach((level, levelIndex) => {
    const gekend = gekendeKlanken(levelIndex);

    level.reeksen.forEach((reeks) => {
      describe(reeks.id, () => {
        it("telt tien oefeningen", () => {
          expect(reeks.oefeningen).toHaveLength(10);
        });

        it.each(reeks.oefeningen)("'%s' is leesbaar met wat ze al kent", (oefening) => {
          expect(oefening).toMatch(/^[a-z .?]+$/);
          expect(oefening).not.toMatch(/[.?]\S/);
          for (const woord of woorden(oefening)) {
            const klanken = hak(kaal(woord));
            const onbekend = klanken.filter((k) => !gekend.has(k));
            expect(onbekend, `onbekende klank in "${woord}"`).toEqual([]);

            const klinkers = klanken.filter(isKlinker).length;
            expect(klinkers, `"${woord}" moet precies één klinker hebben`).toBe(1);

            const patroon = klanken.map((k) => (isKlinker(k) ? "v" : "m")).join("");
            expect(patroon, `"${woord}" heeft een medeklinkercluster`).not.toMatch(/mm/);
          }
        });

        it("wordt niet korter naar het einde toe", () => {
          const lengtes = reeks.oefeningen.map((o) => woorden(o).length);
          const gesorteerd = [...lengtes].sort((a, b) => a - b);
          expect(lengtes).toEqual(gesorteerd);
        });

        if (levelIndex > 0) {
          it("oefent de nieuwe klank genoeg", () => {
            const metNieuw = reeks.oefeningen.filter((o) =>
              woorden(o).some((w) => hak(kaal(w)).some((k) => level.nieuw.includes(k))),
            );
            expect(metNieuw.length).toBeGreaterThanOrEqual(6);
          });
        }
      });
    });
  });
});
