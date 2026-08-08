import { Link } from 'react-router-dom'
import { ArrowRight, Bell, FileText, Link2, Plane, Shield, Zap } from 'lucide-react'
import { stack } from '../data/mockData'

const features = [
  {
    icon: FileText,
    title: 'Live cost engine',
    text: 'Great-circle distance, block time, aircraft rate, fuel burn, fees, crew day rate, expenses, and margin — all in one quote.',
  },
  {
    icon: Bell,
    title: 'Auto notifications',
    text: 'Send quotes and confirmation emails to clients, accounts, and assigned crew — no more copy/paste from Access.',
  },
  {
    icon: Link2,
    title: 'Client share links',
    text: 'Clients open a branded quote page, review the breakdown, and accept online to kick off your ops workflow.',
  },
]

export default function Landing() {
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="hero-sky" aria-hidden="true" />
        <header className="landing-top">
          <span className="brand-inline">
            <span className="brand-dot"><Plane size={18} /></span>
            Aether
          </span>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/login" className="btn btn-outline">Open demo</Link>
          </div>
        </header>
        <div className="hero-copy">
          <h1>Charter quotes that fly with your team.</h1>
          <p>
            Replace the aging MS Access desk tool with a secure, hosted web app — fleet, airports, crew,
            quote history, and email notifications in one place.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              Try the operator demo <ArrowRight size={18} />
            </Link>
            <a href="#capabilities" className="btn btn-outline btn-lg">See capabilities</a>
          </div>
        </div>
      </section>

      <section className="landing-body" id="capabilities">
        <div className="section-head">
          <h2>Built for flight training & charter ops</h2>
          <p>
            Frontend prototype of the production app — same workflows your brokers use today,
            redesigned for the browser, permissions, and day-to-day collaboration.
          </p>
        </div>

        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="feature-tile">
              <div className="icon"><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="section-head">
          <h2>What this demo covers</h2>
          <p>Staff login, quote builder with live pricing, history search, fleet/airport/crew tables, settings, and a client accept page.</p>
        </div>

        <div className="feature-grid">
          <article className="feature-tile">
            <div className="icon"><Shield size={20} /></div>
            <h3>Admin vs broker</h3>
            <p>Role-based access so brokers quote day-to-day while admins manage rates, fuel price, and company settings.</p>
          </article>
          <article className="feature-tile">
            <div className="icon"><Zap size={20} /></div>
            <h3>Draft → Sent → Confirmed</h3>
            <p>Full quote lifecycle with activity trail and simulated transactional email on send and confirm.</p>
          </article>
          <article className="feature-tile">
            <div className="icon"><Plane size={20} /></div>
            <h3>Vercel-ready</h3>
            <p>Static React SPA you can deploy in minutes — production stack would add Postgres, auth, and SendGrid.</p>
          </article>
        </div>

        <div className="stack-row">
          {stack.map((s) => <span key={s} className="stack-chip">{s}</span>)}
        </div>

        <div className="cta-band">
          <div>
            <h2>Walk through the desk in 2 minutes</h2>
            <p>Demo logins: admin@aether.demo or broker@aether.demo — password demo123</p>
          </div>
          <Link to="/login" className="btn btn-primary">Launch demo</Link>
        </div>
      </section>
    </div>
  )
}
