import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import Login from "./pages/login/login"
import Register from "./pages/register/register"
import Home from "./pages/home/home"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
