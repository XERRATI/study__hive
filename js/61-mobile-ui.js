/* =====================================================================
   Study Hive — 61-mobile-ui.js
   PROFESSIONAL MOBILE UI — activates the moment mobile layout is on
   (body.is-mobile OR the "mobile layout" toggle in Settings).
   The desktop experience is untouched; mobile gets a native-feeling app
   shell: bottom tab bar, home dashboard, tools grid, focus timer page,
   stats page, and settings — all reusing the app's existing data & logic.
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var shell = null;
  var activeTab = 'home';
  var timerPaused = false;

  function isMobileOn() {
    return document.body.classList.contains('is-mobile') || document.body.classList.contains('force-mobile');
  }

  /* ---------------- BUILD THE SHELL ---------------- */
  function build() {
    if (shell) return;
    shell = document.createElement('div');
    shell.id = 'mobShell';
    shell.className = 'mob-shell';
    shell.innerHTML =
      '<header class="mob-header">' +
      '  <div class="mob-header-left"><div class="mob-logo">🐝 Study Hive</div><div class="mob-date" id="mobDate"></div></div>' +
      '  <div class="mob-header-right"><button class="mob-icon-btn" id="mobAdminBtn" title="Admin">🛠️</button></div>' +
      '</header>' +
      '<main class="mob-pages">' +
      '  <section class="mob-page" id="mobPageHome">' +
      '    <div class="mob-hero">' +
      '      <div class="mob-hero-greet" id="mobGreet">Good day, Bee</div>' +
      '      <div class="mob-hero-sub"><span id="mobHeroTime">Keep going — the hive is watching 🐝</span></div>' +
      '    </div>' +
      '    <div class="mob-stats-row">' +
      '      <button class="mob-stat" id="mobStatToday"><b id="mobTodayMin">0</b><span>Today min</span></button>' +
      '      <button class="mob-stat" id="mobStatStreak"><b id="mobStreak">0</b><span>Day streak</span></button>' +
      '      <button class="mob-stat" id="mobStatXP"><b id="mobXP">0</b><span>XP</span></button>' +
      '      <button class="mob-stat" id="mobStatBees"><b id="mobBees">0</b><span>Bees</span></button>' +
      '    </div>' +
      '    <div class="mob-card mob-quote">' +
      '      <div class="mob-quote-text" id="mobQuoteText">Loading…</div>' +
      '      <div class="mob-quote-foot"><span id="mobQuoteAuthor"></span><button class="mob-heart" id="mobHeartBtn">🤍</button></div>' +
      '    </div>' +
      '    <div class="mob-quick-label">Quick actions</div>' +
      '    <div class="mob-quick-grid">' +
      '      <button class="mob-quick primary" data-act="timer"><span>🎯</span>Focus</button>' +
      '      <button class="mob-quick" data-act="click" data-id="notesBtn"><span>📝</span>Notes</button>' +
      '      <button class="mob-quick" data-act="click" data-id="todoToggleBtn"><span>✅</span>Tasks</button>' +
      '      <button class="mob-quick" data-act="click" data-id="cardsBtn"><span>🗂️</span>Cards</button>' +
      '    </div>' +
      '    <div class="mob-quick-grid">' +
      '      <button class="mob-quick" data-act="click" data-id="sosBtn"><span>🆘</span>Calm</button>' +
      '      <button class="mob-quick" data-act="click" data-id="musicBtn"><span>🎵</span>Music</button>' +
      '      <button class="mob-quick" data-act="click" data-id="gardenBtn"><span>🌷</span>Garden</button>' +
      '      <button class="mob-quick" data-act="tools"><span>🧰</span>All tools</button>' +
      '    </div>' +
      '  </section>' +
      '  <section class="mob-page" id="mobPageTools">' +
      '    <h2 class="mob-page-title">Tools</h2>' +
      '    <div class="mob-tools-grid" id="mobToolsGrid"></div>' +
      '  </section>' +
      '  <section class="mob-page" id="mobPageTimer">' +
      '    <h2 class="mob-page-title">Focus</h2>' +
      '    <div class="mob-timer-card">' +
      '      <div class="mob-timer-time" id="mobTimerTime">25:00</div>' +
      '      <div class="mob-timer-label" id="mobTimerLabel">Ready when you are</div>' +
      '      <div class="mob-timer-progress"><div class="mob-timer-fill" id="mobTimerFill"></div></div>' +
      '      <div class="mob-chip-row" id="mobPresetRow">' +
      '        <button class="mob-chip" data-mins="15">15</button>' +
      '        <button class="mob-chip active" data-mins="25">25</button>' +
      '        <button class="mob-chip" data-mins="45">45</button>' +
      '      </div>' +
      '      <div class="mob-timer-btns">' +
      '        <button class="mob-btn big primary" id="mobTimerPlay">▶ Start</button>' +
      '        <button class="mob-btn big" id="mobTimerPause">⏸ Pause</button>' +
      '        <button class="mob-btn big" id="mobTimerStop">⏹ Stop</button>' +
      '      </div>' +
      '      <div class="mob-timer-extend">' +
      '        <button class="mob-btn small" id="mobTimerPlus5">+5 min</button>' +
      '        <button class="mob-btn small" id="mobTimerPlus10">+10 min</button>' +
      '        <button class="mob-btn small" id="mobTimerLockin">🔒 Lock in</button>' +
      '      </div>' +
      '    </div>' +
      '  </section>' +
      '  <section class="mob-page" id="mobPageStats">' +
      '    <h2 class="mob-page-title">Progress</h2>' +
      '    <div class="mob-card"><div class="mob-level-line" id="mobLevelLine">🥚 Egg</div><div class="mob-xp-bar"><div class="mob-xp-fill" id="mobXpFill"></div></div><div class="mob-xp-sub" id="mobXpSub">0 XP · 0% to next level</div></div>' +
      '    <div class="mob-card"><div class="mob-statlist" id="mobStatList"></div></div>' +
      '    <div class="mob-card"><div class="mob-statlist" id="mobAchList"></div></div>' +
      '  </section>' +
      '  <section class="mob-page" id="mobPageSettings">' +
      '    <h2 class="mob-page-title">Settings</h2>' +
      '    <div class="mob-card"><div class="mob-settings-list" id="mobSettingsList"></div></div>' +
      '  </section>' +
      '</main>' +
      '<nav class="mob-tabbar">' +
      '  <button class="mob-tab" data-tab="home"><span>🏠</span><em>Home</em></button>' +
      '  <button class="mob-tab" data-tab="tools"><span>🧰</span><em>Tools</em></button>' +
      '  <button class="mob-tab primary" data-tab="timer"><span>🎯</span><em>Focus</em></button>' +
      '  <button class="mob-tab" data-tab="stats"><span>📈</span><em>Stats</em></button>' +
      '  <button class="mob-tab" data-tab="settings"><span>⚙️</span><em>Settings</em></button>' +
      '</nav>';
    document.body.appendChild(shell);

    /* XP level badge moves into the header as a premium pill */
    var lb = document.getElementById('levelBadge');
    var hdrRight = $('mobAdminBtn') ? $('mobAdminBtn').parentElement : null;
    if (lb && hdrRight) {
      lb.id = 'levelBadge';
      lb.classList.add('mob-level-pill');
      hdrRight.insertBefore(lb, $('mobAdminBtn'));
    }

    /* EMBED THE REAL PC CARD into the home page so mobile looks like the
       desktop app (clock, countdown, quote) but inside the mobile shell. */
    var homePage = $('mobPageHome');
    var pcCard = document.querySelector('.card');
    if (homePage && pcCard) {
      pcCard.classList.add('mob-embedded-card');
      homePage.insertBefore(pcCard, homePage.firstChild);
    }

    /* tab switching */
    qa('.mob-tab').forEach(function (t) {
      t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); });
    });
    /* quick actions */
    qa('.mob-quick').forEach(function (b) {
      b.addEventListener('click', function () {
        var act = b.getAttribute('data-act');
        if (act === 'timer') switchTab('timer');
        else if (act === 'tools') switchTab('tools');
        else if (act === 'click') { var el = $(b.getAttribute('data-id')); if (el) el.click(); }
      });
    });
    /* admin */
    $('mobAdminBtn').addEventListener('click', function () { if (window.askAdmin) window.askAdmin(); });
    /* quote heart */
    $('mobHeartBtn').addEventListener('click', function () { if (window.toggleQuoteFav) window.toggleQuoteFav(); });
    /* timer controls */
    $('mobTimerPlay').addEventListener('click', timerPlay);
    $('mobTimerPause').addEventListener('click', timerPause);
    $('mobTimerStop').addEventListener('click', timerStop);
    $('mobTimerPlus5').addEventListener('click', function () { if (window.extendSession && window.extendSession(5)) timerPaused = false; });
    $('mobTimerPlus10').addEventListener('click', function () { if (window.extendSession && window.extendSession(10)) timerPaused = false; });
    $('mobTimerLockin').addEventListener('click', function () { var b = $('lockinBtn'); if (b) b.click(); });
    qa('#mobPresetRow .mob-chip').forEach(function (c) {
      c.addEventListener('click', function () {
        qa('#mobPresetRow .mob-chip').forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        timerPaused = false;
      });
    });

    buildToolsGrid();
    buildSettingsList();
  }

  function switchTab(tab) {
    activeTab = tab;
    qa('.mob-tab').forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-tab') === tab); });
    qa('.mob-page').forEach(function (p) { p.classList.toggle('active', p.id === 'mobPage' + tab.charAt(0).toUpperCase() + tab.slice(1)); });
  }

  /* ---------------- TOOLS GRID (reuses existing buttons) ---------------- */
  var TOOLS = [
    ['🐝', 'Coach', 'hiveCoachBtn'], ['🗂️', 'Cards', 'cardsBtn'], ['📝', 'Notes', 'notesBtn'],
    ['✅', 'Tasks', 'todoToggleBtn'], ['📅', 'Exams', 'examBtn'], ['📊', 'Grades', 'gradeBtn'],
    ['🌷', 'Garden', 'gardenBtn'], ['🎵', 'Music', 'musicBtn'], ['💧', 'Water', 'waterBtn'],
    ['🌬️', 'Breathe', 'breathingBtn'], ['🆘', 'Calm', 'sosBtn'], ['🗓️', 'Heatmap', 'heatmapBtn'],
    ['⚔️', 'Rival', 'rivalBtn'], ['❄️', 'Freeze', 'freezeBtn'], ['⏳', 'Capsule', 'capsuleBtn'],
    ['😂', 'Puns', 'punsBtn'], ['🍅', 'Pomodoro', 'hiveMenuBtn'], ['🕵️', 'Secrets', 'secretsBtn'],
    ['🎯', 'Challenge', 'challengeBtn'], ['🔤', 'Vocab', 'vocabBtn']
  ];
  function buildToolsGrid() {
    var grid = $('mobToolsGrid');
    if (!grid) return;
    grid.innerHTML = TOOLS.map(function (t) {
      return '<button class="mob-tool" data-id="' + t[2] + '"><span>' + t[0] + '</span><em>' + t[1] + '</em></button>';
    }).join('');
    qa('.mob-tool').forEach(function (b) {
      b.addEventListener('click', function () { var el = $(b.getAttribute('data-id')); if (el) el.click(); });
    });
  }

  /* ---------------- SETTINGS LIST ---------------- */
  function buildSettingsList() {
    var list = $('mobSettingsList');
    if (!list) return;
    list.innerHTML =
      '<button class="mob-settings-item" id="mobOpenSettings"><span>⚙️</span><em>Open Settings</em><i>›</i></button>' +
      '<button class="mob-settings-item" id="mobOpenBackup"><span>💾</span><em>Backup & export</em><i>›</i></button>' +
      '<button class="mob-settings-item" id="mobOpenHelp"><span>👑</span><em>Queen guide</em><i>›</i></button>' +
      '<button class="mob-settings-item" id="mobOpenTour"><span>🎬</span><em>Replay tour</em><i>›</i></button>';
    $('mobOpenSettings').addEventListener('click', function () { var b = $('settingsBtn'); if (b) b.click(); });
    $('mobOpenBackup').addEventListener('click', function () { var b = $('settingsBtn'); if (b) b.click(); setTimeout(function () { var p = $('backupCenterPanel'); if (p && p.classList) p.classList.add('show'); }, 400); });
    $('mobOpenHelp').addEventListener('click', function () { if (window.showQueenStoryGuide) window.showQueenStoryGuide(); });
    $('mobOpenTour').addEventListener('click', function () { try { localStorage.removeItem('studyhive-tour-seen-v1'); } catch (e) {} if (window.HiveTour && window.HiveTour.start) window.HiveTour.start(); });
  }

  /* ---------------- TIMER PAGE ---------------- */
  function timerPlay() {
    var active = document.querySelector('#mobPresetRow .mob-chip.active');
    var mins = active ? parseInt(active.getAttribute('data-mins'), 10) : 25;
    if (window.isPaused && window.isPaused()) { window.resumeSession(); timerPaused = false; return; }
    if (window.isSessionActive && window.isSessionActive()) { /* already running */ return; }
    var preset = document.querySelector('.focus-preset-btn[data-mins="' + mins + '"]');
    if (preset) { preset.click(); timerPaused = false; }
  }
  function timerPause() {
    if (window.pauseSession) { if (window.pauseSession()) timerPaused = true; }
  }
  function timerStop() {
    var b = $('focusStopBtn'); if (b) b.click(); timerPaused = false;
  }

  /* ---------------- SYNC (1s) ---------------- */
  function sync() {
    if (!shell) return;
    var now = new Date();
    var d = $('mobDate'); if (d) d.textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    /* hero */
    var days = $('days'), hours = $('hours'), mins = $('minutes'), secs = $('seconds');
    var goal = $('mainTitle'), sub = $('mainSubtitle');
    if ($('mobDays')) $('mobDays').textContent = days ? days.textContent : '00';
    if ($('mobGoalTitle')) $('mobGoalTitle').textContent = goal ? goal.textContent : '🎓 The Grind';
    var fill = $('timeElapsedFill'), pct = $('timeElapsedPct');
    if ($('mobHeroFill') && fill) $('mobHeroFill').style.width = fill.style.width || '0%';
    if ($('mobHeroPct') && pct) $('mobHeroPct').textContent = pct ? pct.textContent : '0%';
    if ($('mobHeroTime')) {
      var h = hours ? hours.textContent : '00', m = mins ? mins.textContent : '00';
      $('mobHeroTime').textContent = h + 'h ' + m + 'm left today';
    }

    /* greeting */
    if ($('mobGreet')) {
      var hr = now.getHours();
      var name = (get('studyhive-name-v1') || '').trim();
      var g = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
      $('mobGreet').textContent = g + (name ? ', ' + name : ', Bee');
    }

    /* quote */
    var qt = $('quoteText'), qa2 = $('quoteAuthorName'), heart = $('quoteFavBtn');
    if ($('mobQuoteText') && qt) $('mobQuoteText').textContent = qt.textContent;
    if ($('mobQuoteAuthor') && qa2) $('mobQuoteAuthor').textContent = qa2.textContent;
    if ($('mobHeartBtn') && heart) $('mobHeartBtn').textContent = heart.textContent;

    /* stats */
    var todayMin = 0, streak = 0, xp = 0, sessions = 0, totalMin = 0, best = 0, ach = 0;
    try {
      var sd = JSON.parse(get('study-data-v2') || '{}');
      var dk = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
      todayMin = (sd.dailyLog && sd.dailyLog[dk]) || 0;
      streak = sd.currentStreak || 0; sessions = sd.sessionsTotal || 0;
      totalMin = sd.totalMinutes || 0; best = sd.bestStreak || 0;
    } catch (e) {}
    try {
      var xd = JSON.parse(get('hive-xp-v1') || '{}');
      xp = typeof xd.xp === 'number' ? xd.xp : 0;
      ach = Array.isArray(xd.unlocked) ? xd.unlocked.length : 0;
    } catch (e) {}
    if ($('mobTodayMin')) $('mobTodayMin').textContent = todayMin;
    if ($('mobStreak')) $('mobStreak').textContent = streak;
    if ($('mobXP')) $('mobXP').textContent = xp;
    if ($('mobBees')) $('mobBees').textContent = qa('.hive-bee-el, .bee-wrap').length;

    /* timer page */
    var remain = window.sessionRemaining || 0;
    var total = window.sessionTotal || 1;
    if ($('mobTimerTime')) $('mobTimerTime').textContent = pad(Math.floor(remain / 60)) + ':' + pad(remain % 60);
    if ($('mobTimerFill')) $('mobTimerFill').style.width = Math.max(0, Math.min(100, ((total - remain) / total) * 100)) + '%';
    if ($('mobTimerLabel')) {
      if (window.isPaused && window.isPaused()) $('mobTimerLabel').textContent = 'Paused — resume when ready';
      else if (remain > 0) $('mobTimerLabel').textContent = 'Locked in — keep going';
      else $('mobTimerLabel').textContent = 'Ready when you are';
    }
    if ($('mobTimerPlay')) $('mobTimerPlay').textContent = (window.isPaused && window.isPaused()) ? '▶ Resume' : '▶ Start';

    /* stats page */
    var lb = $('levelBadge'); var lv = lb ? lb.textContent.replace('show', '') : '🥚 Egg';
    if ($('mobLevelLine')) $('mobLevelLine').textContent = lv.trim();
    if ($('mobXpSub')) {
      var next = 100; /* Egg->Larva default */
      var names = ['Egg', 'Larva', 'Worker', 'Drone', 'Guard', 'Queen Bee'];
      var minsArr = [0, 100, 300, 700, 1300, 2200];
      var idx = 0; for (var i = 0; i < minsArr.length; i++) if (xp >= minsArr[i]) idx = i;
      next = idx < minsArr.length - 1 ? minsArr[idx + 1] : minsArr[idx];
      var p = next > minsArr[idx] ? Math.min(100, Math.round(((xp - minsArr[idx]) / (next - minsArr[idx])) * 100)) : 100;
      if ($('mobXpFill')) $('mobXpFill').style.width = p + '%';
      $('mobXpSub').textContent = xp + ' XP · ' + p + '% to ' + names[idx + 1] || 'MAX';
    }
    if ($('mobStatList')) $('mobStatList').innerHTML =
      '<div class="mob-statrow"><span>Sessions</span><b>' + sessions + '</b></div>' +
      '<div class="mob-statrow"><span>Total time</span><b>' + Math.floor(totalMin / 60) + 'h ' + (totalMin % 60) + 'm</b></div>' +
      '<div class="mob-statrow"><span>Best streak</span><b>' + best + ' days</b></div>' +
      '<div class="mob-statrow"><span>Level</span><b>' + names[idx] + '</b></div>';
    if ($('mobAchList')) $('mobAchList').innerHTML = '<div class="mob-statrow"><span>Achievements</span><b>' + ach + ' unlocked</b></div>';
  }

  /* Fast timer-page ticker (feels live, updates every 250ms) */
  setInterval(function () {
    if (!shell || !shell.classList.contains('hidden') && !document.getElementById('mobPageTimer')) return;
    var remain = window.sessionRemaining || 0;
    var total = window.sessionTotal || 1;
    var t = $('mobTimerTime');
    if (t) t.textContent = pad(Math.floor(remain / 60)) + ':' + pad(remain % 60);
    var f = $('mobTimerFill');
    if (f) f.style.width = Math.max(0, Math.min(100, ((total - remain) / total) * 100)) + '%';
    var lbl = $('mobTimerLabel');
    if (lbl) {
      if (window.isPaused && window.isPaused()) lbl.textContent = 'Paused — resume when ready';
      else if (remain > 0) lbl.textContent = 'Locked in — keep going';
      else lbl.textContent = 'Ready when you are';
    }
    var pb = $('mobTimerPlay');
    if (pb) pb.textContent = (window.isPaused && window.isPaused()) ? '▶ Resume' : '▶ Start';
  }, 250);

  /* ---------------- WATCH MODE ---------------- */
  var lastMode = false;
  function check() {
    var on = isMobileOn();
    if (on && !lastMode) {
      build();
      document.body.classList.add('mobile-pro-ui');
      switchTab('home');
      sync();
    } else if (!on && lastMode) {
      if (shell) shell.classList.add('hidden');
    }
    lastMode = on;
    if (on) sync();
  }
  setInterval(check, 1000);
  if (isMobileOn()) { build(); document.body.classList.add('mobile-pro-ui'); switchTab('home'); }
})();
