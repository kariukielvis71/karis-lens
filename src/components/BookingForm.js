import { icon } from "../utilities/icons.js";
import { waLink, mailLink, telLink, leadMessage } from "../utilities/channelLinks.js";

export function BookingForm(services) {
  return `
  <form class="glass booking-form" data-form="booking" novalidate>
    <div class="form-row">
      <div class="field"><label for="bk-name">Full name</label><input id="bk-name" name="name" required placeholder="Jane Doe" /></div>
      <div class="field"><label for="bk-email">Email</label><input id="bk-email" name="email" type="email" required placeholder="jane@example.com" /></div>
    </div>
    <div class="form-row">
      <div class="field"><label for="bk-phone">Phone</label><input id="bk-phone" name="phone" type="tel" required placeholder="+254 700 000 000" /></div>
      <div class="field"><label for="bk-service">Service</label>
        <select id="bk-service" name="service" required>
          <option value="" disabled selected>Select a service</option>
          ${services.map((s) => `<option value="${s.id}">${s.title}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="field"><label for="bk-date">Preferred date</label><input id="bk-date" name="eventDate" type="date" required /></div>
      <div class="field"><label for="bk-loc">Location</label><input id="bk-loc" name="location" placeholder="e.g. Nairobi, Karen" /></div>
    </div>
    <div class="field"><label for="bk-notes">Tell us about your vision</label><textarea id="bk-notes" name="notes" rows="3" placeholder="Style, guest count, must-have shots..."></textarea></div>
    <div class="field">
      <label>Preferred way to continue the conversation</label>
      <div class="channel-options">
        <label class="channel-option">${icon("whatsapp")}<input type="radio" name="preferredChannel" value="whatsapp" checked />WhatsApp</label>
        <label class="channel-option">${icon("mail")}<input type="radio" name="preferredChannel" value="email" />Email</label>
        <label class="channel-option">${icon("phone")}<input type="radio" name="preferredChannel" value="call" />Call</label>
      </div>
    </div>
    <button class="btn btn--primary btn--lg btn--block" type="submit">Submit booking request</button>
  </form>`;
}

/** Shown in place of the form once a booking has been submitted. */
export function BookingConfirmation(lead, business, serviceLabel) {
  const msg = leadMessage(lead, business, serviceLabel);
  const actions = [];
  if (lead.preferredChannel === "whatsapp") {
    actions.push(`<a class="btn btn--primary" href="${waLink(business.whatsapp, `Hi, I'm ${lead.name}. ${msg}`)}" target="_blank" rel="noopener">${icon("whatsapp")} Continue on WhatsApp</a>`);
  }
  if (lead.preferredChannel === "email") {
    actions.push(`<a class="btn btn--primary" href="${mailLink(business.email, `Booking request — ${serviceLabel}`, `Hi, I'm ${lead.name}. ${msg}`)}">${icon("mail")} Continue by email</a>`);
  }
  if (lead.preferredChannel === "call") {
    actions.push(`<a class="btn btn--primary" href="${telLink(business.whatsapp)}">${icon("phone")} Call the studio</a>`);
  }
  actions.push(`<a class="btn btn--glass" href="#/portfolio">Browse the portfolio</a>`);

  return `
  <div class="glass confirm-card">
    <div class="confirm-card__icon">${icon("check")}</div>
    <h3>Request received</h3>
    <p>We'll follow up within 24 hours. In the meantime, feel free to reach out directly:</p>
    <div class="confirm-actions">${actions.join("")}</div>
  </div>`;
}
