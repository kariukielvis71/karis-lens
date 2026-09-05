# Karis Media Production — Frontend Prototype

Vanilla HTML/CSS/JS, built React-style (small pure-function components, one
data-access layer, one event-delegating kernel) so it's ready to sit in
front of a Cloudflare Worker + D1 + R2 backend later. Everything today runs
on in-memory mock data — nothing is persisted between page loads yet.

## Running it

Module scripts can't load over `file://`, so serve the folder over HTTP:

```
npm run dev
```

This runs `http-server . -p 8080` (already in `package.json`). Then open
`http://localhost:8080`.

## Admin login (mock)

- URL: `#/admin`
- Username: `admin`
- Password: `admin123`

Session state is in-memory only — refreshing the page logs you out. Once
the real Worker auth endpoint exists, only `src/utilities/auth.js` and
`src/services/api.js` need to change; every page/component stays the same.

## Where things live

```
index.html                 → SPA shell: <link> tags + <script src="src/app.js">
styles/
  tokens.css                variables, reset, base type, layout primitives
  utilities/buttons.css
  components/                header, hero, card (+ shared modal), booking, footer
  dashboard/                  sidebar/bottom-nav, stat cards, admin shell/tables/forms
src/
  app.js                     route dispatch + all delegated event wiring (the kernel)
  router.js                  hash parsing + change subscription
  pages/                     one file per route, composes components + fetches data
  components/                pure render functions (public + components/admin/)
  services/
    mockData.js               seed data — delete this once D1 is live
    api.js                     async client; swap function BODIES for real fetch() calls later
    dataLoader.js               the only data import surface pages/components use
  utilities/
    helpers.js                 DOM query/inject helpers, formatting, toast
    booking.js                  booking form validation
    channelLinks.js             wa.me / mailto: / tel: / m.me link builders
    auth.js                     mock login check + in-memory session flag
    icons.js                    shared inline-SVG icon set
```

## Swapping in the real backend later

- `services/api.js` — replace each function body with a `fetch("/api/...")`
  call to the Cloudflare Worker. Nothing else changes.
- `utilities/auth.js` — replace the mock check with the real
  `/api/admin/login` call, and persist the returned token the same way a
  typical vanilla-JS app does (`localStorage`, guarded by try/catch) instead
  of the in-memory flag.
- `services/mockData.js` can be deleted once `api.js` no longer imports it.
