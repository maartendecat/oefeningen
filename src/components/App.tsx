"use client";

import { useEffect, useState } from "react";
import { kiesProfiel, useSpel, useStaat } from "@/lib/state";
import { startSync, useSyncStatus } from "@/lib/sync";
import { Aanmelden, type Aanmeldopties } from "./Aanmelden";
import { AvatarKiezen } from "./AvatarKiezen";
import { Beloning } from "./Beloning";
import { Kaart } from "./Kaart";
import { Kast } from "./Kast";
import { Lezen } from "./Lezen";
import { Ouder } from "./Ouder";
import { ProfielKiezen } from "./ProfielKiezen";

export type Scherm =
  | { naam: "kaart" }
  | { naam: "lezen"; reeks: string }
  | { naam: "beloning"; reeks: string; eerste: boolean }
  | { naam: "kast" }
  | { naam: "pop" }
  | { naam: "ouder" };

export function App({ aanmelden }: { aanmelden: Aanmeldopties }) {
  const staat = useStaat();
  const spel = useSpel();
  const sync = useSyncStatus();
  const [scherm, zetScherm] = useState<Scherm>({ naam: "kaart" });

  useEffect(() => {
    void startSync();
  }, []);

  // Na afmelden (of account verwijderen) begint wie inlogt weer bij het begin.
  const [vorigeLogin, zetVorigeLogin] = useState(sync.ingelogd);
  if (vorigeLogin !== sync.ingelogd) {
    zetVorigeLogin(sync.ingelogd);
    if (sync.ingelogd === false) zetScherm({ naam: "kaart" });
  }

  // Met maar één profiel hoeft er niets gekozen te worden.
  const ids = staat ? Object.keys(staat.lokaal.profielen) : [];
  const enigProfiel = ids.length === 1 ? ids[0] : null;
  useEffect(() => {
    if (sync.gestart && enigProfiel && !staat?.actief) kiesProfiel(enigProfiel);
  }, [sync.gestart, enigProfiel, staat?.actief]);

  // Op de server (en heel even in de browser) is er nog niets bekend.
  if (!staat) return <div className="laden" />;
  const heeftProfielen = ids.length > 0;
  // Nog niets op dit toestel: eerst horen of er iemand ingelogd is.
  if (!sync.gestart && !heeftProfielen) return <div className="laden" />;

  // Niet (meer) ingelogd. Zonder internet mag er wel verder gespeeld worden
  // met de profielen die al op dit toestel staan.
  if (sync.ingelogd === false || (sync.ingelogd === null && !heeftProfielen)) {
    return <Aanmelden opties={aanmelden} />;
  }

  if (scherm.naam === "ouder") return <Ouder spel={spel} ga={zetScherm} />;
  if (!spel) return <ProfielKiezen ga={zetScherm} />;

  if (!spel.avatar || !spel.naam || scherm.naam === "pop") {
    return <AvatarKiezen spel={spel} klaar={() => zetScherm({ naam: scherm.naam === "pop" ? "kast" : "kaart" })} />;
  }

  switch (scherm.naam) {
    case "lezen":
      return <Lezen key={scherm.reeks} spel={spel} reeksId={scherm.reeks} ga={zetScherm} />;
    case "beloning":
      return <Beloning spel={spel} reeksId={scherm.reeks} eerste={scherm.eerste} ga={zetScherm} />;
    case "kast":
      return <Kast spel={spel} ga={zetScherm} />;
    default:
      return <Kaart spel={spel} ga={zetScherm} />;
  }
}
