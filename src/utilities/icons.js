/**
 * icons.js
 * -----------------------------------------------------------------------
 * Minimal inline-SVG icon set shared by Header, cards, and the admin
 * dashboard, so every component draws from one place instead of each
 * hand-rolling its own markup.
 * -----------------------------------------------------------------------
 */

const PATHS = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h5v-5h2v5h5v-9"/>',
  book: '<path d="M5 5.5A2 2 0 0 1 7 4h11.5v14H7a2 2 0 0 0-2 1.5"/><path d="M5 5.5V19a2 2 0 0 0 2 1.5h11.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  calendar: '<rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
  inbox: '<path d="M4 12h4l1.5 3h5L16 12h4"/><path d="M4 12V7a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 7v5"/><path d="M4 12v6.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V12"/>',
  folder: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h4l2 2h7A1.5 1.5 0 0 1 20 9.5v8A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z"/>',
  lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  dashboard: '<rect x="4" y="4" width="7" height="9" rx="1.5"/><rect x="13" y="4" width="7" height="5" rx="1.5"/><rect x="13" y="12" width="7" height="8" rx="1.5"/><rect x="4" y="16" width="7" height="4" rx="1.5"/>',
  logout: '<path d="M9 20H6.5A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4H9"/><path d="M15 16l4-4-4-4M19 12H9"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M15.5 4.5l4 4L8 20H4v-4z"/>',
  trash: '<path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l1 12.5A1.5 1.5 0 0 0 9.5 21h5a1.5 1.5 0 0 0 1.5-1.5L17 7"/>',
  whatsapp: '<path d="M7 17l-1.2 3.6L9.5 19.4A8 8 0 1 0 4 13"/><path d="M9 9.3c0 3.6 2.9 6.5 6.5 6.5.5 0 .9-.4.9-.9v-.7c0-.3-.2-.5-.4-.6l-1.7-.7a.6.6 0 0 0-.7.2l-.4.5a5 5 0 0 1-2.8-2.8l.5-.4a.6.6 0 0 0 .2-.7l-.7-1.7a.6.6 0 0 0-.6-.4H9.9c-.5 0-.9.4-.9.9z"/>',
  mail: '<rect x="4" y="6" width="16" height="12" rx="2"/><path d="M4.5 7l7.5 6 7.5-6"/>',
  phone: '<path d="M7 4.5c.6 0 1.1.4 1.3 1l1 2.6a1.5 1.5 0 0 1-.4 1.6l-1.1 1a10 10 0 0 0 4.5 4.5l1-1.1a1.5 1.5 0 0 1 1.6-.4l2.6 1a1.5 1.5 0 0 1 1 1.4v2A1.5 1.5 0 0 1 17 20 14 14 0 0 1 4 7a1.5 1.5 0 0 1 1.5-1.5z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
};

export function icon(name, extraClass) {
  return `<svg class="icon ${extraClass || ""}" viewBox="0 0 24 24" aria-hidden="true">${PATHS[name] || ""}</svg>`;
}
