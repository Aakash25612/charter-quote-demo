import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { currentUser, login, loginAs } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('broker@aether.demo')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')

  if (currentUser) return <Navigate to="/dashboard" replace />

  function onSubmit(e) {
    e.preventDefault()
    const result = login(email.trim(), password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand-inline" style={{ color: 'var(--teal)' }}>
          <span className="brand-dot" style={{ background: 'var(--accent-soft)', color: 'var(--teal)' }}>
            <Plane size={18} />
          </span>
          Aether
        </Link>
        <h1>Sign in</h1>
        <p>Frontend demo — pick a role or use the credentials below.</p>

        <div className="preset-row">
          <button
            type="button"
            className="preset"
            onClick={() => {
              loginAs('admin')
              navigate('/dashboard')
            }}
          >
            <strong>Admin — Sam Rivera</strong>
            <span>Full access including settings & rates</span>
          </button>
          <button
            type="button"
            className="preset"
            onClick={() => {
              loginAs('broker')
              navigate('/dashboard')
            }}
          >
            <strong>Broker — Jordan Lee</strong>
            <span>Create & manage quotes, view fleet data</span>
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Continue</button>
        </form>
      </div>
    </div>
  )
}
