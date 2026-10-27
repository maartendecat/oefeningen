// Opslag van de profielen op de server: per gezin (e-mailadres van de
// ouder) één Redis-hash, met per profiel een veld met diens voortgang.
//
// In productie is dat Upstash Redis (via de Vercel Marketplace; die zet
// KV_REST_API_URL en KV_REST_API_TOKEN). Lokaal zonder die variabelen valt
// het terug op een opslag in het geheugen van de dev-server. In productie
// zonder databank staat de server-opslag uit en blijft alles in de browser.
//
// Daarnaast zijn er dagtellers voor het beheer (zie activiteit.ts). Wie er
// actief was, gaat in een HyperLogLog: die telt hoeveel verschillende
// gezinnen en profielen er waren, maar bewaart niet welke.

import { Redis } from "@upstash/redis";
import { TELLER_DUUR, type Dag } from "./activiteit";

/** Profielen waar twee jaar niet meer aan gespeeld is, ruimt de databank zelf op. */
const BEWAARDUUR = 2 * 365 * 24 * 60 * 60;

export const MAX_PROFIELEN = 12;

export type Opslag = {
  profielen(gezin: string): Promise<Record<string, unknown>>;
  lees(gezin: string, id: string): Promise<unknown | null>;
  schrijf(gezin: string, id: string, spel: unknown): Promise<void>;
  wis(gezin: string, id: string): Promise<void>;
  wisGezin(gezin: string): Promise<void>;
  /** Alle gezinnen met minstens één profiel (voor het beheer). */
  gezinnen(): Promise<string[]>;
  /** Telt dat een profiel op `dag` speelde, met de reeksen die er nieuw klaar zijn. */
  tel(dag: string, gezin: string, id: string, reeksen: Record<string, number>): Promise<void>;
  /** De tellers per dag, plus hoeveel verschillende gezinnen en profielen er over al die dagen samen waren. */
  activiteit(dagen: string[]): Promise<{ dagen: Dag[]; gezinnen: number; profielen: number }>;
};

const PREFIX = "familie:";
const sleutel = (gezin: string) => PREFIX + gezin;
const teller = (dag: string, wat: "gezinnen" | "profielen" | "reeksen") => `activiteit:${dag}:${wat}`;

function redisOpslag(redis: Redis): Opslag {
  return {
    profielen: async (gezin) => (await redis.hgetall<Record<string, unknown>>(sleutel(gezin))) ?? {},
    lees: (gezin, id) => redis.hget(sleutel(gezin), id),
    schrijf: async (gezin, id, spel) => {
      await redis.hset(sleutel(gezin), { [id]: spel });
      await redis.expire(sleutel(gezin), BEWAARDUUR);
    },
    wis: async (gezin, id) => {
      await redis.hdel(sleutel(gezin), id);
    },
    wisGezin: async (gezin) => {
      await redis.del(sleutel(gezin));
    },
    gezinnen: async () => {
      const uit: string[] = [];
      let cursor = "0";
      do {
        const [volgende, sleutels] = await redis.scan(cursor, { match: PREFIX + "*", count: 500 });
        cursor = String(volgende);
        uit.push(...sleutels.map((s) => s.slice(PREFIX.length)));
      } while (cursor !== "0");
      return uit;
    },
    tel: async (dag, gezin, id, reeksen) => {
      const p = redis.pipeline();
      p.pfadd(teller(dag, "gezinnen"), gezin);
      p.pfadd(teller(dag, "profielen"), id);
      for (const [onderwerp, n] of Object.entries(reeksen)) p.hincrby(teller(dag, "reeksen"), onderwerp, n);
      for (const wat of ["gezinnen", "profielen", "reeksen"] as const) p.expire(teller(dag, wat), TELLER_DUUR);
      await p.exec();
    },
    activiteit: async (dagen) => {
      if (dagen.length === 0) return { dagen: [], gezinnen: 0, profielen: 0 };
      const p = redis.pipeline();
      for (const dag of dagen) {
        p.pfcount(teller(dag, "gezinnen"));
        p.pfcount(teller(dag, "profielen"));
        p.hgetall(teller(dag, "reeksen"));
      }
      // Over meerdere sleutels telt PFCOUNT de unie: elk gezin één keer.
      const [eerste, ...rest] = dagen;
      p.pfcount(teller(eerste, "gezinnen"), ...rest.map((d) => teller(d, "gezinnen")));
      p.pfcount(teller(eerste, "profielen"), ...rest.map((d) => teller(d, "profielen")));
      const r = (await p.exec()) as unknown[];
      return {
        dagen: dagen.map((dag, i) => ({
          dag,
          gezinnen: Number(r[i * 3]),
          profielen: Number(r[i * 3 + 1]),
          reeksen: Object.fromEntries(
            Object.entries((r[i * 3 + 2] as Record<string, unknown> | null) ?? {}).map(([k, v]) => [k, Number(v)]),
          ),
        })),
        gezinnen: Number(r[dagen.length * 3]),
        profielen: Number(r[dagen.length * 3 + 1]),
      };
    },
  };
}

// Op globalThis, zodat alle routes in de dev-server dezelfde map delen.
const geheugen = ((globalThis as { __gezinnen?: Map<string, Map<string, unknown>> }).__gezinnen ??= new Map());
type GeheugenDag = { gezinnen: Set<string>; profielen: Set<string>; reeksen: Record<string, number> };
const dagGeheugen = ((globalThis as { __activiteit?: Map<string, GeheugenDag> }).__activiteit ??= new Map<string, GeheugenDag>());
const gezinIn = (gezin: string) => {
  if (!geheugen.has(gezin)) geheugen.set(gezin, new Map());
  return geheugen.get(gezin)!;
};

const geheugenOpslag: Opslag = {
  profielen: async (gezin) => Object.fromEntries(gezinIn(gezin)),
  lees: async (gezin, id) => gezinIn(gezin).get(id) ?? null,
  schrijf: async (gezin, id, spel) => {
    gezinIn(gezin).set(id, spel);
  },
  wis: async (gezin, id) => {
    gezinIn(gezin).delete(id);
  },
  wisGezin: async (gezin) => {
    geheugen.delete(gezin);
  },
  gezinnen: async () => [...geheugen.keys()].filter((g) => geheugen.get(g)!.size > 0),
  tel: async (dag, gezin, id, reeksen) => {
    if (!dagGeheugen.has(dag)) dagGeheugen.set(dag, { gezinnen: new Set(), profielen: new Set(), reeksen: {} });
    const d = dagGeheugen.get(dag)!;
    d.gezinnen.add(gezin);
    d.profielen.add(id);
    for (const [onderwerp, n] of Object.entries(reeksen)) d.reeksen[onderwerp] = (d.reeksen[onderwerp] ?? 0) + n;
  },
  activiteit: async (dagen) => {
    const alleGezinnen = new Set<string>();
    const alleProfielen = new Set<string>();
    const uit = dagen.map((dag) => {
      const d = dagGeheugen.get(dag);
      d?.gezinnen.forEach((g) => alleGezinnen.add(g));
      d?.profielen.forEach((p) => alleProfielen.add(p));
      return { dag, gezinnen: d?.gezinnen.size ?? 0, profielen: d?.profielen.size ?? 0, reeksen: { ...d?.reeksen } };
    });
    return { dagen: uit, gezinnen: alleGezinnen.size, profielen: alleProfielen.size };
  },
};

export function opslag(): Opslag | null {
  if (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) {
    return redisOpslag(Redis.fromEnv());
  }
  return process.env.NODE_ENV === "production" ? null : geheugenOpslag;
}

/** Profiel-ids maakt de browser zelf aan; de server aanvaardt enkel dit patroon. */
export function isGeldigId(id: string): boolean {
  return /^p-[a-z0-9]{6,32}$/.test(id);
}
