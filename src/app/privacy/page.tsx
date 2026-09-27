import type { Metadata } from "next";
import Link from "next/link";

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
            <li>per profiel: de naam die de ouder koos, de gekozen avatar, welke leesreeksen gedaan zijn en welke kleren gewonnen zijn.</li>
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
          <p>
            <Link href="/">Terug naar de app</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
