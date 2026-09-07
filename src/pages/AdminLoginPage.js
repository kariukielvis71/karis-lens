import { icon } from "../utilities/icons.js";

export function AdminLoginPage() {
  return `
  <div class="login-wrap">
    <form class="glass login-card" data-form="admin-login" novalidate>
      <div class="login-card__icon">${icon("lock")}</div>
      <h2>Studio login</h2>
      <div class="field"><label for="au">Username</label><input id="au" name="username" required autocomplete="username" /></div>
      <div class="field"><label for="ap">Password</label><input id="ap" name="password" type="password" required autocomplete="current-password" /></div>
      <button class="btn btn--primary btn--block" type="submit">Sign in</button>
      <a class="btn btn--ghost btn--sm" href="#/" style="align-self:center">&larr; Back to site</a>
    </form>
  </div>`;
}
