import { create } from "zustand";

export const authStore = create((set) => ({
    isAuthenticated: false,
    isCheckingAuth:true,

    setIsChecking:(value:boolean) => set({isCheckingAuth: value}),

    setIsAuthenticated: (value:boolean) => set({isAuthenticated:value}),

    logout: () => set({isAuthenticated:false})

}))