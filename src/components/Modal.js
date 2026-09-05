import { icon } from "../utilities/icons.js";
import { qs } from "../utilities/helpers.js";

function shell(bodyHtml) {
  return `
  <div class="modal-overlay" data-action="close-modal">
    <div class="glass-strong modal-shell" onclick="event.stopPropagation()">
      <button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button>
      ${bodyHtml}
    </div>
  </div>`;
}

/** Mount a lightbox with the given body markup into #modal-root. */
export function openModal(bodyHtml) {
  const root = qs("#modal-root");
  if (root) root.innerHTML = shell(bodyHtml);
}

export function closeModal() {
  const root = qs("#modal-root");
  if (root) root.innerHTML = "";
}
