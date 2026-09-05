import { AdminSidebar } from "../components/admin/Sidebar.js";
import { StatGrid } from "../components/admin/StatCard.js";
import { ContentPanel } from "../components/admin/ContentTable.js";
import { LeadsTable } from "../components/admin/LeadRow.js";
import { getBusiness, getServices, getContent, getLeads } from "../services/dataLoader.js";

function serviceLabelResolver(services) {
  return (id) => services.find((s) => s.id === id)?.title || id;
}

async function OverviewSection() {
  const [content, leads] = await Promise.all([getContent(), getLeads()]);
  const services = await getServices();
  const projects = content.filter((c) => c.kind === "project");
  const stats = [
    ["Projects", projects.length],
    ["Upcoming", projects.filter((p) => p.status === "upcoming").length],
    ["Journal posts", content.filter((c) => c.kind === "post").length],
    ["New leads", leads.filter((l) => l.status === "new").length],
  ];

  return `
  ${StatGrid(stats)}
  <div class="glass panel">
    <div class="panel__head"><h3 class="panel__title">Latest leads</h3><a class="btn btn--ghost btn--sm" href="#/admin/leads">View all &rarr;</a></div>
    ${LeadsTable(leads.slice(0, 3), await getBusiness(), serviceLabelResolver(services))}
  </div>`;
}

async function ContentSection(activeFilter) {
  const content = await getContent();
  return ContentPanel(content, activeFilter);
}

async function LeadsSection() {
  const [business, services, leads] = await Promise.all([getBusiness(), getServices(), getLeads()]);
  return `
  <div class="glass panel">
    <div class="panel__head"><h3 class="panel__title">Leads</h3></div>
    ${LeadsTable(leads, business, serviceLabelResolver(services))}
  </div>`;
}

const TITLES = { overview: "Overview", content: "Content", leads: "Leads" };

/**
 * Full admin dashboard shell. `section` is one of 'overview' | 'content' | 'leads'.
 * `contentFilter` is UI-only state (which kind is shown) owned by app.js.
 */
export async function AdminDashboardPage(section = "overview", contentFilter = "all") {
  const business = await getBusiness();
  const body =
    section === "content" ? await ContentSection(contentFilter) :
    section === "leads" ? await LeadsSection() :
    await OverviewSection();

  return `
  <div class="admin-shell">
    <div class="admin-body">
      ${AdminSidebar(section, business.name)}
      <div class="admin-main">
        <div class="glass admin-topbar"><h1 class="admin-topbar__title">${TITLES[section] || "Overview"}</h1></div>
        ${body}
      </div>
    </div>
  </div>`;
}
