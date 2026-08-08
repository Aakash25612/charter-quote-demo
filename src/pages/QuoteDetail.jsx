import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Copy, ExternalLink, Mail, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDate, formatDateTime, money } from '../data/mockData'

export default function QuoteDetail() {
  const { id } = useParams()
  const { quotes, sendQuote, confirmQuote, settings, showToast } = useApp()
  const quote = quotes.find((q) => q.id === id)

  if (!quote || !quote.calc) {
    return (
      <div className="panel">
        <p className="empty">Quote not found.</p>
        <Link to="/quotes" className="btn btn-ghost">Back to quotes</Link>
      </div>
    )
  }

  const { calc } = quote
  const shareUrl = `${window.location.origin}/q/${quote.shareToken}`

  const clientMail = `Subject: Charter quote ${quote.id} — ${calc.origin.icao} to ${calc.dest.icao}

Hi ${quote.clientName},

Please find your Skyward Aviation charter quote:
${calc.origin.name} (${calc.origin.icao}) → ${calc.dest.name} (${calc.dest.icao})
Departure: ${formatDate(quote.departureDate)}
Aircraft: ${calc.plane.type} (${calc.plane.tail})
Total: ${money(calc.breakdown.total)}

View & accept online:
${shareUrl}

— ${settings.companyName}`

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">{quote.id}</div>
          <h1>{quote.clientName}</h1>
          <p>
            {calc.origin.icao} → {calc.dest.icao} · {formatDate(quote.departureDate)} ·{' '}
            <span className={`badge ${quote.status}`}>{quote.status}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quote.status === 'draft' && (
            <button type="button" className="btn btn-primary" onClick={() => sendQuote(quote.id)}>
              <Send size={16} /> Email quote
            </button>
          )}
          {quote.status === 'sent' && (
            <button type="button" className="btn btn-primary" onClick={() => confirmQuote(quote.id, 'staff')}>
              <CheckCircle2 size={16} /> Mark confirmed
            </button>
          )}
          <Link to={`/q/${quote.shareToken}`} className="btn btn-secondary" target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Client view
          </Link>
        </div>
      </header>

      <div className="two-col">
        <div>
          <section className="panel">
            <div className="route-line" style={{ marginBottom: 16 }}>
              <span>{calc.origin.icao}</span>
              <span className="dash" />
              <span>{calc.dest.icao}</span>
            </div>
            <div className="three-col" style={{ marginBottom: 16 }}>
              <div>
                <div className="muted">Distance</div>
                <strong>{calc.distanceNm} nm</strong>
              </div>
              <div>
                <div className="muted">Block time</div>
                <strong>{calc.blockHours} hrs</strong>
              </div>
              <div>
                <div className="muted">Passengers</div>
                <strong>{quote.passengers}</strong>
              </div>
            </div>
            <div className="cost-row"><span>Aircraft ({calc.plane.tail})</span><span className="mono">{money(calc.breakdown.aircraft)}</span></div>
            <div className="cost-row"><span>Fuel @ ${settings.fuelPricePerGallon}/gal</span><span className="mono">{money(calc.breakdown.fuel)}</span></div>
            <div className="cost-row"><span>Landing / handling</span><span className="mono">{money(calc.breakdown.fees)}</span></div>
            <div className="cost-row"><span>Crew — {calc.pilot.name}</span><span className="mono">{money(calc.breakdown.crew)}</span></div>
            <div className="cost-row"><span>Expenses</span><span className="mono">{money(calc.breakdown.expenses)}</span></div>
            <div className="cost-row"><span>Margin ({quote.marginPct}%)</span><span className="mono">{money(calc.breakdown.margin)}</span></div>
            <div className="cost-row total"><span>Total</span><span className="mono">{money(calc.breakdown.total)}</span></div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>Shareable client link</h2>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl)
                  showToast('Link copied')
                }}
              >
                <Copy size={14} /> Copy
              </button>
            </div>
            <code style={{ fontSize: 13, wordBreak: 'break-all' }}>{shareUrl}</code>
          </section>
        </div>

        <div>
          <section className="panel">
            <div className="panel-head">
              <h2>Email preview</h2>
              <Mail size={16} color="var(--muted)" />
            </div>
            <div className="mail-preview">{clientMail}</div>
          </section>

          <section className="panel">
            <h2 style={{ marginBottom: 14 }}>Activity</h2>
            <ul className="timeline">
              {[...quote.activity].reverse().map((a) => (
                <li key={a.at + a.text} className="timeline-item">
                  <span className="dot" />
                  <div>
                    <strong style={{ fontSize: 14 }}>{a.text}</strong>
                    <div className="muted">{formatDateTime(a.at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
