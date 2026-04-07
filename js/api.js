export const BASE_URL = "http://localhost:3000/api";
export function getApiKey() {
    return localStorage.getItem("API_KEY");
}
export function isLoggedIn() {
    return getApiKey() !== null;
}
export async function fetchUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    return response.json();
}
export function getUserName(users, authorId) {
    const user = users.find((u) => u.id === authorId);
    return user?.name ?? "Ukjent forfatter";
}
