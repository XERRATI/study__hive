/* =====================================================================
   Study Hive — 67-plan-notify-crosswire.js
   1. DAILY PLAN NOTIFICATION: once per day (per device), fire the
      daily-plan message as a local browser notification via the app's
      existing maybeNotify() — no new permission logic needed.
   2. CROSS-WIRE SR + PLAN: the spaced-repetition "due cards only" queue
      now surfaces the daily plan's top subject's due cards FIRST, so a
      student who just saw "study Chemistry today" gets Chemistry cards
      first in the review queue.
   3. PLAN-FOLLOWED TRACKING: when a focus session completes and its
      subject matches today's plan subject, mark the day as followed
      (used by the Hive Report).
   ===================================================================== */

(function () {
  'use strict';
  function getJSON(k, fb) { try { return JSON.parse(localStorage.getItem(k) || 'null') || fb; } catch (e) { return fb; } }
  function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayKey() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  var NOTIFY_KEY = 'studyhive-plan-notify-v1';
  var FOLLOW_KEY = 'studyhive-plan-followed-v1';

  /* ---------- 1. daily notification (once per day) ---------- */
  function maybeNotify() {
    var today = todayKey();
    var done = getJSON(NOTIFY_KEY, {});
    if (done[today]) return;
    if (!window.dailyPlan) return;
    var m = window.dailyPlan.message();
    if (m && m.subject && window.maybeNotify) {
      try { window.maybeNotify('🐝 ' + m.title + ' — ' + m.body); } catch (e) {}
    }
    done[today] = 1;
    setJSON(NOTIFY_KEY, done);
  }
  /* fire shortly after load, once a day */
  setTimeout(maybeNotify, 6000);
  setInterval(maybeNotify, 60 * 60 * 1000);

  /* ---------- 2. cross-wire SR queue: plan subject's due cards first ---------- */
  function topPlanSubject() {
    try {
      if (!window.dailyPlan) return null;
      var p = window.dailyPlan.plan();
      return (p && p.rows && p.rows.length && p.rows[0]) ? p.rows[0].name : null;
    } catch (e) { return null; }
  }

  /* Wrap the SR visibleCardIndices (already wrapped for due-only) so that,
     when the due-only queue is on, cards whose subject matches today's plan
     subject sort first. We re-wrap on an interval to stay on top of order. */
  function rewrap() {
    var cur = window.visibleCardIndices;
    if (!cur) return;
    /* our wrapper re-applies on top of the SR wrapper, and we only do it
       once; the SR due filter stays in place because we call cur() which
       already filters due cards when __srQueueOnly is on. */
    if (cur.__planWrapped) return;
    var base = cur;
    var wrapped = function () {
      var list = base();
      var subj = topPlanSubject();
      if (!subj) return list;
      try {
        var cards = JSON.parse(localStorage.getItem('hive-flashcards-v1') || '[]');
        var isSubj = function (i) { return cards[i] && String(cards[i].subject || '').toLowerCase() === String(subj).toLowerCase(); };
        var match = list.filter(isSubj);
        var rest = list.filter(function (i) { return !isSubj(i); });
        return match.concat(rest);
      } catch (e) { return list; }
    };
    wrapped.__planWrapped = true;
    window.visibleCardIndices = wrapped;
  }
  setInterval(rewrap, 2000);

  /* ---------- 3. plan-followed tracking ---------- */
  /* Hook the app's recordStudyCompleted (already wrapped elsewhere) — we
     wrap again in a chain-safe way by calling the current global. */
  var hooked = false;
  function hookFollow() {
    if (hooked) return;
    if (!window.recordStudyCompleted) return;
    hooked = true;
    var orig = window.recordStudyCompleted;
    window.recordStudyCompleted = function (subject, minutes) {
      try {
        var subj = topPlanSubject();
        if (subj && subject && String(subject).toLowerCase().indexOf(String(subj).toLowerCase()) !== -1) {
          var f = getJSON(FOLLOW_KEY, {});
          f[todayKey()] = 1;
          setJSON(FOLLOW_KEY, f);
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
  }
  setInterval(hookFollow, 1500);

  /* ---------- 4. plan-followed streak + achievements ---------- */
  /* Consecutive days the daily plan's subject was actually studied,
     counting back from today (or yesterday if today isn't marked yet). */
  function keyOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function planStreak() {
    var f = getJSON(FOLLOW_KEY, {});
    var cursor = new Date(); cursor.setHours(0, 0, 0, 0);
    if (!f[keyOf(cursor)]) cursor.setDate(cursor.getDate() - 1);
    var streak = 0;
    while (f[keyOf(cursor)]) { streak++; cursor.setDate(cursor.getDate() - 1); }
    return streak;
  }

  /* Show the streak inside every daily-plan message (desktop card, mobile
     card and the daily notification all render via dailyPlan.message()). */
  function wrapPlanMessage() {
    if (!window.dailyPlan || !window.dailyPlan.message || window.__planMessageWrapped) return;
    var orig = window.dailyPlan.message;
    window.__planMessageWrapped = true;
    window.dailyPlan.message = function () {
      var m = orig();
      var st = planStreak();
      if (st >= 2) m.body += ' · 🔥 ' + st + '-day plan streak';
      return m;
    };
  }
  setInterval(wrapPlanMessage, 1500);

  /* Unlock the streak achievements as the streak grows. */
  function checkPlanStreak() {
    var st = planStreak();
    if (st >= 7 && window.unlockAchievement) window.unlockAchievement('plan_legend');
    else if (st >= 3 && window.unlockAchievement) window.unlockAchievement('plan_loyal');
  }
  setInterval(checkPlanStreak, 8000);
  setTimeout(checkPlanStreak, 4000);

  /* ---------- 5. card-count nudge ---------- */
  /* The struggle cross-wire says "study X harder" — but if X only has a
     few cards, review can't fix that. When the plan's top subject has a
     high Again rate (>= 3 lapses) and fewer than 5 cards, show a button
     on the plan card: "add more cards for this subject". Clicking it
     opens the Cards panel pre-filtered to that subject. */
  function cardsForSubject(name) {
    try {
      var cards = JSON.parse(localStorage.getItem('hive-flashcards-v1') || '[]');
      if (!Array.isArray(cards)) return [];
      var n = String(name || '').toLowerCase();
      return cards.filter(function (c) { return c && String(c.subject || '').toLowerCase() === n; });
    } catch (e) { return []; }
  }
  function removePlanHint() {
    var d = document.getElementById('planCardHint'); if (d) d.remove();
    var m = document.getElementById('planCardHintMob'); if (m) m.remove();
  }
  function makeHintBtn(id, name, count) {
    var b = document.createElement('button');
    b.id = id;
    b.type = 'button';
    b.className = 'plan-card-hint';
    b.textContent = '📝 ' + name + ' has a high "Again" rate but only ' + count + ' card' + (count === 1 ? '' : 's') + ' — add more?';
    b.addEventListener('click', function () {
      try { var cb = document.getElementById('cardsBtn'); if (cb) cb.click(); } catch (e) {}
      try { var sel = document.getElementById('cardSubjectSelect'); if (sel) sel.value = name; } catch (e) {}
      try { var f = document.getElementById('cardFrontInput'); if (f) f.focus(); } catch (e) {}
    });
    return b;
  }
  function planCardHint() {
    try {
      var p = window.dailyPlan ? window.dailyPlan.plan() : null;
      var top = p && p.rows && p.rows[0];
      if (!top || (top.lapses || 0) < 3) { removePlanHint(); return; }
      var count = cardsForSubject(top.name).length;
      if (count >= 5) { removePlanHint(); return; }
      var card = document.getElementById('dailyPlanCard');
      if (card && !document.getElementById('planCardHint')) card.appendChild(makeHintBtn('planCardHint', top.name, count));
      var mob = document.getElementById('mobPlanCard');
      if (mob && !document.getElementById('planCardHintMob')) mob.appendChild(makeHintBtn('planCardHintMob', top.name, count));
    } catch (e) {}
  }
  setInterval(planCardHint, 3000);

  /* test hooks */
  window.__planStreak = planStreak;
  window.__checkPlanStreak = checkPlanStreak;
  window.__planCardHint = planCardHint;
})();
