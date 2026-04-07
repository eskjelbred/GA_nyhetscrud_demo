import { BASE_URL, fetchUsers, getUserName } from "./api.js";
import { NewsArticle, User } from "./types.js";

const params = new URLSearchParams(window.location.search);
const articleId = params.get("id");

async function fetchArticle(id: string): Promise<NewsArticle> {
  const response = await fetch(`${BASE_URL}/news/${id}`);
  if (!response.ok) throw new Error("Artikkel ikke funnet");
  return response.json();
}

function renderArticle(article: NewsArticle, users: User[]): void {
  document.getElementById("article-container")!.innerHTML = `
    <article class="article-card">
      <div class="article-meta">
        <span class="category">${article.category}</span>
        <span class="status ${article.published ? "published" : "draft"}">
          ${article.published ? "Publisert" : "Kladd"}
        </span>
      </div>
      <h2 class="article-title">${article.title}</h2>
      <p class="article-summary">${article.summary}</p>
      <div class="article-body">${article.body}</div>
      <div class="article-footer">
        <span>✍️ ${getUserName(users, article.authorId)}</span>
        <span>ID: ${article.id}</span>
      </div>
    </article>
  `;
}

function renderError(message: string): void {
  document.getElementById("article-container")!.innerHTML = `
    <div class="error-state">
        <h2>Noe gikk galt</h2>
        <p>${message}</p>
    </div>
    `;
}

if (!articleId) {
  renderError(
    "Ingen artikkel-ID oppgitt i URL-en. Legg til <code>?id=1</code>.",
  );
} else {
  try {
    const [article, users] = await Promise.all([
      fetchArticle(articleId),
      fetchUsers(),
    ]);
    renderArticle(article, users);
  } catch (error) {
        renderError("Fant ikke artikkelen. Den kan ha blitt slettet, eller ID-en er feil.");
  }

}
