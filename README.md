# Aether — Charter Quote Demo

Frontend-only React demo for migrating an MS Access charter quoting desk to a modern web app.

## Demo logins

| Role   | Email               | Password |
|--------|---------------------|----------|
| Admin  | admin@aether.demo   | demo123  |
| Broker | broker@aether.demo  | demo123  |

## What's included

- Landing + staff login (admin vs broker)
- Dashboard (sent / confirmed / revenue)
- New quote builder with live great-circle cost engine
- Quote history search + Draft → Sent → Confirmed lifecycle
- Fleet, airports, crew tables
- Admin settings (margin, fuel price, emails)
- Client-facing shareable quote page with accept
- Simulated email notifications + activity trail

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

This repo is Vercel-ready (Vite SPA + `vercel.json` rewrite to `index.html`).

```bash
npx vercel
```

Or connect the GitHub repo in the Vercel dashboard — build command `npm run build`, output `dist`.

## Stack (demo)

React 19 · Vite · React Router · Lucide icons

## Production direction (not in this demo)

PostgreSQL · Auth (Clerk or similar) · SendGrid/Postmark · Vercel hosting
