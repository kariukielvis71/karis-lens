/**
 * functions/api/[[path]].js
 * -----------------------------------------------------------------------
 * Cloudflare Pages Function — catches every request under /api/* and
 * implements exactly the routes services/api.js calls. No external
 * dependencies: auth uses Web Crypto (PBKDF2) + a plain session-token
 * table in D1. No file storage — cover images and "view on <platform>"
 * links are both just pasted URLs (Unsplash, TikTok, YouTube, etc.).
 *
 * Bindings expected (see wrangler.toml):
 *   env.DB                 — D1 database
 *   env.ADMIN_SETUP_SECRET — secret required to create/reset the admin account
 * -----------------------------------------------------------------------
 */

const ALLOWED_CONTENT_FIELDS = ["kind", "title", "category", "status", "cover", "date", "description", "linkedProjectId", "platform", "externalUrl"];
const CONTENT_COLUMN_MAP = { linkedProjectId: "linked_project_id", externalUrl: "external_url" };
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
function errorResponse(message, status = 400) {
  return json({ error: message }, status);
}

// ---------------------------------------------------------------------
// Password hashing — PBKDF2-SHA256 via Web Crypto (no bcrypt dependency)
// ---------------------------------------------------------------------
function bytesToHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(hex) {
  return Uint8Array.from(hex.match(/.{2}/g).map((b) => parseInt(b, 16)));
}

async function hashPassword(password, existingSaltHex) {
  const salt = existingSaltHex ? hexToBytes(existingSaltHex) : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

async function verifyPassword(password, storedHash, storedSalt) {
  const { hash } = await hashPassword(password, storedSalt);
  return hash === storedHash;
}

// ---------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------
async function createSession(db, username) {
  const token = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
  await db.prepare("INSERT INTO sessions (token, username, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(token, username, now.toISOString(), expiresAt.toISOString()).run();
  return token;
}

async function requireAuth(request, db) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  const row = await db.prepare("SELECT username, expires_at FROM sessions WHERE token = ?").bind(token).first();
  if (!row || new Date(row.expires_at) < new Date()) return null;
  return row.username;
}

// ---------------------------------------------------------------------
// Row <-> API shape mappers (DB uses snake_case, frontend expects camelCase)
// ---------------------------------------------------------------------
function contentRowToApi(row) {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    category: row.category,
    status: row.status,
    cover: row.cover,
    date: row.date,
    description: row.description,
    linkedProjectId: row.linked_project_id ?? undefined,
    platform: row.platform ?? undefined,
    externalUrl: row.external_url ?? undefined,
  };
}
function leadRowToApi(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    service: row.service,
    eventDate: row.event_date,
    location: row.location,
    notes: row.notes,
    preferredChannel: row.preferred_channel,
    status: row.status,
    submittedAt: row.submitted_at,
  };
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const db = env.DB;
  const path = "/" + (params.path || []).join("/");
  const method = request.method;

  try {
    // ---------------- public routes ----------------
    if (path === "/business" && method === "GET") {
      const row = await db.prepare(
        "SELECT name, whatsapp, email, messenger_user as messengerUser, tiktok, facebook, youtube, instagram FROM business WHERE id = 1"
      ).first();
      return row ? json(row) : errorResponse("Business record not seeded", 500);
    }

    if (path === "/services" && method === "GET") {
      const { results } = await db.prepare("SELECT id, title, blurb as desc, icon FROM services ORDER BY sort_order").all();
      return json(results);
    }

    if (path === "/content" && method === "GET") {
      const { results } = await db.prepare("SELECT * FROM content ORDER BY date DESC").all();
      return json(results.map(contentRowToApi));
    }

    if (path === "/leads" && method === "POST") {
      const body = await request.json();
      for (const f of ["name", "phone", "email", "service", "eventDate"]) {
        if (!body[f]) return errorResponse(`Missing field: ${f}`, 422);
      }
      const now = new Date().toISOString();
      const result = await db.prepare(
        `INSERT INTO leads (name, phone, email, service, event_date, location, notes, preferred_channel, status, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`
      ).bind(body.name, body.phone, body.email, body.service, body.eventDate, body.location || "", body.notes || "", body.preferredChannel || "whatsapp", now).run();
      const row = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(result.meta.last_row_id).first();
      return json(leadRowToApi(row), 201);
    }

    if (path === "/admin/login" && method === "POST") {
      const { username, password } = await request.json();
      const user = await db.prepare("SELECT username, password_hash, password_salt FROM admin_users WHERE username = ?").bind(username || "").first();
      if (!user || !(await verifyPassword(password || "", user.password_hash, user.password_salt))) {
        return json({ ok: false, error: "Invalid username or password" }, 401);
      }
      const token = await createSession(db, username);
      return json({ ok: true, token });
    }

    // One-time (or reset) admin account creation. Requires a secret set via
    // `wrangler pages secret put ADMIN_SETUP_SECRET` — never checked into git.
    if (path === "/admin/setup" && method === "POST") {
      const { username, password, secret } = await request.json();
      if (!env.ADMIN_SETUP_SECRET || secret !== env.ADMIN_SETUP_SECRET) return errorResponse("Forbidden", 403);
      if (!username || !password) return errorResponse("username and password required", 422);
      const { hash, salt } = await hashPassword(password);
      await db.prepare(
        `INSERT INTO admin_users (username, password_hash, password_salt) VALUES (?, ?, ?)
         ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, password_salt = excluded.password_salt`
      ).bind(username, hash, salt).run();
      return json({ ok: true });
    }

    // ---------------- everything below requires a valid session ----------------
    const authedUser = await requireAuth(request, db);
    if (!authedUser) return errorResponse("Unauthorized", 401);

    if (path === "/leads" && method === "GET") {
      const { results } = await db.prepare("SELECT * FROM leads ORDER BY submitted_at DESC").all();
      return json(results.map(leadRowToApi));
    }

    const leadMatch = path.match(/^\/leads\/([^/]+)$/);
    if (leadMatch && method === "PATCH") {
      const { status } = await request.json();
      if (!status) return errorResponse("status is required", 422);
      await db.prepare("UPDATE leads SET status = ? WHERE id = ?").bind(status, leadMatch[1]).run();
      const row = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(leadMatch[1]).first();
      return row ? json(leadRowToApi(row)) : errorResponse("Not found", 404);
    }

    if (path === "/content" && method === "POST") {
      const body = await request.json();
      for (const f of ["kind", "title", "category", "status", "cover", "date"]) {
        if (!body[f]) return errorResponse(`Missing field: ${f}`, 422);
      }
      const result = await db.prepare(
        `INSERT INTO content (kind, title, category, status, cover, date, description, linked_project_id, platform, external_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        body.kind, body.title, body.category, body.status, body.cover, body.date,
        body.description || "", body.linkedProjectId || null, body.platform || null, body.externalUrl || null
      ).run();
      const row = await db.prepare("SELECT * FROM content WHERE id = ?").bind(result.meta.last_row_id).first();
      return json(contentRowToApi(row), 201);
    }

    const contentMatch = path.match(/^\/content\/([^/]+)$/);
    if (contentMatch && method === "PATCH") {
      const body = await request.json();
      const fields = Object.keys(body).filter((k) => ALLOWED_CONTENT_FIELDS.includes(k));
      if (!fields.length) return errorResponse("No valid fields to update", 422);
      const setClause = fields.map((f) => `${CONTENT_COLUMN_MAP[f] || f} = ?`).join(", ");
      const values = fields.map((f) => body[f]);
      await db.prepare(`UPDATE content SET ${setClause} WHERE id = ?`).bind(...values, contentMatch[1]).run();
      const row = await db.prepare("SELECT * FROM content WHERE id = ?").bind(contentMatch[1]).first();
      return row ? json(contentRowToApi(row)) : errorResponse("Not found", 404);
    }

    if (contentMatch && method === "DELETE") {
      await db.prepare("DELETE FROM content WHERE id = ?").bind(contentMatch[1]).run();
      return new Response(null, { status: 204 });
    }

    return errorResponse("Not found", 404);
  } catch (err) {
    return errorResponse(err && err.message ? err.message : "Server error", 500);
  }
}