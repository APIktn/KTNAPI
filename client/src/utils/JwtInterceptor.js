import axios from "axios";
import { jwtDecode } from "jwt-decode";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("auth-expired"));
        } else {
          req.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        localStorage.removeItem("token");
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
        window.dispatchEvent(new Event("auth-expired"));
      }
      return Promise.reject(err);
    }
  );
}


export default jwtInterceptor;
