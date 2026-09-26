import { describe, expect, it } from "vitest";
import { isGeldigeCode, nieuweCode, normaliseer } from "./gezinscode";

describe("gezinscode", () => {
  it("maakt geldige, verschillende codes", () => {
    const codes = Array.from({ length: 50 }, nieuweCode);
    for (const c of codes) expect(isGeldigeCode(c), c).toBe(true);
    expect(new Set(codes).size).toBeGreaterThan(45);
  });

  it("maakt ingetypte codes netjes", () => {
    expect(normaliseer("  Roos Maan-VIS  482 ")).toBe("roos-maan-vis-482");
    expect(normaliseer("roos.maan.vis.482")).toBe("roos-maan-vis-482");
  });

  it.each(["", "roos-maan-482", "roos-maan-vis-48", "roos-maan-vis-482; drop", "ROOS-maan-vis-482"])(
    "weigert '%s'",
    (code) => {
      expect(isGeldigeCode(code)).toBe(false);
    },
  );
});
