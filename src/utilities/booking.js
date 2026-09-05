/**
 * booking.js
 * -----------------------------------------------------------------------
 * Parses and validates the public booking form. Never touches the DOM
 * beyond reading a FormData object handed to it by app.js.
 * -----------------------------------------------------------------------
 */

const REQUIRED_FIELDS = ["name", "phone", "email", "service", "eventDate"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{9,15}$/;

function sanitizeText(value) {
  if (value == null) return "";
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function sanitizePhone(value) {
  if (value == null) return "";
  const str = String(value).trim();
  const hasPlus = str.startsWith("+");
  const digits = str.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

/**
 * Validate + normalize raw FormData into a lead-ready payload.
 * @param {FormData} formData
 * @returns {{ ok: boolean, payload?: object, errors?: object }}
 */
export function buildBookingPayload(formData) {
  const fields = {};
  for (const [key, value] of formData.entries()) {
    fields[key] = key.toLowerCase().includes("phone") ? sanitizePhone(value) : sanitizeText(value);
  }

  const errors = {};
  for (const key of REQUIRED_FIELDS) {
    if (!fields[key]) errors[key] = "This field is required.";
  }
  if (fields.email && !EMAIL_PATTERN.test(fields.email)) errors.email = "Enter a valid email address.";
  if (fields.phone && !PHONE_PATTERN.test(fields.phone)) errors.phone = "Enter a valid phone number.";

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    payload: {
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      service: fields.service,
      eventDate: fields.eventDate,
      location: fields.location || "",
      notes: fields.notes || "",
      preferredChannel: fields.preferredChannel || "whatsapp",
    },
  };
}
