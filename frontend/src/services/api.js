/**
 * Centralized API service with token injection and 401 response handling.
 */

const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return "/api/v1";
  }
  let cleaned = envUrl.trim().replace(/\/+$/, "");

  // If protocol is missing (e.g. user entered domain.up.railway.app), prepend https://
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://") && !cleaned.startsWith("/")) {
    cleaned = `https://${cleaned}`;
  }

  if (!cleaned.endsWith("/api/v1")) {
    cleaned = `${cleaned}/api/v1`;
  }
  return cleaned;
};

const API_BASE = getApiBase();

let onUnauthorizedCallback = null;

export function setUnauthorizedHandler(callback) {
  onUnauthorizedCallback = callback;
}

async function request(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Handle expired or invalid token
  if (response.status === 401) {
    localStorage.removeItem("spendwise_token");
    if (typeof onUnauthorizedCallback === "function") {
      onUnauthorizedCallback();
    }
    throw new Error("Session expired. Please log in again.");
  }

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "string"
        ? body
        : body?.message || body?.error || "Request failed";
    throw new Error(message);
  }

  return body;
}

export const authApi = {
  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: data.email, password: data.password }),
    }),

  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const expenseApi = {
  getAll: (filters = {}, token) => {
    const params = new URLSearchParams();
    if (filters.startDate && filters.endDate) {
      params.set("startDate", filters.startDate);
      params.set("endDate", filters.endDate);
    }
    if (filters.sortBy) {
      params.set("sortBy", filters.sortBy);
    }

    const query = params.toString() ? `?${params}` : "";
    return request(`/expenses${query}`, { method: "GET" }, token);
  },

  getByCategory: (categoryName, token) => {
    return request(
      `/expenses/category?categoryName=${encodeURIComponent(categoryName.trim())}`,
      { method: "GET" },
      token
    );
  },

  search: (title, token) => {
    return request(
      `/expenses/search?title=${encodeURIComponent(title.trim())}`,
      { method: "GET" },
      token
    );
  },

  getCategoryTotals: (token) => {
    return request("/expenses/total/category", { method: "GET" }, token);
  },

  getMonthlyTotal: (month, year, token) => {
    return request(
      `/expenses/total/monthly?month=${month}&year=${year}`,
      { method: "GET" },
      token
    );
  },

  create: (payload, token) => {
    return request(
      "/expenses",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token
    );
  },

  update: (id, payload, token) => {
    return request(
      `/expenses/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      token
    );
  },

  delete: (id, token) => {
    return request(
      `/expenses/${id}`,
      {
        method: "DELETE",
      },
      token
    );
  },
};
