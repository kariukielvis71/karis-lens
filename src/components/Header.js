import { icon } from "../utilities/icons.js";

/**
 * Header — sticky public nav. Pure function of the active route;
 * app.js wires up the mobile-menu toggle and nav clicks via delegation.
 */
export function Header(activeHref) {
  const links = [
    { label: "Home", href: "#/" },
    { label: "About", href: "#/about" },
    { label: "Portfolio", href: "#/portfolio" },
    { label: "Journal", href: "#/blog" },
  ];
  const navLink = (l) => `<a class="site-header__link" href="${l.href}" ${l.href === activeHref ? 'aria-current="page"' : ""}>${l.label}</a>`;

  return `
  <header class="site-header">
    <div class="glass site-header__bar">
      <a href="#/" class="site-header__brand"><span class="site-header__brand-dot"></span>Karis</a>
      <nav class="site-header__nav" aria-label="Primary">${links.map(navLink).join("")}</nav>
      <div class="site-header__actions">
        <a href="#/admin" class="btn btn--ghost btn--sm">${icon("lock")} Studio login</a>
        <a href="#booking" class="btn btn--primary btn--sm" data-action="go-booking">Book a session</a>
      </div>
      <button class="site-header__toggle" data-action="toggle-mobile-nav" aria-label="Toggle menu" aria-expanded="false">${icon("menu")}</button>
    </div>
    <nav class="site-header__mobile-menu glass" id="mobile-menu" hidden aria-label="Mobile">
      ${links.map(navLink).join("")}
      <a href="#/admin">Studio login</a>
      <a href="#booking" class="btn btn--primary btn--block" data-action="go-booking">Book a session</a>
    </nav>
  </header>`;
}
