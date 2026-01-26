import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import './Admin.css'

const ADMIN_PASSWORD = 'qualfm2026'

function Admin() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const auth = sessionStorage.getItem('qualfm_admin')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('qualfm_admin', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('qualfm_admin')
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <h1>Project Documentation</h1>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
        <iframe
          src="/admin-docs/index.html"
          className="docs-iframe"
          title="Project Documentation"
        />
      </div>
    )
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-icon">
          <Lock size={32} strokeWidth={1.5} />
        </div>
        <h1>Admin Access</h1>
        <p>Enter password to access project documentation</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {error && <span className="error-msg">{error}</span>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Admin
