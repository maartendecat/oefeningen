# oefenen op lezen

Een leesspelletje voor het eerste leerjaar, volgens de lettervolgorde van
*Veilig leren lezen* (kim-versie). Het kind leest reeksen van tien woordjes en
zinnetjes luidop voor, een ouder tikt ✓ of ↻, en na elke reeks mag het kind een
nieuw kledingstuk kiezen voor de eigen avatar.

De voortgang zit in de browser (`localStorage`), zodat de app meteen en ook
zonder internet werkt. Daarnaast gaat er een kopie naar de server, gekoppeld
aan een **gezinscode** (bv. `roos-maan-vis-482`) in een HttpOnly-cookie. Zo
overleeft de voortgang het opruimen van Safari, en kan je op meerdere
toestellen spelen.

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
| `src/lib/spel.ts` | De vorm van de voortgang, controle en migraties (browser én server). |
| `src/lib/state.ts` | Spelstatus in `localStorage`, plus alle acties. |
| `src/lib/sync.ts` | Houdt de kopie op de server bij; de recentste versie wint. |
| `src/app/api/voortgang/` | API: voortgang ophalen/bewaren, en een toestel koppelen aan een gezinscode. |
| `src/lib/opslag.ts` | Opslag per gezinscode in Upstash Redis (lokaal: in het geheugen). |
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
- de gezinscode zien, of dit toestel koppelen aan een bestaande gezinscode,
- een reservekopie als code kopiëren (werkt ook zonder server),
- alles wissen.

## Hosting

Vercel: importeer de GitHub-repo, Vercel herkent Next.js vanzelf.

Voor de opslag op de server: in het Vercel-project, **Storage → Create
Database → Upstash for Redis** en koppel ze aan het project. Vercel zet dan
zelf `KV_REST_API_URL` en `KV_REST_API_TOKEN`; herdeploy daarna. Zonder
databank werkt de app ook, maar dan enkel met opslag in de browser.

Lokaal is er geen databank nodig: de dev-server bewaart de voortgang dan in
zijn geheugen (weg bij herstarten). Wil je lokaal tegen de echte databank
testen, haal de variabelen op met `vercel env pull .env.local`.
