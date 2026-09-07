# Deploying Karis Media to Cloudflare (D1 + R2 + Pages Functions)

## 0. Files in this drop, and where they go in your repo

```
schema.sql                       → repo root
seed.sql                         → repo root
wrangler.toml                    → repo root
functions/api/[[path]].js        → repo root (new top-level `functions/` folder)
utilities/authToken.js           → src/utilities/authToken.js   (this file was missing)
```

Everything else (`index.html`, `styles/`, `src/pages`, `src/components`, etc.)
stays exactly as it is — `services/api.js` and `services/dataLoader.js`
already talk to `/api/...`, so no changes needed there.

## 1. One frontend fix required first

`src/app.js` and `src/utilities/auth.js` are out of sync (leftover from the
mock version): `app.js` calls a `checkCredentials()` that no longer exists,
and login is actually async now (`auth.js` calls the real `/api/admin/login`
endpoint). Fix the login submit handler in `src/app.js`:

```diff
- import { checkCredentials, isAdminAuthed, setAdminAuthed } from "./utilities/auth.js";
+ import { isAdminAuthed, setAdminAuthed, login } from "./utilities/auth.js";
```

```diff
  delegate(document, "submit", '[data-form="admin-login"]', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
-   if (checkCredentials(data.username, data.password)) {
-     setAdminAuthed(true);
-     window.location.hash = "#/admin";
-     render();
-   } else {
-     toast("Invalid credentials — try admin / admin123");
-   }
+   const result = await login(data.username, data.password);
+   if (result.ok) {
+     window.location.hash = "#/admin";
+     render();
+   } else {
+     toast(result.error || "Invalid username or password");
+   }
  });
```

(That handler's callback needs to become `async (event) => {`.) Also drop the
`admin / admin123` hint line from `src/pages/AdminLoginPage.js` — that's a
real login now.

That's the only code change. Everything else below is infrastructure setup.

## 2. Install Wrangler (Cloudflare's CLI) and log in

```
npm install -g wrangler
wrangler login
```

## 3. Create the D1 database

```
wrangler d1 create karis-media-db
```

Copy the `database_id` it prints into `wrangler.toml` (replace
`PASTE_FROM_D1_CREATE_OUTPUT`).

## 4. Load the schema and seed data

```
wrangler d1 execute karis-media-db --remote --file=./schema.sql
wrangler d1 execute karis-media-db --remote --file=./seed.sql
```

This gives you the exact same business/services/content/leads data you
currently see from `mockData.js`, now living in D1.

## 5. Create the R2 bucket and make it publicly readable

```
wrangler r2 bucket create karis-media-uploads
```

Then in the Cloudflare dashboard: **R2 → karis-media-uploads → Settings →
Public access → Allow Access** (enables the free `r2.dev` subdomain — no
custom domain needed). Copy the `https://pub-xxxxxxxx.r2.dev` URL it gives
you into `wrangler.toml` as `R2_PUBLIC_BASE`.

(Free tier: 10 GB storage + zero egress fees — plenty for cover images.)

## 6. Set the admin setup secret

Pick any long random string yourself (not the admin password — this just
protects the one-time account-creation endpoint):

```
wrangler pages secret put ADMIN_SETUP_SECRET
```

## 7. Deploy

```
wrangler pages deploy .
```

First run will prompt you to create/connect a Pages project — name it
`karis-media` to match `wrangler.toml`.

## 8. Create the real admin account

Run once, using the same secret from step 6:

```
curl -X POST https://<your-pages-url>/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<choose-a-real-password>","secret":"<the-secret-from-step-6>"}'
```

Log in at `#/admin` with that username/password from then on. You can
re-run this same call later to change the password.

## What you get vs. mock data

| Concern              | Before (mock)                  | Now                                  |
|-----------------------|--------------------------------|---------------------------------------|
| Business/services/content/leads | in-memory `mockData.js`, resets every reload | D1 tables, persist forever |
| Admin login           | hardcoded `admin`/`admin123`   | real account, PBKDF2-hashed password |
| Session                | in-memory flag, lost on refresh | 7-day token in D1, survives refresh (via `localStorage`) |
| Cover images           | Unsplash URLs pasted by hand   | can stay as URLs, *or* wire a file input to `uploadCover()` → R2 later |

Note on cover images: `ContentForm.js` currently has a plain "Cover image
URL" text field — `uploadCover()` in `api.js` and the `/api/upload` route
are ready to use, but nothing in the UI calls it yet. That's a separate,
small follow-up (swap that text input for `<input type="file">`, call
`uploadCover(file)` on submit, drop the returned `url` into the hidden
cover field) — didn't fold it in here since you asked to keep this pass
backend-only.
