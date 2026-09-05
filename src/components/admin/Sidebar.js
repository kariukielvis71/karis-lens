import { icon } from "../../utilities/icons.js";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: "dashboard", href: "#/admin" },
  { key: "content", label: "Content", icon: "folder", href: "#/admin/content" },
  { key: "leads", label: "Leads", icon: "inbox", href: "#/admin/leads" },
];

/** Sidebar (desktop) + bottom tab bar (mobile) — same nav items, two layouts via CSS. */
export function AdminSidebar(activeSection, businessName) {
  const link = (item) => `<a href="${item.href}" ${item.key === activeSection ? 'aria-current="page"' : ""}>${icon(item.icon)} ${item.label}</a>`;

  return `
  <aside class="glass admin-sidebar">
    <div class="admin-sidebar__brand">${businessName}</div>
    ${NAV_ITEMS.map(link).join("")}
    <div class="admin-sidebar__footer">
      <a href="#/" data-action="logout">${icon("logout")} Sign out</a>
    </div>
  </aside>
  <nav class="glass-strong admin-bottom-nav" aria-label="Admin">
    ${NAV_ITEMS.map(link).join("")}
    <a href="#/" data-action="logout">${icon("logout")} Exit</a>
  </nav>`;
}
