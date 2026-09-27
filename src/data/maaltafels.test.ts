import { describe, expect, it } from "vitest";
import { TAFEL_LEVELS } from "./maaltafels";

const reeksen = TAFEL_LEVELS.flatMap((l) => l.reeksen);

/** De tafels waar een som bij hoort: bij "3 × 4" zowel 3 als 4. */
function tafelsVan(vraag: string): number[] {
  const [a, teken, b] = vraag.split(" ");
  return teken === "×" ? [Number(a), Number(b)] : [Number(b)];
}

describe("maaltafels", () => {
  it("heeft 11 levels van 4 reeksen, zoals het lezen", () => {
    expect(TAFEL_LEVELS).toHaveLength(11);
    for (const l of TAFEL_LEVELS) expect(l.reeksen, l.id).toHaveLength(4);
  });

  it("heeft unieke reeks-ids", () => {
    const ids = reeksen.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(reeksen.map((r) => [r.id, r] as const))("%s: 15 verschillende, juiste sommen", (_, r) => {
    expect(r.oefeningen).toHaveLength(15);
    expect(new Set(r.oefeningen.map((s) => s.vraag)).size).toBe(15);
    for (const s of r.oefeningen) {
      const [a, teken, b] = s.vraag.split(" ");
      const juist = teken === "×" ? Number(a) * Number(b) : Number(a) / Number(b);
      expect(s.antwoord, s.vraag).toBe(juist);
      expect(Number.isInteger(s.antwoord), s.vraag).toBe(true);
      expect(s.antwoord, s.vraag).toBeLessThan(1000);
    }
  });

  it("blijft de eerste zeven reeksen binnen de tafels, en gaat vanaf reeks 8 boven de tien", () => {
    const getallen = (vraag: string) => vraag.split(/ [×:] /).map(Number);
    const binnenTafels = (s: { vraag: string; antwoord: number }) =>
      s.vraag.includes("×") ? getallen(s.vraag).every((n) => n <= 10) : getallen(s.vraag)[1] <= 10 && s.antwoord <= 10;
    for (const r of reeksen.slice(0, 7)) {
      for (const s of r.oefeningen) expect(binnenTafels(s), `${r.id}: ${s.vraag}`).toBe(true);
    }
    expect(reeksen[7].oefeningen.some((s) => !binnenTafels(s)), reeksen[7].id).toBe(true);
  });

  it("begint met de lagere tafels", () => {
    for (const s of reeksen[0].oefeningen) {
      // Bij een deling telt ook de uitkomst: 35 : 7 = 5 hoort bij de tafel van 5.
      const tafels = [...tafelsVan(s.vraag), s.vraag.includes(":") ? s.antwoord : 0];
      expect(tafels.some((t) => [1, 2, 3, 4, 5, 10].includes(t)), s.vraag).toBe(true);
    }
  });

  it("oefent elke tafel van 2 tot 10 als maal- en als deeltafel", () => {
    const alle = reeksen.flatMap((r) => r.oefeningen.map((s) => s.vraag));
    for (let t = 2; t <= 10; t++) {
      expect(alle.some((v) => v.includes("×") && tafelsVan(v).includes(t)), `× ${t}`).toBe(true);
      expect(alle.some((v) => v.endsWith(` : ${t}`)), `: ${t}`).toBe(true);
    }
  });

  it("deelt enkel door een eenvoudig getal (tot 12, een tiental of een honderdtal)", () => {
    for (const r of reeksen) {
      for (const s of r.oefeningen.filter((s) => s.vraag.includes(":"))) {
        const deler = Number(s.vraag.split(" : ")[1]);
        expect(deler <= 12 || (deler % 10 === 0 && deler < 100) || deler % 100 === 0, `${r.id}: ${s.vraag}`).toBe(true);
      }
    }
  });

  it("gaat op het einde boven de 100", () => {
    const laatste = TAFEL_LEVELS.at(-1)!.reeksen.flatMap((r) => r.oefeningen);
    expect(laatste.some((s) => s.antwoord > 100)).toBe(true);
  });

  it("begint elke reeks met een maalsom", () => {
    for (const r of reeksen) expect(r.oefeningen[0].vraag, r.id).toContain("×");
  });
});
