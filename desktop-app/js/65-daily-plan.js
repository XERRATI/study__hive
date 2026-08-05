/* =====================================================================
   Study Hive — 65-daily-plan.js
   EXAM-BASED DAILY PLAN ("what should I study today?").
   Pure arithmetic on data the app already has:
   · exam dates (hive-exams-v1)
   · minutes logged per subject (study-data-v2.subjects)
   · today's minutes (study-data-v2.dailyLog)
   Produces a ranked "today's move" — the subject with the closest exam
   that is furthest behind — and shows it on the Home card + Coach screen.
   SR CROSS-WIRE (round 13): spaced-repetition "Again" presses (lapses in
   hive-sr-v1) now boost a subject's priority when it has no exam edge —
   real struggle beats raw minutes. No AI needed. Fits the Sergeant/Queen
   coaching voice.
   ===================================================================== */

(function () {
  'use strict';
  function getJSON(k, fb) { try { return JSON.parse(localStorage.getItem(k) || 'null') || fb; } catch (e) { return fb; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function exams() { return getJSON('hive-exams-v1', []); }
  function studyData() { return getJSON('study-data-v2', { subjects: {}, dailyLog: {} }); }
  function todayKey() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* -------- SR struggle signal: "Again" presses per subject -------- */
  /* hive-sr-v1 stores per-card {reps, lapses, ease, interval, due}. The
     plan treats lapses (Again presses) as the strongest "you're actually
     struggling here" signal the app has — stronger than raw minutes. */
  function struggleMap() {
    var out = {};
    var cards = getJSON('hive-flashcards-v1', []);
    var sr = getJSON('hive-sr-v1', {});
    if (Array.isArray(cards)) {
      cards.forEach(function (c) {
        if (!c || !c.subject) return;
        var s = sr[c.id];
        if (!s) return;
        var e = out[c.subject] || (out[c.subject] = { lapses: 0, rated: 0 });
        e.lapses += (s.lapses || 0);
        e.rated += ((s.reps || 0) + (s.lapses || 0));
      });
    }
    return out;
  }

  /* -------- rank subjects: closest exam + furthest behind -------- */
  function plan() {
    var sd = studyData();
    var subs = sd.subjects || {};
    var today = todayKey();
    var todayMin = (sd.dailyLog && sd.dailyLog[today]) || 0;
    var ex = exams() || [];
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var struggle = struggleMap();

    var rows = Object.keys(subs).map(function (s) {
      var mins = subs[s] || 0;
      /* closest exam for this subject (string match, case-insensitive) */
      var closest = null;
      ex.forEach(function (e) {
        if (!e || !e.subject) return;
        if (String(e.subject).toLowerCase().indexOf(String(s).toLowerCase()) === -1 &&
            String(s).toLowerCase().indexOf(String(e.subject).toLowerCase()) === -1) return;
        var t = new Date(e.date + 'T00:00:00');
        if (isNaN(t.getTime())) return;
        if (!closest || t < closest) closest = t;
      });
      var days = closest ? Math.max(0, Math.ceil((closest - now) / 86400000)) : null;
      var st = struggle[s] || { lapses: 0, rated: 0 };
      return { name: s, mins: mins, days: days, lapses: st.lapses, rated: st.rated };
    });

    /* sort: has-exam & closest first, then most-behind — where "behind"
       means few minutes AND/OR many SR "Again" presses (5 lapses ≈ a
       600-minute head start in the ranking). Exam proximity still wins:
       the countdown is the countdown. */
    function behind(r) { return r.mins - Math.min(600, (r.lapses || 0) * 120); }
    rows.sort(function (a, b) {
      if (a.days !== null && b.days !== null) return a.days - b.days;
      if (a.days !== null) return -1;
      if (b.days !== null) return 1;
      return behind(a) - behind(b);
    });

    return { rows: rows, todayMin: todayMin, struggle: struggle };
  }

  /* -------- build the message -------- */
  function message() {
    var p = plan();
    var rows = p.rows;
    if (!rows.length) return { title: '🐝 Start the hive', body: 'Add a subject in Settings and the plan will tell you what to study today.', subject: null };

    var top = rows[0];
    var struggleNote = '';
    if (top.lapses >= 3) {
      struggleNote = ' ⚠️ You\'ve rated ' + top.lapses + ' ' + top.name + ' card(s) "Again" — review them after the recall pass.';
    }
    if (top.days === null) {
      return { title: '🐝 Today\'s move: ' + top.name, body: 'No exams yet — but you\'ve studied ' + Math.round(top.mins) + ' min of ' + top.name + '. A 25-min block keeps the comb growing.' + struggleNote, subject: top.name };
    }
    if (top.days <= 1) {
      return { title: '🔥 ' + top.name + ' is TOMORROW', body: 'You\'ve logged ' + Math.round(top.mins) + ' min. Do one focused recall pass now — even 15 min moves the needle.' + struggleNote, subject: top.name };
    }
    if (top.days <= 7) {
      return { title: '⏳ ' + top.name + ' in ' + top.days + 'd', body: 'You\'ve logged ' + Math.round(top.mins) + ' min. Today: one 25-min block of active recall + one past paper question.' + struggleNote, subject: top.name };
    }
    return { title: '🐝 Today\'s move: ' + top.name, body: 'Exam in ' + top.days + 'd · ' + Math.round(top.mins) + ' min logged. One honest 25-min block keeps you ahead.' + struggleNote, subject: top.name };
  }

  /* -------- inject into the UI: Home card + Coach screen -------- */
  function injectHome() {
    /* desktop home: place after the subtitle (inside the card) */
    var sub = document.getElementById('mainSubtitle');
    if (sub && !document.getElementById('dailyPlanCard')) {
      var card = document.createElement('div');
      card.id = 'dailyPlanCard';
      card.className = 'daily-plan-card';
      card.innerHTML = '<div class="daily-plan-title" id="dailyPlanTitle"></div><div class="daily-plan-body" id="dailyPlanBody"></div>';
      sub.insertAdjacentElement('afterend', card);
    }
    var t = document.getElementById('dailyPlanTitle'), b = document.getElementById('dailyPlanBody');
    if (t && b) {
      var m = message();
      t.textContent = m.title;
      b.textContent = m.body;
    }
  }

  function injectCoach() {
    /* hive coach panel: prepend the plan */
    var coach = document.getElementById('coachBody');
    if (coach && !document.getElementById('dailyPlanCoach')) {
      var div = document.createElement('div');
      div.id = 'dailyPlanCoach';
      div.className = 'daily-plan-coach';
      coach.insertAdjacentElement('afterbegin', div);
    }
    var el = document.getElementById('dailyPlanCoach');
    if (el) {
      /* XSS FIX: build via textContent nodes like the mobile version —
         subject names are user-entered and must never hit innerHTML. */
      var m = message();
      var t = el.querySelector('.daily-plan-title');
      var b = el.querySelector('.daily-plan-body');
      if (!t || !b) {
        el.innerHTML = '<div class="daily-plan-title"></div><div class="daily-plan-body"></div>';
        t = el.querySelector('.daily-plan-title');
        b = el.querySelector('.daily-plan-body');
      }
      t.textContent = m.title;
      b.textContent = m.body;
    }
  }

  /* mobile shell: expose for js/62 to render */
  window.dailyPlan = { message: message, plan: plan };

  setInterval(function () {
    injectHome();
    injectCoach();
  }, 5000);
  injectHome();
  injectCoach();
})();
