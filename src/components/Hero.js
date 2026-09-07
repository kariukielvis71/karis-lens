/** Hero — the homepage's opening section. */
export function Hero() {
  return `
  <section class="hero container">
    <div class="hero__grid">
      <div>
        <p class="eyebrow hero__eyebrow">Photography &amp; videography — Kajiado</p>
        <h1 class="hero__title">Turning moments into memories</h1>
        <p class="hero__subtitle">Cinematic wedding films, editorial portraits, and commercial visuals for people who don't want their story told twice the same way.</p>
        <div class="hero__actions">
          <a href="#/portfolio" class="btn btn--primary btn--lg">View our work</a>
          <a href="#/about" class="btn btn--glass btn--lg">Our story</a>
        </div>
      </div>
      <div class="glass hero__visual">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=60" alt="Recent wedding photography" />
        <span class="hero__visual-badge glass-strong">Latest — Amara &amp; James</span>
      </div>
    </div>
  </section>`;
}
