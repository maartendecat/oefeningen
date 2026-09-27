// Eén profiel van het ingelogde gezin bewaren of verwijderen.

import { huidigeOuder } from "@/lib/ouder";
import { MAX_PROFIELEN, isGeldigId, opslag } from "@/lib/opslag";
import { lees } from "@/lib/spel";

const MAX_GROOTTE = 20_000;

export async function PUT(request: Request, ctx: RouteContext<"/api/profielen/[id]">) {
  const ouder = await huidigeOuder();
  if (!ouder) return Response.json({ fout: "niet ingelogd" }, { status: 401 });
  const db = opslag();
  if (!db) return Response.json({ fout: "geen opslag ingesteld" }, { status: 503 });

  const { id } = await ctx.params;
  if (!isGeldigId(id)) return Response.json({ fout: "ongeldig profiel" }, { status: 400 });

  const tekst = await request.text();
  if (tekst.length > MAX_GROOTTE) return Response.json({ fout: "te groot" }, { status: 413 });
  let spel;
  try {
    spel = lees(JSON.parse(tekst).spel);
  } catch {
    spel = null;
  }
  if (!spel) return Response.json({ fout: "ongeldige voortgang" }, { status: 400 });

  const bestaand = (await db.lees(ouder.email, id)) as { versie?: number } | null;
  if (!bestaand) {
    const aantal = Object.keys(await db.profielen(ouder.email)).length;
    if (aantal >= MAX_PROFIELEN) return Response.json({ fout: "te veel profielen" }, { status: 403 });
  } else if (typeof bestaand.versie === "number" && bestaand.versie > spel.versie) {
    // Een oude versie van de app mag nieuwere voortgang niet overschrijven.
    return Response.json({ fout: "nieuwere versie op de server" }, { status: 409 });
  }

  await db.schrijf(ouder.email, id, spel);
  return new Response(null, { status: 204 });
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/profielen/[id]">) {
  const ouder = await huidigeOuder();
  if (!ouder) return Response.json({ fout: "niet ingelogd" }, { status: 401 });
  const { id } = await ctx.params;
  if (!isGeldigId(id)) return Response.json({ fout: "ongeldig profiel" }, { status: 400 });
  await opslag()?.wis(ouder.email, id);
  return new Response(null, { status: 204 });
}
