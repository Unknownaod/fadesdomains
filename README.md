# Fades Domains Web

The Next.js (App Router) frontend for Fades Domains — a glossy black / white / grey
storefront for searching, registering, and managing domains through the
[Fades Domains Server](../FadesDomainsServer) backend.

## Stack

- Next.js 14 (App Router), plain JavaScript (no TypeScript)
- Tailwind CSS for styling, with a custom "brushed chrome" design system
- No external UI kit — every component (search bar, cards, forms, nameserver/DNS
  editors) is hand-built for this app
- `next/font/google` for fonts: **Instrument Sans** (display/body) + **IBM Plex Mono**
  (domain names, prices, status, DNS data)

## Install

```bash
npm install
```

## Configure

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Fades Domains Server backend (default `http://localhost:3200`) |

Make sure the backend (`FadesDomainsServer`) is running first — this app has no
data of its own, it's a pure client for that API.

## Run

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Pages

- `/` — landing page with the hero domain search
- `/search?domain=...` — live availability for the exact query plus popular alternate TLDs
- `/login`, `/register` — auth, backed by the server's JWT endpoints
- `/dashboard` — the signed-in user's owned domains
- `/dashboard/[domain]` — a single domain: renew, edit nameservers, edit DNS records

## Auth

The JWT returned by `/api/auth/login` and `/api/auth/register` is kept in
`localStorage` under `fades.domains.auth.v1` and sent as `Authorization: Bearer
<token>` on every authenticated request (see `lib/auth-context.jsx` and
`lib/api.js`). On load, the stored token is re-validated against
`GET /api/auth/me`; an expired or invalid token is cleared silently and the
user is treated as signed out.

## Design system

The palette and components live in `tailwind.config.js` and `app/globals.css`:

- `ink` (#08080A) — page background
- `panel` / `panel-2` — dark glass surfaces, with a diagonal `sheen` gradient for
  a lacquered look
- `chrome` — the brushed-metal gradient used for primary buttons and the logo mark
- `paper` / `steel` / `haze` — white, mid-grey, and dark-grey text tones
- `mint` / `rust` — the only two accent colors, used exclusively as functional
  status indicators (domain available / taken), never as decoration

Nothing in the upstream registrar data is faked here either — search results,
pricing, and status all come straight from what the backend returns from the
Domain Name API.

## Note on schema-pending backend operations

Nameserver and DNS editing call real endpoints on the backend, but those
upstream registrar operations are marked `DOMAIN_API_SCHEMA_NOT_CONFIRMED`
until the exact Domain Name API routes are filled in (see the backend's
README). Until then, saving nameservers/DNS here will surface that error
message in the panel rather than silently pretending it worked.
