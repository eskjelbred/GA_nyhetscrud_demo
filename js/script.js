// ===================================
// KONFIGURASJON
// BASE_URL peker på crudops-serveren som kjører lokalt.
// Alle endepunkter er prefixet med /api — dette er definert i index.js.
//
// API_KEY trengs for alle skrive-operasjoner (POST, PUT, DELETE).
// Nøkkelen er satt i crudops/.env og sendes med i Authorization-headeren.
// ===================================

const BASE_URL = "http://localhost:3000/api";
const API_KEY = "abc";

// ===================================
// STATE
// Disse variablene holder midlertidig data
// mens siden er åpen i nettleseren.
// ===================================

let users = []; // Liste over alle brukere fra databasen
let editingId = null; // Hvis vi redigerer en sak, lagres ID-en her. Null = vi oppretter ny.

// ===================================
// HJELPEFUNKSJONER
// ===================================

// Finn brukernavnet basert på authorId
// (vi bruker dette for å vise "Jonas Berg" istedenfor bare tallet 2)
function getUserName(authorId) {
  const user = users.find((u) => u.id === authorId);
  return user ? user.name : "Ukjent forfatter";
}

// Nullstill skjemaet tilbake til "opprett ny"-modus
function resetForm() {
  document.getElementById("news-form").reset();
  document.getElementById("form-title").textContent = "Legg til nyhetssak";
  document.getElementById("submit-btn").textContent = "Publiser";
  editingId = null;
}

// ===================================
// HENTE DATA — GET
// fetch() sender en HTTP-forespørsel.
// Vi bruker async/await for å vente på svaret
// før vi gjør noe med dataene.
// ===================================

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  // .json() leser svaret og gjør om JSON-tekst til et JavaScript-objekt
  users = await response.json();
}

async function fetchNews() {
  const response = await fetch(`${BASE_URL}/news`);
  const news = await response.json();
  // Når vi har dataene, sender vi dem til renderNews() for å vise dem på siden
  renderNews(news);
}

// ===================================
// VISE DATA I DOM-EN — RENDER
// Denne funksjonen tar en liste med nyhetssaker
// og bygger HTML-kort for hver av dem.
// ===================================

function renderNews(newsList) {
  const container = document.getElementById("news-list");
  // Tøm listen før vi bygger den på nytt
  container.innerHTML = "";

  if (newsList.length === 0) {
    container.innerHTML = '<p class="empty-state">Ingen nyhetssaker å vise.</p>';
    return;
  }

  newsList.forEach((article) => {
    // Lag et <article>-element for hver sak
    const card = document.createElement("article");
    card.className = `news-card ${article.published ? "published" : "draft"}`;

    // innerHTML lar oss skrive HTML som en tekst-streng
    // Vi bruker template literals (backticks) for å flette inn verdier fra JS
    card.innerHTML = `
      <div class="card-header">
        <span class="category">${article.category}</span>
        <span class="status ${article.published ? "published" : "draft"}">
          ${article.published ? "Publisert" : "Kladd"}
        </span>
      </div>
      <h2>${article.title}</h2>
      <p class="summary">${article.summary}</p>
      <p class="body">${article.body}</p>
      <div class="card-footer">
        <span class="author">✍️ ${getUserName(article.authorId)}</span>
        <div class="actions">
          <button onclick="editNews(${article.id})" class="btn btn-edit">Rediger</button>
          <button onclick="deleteNews(${article.id})" class="btn btn-delete">Slett</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// ===================================
// OPPRETTE — POST
// Vi sender data til serveren med method: "POST".
// Content-Type forteller serveren at vi sender JSON.
// JSON.stringify() gjør om et JS-objekt til en JSON-streng.
// Authorization-headeren inneholder API-nøkkelen — uten den svarer
// serveren med 401 Unauthorized på alle skrive-operasjoner.
// NB: created og updated settes automatisk av serveren, ikke av oss.
// ===================================

async function createNews(data) {
  const response = await fetch(`${BASE_URL}/news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    // Hent og vis oppdatert liste
    await fetchNews();
    resetForm();
  }
}

// ===================================
// OPPDATERE — PUT
// PUT erstatter hele ressursen med ny data.
// Vi sender til /news/:id — altså spesifikk ID.
// updated settes automatisk av serveren via middleware.
// ===================================

async function updateNews(id, data) {
  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    await fetchNews();
    resetForm();
  }
}

// ===================================
// SLETTE — DELETE
// Vi sender en DELETE-forespørsel til /news/:id.
// confirm() viser en bekreftelsesdialog i nettleseren.
// ===================================

async function deleteNews(id) {
  const bekreftet = confirm("Er du sikker på at du vil slette denne saken?");
  if (!bekreftet) return; // Avbryt hvis brukeren trykker "Avbryt"

  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
    },
  });

  if (response.ok) {
    await fetchNews();
  }
}

// ===================================
// REDIGER — FYLL INN SKJEMA
// Henter én enkelt nyhetssak og fyller
// skjema-feltene med eksisterende verdier.
// ===================================

async function editNews(id) {
  // Hent den spesifikke saken fra serveren
  const response = await fetch(`${BASE_URL}/news/${id}`);
  const article = await response.json();

  // Fyll inn skjemaet med eksisterende data
  document.getElementById("title").value = article.title;
  document.getElementById("summary").value = article.summary;
  document.getElementById("body").value = article.body;
  document.getElementById("category").value = article.category;
  document.getElementById("authorId").value = article.authorId;
  document.getElementById("published").checked = article.published;

  // Bytt til redigeringsmodus
  editingId = id;
  document.getElementById("form-title").textContent = "Rediger nyhetssak";
  document.getElementById("submit-btn").textContent = "Lagre endringer";

  // Scroll ned til skjemaet (nyttig på mobil)
  document.getElementById("form-section").scrollIntoView({ behavior: "smooth" });
}

// ===================================
// SKJEMA — HÅNDTER INNSENDING
// Lytter på "submit"-hendelsen på skjemaet.
// e.preventDefault() stopper siden fra å laste på nytt.
// ===================================

document.getElementById("news-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Samle verdiene fra alle skjemafeltene
  const data = {
    title: document.getElementById("title").value,
    summary: document.getElementById("summary").value,
    body: document.getElementById("body").value,
    category: document.getElementById("category").value,
    // parseInt() gjør om tekst til tall — ID-er skal være numbers, ikke strings
    authorId: parseInt(document.getElementById("authorId").value),
    published: document.getElementById("published").checked,
    // Lag en URL-vennlig slug automatisk fra tittelen
    slug: document.getElementById("title").value.toLowerCase().replace(/\s+/g, "-"),
    tags: [],
    // NB: created og updated trenger vi ikke sette manuelt —
    // crudops-serveren håndterer disse automatisk via middleware
  };

  // Sjekk om vi er i redigerings- eller opprettelsesmodus
  if (editingId) {
    await updateNews(editingId, data);
  } else {
    await createNews(data);
  }
});

// Avbryt-knappen nullstiller skjemaet
document.getElementById("cancel-btn").addEventListener("click", resetForm);

// ===================================
// INIT — KJØRES VED OPPSTART
// Henter brukere og nyheter, og bygger opp
// forfatter-dropdownen dynamisk fra databasen.
// ===================================

async function init() {
  // Hent brukere først, siden vi trenger dem for å vise forfatternavn
  await fetchUsers();
  await fetchNews();

  // Bygg forfatter-dropdown basert på brukerne vi hentet
  const authorSelect = document.getElementById("authorId");
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    authorSelect.appendChild(option);
  });
}

// Kjør init() med en gang siden lastes
init();
