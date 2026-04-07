# NyhetsCRUD

En demo-applikasjon som viser CRUD-operasjoner (Create, Read, Update, Delete) mot et REST-API, bygget med HTML, CSS og TypeScript. Prosjektet brukes i undervisning i operasjonell frontendutvikling ved Gokstad Akademiet.

## Om prosjektet

NyhetsCRUD er en enkel nyhetsportal der man kan opprette, lese, redigere og slette nyhetssaker. Frontenden kommuniserer med [CrudOps](https://github.com/vegarcodes/crudops) — et JSON-basert API som kjører lokalt.

`main`-branchen inneholder utgangspunktet. Etterhvert som vi jobber oss gjennom stoffet i undervisningen, vil nye brancher vise frem løsningene steg for steg.

## Brancher

| Branch                         | Beskrivelse                                      |
| ------------------------------ | ------------------------------------------------ |
| `main`                         | Startpunkt med HTML, CSS og TODO-er i JavaScript |
| `Intro-CRUD-(uten-innlogging)` | Grunnleggende CRUD uten autentisering            |
| `Med-innlogging`               | Utvidet med innlogging og brukerhåndtering       |
| `Med-URL-search-params`        | Navigasjon til enkeltartikler via URL-parametre  |

### Autentisering

Applikasjonen har to visningsmoduser basert på innloggingsstatus:

- **Ikke innlogget** — nyheter vises som leseliste, høyresiden viser et innloggingsskjema
- **Innlogget** — rediger/slett-knapper vises på hvert kort, innloggingsskjemaet erstattes av skjema for opprettelse/redigering, og en logg ut-knapp vises i headeren

Innlogging skjer mot `POST /api/login` med e-post og passord. Ved vellykket innlogging returnerer API-et en API-nøkkel som lagres i `localStorage`. Denne nøkkelen sendes med i `Authorization`-headeren på alle skrive-operasjoner. Ved utlogging fjernes nøkkelen fra `localStorage`.

### CRUD-operasjoner

| Operasjon | HTTP-metode | Endepunkt | Autentisering |
| --- | --- | --- | --- |
| Hent alle nyheter | `GET` | `/api/news` | Nei |
| Hent én nyhetssak | `GET` | `/api/news/:id` | Nei |
| Hent alle brukere | `GET` | `/api/users` | Nei |
| Logg inn | `POST` | `/api/login` | Nei |
| Opprett nyhetssak | `POST` | `/api/news` | `Authorization: Bearer <API_KEY>` |
| Oppdater nyhetssak | `PUT` | `/api/news/:id` | `Authorization: Bearer <API_KEY>` |
| Slett nyhetssak | `DELETE` | `/api/news/:id` | `Authorization: Bearer <API_KEY>` |

Feltene `created` og `updated` settes automatisk av serveren.

### Artikkelside med URL-parametre

Hver nyhetssak i listen er lenket til `article.html?id=<id>`. Artikkelsiden leser `id`-parameteren fra URL-en med `URLSearchParams`, henter artikkelen fra API-et, og rendrer en fullvisning med kategori, status, tittel, ingress, brødtekst og forfatternavn. Dersom ID mangler eller artikkelen ikke finnes, vises en feilmelding.

### Skjemahåndtering

Skjemaet fungerer i to moduser:

- **Opprett** — standardmodus, sender `POST` til `/api/news`
- **Rediger** — aktiveres ved klikk på "Rediger", henter eksisterende data med `GET /api/news/:id`, fyller inn skjemaet, og sender `PUT` ved innsending

### Dynamisk rendering

Nyhetskortene bygges dynamisk med `document.createElement()` og template literals. Hvert kort viser kategori, publiseringsstatus, tittel (som lenke til artikkelsiden), ingress, brødtekst og forfatternavn. Rediger/slett-knapper vises kun for innloggede brukere.

## Forutsetninger

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) og npm
- En lokal kjørende instans av [CrudOps](https://github.com/vegarcodes/crudops)

## Kom i gang

### 1. Sett opp API-et (CrudOps)

```bash
git clone https://github.com/vegarcodes/crudops.git
cd crudops
npm install
```

Lag en `.env`-fil basert på `.env.example` og fyll inn `TEMPLATE`.

#### Oppdater CrudOps med innloggingsstøtte

For at innlogging skal fungere må du erstatte `index.js` i CrudOps med den oppdaterte versjonen som ligger i `new_crudops_config/` i dette prosjektet. Kopier filen over til roten av CrudOps-prosjektet:

```bash
cp <sti-til-nyhetscrud>/new_crudops_config/index.js <sti-til-crudops>/index.js
```

Den oppdaterte configen legger til `POST /api/login` som autentiserer med e-post og passord mot brukere i databasen og returnerer `API_KEY` ved gyldig innlogging. Configen er bakoverkompatibel — eksisterende CRUD-operasjoner fungerer som før.

Start deretter API-et:

```bash
npm start
```

API-et kjører nå på `http://localhost:3000`.

### 2. Åpne frontenden

Klon dette repositoryet og åpne `index.html` via en lokal utviklingsserver (f.eks. Live Server i VS Code). Siden bruker ES-moduler (`type="module"`) og krever en server — den kan ikke åpnes direkte som fil.

```bash
git clone https://github.com/eskjelbred/GA_nyhetscrud_demo.git
cd GA_nyhetscrud_demo
```

### 3. Koble frontend til API

`BASE_URL` i `ts/api.ts` er satt til `http://localhost:3000/api` som standard. Oppdater denne om API-et kjører på en annen adresse.

## Filstruktur

```
nyhetscrud/
├── index.html                # Hovedside med nyhetsliste, innlogging og skjema
├── article.html              # Artikkelside — viser én nyhetssak basert på ?id= i URL-en
├── css/
│   └── style.css             # All styling for begge sider
├── ts/
│   ├── types.ts              # Interfaces: User, NewsArticle, NewsFormData
│   ├── api.ts                # Delte funksjoner: BASE_URL, fetchUsers, getApiKey, isLoggedIn, getUserName
│   ├── script.ts             # Hovedlogikk for index.html — CRUD, login, rendering
│   └── article.ts            # Logikk for article.html — hent og vis én artikkel
├── js/                       # Kompilert JavaScript (output fra tsc, ikke rediger direkte)
│   ├── types.js
│   ├── api.js
│   ├── script.js
│   └── article.js
├── tsconfig.json             # TypeScript-konfigurasjon (ES2022, moduler)
├── new_crudops_config/
│   └── index.js              # Oppdatert CrudOps-server med innloggingsendepunkt
└── README.md
```

## Teknisk oversikt

### Modulstruktur

Koden er delt opp i ES-moduler med klare ansvarsområder:

- **`ts/types.ts`** — eksporterer interfaces (`User`, `NewsArticle`, `NewsFormData`) som brukes på tvers av modulene
- **`ts/api.ts`** — delt modul med `BASE_URL`, `fetchUsers()`, `getApiKey()`, `isLoggedIn()` og `getUserName()`. Importeres av både `script.ts` og `article.ts`.
- **`ts/script.ts`** — hovedmodul for `index.html`. Håndterer innlogging/utlogging, visningsstyring, CRUD-operasjoner, rendering av nyhetslisten og skjemalogikk.
- **`ts/article.ts`** — modul for `article.html`. Leser `id` fra URL-parametre med `URLSearchParams`, henter artikkel og brukere parallelt med `Promise.all`, og rendrer en fullvisning eller feilmelding.

HTML-filene laster JavaScript med `<script type="module">`, som aktiverer ES-modulimport i nettleseren.

### TypeScript

Kildekoden kompileres med `tsc` fra `ts/` til `js/`. Konfigurasjonen bruker ES2022 som target med `bundler` module resolution. Top-level `await` brukes i `script.ts` for å hente brukere ved oppstart.

### `article.html`

Egen side for å vise én nyhetssak. Leser artikkel-ID fra URL-en (`?id=1`), henter data fra API-et, og viser en detaljert visning med tilbake-lenke til oversikten.

### `new_crudops_config/index.js`

Oppdatert serverconfig for CrudOps som legger til et `POST /api/login`-endepunkt. Endepunktet sjekker e-post og passord mot brukerne i databasen og returnerer API-nøkkelen ved gyldig innlogging. Inkluderer også hjelpendepunkter for testing (`/api/status/:code`, `/api/delay/:ms`, `/api/reset`).
