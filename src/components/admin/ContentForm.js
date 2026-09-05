import { escapeHtml } from "../../utilities/helpers.js";

/** Add/edit form for a project or journal post, rendered inside the shared lightbox. */
export function ContentFormBody(item) {
  const kind = item?.kind || "project";
  const kindBtn = (key, label) => `<button type="button" data-action="kind-toggle" data-kind="${key}" aria-pressed="${kind === key}">${label}</button>`;

  return `
  <h2 style="margin-bottom:1.2rem">${item ? "Edit item" : "New item"}</h2>
  <form class="content-form" data-form="content" data-id="${item ? item.id : ""}">
    <div class="kind-toggle">
      ${kindBtn("project", "Project")}
      ${kindBtn("post", "Journal post")}
    </div>
    <input type="hidden" name="kind" value="${kind}" />
    <div class="field"><label for="cf-title">Title</label><input id="cf-title" name="title" required value="${escapeHtml(item?.title || "")}" /></div>
    <div class="form-row">
      <div class="field"><label for="cf-category">Category</label><input id="cf-category" name="category" required value="${escapeHtml(item?.category || "")}" placeholder="weddings, commercial..." /></div>
      <div class="field"><label for="cf-status">Status</label>
        <select id="cf-status" name="status">
          <option value="completed" ${item?.status === "completed" ? "selected" : ""}>Completed</option>
          <option value="upcoming" ${item?.status === "upcoming" ? "selected" : ""}>Upcoming</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="field"><label for="cf-date">Date</label><input id="cf-date" name="date" type="date" required value="${item?.date || ""}" /></div>
      <div class="field"><label for="cf-cover">Cover image URL</label><input id="cf-cover" name="cover" required value="${escapeHtml(item?.cover || "")}" placeholder="https://..." /></div>
    </div>
    <div class="field"><label for="cf-desc">Description</label><textarea id="cf-desc" name="description" rows="3">${escapeHtml(item?.description || "")}</textarea></div>
    <button class="btn btn--primary btn--block" type="submit">${item ? "Save changes" : "Create item"}</button>
  </form>`;
}
