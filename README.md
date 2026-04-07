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

| Operasjon          | HTTP-metode | Endepunkt       | Autentisering                     |
| ------------------ | ----------- | --------------- | --------------------------------- |
| Hent alle nyheter  | `GET`       | `/api/news`     | Nei                               |
| Hent alle brukere  | `GET`       | `/api/users`    | Nei                               |
| Logg inn           | `POST`      | `/api/login`    | Nei                               |
| Opprett nyhetssak  | `POST`      | `/api/news`     | `Authorization: Bearer <API_KEY>` |
| Oppdater nyhetssak | `PUT`       | `/api/news/:id` | `Authorization: Bearer <API_KEY>` |
| Slett nyhetssak    | `DELETE`    | `/api/news/:id` | `Authorization: Bearer <API_KEY>` |

Skrive-operasjoner (POST, PUT, DELETE) krever en API-nøkkel som sendes med i `Authorization`-headeren. Feltene `created` og `updated` settes automatisk av serveren.

### Skjemahåndtering

Skjemaet fungerer i to moduser:

- **Opprett** — standardmodus, sender `POST` til `/api/news`
- **Rediger** — aktiveres ved klikk på "Rediger", henter eksisterende data med `GET /api/news/:id`, fyller inn skjemaet, og sender `PUT` ved innsending

Avbryt-knappen nullstiller skjemaet tilbake til opprettelsesmodus.

### Dynamisk rendering

Nyhetskortene bygges dynamisk med `document.createElement()` og template literals. Hvert kort viser kategori, publiseringsstatus, tittel, ingress, brødtekst og forfatternavn. Rediger/slett-knapper vises kun for innloggede brukere.

Forfatter-dropdownen populeres automatisk fra `/api/users` ved innlogging.

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

Den oppdaterte configen legger til:

- `POST /api/login` — autentiserer med e-post og passord mot brukere i databasen, returnerer `API_KEY` ved gyldig innlogging

Configen er bakoverkompatibel — eksisterende CRUD-operasjoner og autorisering med API-nøkkel fungerer som før.

Start deretter API-et:

```bash
npm start
```

API-et kjører nå på `http://localhost:3000`.

### 2. Åpne frontenden

Klon dette repositoryet og åpne `index.html` i nettleseren — enten direkte eller via en lokal utviklingsserver (f.eks. Live Server i VS Code).

```bash
git clone https://github.com/eskjelbred/GA_nyhetscrud_demo.git
cd GA_nyhetscrud_demo
```

### 3. Koble frontend til API

`BASE_URL` i `ts/script.ts` er satt til `http://localhost:3000/api` som standard. Oppdater denne om API-et kjører på en annen adresse.

## Filstruktur

```
nyhetscrud/
├── index.html                # Hovedside med nyhetsliste, innlogging og skjema
├── css/
│   └── style.css             # Styling med CSS custom properties og responsivt grid
├── ts/
│   └── script.ts             # TypeScript-kildekode
├── js/
│   └── script.js             # Kompilert JavaScript (output fra tsc)
├── tsconfig.json             # TypeScript-konfigurasjon
├── new_crudops_config/
│   └── index.js              # Oppdatert CrudOps-server med innloggingsendepunkt
└── README.md
```

## Teknisk oversikt

### TypeScript

Kildekoden er skrevet i TypeScript (`ts/script.ts`) og kompileres til JavaScript (`js/script.js`) med `tsc`. Konfigurasjonen i `tsconfig.json` bruker `ES2020` som target og inkluderer DOM-typene. Interfaces (`User`, `NewsArticle`, `NewsFormData`) brukes for å type-sjekke data fra API-et.

### `index.html`

Siden har tre hovedseksjoner i sidepanelet som vises/skjules basert på innloggingsstatus:

- **`#login-section`** — synlig når brukeren ikke er innlogget, med e-post/passord-skjema
- **`#form-section`** — synlig kun for innloggede brukere, med skjema for opprett/rediger
- **`#logout-btn`** — synlig i headeren kun for innloggede brukere

### `css/style.css`

Responsivt layout med CSS Grid (to kolonner på desktop, én på mobil). Bruker CSS custom properties for farger, og nesting for kort-varianter (publisert/kladd). Skjemaet er sticky på desktop.

### `ts/script.ts`

All applikasjonslogikk:

- **Autentisering** — `login()` sender `POST /api/login`, lagrer API-nøkkel i `localStorage`. `logout()` fjerner nøkkelen. `isLoggedIn()` sjekker om nøkkelen finnes.
- **Visningsstyring** — `showLoggedInView()` og `showReadOnlyView()` toggler synlighet på seksjoner og re-rendrer nyhetslisten med eller uten handlingsknapper.
- **CRUD** — asynkrone funksjoner med `fetch` og `async/await` for alle HTTP-metoder
- **Rendering** — `renderNews()` bygger nyhetskort og inkluderer rediger/slett-knapper kun dersom `isLoggedIn()` returnerer `true`
- **Init** — `init()` henter brukere og nyheter, og viser riktig visning basert på innloggingsstatus

### `new_crudops_config/index.js`

Oppdatert serverconfig for CrudOps som legger til et `POST /api/login`-endepunkt. Endepunktet sjekker e-post og passord mot brukerne i databasen og returnerer API-nøkkelen ved gyldig innlogging. Inkluderer også hjelpendepunkter for testing (`/api/status/:code`, `/api/delay/:ms`, `/api/reset`).
