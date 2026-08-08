import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, Plane } from 'lucide-react'
import { useApp } from '../context/AppContext'

const nav = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/quotes', label: 'Quotes' },
  { to: '/quotes/new', label: 'New quote' },
  { to: '/fleet', label: 'Fleet' },
  { to: '/airports', label: 'Airports' },
  { to: '/crew', label: 'Crew' },
  { to: '/settings', label: 'Settings', adminOnly: true },
]

export default function Layout() {
  const { currentUser, logout, isAdmin } = useApp()
  const navigate = useNavigate()

  if (!currentUser) return <Outlet />

  const links = nav.filter((n) => !n.adminOnly || isAdmin)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand-mark">
          <span className="brand-icon"><Plane size={18} /></span>
          <span>
            <strong>Aether</strong>
            <em>Charter quotes</em>
          </span>
        </Link>
        <nav className="side-nav">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <div className="user-block">
            <strong>{currentUser.name}</strong>
            <span className="role-tag">{currentUser.role}</span>
          </div>
          <button
            type="button"
            className="ghost-icon"
            onClick={() => {
              logout()
              navigate('/')
            }}
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <Outlet />
      </div>
    </div>
  )
}
