interface User {
  id: number;
  name: string;
}

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  body: string;
  category: string;
  authorId: number;
  published: boolean;
}

interface NewsFormData {
  title: string;
  summary: string;
  body: string;
  category: string;
  authorId: number;
  published: boolean;
}

const BASE_URL = "http://localhost:3000/api";

const API_KEY = getApiKey();

let users: User[] = [];

let editingId: number | null = null;

function getApiKey() {
  return localStorage.getItem("API_KEY");
}

function isLoggedIn() {
  return getApiKey() !== null;
}

function logout() {
  localStorage.removeItem("API_KEY");
  showReadOnlyView();
}

async function login(email: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) return false;

  const data = await response.json();
  localStorage.setItem("API_KEY", data.API_KEY);
  return true;
}

function getUserName(authorId: number) {
  const user = users.find((u: User) => u.id === authorId);
  return user ? user.name : "Ukjent forfatter";
}

function showLoggedInView() {
  const loginSection = document.getElementById("login-section");
  const formSection = document.getElementById("form-section");
  const logoutBtn = document.getElementById("logout-btn");
  if (loginSection) loginSection.style.display = "none";
  if (formSection) formSection.style.display = "block";
  if (logoutBtn) logoutBtn.style.display = "block";
  fetchNews(); // render på nytt med rediger/slett-knapper
}

function showReadOnlyView() {
  const loginSection = document.getElementById("login-section");
  const formSection = document.getElementById("form-section");
  const logoutBtn = document.getElementById("logout-btn");
  if (loginSection) loginSection.style.display = "block";
  if (formSection) formSection.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "none";
  fetchNews(); // render på nytt uten rediger/slett-knapper
}

function resetForm() {
  const form = document.getElementById("news-form") as HTMLFormElement | null;
  const formTitle = document.getElementById(
    "form-title",
  ) as HTMLHeadingElement | null;
  const submitBtn = document.getElementById(
    "submit-btn",
  ) as HTMLButtonElement | null;
  form?.reset();
  if (formTitle) formTitle.textContent = "Legg til nyhetssak";
  if (submitBtn) submitBtn.textContent = "Publiser";
  editingId = null;
}

async function fetchUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  users = await response.json();
}

async function fetchNews() {
  const response = await fetch(`${BASE_URL}/news`);
  const news = await response.json();

  renderNews(news);
}

function renderNews(newsList: NewsArticle[]) {
  const container = document.getElementById("news-list") as HTMLDivElement;
  if (!container) return;
  container.innerHTML = "";

  if (newsList.length === 0) {
    container.innerHTML = `<p class="empty-state">Ingen nyhetssaker å vise.</p>`;
    return;
  }

  newsList.forEach((article) => {
    const card = document.createElement("article");
    card.className = `news-card ${article.published ? "published" : "draft"}`;

    const actions = isLoggedIn()
      ? `<div class="actions">
          <button onclick="editNews(${article.id})" class="btn btn-edit">Rediger</button>
          <button onclick="deleteNews(${article.id})" class="btn btn-delete">Slett</button>
        </div>`
      : "";

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
                ${actions}
            </div>
        `;

    container.appendChild(card);
  });
}

async function createNews(data: NewsFormData) {
  const response = await fetch(`${BASE_URL}/news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    await fetchNews();
    resetForm();
  } else {
    alert("Noe gikk galt...");
  }
}

async function updateNews(id: number, data: NewsFormData) {
  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    await fetchNews();
    resetForm();
  } else {
    alert("Noe gikk galt...");
  }
}

async function deleteNews(id: number) {
  const confirmed = confirm("Er du sikker på at du vil slette denne saken?");
  if (!confirmed) return;

  const response = await fetch(`${BASE_URL}/news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (response.ok) {
    await fetchNews();
  }
}

async function editNews(id: number) {
  // Hent  den spesifikke saken fra serveren
  const response = await fetch(`${BASE_URL}/news/${id}`);
  const article = await response.json();

  // Fyll inn skjemaet med eksisterende data

  const titleEl = document.getElementById("title") as HTMLInputElement | null;
  const summaryEl = document.getElementById(
    "summary",
  ) as HTMLInputElement | null;
  const bodyEl = document.getElementById("body") as HTMLTextAreaElement | null;
  const categoryEl = document.getElementById(
    "category",
  ) as HTMLSelectElement | null;
  const authorIdEl = document.getElementById(
    "authorId",
  ) as HTMLSelectElement | null;
  const publishedEl = document.getElementById(
    "published",
  ) as HTMLInputElement | null;
  const formTitleEl = document.getElementById(
    "form-title",
  ) as HTMLHeadingElement;
  const submitBtnEl = document.getElementById(
    "submit-btn",
  ) as HTMLButtonElement;

  if (titleEl) titleEl.value = article.title;
  if (summaryEl) summaryEl.value = article.summary;
  if (bodyEl) bodyEl.value = article.body;
  if (categoryEl) categoryEl.value = article.category;
  if (authorIdEl) authorIdEl.value = article.authorId;
  if (publishedEl) publishedEl.checked = article.published;
  if (formTitleEl) formTitleEl.textContent = "Rediger nyhetssak";
  if (submitBtnEl) submitBtnEl.textContent = "Lagre endringer";

  editingId = id;
}

const loginForm = document.getElementById("login-form");
if (loginForm instanceof HTMLFormElement) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailEl = document.getElementById("login-email");
    const passwordEl = document.getElementById("login-password");
    const errorEl = document.getElementById("login-error");
    const email = emailEl instanceof HTMLInputElement ? emailEl.value : "";
    const password = passwordEl instanceof HTMLInputElement ? passwordEl.value : "";

    const success = await login(email, password);

    if (success && errorEl) {
      errorEl.style.display = "none";
      populateAuthorSelect();
      showLoggedInView();
    } else if (errorEl) {
      errorEl.style.display = "block";
      errorEl.textContent = "Feil e-post eller passord.";
    }
  });
}

const newsForm = document.getElementById("news-form") as HTMLFormElement | null;
if (newsForm) {
  newsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      title: (document.getElementById("title") as HTMLInputElement).value,
      summary: (document.getElementById("summary") as HTMLInputElement).value,
      body: (document.getElementById("body") as HTMLTextAreaElement).value,
      category: (document.getElementById("category") as HTMLSelectElement)
        .value,
      authorId: parseInt(
        (document.getElementById("authorId") as HTMLSelectElement).value,
      ),
      published: (document.getElementById("published") as HTMLInputElement)
        .checked,
    };

    console.log(data);

    if (editingId) {
      await updateNews(editingId, data);
    } else {
      await createNews(data);
    }
  });
}

const cancelBtn = document.getElementById("cancel-btn") as HTMLButtonElement;
if (cancelBtn) cancelBtn.addEventListener("click", resetForm);
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);


function populateAuthorSelect() {
  const authorSelect = document.getElementById("authorId") as HTMLSelectElement;
  if (!authorSelect) return;

  authorSelect.innerHTML = "";
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = String(user.id);
    option.textContent = user.name;
    authorSelect.appendChild(option);
  });
}

async function init() {
  await fetchUsers();
  await fetchNews();

  if (isLoggedIn()) {
    populateAuthorSelect();
    showLoggedInView();
  } else {
    showReadOnlyView();
  }
}

init();
