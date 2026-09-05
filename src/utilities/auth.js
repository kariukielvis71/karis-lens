/**
 * auth.js
 * -----------------------------------------------------------------------
 * Admin session via api.adminLogin() + localStorage token persistence.
 * -----------------------------------------------------------------------
 */

import { adminLogin } from "../services/api.js";
import { getToken, setToken, clearToken } from "./authToken.js";

export function isAdminAuthed() {
  return Boolean(getToken());
}

export function setAdminAuthed(value) {
  if (value) return;
  clearToken();
}

/** Authenticate against the Worker and persist the returned token. */
export async function login(username, password) {
  const result = await adminLogin(username, password);
  if (result.ok) {
    setToken(result.token);
    return { ok: true };
  }
  return result;
}
