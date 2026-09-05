import { icon } from "../../utilities/icons.js";
import { escapeHtml, formatDate } from "../../utilities/helpers.js";

function tableRows(items) {
  if (!items.length) return `<div class="empty-state">No content yet. Use "New item" to add your first project or post.</div>`;
  return `
  <div class="table-wrap"><table>
    <thead><tr><th>Title</th><th>Kind</th><th>Category</th><th>Status</th><th>Date</th><th></th></tr></thead>
    <tbody>
      ${items.map((item) => `
        <tr>
          <td>${escapeHtml(item.title)}</td>
          <td style="text-transform:capitalize">${item.kind}</td>
          <td style="text-transform:capitalize">${item.category}</td>
          <td><span class="badge badge--${item.status}">${item.status}</span></td>
          <td>${formatDate(item.date)}</td>
          <td><div class="row-actions">
            <button class="icon-btn" data-action="content-edit" data-id="${item.id}" aria-label="Edit ${escapeHtml(item.title)}">${icon("edit")}</button>
            <button class="icon-btn icon-btn--danger" data-action="content-delete" data-id="${item.id}" aria-label="Delete ${escapeHtml(item.title)}">${icon("trash")}</button>
          </div></td>
        </tr>`).join("")}
    </tbody>
  </table></div>`;
}

/** The full "Content" admin panel: heading, add button, kind filter, table. */
export function ContentPanel(items, activeFilter) {
  const filtered = items.filter((i) => activeFilter === "all" || i.kind === activeFilter);
  const filterBtn = (key, label) => `<button class="filter-btn" data-action="content-filter" data-kind="${key}" aria-pressed="${key === activeFilter}">${label}</button>`;

  return `
  <div class="glass panel">
    <div class="panel__head">
      <h3 class="panel__title">Content</h3>
      <button class="btn btn--primary btn--sm" data-action="content-add">${icon("plus")} New item</button>
    </div>
    <div class="filter-row">
      ${filterBtn("all", "All")}
      ${filterBtn("project", "Projects")}
      ${filterBtn("post", "Journal posts")}
    </div>
    ${tableRows(filtered)}
  </div>`;
}
