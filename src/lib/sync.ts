"use client";

// Houdt een kopie van de voortgang op de server bij, als reservekopie en om
// op meerdere toestellen te spelen. De browser blijft de hoofdopslag: de app
// werkt meteen en ook zonder internet.
//
// Regel bij verschil: de versie met het recentste `bijgewerkt` wint.

import { useSyncExternalStore } from "react";
import { bewaar, bijWijziging, huidigSpel } from "./state";
import { lees } from "./spel";

export type SyncStatus = {
  /** Is de eerste vergelijking met de server gedaan (of mislukt)? */
  gestart: boolean;
  /** false als de server geen opslag heeft; dan blijft alles lokaal. */
  beschikbaar: boolean;
  /** true als de laatste poging om de server te bereiken mislukte. */
  offline: boolean;
  code: string | null;
};

let status: SyncStatus = { gestart: false, beschikbaar: true, offline: false, code: null };
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

const URL = "/api/voortgang";

/** Haalt de voortgang van de server en neemt ze over als ze nieuwer is. */
async function trekBinnen() {
  try {
    const r = await fetch(URL, { cache: "no-store" });
    if (r.status === 503) return zet({ beschikbaar: false, offline: false });
    if (r.status === 404) {
      zet({ beschikbaar: true, offline: false, code: null });
      // Nog niets op de server: stuur wat er lokaal al gespeeld is.
      if ((huidigSpel().bijgewerkt ?? 0) > 0) await duw();
      return;
    }
    if (!r.ok) throw new Error(String(r.status));

    const { code, spel } = await r.json();
    zet({ beschikbaar: true, offline: false, code });
    const server = lees(spel);
    const lokaal = huidigSpel();
    const serverTijd = server?.bijgewerkt ?? 0;
    const lokaalTijd = lokaal.bijgewerkt ?? 0;
    if (server && serverTijd > lokaalTijd) bewaar(server, { vanServer: true });
    else if (lokaalTijd > serverTijd) await duw();
  } catch {
    zet({ offline: true });
  }
}

/** Stuurt de lokale voortgang naar de server. */
async function duw() {
  if (!status.beschikbaar) return;
  try {
    const r = await fetch(URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spel: huidigSpel() }),
    });
    if (r.status === 503) return zet({ beschikbaar: false });
    // De server heeft voortgang van een nieuwere versie van de app: herlaad
    // om die nieuwe versie op te halen in plaats van ze te overschrijven.
    if (r.status === 409) return window.location.reload();
    if (!r.ok) throw new Error(String(r.status));
    const { code } = await r.json();
    zet({ offline: false, code });
  } catch {
    zet({ offline: true });
  }
}

let wachtend: ReturnType<typeof setTimeout> | undefined;

function planDuw() {
  clearTimeout(wachtend);
  wachtend = setTimeout(() => void duw(), 800);
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

/** Oudermenu: koppel dit toestel aan een bestaande gezinscode. */
export async function koppel(code: string): Promise<"ok" | "onbekend" | "fout"> {
  try {
    const r = await fetch(`${URL}/koppel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (r.status === 404 || r.status === 400) return "onbekend";
    if (!r.ok) return "fout";
    const { code: gekoppeld, spel } = await r.json();
    const server = lees(spel);
    if (!server) return "fout";
    bewaar(server, { vanServer: true });
    zet({ code: gekoppeld, offline: false });
    return "ok";
  } catch {
    return "fout";
  }
}
