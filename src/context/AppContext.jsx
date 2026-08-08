import { createContext, useContext, useMemo, useState } from 'react'
import {
  aircraft as seedAircraft,
  airports as seedAirports,
  calcQuote,
  crew as seedCrew,
  initialQuotes,
  settings as seedSettings,
  users,
} from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [quotes, setQuotes] = useState(initialQuotes)
  const [fleet, setFleet] = useState(seedAircraft)
  const [airportsList, setAirportsList] = useState(seedAirports)
  const [crewList, setCrewList] = useState(seedCrew)
  const [settings, setSettings] = useState(seedSettings)
  const [toast, setToast] = useState(null)

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(null), 3200)
  }

  function login(email, password) {
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) return { ok: false, error: 'Invalid email or password' }
    setCurrentUser(user)
    return { ok: true }
  }

  function logout() {
    setCurrentUser(null)
  }

  function loginAs(role) {
    const user = users.find((u) => u.role === role)
    setCurrentUser(user)
  }

  function enrichQuote(q) {
    const calc = calcQuote({
      originId: q.originId,
      destId: q.destId,
      aircraftId: q.aircraftId,
      crewId: q.crewId,
      marginPct: q.marginPct,
      expenses: q.expenses,
      fuelPrice: settings.fuelPricePerGallon,
    })
    return { ...q, calc }
  }

  const enrichedQuotes = useMemo(() => quotes.map(enrichQuote), [quotes, settings.fuelPricePerGallon])

  function upsertQuote(quote) {
    setQuotes((prev) => {
      const exists = prev.some((q) => q.id === quote.id)
      if (exists) return prev.map((q) => (q.id === quote.id ? quote : q))
      return [quote, ...prev]
    })
  }

  function updateQuoteStatus(id, status, activityText) {
    const now = new Date().toISOString()
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q
        return {
          ...q,
          status,
          updatedAt: now,
          activity: [...q.activity, { at: now, text: activityText }],
        }
      }),
    )
  }

  function sendQuote(id) {
    updateQuoteStatus(id, 'sent', 'Quote emailed to client (SendGrid demo)')
    showToast('Quote emailed to client')
  }

  function confirmQuote(id, source = 'staff') {
    const msg =
      source === 'client'
        ? 'Client accepted online — emails sent to client, accounts & crew'
        : 'Quote confirmed — notifications sent to client, accounts & crew'
    updateQuoteStatus(id, 'confirmed', msg)
    showToast('Confirmation emails queued')
  }

  const value = {
    currentUser,
    login,
    logout,
    loginAs,
    quotes: enrichedQuotes,
    rawQuotes: quotes,
    upsertQuote,
    sendQuote,
    confirmQuote,
    updateQuoteStatus,
    fleet,
    setFleet,
    airportsList,
    setAirportsList,
    crewList,
    setCrewList,
    settings,
    setSettings,
    toast,
    showToast,
    isAdmin: currentUser?.role === 'admin',
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && <div className="toast" role="status">{toast}</div>}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
