/* ====================================================
   SKY.JS – CIELO DINAMICO + SOLE/LUNA IN ORBITA
   ==================================================== */

const LAT = 45.7525;
const LON = 8.8975;

/* ----------------------------------------------------
   CORREZIONE FUSO ORARIO (GitHub Pages → UTC)
---------------------------------------------------- */
function localDate(d) {
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
}

/* ----------------------------------------------------
   Utility clamp
---------------------------------------------------- */
function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
}

/* ----------------------------------------------------
   Interpolazione colori notte → giorno
---------------------------------------------------- */
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

/* ----------------------------------------------------
   Controllo se è notte
---------------------------------------------------- */
function isNightTime() {
    const now = localDate(new Date());
    const t = SunCalc.getTimes(now, LAT, LON);
    return now < t.sunrise || now > t.sunset;
}

/* ----------------------------------------------------
   AGGIORNA CIELO + ORBITA ASTRO (SOLE/LUNA)
---------------------------------------------------- */
function updateSky() {
    if (!unlocked) return;

    const now = new Date();
    const nowL = localDate(now);
    const times = SunCalc.getTimes(nowL, LAT, LON);
    const pos = SunCalc.getPosition(nowL, LAT, LON);
    const alt = pos.altitude * 180 / Math.PI;

    const SKY = document.getElementById("sky");
    const SM = document.getElementById("sunMoon");

    if (!SKY || !SM) return;

    /* --- Determina se è giorno --- */
    const isDay = nowL >= times.sunrise && nowL <= times.sunset;

    /* --- ORBITA ASTRO --- */
    const start = isDay ? times.sunrise : times.sunset;
    const end   = isDay ? times.sunset  : new Date(times.sunrise.getTime() + 86400000);

    let p = (nowL - start) / (end - start);
    p = clamp(p, 0, 1);

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const orbitHeight = screenH * 0.30; // altezza orbita
    const baseY = screenH * 0.35;

    const y = baseY - Math.sin(p * Math.PI) * orbitHeight;

    SM.style.left = `${p * (screenW + 200) - 100}px`;
    SM.style.top  = `${y}px`;

    /* --- SOLE o LUNA --- */
    SM.className = isDay ? "sun" : "moon";

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

    SKY.classList.toggle("night", !isDay);
}
