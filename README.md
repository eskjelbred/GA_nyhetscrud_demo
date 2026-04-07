# NyhetsCRUD

En demo-applikasjon som viser CRUD-operasjoner (Create, Read, Update, Delete) mot et REST-API, bygget med vanilla HTML, CSS og JavaScript. Prosjektet brukes i undervisning i operasjonell frontendutvikling ved Gokstad Akademiet.

## Om prosjektet

NyhetsCRUD er en enkel nyhetsportal der man kan opprette, lese, redigere og slette nyhetssaker. Frontenden kommuniserer med [CrudOps](https://github.com/vegarcodes/crudops) — et JSON-basert API som kjører lokalt.
`main`-branchen inneholder utgangspunktet med ferdig HTML/CSS og en `script.js` full av TODO-oppgaver. Etterhvert som vi jobber oss gjennom stoffet i undervisningen, vil nye brancher vise frem løsningene steg for steg.

## Brancher


| Branch                         | Beskrivelse                                      |
| ------------------------------ | ------------------------------------------------ |
| `main`                         | Startpunkt med HTML, CSS og TODO-er i JavaScript |
| `Intro-CRUD-(uten-innlogging)` | Grunnleggende CRUD uten autentisering            |
| `Med-innlogging`               | Utvidet med innlogging og brukerhåndtering       |
| `Med-URL-search-params`        | Navigasjon til enkeltartikler via URL-parametre  |


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

Kopier JSON-templaten fra dette prosjektet inn i CrudOps sin `templates/`-mappe:

```bash
cp <sti-til-nyhetscrud>/JSON-template/news.json <sti-til-crudops>/templates/news.json
```

Lag deretter en `.env`-fil basert på `.env.example` og sett:

- `TEMPLATE=news.json`
- `API_KEY` — en selvvalgt nøkkel (bare bokstaver og tall, ingen mellomrom)

Start API-et:

```bash
npm start
```

API-et kjører nå på `http://localhost:3000`.

### 2. Åpne frontenden

Klon dette repositoryet og åpne `index.html` i nettleseren — enten direkte eller via en lokal utviklingsserver (f.eks. Live Server i VS Code).

```bash
git clone <repo-url>
cd nyhetscrud
```

### 3. Koble frontend til API

Åpne `js/script.js` og fyll inn:

- `BASE_URL` — adressen til CrudOps-API-et (f.eks. `http://localhost:3000/api`)
- `API_KEY` — nøkkelen du satte i CrudOps sin `.env`-fil

## Filstruktur

```
nyhetscrud/
├── index.html       # Hovedside med skjema og nyhetsliste
├── css/
│   └── style.css    # Styling for hele applikasjonen
├── js/
│   └── script.js         # JavaScript med TODO-oppgaver
├── JSON-template/
│   └── news.json         # Datamal for CrudOps — kopieres til templates/-mappen i API-et
└── README.md
```

## Oppgaver

`js/script.js` inneholder en rekke TODO-er som dekker:

- Henting av data med `fetch` (GET)
- Oppretting av nyhetssaker (POST)
- Oppdatering av eksisterende saker (PUT)
- Sletting av saker (DELETE)
- Dynamisk rendering av DOM-elementer
- Skjemahåndtering og validering

