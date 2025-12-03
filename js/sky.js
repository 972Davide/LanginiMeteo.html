/* ====================================================
   SKY.JS – CIELO DINAMICO (COLORE + ORBITA ASTRO)
   ==================================================== */

const LAT = 45.7525;
const LON = 8.8975;

/* --------------------------------------------
   Utility clamp
-------------------------------------------- */
function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v));
}

/* --------------------------------------------
   Interpolazione colori (notte → giorno)
-------------------------------------------- */
function interpolateColor(c1, c2, t) {
  const a = parseInt(c1.slice(1), 16);
  const b = parseInt(c2.slice(1), 16);

  const ar = (a >> 16) & 255,
        ag = (a >> 8) & 255,
        ab = a & 255;

  const br = (b >> 16) & 255,
        bg = (b >> 8) & 255,
        bb = b & 255;

  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);

  return `rgb(${r}, ${g}, ${bl})`;
}

/* --------------------------------------------
   DETERMINA SE È NOTTE
-------------------------------------------- */
function isNightTime() {
  const now = new Date();
  const t = SunCalc.getTimes(now, LAT, LON);
  return now < t.sunrise || now > t.sunset;
}

/* --------------------------------------------
   AGGIORNA IL CIELO (colore + orbita astro)
-------------------------------------------- */
function updateSky() {
  if (!unlocked) return;

  const now = new Date();
  const times = SunCalc.getTimes(now, LAT, LON);
  const pos = SunCalc.getPosition(now, LAT, LON);
  const alt = pos.altitude * 180 / Math.PI;

  const SKY = document.getElementById("sky");
  const SM = document.getElementById("sunMoon");

  const isDay = now >= times.sunrise && now <= times.sunset;

  /* --- ORBITA ASTRO --- */
  const start = isDay ? times.sunrise : times.sunset;
  const end   = isDay ? times.sunset  : new Date(times.sunrise.getTime() + 86400000);

  let p = (now - start) / (end - start);
  p = clamp(p, 0, 1);

  const W = window.innerWidth;
  const orbitHeight = window.innerHeight * 0.25;
  const baseY = 120;

  const y = baseY + (1 - Math.sin(p * Math.PI)) * orbitHeight;

  SM.style.left = `${p * (W + 200) - 120}px`;
  SM.style.top  = `${y}px`;

  /* --- COLORE CIELO --- */
  const NIGHT = "#000814";
  const DAY   = "#1f2b3a";

  const ALT_N = -12;
  const ALT_D = 45;

  let blend = 0;
  if (alt <= ALT_N) blend = 0;
  else if (alt >= ALT_D) blend = 1;
  else blend = (alt - ALT_N) / (ALT_D - ALT_N);

  SKY.style.background = interpolateColor(NIGHT, DAY, blend);

  SKY.classList.toggle("night", alt <= 0);
}
