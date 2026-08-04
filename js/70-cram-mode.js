/* =====================================================================
   Study Hive — 70-cram-mode.js
   EXAM-DAY CRAM MODE.
   When an exam is today or tomorrow, the flashcards review area grows a
   "🧠 Cram: Subject" button. Turning it on makes the review queue show
   ONLY that subject's cards, sorted by SR struggle (highest "Again"
   count first) — the exact cards to re-check the night before, instead
   of the normal mixed queue. Pure recombination of data the app already
   collects (hive-exams-v1, hive-flashcards-v1, hive-sr-v1); the queue
   wraps the same visibleCardIndices chain as the due-only filter.
   ===================================================================== */

(function () {
  'use strict';
  function getJSON(k, fb) {
    if (window.shGetJSON) return window.shGetJSON(k, fb);
    try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch (e) { return fb; }
  }
  function toast(msg) { if (typeof window.showMilestoneToast === 'function') { try { window.showMilestoneToast(msg, 3800); } catch (e) {} } }

  var WINDOW_DAYS = 1; /* today (0) or tomorrow (1) */
  var active = null;   /* {subject, date, days} when cram mode is on */

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* nearest exam within the window (day of or day before) */
  function imminentExam() {
    try {
      var ex = getJSON('hive-exams-v1', []);
      if (!Array.isArray(ex) || !ex.length) return null;
      var now = new Date(); now.setHours(0, 0, 0, 0);
      var best = null;
      ex.forEach(function (e) {
        if (!e || !e.subject || !e.date) return;
        var t = new Date(String(e.date) + 'T00:00:00');
        if (isNaN(t.getTime())) return;
        var days = Math.round((t - now) / 86400000);
        if (days < 0 || days > WINDOW_DAYS) return;
        if (!best || t < best.t) best = { subject: String(e.subject), date: e.date, days: days, t: t };
      });
      return best;
    } catch (e) { return null; }
  }

  function cramIndices() {
    if (!active) return null;
    var cards = getJSON('hive-flashcards-v1', []);
    var sr = getJSON('hive-sr-v1', {});
    var target = String(active.subject).toLowerCase();
    var idxs = [];
    (Array.isArray(cards) ? cards : []).forEach(function (c, i) {
      if (c && String(c.subject || '').toLowerCase() === target) idxs.push(i);
    });
    /* struggling first: highest lapses at the top */
    idxs.sort(function (a, b) {
      return (((sr[cards[b].id] || {}).lapses || 0) - ((sr[cards[a].id] || {}).lapses || 0));
    });
    return idxs;
  }

  function wrap() {
    var cur = window.visibleCardIndices;
    if (!cur || cur.__cramWrapped) return;
    var base = cur;
    var wrapped = function () {
      var idxs = cramIndices();
      if (!idxs) return base();
      if (window.__srQueueOnly) {
        var sr = getJSON('hive-sr-v1', {});
        var cards = getJSON('hive-flashcards-v1', []);
        idxs = idxs.filter(function (i) {
          var st = sr[cards[i] && cards[i].id];
          return !st || !st.due || st.due <= Date.now();
        });
      }
      return idxs;
    };
    wrapped.__cramWrapped = true;
    window.visibleCardIndices = wrapped;
  }
  setInterval(wrap, 2000);

  function setCram(subject) {
    var ex = imminentExam();
    if (!subject) { active = null; return; }
    if (!ex || String(ex.subject).toLowerCase() !== String(subject).toLowerCase()) return;
    active = { subject: ex.subject, date: ex.date, days: ex.days };
  }
  function toggle(subject) {
    if (active && String(active.subject).toLowerCase() === String(subject).toLowerCase()) {
      active = null;
      toast('🧠 Cram mode off — back to the normal queue');
    } else {
      setCram(subject);
      toast('🧠 Cram: ' + subject + ' — struggling cards first');
    }
    try { if (window.renderFlashcards) window.renderFlashcards(); } catch (e) {}
    refreshButton();
  }
  function activeSubject() { return active ? active.subject : null; }

  /* ---------- UI: button inside the SR review area ---------- */
  function refreshButton() {
    var btn = document.getElementById('srCramBtn');
    var ex = imminentExam();
    if (!btn) return;
    if (!ex) {
      if (active && !imminentExam()) active = null;
      btn.style.display = 'none';
      return;
    }
    btn.style.display = '';
    var isOn = active && String(active.subject).toLowerCase() === String(ex.subject).toLowerCase();
    btn.textContent = isOn
      ? '🧠 Cram: ' + ex.subject + ' ON' + (ex.days === 0 ? ' (today)' : ' (tomorrow)')
      : '🧠 Cram: ' + ex.subject + (ex.days === 0 ? ' (today)' : ' (tomorrow)');
    btn.classList.toggle('on', isOn);
    /* badge reflects cram when active */
    var badge = document.getElementById('srBadge');
    if (badge && isOn) badge.textContent = '🧠 CRAM: ' + ex.subject + ' — struggling cards first';
  }
  function ensureButton() {
    if (document.getElementById('srCramBtn')) return;
    var toggleEl = document.getElementById('srToggle');
    if (!toggleEl) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'srCramBtn';
    btn.className = 'sr-toggle cram-btn';
    btn.addEventListener('click', function () {
      var ex = imminentExam();
      if (ex) toggle(ex.subject);
    });
    toggleEl.insertAdjacentElement('afterend', btn);
  }
  /* ---------- proactive surfacing on the daily plan card ----------
     Discovery gap fix: instead of only a button inside the Cards panel,
     the plan card itself says "Chemistry is TOMORROW — cram mode ready"
     with a direct tap that turns cram on and opens the review. */
  function ensurePlanCramHint() {
    try {
      var ex = imminentExam();
      var d = document.getElementById('planCardHintCram');
      var m = document.getElementById('planCardHintCramMob');
      if (!ex) {
        if (d) d.remove();
        if (m) m.remove();
        return;
      }
      var card = document.getElementById('dailyPlanCard');
      var mob = document.getElementById('mobPlanCard');
      var onClick = function () {
        if (!window.__cram || !window.__cram.active()) toggle(ex.subject);
        try { var cb = document.getElementById('cardsBtn'); if (cb) cb.click(); } catch (e) {}
      };
      if (card && !d) {
        d = document.createElement('button');
        d.id = 'planCardHintCram';
        d.type = 'button';
        d.className = 'plan-card-hint cram-ready';
        d.addEventListener('click', onClick);
        card.appendChild(d);
      }
      if (mob && !m) {
        m = document.createElement('button');
        m.id = 'planCardHintCramMob';
        m.type = 'button';
        m.className = 'plan-card-hint cram-ready';
        m.addEventListener('click', onClick);
        /* top of the card, not the bottom — the card's foot can sit under
           the fixed tab bar on small screens (QA round 17) */
        mob.insertBefore(m, mob.firstChild);
      }
      var on = !!(active && String(active.subject).toLowerCase() === String(ex.subject).toLowerCase());
      var label = on
        ? '🧠 Cram ON: ' + ex.subject + ' — open the review →'
        : '🧠 ' + ex.subject + (ex.days === 0 ? ' is TODAY' : ' is TOMORROW') + ' — cram mode is ready, open it →';
      if (d && d.textContent !== label) d.textContent = label;
      if (m && m.textContent !== label) m.textContent = label;
    } catch (e) {}
  }
  setInterval(function () { ensureButton(); refreshButton(); ensurePlanCramHint(); }, 2500);

  window.__cram = { active: activeSubject, set: setCram, toggle: toggle, imminent: imminentExam, indices: cramIndices, ensureHint: ensurePlanCramHint };
})();
