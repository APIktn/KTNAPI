import axios from "axios";
import { jwtDecode } from "jwt-decode";

let initialized = false;

function jwtInterceptor() {
  if (initialized) return;
  initialized = true;

  axios.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("auth-expired"));
        } else {
          req.headers = req.headers || {};
          req.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-expired"));
      }
    }

    return req;
  });

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-expired"));
      }
      return Promise.reject(err);
    }
  );
}

export default jwtInterceptor;
