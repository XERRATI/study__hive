/* =====================================================================
   Study Hive — 58-wasp.js
   NEW FEATURE: The Wasp. If the user goes more than 9 hours without
   studying, a wasp visits the hive and stings bees one by one until the
   hive is nearly empty — then it calms. The moment the user logs ANY
   study session, the wasp flees and the bees regrow.

   Warned about in the Queen guide (see js/16 STORY_STEPS).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function toast(msg) { if (typeof window.showMilestoneToast === 'function') { try { window.showMilestoneToast(msg, 4600); } catch (e) {} } }

  var LIMIT_MS = 9 * 60 * 60 * 1000;      /* 9 hours */
  var STING_EVERY = 55000;                /* ~55s between stings */

  var FIRST_VISIT_KEY = 'studyhive-first-visit-v1';
  var LAST_STUDY_KEY = 'studyhive-last-study-v1';

  if (!get(FIRST_VISIT_KEY)) set(FIRST_VISIT_KEY, String(Date.now()));

  var waspEl = null;
  var lastSessions = -1;
  var warned = false;

  /* ---------- Study detection (poll study-data-v2) ---------- */
  function sessionsTotal() {
    try {
      var sd = JSON.parse(get('study-data-v2') || '{}');
      return Number(sd.sessionsTotal || 0);
    } catch (e) { return 0; }
  }
  function stampStudy() {
    set(LAST_STUDY_KEY, String(Date.now()));
    warned = false;
  }
  function lastStudyMs() {
    var s = get(LAST_STUDY_KEY);
    if (s) return Number(s) || 0;
    var f = get(FIRST_VISIT_KEY);
    return f ? Number(f) || Date.now() : Date.now();
  }
  function idleMs() { return Date.now() - lastStudyMs(); }

  function checkStudy() {
    var n = sessionsTotal();
    if (n !== lastSessions) {
      if (lastSessions >= 0 && n > lastSessions) stampStudy();   /* a session finished */
      lastSessions = n;
    }
    if (idleMs() < LIMIT_MS) {
      dismissWasp(false);
    } else {
      ensureWasp();
    }
  }

  /* ---------- The wasp ---------- */
  var WASP_SVG = [
    '<svg viewBox="0 0 46 34" xmlns="http://www.w3.org/2000/svg">',
    '  <ellipse cx="20" cy="12" rx="9" ry="6" fill="rgba(200,225,255,.85)" stroke="#9db8d4" stroke-width="1"></ellipse>',
    '  <ellipse cx="30" cy="12" rx="9" ry="6" fill="rgba(200,225,255,.85)" stroke="#9db8d4" stroke-width="1"></ellipse>',
    '  <ellipse cx="23" cy="20" rx="14" ry="10" fill="#1c1710"></ellipse>',
    '  <rect x="14" y="15" width="4" height="11" rx="2" fill="#f4c430"></rect>',
    '  <rect x="21" y="14" width="4" height="12" rx="2" fill="#f4c430"></rect>',
    '  <rect x="28" y="15" width="4" height="11" rx="2" fill="#f4c430"></rect>',
    '  <path d="M37 21 L46 26 L37 25 Z" fill="#1c1710"></path>',
    '  <circle cx="35" cy="18" r="5" fill="#1c1710"></circle>',
    '  <circle cx="35" cy="18" r="2" fill="#fff"></circle>',
    '  <circle cx="35" cy="18" r="1" fill="#111"></circle>',
    '  <path d="M12 13 L17 8 L19 13 Z" fill="#1c1710"></path>',
    '</svg>'
  ].join('\n');

  function ensureWasp() {
    if (waspEl) return;
    waspEl = document.createElement('div');
    waspEl.className = 'wasp';
    waspEl.innerHTML = WASP_SVG;
    waspEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(waspEl);
    if (!warned) {
      warned = true;
      toast('🐝⚠️ A WASP has entered the hive! You haven\u2019t studied for over 9 hours. Log even 5 minutes and it will flee.');
    }
  }

  function sting() {
    if (!waspEl) return;
    /* pick a live new bee first, then an old bee */
    var targets = qa('.hive-bee-el').filter(function (b) { return b.offsetWidth || b.offsetHeight; })
      .concat(qa('.bee-wrap').filter(function (b) { return (b.offsetWidth || b.offsetHeight) && getComputedStyle(b).display !== 'none'; }));
    if (!targets.length) return;
    var bee = targets[Math.floor(Math.random() * targets.length)];
    var r = bee.getBoundingClientRect();
    /* sting burst at the bee */
    var burst = document.createElement('div');
    burst.className = 'wasp-sting-burst';
    burst.textContent = '💥';
    burst.style.left = (r.left + r.width / 2) + 'px';
    burst.style.top = (r.top + r.height / 2) + 'px';
    document.body.appendChild(burst);
    setTimeout(function () { if (burst.parentNode) burst.parentNode.removeChild(burst); }, 900);
    /* sting animation on the bee, then remove it */
    bee.classList.add('bee-stung');
    setTimeout(function () { if (bee.parentNode) bee.parentNode.removeChild(bee); }, 500);
    var remaining = qa('.hive-bee-el, .bee-wrap').length;
    toast('💥 A wasp stung one of your bees! (' + Math.max(0, remaining) + ' left) Study to save the hive.');
    if (remaining <= 3) {
      toast('🐝 The hive is nearly empty. Even 5 minutes of study will drive the wasp away.');
      calmWasp();
    }
  }

  function calmWasp() {
    /* wasp hangs around but stops stinging when the hive is nearly empty */
  }

  function dismissWasp(silent) {
    if (waspEl) {
      if (waspEl.parentNode) waspEl.parentNode.removeChild(waspEl);
      waspEl = null;
      if (!silent) toast('🐝 The wasp fled! Your effort protects the hive.');
    }
  }

  /* ---------- test hooks + admin ---------- */
  window.__waspSummon = function () {
    set(LAST_STUDY_KEY, String(Date.now() - LIMIT_MS - 1000));
    warned = false;
    ensureWasp();
  };
  window.__waspDismiss = function () {
    stampStudy();
    dismissWasp(true);
  };
  window.__waspSting = sting;
  window.waspActive = function () { return !!waspEl; };

  /* ---------- loop ---------- */
  checkStudy();
  setInterval(checkStudy, 20000);
  setInterval(function () { if (waspEl && idleMs() >= LIMIT_MS) sting(); }, STING_EVERY);
})();
