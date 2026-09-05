import { icon } from "../utilities/icons.js";

function ServiceCard(service) {
  return `
  <article class="glass service-card">
    <div class="service-card__icon">${icon(service.icon)}</div>
    <h3 class="service-card__title">${service.title}</h3>
    <p class="service-card__desc">${service.desc}</p>
  </article>`;
}

/** ServicesSection — the "what we offer" grid on the homepage. */
export function ServicesSection(services) {
  return `
  <section class="section container" aria-labelledby="services-h">
    <div class="section-head"><p class="eyebrow">What we offer</p><h2 id="services-h">Services built around your story</h2></div>
    <div class="grid grid--3">${services.map(ServiceCard).join("")}</div>
  </section>`;
}
