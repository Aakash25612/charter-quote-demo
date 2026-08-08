import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Plane } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, money } from '../data/mockData'

export default function ClientQuote() {
  const { token } = useParams()
  const { quotes, confirmQuote, settings } = useApp()
  const quote = quotes.find((q) => q.shareToken === token)

  if (!quote || !quote.calc) {
    return (
      <div className="client-shell">
        <div className="client-card">
          <div className="client-body">
            <p className="empty">This quote link is invalid or expired.</p>
            <Link to="/" className="btn btn-ghost">Back to Aether</Link>
          </div>
        </div>
      </div>
    )
  }

  const { calc } = quote
  const accepted = quote.status === 'confirmed'

  return (
    <div className="client-shell">
      <div className="client-card">
        <div className="client-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.9 }}>
            <Plane size={18} />
            <span style={{ fontWeight: 700 }}>{settings.companyName}</span>
          </div>
          <h1>Charter quote</h1>
          <p style={{ opacity: 0.85 }}>
            Prepared for {quote.clientName} · {quote.id}
          </p>
        </div>

        <div className="client-body">
          <div className="route-line" style={{ marginBottom: 8 }}>
            <span>{calc.origin.icao}</span>
            <span className="dash" />
            <span>{calc.dest.icao}</span>
          </div>
          <p className="muted" style={{ marginBottom: 20 }}>
            {calc.origin.city} → {calc.dest.city} · {formatDate(quote.departureDate)} · {calc.plane.type}
          </p>

          <div className="cost-row"><span>Flight distance</span><span>{calc.distanceNm} nm</span></div>
          <div className="cost-row"><span>Estimated block time</span><span>{calc.blockHours} hrs</span></div>
          <div className="cost-row"><span>Aircraft</span><span>{calc.plane.tail}</span></div>
          <div className="cost-row"><span>Passengers</span><span>{quote.passengers}</span></div>
          <div className="cost-row total"><span>Quote total</span><span>{money(calc.breakdown.total)}</span></div>

          {accepted ? (
            <div className="accept-banner">
              <CheckCircle2 size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Quote accepted. Our team and assigned crew have been notified.
            </div>
          ) : (
            <div className="client-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => confirmQuote(quote.id, 'client')}
                disabled={quote.status === 'draft'}
              >
                Accept quote
              </button>
              <a className="btn btn-secondary" href={`mailto:${settings.fromEmail}?subject=Question about ${quote.id}`}>
                Ask a question
              </a>
            </div>
          )}

          {quote.status === 'draft' && (
            <p className="muted" style={{ marginTop: 12 }}>This draft has not been sent yet — accept will unlock after your broker emails it.</p>
          )}
        </div>
      </div>
    </div>
  )
}
