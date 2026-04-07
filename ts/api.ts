import type { User } from "./types.js";

export const BASE_URL = "http://localhost:3000/api";

export function getApiKey() {
  return localStorage.getItem("API_KEY");
}

export function isLoggedIn() {
  return getApiKey() !== null;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/users`);
  return response.json()
}

export function getUserName(users: User[],authorId: number): string {
  const user = users.find((u: User) => u.id === authorId);
  return user?.name ?? "Ukjent forfatter";
}