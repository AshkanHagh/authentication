import { Link, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth/Auth"
import MainLayout from "./components/layout/MainLayout"
import EmailVerification from "./pages/auth/EmailVerification"
import PrivateRoute from "./components/PrivateRoute"
import AuthLayout from "./components/layout/AuthLayout"

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col gap-5">
              <Link className="text-3xl" to="admin">
                admin
              </Link>
              <Link className="text-3xl" to="auth">
                Auth
              </Link>
            </div>
          }
        />

        <Route path="auth" element={<AuthLayout />}>
          <Route index element={<Auth />} />
          <Route path="verify/email" element={<EmailVerification />} />
        </Route>

        {/* Private Routes */}
        <Route path="admin" element={<PrivateRoute />}>
          <Route
            index
            element={<h1 className="text-4xl">Admin Dashboard</h1>}
          />
        </Route>

        <Route
          path="not-permission"
          element={<h1 className="text-3xl">not-permission</h1>}
        />
      </Routes>
    </MainLayout>
  )
}

export default App
