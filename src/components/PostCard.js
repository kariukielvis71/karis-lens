import { escapeHtml, formatDate } from "../utilities/helpers.js";

export function PostCard(post) {
  return `
  <article class="glass post-card" data-action="open-post" data-id="${post.id}" tabindex="0" role="button" aria-label="Read ${escapeHtml(post.title)}">
    <div class="post-card__cover"><img src="${post.cover}" alt="" loading="lazy" /></div>
    <span class="post-card__date">${formatDate(post.date)}</span>
    <h3 class="post-card__title">${escapeHtml(post.title)}</h3>
    <p class="post-card__excerpt">${escapeHtml(post.description).slice(0, 120)}&hellip;</p>
  </article>`;
}

export function PostGrid(posts) {
  if (!posts.length) return `<p style="text-align:center">No journal posts yet.</p>`;
  return `<div class="grid grid--3">${posts.map(PostCard).join("")}</div>`;
}

/** Full post detail — used by the '#/blog/:id' route, not the lightbox. */
export function PostDetail(post) {
  if (!post) return `<p>Post not found.</p>`;
  return `
    <div class="modal-media"><img src="${post.cover}" alt="" /></div>
    <span class="post-card__date">${formatDate(post.date)}</span>
    <h1 style="margin:.4rem 0 .8rem">${escapeHtml(post.title)}</h1>
    <p>${escapeHtml(post.description)}</p>
    <a class="btn btn--glass" href="#/blog" style="margin-top:1.5rem;display:inline-flex">&larr; Back to journal</a>
  `;
}
