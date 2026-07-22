import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ) {

            originalRequest._retry = true;

            if (isRefreshing) {

                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                    });
                }).then(() => api(originalRequest));

            }

            isRefreshing = true;

            try {

                await api.post("/auth/refresh");

                processQueue();

                return api(originalRequest);

            } catch (err) {

                processQueue(err);

                return Promise.reject(err);

            } finally {

                isRefreshing = false;

            }

        }

        return Promise.reject(error);

    }
);

export default api;