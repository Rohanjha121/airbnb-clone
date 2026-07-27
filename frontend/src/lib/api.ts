import axios from "axios";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach a user ID to every outgoing request if one is stored in localStorage.
 * This supports the mock auth strategy (M9) — no JWT required.
 */
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const userId = localStorage.getItem("airbnb_user_id");
    if (userId) {
      config.headers["X-User-Id"] = userId;
    }
    return config;
  });
}

export default api;
