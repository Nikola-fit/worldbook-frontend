import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor — dodaje JWT ────────────────────────────────────────
http.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// ─── Response interceptor — auto refresh ─────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

http.interceptors.response.use(
  // Uspješan response — propusti dalje
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Ako nije 401 ili je već pokušano — vrati grešku
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Ako je refresh endpoint sam vratio 401 — logout
    if (originalRequest.url?.includes("/user/api/token/refresh/")) {
      logout();
      return Promise.reject(error);
    }

    // Ako je već u toku refresh — stavi request u red čekanja
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return http(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Pokušaj refresh
    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/api/token/refresh/`,
        { refresh: refreshToken },
      );

      // Sačuvaj novi access token
      localStorage.setItem("access_token", data.access);

      // Ako backend rotira refresh token, sačuvaj i njega
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }

      // Ažuriraj header i propusti red čekanja
      http.defaults.headers.common.Authorization = `Bearer ${data.access}`;
      processQueue(null, data.access);

      // Ponovi originalni request
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── Logout helper ────────────────────────────────────────────────────────────
function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // Redirect na home
  window.location.href = "/";
}
