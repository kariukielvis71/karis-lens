import { escapeHtml } from "../utilities/helpers.js";

export function ProjectCard(project) {
  return `
  <article class="glass project-card" data-action="open-project" data-id="${project.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(project.title)}">
    ${project.status === "upcoming" ? '<span class="project-card__badge">Upcoming</span>' : ""}
    <div class="project-card__media"><img src="${project.cover}" alt="" loading="lazy" /></div>
    <div class="project-card__scrim">
      <span class="project-card__tag">${project.category}</span>
      <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
    </div>
  </article>`;
}

export function ProjectGrid(projects) {
  if (!projects.length) return `<p style="text-align:center">No projects in this category yet.</p>`;
  return `<div class="grid grid--3">${projects.map(ProjectCard).join("")}</div>`;
}

/** Lightbox body for a single project, with a link to its case study post if one exists. */
export function ProjectModalBody(project, linkedPost) {
  return `
    <div class="modal-media"><img src="${project.cover}" alt="" /></div>
    <p class="eyebrow">${project.category} ${project.status === "upcoming" ? "&middot; Upcoming" : ""}</p>
    <h2 style="margin:.4rem 0 .8rem">${escapeHtml(project.title)}</h2>
    <p>${escapeHtml(project.description)}</p>
    ${linkedPost ? `<div style="margin-top:1.2rem"><a class="btn btn--glass" href="#/blog/${linkedPost.id}" data-action="close-modal">Read the case study &rarr;</a></div>` : ""}
  `;
}
