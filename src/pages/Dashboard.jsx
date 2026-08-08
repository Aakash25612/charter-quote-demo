import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, money } from '../data/mockData'

export default function Dashboard() {
  const { quotes, currentUser } = useApp()
  const navigate = useNavigate()
  const sent = quotes.filter((q) => q.status === 'sent').length
  const confirmed = quotes.filter((q) => q.status === 'confirmed').length
  const drafts = quotes.filter((q) => q.status === 'draft').length
  const revenue = quotes
    .filter((q) => q.status === 'confirmed' && q.calc)
    .reduce((s, q) => s + q.calc.breakdown.total, 0)

  const recent = [...quotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)

  const byMonth = quotes
    .filter((q) => q.status === 'confirmed' && q.calc)
    .reduce((acc, q) => {
      const key = new Date(q.updatedAt).toLocaleString('en-US', { month: 'short' })
      acc[key] = (acc[key] || 0) + q.calc.breakdown.total
      return acc
    }, {})

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">Operations</div>
          <h1>Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p>Quote pipeline, confirmation rate, and recent desk activity.</p>
        </div>
        <Link to="/quotes/new" className="btn btn-primary">
          New quote <ArrowRight size={16} />
        </Link>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Drafts</span>
          <strong>{drafts}</strong>
        </div>
        <div className="stat-card">
          <span>Sent</span>
          <strong>{sent}</strong>
        </div>
        <div className="stat-card">
          <span>Confirmed</span>
          <strong>{confirmed}</strong>
        </div>
        <div className="stat-card">
          <span>Confirmed revenue</span>
          <strong>{money(revenue)}</strong>
        </div>
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Recent quotes</h2>
            <Link to="/quotes" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Quote</th>
                  <th>Client</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((q) => (
                  <tr key={q.id} className="clickable" onClick={() => navigate(`/quotes/${q.id}`)}>
                    <td className="mono">{q.id}</td>
                    <td>{q.clientName}</td>
                    <td>{q.calc ? `${q.calc.origin.icao} → ${q.calc.dest.icao}` : '—'}</td>
                    <td><span className={`badge ${q.status}`}>{q.status}</span></td>
                    <td className="mono">{q.calc ? money(q.calc.breakdown.total) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Confirmed by month</h2>
          </div>
          {Object.keys(byMonth).length === 0 ? (
            <p className="empty">No confirmed revenue yet.</p>
          ) : (
            <ul className="timeline">
              {Object.entries(byMonth).map(([month, total]) => (
                <li key={month} className="cost-row">
                  <span>{month}</span>
                  <strong className="mono">{money(total)}</strong>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 16, marginBottom: 12 }}>Lifecycle reminder</h2>
            <p className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <Send size={14} /> Send emails the quote automatically
            </p>
            <p className="muted" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <CheckCircle2 size={14} /> Confirm notifies client, accounts & crew
            </p>
            <p className="muted" style={{ marginTop: 12 }}>Updated {formatDate(new Date().toISOString())}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
