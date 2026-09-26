// Opslag van de voortgang op de server, per gezinscode.
//
// In productie is dat Upstash Redis (via de Vercel Marketplace; die zet
// KV_REST_API_URL en KV_REST_API_TOKEN). Lokaal zonder die variabelen valt
// het terug op een opslag in het geheugen van de dev-server, zodat je de
// synchronisatie toch kan uitproberen. In productie zonder databank staat
// de server-opslag gewoon uit en blijft alles in de browser.

import { Redis } from "@upstash/redis";

export const COOKIE = "gezinscode";
/** Browsers aanvaarden een cookie hoogstens 400 dagen; elke keer spelen verlengt hem. */
export const COOKIE_DUUR = 400 * 24 * 60 * 60;
/** Voortgang waar twee jaar niet meer aan gespeeld is, ruimt de databank zelf op. */
const BEWAARDUUR = 2 * 365 * 24 * 60 * 60;

export type Opslag = {
  lees(code: string): Promise<unknown | null>;
  schrijf(code: string, spel: unknown): Promise<void>;
  bestaat(code: string): Promise<boolean>;
};

const sleutel = (code: string) => `gezin:${code}`;

function redisOpslag(redis: Redis): Opslag {
  return {
    lees: (code) => redis.get(sleutel(code)),
    schrijf: async (code, spel) => {
      await redis.set(sleutel(code), spel, { ex: BEWAARDUUR });
    },
    bestaat: async (code) => (await redis.exists(sleutel(code))) > 0,
  };
}

// Op globalThis, zodat alle routes in de dev-server dezelfde map delen.
const geheugen = ((globalThis as { __voortgang?: Map<string, unknown> }).__voortgang ??= new Map());

const geheugenOpslag: Opslag = {
  lees: async (code) => geheugen.get(code) ?? null,
  schrijf: async (code, spel) => {
    geheugen.set(code, spel);
  },
  bestaat: async (code) => geheugen.has(code),
};

export function opslag(): Opslag | null {
  if (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) {
    return redisOpslag(Redis.fromEnv());
  }
  return process.env.NODE_ENV === "production" ? null : geheugenOpslag;
}

export function cookieOpties() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    // Lokaal testen gebeurt over http (ook vanaf de iPad via het wifi-adres).
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_DUUR,
    path: "/",
  };
}
