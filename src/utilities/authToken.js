/**
 * authToken.js
 * -----------------------------------------------------------------------
 * Persists the admin session token. localStorage is guarded by try/catch
 * per the README's swap-in plan (some browsers/privacy modes throw).
 * -----------------------------------------------------------------------
 */

const STORAGE_KEY = "karis_admin_token";

export function getToken() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    /* storage unavailable — session just won't survive a refresh */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}
