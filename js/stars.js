/* =====================================================
   STARS.JS – Stelle animate + visibilità notte
===================================================== */

(function () {
  const container = document.getElementById("stars");
  if (!container) return;

  const STAR_COUNT = 90;

  for (let i = 0; i < STAR_COUNT; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.top = Math.random() * 100 + "%";
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDelay = Math.random() * 3 + "s";
    container.appendChild(s);
  }

  // Funzione globale usata da main.js
  window.toggleStars = function () {
    if (!window.isNightTime) return;
    const night = window.isNightTime();
    container.style.opacity = night ? 1 : 0;
  };
})();
