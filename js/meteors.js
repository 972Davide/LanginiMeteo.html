/* ====================================================
   METEORS.JS – METEORE + SHOOTING STAR
   ==================================================== */

/* --------------------------------------------
   CREA METEORA SINGOLA
-------------------------------------------- */
function triggerMeteor(id) {
  if (!unlocked || !isNightTime()) return;

  const el = document.getElementById(id);

  // Partenza da sinistra
  const startX = -200 - Math.random() * 250;
  const startY = 5 + Math.random() * 35;  // altezza variabile

  // Movimento meteora
  const dx = 700 + Math.random() * 500;
  const dy = 250 + Math.random() * 200;

  // Imposta posizione iniziale
  el.style.left = startX + "px";
  el.style.top = startY + "vh";

  // Variabili personalizzate per l'animazione
  el.style.setProperty("--mx", dx + "px");
  el.style.setProperty("--my", dy + "px");

  // Reset animazione
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "meteorMove 1.8s linear forwards";
}

/* --------------------------------------------
   SCHEDULER METEORE (ricorsivo)
-------------------------------------------- */
function scheduleMeteors() {
  const delay = 4000 + Math.random() * 6000;

  setTimeout(() => {
    if (isNightTime()) {
      triggerMeteor("meteor1");

      // Meteora doppia casuale
      if (Math.random() < 0.5) triggerMeteor("meteor2");
    }

    // Ripeti per sempre
    scheduleMeteors();
  }, delay);
}

/* --------------------------------------------
   SHOOTING STAR SPECIALE
-------------------------------------------- */
function triggerShootingStar() {
  if (!unlocked || !isNightTime()) return;

  const s = document.getElementById("shootingStar");
  if (!s) return;

  s.classList.add("active");
  setTimeout(() => s.classList.remove("active"), 1300);
}
