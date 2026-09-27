import { describe, expect, it } from "vitest";
import { voegSamen } from "./samenvoegen";
import { nieuwSpel, type Spel } from "./spel";

const spel = (naam: string, bijgewerkt: number): Spel => ({ ...nieuwSpel(), naam, bijgewerkt });

describe("profielen samenvoegen", () => {
  it("neemt nieuwe profielen van de server over", () => {
    const uit = voegSamen({ profielen: {}, gesynct: [], teWissen: [] }, { "p-a": spel("juul", 5) });
    expect(uit.profielen["p-a"].naam).toBe("juul");
    expect(uit.gesynct).toEqual(["p-a"]);
    expect(uit.teDuwen).toEqual([]);
  });

  it("laat de recentste versie winnen", () => {
    const hier = { profielen: { "p-a": spel("hier", 10), "p-b": spel("hier", 1) }, gesynct: ["p-a", "p-b"], teWissen: [] };
    const uit = voegSamen(hier, { "p-a": spel("server", 5), "p-b": spel("server", 9) });
    expect(uit.profielen["p-a"].naam).toBe("hier");
    expect(uit.profielen["p-b"].naam).toBe("server");
    expect(uit.teDuwen).toEqual(["p-a"]);
  });

  it("stuurt een nieuw profiel van dit toestel naar de server", () => {
    const uit = voegSamen({ profielen: { "p-n": spel("nieuw", 3) }, gesynct: [], teWissen: [] }, {});
    expect(uit.profielen["p-n"]).toBeDefined();
    expect(uit.teDuwen).toEqual(["p-n"]);
  });

  it("verwijdert hier wat elders verwijderd werd", () => {
    const uit = voegSamen({ profielen: { "p-weg": spel("weg", 3) }, gesynct: ["p-weg"], teWissen: [] }, {});
    expect(uit.profielen["p-weg"]).toBeUndefined();
    expect(uit.teDuwen).toEqual([]);
  });

  it("haalt een hier verwijderd profiel niet terug van de server", () => {
    const uit = voegSamen({ profielen: {}, gesynct: [], teWissen: ["p-weg"] }, { "p-weg": spel("weg", 3) });
    expect(uit.profielen["p-weg"]).toBeUndefined();
    expect(uit.gesynct).toEqual([]);
  });

  it("doet niets als alles gelijk is", () => {
    const a = spel("juul", 7);
    const uit = voegSamen({ profielen: { "p-a": a }, gesynct: ["p-a"], teWissen: [] }, { "p-a": a });
    expect(uit.teDuwen).toEqual([]);
    expect(uit.profielen["p-a"]).toBe(a);
  });
});
