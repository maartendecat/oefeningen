"use client";

import { useEffect, useState } from "react";
import { isLeeg } from "@/lib/spel";
import { useSpel } from "@/lib/state";
import { startSync, useSyncStatus } from "@/lib/sync";
import { AvatarKiezen } from "./AvatarKiezen";
import { Beloning } from "./Beloning";
import { Kaart } from "./Kaart";
import { Kast } from "./Kast";
import { Lezen } from "./Lezen";
import { Ouder } from "./Ouder";

export type Scherm =
  | { naam: "kaart" }
  | { naam: "lezen"; reeks: string }
  | { naam: "beloning"; reeks: string; eerste: boolean }
  | { naam: "kast" }
  | { naam: "pop" }
  | { naam: "ouder" };

export function App() {
  const spel = useSpel();
  const sync = useSyncStatus();
  const [scherm, zetScherm] = useState<Scherm>({ naam: "kaart" });

  useEffect(() => {
    void startSync();
  }, []);

  // Op de server (en heel even in de browser) is er nog geen voortgang.
  if (!spel) return <div className="laden" />;
  // Een lege browser (nieuw toestel, of Safari heeft opgeruimd): eerst kijken
  // of er voortgang op de server staat, anders begint ze per ongeluk opnieuw.
  if (isLeeg(spel) && !sync.gestart) return <div className="laden" />;

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
    case "ouder":
      return <Ouder spel={spel} ga={zetScherm} />;
    default:
      return <Kaart spel={spel} ga={zetScherm} />;
  }
}
