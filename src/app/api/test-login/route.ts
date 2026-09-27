// Enkel lokaal: inloggen als testouder, om zonder Google-sleutels de
// profielen en de synchronisatie te kunnen uitproberen.

import { cookies } from "next/headers";
import { TEST_COOKIE, testLoginAan } from "@/lib/ouder";

export async function POST(request: Request) {
  if (!testLoginAan) return new Response(null, { status: 404 });
  let email = "test@gezin.local";
  try {
    const gevraagd = String((await request.json()).email ?? "");
    if (/^[a-z0-9._+-]+@[a-z0-9.-]+$/.test(gevraagd)) email = gevraagd;
  } catch {
    // Geen body: standaard testadres.
  }
  (await cookies()).set(TEST_COOKIE, email, { httpOnly: true, sameSite: "lax", path: "/" });
  return Response.json({ email });
}

export async function DELETE() {
  (await cookies()).delete(TEST_COOKIE);
  return new Response(null, { status: 204 });
}
