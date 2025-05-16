import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

const ProtectedRoute = () => {
  const { isAuthenticated, tokenExpired } = useSelector((state: RootState) => state.auth)
  const location = useLocation()
  const user_control = JSON.parse(sessionStorage.getItem("user") || "{}")
  if (!isAuthenticated || tokenExpired) {
    return <Navigate to={user_control.role === "client" ? "/client-login" : "/login"} state={{ from: location }} replace />
  }
  console.log(user_control.role,'561454',location.pathname)
  return <Outlet />
}

export default ProtectedRoute