export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("jwt");

  // unificăm tot într-un singur obiect headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  // dacă tokenul e expirat sau invalid
  if (response.status === 401) {
    localStorage.removeItem("jwt");
    window.location.href = "/auth";
    throw new Error("JWT expired");
  }

  return response;
}

export const api = {
  get: (url: string, options?: RequestInit) =>
    apiFetch(url, { ...options, method: "GET" }),

  post: (url: string, body?: any, options?: RequestInit) =>
    apiFetch(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};
