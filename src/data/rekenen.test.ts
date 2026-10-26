import { describe, expect, it } from "vitest";
import { REKEN_LEVELS, sleutel } from "./rekenen";
import type { Som } from "./sommen";

const reeksen = REKEN_LEVELS.flatMap((l) => l.reeksen);
const GETAL_LEVELS = REKEN_LEVELS.slice(0, 9);

/** De getallen die een oefening laat zien of vraagt. */
function getallenVan(s: Som): number[] {
  if (s.vorm === "getalbeeld") return [s.aantal];
  if (s.vorm === "splitshuis") return [s.dak];
  return [];
}

describe("rekenen", () => {
  it("heeft een level per getal van 2 tot 10, een mix tot 10 en twee levels tot 20", () => {
    expect(REKEN_LEVELS.map((l) => l.tegels.join(" "))).toEqual([
      "2", "3", "4", "5", "6", "7", "8", "9", "10", "≤10", "11–15", "16–20",
    ]);
    expect(REKEN_LEVELS.map((l) => l.reeksen.length)).toEqual([1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
  });

  it("heeft unieke reeks-ids die met reken- beginnen", () => {
    const ids = reeksen.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^reken-/);
  });

  it.each(reeksen.map((r) => [r.id, r] as const))("%s: 15 juiste oefeningen (8 bij het getal 2)", (_, r) => {
    expect(r.oefeningen).toHaveLength(r.id === "reken-2-1" ? 8 : 15);
    for (const s of r.oefeningen) {
      if (s.vorm === "getalbeeld") {
        expect(s.antwoord).toBe(s.aantal);
        expect(s.aantal).toBeGreaterThanOrEqual(1);
        expect(s.aantal).toBeLessThanOrEqual(20);
      } else if (s.vorm === "splitshuis") {
        // Het dak is nooit leeg, en precies één kamer is leeg.
        expect(s.dak).toBeGreaterThanOrEqual(2);
        expect([s.links, s.rechts].filter((k) => k === null)).toHaveLength(1);
        const gegeven = s.links ?? s.rechts!;
        expect(gegeven + s.antwoord, sleutel(s)).toBe(s.dak);
        expect(s.antwoord).toBeGreaterThanOrEqual(0);
      } else {
        throw new Error(`onverwachte vorm in ${r.id}`);
      }
    }
  });

  it("herhaalt nooit een oefening binnen een reeks", () => {
    for (const r of reeksen) {
      expect(new Set(r.oefeningen.map(sleutel)).size, r.id).toBe(r.oefeningen.length);
    }
  });

  it("begint al in de tweede reeks met het getal 3", () => {
    expect(reeksen[1].id).toBe("reken-3-1");
  });

  it("begint elke reeks met 8 splitsingen van het nieuwe getal (of minder bij 2)", () => {
    GETAL_LEVELS.forEach((level, i) => {
      const n = i + 2;
      const aantal = Math.min(8, 2 * (n + 1));
      for (const r of level.reeksen) {
        for (const s of r.oefeningen.slice(0, aantal)) {
          expect(s.vorm === "splitshuis" && s.dak === n, `${r.id}: ${sleutel(s)}`).toBe(true);
        }
      }
    });
  });

  it("zet de eerste reeks in de volgorde van de kaartjes, met 0 erbij", () => {
    const eerste = REKEN_LEVELS[5].reeksen[0].oefeningen.slice(0, 8); // het getal 7
    expect(eerste.map(sleutel)).toEqual([
      "huis 7: 0 | ?", "huis 7: ? | 6", "huis 7: 2 | ?", "huis 7: ? | 4",
      "huis 7: 4 | ?", "huis 7: ? | 2", "huis 7: 6 | ?", "huis 7: ? | 0",
    ]);
  });

  it("oefent elke splitsing van het nieuwe getal in zijn level", () => {
    GETAL_LEVELS.forEach((level, i) => {
      const n = i + 2;
      const gezien = new Set(
        level.reeksen.flatMap((r) =>
          r.oefeningen.flatMap((s) => (s.vorm === "splitshuis" && s.dak === n ? [s.links ?? n - s.rechts!] : [])),
        ),
      );
      for (let links = 0; links <= n; links++) expect(gezien.has(links), `${level.id}: ${links} | ${n - links}`).toBe(true);
    });
  });

  it("gebruikt in een level enkel getallen die al aan bod kwamen", () => {
    const maxVan = (id: string) => (id === "reken-mix10" ? 10 : Number(id.split("-").at(-1)));
    for (const level of REKEN_LEVELS) {
      for (const r of level.reeksen) {
        for (const s of r.oefeningen) {
          for (const g of getallenVan(s)) expect(g, `${r.id}: ${sleutel(s)}`).toBeLessThanOrEqual(maxVan(level.id));
        }
      }
    }
  });

  it("splitst boven de tien enkel in 10 en de rest", () => {
    for (const s of reeksen.flatMap((r) => r.oefeningen)) {
      if (s.vorm !== "splitshuis" || s.dak <= 10) continue;
      expect([s.links, s.rechts, s.antwoord], sleutel(s)).toContain(10);
    }
  });

  it("toont getalbeelden enkel in de tweede helft van een level maar even", () => {
    for (const level of REKEN_LEVELS) {
      level.reeksen.forEach((r, k) => {
        const later = k + 1 > Math.ceil(level.reeksen.length / 2);
        for (const s of r.oefeningen) {
          if (s.vorm === "getalbeeld") expect(s.evenTonen, `${r.id}: ${sleutel(s)}`).toBe(later);
        }
      });
    }
  });

  it("laat het tienveld soms liggen en soms staan", () => {
    const beelden = reeksen.flatMap((r) => r.oefeningen.filter((s) => s.vorm === "getalbeeld"));
    const staand = beelden.filter((s) => s.staand).length;
    expect(staand).toBeGreaterThan(beelden.length * 0.3);
    expect(staand).toBeLessThan(beelden.length * 0.7);
  });

  it("brengt getalbeelden in elke reeks, en tot 20 op het einde", () => {
    for (const r of reeksen) {
      expect(r.oefeningen.filter((s) => s.vorm === "getalbeeld").length, r.id).toBeGreaterThanOrEqual(2);
    }
    const laatste = REKEN_LEVELS.at(-1)!.reeksen.flatMap((r) => r.oefeningen);
    expect(laatste.some((s) => s.vorm === "getalbeeld" && s.aantal > 15)).toBe(true);
  });
});
