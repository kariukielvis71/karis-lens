import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { PostGrid, PostDetail } from "../components/PostCard.js";
import { getBusiness, getContent } from "../services/dataLoader.js";

export async function BlogPage() {
  const [business, content] = await Promise.all([getBusiness(), getContent()]);
  const posts = content.filter((c) => c.kind === "post");

  return `
  ${Header("#/blog")}
  <main>
    <section class="section container">
      <div class="section-head section-head--center"><p class="eyebrow">Case studies</p><h1>The journal</h1><p>Behind-the-scenes stories from recent shoots.</p></div>
      ${PostGrid(posts)}
    </section>
  </main>
  ${Footer(business)}`;
}

export async function BlogDetailPage(postId) {
  const [business, content] = await Promise.all([getBusiness(), getContent()]);
  const post = content.find((c) => c.kind === "post" && String(c.id) === String(postId));

  return `
  ${Header("#/blog")}
  <main><div class="section container">${PostDetail(post)}</div></main>
  ${Footer(business)}`;
}
