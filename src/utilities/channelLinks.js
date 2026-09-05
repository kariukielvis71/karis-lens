/**
 * channelLinks.js
 * -----------------------------------------------------------------------
 * Builds "continue the conversation" deep links from a lead record.
 * These are client-side compose helpers only — wa.me and mailto: both
 * open the person's own app with the message pre-filled; nothing is
 * sent automatically. Both the customer confirmation screen and the
 * admin dashboard build their action buttons from this one module, so
 * adding a new channel (e.g. Messenger) means changing one file.
 * -----------------------------------------------------------------------
 */

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function waLink(phone, message) {
  return `https://wa.me/${digitsOnly(phone)}?text=${encodeURIComponent(message)}`;
}

export function mailLink(email, subject, body) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function telLink(phone) {
  return `tel:${phone}`;
}

/** Messenger's web link has no message pre-fill support, unlike wa.me/mailto. */
export function messengerLink(username) {
  return `https://m.me/${username}`;
}

/** Standard follow-up message built from a lead + the service label it refers to. */
export function leadMessage(lead, business, serviceLabel) {
  return `Hi ${lead.name}, this is ${business.name} following up on your ${serviceLabel} request for ${lead.eventDate}.`;
}
