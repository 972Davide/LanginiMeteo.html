/* ================================================
   MAIN – AVVIO SISTEMA / PASSWORD / LOOP PRINCIPALE
   ================================================ */

// Password usata per sbloccare la dashboard
const PASSWORD = "Doroty025";

// Controlla se l'utente ha sbloccato
let unlocked = false;

/* ================================================
   LOGIN
   ================================================ */
function handleLogin() {
  const pwd = document.getElementById("lockPassword").value.trim();
  const errorBox = document.getElementById("lockError");

  if (pwd === PASSWORD) {
    unlocked = true;
    document.getElementById("lockScreen").style.display = "none";

    // Avvia subito dashboard e cielo
    updateSky();
    updateDashboard();
    updateSunTimes();
    toggleStars();
  } else {
    errorBox.textContent = "Password errata";
  }
}

// Eventi pulsante + Enter
document.getElementById("lockButton").onclick = handleLogin;
document.getElementById("lockPassword").onkeydown = (e) => {
  if (e.key === "Enter") handleLogin();
};

/* ================================================
   LOOP PRINCIPALE
   ================================================ */

function mainLoop() {
  if (!unlocked) return;
  updateSky();          // orbita sole/luna + colore cielo
  toggleStars();        // accende/spegne stelle
  updateSunTimes();     // aggiorna alba/tramonto
}

// Meteore random
function starLoop() {
  if (!unlocked) return;
  if (Math.random() < 0.2) triggerShootingStar();
}

// Dashboard update
function dataLoop() {
  if (!unlocked) return;
  updateDashboard();
}

/* ================================================
   AVVIO MODULI
   ================================================ */

initStars();       // genera le stelle
scheduleMeteors(); // avvia le meteore periodiche

// Intervalli loop
setInterval(mainLoop, 10000);      // cielo + lune + tempi
setInterval(dataLoop, 20000);      // dati meteo
setInterval(starLoop, 15000);      // shooting star
