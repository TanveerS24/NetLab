import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"

import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Home from "./pages/home/Home"

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
