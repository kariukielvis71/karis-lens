# Karis Media Production

Vanilla HTML/CSS/JS frontend (small pure-function components, one
data-access layer, one event-delegating kernel) backed by a Cloudflare
Pages Function + D1 + R2. See **README-DEPLOY.md** for the full deploy
walkthrough — this file just maps the codebase.

## Running it locally

Module scripts can't load over `file://`, so serve the folder over HTTP.
Once deployed to Cloudflare Pages (see README-DEPLOY.md), `wrangler pages dev .`
serves the frontend *and* proxies `/api/*` to `functions/api/[[path]].js`
locally against your real D1/R2 bindings:

```
wrangler pages dev .
```

Plain `npm run dev` (`http-server`) also works for browsing the static
pages, but `/api/*` calls will 404 under it since it doesn't run Pages
Functions — use `wrangler pages dev .` whenever you need the backend too.

## Admin login

Real account, created once via `POST /api/admin/setup` — see
README-DEPLOY.md step 8. No hardcoded credentials remain in the frontend.

## Where things live

```
index.html                     SPA shell: <link> tags + <script src="src/app.js">
functions/api/[[path]].js      Cloudflare Pages Function — every /api/* route
schema.sql / seed.sql          D1 schema + starter data
wrangler.toml                  D1 + R2 bindings, Pages project config
styles/
  tokens.css                    variables, reset, base type, layout primitives
  utilities/buttons.css
  components/                    header, hero, card (+ shared modal), booking, footer
  dashboard/                      sidebar/bottom-nav, stat cards, admin shell/tables/forms
src/
  app.js                         route dispatch + all delegated event wiring (the kernel)
  router.js                      hash parsing + change subscription
  pages/                         one file per route, composes components + fetches data
  components/                    pure render functions (public + components/admin/)
  services/
    api.js                       real fetch() client for functions/api/[[path]].js
    dataLoader.js                  the only data import surface pages/components use
  utilities/
    helpers.js                     DOM query/inject helpers, formatting, toast
    booking.js                      booking form validation
    channelLinks.js                 wa.me / mailto: / tel: / m.me link builders
    auth.js                         wraps login() + session-token presence check
    authToken.js                     localStorage persistence for the session token
    icons.js                        shared inline-SVG icon set
```

## Known follow-up

`ContentForm.js` still has a plain "Cover image URL" text field.
`uploadCover()` in `api.js` and `POST /api/upload` are both ready — the
form just doesn't call it yet. Swapping that text input for
`<input type="file">` and wiring it to `uploadCover()` is the next small
piece (see the note in README-DEPLOY.md).
