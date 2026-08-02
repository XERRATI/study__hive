/* =====================================================================
   Study Hive — 56-night-sky.js
   NIGHT SKY EVENTS: while night mode is on —
   · shooting stars streak across every 45–150 seconds
   · a rare planet collision (two orbs meet with a flash) — very rare
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  var shootTimer = null;
  var planetTimer = null;

  function nightOn() { return document.body.classList.contains('night-mode'); }

  /* ---------- Shooting star ---------- */
  function spawnShootingStar() {
    if (!nightOn()) return;
    var star = document.createElement('div');
    star.className = 'shooting-star';
    var x = Math.random() * 60 + 5;            /* start in the upper half */
    var y = Math.random() * 25 + 3;
    var dx = 30 + Math.random() * 55;          /* streak distance */
    var dy = 10 + Math.random() * 30;
    star.style.left = x + 'vw';
    star.style.top = y + 'vh';
    star.style.setProperty('--ss-dx', dx + 'vw');
    star.style.setProperty('--ss-dy', dy + 'vh');
    star.style.setProperty('--ss-dur', (0.9 + Math.random() * 0.7).toFixed(2) + 's');
    document.body.appendChild(star);
    requestAnimationFrame(function () { requestAnimationFrame(function () { star.classList.add('run'); }); });
    setTimeout(function () { if (star.parentNode) star.parentNode.removeChild(star); }, 3000);
  }

  function scheduleShooting() {
    clearTimeout(shootTimer);
    if (!nightOn()) return;
    shootTimer = setTimeout(function () {
      spawnShootingStar();
      scheduleShooting();
    }, 45000 + Math.random() * 105000);       /* every 45s – 2.5 min */
  }

  /* ---------- Rare planet collision ---------- */
  function spawnPlanetCollision() {
    if (!nightOn()) return;
    var ev = document.createElement('div');
    ev.className = 'planet-event';
    ev.style.cssText = 'left:50%;top:38%;width:0;height:0;';
    var pa = document.createElement('div'); pa.className = 'planet pa';
    var pb = document.createElement('div'); pb.className = 'planet pb';
    pb.style.cssText = 'left:auto;right:0;';
    var flash = document.createElement('div'); flash.className = 'flash';
    ev.appendChild(pa); ev.appendChild(pb); ev.appendChild(flash);
    document.body.appendChild(ev);

    var t1 = setTimeout(function () { flash.classList.add('run'); }, 2550);
    var t2 = setTimeout(function () { if (ev.parentNode) ev.parentNode.removeChild(ev); }, 4000);
    /* clean up timers if the sky turns off early */
    ev._cleanup = function () { clearTimeout(t1); clearTimeout(t2); if (ev.parentNode) ev.parentNode.removeChild(ev); };
  }

  function schedulePlanets() {
    clearTimeout(planetTimer);
    if (!nightOn()) return;
    /* ~6% chance per 5-minute window → roughly one collision every 1–2 hours */
    planetTimer = setTimeout(function () {
      if (Math.random() < 0.06) spawnPlanetCollision();
      schedulePlanets();
    }, 5 * 60 * 1000);
  }

  /* ---------- Watch night mode on/off ---------- */
  var lastNight = nightOn();
  function check() {
    var on = nightOn();
    if (on !== lastNight) {
      lastNight = on;
      if (on) { scheduleShooting(); schedulePlanets(); }
      else { clearTimeout(shootTimer); clearTimeout(planetTimer); }
    }
  }
  setInterval(check, 2000);
  if (nightOn()) { scheduleShooting(); schedulePlanets(); }

  /* Test hooks (used by Admin Mode buttons). */
  window.__nightSkyShoot = spawnShootingStar;
  window.__nightSkyPlanet = spawnPlanetCollision;
})();
