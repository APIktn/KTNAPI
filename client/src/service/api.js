import axios from "axios";

const API_URL = import.meta.env.SERVER_URL;

const api = axios.create({
    baseURL: API_URL,
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
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (
            err.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            try {
                const refreshApi = axios.create({
                    baseURL: API_URL,
                    withCredentials: true,
                });

                const res = await refreshApi.post("/auth/refresh");

                const newToken = res.data.token;

                localStorage.setItem("token", newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return api(originalRequest);

            } catch (refreshErr) {
                localStorage.removeItem("token");
                window.dispatchEvent(new Event("auth-expired"));
            }
        }

        return Promise.reject(err);
    }
);

export default api;
