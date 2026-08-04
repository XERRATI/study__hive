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
    /* WASP REDESIGN: friendly-but-menacing cartoon wasp — round head with
       big eyes and angry brows, yellow-banded abdomen, curved stinger. */
    '<svg viewBox="0 0 58 42" xmlns="http://www.w3.org/2000/svg">',
    '  <ellipse cx="17" cy="10" rx="11" ry="7" fill="rgba(208,233,255,.85)" stroke="#a9c4dd" stroke-width="1"></ellipse>',
    '  <ellipse cx="28" cy="8" rx="11" ry="7" fill="rgba(208,233,255,.75)" stroke="#a9c4dd" stroke-width="1"></ellipse>',
    '  <ellipse cx="34" cy="25" rx="14" ry="10" fill="#241c12"></ellipse>',
    '  <rect x="25" y="17.5" width="4.5" height="17" rx="2.2" fill="#f4c430"></rect>',
    '  <rect x="32" y="16.5" width="4.5" height="19" rx="2.2" fill="#f4c430"></rect>',
    '  <rect x="39" y="17.5" width="4.5" height="17" rx="2.2" fill="#f4c430"></rect>',
    '  <path d="M49 25 L57 29 L49 30 Z" fill="#241c12"></path>',
    '  <ellipse cx="20" cy="26" rx="7" ry="9" fill="#241c12"></ellipse>',
    '  <rect x="14.5" y="19" width="11" height="4.2" rx="2" fill="#f4c430"></rect>',
    '  <circle cx="13" cy="19.5" r="7" fill="#241c12"></circle>',
    '  <circle cx="10.6" cy="18" r="2.4" fill="#fff"></circle>',
    '  <circle cx="10.6" cy="18" r="1.1" fill="#111"></circle>',
    '  <circle cx="15.6" cy="18" r="2.4" fill="#fff"></circle>',
    '  <circle cx="15.6" cy="18" r="1.1" fill="#111"></circle>',
    '  <path d="M7.5 14.6 L11.5 16.2" stroke="#f4c430" stroke-width="1.7" stroke-linecap="round"></path>',
    '  <path d="M18.6 14.6 L14.6 16.2" stroke="#f4c430" stroke-width="1.7" stroke-linecap="round"></path>',
    '  <path d="M11 13.5 Q8 7.5 6 6.5" stroke="#241c12" stroke-width="1.6" fill="none" stroke-linecap="round"></path>',
    '  <path d="M15.5 12.5 Q18.5 6.5 20.5 5.5" stroke="#241c12" stroke-width="1.6" fill="none" stroke-linecap="round"></path>',
    '  <circle cx="6" cy="6.5" r="1.4" fill="#f4c430"></circle>',
    '  <circle cx="20.5" cy="5.5" r="1.4" fill="#f4c430"></circle>',
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
      if (window.buzz) window.buzz([40, 30, 40]);
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
