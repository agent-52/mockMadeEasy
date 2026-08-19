import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    withCredentials: true
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config
        console.log("failed url:", originalRequest.url);
        if(error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh")){

            originalRequest._retry = true
            
            try {
                await apiClient.get("/api/auth/refresh")

                return apiClient(originalRequest)
            } catch (error) {
                window.location.href = "/auth"
            }
            
        }

        return Promise.reject(error)
    }
)
export {apiClient}