/**
 * api.js
 * -----------------------------------------------------------------------
 * Thin async client — all data flows through the Cloudflare Worker API.
 * -----------------------------------------------------------------------
 */

import { getToken } from "../utilities/authToken.js";

const API_BASE = "/api";

/**
 * Shared fetch wrapper with JSON parsing and auth header injection.
 * @param {string} path — e.g. "/content"
 * @param {{ method?: string, body?: unknown, auth?: boolean }} options
 */
export async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = await res.json();
      message = err.error || message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function fetchBusiness() {
  return request("/business");
}

export async function fetchServices() {
  return request("/services");
}

export async function fetchContent() {
  return request("/content");
}

export async function createContent(fields) {
  return request("/content", { method: "POST", body: fields, auth: true });
}

export async function updateContent(id, patch) {
  return request(`/content/${id}`, { method: "PATCH", body: patch, auth: true });
}

export async function deleteContent(id) {
  return request(`/content/${id}`, { method: "DELETE", auth: true });
}

export async function fetchLeads() {
  return request("/leads", { auth: true });
}

export async function createLead(fields) {
  return request("/leads", { method: "POST", body: fields });
}

export async function updateLeadStatus(id, status) {
  return request(`/leads/${id}`, { method: "PATCH", body: { status }, auth: true });
}

export async function adminLogin(username, password) {
  try {
    return await request("/admin/login", { method: "POST", body: { username, password } });
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
