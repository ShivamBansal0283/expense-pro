const API_URL = import.meta.env.VITE_API_URL ?? "";
const getAuthHeader = () => {
  // Prefer runtime-stored token in localStorage over build-time env token
  const token = localStorage.getItem("api_token") || import.meta.env.VITE_API_TOKEN || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(email: string, password: string, name?: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  return res.json();
}

export async function getExpenses() {
  const headers = { ...(getAuthHeader() as Record<string,string>) };
  const res = await fetch(`${API_URL}/api/expenses`, { headers });
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function getCategories() {
  const headers = { ...(getAuthHeader() as Record<string,string>) };
  const res = await fetch(`${API_URL}/api/categories`, { headers });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createCategory(name: string) {
  const headers = { "Content-Type": "application/json", ...(getAuthHeader() as Record<string,string>) };
  const res = await fetch(`${API_URL}/api/categories`, { method: "POST", headers, body: JSON.stringify({ name }) });
  return res.json();
}

export async function createExpense(payload: { amount: number; description?: string; date: string; categoryId?: string }) {
  const headers = { "Content-Type": "application/json", ...(getAuthHeader() as Record<string,string>) };
  const res = await fetch(`${API_URL}/api/expenses`, { method: "POST", headers, body: JSON.stringify(payload) });
  return res.json();
}
