import { useState } from "react"
import { loginUser, registerUser } from "../services/api"
import "./LoginPage.css"

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response =
        mode === "login"
          ? await loginUser(email, password)
          : await registerUser(username, email, password)

      onLogin(response.data.user, response.data.token)
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-kicker">Mood Tracker</p>

        <h1>{mode === "login" ? "Welcome back" : "Create account"}</h1>

        <p className="login-subtitle">
          {mode === "login"
            ? "Log in to track your moods, journal entries and coping skills."
            : "Create an account to save your personal mood journey."}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === "register" && (
            <div className="login-group">
              <label>Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          )}

          <div className="login-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>

        <button
          type="button"
          className="switch-mode-btn"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login")
            setError("")
          }}
        >
          {mode === "login"
            ? "No account yet? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  )
}