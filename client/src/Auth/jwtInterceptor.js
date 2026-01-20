import axios from "axios";
import { jwtDecode } from "jwt-decode";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    const userToken = window.localStorage.getItem("token");
    const adminToken = window.localStorage.getItem("admin-token");
    const technicianToken = window.localStorage.getItem("technician-token");

    let token = userToken || adminToken || technicianToken;

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("admin-token");
        window.localStorage.removeItem("technician-token");
        alert("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        window.location.replace("/login");
      } else {
        req.headers.Authorization = `Bearer ${token}`;
      }
    }

    return req;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("admin-token");
        window.localStorage.removeItem("technician-token");
        alert("เซสชั่นหมดอายุ กรุณาเข้าสู่ระบบใหม่");
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;
