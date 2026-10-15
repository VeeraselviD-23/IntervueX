import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("intervuexToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// Files are served by Express outside the /api prefix. Keeping this here makes
// resume links work for both local development and deployed environments.
export const assetUrl = (path = "") => {
  if (!path || /^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL.replace(/\/api$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
};
