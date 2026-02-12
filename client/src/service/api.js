import axios from "axios";

const API_URL = import.meta.env.SERVER_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event("auth-expired"));
    }
    return Promise.reject(err);
  }
);

export default api;
