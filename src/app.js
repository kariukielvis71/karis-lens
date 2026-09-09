/**
 * app.js
 * -----------------------------------------------------------------------
 * Bootstraps the app: resolves the current route into a page, wires one
 * set of delegated listeners for every interactive element (data-action
 * attributes + forms), and owns the small bits of UI-only state
 * (current filters, which admin section is open) that don't belong in
 * the data layer.
 * -----------------------------------------------------------------------
 */

import { parseRoute, onRouteChange } from "./router.js";
import { qs, qsa, delegate, renderElement, toast } from "./utilities/helpers.js";
import { buildBookingPayload } from "./utilities/booking.js";
import { isAdminAuthed, setAdminAuthed, login } from "./utilities/auth.js";
import { openModal, closeModal } from "./components/Modal.js";
import { ProjectModalBody } from "./components/ProjectCard.js";
import { BookingConfirmation } from "./components/BookingForm.js";
import { ContentFormBody } from "./components/admin/ContentForm.js";
import { AdminLoginPage } from "./pages/AdminLoginPage.js";
import { HomePage } from "./pages/HomePage.js";
import { AboutPage } from "./pages/AboutPage.js";
import { PortfolioPage } from "./pages/PortfolioPage.js";
import { BlogPage, BlogDetailPage } from "./pages/BlogPage.js";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.js";
import { getBusiness, getServices, getContent, addContent, editContent, removeContent, getLeads, addLead, setLeadStatus, serviceLabel } from "./services/dataLoader.js";

/** UI-only state — filters and view toggles that don't belong in the data layer. */
const view = { portfolioFilter: "all", contentFilter: "all" };

async function render() {
  const segs = parseRoute();
  let html;

  if (segs[0] === "about") {
    html = await AboutPage();
  } else if (segs[0] === "portfolio") {
    html = await PortfolioPage(view.portfolioFilter);
  } else if (segs[0] === "blog") {
    html = segs[1] ? await BlogDetailPage(segs[1]) : await BlogPage();
  } else if (segs[0] === "admin") {
    html = isAdminAuthed() ? await AdminDashboardPage(segs[1] || "overview", view.contentFilter) : AdminLoginPage();
  } else {
    html = await HomePage();
  }

  renderElement("#root", html);
  window.scrollTo(0, 0);
}

function wireDelegatedClicks() {
  delegate(document, "click", "[data-action]", async (event, el) => {
    const action = el.getAttribute("data-action");

    switch (action) {
      case "toggle-mobile-nav": {
        const menu = qs("#mobile-menu");
        const opening = menu.hasAttribute("hidden");
        menu.toggleAttribute("hidden", !opening);
        el.setAttribute("aria-expanded", String(opening));
        break;
      }
      case "go-booking": {
        qs("#mobile-menu")?.setAttribute("hidden", "");
        if (window.location.hash !== "#/" && window.location.hash !== "") {
          window.location.hash = "#/";
          setTimeout(() => qs("#booking")?.scrollIntoView({ behavior: "smooth" }), 60);
        } else {
          qs("#booking")?.scrollIntoView({ behavior: "smooth" });
        }
        break;
      }
      case "filter-portfolio": {
        view.portfolioFilter = el.getAttribute("data-category");
        render();
        break;
      }
      case "open-project": {
        const content = await getContent();
        const project = content.find((c) => String(c.id) === el.getAttribute("data-id"));
        if (project) {
          const linkedPost = content.find((c) => c.kind === "post" && c.linkedProjectId === project.id);
          openModal(ProjectModalBody(project, linkedPost));
        }
        break;
      }
      case "open-post": {
        window.location.hash = `#/blog/${el.getAttribute("data-id")}`;
        break;
      }
      case "close-modal": {
        closeModal();
        break;
      }
      case "logout": {
        setAdminAuthed(false);
        break;
      }
      case "content-add": {
        openModal(ContentFormBody(null));
        break;
      }
      case "content-edit": {
        const content = await getContent();
        const item = content.find((c) => String(c.id) === el.getAttribute("data-id"));
        openModal(ContentFormBody(item));
        break;
      }
      case "content-delete": {
        await removeContent(el.getAttribute("data-id"));
        toast("Item deleted");
        render();
        break;
      }
      case "content-filter": {
        view.contentFilter = el.getAttribute("data-kind");
        render();
        break;
      }
      case "kind-toggle": {
        const form = el.closest("form");
        qsa('[data-action="kind-toggle"]', form).forEach((btn) => btn.setAttribute("aria-pressed", String(btn === el)));
        form.querySelector('[name="kind"]').value = el.getAttribute("data-kind");
        break;
      }
    }
  });
}

function wireDelegatedChanges() {
  delegate(document, "change", '[data-action="lead-status"]', async (event, el) => {
    const lead = await setLeadStatus(el.getAttribute("data-id"), el.value);
    if (lead) toast(`Marked ${lead.name} as ${el.value}`);
    render();
  });
}

function wireForms() {
  delegate(document, "submit", '[data-form="booking"]', async (event) => {
    event.preventDefault();
    const form = event.target;
    const result = buildBookingPayload(new FormData(form));
    if (!result.ok) {
      toast("Please fill in all required fields correctly.");
      return;
    }
    const [lead, business, label] = await Promise.all([
      addLead(result.payload),
      getBusiness(),
      serviceLabel(result.payload.service),
    ]);
    const slot = qs("#booking-slot");
    if (slot) slot.innerHTML = BookingConfirmation(lead, business, label);
  });

  delegate(document, "submit", '[data-form="admin-login"]', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    const result = await login(data.username, data.password);
    if (result.ok) {
      window.location.hash = "#/admin";
      render();
    } else {
      toast(result.error || "Invalid username or password");
    }
  });

  delegate(document, "submit", '[data-form="content"]', async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.platform) delete data.platform;
    if (!data.externalUrl) delete data.externalUrl;
    const id = form.getAttribute("data-id");
    if (id) {
      await editContent(id, data);
      toast("Changes saved");
    } else {
      await addContent(data);
      toast("Item created");
    }
    closeModal();
    render();
  });
}

export function bootstrap() {
  wireDelegatedClicks();
  wireDelegatedChanges();
  wireForms();
  onRouteChange(render);
}

bootstrap();