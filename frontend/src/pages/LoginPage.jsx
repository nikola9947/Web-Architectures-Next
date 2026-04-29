import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'
import './AuthPage.css'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await loginUser(email, password)
      onLogin(res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login fehlgeschlagen.')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Einloggen</button>

        <p>
          Noch keinen Account? <Link to="/register">Registrieren</Link>
        </p>
      </form>
    </div>
  )
}