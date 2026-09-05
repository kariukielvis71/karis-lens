import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { ProjectGrid } from "../components/ProjectCard.js";
import { getBusiness, getContent } from "../services/dataLoader.js";

/** `activeFilter` is UI-only state owned by app.js, passed in rather than fetched. */
export async function PortfolioPage(activeFilter) {
  const [business, content] = await Promise.all([getBusiness(), getContent()]);
  const projects = content.filter((c) => c.kind === "project");
  const categories = ["all", ...new Set(projects.map((p) => p.category))];
  const visible = projects.filter((p) => activeFilter === "all" || p.category === activeFilter);

  return `
  ${Header("#/portfolio")}
  <main>
    <section class="section container">
      <div class="section-head section-head--center">
        <p class="eyebrow">Selected work</p>
        <h1>The portfolio</h1>
        <p>Completed projects and a look at what's coming up next.</p>
      </div>
      <div class="filter-row" style="justify-content:center">
        ${categories.map((c) => `<button class="filter-btn" data-action="filter-portfolio" data-category="${c}" aria-pressed="${c === activeFilter}">${c === "all" ? "All work" : c}</button>`).join("")}
      </div>
      ${ProjectGrid(visible)}
    </section>
  </main>
  ${Footer(business)}`;
}
