import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import JournalPage from "./pages/JournalPage"
import SkillsPage from "./pages/SkillsPage"
import LoginPage from "./pages/LoginPage"
import Header from "./components/Header"
import CalendarPage from "./pages/CalendarPage"
import "./App.css"

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <BrowserRouter>
      <div className="app">
        {user && <Header user={user} onLogout={handleLogout} />}

        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/journal"
              element={
                <ProtectedRoute user={user}>
                  <JournalPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/skills"
              element={
                <ProtectedRoute user={user}>
                  <SkillsPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute user={user}>
                  <CalendarPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}