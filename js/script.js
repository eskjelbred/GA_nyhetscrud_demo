import { BASE_URL, isLoggedIn, getApiKey, getUserName, fetchUsers } from "./api.js";
let users = await fetchUsers();
let editingId = null;
// --- LOGIN / LOGOUT ---
async function login(email, password) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok)
        return false;
    const data = await response.json();
    localStorage.setItem("API_KEY", data.API_KEY);
    return true;
}
function logout() {
    localStorage.removeItem("API_KEY");
    showReadOnlyView();
}
// --- VIEWS ---
function showLoggedInView() {
    const loginSection = document.getElementById("login-section");
    const formSection = document.getElementById("form-section");
    const logoutBtn = document.getElementById("logout-btn");
    if (loginSection)
        loginSection.style.display = "none";
    if (formSection)
        formSection.style.display = "block";
    if (logoutBtn)
        logoutBtn.style.display = "block";
    fetchNews(); // render på nytt med rediger/slett-knapper
}
function showReadOnlyView() {
    const loginSection = document.getElementById("login-section");
    const formSection = document.getElementById("form-section");
    const logoutBtn = document.getElementById("logout-btn");
    if (loginSection)
        loginSection.style.display = "block";
    if (formSection)
        formSection.style.display = "none";
    if (logoutBtn)
        logoutBtn.style.display = "none";
    fetchNews(); // render på nytt uten rediger/slett-knapper
}
// --- HJELPEFUNKSJONER ---
function resetForm() {
    const form = document.getElementById("news-form");
    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");
    form?.reset();
    if (formTitle)
        formTitle.textContent = "Legg til nyhetssak";
    if (submitBtn)
        submitBtn.textContent = "Publiser";
    editingId = null;
}
// --- FETCH ---
async function fetchNews() {
    const response = await fetch(`${BASE_URL}/news`);
    const news = await response.json();
    renderNews(news);
}
// --- RENDER ---
function renderNews(newsList) {
    const container = document.getElementById("news-list");
    if (!container)
        return;
    container.innerHTML = "";
    if (newsList.length === 0) {
        container.innerHTML = `<p class="empty-state">Ingen nyhetssaker å vise.</p>`;
        return;
    }
    newsList.forEach((article) => {
        const card = document.createElement("article");
        card.className = `news-card ${article.published ? "published" : "draft"}`;
        // Knapper vises kun når brukeren er logget inn
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
      <h2> <a href="article.html?id=${article.id}" class="article-link"> ${article.title} </a>  </h2>
      <p class="summary">${article.summary}</p>
      <p class="body">${article.body}</p>
      <div class="card-footer">
        <span class="author">✍️ ${getUserName(users, article.authorId)}</span>
        ${actions}
      </div>
    `;
        container.appendChild(card);
    });
}
// --- CRUD ---
async function createNews(data) {
    const response = await fetch(`${BASE_URL}/news`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        await fetchNews();
        resetForm();
    }
    else {
        alert("Noe gikk galt...");
    }
}
async function updateNews(id, data) {
    const response = await fetch(`${BASE_URL}/news/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify(data),
    });
    if (response.ok) {
        await fetchNews();
        resetForm();
    }
    else {
        alert("Noe gikk galt...");
    }
}
async function deleteNews(id) {
    const confirmed = confirm("Er du sikker på at du vil slette denne saken?");
    if (!confirmed)
        return;
    const response = await fetch(`${BASE_URL}/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getApiKey()}` },
    });
    if (response.ok) {
        await fetchNews();
    }
}
async function editNews(id) {
    const response = await fetch(`${BASE_URL}/news/${id}`);
    const article = await response.json();
    const titleEl = document.getElementById("title");
    const summaryEl = document.getElementById("summary");
    const bodyEl = document.getElementById("body");
    const categoryEl = document.getElementById("category");
    const authorIdEl = document.getElementById("authorId");
    const publishedEl = document.getElementById("published");
    const formTitleEl = document.getElementById("form-title");
    const submitBtnEl = document.getElementById("submit-btn");
    if (titleEl)
        titleEl.value = article.title;
    if (summaryEl)
        summaryEl.value = article.summary;
    if (bodyEl)
        bodyEl.value = article.body;
    if (categoryEl)
        categoryEl.value = article.category;
    if (authorIdEl)
        authorIdEl.value = String(article.authorId);
    if (publishedEl)
        publishedEl.checked = article.published;
    if (formTitleEl)
        formTitleEl.textContent = "Rediger nyhetssak";
    if (submitBtnEl)
        submitBtnEl.textContent = "Lagre endringer";
    editingId = id;
}
// --- EVENT LISTENERS ---
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
        }
        else if (errorEl) {
            errorEl.style.display = "block";
            errorEl.textContent = "Feil e-post eller passord.";
        }
    });
}
const newsForm = document.getElementById("news-form");
if (newsForm) {
    newsForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById("title").value,
            summary: document.getElementById("summary").value,
            body: document.getElementById("body").value,
            category: document.getElementById("category")
                .value,
            authorId: parseInt(document.getElementById("authorId").value),
            published: document.getElementById("published")
                .checked,
        };
        console.log(data);
        if (editingId) {
            await updateNews(editingId, data);
        }
        else {
            await createNews(data);
        }
    });
}
const cancelBtn = document.getElementById("cancel-btn");
const logoutBtn = document.getElementById("logout-btn");
if (cancelBtn)
    cancelBtn.addEventListener("click", resetForm);
if (logoutBtn)
    logoutBtn.addEventListener("click", logout);
// --- INIT ---
function populateAuthorSelect() {
    const authorSelect = document.getElementById("authorId");
    if (!(authorSelect instanceof HTMLSelectElement))
        return;
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
    }
    else {
        showReadOnlyView();
    }
}
init();
