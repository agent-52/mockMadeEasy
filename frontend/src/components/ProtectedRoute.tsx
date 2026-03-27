import { Navigate, useLocation } from "react-router"
import { authStore } from "../store/auth.store"

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

    const location = useLocation()

    const isAuthenticated = authStore((s:any) => s.isAuthenticated)
    const isCheckingAuth = authStore((s:any) => s.isCechingAuth)

    if(isCheckingAuth){
        return null
    }
    if(!isAuthenticated){
        return <Navigate to={"/auth"} state={{from: location}} replace />
    }

    return children

}