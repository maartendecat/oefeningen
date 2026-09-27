import type { Metadata } from "next";
import Link from "next/link";
import { OPNAMES } from "@/avatar/geluiden";
import { VOGELS } from "@/avatar/vogels";

export const metadata: Metadata = { title: "privacy · oefenen op lezen" };

export default function Privacy() {
  return (
    <main className="scherm ouder">
      <div className="ouder-inhoud">
        <section className="paneel">
          <h1>Privacy</h1>
          <p>
            &ldquo;Oefenen op lezen&rdquo; is een leesspelletje voor kinderen van het eerste leerjaar. Een ouder logt
            in met Google, zodat de voortgang van de kinderen bewaard blijft en op meerdere toestellen werkt.
          </p>
          <h2>Wat we bewaren</h2>
          <ul>
            <li>het e-mailadres van de ouder, om het gezin te herkennen;</li>
            <li>per profiel: de naam die de ouder koos, de gekozen avatar, welke leesreeksen gedaan zijn en welke kleren en vogels gewonnen zijn.</li>
          </ul>
          <p>
            We vragen Google enkel om je naam en e-mailadres. We gebruiken geen advertenties of trackers en delen niets
            met anderen. De gegevens staan bij Upstash (databank) en Vercel (hosting).
          </p>
          <h2>Wissen</h2>
          <p>
            In het oudermenu (⚙️) kan je een profiel verwijderen, of met &ldquo;Verwijder mijn account&rdquo; alle
            profielen en voortgang van je gezin in één keer wissen. Profielen die twee jaar niet gebruikt zijn, worden
            automatisch gewist.
          </p>
          <h2>Vogelgeluiden</h2>
          <p>
            De vogelgeluiden zijn korte fragmenten uit opnames van Wikimedia Commons (veel ervan komen oorspronkelijk
            van xeno-canto). Ze zijn ingekort en even luid gemaakt; die fragmenten vallen onder dezelfde licentie als
            het origineel. Met dank aan de makers:
          </p>
          <ul className="bronnen">
            {VOGELS.filter((v) => OPNAMES[v.id]).map((v) => {
              const o = OPNAMES[v.id];
              return (
                <li key={v.id}>
                  {v.naam}: {o.maker}, <a href={o.bron}>{o.licentie}</a>
                </li>
              );
            })}
          </ul>
          <p>
            <Link href="/">Terug naar de app</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
