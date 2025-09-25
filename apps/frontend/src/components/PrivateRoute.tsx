import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../app/hook/useAppStore"

type PrivateRouteProps = {
  allowedRoles?: string[]
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const userDetail = useAppSelector((state) => state.auth.userDetail)
  const location = useLocation()

  // User Not Authenticated
  if (!userDetail) {
    sessionStorage.setItem("from", location.pathname)
    return <Navigate to="/auth" replace />
  }

  // User did not have The Required Role
  if (
    allowedRoles &&
    !userDetail.role.some((role) => allowedRoles.includes(role))
  )
    return <Navigate to="/not-permission" replace />

  return <Outlet />
}

export default PrivateRoute
