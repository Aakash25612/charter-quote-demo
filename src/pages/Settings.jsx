import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { settings, setSettings, showToast } = useApp()
  const [form, setForm] = useState(settings)

  function save(e) {
    e.preventDefault()
    setSettings({
      ...form,
      defaultMargin: Number(form.defaultMargin),
      fuelPricePerGallon: Number(form.fuelPricePerGallon),
    })
    showToast('Settings saved')
  }

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="eyebrow">Admin</div>
          <h1>Settings</h1>
          <p>Company defaults used by the cost engine and outbound email.</p>
        </div>
      </header>

      <form className="panel" style={{ maxWidth: 560 }} onSubmit={save}>
        <div className="field">
          <label>Company name</label>
          <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        </div>
        <div className="form-grid">
          <div className="field">
            <label>Default margin %</label>
            <input
              type="number"
              min="0"
              max="50"
              value={form.defaultMargin}
              onChange={(e) => setForm({ ...form, defaultMargin: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Fuel price / gallon</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.fuelPricePerGallon}
              onChange={(e) => setForm({ ...form, fuelPricePerGallon: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label>From email</label>
          <input value={form.fromEmail} onChange={(e) => setForm({ ...form, fromEmail: e.target.value })} />
        </div>
        <div className="field">
          <label>Accounts email</label>
          <input value={form.accountsEmail} onChange={(e) => setForm({ ...form, accountsEmail: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary">Save settings</button>
      </form>
    </div>
  )
}
