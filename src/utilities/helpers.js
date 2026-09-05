/**
 * helpers.js
 * -----------------------------------------------------------------------
 * Framework-agnostic DOM + formatting utilities shared across the app.
 * Nothing here knows about business data shapes — see services/ for that.
 * -----------------------------------------------------------------------
 */

export function qs(sel, root) {
  return (root || document).querySelector(sel);
}

export function qsa(sel, root) {
  return Array.from((root || document).querySelectorAll(sel));
}

/**
 * Lightweight event delegation — attaches one listener to `root` and
 * dispatches to any descendant matching `selector`.
 */
export function delegate(root, eventType, selector, handler) {
  root.addEventListener(eventType, (event) => {
    const matched = event.target.closest(selector);
    if (matched && root.contains(matched)) handler(event, matched);
  });
}

/** Render an HTML string into a target element, replacing its contents. */
export function renderElement(target, html) {
  const node = typeof target === "string" ? qs(target) : target;
  if (!node) {
    console.warn(`[helpers] renderElement: target "${target}" not found.`);
    return null;
  }
  node.innerHTML = html;
  return node;
}

export function escapeHtml(str) {
  return String(str == null ? "" : str).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

let toastTimeoutId;

/** Show a small transient confirmation message, mounted at #toast-root. */
export function toast(message) {
  const root = qs("#toast-root");
  if (!root) return;
  root.innerHTML = `
    <div class="toast glass-strong">
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>
      <span>${escapeHtml(message)}</span>
    </div>`;
  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    root.innerHTML = "";
  }, 2600);
}
