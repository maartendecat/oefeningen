// Wie is er ingelogd? Het gezin is het (kleine letters) e-mailadres van de
// ouder. Lokaal kan je zonder Google testen met een test-login; die bestaat
// in productie niet.

import { cookies, headers } from "next/headers";
import { auth } from "./auth";

export type Ouder = { email: string; naam: string };

export const TEST_COOKIE = "test-ouder";
export const testLoginAan = process.env.NODE_ENV !== "production";

export async function huidigeOuder(): Promise<Ouder | null> {
  try {
    const sessie = await auth.api.getSession({ headers: await headers() });
    const email = sessie?.user?.email;
    if (email) return { email: email.toLowerCase(), naam: sessie.user.name ?? "" };
  } catch {
    // Geen of een ongeldig cookie: gewoon niet ingelogd.
  }

  if (testLoginAan) {
    const test = (await cookies()).get(TEST_COOKIE)?.value;
    if (test) return { email: test, naam: "testouder" };
  }
  return null;
}
