/**
 * auth.js
 * -----------------------------------------------------------------------
 * Thin wrapper the pages/app.js call into for auth state. Token
 * persistence itself lives in authToken.js; the actual network call
 * lives in services/api.js. This file just ties the two together so
 * app.js doesn't need to know either detail.
 * -----------------------------------------------------------------------
 */

import { getToken, clearToken } from "./authToken.js";
import { adminLogin } from "../services/api.js";

/** Real login — resolves { ok: true } and persists the token on success, or { ok: false, error }. */
export async function login(username, password) {
  return adminLogin(username, password);
}

/** Client-side gate only: token presence, not server-verified. The Function re-validates every request. */
export function isAdminAuthed() {
  return Boolean(getToken());
}

export function setAdminAuthed(value) {
  if (!value) clearToken();
}
