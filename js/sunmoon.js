/* =====================================================
      SOLE / LUNA – ANIMAZIONE ALBA / TRAMONTO
   ===================================================== */

/* Utility */
function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

/* Aggiorna la posizione di sole/luna */
function updateSunMoon() {
    if (!unlocked) return;

    const now = new Date();
    const times = SunCalc.getTimes(now, LAT, LON);
    const pos = SunCalc.getPosition(now, LAT, LON);

    const alt = pos.altitude * 180 / Math.PI;   // gradi
    const SM = document.getElementById("sunMoon");
    const MASK = document.getElementById("moonMask");
    const sky = document.querySelector(".sky");

    const isDay = now >= times.sunrise && now <= times.sunset;

    /* ----- SOLE O LUNA ----- */
    if (isDay) {
        SM.classList.add("sun");
        SM.classList.remove("moon");
        MASK.style.display = "none";
    } else {
        SM.classList.remove("sun");
        SM.classList.add("moon");
        MASK.style.display = "block";
    }

    /* ----- FASI LUNARI ----- */
    if (!isDay) {
        const idx = getMoonPhaseIndex(now);
        SM.classList.remove(
            "phase-0","phase-1","phase-2","phase-3",
            "phase-4","phase-5","phase-6","phase-7"
        );
        SM.classList.add("phase-" + idx);
    }

    /* ----- CALCOLO POSIZIONE ----- */

    // Posizione dell’arco solare/lunare
    const W = window.innerWidth;
    const arcHeight = window.innerHeight * 0.23;

    /*
      0 = orizzonte sinistro → 1 = orizzonte destro
      di giorno usiamo alba→tramonto
      di notte usiamo tramonto→alba (giorno dopo)
    */

    let start = isDay ? times.sunrise : times.sunset;
    let end   = isDay ? times.sunset  : new Date(times.sunrise.getTime() + 86400000);

    let p = (now - start) / (end - start);
    p = clamp(p, 0, 1);

    // Curva verticale (arco sinusoidale)
    let y = window.innerHeight * 0.08 + (1 - Math.sin(p * Math.PI)) * arcHeight;
    let x = p * (W + 160) - 80;

    SM.style.left = x + "px";
    SM.style.top  = y + "px";

    /* ----- COLORE DEL CIELO ----- */
    const DAY = "#4ea7b2";
    const NIGHT = "#001124";

    let blend;
    const ALT_N = -12;   // notte astronomica
    const ALT_D = 35;    // giorno pieno

    if (alt <= ALT_N) blend = 0;
    else if (alt >= ALT_D) blend = 1;
    else blend = (alt - ALT_N) / (ALT_D - ALT_N);

    sky.style.background = interpolateSky(NIGHT, DAY, blend);
}

/* --------------------------------------------
   Funzione colore cielo (interpolazione RGB)
-------------------------------------------- */
function interpolateSky(c1, c2, t) {
    const a = parseInt(c1.slice(1), 16);
    const b = parseInt(c2.slice(1), 16);

    const r1 = (a >> 16) & 255, g1 = (a >> 8) & 255, b1 = a & 255;
    const r2 = (b >> 16) & 255, g2 = (b >> 8) & 255, b2 = b & 255;

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b_ = Math.round(b1 + (b2 - b1) * t);

    return `rgb(${r},${g},${b_})`;
}

/* --------------------------------------------
   Calcolo fasi lunari → indice 0..7
-------------------------------------------- */
function getMoonPhaseIndex(date) {
    const lp = 2551443; // durata sinodica in sec
    const nm = Date.UTC(1970, 0, 7, 20, 35, 0);
    const now = date.getTime();
    const phase = ((now - nm) / 1000) % lp;
    return Math.floor((phase / lp) * 8 + 0.5) & 7;
}

/* --------------------------------------------
   Chiamato dal main.js ogni 10 sec
-------------------------------------------- */
function tickSunMoon() {
    updateSunMoon();
}
