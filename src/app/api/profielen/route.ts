// Alle profielen van het ingelogde gezin.

import { huidigeOuder } from "@/lib/ouder";
import { opslag } from "@/lib/opslag";

export async function GET() {
  const ouder = await huidigeOuder();
  if (!ouder) return Response.json({ fout: "niet ingelogd" }, { status: 401 });

  const db = opslag();
  if (!db) return Response.json({ ouder, opslag: false, profielen: {} });
  return Response.json({ ouder, opslag: true, profielen: await db.profielen(ouder.email) });
}

/** Account verwijderen: alle profielen van dit gezin weg. */
export async function DELETE() {
  const ouder = await huidigeOuder();
  if (!ouder) return Response.json({ fout: "niet ingelogd" }, { status: 401 });
  await opslag()?.wisGezin(ouder.email);
  return new Response(null, { status: 204 });
}
