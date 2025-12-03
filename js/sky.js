/* =====================================================
   SKY.JS – Orbita realistica Sole/Luna (sinusoidale)
   Dimensione astro 80px – Glow medio – Alba/Tramonto reali
===================================================== */

const LAT = 45.7525;
const LON = 8.8975;

/* ----- UTILITY ----- */
function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

function interpolateColor(c1, c2, t) {
  const a = parseInt(c1.slice(1), 16);
  const b = parseInt(c2.slice(1), 16);
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

/* ----- GLOBALE: usato da stars.js e main.js ----- */
window.isNightTime = function () {
  const now = new Date();
  const t = SunCalc.getTimes(now, LAT, LON);
  return now < t.sunrise || now > t.sunset;
};

/* ----- SCRIVI ALBA/TRAMONTO ----- */
window.updateSunTimes = function () {
  const now = new Date();
  const t = SunCalc.getTimes(now, LAT, LON);
  const el = document.getElementById("sunTimes");
  if (!el) return;

  const fmt = d =>
    d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  el.textContent = `Alba: ${fmt(t.sunrise)} • Tramonto: ${fmt(t.sunset)}`;
};

/* =====================================================
   ORBITA REALISTICA SOLE/LUNA
===================================================== */

window.tickSky = function () {
  if (!unlocked) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const tToday = SunCalc.getTimes(today, LAT, LON);
  const tTomorrow = SunCalc.getTimes(new Date(today.getTime() + 86400000), LAT, LON);
  const tYesterday = SunCalc.getTimes(new Date(today.getTime() - 86400000), LAT, LON);

  let isDay, start, end;

  if (now >= tToday.sunrise && now <= tToday.sunset) {
    // giorno
    isDay = true;
    start = tToday.sunrise;
    end = tToday.sunset;
  } else {
    // notte
    isDay = false;
    if (now < tToday.sunrise) {
      start = tYesterday.sunset;
      end   = tToday.sunrise;
    } else {
      start = tToday.sunset;
      end   = tTomorrow.sunrise;
    }
  }

  let p = (now - start) / (end - start);
  p = clamp(p, 0, 1);

  const SKY = document.getElementById("sky");
  const SM  = document.getElementById("sunMoon");
  const MASK = document.getElementById("moonMask");

  // seleziona Sole/Luna
  if (isDay) {
    SM.classList.add("sun");
    SM.classList.remove("moon");
    MASK.style.display = "none";
  } else {
    SM.classList.add("moon");
    SM.classList.remove("sun");
    MASK.style.display = "block";
  }

  /* =====================================================
      TRAIETTORIA REALISTICA (sinusoidale)
      - p = 0   -> orizzonte sinistro
      - p = 0.5 -> zenit (mezzogiorno / mezzanotte)
      - p = 1   -> orizzonte destro
  ===================================================== */

  const W = window.innerWidth;
  const H = window.innerHeight;

  const astroSize = 80;

  const orbitW = W + astroSize * 2;
  const horizonY = H * 0.80;
  const zenithY  = H * 0.28;

  const x = p * orbitW - astroSize;
  const y = horizonY - Math.sin(Math.PI * p) * (horizonY - zenithY);

  SM.style.left = `${x}px`;
  SM.style.top  = `${y}px`;

  /* ----- COLORE CIELO ----- */
  const posSun = SunCalc.getPosition(now, LAT, LON);
  const alt = (posSun.altitude * 180) / Math.PI;

  const NIGHT = "#000814";
  const DAY   = "#1f2b3a";

  let blend = 0;
  if (alt <= -12) blend = 0;
  else if (alt >= 45) blend = 1;
  else blend = (alt + 12) / (45 + 12);

  SKY.style.background = interpolateColor(NIGHT, DAY, blend);

  SKY.classList.toggle("night", !isDay);
  SKY.classList.toggle("day", isDay);
};
