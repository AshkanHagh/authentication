import { Route, Routes } from "react-router-dom"
import Auth from "./features/auth/pages/Auth"

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
      <Route path="auth" element={<Auth />} />
    </Routes>
  )
}

export default App
