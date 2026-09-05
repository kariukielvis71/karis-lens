import { Header } from "../components/Header.js";
import { Footer } from "../components/Footer.js";
import { StatGrid } from "../components/admin/StatCard.js";
import { getBusiness } from "../services/dataLoader.js";

export async function AboutPage() {
  const business = await getBusiness();

  return `
  ${Header("#/about")}
  <main>
    <section class="section container">
      <p class="eyebrow">Our story</p>
      <h1 style="max-width:760px;margin-top:.6rem">Every frame is a decision, not an accident.</h1>
      <p style="max-width:600px;margin-top:1.2rem">Karis Media Production began with a single question: what does it look like when a photographer treats every client's story with the same care as a feature film?</p>
    </section>
    <section class="section container">
      ${StatGrid([["Weddings shot", "340+"], ["Years in business", "9"], ["Client return rate", "98%"]])}
    </section>
  </main>
  ${Footer(business)}`;
}
