/* =====================================================================
   Study Hive — 66-hive-report.js
   HIVE REPORT — weekly recap (Spotify-Wrapped style).
   Reuses data the app already collects:
   · study-data-v2 (minutes, sessions, dailyLog, subjects)
   · hive-xp-v1 (XP, achievements)
   · hive-sr-v1 (cards reviewed this week)
   · studyhive-plan-followed-v1 (days the daily plan suggestion was done)
   Adds:
   · a shareable canvas image (streak + level + best subject + weekly
     minutes) that the user can save/forward
   · a recap panel reachable from Stats and the mobile Stats tab
   ===================================================================== */

(function () {
  'use strict';
  function getJSON(k, fb) { try { return JSON.parse(localStorage.getItem(k) || 'null') || fb; } catch (e) { return fb; } }
  function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });  }
  function fmtMin(m) { m = Math.round(m || 0); return m >= 60 ? Math.floor(m / 60) + 'h ' + (m % 60) + 'm' : m + 'm'; }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  var REPORT_KEY = 'hive-report-v1';
  var FOLLOW_KEY = 'studyhive-plan-followed-v1';

  /* ---------- weekly aggregation ---------- */
  function weekStart() {
    var d = new Date(); d.setHours(0, 0, 0, 0);
    var day = (d.getDay() + 6) % 7; /* Monday start */
    d.setDate(d.getDate() - day);
    return d.getTime();
  }
  function collect() {
    var sd = getJSON('study-data-v2', { subjects: {}, dailyLog: {}, sessionsTotal: 0, currentStreak: 0, bestStreak: 0, totalMinutes: 0 });
    var ws = weekStart();
    var daily = sd.dailyLog || {};
    var weekMinutes = 0, weekSessions = 0, weekDays = 0, dayMins = {};
    Object.keys(daily).forEach(function (k) {
      var ts = new Date(k + 'T00:00:00').getTime();
      if (!isNaN(ts) && ts >= ws) {
        var m = daily[k] || 0;
        weekMinutes += m; weekSessions++;
        var label = new Date(ts).toLocaleDateString(undefined, { weekday: 'short' });
        dayMins[label] = (dayMins[label] || 0) + m;
      }
    });
    weekDays = Object.keys(dayMins).length; /* round 14 fix: was never incremented */
    /* best subject by total minutes */
    var subs = sd.subjects || {};
    var best = Object.keys(subs).sort(function (a, b) { return (subs[b] || 0) - (subs[a] || 0); })[0] || null;

    /* cards reviewed this week: from hive-sr-v1, count ratings with timestamps */
    var sr = getJSON('hive-sr-v1', {});
    var cardsReviewed = 0;
    Object.keys(sr).forEach(function (id) {
      if (sr[id] && sr[id].lastReviewAt && sr[id].lastReviewAt >= ws) cardsReviewed++;
    });

    /* plan-followed days this week + running plan streak (consecutive days
       ending today — or yesterday if today isn't marked yet) */
    var followed = getJSON(FOLLOW_KEY, {});
    var planDays = 0;
    Object.keys(followed).forEach(function (k) {
      var ts = new Date(k + 'T00:00:00').getTime();
      if (!isNaN(ts) && ts >= ws && followed[k]) planDays++;
    });
    var planStreak = 0;
    (function () {
      var cursor = new Date(); cursor.setHours(0, 0, 0, 0);
      if (!followed[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
      while (followed[dateKey(cursor)]) { planStreak++; cursor.setDate(cursor.getDate() - 1); }
    })();

    var xp = (getJSON('hive-xp-v1', {})).xp || 0;
    var ach = ((getJSON('hive-xp-v1', {})).unlocked || []).length;

    /* round 14: focus quality + hive sync score.
       sync blends two habits into one headline number: days actually
       studied this week (50%) + days the daily plan was followed (50%). */
    var fq = window.focusQuality;
    var weekInt = (fq && fq.week) ? fq.week() : { count: 0 };
    var consistency = Math.min(100, Math.round(50 * (weekDays / 7) + 50 * (planDays / 7)));

    return {
      weekMinutes: weekMinutes,
      weekSessions: weekSessions,
      weekDays: weekDays,
      dayMins: dayMins,
      best: best,
      bestMin: best ? (subs[best] || 0) : 0,
      streak: sd.currentStreak || 0,
      bestStreak: sd.bestStreak || 0,
      totalMin: sd.totalMinutes || 0,
      xp: xp,
      ach: ach,
      cardsReviewed: cardsReviewed,
      planDays: planDays,
      planStreak: planStreak,
      interrupts: weekInt.count || 0,
      consistency: consistency
    };
  }

  /* ---------- shareable canvas image ---------- */
  function shareImage() {
    var r = collect();
    var canvas = document.createElement('canvas');
    canvas.width = 900; canvas.height = 560;
    var ctx = canvas.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, 0, 560);
    g.addColorStop(0, '#f4c430'); g.addColorStop(0.55, '#e29b1c'); g.addColorStop(1, '#c97a12');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 900, 560);
    /* decorative circles */
    ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(820, 80, 130, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(90, 500, 100, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fffaf2';
    ctx.font = '700 26px "Fredoka", Arial'; ctx.fillText('🐝 Study Hive — Weekly Report', 50, 60);
    ctx.font = '700 84px "Quicksand", Arial'; ctx.fillText(fmtMin(r.weekMinutes), 50, 160);
    ctx.font = '600 26px "Fredoka", Arial'; ctx.fillText('studied this week', 50, 198);
    ctx.font = '700 34px "Quicksand", Arial'; ctx.fillText('🔥 ' + r.streak + ' day streak', 50, 260);
    ctx.font = '700 34px "Quicksand", Arial'; ctx.fillText((r.best ? ('🏆 ' + r.best) : '🏆 —') + ' · ' + fmtMin(r.bestMin), 50, 310);
    ctx.font = '600 24px "Fredoka", Arial';
    ctx.fillText('🃏 ' + r.cardsReviewed + ' cards reviewed', 50, 370);
    ctx.fillText('📋 ' + r.planDays + ' days followed the plan' + (r.planStreak >= 2 ? ' · 🔥 ' + r.planStreak + '-day streak' : ''), 50, 404);
    ctx.fillText('⭐ ' + r.xp + ' XP · ' + r.ach + ' achievements', 50, 438);
    ctx.fillText('🎯 Hive sync ' + r.consistency + '% · ⚡ ' + r.interrupts + ' interruptions', 50, 472);
    ctx.fillText('Made with Study Hive 🍯', 50, 505);
    return canvas;
  }

  /* ---------- UI injection ---------- */
  function injectStats() {
    var stats = document.getElementById('awardsPanel') || document.getElementById('statsPanel');
    if (!stats || document.getElementById('hiveReportBox')) return;
    var box = document.createElement('div');
    box.id = 'hiveReportBox';
    box.className = 'hive-report-box';
    box.innerHTML =
      '<div class="hive-report-head">📊 Hive Report</div>' +
      '<div class="hive-report-body" id="hiveReportBody"></div>' +
      '<button class="settings-action-btn" id="hiveReportShare">📤 Share as image</button>';
    stats.appendChild(box);
    document.getElementById('hiveReportShare').addEventListener('click', function () {
      var c = shareImage();
      try {
        var url = c.toDataURL('image/png');
        var a = document.createElement('a');
        a.href = url; a.download = 'study-hive-report.png';
        document.body.appendChild(a); a.click(); a.remove();
        if (window.showMilestoneToast) window.showMilestoneToast('📤 Report image saved — share it!');
      } catch (e) {}
    });
  }
  function renderBody() {
    var el = document.getElementById('hiveReportBody');
    if (!el) return;
    var r = collect();
    var dayRows = Object.keys(r.dayMins).map(function (d) {
      return '<span class="hr-day">' + d + ' <b>' + Math.round(r.dayMins[d]) + 'm</b></span>';
    }).join('') || '<span class="hr-day">No sessions yet</span>';
    el.innerHTML =
      '<div class="hr-line"><b>' + fmtMin(r.weekMinutes) + '</b> studied this week</div>' +
      '<div class="hr-line"><b>' + r.weekSessions + '</b> sessions · <b>' + r.weekDays + '</b> days</div>' +
      '<div class="hr-line"><b>🔥 ' + r.streak + '</b> day streak (best ' + r.bestStreak + ')</div>' +
      '<div class="hr-line"><b>' + (r.best ? esc(r.best) : '—') + '</b> best subject · ' + fmtMin(r.bestMin) + '</div>' +
      '<div class="hr-line"><b>🃏 ' + r.cardsReviewed + '</b> cards reviewed · <b>📋 ' + r.planDays + '</b> plan days' + (r.planStreak >= 2 ? ' · 🔥 <b>' + r.planStreak + '</b>-day plan streak' : '') + '</div>' +
      '<div class="hr-line">🎯 Hive sync <b>' + r.consistency + '%</b> · ⚡ <b>' + r.interrupts + '</b> interruption' + (r.interrupts === 1 ? '' : 's') + ' this week</div>' +
      '<div class="hr-days">' + dayRows + '</div>';
  }

  setInterval(function () { injectStats(); renderBody(); }, 6000);
  injectStats(); renderBody();

  /* expose for mobile shell */
  window.hiveReport = { collect: collect, shareImage: shareImage, fmtMin: fmtMin };
})();
