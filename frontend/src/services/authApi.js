import api from "./api";

export const googleLogin = async (idToken) => {
    const response = await api.post("/auth/google", {
        idToken,
    });

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/user/me");
    return response.data;
};

export const refreshToken = async () => {
    const response = await api.post("/auth/refresh");

    return response.data;
};

export const logout = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};