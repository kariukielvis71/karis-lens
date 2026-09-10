# Deploying Karis Media to Cloudflare (Worker + static assets + D1)

## Why this looks different from the first version

Cloudflare's Git-integration build pipeline for this project consistently
runs `npx wrangler deploy` regardless of the "Deploy command" field, so
rather than fight that, the config now matches what that command expects:
a Worker entry point (`worker.js`) plus a static-assets directory, instead
of classic Pages Functions. This is Cloudflare's own currently-recommended
model. Practically, this means: **the live site ends up as a genuine
Worker**, reachable at `karis-media.<your-subdomain>.workers.dev` — not
under the original Pages project's `.pages.dev` URL. A new "Worker" card
will appear in the dashboard after the first successful deploy; that's
where you manage its environment variables/secrets from here on, not the
old Pages project page.

## Already done

D1 database `karis-media-db` (id `5681257f-cb85-4b2d-9313-a0d7e92dfd15`)
is live with schema + your business/services/content/leads data loaded.

## 0. Files in this drop, and where they go in your repo root

```
worker.js                        → repo root (NEW — the actual entry point wrangler deploy runs)
wrangler.toml                    → repo root (replace — now uses main + [assets], no more pages_build_output_dir)
.assetsignore                    → repo root (NEW — keeps worker.js/wrangler.toml/schema.sql etc. out of the public static files)
functions/api/[[path]].js        → repo root (keep as-is — worker.js imports its onRequest() directly, logic unchanged)
schema.sql / seed.sql            → repo root (unchanged — only needed if you rebuild D1 from scratch)
utilities/authToken.js           → src/utilities/authToken.js
api.js                           → src/services/api.js
ContentForm.js                   → src/components/admin/ContentForm.js
app.js                           → src/app.js
```

## 1. Push these to GitHub (web UI)

Same as before — drag the updated files into the repo (uploading an
existing file), replacing `wrangler.toml`, adding `worker.js` and
`.assetsignore` at the repo root, commit to `main`.

## 2. Let the existing Git connection redeploy

Since the project is already connected to this repo, pushing to `main`
should trigger a new build automatically. No dashboard changes should be
needed this time — `wrangler deploy` now has everything it asked for
(`main = "worker.js"` and `[assets] directory = "."`).

If you'd rather trigger it manually: Deployments tab → **Retry deployment**,
or push any small commit.

## 3. After the first successful deploy

1. Find the new **Worker** named `karis-media` in the dashboard (Workers &
   Pages list) — this is now the live thing, separate from the old Pages
   project card.
2. Open it → **Settings → Variables and Secrets** → add `ADMIN_SETUP_SECRET`
   as an **Encrypted** variable (any long random string you pick).
3. Confirm the D1 binding shows up automatically (it's defined in
   `wrangler.toml` under `[[d1_databases]]`, so `wrangler deploy` sets it
   directly — no manual dashboard binding needed this time, unlike the
   Pages Functions path).
4. Create the real admin account:
   ```
   curl -X POST https://karis-media.<your-subdomain>.workers.dev/api/admin/setup \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"<choose-a-real-password>","secret":"<ADMIN_SETUP_SECRET-from-step-2>"}'
   ```
5. Log in at `#/admin` with that username/password. Re-run step 4 later to
   change the password.

## Cover images & social links

- **Cover image**: pasted URL (Unsplash, etc.) — no file storage.
- **"View on <platform>"**: each project/post can optionally carry a
  `platform` (`tiktok`/`youtube`/`facebook`/`instagram`) and an
  `externalUrl` linking to the actual post.
- **Business social links**: `business.tiktok` / `.facebook` / `.youtube`
  / `.instagram` — currently `NULL`. Fill in with:
  ```sql
  UPDATE business SET tiktok = 'https://tiktok.com/@yourhandle' WHERE id = 1;
  ```
  Wiring those into the Footer/Header UI is a follow-up — share
  `Footer.js`/`Header.js`/`icons.js` and I'll do that pass.
