export const createAuthService = (api) => ({
    register: (data) =>
        api.post("/auth/register", {
            ...data,
            status: "register",
        }),

    login: (data) =>
        api.post("/auth/login", {
            username: data.username,
            password: data.password,
            status: "LoginUser",
        }),

    logout: () => api.post("/auth/logout"),
});
