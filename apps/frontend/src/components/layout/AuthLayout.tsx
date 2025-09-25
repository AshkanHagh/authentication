import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "../../app/hook/useAppStore"

const AuthLayout = () => {
  const userDetail = useAppSelector((state) => state.auth.userDetail)
  const from: string = sessionStorage.getItem("from") || "/"

  if (userDetail) return <Navigate to={from} replace />

  return <Outlet />
}

export default AuthLayout
