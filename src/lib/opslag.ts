// Opslag van de profielen op de server: per gezin (e-mailadres van de
// ouder) één Redis-hash, met per profiel een veld met diens voortgang.
//
// In productie is dat Upstash Redis (via de Vercel Marketplace; die zet
// KV_REST_API_URL en KV_REST_API_TOKEN). Lokaal zonder die variabelen valt
// het terug op een opslag in het geheugen van de dev-server. In productie
// zonder databank staat de server-opslag uit en blijft alles in de browser.

import { Redis } from "@upstash/redis";

/** Profielen waar twee jaar niet meer aan gespeeld is, ruimt de databank zelf op. */
const BEWAARDUUR = 2 * 365 * 24 * 60 * 60;

export const MAX_PROFIELEN = 12;

export type Opslag = {
  profielen(gezin: string): Promise<Record<string, unknown>>;
  lees(gezin: string, id: string): Promise<unknown | null>;
  schrijf(gezin: string, id: string, spel: unknown): Promise<void>;
  wis(gezin: string, id: string): Promise<void>;
  wisGezin(gezin: string): Promise<void>;
};

const sleutel = (gezin: string) => `familie:${gezin}`;

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
  };
}

// Op globalThis, zodat alle routes in de dev-server dezelfde map delen.
const geheugen = ((globalThis as { __gezinnen?: Map<string, Map<string, unknown>> }).__gezinnen ??= new Map());
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
