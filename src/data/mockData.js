export const stack = [
  'React',
  'PostgreSQL',
  'Vercel',
  'SendGrid',
  'Clerk / Auth',
]

export const users = [
  { id: 'u1', email: 'admin@aether.demo', password: 'demo123', name: 'Sam Rivera', role: 'admin' },
  { id: 'u2', email: 'broker@aether.demo', password: 'demo123', name: 'Jordan Lee', role: 'broker' },
]

export const settings = {
  companyName: 'Skyward Aviation',
  defaultMargin: 25,
  fuelPricePerGallon: 6.45,
  accountsEmail: 'accounts@skyward.aero',
  fromEmail: 'quotes@skyward.aero',
  currency: 'USD',
}

export const aircraft = [
  {
    id: 'ac1',
    tail: 'N482SK',
    type: 'Cessna Citation CJ3+',
    seats: 7,
    hourlyRate: 3200,
    fuelBurnGph: 160,
    cruiseKt: 416,
    status: 'available',
  },
  {
    id: 'ac2',
    tail: 'N901WX',
    type: 'King Air 350i',
    seats: 9,
    hourlyRate: 1850,
    fuelBurnGph: 95,
    cruiseKt: 312,
    status: 'available',
  },
  {
    id: 'ac3',
    tail: 'N220AV',
    type: 'Pilatus PC-12 NGX',
    seats: 8,
    hourlyRate: 1450,
    fuelBurnGph: 60,
    cruiseKt: 285,
    status: 'maintenance',
  },
]

export const airports = [
  { id: 'ap1', icao: 'KTEB', name: 'Teterboro', city: 'Teterboro, NJ', lat: 40.8501, lon: -74.0608, landingFee: 450, handlingFee: 650 },
  { id: 'ap2', icao: 'KMIA', name: 'Miami Intl', city: 'Miami, FL', lat: 25.7959, lon: -80.2870, landingFee: 380, handlingFee: 520 },
  { id: 'ap3', icao: 'KASE', name: 'Aspen-Pitkin', city: 'Aspen, CO', lat: 39.2232, lon: -106.8688, landingFee: 620, handlingFee: 890 },
  { id: 'ap4', icao: 'KVNY', name: 'Van Nuys', city: 'Los Angeles, CA', lat: 34.2098, lon: -118.4899, landingFee: 290, handlingFee: 480 },
  { id: 'ap5', icao: 'KBOS', name: 'Logan Intl', city: 'Boston, MA', lat: 42.3656, lon: -71.0096, landingFee: 410, handlingFee: 560 },
  { id: 'ap6', icao: 'KDEN', name: 'Denver Intl', city: 'Denver, CO', lat: 39.8561, lon: -104.6737, landingFee: 340, handlingFee: 410 },
]

export const crew = [
  { id: 'c1', name: 'Capt. Maya Chen', role: 'PIC', dayRate: 950, email: 'maya@skyward.aero', phone: '+1 201-555-0142', available: true },
  { id: 'c2', name: 'Capt. Eli Vargas', role: 'PIC', dayRate: 900, email: 'eli@skyward.aero', phone: '+1 305-555-0198', available: true },
  { id: 'c3', name: 'FO Priya Nair', role: 'SIC', dayRate: 620, email: 'priya@skyward.aero', phone: '+1 617-555-0111', available: false },
  { id: 'c4', name: 'Capt. Tom Hale', role: 'PIC', dayRate: 875, email: 'tom@skyward.aero', phone: '+1 720-555-0166', available: true },
]

function haversineNm(a, b) {
  const R = 3440.065
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function calcQuote({
  originId,
  destId,
  aircraftId,
  crewId,
  marginPct = settings.defaultMargin,
  expenses = [],
  fuelPrice = settings.fuelPricePerGallon,
}) {
  const origin = airports.find((a) => a.id === originId)
  const dest = airports.find((a) => a.id === destId)
  const plane = aircraft.find((a) => a.id === aircraftId)
  const pilot = crew.find((c) => c.id === crewId)
  if (!origin || !dest || !plane || !pilot) return null

  const distanceNm = haversineNm(origin, dest)
  const flightHours = distanceNm / plane.cruiseKt
  const blockHours = flightHours + 0.4
  const aircraftCost = blockHours * plane.hourlyRate
  const fuelCost = blockHours * plane.fuelBurnGph * fuelPrice
  const fees = origin.landingFee + origin.handlingFee + dest.landingFee + dest.handlingFee
  const crewCost = pilot.dayRate
  const expenseTotal = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const subtotal = aircraftCost + fuelCost + fees + crewCost + expenseTotal
  const margin = subtotal * (marginPct / 100)
  const total = subtotal + margin

  return {
    distanceNm: Math.round(distanceNm),
    flightHours: Math.round(flightHours * 100) / 100,
    blockHours: Math.round(blockHours * 100) / 100,
    breakdown: {
      aircraft: Math.round(aircraftCost),
      fuel: Math.round(fuelCost),
      fees: Math.round(fees),
      crew: Math.round(crewCost),
      expenses: Math.round(expenseTotal),
      subtotal: Math.round(subtotal),
      margin: Math.round(margin),
      total: Math.round(total),
    },
    origin,
    dest,
    plane,
    pilot,
    marginPct,
  }
}

export const initialQuotes = [
  {
    id: 'q-1042',
    clientName: 'Horizon Capital',
    clientEmail: 'travel@horizoncap.com',
    clientPhone: '+1 212-555-0180',
    originId: 'ap1',
    destId: 'ap2',
    aircraftId: 'ac1',
    crewId: 'c1',
    departureDate: '2026-08-14',
    passengers: 4,
    marginPct: 25,
    expenses: [{ label: 'Catering', amount: 420 }],
    status: 'sent',
    createdAt: '2026-08-06T14:22:00Z',
    updatedAt: '2026-08-06T15:10:00Z',
    shareToken: 'hz-teb-mia-1042',
    activity: [
      { at: '2026-08-06T14:22:00Z', text: 'Quote drafted by Jordan Lee' },
      { at: '2026-08-06T15:10:00Z', text: 'Quote emailed to client' },
    ],
  },
  {
    id: 'q-1041',
    clientName: 'Aspen Weekenders LLC',
    clientEmail: 'ops@aspenweekenders.com',
    clientPhone: '+1 970-555-0144',
    originId: 'ap6',
    destId: 'ap3',
    aircraftId: 'ac2',
    crewId: 'c2',
    departureDate: '2026-08-12',
    passengers: 6,
    marginPct: 28,
    expenses: [{ label: 'De-ice contingency', amount: 800 }],
    status: 'confirmed',
    createdAt: '2026-08-04T10:05:00Z',
    updatedAt: '2026-08-05T09:40:00Z',
    shareToken: 'aw-den-ase-1041',
    activity: [
      { at: '2026-08-04T10:05:00Z', text: 'Quote drafted by Sam Rivera' },
      { at: '2026-08-04T11:20:00Z', text: 'Quote emailed to client' },
      { at: '2026-08-05T09:40:00Z', text: 'Client accepted online — notifications sent to accounts & crew' },
    ],
  },
  {
    id: 'q-1039',
    clientName: 'Northbridge Media',
    clientEmail: 'exec@northbridge.tv',
    clientPhone: '+1 310-555-0177',
    originId: 'ap4',
    destId: 'ap5',
    aircraftId: 'ac1',
    crewId: 'c4',
    departureDate: '2026-08-20',
    passengers: 3,
    marginPct: 22,
    expenses: [],
    status: 'draft',
    createdAt: '2026-08-07T16:48:00Z',
    updatedAt: '2026-08-07T16:48:00Z',
    shareToken: 'nb-vny-bos-1039',
    activity: [{ at: '2026-08-07T16:48:00Z', text: 'Quote drafted by Jordan Lee' }],
  },
  {
    id: 'q-1035',
    clientName: 'Cedar Family Office',
    clientEmail: 'flights@cedarfo.com',
    clientPhone: '+1 617-555-0133',
    originId: 'ap5',
    destId: 'ap1',
    aircraftId: 'ac2',
    crewId: 'c1',
    departureDate: '2026-07-28',
    passengers: 5,
    marginPct: 25,
    expenses: [{ label: 'Ground transport', amount: 280 }],
    status: 'confirmed',
    createdAt: '2026-07-22T09:12:00Z',
    updatedAt: '2026-07-23T13:05:00Z',
    shareToken: 'cf-bos-teb-1035',
    activity: [
      { at: '2026-07-22T09:12:00Z', text: 'Quote drafted' },
      { at: '2026-07-22T12:00:00Z', text: 'Quote emailed to client' },
      { at: '2026-07-23T13:05:00Z', text: 'Confirmed — crew & accounts notified' },
    ],
  },
  {
    id: 'q-1031',
    clientName: 'Blue Peak Partners',
    clientEmail: 'admin@bluepeak.co',
    clientPhone: '+1 303-555-0190',
    originId: 'ap1',
    destId: 'ap6',
    aircraftId: 'ac1',
    crewId: 'c2',
    departureDate: '2026-07-15',
    passengers: 2,
    marginPct: 30,
    expenses: [],
    status: 'sent',
    createdAt: '2026-07-10T11:30:00Z',
    updatedAt: '2026-07-10T14:00:00Z',
    shareToken: 'bp-teb-den-1031',
    activity: [
      { at: '2026-07-10T11:30:00Z', text: 'Quote drafted' },
      { at: '2026-07-10T14:00:00Z', text: 'Quote emailed to client' },
    ],
  },
]

export function money(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
