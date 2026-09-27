"use client";

// Houdt de profielen van het gezin gelijk met de server, per profiel. De
// browser blijft de hoofdopslag: de app werkt meteen en ook zonder internet.
//
// Hoe profielen samengaan staat in samenvoegen.ts. Logt een ander gezin in
// op dit toestel, dan worden de profielen van het vorige gezin hier vergeten.

import { useSyncExternalStore } from "react";
import { authClient } from "./auth-client";
import { voegSamen } from "./samenvoegen";
import { lees, type Spel } from "./spel";
import { bijWijziging, huidigeStaat, kiesProfiel, pasLokaalAan, verwijderProfiel } from "./state";

export type Ouder = { email: string; naam: string };

export type SyncStatus = {
  /** Is de eerste vergelijking met de server gedaan (of mislukt)? */
  gestart: boolean;
  /** null zolang we het niet weten (bv. zonder internet). */
  ingelogd: boolean | null;
  /** false als de server geen databank heeft; dan blijft alles lokaal. */
  opslag: boolean;
  /** true als de laatste poging om de server te bereiken mislukte. */
  offline: boolean;
  ouder: Ouder | null;
};

let status: SyncStatus = { gestart: false, ingelogd: null, opslag: true, offline: false, ouder: null };
const luisteraars = new Set<() => void>();

function zet(deel: Partial<SyncStatus>) {
  status = { ...status, ...deel };
  luisteraars.forEach((l) => l());
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    (l) => {
      luisteraars.add(l);
      return () => luisteraars.delete(l);
    },
    () => status,
    () => status,
  );
}

const URL = "/api/profielen";
const LEEG = { gezin: null, profielen: {}, gesynct: [], teWissen: [] };

/**
 * Haalt de profielen van de server en voegt ze samen met wat hier staat.
 * Geeft true als daarna alles hier ook op de server staat.
 */
async function trekBinnen(): Promise<boolean> {
  try {
    const r = await fetch(URL, { cache: "no-store" });
    if (r.status === 401) {
      zet({ ingelogd: false, ouder: null, offline: false });
      return false;
    }
    if (!r.ok) throw new Error(String(r.status));

    const { ouder, opslag, profielen } = (await r.json()) as {
      ouder: Ouder;
      opslag: boolean;
      profielen: Record<string, unknown>;
    };
    zet({ ingelogd: true, ouder, opslag, offline: false });

    const vorige = huidigeStaat().lokaal.gezin;
    if (vorige && vorige !== ouder.email) {
      pasLokaalAan(() => ({ ...LEEG, gezin: ouder.email }));
    } else if (!vorige) {
      pasLokaalAan((l) => ({ ...l, gezin: ouder.email }));
    }
    if (!opslag) return false;

    await wisWachtende();
    const server: Record<string, Spel> = {};
    for (const [id, data] of Object.entries(profielen)) {
      const spel = lees(data);
      if (spel) server[id] = spel;
    }

    let teDuwen: string[] = [];
    pasLokaalAan((l) => {
      const samen = voegSamen(l, server);
      teDuwen = samen.teDuwen;
      return { ...l, profielen: samen.profielen, gesynct: samen.gesynct };
    });

    let alles = true;
    for (const id of teDuwen) alles = (await duw(id)) && alles;
    return alles;
  } catch {
    zet({ offline: true });
    return false;
  }
}

/** Stuurt één profiel naar de server; true als de server het bewaard heeft. */
async function duw(id: string): Promise<boolean> {
  const spel = huidigeStaat().lokaal.profielen[id];
  if (!spel) return true;
  if (!status.ingelogd || !status.opslag) return false;
  try {
    const r = await fetch(`${URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spel }),
    });
    if (r.status === 401) {
      zet({ ingelogd: false });
      return false;
    }
    // De server heeft voortgang van een nieuwere versie van de app: herlaad
    // om die nieuwe versie op te halen in plaats van ze te overschrijven.
    if (r.status === 409) {
      window.location.reload();
      return false;
    }
    if (!r.ok) throw new Error(String(r.status));
    pasLokaalAan((l) => (l.gesynct.includes(id) ? l : { ...l, gesynct: [...l.gesynct, id] }));
    zet({ offline: false });
    return true;
  } catch {
    zet({ offline: true });
    return false;
  }
}

/** Geeft verwijderingen door die gebeurden terwijl de server onbereikbaar was. */
async function wisWachtende() {
  for (const id of huidigeStaat().lokaal.teWissen) {
    const r = await fetch(`${URL}/${id}`, { method: "DELETE" });
    if (!r.ok) throw new Error(String(r.status));
    pasLokaalAan((l) => ({ ...l, teWissen: l.teWissen.filter((w) => w !== id) }));
  }
}

const wachtend = new Map<string, ReturnType<typeof setTimeout>>();

function planDuw(id: string) {
  clearTimeout(wachtend.get(id));
  wachtend.set(
    id,
    setTimeout(() => {
      wachtend.delete(id);
      void duw(id);
    }, 800),
  );
}

let gestart = false;

/** Eén keer oproepen bij het opstarten van de app. */
export async function startSync() {
  if (gestart) return;
  gestart = true;
  bijWijziging(planDuw);

  // Niet eeuwig wachten als de server traag is: dan speelt ze gewoon lokaal.
  const teLaat = new Promise((r) => setTimeout(r, 3000));
  await Promise.race([trekBinnen(), teLaat]);
  zet({ gestart: true });

  // Terug naar de app (bv. na spelen op een ander toestel) of terug online.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void trekBinnen();
  });
  window.addEventListener("online", () => void trekBinnen());
}

// ---- Acties voor het loginscherm en het oudermenu -----------------------------

export async function aanmeldenMetGoogle() {
  await authClient.signIn.social({ provider: "google", callbackURL: "/" });
}

export async function aanmeldenMetFacebook() {
  await authClient.signIn.social({ provider: "facebook", callbackURL: "/" });
}

/** Enkel lokaal: inloggen als testouder, zonder Google. */
export async function testAanmelden(email?: string) {
  await fetch("/api/test-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  await trekBinnen();
}

/**
 * Stuurt alles door wat nog niet op de server staat: wijzigingen die nog
 * even wachten, en wat gespeeld werd zonder internet. Vergelijkt daarvoor
 * opnieuw met de server, want wat offline gebeurde, weet enkel die.
 */
async function stuurAllesDoor(): Promise<"ok" | "offline" | "geen-opslag"> {
  for (const timer of wachtend.values()) clearTimeout(timer);
  wachtend.clear();
  const gelukt = await trekBinnen();
  if (gelukt) return "ok";
  return status.ingelogd && !status.opslag ? "geen-opslag" : "offline";
}

/**
 * Afmelden vergeet de profielen op dit toestel; ze staan veilig op de
 * server. Daarom eerst alles doorsturen: lukt dat niet, dan gaat het
 * afmelden niet door (tenzij `toch`), zodat er geen voortgang verloren gaat.
 */
export async function afmelden({ toch = false } = {}): Promise<"ok" | "offline" | "geen-opslag"> {
  if (!toch) {
    const uitkomst = await stuurAllesDoor();
    if (uitkomst !== "ok") return uitkomst;
  }
  await Promise.allSettled([authClient.signOut(), fetch("/api/test-login", { method: "DELETE" })]);
  kiesProfiel(null);
  pasLokaalAan(() => ({ ...LEEG }));
  zet({ ingelogd: false, ouder: null });
  return "ok";
}

export async function verwijderAccount() {
  const r = await fetch(URL, { method: "DELETE" });
  if (!r.ok) throw new Error(String(r.status));
  // Alles is net gewist: er valt niets meer door te sturen.
  await afmelden({ toch: true });
}

/** Verwijdert een profiel hier en (zodra het kan) op de server. */
export async function wisProfiel(id: string) {
  verwijderProfiel(id);
  try {
    await wisWachtende();
  } catch {
    zet({ offline: true });
  }
}
