import api from "./api";

export const createVault = async (formData) => {
    const response = await api.post(
        "/vault",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getVaults = async () => {
    const response = await api.get("/vault");
    return response.data;
};

export const getVaultById = async (id) => {
    const response = await api.get(`/vault/${id}`);
    return response.data;
};

export const deleteVault = async (id) => {
    const response = await api.delete(`/vault/${id}`);
    return response.data;
};