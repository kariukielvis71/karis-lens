import { waLink, mailLink } from "../utilities/channelLinks.js";

/** Footer — takes the business record so contact links stay data-driven. */
export function Footer(business) {
  return `
  <footer class="site-footer">
    <div class="container glass footer-grid">
      <div class="footer-brand">
        <h3>${business.name}</h3>
        <p>Cinematic wedding films, editorial portraits, and commercial visuals — for people who don't want their story told twice the same way.</p>
      </div>
      <div class="footer-col">
        <p class="eyebrow">Navigate</p>
        <ul>
          <li><a href="#/portfolio">Portfolio</a></li>
          <li><a href="#/blog">Journal</a></li>
          <li><a href="#/about">About</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <p class="eyebrow">Get in touch</p>
        <ul>
          <li><a href="${mailLink(business.email, "Booking enquiry", "")}">${business.email}</a></li>
          <li><a href="${waLink(business.whatsapp, "Hi, I would like to book a session.")}">WhatsApp us</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${business.name}.</span>
      <a href="#/admin">Studio login</a>
    </div>
  </footer>`;
}
