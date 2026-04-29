import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerUser } from "../services/api"
import "./AuthPage.css"

export default function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await registerUser(
        formData.username,
        formData.email,
        formData.password
      )

      // nach erfolgreicher Registrierung → Login Seite
      navigate("/login")

    } catch (err) {
      if (err.response?.status === 409) {
        setError("E-Mail bereits vergeben.")
      } else {
        setError("Registrierung fehlgeschlagen.")
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Register</h1>
        <p className="auth-subtitle">Create your account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          
          {error && <div className="auth-error">{error}</div>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}