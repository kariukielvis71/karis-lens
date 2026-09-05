import { icon } from "../../utilities/icons.js";
import { escapeHtml, formatDate } from "../../utilities/helpers.js";
import { waLink, mailLink, telLink, leadMessage } from "../../utilities/channelLinks.js";

const STATUSES = ["new", "contacted", "booked"];

function LeadRow(lead, business, serviceLabel) {
  const message = leadMessage(lead, business, serviceLabel);
  return `
    <tr>
      <td>${escapeHtml(lead.name)}<br/><span style="color:var(--ink-faint);font-size:.76rem">${lead.location || ""}</span></td>
      <td>${serviceLabel}</td>
      <td>${formatDate(lead.eventDate)}</td>
      <td>
        <select class="status-select" data-action="lead-status" data-id="${lead.id}">
          ${STATUSES.map((s) => `<option value="${s}" ${s === lead.status ? "selected" : ""}>${s[0].toUpperCase() + s.slice(1)}</option>`).join("")}
        </select>
      </td>
      <td><div class="row-actions">
        <a class="channel-btn channel-btn--whatsapp" href="${waLink(lead.phone, message)}" target="_blank" rel="noopener" aria-label="WhatsApp ${escapeHtml(lead.name)}">${icon("whatsapp")}</a>
        <a class="channel-btn channel-btn--email" href="${mailLink(lead.email, `Re: your ${serviceLabel} request`, message)}" aria-label="Email ${escapeHtml(lead.name)}">${icon("mail")}</a>
        <a class="channel-btn channel-btn--call" href="${telLink(lead.phone)}" aria-label="Call ${escapeHtml(lead.name)}">${icon("phone")}</a>
      </div></td>
    </tr>`;
}

/** Full leads table. `serviceLabelFor(id)` resolves a service id to its display title. */
export function LeadsTable(leads, business, serviceLabelFor) {
  if (!leads.length) return `<div class="empty-state">No leads yet.</div>`;
  return `
  <div class="table-wrap"><table>
    <thead><tr><th>Name</th><th>Service</th><th>Date</th><th>Status</th><th>Contact</th></tr></thead>
    <tbody>${leads.map((lead) => LeadRow(lead, business, serviceLabelFor(lead.service))).join("")}</tbody>
  </table></div>`;
}
