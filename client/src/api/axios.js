import axios from "axios";

// In dev, Vite proxies /api and /uploads to the backend (see vite.config.js),
// so we can just use relative paths. In production, set VITE_API_URL to the
// deployed backend's base URL (e.g. https://your-api.onrender.com).
const baseURL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL,
});

// Attach the JWT to every request, if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it out so the UI drops back to logged-out state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper to build a full URL for an uploaded image path like "/uploads/xyz.jpg"
export const assetUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${baseURL}${path}`;
};
