/* =====================================================================
   Study Hive — 69-focus-quality.js
   FOCUS QUALITY — interruption tracking.
   A 25-minute session with 6 tab-aways used to count the same as 25
   unbroken minutes. Now: every time the page loses visibility (tab
   switch, app switch, window blur, page hide) WHILE a focus session is
   running, one interruption is counted for that session. When the
   session completes (chain-safe recordStudyCompleted hook) the record
   {subject, minutes, n} is stored per day in studyhive-interrupts-v1.
   The Hive Report surfaces the weekly total, and the Focus panel shows
   today's count. Real events — no idle-time guesses.
   ===================================================================== */

(function () {
  'use strict';
  function getJSON(k, fb) {
    if (window.shGetJSON) return window.shGetJSON(k, fb);
    try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch (e) { return fb; }
  }
  function setJSON(k, v) {
    if (window.shSetJSON) return window.shSetJSON(k, v);
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function dateKey(d) {
    if (window.shDateKey) return window.shDateKey(d);
    d = d || new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  var KEY = 'studyhive-interrupts-v1';
  var session = null; /* {subject, start, n} for the currently running session */

  function sessionActive() { try { return !!(window.isSessionActive && window.isSessionActive()); } catch (e) { return false; } }

  function bump() {
    if (!sessionActive()) return;
    if (!session) session = { subject: '', start: Date.now(), n: 0 };
    session.n++;
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') bump(); });
  window.addEventListener('blur', bump);
  window.addEventListener('pagehide', bump);

  function finalize(subject, minutes) {
    var n = session ? session.n : 0; /* no session object = zero interruptions */
    var subj = subject || (session ? session.subject : '') || 'General';
    session = null;
    if (n > 0) {
      try {
        var store = getJSON(KEY, {});
        var dk = dateKey();
        if (!Array.isArray(store[dk])) store[dk] = [];
        store[dk].push({ subject: subj, minutes: minutes || 0, n: n, ts: Date.now() });
        setJSON(KEY, store);
      } catch (e) {}
    } else {
      /* round 15: unbroken session — count it and reward clean focus.
         Achievement (Locked In at 5, with the built-in +25 XP) — the
         unlockAchievement guard makes repeats harmless. */
      try {
        var ub = getJSON('studyhive-unbroken-v1', { count: 0, lastTs: 0, best: 0 });
        ub.count++; ub.lastTs = Date.now(); ub.best = Math.max(ub.best, ub.count);
        setJSON('studyhive-unbroken-v1', ub);
        if (ub.count >= 5 && window.unlockAchievement) { try { window.unlockAchievement('locked_in'); } catch (e) {} }
      } catch (e) {}
    }
  }

  var hooked = false;
  function hook() {
    if (hooked || !window.recordStudyCompleted) return;
    hooked = true;
    var orig = window.recordStudyCompleted;
    window.recordStudyCompleted = function (subject, minutes) {
      var r = orig.apply(this, arguments);
      try { finalize(subject, minutes); } catch (e) {}
      return r;
    };
  }
  setInterval(hook, 1500);

  function weekStart() { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); }
  function week() {
    var store = getJSON(KEY, {});
    var ws = weekStart(), count = 0, sessions = 0;
    Object.keys(store).forEach(function (k) {
      var arr = store[k];
      if (!Array.isArray(arr)) return;
      arr.forEach(function (s) { if (s && s.ts >= ws) { count += s.n || 0; sessions++; } });
    });
    return { count: count, sessions: sessions };
  }
  function today() {
    var store = getJSON(KEY, {}), arr = store[dateKey()] || [], count = 0;
    arr.forEach(function (s) { count += s.n || 0; });
    return count;
  }
  function last() {
    var store = getJSON(KEY, {}), arr = store[dateKey()] || [];
    return arr.length ? arr[arr.length - 1] : null;
  }
  function unbroken() { return getJSON('studyhive-unbroken-v1', { count: 0, lastTs: 0, best: 0 }); }

  /* small chip in the Focus panel: today's interruptions + unbroken runs */
  function ensureChip() {
    var panel = document.getElementById('focusPanel');
    if (!panel || document.getElementById('interruptChip')) return;
    var chip = document.createElement('div');
    chip.id = 'interruptChip';
    chip.className = 'interrupt-chip';
    panel.appendChild(chip);
  }
  function refreshChip() {
    var chip = document.getElementById('interruptChip');
    if (!chip) return;
    var t = today(), ub = unbroken().count;
    chip.textContent = (t > 0 ? ('⚡ ' + t + ' interruption' + (t === 1 ? '' : 's') + ' today') : '⚡ 0 interruptions today') +
      ' · 🔒 ' + ub + ' unbroken session' + (ub === 1 ? '' : 's') + ' 🍯';
  }
  setInterval(function () { ensureChip(); refreshChip(); }, 2500);

  window.focusQuality = { bump: bump, finalize: finalize, week: week, today: today, last: last, unbroken: unbroken };
})();
