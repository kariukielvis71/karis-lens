import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { Hero } from "../components/Hero.js";
import { ServicesSection } from "../components/ServicesSection.js";
import { ProjectGrid } from "../components/ProjectCard.js";
import { BookingForm } from "../components/BookingForm.js";
import { getBusiness, getServices, getContent } from "../services/dataLoader.js";

export async function HomePage() {
  const [business, services, content] = await Promise.all([getBusiness(), getServices(), getContent()]);
  const featured = content.filter((c) => c.kind === "project" && c.status === "completed").slice(0, 3);

  return `
  ${Header("#/")}
  <main>
    ${Hero()}
    ${ServicesSection(services)}

    <section class="section container" aria-labelledby="work-h">
      <div class="section-head section-head--center"><p class="eyebrow">Selected work</p><h2 id="work-h">Recent projects</h2></div>
      ${ProjectGrid(featured)}
      <div style="text-align:center;margin-top:2rem"><a href="#/portfolio" class="btn btn--glass">See the full portfolio &rarr;</a></div>
    </section>

    <section id="booking" class="section container" aria-labelledby="booking-h">
      <div class="booking-layout">
        <div class="section-head booking-intro">
          <p class="eyebrow">Let's work together</p>
          <h2 id="booking-h">Book your session</h2>
          <p>Tell us about the moment you want captured. We'll follow up within 24 hours.</p>
          <ul class="booking-points">
            <li>Free 15-minute consultation call</li>
            <li>Custom packages for any budget</li>
            <li>Delivery within 2–4 weeks</li>
          </ul>
        </div>
        <div id="booking-slot">${BookingForm(services)}</div>
      </div>
    </section>
  </main>
  ${Footer(business)}`;
}
