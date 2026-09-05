function StatCard(label, value) {
  return `<div class="glass stat-card"><span class="stat-card__value">${value}</span><span class="stat-card__label">${label}</span></div>`;
}

export function StatGrid(stats) {
  return `<div class="stat-grid">${stats.map(([label, value]) => StatCard(label, value)).join("")}</div>`;
}
