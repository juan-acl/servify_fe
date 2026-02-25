import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const message =
      error.response?.data?.message || "Error de conexión con el servidor";

    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(new Error(message));
  },
);
