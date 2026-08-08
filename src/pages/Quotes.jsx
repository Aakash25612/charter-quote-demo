import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, money } from '../data/mockData'

const filters = ['all', 'draft', 'sent', 'confirmed']

export default function Quotes() {
  const { quotes } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return quotes.filter((item) => {
      if (status !== 'all' && item.status !== status) return false
      if (!q) return true
      const hay = [
        item.id,
        item.clientName,
        item.clientEmail,
        item.calc?.origin?.icao,
        item.calc?.dest?.icao,
        item.calc?.plane?.tail,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [quotes, query, status])

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">History</div>
          <h1>Quotes</h1>
          <p>Search past quotes by client, route, tail number, or ID.</p>
        </div>
        <Link to="/quotes/new" className="btn btn-primary">
          <Plus size={16} /> New quote
        </Link>
      </header>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search clients, ICAO, N-number…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filters">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip ${status === f ? 'active' : ''}`}
              onClick={() => setStatus(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <section className="panel">
        {filtered.length === 0 ? (
          <p className="empty">No quotes match your filters.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Departure</th>
                  <th>Route</th>
                  <th>Aircraft</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} className="clickable" onClick={() => navigate(`/quotes/${q.id}`)}>
                    <td className="mono">{q.id}</td>
                    <td>{q.clientName}</td>
                    <td>{formatDate(q.departureDate)}</td>
                    <td>{q.calc ? `${q.calc.origin.icao} → ${q.calc.dest.icao}` : '—'}</td>
                    <td>{q.calc?.plane?.tail ?? '—'}</td>
                    <td><span className={`badge ${q.status}`}>{q.status}</span></td>
                    <td className="mono">{q.calc ? money(q.calc.breakdown.total) : '—'}</td>
                    <td>{formatDate(q.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
