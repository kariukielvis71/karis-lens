/**
 * Cloudflare Worker — D1 API + R2 media uploads.
 * Static assets are served via wrangler [assets] binding.
 */

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

function rowToContent(row) {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    category: row.category,
    status: row.status,
    cover: row.cover_url,
    date: row.date,
    description: row.description,
    linkedProjectId: row.linked_project_id ?? undefined,
  };
}

function rowToLead(row) {
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

async function requireAuth(request, env) {
  const header = request.headers.get("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return false;
  const row = await env.DB.prepare("SELECT token FROM admin_sessions WHERE token = ?").bind(token).first();
  return Boolean(row);
}

async function handleBusiness(env) {
  const row = await env.DB.prepare("SELECT name, whatsapp, email FROM business WHERE id = 1").first();
  if (!row) return error("Business not configured", 404);
  return json({ name: row.name, whatsapp: row.whatsapp, email: row.email });
}

async function handleServices(env) {
  const { results } = await env.DB.prepare(
    "SELECT id, title, description, icon FROM services ORDER BY sort_order"
  ).all();
  return json(results.map((r) => ({ id: r.id, title: r.title, desc: r.description, icon: r.icon })));
}

async function handleContentList(env) {
  const { results } = await env.DB.prepare("SELECT * FROM content ORDER BY date DESC, id DESC").all();
  return json(results.map(rowToContent));
}

async function handleContentCreate(request, env) {
  const body = await request.json();
  const linkedId = body.linkedProjectId ? Number(body.linkedProjectId) : null;
  const result = await env.DB.prepare(
    `INSERT INTO content (kind, title, category, status, cover_key, cover_url, date, description, linked_project_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING *`
  )
    .bind(
      body.kind,
      body.title,
      body.category,
      body.status || "completed",
      body.coverKey || null,
      body.cover,
      body.date,
      body.description || "",
      linkedId
    )
    .first();
  return json(rowToContent(result), 201);
}

async function handleContentUpdate(id, request, env) {
  const body = await request.json();
  const linkedId = body.linkedProjectId ? Number(body.linkedProjectId) : null;
  const result = await env.DB.prepare(
    `UPDATE content SET
       kind = ?, title = ?, category = ?, status = ?,
       cover_key = COALESCE(?, cover_key), cover_url = ?,
       date = ?, description = ?, linked_project_id = ?
     WHERE id = ?
     RETURNING *`
  )
    .bind(
      body.kind,
      body.title,
      body.category,
      body.status,
      body.coverKey || null,
      body.cover,
      body.date,
      body.description || "",
      linkedId,
      id
    )
    .first();
  if (!result) return error("Not found", 404);
  return json(rowToContent(result));
}

async function handleContentDelete(id, env) {
  await env.DB.prepare("DELETE FROM content WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

async function handleLeadsList(env) {
  const { results } = await env.DB.prepare("SELECT * FROM leads ORDER BY submitted_at DESC").all();
  return json(results.map(rowToLead));
}

async function handleLeadCreate(request, env) {
  const body = await request.json();
  const result = await env.DB.prepare(
    `INSERT INTO leads (name, phone, email, service, event_date, location, notes, preferred_channel, status, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
     RETURNING *`
  )
    .bind(
      body.name,
      body.phone,
      body.email,
      body.service,
      body.eventDate,
      body.location || "",
      body.notes || "",
      body.preferredChannel || "whatsapp"
    )
    .first();
  return json(rowToLead(result), 201);
}

async function handleLeadUpdate(id, request, env) {
  const body = await request.json();
  const result = await env.DB.prepare("UPDATE leads SET status = ? WHERE id = ? RETURNING *")
    .bind(body.status, id)
    .first();
  if (!result) return error("Not found", 404);
  return json(rowToLead(result));
}

async function handleLogin(request, env) {
  const { username, password } = await request.json();
  const adminUser = env.ADMIN_USER || "admin";
  const adminPass = env.ADMIN_PASSWORD || "admin123";
  if (username !== adminUser || password !== adminPass) {
    return json({ ok: false, error: "Invalid credentials." }, 401);
  }
  const token = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO admin_sessions (token) VALUES (?)").bind(token).run();
  return json({ ok: true, token });
}

async function handleUpload(request, env, url) {
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") return error("No file provided");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `covers/${crypto.randomUUID()}.${ext}`;
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });
  const publicUrl = `${url.origin}/api/media/${key}`;
  return json({ ok: true, key, url: publicUrl });
}

async function handleMedia(key, env) {
  const object = await env.MEDIA.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}

async function handleApi(request, env, url) {
  const path = url.pathname.replace(/^\/api/, "") || "/";
  const method = request.method;

  if (path === "/business" && method === "GET") return handleBusiness(env);
  if (path === "/services" && method === "GET") return handleServices(env);
  if (path === "/content" && method === "GET") return handleContentList(env);
  if (path === "/leads" && method === "GET") {
    if (!(await requireAuth(request, env))) return error("Unauthorized", 401);
    return handleLeadsList(env);
  }
  if (path === "/leads" && method === "POST") return handleLeadCreate(request, env);
  if (path === "/admin/login" && method === "POST") return handleLogin(request, env);

  if (path === "/upload" && method === "POST") {
    if (!(await requireAuth(request, env))) return error("Unauthorized", 401);
    return handleUpload(request, env, url);
  }

  if (path.startsWith("/media/") && method === "GET") {
    return handleMedia(path.slice("/media/".length), env);
  }

  const contentMatch = path.match(/^\/content\/(\d+)$/);
  if (contentMatch) {
    const id = contentMatch[1];
    if (method === "PATCH") {
      if (!(await requireAuth(request, env))) return error("Unauthorized", 401);
      return handleContentUpdate(id, request, env);
    }
    if (method === "DELETE") {
      if (!(await requireAuth(request, env))) return error("Unauthorized", 401);
      return handleContentDelete(id, env);
    }
  }

  const leadMatch = path.match(/^\/leads\/(\d+)$/);
  if (leadMatch && method === "PATCH") {
    if (!(await requireAuth(request, env))) return error("Unauthorized", 401);
    return handleLeadUpdate(leadMatch[1], request, env);
  }

  if (path === "/content" && method === "POST") {
    if (!(await requireAuth(request, env))) return error("Unauthorized", 401);
    return handleContentCreate(request, env);
  }

  return error("Not found", 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return handleApi(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
};
