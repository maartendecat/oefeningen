// Koppelt dit toestel aan een bestaande gezinscode, bv. op een tweede
// toestel of nadat de browser alles gewist heeft.

import { cookies } from "next/headers";
import { isGeldigeCode, normaliseer } from "@/lib/gezinscode";
import { COOKIE, cookieOpties, opslag } from "@/lib/opslag";

export async function POST(request: Request) {
  const db = opslag();
  if (!db) return Response.json({ fout: "geen opslag ingesteld" }, { status: 503 });

  let code = "";
  try {
    code = normaliseer(String((await request.json()).code ?? ""));
  } catch {
    // Valt hieronder door als ongeldige code.
  }
  if (!isGeldigeCode(code)) return Response.json({ fout: "ongeldige code" }, { status: 400 });

  const spel = await db.lees(code);
  if (!spel) return Response.json({ fout: "onbekende code" }, { status: 404 });

  (await cookies()).set(COOKIE, code, cookieOpties());
  return Response.json({ code, spel });
}
