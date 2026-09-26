// De voortgang van dit toestel op de server. Welk gezin het is, staat in
// een HttpOnly-cookie: Safari ruimt die niet op zoals localStorage.

import { cookies } from "next/headers";
import { isGeldigeCode, nieuweCode } from "@/lib/gezinscode";
import { COOKIE, cookieOpties, opslag } from "@/lib/opslag";
import { lees } from "@/lib/spel";

const MAX_GROOTTE = 20_000;

function geenOpslag() {
  return Response.json({ fout: "geen opslag ingesteld" }, { status: 503 });
}

async function huidigeCode(): Promise<string | null> {
  const code = (await cookies()).get(COOKIE)?.value;
  return code && isGeldigeCode(code) ? code : null;
}

export async function GET() {
  const db = opslag();
  if (!db) return geenOpslag();

  const code = await huidigeCode();
  if (!code) return Response.json({ code: null }, { status: 404 });

  const spel = await db.lees(code);
  if (!spel) return Response.json({ code: null }, { status: 404 });
  return Response.json({ code, spel });
}

export async function PUT(request: Request) {
  const db = opslag();
  if (!db) return geenOpslag();

  const tekst = await request.text();
  if (tekst.length > MAX_GROOTTE) return Response.json({ fout: "te groot" }, { status: 413 });

  let spel;
  try {
    spel = lees(JSON.parse(tekst).spel);
  } catch {
    spel = null;
  }
  if (!spel) return Response.json({ fout: "ongeldige voortgang" }, { status: 400 });

  let code = await huidigeCode();
  if (code) {
    // Een oude versie van de app mag nieuwere voortgang niet overschrijven.
    const bestaand = (await db.lees(code)) as { versie?: number } | null;
    if (bestaand && typeof bestaand.versie === "number" && bestaand.versie > spel.versie) {
      return Response.json({ fout: "nieuwere versie op de server" }, { status: 409 });
    }
  } else {
    do code = nieuweCode();
    while (await db.bestaat(code));
  }

  await db.schrijf(code, spel);
  (await cookies()).set(COOKIE, code, cookieOpties());
  return Response.json({ code });
}
