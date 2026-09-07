/**
 * api.js
 * -----------------------------------------------------------------------
 * Real network client for the Cloudflare Pages Function at
 * functions/api/[[path]].js. Every export here matches a route that
 * function implements. Auth is a Bearer token (see utilities/authToken.js)
 * attached automatically to routes marked `auth: true` below.
 * -----------------------------------------------------------------------
 */

import { getToken, setToken, clearToken } from "../utilities/authToken.js";

const BASE = "/api";

async function request(path, { method = "GET", json, auth = false, formData } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let body;
  if (formData) {
    body = formData; // browser sets the multipart Content-Type boundary itself
  } else if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  const res = await fetch(`${BASE}${path}`, { method, headers, body });

  if (res.status === 204) return null;
  const parsed = await res.json().catch(() => null);

  if (!res.ok) {
    const message = parsed?.error || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return parsed;
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
  return request("/content", { method: "POST", json: fields, auth: true });
}

export async function updateContent(id, patch) {
  return request(`/content/${id}`, { method: "PATCH", json: patch, auth: true });
}

export async function deleteContent(id) {
  return request(`/content/${id}`, { method: "DELETE", auth: true });
}

export async function fetchLeads() {
  return request("/leads", { auth: true });
}

export async function createLead(fields) {
  return request("/leads", { method: "POST", json: fields });
}

export async function updateLeadStatus(id, status) {
  return request(`/leads/${id}`, { method: "PATCH", json: { status }, auth: true });
}

/** Real admin login — stores the returned session token on success. */
export async function adminLogin(username, password) {
  try {
    const result = await request("/admin/login", { method: "POST", json: { username, password } });
    if (result?.token) setToken(result.token);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export function logout() {
  clearToken();
}

/**
 * Uploads a cover image to R2 via POST /api/upload, returning { key, url }.
 * Not wired into ContentForm.js yet — that form still uses a plain URL
 * field. Swapping it for a file input is the one remaining UI follow-up
 * noted in README-DEPLOY.md.
 */
export async function uploadCover(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request("/upload", { method: "POST", formData, auth: true });
}
