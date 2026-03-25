import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/dashboard" className="header-logo">
          🎭 Mood Tracker
        </Link>
        
        <nav className="header-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/skills">Skills</Link>
        </nav>

        <div className="header-user">
          <span className="user-name">{user?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
