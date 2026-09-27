import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PLEKKEN } from "./decor";
import { OPNAMES } from "./geluiden";
import { LEEFGEBIEDEN, STARTVOGELS, VOGELS, isStartvogel } from "./vogels";

describe("vogels", () => {
  it("heeft unieke ids", () => {
    const ids = VOGELS.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("heeft 50 vogels: 17 in het bos, 15 in het veld en 18 aan het water", () => {
    const tel = (g: string) => VOGELS.filter((v) => v.gebied === g).length;
    expect(VOGELS).toHaveLength(50);
    expect([tel("bos"), tel("veld"), tel("water")]).toEqual([17, 15, 18]);
  });

  it("heeft vijf startvogels om als avatar te kiezen", () => {
    expect(STARTVOGELS.map((v) => v.id).sort()).toEqual(["ijsvogel", "kea", "oehoe", "papegaaiduiker", "zeearend"]);
    expect(isStartvogel("kea")).toBe(true);
    expect(isStartvogel("merel")).toBe(false);
    expect(isStartvogel("noor")).toBe(false);
  });

  it("gebruikt enkel gekende leefgebieden", () => {
    const gekend = LEEFGEBIEDEN.map((g) => g.id);
    for (const v of VOGELS) expect(gekend).toContain(v.gebied);
  });

  it("schrijft namen en weetjes in kleine letters, zoals de rest van de app", () => {
    for (const v of VOGELS) {
      expect(v.naam, v.id).toBe(v.naam.toLowerCase());
      expect(v.weetje, v.id).toBe(v.weetje.toLowerCase());
      expect(v.weetje, v.id).toMatch(/\.$/);
    }
  });

  it("geeft elke vogel een plek in het landschap", () => {
    for (const v of VOGELS) expect(PLEKKEN[v.id], v.id).toBeDefined();
    expect(Object.keys(PLEKKEN).sort()).toEqual(VOGELS.map((v) => v.id).sort());
  });

  it("heeft voor elke opname een bestand en een bron", () => {
    for (const [id, opname] of Object.entries(OPNAMES)) {
      expect(VOGELS.map((v) => v.id), id).toContain(id);
      expect(existsSync(`public/geluiden/${id}.m4a`), id).toBe(true);
      expect(opname.bron, id).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
    }
  });
});
