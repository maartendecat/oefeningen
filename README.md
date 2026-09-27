# oefenen op lezen

Een leesspelletje voor het eerste leerjaar, volgens de lettervolgorde van
*Veilig leren lezen* (kim-versie). Het kind leest reeksen van tien woordjes en
zinnetjes luidop voor, een ouder tikt ✓ of ↻, en na elke reeks mag het kind een
nieuw kledingstuk kiezen voor de eigen avatar.

Een ouder logt in met Google en maakt voor elk kind een profiel, met een
eigen avatar, voortgang en kast. Bij het openen kiest het kind zelf wie er
gaat lezen, zoals bij Netflix.

De profielen staan ook in de browser (`localStorage`), zodat de app meteen
en zonder internet werkt; daarnaast gaat alles naar de server (Upstash
Redis), per gezin en per profiel. Het gezin is het e-mailadres van de ouder.

## Ontwikkelen

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # controleert de leesinhoud
npm run lint
```

## Hoe het in elkaar zit

| Pad | Wat |
|---|---|
| `src/data/levels.ts` | De leesinhoud: levels (één nieuwe klank per level) met reeksen van tien oefeningen. |
| `src/data/levels.test.ts` | Bewaakt dat elk woord enkel gekende klanken gebruikt, één klinker heeft en geen medeklinkerclusters bevat, en dat een reeks niet korter wordt naar het einde. |
| `src/lib/klanken.ts` | Hakt woorden in klanken (`kaas` → `k · aa · s`). |
| `src/lib/auth.ts`, `src/lib/ouder.ts` | Inloggen met Better Auth (stateless, geen gebruikersdatabank); wie is de ingelogde ouder. |
| `src/lib/spel.ts` | De vorm van de voortgang, controle en migraties (browser én server). |
| `src/lib/state.ts` | Profielen in `localStorage`, het actieve profiel, plus alle acties. |
| `src/lib/sync.ts`, `src/lib/samenvoegen.ts` | Houdt de profielen gelijk met de server; per profiel wint de recentste versie. |
| `src/app/api/profielen/` | API: profielen van het ingelogde gezin ophalen, bewaren en verwijderen. |
| `src/lib/opslag.ts` | Opslag per gezin in Upstash Redis (lokaal: in het geheugen). |
| `src/avatar/` | De avatar (`Pop.tsx`) en alle kleren (`items.tsx`), als SVG. |
| `src/components/` | De schermen: avatar kiezen en een naam geven, levelkaart, lezen, beloning, kast, oudermenu. |

### Nieuwe letters toevoegen

Voeg in `src/data/levels.ts` een level toe met de nieuwe klank(en) in `nieuw`
en een paar reeksen van tien oefeningen. `npm test` zegt meteen of er een woord
tussen zit dat nog niet leesbaar is. Voor elke extra reeks is het leuk om ook
een extra item in `src/avatar/items.tsx` te tekenen, zodat er genoeg te winnen
blijft.

### De vorm van de voortgang veranderen

Verhoog `VERSIE` in `src/lib/spel.ts` en voeg in `MIGRATIES` een stap toe
die oude voortgang omzet. Zonder die stap zou oude voortgang geweigerd
worden; de test in `spel.test.ts` bewaakt dat er voor elke oudere versie een
stap is. Nieuwe velden die optioneel zijn (zoals `naam`) hebben geen nieuwe
versie nodig.

### Oudermenu

Het tandwieltje op de kaart, beveiligd met een maalsom. Daar kan je:
- de startletter kiezen (bv. meteen bij de `e` beginnen),
- het geluid aan- of uitzetten,
- profielen toevoegen, hernoemen en verwijderen,
- afmelden of het hele account verwijderen,
- een reservekopie van een profiel als code kopiëren,
- alles wissen.

## Lokaal testen

Zonder Google-sleutels toont het loginscherm lokaal een **test-login**, en
bewaart de dev-server de profielen in zijn geheugen (weg bij herstarten).
Die test-login bestaat in productie niet.

## Hosting (Vercel)

1. Importeer de GitHub-repo; Vercel herkent Next.js vanzelf.
2. **Databank:** Storage → Create Database → Upstash for Redis, en koppel ze
   aan het project.
3. **Google-login:** in de Google Cloud Console een OAuth-client (Web
   application) aanmaken, met als redirect-URI
   `https://<jouw-domein>/api/auth/callback/google`. Het OAuth-toestemmings-
   scherm heeft enkel de standaardscopes (naam, e-mail) nodig; vul als
   privacybeleid `https://<jouw-domein>/privacy` in.
4. **Omgevingsvariabelen:** zie `.env.example` (`BETTER_AUTH_SECRET`,
   `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), en
   herdeploy.

Facebook staat klaar: met `FACEBOOK_CLIENT_ID` en `FACEBOOK_CLIENT_SECRET`
verschijnt de knop vanzelf. Meta vraagt daarvoor wel een privacybeleid
(`/privacy`) en instructies om gegevens te wissen.
