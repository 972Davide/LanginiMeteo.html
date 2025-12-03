/* ====================================================
   SUNMOON.JS – SOLE / LUNA / FASI LUNARI
   ==================================================== */

const SM_BODY = document.getElementById("sunMoonBody");
const MOON_MASK = document.getElementById("moonMask");

/* ----------------------------------------------------
   CALCOLA LA FASE LUNARE (0-7)
---------------------------------------------------- */
function moonPhaseIndex(date) {
  const lp = 2551443; // durata ciclo lunare in secondi
  const nm = Date.UTC(1970, 0, 7, 20, 35, 0); // riferimento

  const now = date.getTime();
  const phase = ((now - nm) / 1000) % lp;

  return Math.floor((phase / lp) * 8 + 0.5) & 7;
}

/* ----------------------------------------------------
   AGGIORNA TESTO: ALBA E TRAMONTO
---------------------------------------------------- */
function updateSunTimes() {
  if (!unlocked) return;

  const now = new Date();
  const t = SunCalc.getTimes(now, LAT, LON);

  const fmt = (d) =>
    d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  const out = `Alba: ${fmt(t.sunrise)} • Tramonto: ${fmt(t.sunset)}`;

  document.getElementById("sunTimes").textContent = out;
}

/* ----------------------------------------------------
   GESTISCE SOLE / LUNA IN BASE ALLA LUCE
---------------------------------------------------- */
function updateSunMoon() {
  if (!unlocked) return;

  const now = new Date();
  const times = SunCalc.getTimes(now, LAT, LON);
  const isDay = now >= times.sunrise && now <= times.sunset;

  // Ripulisce classi precedenti
  SM_BODY.className = "";

  if (isDay) {
    // SOLE
    SM_BODY.classList.add("sun");
    MOON_MASK.style.display = "none";

  } else {
    // LUNA
    SM_BODY.classList.add("moon");
    MOON_MASK.style.display = "block";

    const idx = moonPhaseIndex(now);

    // reset fasi precedenti
    for (let i = 0; i < 8; i++) SM_BODY.classList.remove("phase-" + i);

    SM_BODY.classList.add("phase-" + idx);
  }
}
