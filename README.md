# NyhetsCRUD

En demo-applikasjon som viser CRUD-operasjoner (Create, Read, Update, Delete) mot et REST-API, bygget med vanilla HTML, CSS og JavaScript. Prosjektet brukes i undervisning i operasjonell frontendutvikling ved Gokstad Akademiet.

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


Applikasjonen implementerer full CRUD mot CrudOps-API-et:


| Operasjon          | HTTP-metode | Endepunkt       | Beskrivelse                                      |
| ------------------ | ----------- | --------------- | ------------------------------------------------ |
| Hent alle nyheter  | `GET`       | `/api/news`     | Lister alle nyhetssaker                          |
| Hent alle brukere  | `GET`       | `/api/users`    | Brukes til forfatter-dropdown og visning av navn |
| Opprett nyhetssak  | `POST`      | `/api/news`     | Sender JSON-data med `Authorization`-header      |
| Oppdater nyhetssak | `PUT`       | `/api/news/:id` | Erstatter en eksisterende sak                    |
| Slett nyhetssak    | `DELETE`    | `/api/news/:id` | Sletter etter bekreftelse med `confirm()`        |


Skrive-operasjoner (POST, PUT, DELETE) krever en API-nøkkel som sendes med i `Authorization`-headeren. Feltene `created` og `updated` settes automatisk av serveren.

### Skjemahåndtering

Skjemaet fungerer i to moduser:

- **Opprett** — standardmodus, sender `POST` til `/api/news`
- **Rediger** — aktiveres ved klikk på "Rediger", henter eksisterende data med `GET /api/news/:id`, fyller inn skjemaet, og sender `PUT` ved innsending

Avbryt-knappen nullstiller skjemaet tilbake til opprettelsesmodus.

### Dynamisk rendering

Nyhetskortene bygges dynamisk i JavaScript med `document.createElement()` og template literals. Hvert kort viser kategori, publiseringsstatus (publisert/kladd), tittel, ingress, brødtekst, forfatternavn og handlingsknapper.

Forfatter-dropdownen i skjemaet populeres automatisk fra `/api/users` ved oppstart.

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

Lag en `.env`-fil basert på `.env.example` og fyll inn `TEMPLATE` og `API_KEY`. Start deretter API-et:

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

Åpne `js/script.js` og oppdater de to konstantene øverst i filen:

- `BASE_URL` — adressen til CrudOps-API-et (standard: `http://localhost:3000/api`)
- `API_KEY` — nøkkelen du satte i CrudOps sin `.env`-fil

## Filstruktur

```
nyhetscrud/
├── index.html       # Hovedside med skjema og nyhetsliste
├── css/
│   └── style.css    # Styling for hele applikasjonen
├── js/
│   └── script.js    # All JavaScript — fetch, DOM-rendering og skjemalogikk
└── README.md
```

## Teknisk oversikt

### `index.html`

Statisk side med to hovedseksjoner: en nyhetsliste (`#news-list`) og et skjema (`#news-form`) for opprettelse og redigering. Skjemaet inneholder felter for tittel, ingress, brødtekst, kategori, forfatter og publiseringsstatus.

### `css/style.css`

Responsivt layout med CSS Grid (to kolonner på desktop, én på mobil). Bruker CSS custom properties for farger, og nesting for kort-varianter (publisert/kladd). Skjemaet er sticky på desktop.

### `js/script.js`

All applikasjonslogikk samlet i én fil:

- **Konfigurasjon** — `BASE_URL` og `API_KEY` for API-tilkobling
- **State** — `users`-array og `editingId` for å holde styr på redigeringsmodus
- **Hjelpefunksjoner** — `getUserName()` slår opp forfatternavn, `resetForm()` nullstiller skjemaet
- **API-kall** — asynkrone funksjoner med `fetch` og `async/await` for GET, POST, PUT og DELETE
- **Rendering** — `renderNews()` bygger nyhetskort dynamisk med `createElement` og `innerHTML`
- **Skjemahåndtering** — event listener på `submit` som skiller mellom opprett og oppdater basert på `editingId`
- **Init** — `init()` henter brukere og nyheter, og bygger opp forfatter-dropdownen ved sidelast

