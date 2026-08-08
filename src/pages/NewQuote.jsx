import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { calcQuote, money } from '../data/mockData'

export default function NewQuote() {
  const { airportsList, fleet, crewList, settings, upsertQuote, currentUser, showToast } = useApp()
  const navigate = useNavigate()
  const availableAircraft = fleet.filter((a) => a.status === 'available')
  const availableCrew = crewList.filter((c) => c.available)

  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    originId: airportsList[0]?.id ?? '',
    destId: airportsList[1]?.id ?? '',
    aircraftId: availableAircraft[0]?.id ?? '',
    crewId: availableCrew[0]?.id ?? '',
    departureDate: '',
    passengers: 2,
    marginPct: settings.defaultMargin,
    expenseLabel: '',
    expenseAmount: '',
  })

  const expenses = useMemo(() => {
    if (!form.expenseLabel && !form.expenseAmount) return []
    return [{ label: form.expenseLabel || 'Expense', amount: Number(form.expenseAmount) || 0 }]
  }, [form.expenseLabel, form.expenseAmount])

  const preview = useMemo(
    () =>
      calcQuote({
        originId: form.originId,
        destId: form.destId,
        aircraftId: form.aircraftId,
        crewId: form.crewId,
        marginPct: Number(form.marginPct),
        expenses,
        fuelPrice: settings.fuelPricePerGallon,
      }),
    [form, expenses, settings.fuelPricePerGallon],
  )

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function save(status) {
    if (!form.clientName || !form.clientEmail || !form.departureDate || !preview) {
      showToast('Add client, departure date, and a valid route first')
      return
    }
    const id = `q-${1000 + Math.floor(Math.random() * 900)}`
    const now = new Date().toISOString()
    const quote = {
      id,
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      originId: form.originId,
      destId: form.destId,
      aircraftId: form.aircraftId,
      crewId: form.crewId,
      departureDate: form.departureDate,
      passengers: Number(form.passengers) || 1,
      marginPct: Number(form.marginPct),
      expenses,
      status,
      createdAt: now,
      updatedAt: now,
      shareToken: `${form.clientName.slice(0, 2).toLowerCase()}-${id}`,
      activity: [
        { at: now, text: `Quote drafted by ${currentUser.name}` },
        ...(status === 'sent' ? [{ at: now, text: 'Quote emailed to client (SendGrid demo)' }] : []),
      ],
    }
    upsertQuote(quote)
    showToast(status === 'sent' ? 'Quote saved & emailed' : 'Draft saved')
    navigate(`/quotes/${id}`)
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">New quote</div>
          <h1>Build a charter quote</h1>
          <p>Select airports, aircraft, and crew — cost breakdown updates live.</p>
        </div>
      </header>

      <div className="quote-form">
        <section className="panel">
          <h2 style={{ marginBottom: 16 }}>Trip details</h2>
          <div className="form-grid">
            <div className="field">
              <label>Client name</label>
              <input value={form.clientName} onChange={(e) => set('clientName', e.target.value)} placeholder="Company or passenger" />
            </div>
            <div className="field">
              <label>Client email</label>
              <input type="email" value={form.clientEmail} onChange={(e) => set('clientEmail', e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.clientPhone} onChange={(e) => set('clientPhone', e.target.value)} />
            </div>
            <div className="field">
              <label>Departure date</label>
              <input type="date" value={form.departureDate} onChange={(e) => set('departureDate', e.target.value)} />
            </div>
            <div className="field">
              <label>Origin</label>
              <select value={form.originId} onChange={(e) => set('originId', e.target.value)}>
                {airportsList.map((a) => (
                  <option key={a.id} value={a.id}>{a.icao} — {a.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Destination</label>
              <select value={form.destId} onChange={(e) => set('destId', e.target.value)}>
                {airportsList.map((a) => (
                  <option key={a.id} value={a.id}>{a.icao} — {a.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Aircraft</label>
              <select value={form.aircraftId} onChange={(e) => set('aircraftId', e.target.value)}>
                {availableAircraft.map((a) => (
                  <option key={a.id} value={a.id}>{a.tail} — {a.type}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Crew (PIC)</label>
              <select value={form.crewId} onChange={(e) => set('crewId', e.target.value)}>
                {availableCrew.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Passengers</label>
              <input type="number" min="1" value={form.passengers} onChange={(e) => set('passengers', e.target.value)} />
            </div>
            <div className="field">
              <label>Margin %</label>
              <input type="number" min="0" max="50" value={form.marginPct} onChange={(e) => set('marginPct', e.target.value)} />
            </div>
            <div className="field">
              <label>Itemised expense</label>
              <input value={form.expenseLabel} onChange={(e) => set('expenseLabel', e.target.value)} placeholder="Catering, ground…" />
            </div>
            <div className="field">
              <label>Expense amount</label>
              <input type="number" min="0" value={form.expenseAmount} onChange={(e) => set('expenseAmount', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={() => save('draft')}>Save draft</button>
            <button type="button" className="btn btn-primary" onClick={() => save('sent')}>Save & email quote</button>
          </div>
        </section>

        <aside className="panel cost-sheet">
          <h2 style={{ marginBottom: 8 }}>Live cost engine</h2>
          {!preview ? (
            <p className="muted">Select a complete route to calculate.</p>
          ) : (
            <>
              <div className="route-line" style={{ margin: '12px 0 8px' }}>
                <span>{preview.origin.icao}</span>
                <span className="dash" />
                <span>{preview.dest.icao}</span>
              </div>
              <p className="muted" style={{ marginBottom: 16 }}>
                {preview.distanceNm} nm · {preview.blockHours} block hrs · {preview.plane.tail}
              </p>
              <div className="cost-row"><span>Aircraft</span><span className="mono">{money(preview.breakdown.aircraft)}</span></div>
              <div className="cost-row"><span>Fuel</span><span className="mono">{money(preview.breakdown.fuel)}</span></div>
              <div className="cost-row"><span>Landing / handling</span><span className="mono">{money(preview.breakdown.fees)}</span></div>
              <div className="cost-row"><span>Crew day rate</span><span className="mono">{money(preview.breakdown.crew)}</span></div>
              <div className="cost-row"><span>Expenses</span><span className="mono">{money(preview.breakdown.expenses)}</span></div>
              <div className="cost-row"><span>Subtotal</span><span className="mono">{money(preview.breakdown.subtotal)}</span></div>
              <div className="cost-row"><span>Margin ({form.marginPct}%)</span><span className="mono">{money(preview.breakdown.margin)}</span></div>
              <div className="cost-row total"><span>Client total</span><span className="mono">{money(preview.breakdown.total)}</span></div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
