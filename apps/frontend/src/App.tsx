import { Link, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth/Auth"
import MainLayout from "./components/layout/MainLayout"
import EmailVerification from "./pages/auth/EmailVerification"

function App() {
  return (
    <MainLayout>
      <Routes>

        <Route path="/" element={<Link to='/auth'>Home Page</Link>} />

        {/* Authentication Routes */}
        <Route path="auth">
          <Route index element={<Auth />} />
          <Route path="verify/email" element={<EmailVerification />} />
        </Route>
      </Routes>
    </MainLayout>
  )
}

export default App
