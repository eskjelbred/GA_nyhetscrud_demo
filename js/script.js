// TODO: Sett BASE_URL til riktig adresse.
// Hint: crudops kjører på port 3000, og alle endepunkter er under /api
const BASE_URL = "";

// TODO: Sett API_KEY til nøkkelen som ligger i crudops/.env
// Den trengs i Authorization-headeren for POST, PUT og DELETE
const API_KEY = "";

// TODO: Opprett en variabel for å lagre listen over brukere
// TODO: Opprett en variabel for å holde styr på hvilken sak vi redigerer (null = ingen)

// TODO: Skriv en funksjon getUserName(authorId)
// Den skal finne brukeren med riktig ID i users-listen
// og returnere navnet. Hint: Array.find()
function getUserName(authorId) {}

// TODO: Skriv en funksjon resetForm()
// Den skal:
// 1. Nullstille skjemaet (form.reset())
// 2. Sette form-tittelen tilbake til "Legg til nyhetssak"
// 3. Sette submit-knappen tilbake til "Publiser"
// 4. Nullstille editingId til null
function resetForm() {}

// TODO: Skriv en async funksjon fetchUsers()
// Den skal hente alle brukere fra /users og lagre dem i users-variabelen
async function fetchUsers() {}

// TODO: Skriv en async funksjon fetchNews()
// Den skal hente alle nyhetssaker fra /news
// og sende dem videre til renderNews()
async function fetchNews() {}

// TODO: Skriv en funksjon renderNews(newsList)
// Den skal:
// 1. Tømme #news-list
// 2. Vise en tom-melding hvis listen er tom
// 3. Loope gjennom nyhetssakene og lage et kort for hver
//
// Hvert kort bør vise:
// - Kategori og publiseringsstatus
// - Tittel og ingress
// - Forfatternavn (bruk getUserName)
// - Rediger- og Slett-knapper med onclick
function renderNews(newsList) {}

// TODO: Skriv en async funksjon createNews(data)
// Den skal sende en POST-forespørsel til /news med data som body
// Husk: method, headers (Content-Type: application/json + Authorization), body (JSON.stringify)
// NB: Du trenger ikke sende med created/updated — serveren setter disse automatisk
// Etter vellykket respons: hent nyheter på nytt og nullstill skjemaet
async function createNews(data) {}

// TODO: Skriv en async funksjon updateNews(id, data)
// Den skal sende en PUT-forespørsel til /news/:id
// Husk Authorization-headeren — uten den får du 401 tilbake
// Etter vellykket respons: hent nyheter på nytt og nullstill skjemaet
async function updateNews(id, data) {}

// TODO: Skriv en async funksjon deleteNews(id)
// Den skal:
// 1. Vise en bekreftelsesdialog med confirm()
// 2. Avbryte hvis brukeren trykker "Avbryt"
// 3. Sende en DELETE-forespørsel til /news/:id med Authorization-header
// 4. Hente nyheter på nytt etter sletting
async function deleteNews(id) {}

// TODO: Skriv en async funksjon editNews(id)
// Den skal:
// 1. Hente én nyhetssak fra /news/:id
// 2. Fylle inn alle skjemafeltene med eksisterende verdier
// 3. Sette editingId til den aktuelle ID-en
// 4. Oppdatere form-tittel og submit-knapp-tekst
async function editNews(id) {}

// TODO: Legg til en "submit"-lytter på #news-form
// Husk e.preventDefault() for å stoppe siden fra å laste på nytt
//
// Skjemaet skal samle verdier fra alle feltene og sende
// dem som et objekt til enten createNews() eller updateNews()
// (avhengig av om editingId er satt)

// TODO: Legg til en "click"-lytter på #cancel-btn som kaller resetForm()

// TODO: Skriv en async funksjon init()
// Den skal:
// 1. Kalle fetchUsers()
// 2. Kalle fetchNews()
// 3. Bygge opp forfatter-dropdownen (#authorId) dynamisk
//    basert på brukerne som ble hentet
async function init() {}

// Kjør init() med en gang siden lastes
init();
