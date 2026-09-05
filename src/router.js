/**
 * router.js
 * -----------------------------------------------------------------------
 * Deliberately small: just turns `location.hash` into a segment array
 * and lets app.js subscribe to changes. app.js owns the actual route ->
 * page mapping, since there are only a handful of routes and a lookup
 * table would be more indirection than the app needs right now.
 * -----------------------------------------------------------------------
 */

export function parseRoute() {
  const hash = (window.location.hash || "").replace(/^#\/?/, "");
  const [path] = hash.split("?");
  return path.split("/").filter(Boolean);
}

/** Fires `callback` on every hash change, and once immediately on startup. */
export function onRouteChange(callback) {
  window.addEventListener("hashchange", callback);
  callback();
}
