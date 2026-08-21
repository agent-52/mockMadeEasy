import { apiClient } from "./apiClient"

export const loginUser = async (payload:{email:string, password:string}) => {
    const response = await apiClient.post("/api/auth/login", payload)
    return response
}


export const signupUser = async (payload:{name: string, email:string, password:string}) => {
    const response = await apiClient.post("/api/auth/signup", payload)
    return response
}

export const logoutUser = async() => {
    const response = await apiClient.post("/api/auth/logout")
}

export const googleLogin = async () => {
    const response = await apiClient.get("/api/auth/google")
}