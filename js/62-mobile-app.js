/* =====================================================================
   Study Hive — 62-mobile-app.js
   THE MOBILE APP SHELL (final design from the prototypes).
   Activates only when mobile layout is on (auto on phones, or the
   mobile toggle in Settings). Desktop stays completely untouched.

   Wired to the REAL app everywhere:
   · timer      -> real focus engine (presets, pause/resume, extend, stop)
   · lock in    -> real lock-in overlay (js/59) incl. the bee dance
   · countdown  -> real goal/days/progress from the app state
   · quote      -> real quote rotator + favorites
   · stats      -> real study-data-v2 + hive-xp-v1
   · hive comb  -> real subjects with real minutes
   · music      -> the real generative lofi player
   · garden     -> real garden panel/world + minutes-based flowers
   · coach      -> real Hive Coach panel + main worry
   · panels     -> real app panels open above the shell
   · guide      -> spotlight tour + word tour (new)
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });  }

  var shell = null;
  var tab = 'home';
  var clockOn = get('studyhive-mob-clock-v1') !== '0';
  var hcOn = get('studyhive-high-contrast-v1') === '1';
  var audioCtx = null, musicNodes = [], musicTimer = null, musicOn = false, musicTrack = 'hive', musicVol = 0.3;
  var breatheInt = null, breatheOn = false;
  var guideMode = null, gIdx = 0;

  function isMobileOn() {
    return document.body.classList.contains('is-mobile') || document.body.classList.contains('force-mobile');
  }

  function studyData() { try { return JSON.parse(get('study-data-v2') || '{}'); } catch (e) { return {}; } }
  function xpData() { try { return JSON.parse(get('hive-xp-v1') || '{}'); } catch (e) { return {}; } }
  function userName() { return (get('studyhive-name-v1') || '').trim(); }
  function todayKey() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  /* ============================ BUILD SHELL ============================ */
  function build() {
    if (shell) return;
    shell = document.createElement('div');
    shell.id = 'mobShell';
    shell.className = 'mob-shell';
    shell.innerHTML = '' +
      /* welcome-back */
      '<div class="mob-welcome" id="mobWelcome">' +
      '  <div class="mob-welcome-card">' +
      '    <div class="mob-welcome-emoji">🐝</div>' +
      '    <h1 id="mobWelcomeTitle">Welcome back</h1>' +
      '    <p id="mobWelcomeLine">Your hive missed you.</p>' +
      '    <button class="mob-welcome-enter" id="mobWelcomeEnter">🍯 Enter the Hive</button>' +
      '    <br><button class="mob-welcome-skip" id="mobWelcomeSkip">No time to chat — straight in</button>' +
      '  </div>' +
      '</div>' +
      /* header */
      '<header class="mob-header">' +
      '  <button class="mob-hamburger" id="mobMenuBtn" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '  <div class="mob-brand-wrap">' +
      '    <div class="mob-brand">🐝 Study Hive</div>' +
      '    <div class="mob-greet" id="mobGreet"></div>' +
      '  </div>' +
      '  <div class="mob-header-icons"><button class="mob-icon-btn" data-goto="hive" title="Enter the Hive">🍯</button></div>' +
      '</header>' +
      '<main class="mob-wrap">' +

      /* HOME */
      '<section class="mob-screen active" id="mobScr-home">' +
      '  <div class="mob-home-grid">' +
      '    <div>' +
      '      <div class="mob-hero">' +
      '        <div class="mob-hero-label">Focus Timer</div>' +
      '        <div class="mob-hero-clock" id="mobClock"></div>' +
      '        <div class="mob-hero-timer" id="mobTimer">25:00</div>' +
      '        <div class="mob-hero-timer-label" id="mobTimerLabel">Ready when you are</div>' +
      '        <div class="mob-hero-progress"><div class="mob-hero-fill" id="mobHeroFill"></div></div>' +
      '        <div class="mob-hero-chips">' +
      '          <button class="mob-hero-chip" data-mins="15">15</button>' +
      '          <button class="mob-hero-chip active" data-mins="25">25</button>' +
      '          <button class="mob-hero-chip" data-mins="45">45</button>' +
      '        </div>' +
      '        <div class="mob-hero-btns">' +
      '          <button class="mob-hero-btn" id="mobHeroPlay">▶ Start</button>' +
      '          <button class="mob-hero-btn" id="mobHeroPlus5">+5</button>' +
      '          <button class="mob-hero-btn dark" id="mobHeroLockin">🔒 Lock in</button>' +
      '        </div>' +
      '      </div>' +
      '      <div class="mob-card">' +
      '        <div class="mob-card-row"><span class="mob-card-days" id="mobDays">90</span><span class="mob-card-label">days to go</span></div>' +
      '        <div class="mob-card-goal" id="mobGoal">🎓 The Grind</div>' +
      '        <div class="mob-card-progress"><div class="mob-card-fill" id="mobGoalFill"></div></div>' +
      '        <div class="mob-card-meta"><span id="mobGoalPct">62% there</span><span id="mobTodayLine">Today: 0 min</span></div>' +
      '      </div>' +
      '      <div class="mob-quote">' +
      '        <div class="mob-quote-text" id="mobQuoteText">"…"</div>' +
      '        <button class="mob-quote-heart" id="mobHeart">🤍</button>' +
      '      </div>' +
      '      <div class="mob-plan-card" id="mobPlanCard">' +
      '        <div class="mob-plan-title" id="mobPlanTitle"></div>' +
      '        <div class="mob-plan-body" id="mobPlanBody"></div>' +
      '      </div>' +
      '      <div class="mob-stats">' +
      '        <button class="mob-stat s1" data-goto="stats"><b id="mobStatToday">0</b><span>Today min</span></button>' +
      '        <button class="mob-stat s2" data-goto="stats"><b id="mobStatStreak">0</b><span>Streak</span></button>' +
      '        <button class="mob-stat s3" data-goto="stats"><b id="mobStatXP">0</b><span>XP</span></button>' +
      '        <button class="mob-stat s4" data-goto="stats"><b id="mobStatBees">0</b><span>Bees</span></button>' +
      '      </div>' +
      '      <div class="mob-music-card">' +
      '        <div class="mob-music-head"><h3>🎵 Focus Music</h3><span class="mob-music-state" id="mobMusicState">Stopped</span></div>' +
      '        <div class="mob-music-tracks">' +
      '          <button class="mob-music-track active" data-track="hive">🎹 Hive Hum</button>' +
      '          <button class="mob-music-track" data-track="rain">🌧️ Rain</button>' +
      '          <button class="mob-music-track" data-track="forest">🌲 Forest</button>' +
      '          <button class="mob-music-track" data-track="waves">🌊 Waves</button>' +
      '        </div>' +
      '        <div class="mob-music-controls">' +
      '          <button class="mob-music-play" id="mobMusicPlay">▶</button>' +
      '          <div class="mob-music-vol"><span>🔉</span><input type="range" min="0" max="100" value="30" id="mobMusicVol"><em id="mobMusicVolPct">30%</em></div>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="mob-side">' +
      '      <div class="mob-section-label">The Hive</div>' +
      '      <div class="mob-hive-zone" data-goto="hive">' +
      '        <span class="mob-hive-drip d1">🍯</span><span class="mob-hive-drip d2">🍯</span><span class="mob-hive-drip d3">🍯</span>' +
      '        <div class="mob-hive-icon">🍯</div>' +
      '        <div class="mob-hive-info">' +
      '          <div class="mob-hive-title">Hive Progress</div>' +
      '          <div class="mob-hive-sub" id="mobHiveSub">0% · 0 bees working</div>' +
      '          <div class="mob-hive-bar"><div class="mob-hive-fill" id="mobHiveFill"></div></div>' +
      '        </div>' +
      '        <span class="mob-hive-arrow">›</span>' +
      '      </div>' +
      '      <button class="mob-enter-hive" data-goto="hive">🍯 Enter the Hive</button>' +
      '      <div class="mob-section-label">Quick Tools</div>' +
      '      <div class="mob-tools">' +
      '        <button class="mob-tool" data-goto="focus"><span>🎯</span><em>Focus</em><small>Start a block</small></button>' +
      '        <button class="mob-tool calm" data-goto="calm"><span>🆘</span><em>Calm</em><small>Reset & breathe</small></button>' +
      '        <button class="mob-tool breathe" data-goto="breathe"><span>🌬️</span><em>Breathe</em><small>Slow it down</small></button>' +
      '        <button class="mob-tool" data-goto="garden"><span>🌷</span><em>Garden</em><small>Grow your field</small></button>' +
      '        <button class="mob-tool" data-goto="hive"><span>🍯</span><em>The Hive</em><small>See the comb</small></button>' +
      '        <button class="mob-tool" data-goto="coach"><span>🐝</span><em>Coach</em><small>Smart next move</small></button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</section>' +

      /* HIVE */
      '<section class="mob-screen" id="mobScr-hive">' +
      '  <h2 class="mob-screen-title">Inside the Hive</h2>' +
      '  <p class="mob-screen-sub">Every cell is one of your subjects. The honey inside it is the time you have stored there.</p>' +
      '  <div class="mob-hive-interior">' +
      '    <div class="mob-hi-head"><h3>🍯 Your Honeycomb</h3><span id="mobHiTotal">0 min stored</span></div>' +
      '    <div class="mob-bee-work-zone">' +
      '      <span class="mob-work-bee wb1">🐝</span><span class="mob-work-bee wb2">🐝</span>' +
      '      <span class="mob-work-bee wb3">🐝</span><span class="mob-work-bee wb4">🐝</span>' +
      '      <span class="mob-work-bee wb5">🐝</span><span class="mob-work-bee wb6">🐝</span>' +
      '    </div>' +
      '    <div class="mob-comb" id="mobComb"></div>' +
      '    <div class="mob-cell-detail" id="mobCellDetail"></div>' +
      '  </div>' +
      '</section>' +

      /* GARDEN */
      '<section class="mob-screen" id="mobScr-garden">' +
      '  <h2 class="mob-screen-title">Garden World</h2>' +
      '  <p class="mob-screen-sub">Every minute you study waters a flower. Keep coming back and the garden fills with colour.</p>' +
      '  <div class="mob-garden">' +
      '    <div class="mob-g-head"><h3>🌷 Your Garden</h3><span id="mobGardenSub">Watered by 0 min</span></div>' +
      '    <div class="mob-flower-row" id="mobFlowerRow"></div>' +
      '    <div class="mob-g-actions">' +
      '      <button class="mob-g-btn gold" id="mobWaterBtn">💧 Water</button>' +
      '      <button class="mob-g-btn" id="mobGardenOpen">🌷 Open Garden World</button>' +
      '      <button class="mob-g-btn" id="mobGardenPanelBtn">🌱 Garden panel</button>' +
      '    </div>' +
      '    <div class="mob-g-journal"><h4>📔 Garden journal</h4><div class="mob-gj-line" id="mobJournalLine">"Every minute grows something." — the Queen</div></div>' +
      '  </div>' +
      '</section>' +

      /* FOCUS */
      '<section class="mob-screen" id="mobScr-focus">' +
      '  <h2 class="mob-screen-title">Focus</h2>' +
      '  <div class="mob-timer-card">' +
      '    <div class="mob-timer-time" id="mobFocusTime">25:00</div>' +
      '    <div class="mob-timer-label" id="mobFocusLabel">Ready when you are</div>' +
      '    <div class="mob-timer-progress"><div class="mob-timer-fill" id="mobFocusFill"></div></div>' +
      '    <div class="mob-chip-row">' +
      '      <button class="mob-chip" data-mins="15">15</button>' +
      '      <button class="mob-chip active" data-mins="25">25</button>' +
      '      <button class="mob-chip" data-mins="45">45</button>' +
      '    </div>' +
      '    <div class="mob-timer-btns">' +
      '      <button class="mob-btn primary" id="mobFocusPlay">▶ Start</button>' +
      '      <button class="mob-btn" id="mobFocusPause">⏸ Pause</button>' +
      '      <button class="mob-btn" id="mobFocusStop">⏹ Stop</button>' +
      '    </div>' +
      '    <div class="mob-timer-extend">' +
      '      <button class="mob-btn small" id="mobFocusPlus5">+5 min</button>' +
      '      <button class="mob-btn small" id="mobFocusPlus10">+10 min</button>' +
      '      <button class="mob-btn small lockin" id="mobFocusLockin">🔒 Lock in</button>' +
      '    </div>' +
      '    <div class="mob-timer-subject"><label>Subject</label><select id="mobSubjectSelect"></select></div>' +
      '  </div>' +
      '</section>' +

      /* CALM */
      '<section class="mob-screen" id="mobScr-calm">' +
      '  <h2 class="mob-screen-title">Calm</h2>' +
      '  <div class="mob-calm-card">' +
      '    <div class="mob-calm-emoji">🐝</div>' +
      '    <h3 id="mobCalmTitle">Take a breath. You are doing better than you think.</h3>' +
      '    <p id="mobCalmLine">One task at a time. The hive was not built in a day either.</p>' +
      '    <button class="mob-calm-btn" id="mobCalmBtn">Another gentle reminder</button>' +
      '  </div>' +
      '</section>' +

      /* BREATHE */
      '<section class="mob-screen" id="mobScr-breathe">' +
      '  <h2 class="mob-screen-title">Breathe</h2>' +
      '  <div class="mob-calm-card">' +
      '    <div class="mob-breath-circle"><span id="mobBreathWord">Breathe in</span></div>' +
      '    <p>4 seconds in · 4 seconds hold · 6 seconds out</p>' +
      '    <button class="mob-calm-btn" id="mobBreatheBtn">Start the rhythm</button>' +
      '  </div>' +
      '</section>' +

      /* TOOLS */
      '<section class="mob-screen" id="mobScr-tools">' +
      '  <h2 class="mob-screen-title">Tools</h2>' +
      '  <div class="mob-tools" id="mobAllTools"></div>' +
      '</section>' +

      /* STATS */
      '<section class="mob-screen" id="mobScr-stats">' +
      '  <h2 class="mob-screen-title">Progress</h2>' +
      '  <div class="mob-level-card">' +
      '    <div class="mob-level-line" id="mobLevelLine">🥚 Egg</div>' +
      '    <div class="mob-xp-bar"><div class="mob-xp-fill" id="mobXpFill"></div></div>' +
      '    <div class="mob-xp-sub" id="mobXpSub">0 XP</div>' +
      '  </div>' +
      '  <div class="mob-level-card" id="mobStatList"></div>' +
      '</section>' +

      /* COACH */
      '<section class="mob-screen" id="mobScr-coach">' +
      '  <h2 class="mob-screen-title">Hive Coach</h2>' +
      '  <div class="mob-coach-hero">' +
      '    <div class="mob-coach-emoji">🐝</div>' +
      '    <h3 id="mobCoachTitle">Your smart next move</h3>' +
      '    <p id="mobCoachLine">Open the coach to plan your weakest topic.</p>' +
      '  </div>' +
      '  <button class="mob-enter-hive" id="mobCoachOpen" style="margin-top:12px;">🐝 Open Hive Coach</button>' +
      '</section>' +

      /* SETTINGS */
      '<section class="mob-screen" id="mobScr-settings">' +
      '  <h2 class="mob-screen-title">Settings</h2>' +
      '  <div class="mob-level-card" id="mobSettingsList"></div>' +
      '</section>' +

      /* GUIDE */
      '<section class="mob-screen" id="mobScr-guide">' +
      '  <h2 class="mob-screen-title">👑 Queen Guide</h2>' +
      '  <p class="mob-screen-sub">Two ways to learn the hive — pick whichever suits you.</p>' +
      '  <div class="mob-level-card">' +
      '    <div class="mob-coach-card"><div class="mob-cc-ico">✨</div><div><div class="mob-cc-title">Spotlight tour</div><div class="mob-cc-sub">I walk you around the hive and light up each part.</div></div></div>' +
      '    <button class="mob-g-btn gold" id="mobGuideSpot" style="margin-top:12px;">Start spotlight tour</button>' +
      '  </div>' +
      '  <div class="mob-level-card">' +
      '    <div class="mob-coach-card"><div class="mob-cc-ico">📖</div><div><div class="mob-cc-title">Word tour</div><div class="mob-cc-sub">Everything explained in plain words.</div></div></div>' +
      '    <button class="mob-g-btn gold" id="mobGuideWords" style="margin-top:12px;">Start word tour</button>' +
      '  </div>' +
      '</section>' +
      '</main>' +

      /* BOTTOM BAR */
      '<nav class="mob-bottombar">' +
      '  <button class="mob-bb active" data-goto="home"><span>🏠</span><em>Home</em></button>' +
      '  <button class="mob-bb" data-goto="hive"><span>🍯</span><em>Hive</em></button>' +
      '  <button class="mob-bb focus" data-goto="focus"><span>🎯</span><em>Focus</em></button>' +
      '  <button class="mob-bb" data-goto="garden"><span>🌷</span><em>Garden</em></button>' +
      '  <button class="mob-bb" data-goto="coach"><span>🐝</span><em>Coach</em></button>' +
      '  <button class="mob-bb" data-goto="stats"><span>📈</span><em>Stats</em></button>' +
      '  <button class="mob-bb" data-goto="settings"><span>⚙️</span><em>Settings</em></button>' +
      '</nav>' +

      /* DRAWER */
      '<div class="mob-drawer-overlay" id="mobDrawerOverlay"></div>' +
      '<aside class="mob-drawer" id="mobDrawer">' +
      '  <div class="mob-drawer-head"><h3>🐝 Study Hive</h3><button class="mob-drawer-close" id="mobDrawerClose">✕</button></div>' +
      '  <div class="mob-drawer-body">' +
      '    <div class="mob-drawer-label">Screens</div>' +
      '    <button class="mob-drawer-link" data-goto="home"><span>🏠</span><em>Home</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="hive"><span>🍯</span><em>The Hive</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="focus"><span>🎯</span><em>Focus</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="garden"><span>🌷</span><em>Garden World</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="stats"><span>📈</span><em>Stats</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="coach"><span>🐝</span><em>Coach</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="settings"><span>⚙️</span><em>Settings</em><i>›</i></button>' +
      '    <div class="mob-drawer-label">Quick Tools</div>' +
      '    <button class="mob-drawer-link" data-goto="focus"><span>🎯</span><em>Focus</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="calm"><span>🆘</span><em>Calm</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="breathe"><span>🌬️</span><em>Breathe</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="garden"><span>🌷</span><em>Garden</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="hive"><span>🍯</span><em>The Hive</em><i>›</i></button>' +
      '    <button class="mob-drawer-link" data-goto="coach"><span>🐝</span><em>Coach</em><i>›</i></button>' +
      '    <div class="mob-drawer-label">All Tools</div>' +
      '    <div id="mobDrawerTools"></div>' +
      '  </div>' +
      '</aside>' +

      /* GUIDE OVERLAY */
      '<div class="mob-guide-overlay" id="mobGuideOverlay">' +
      '  <div class="mob-guide-spot" id="mobGuideSpot"></div>' +
      '  <div class="mob-guide-card" id="mobGuideCard">' +
      '    <h3 id="mobGuideTitle"></h3><p id="mobGuideBody"></p>' +
      '    <div class="mob-guide-actions"><button class="sec" id="mobGuideBack">Back</button><button id="mobGuideNext">Next</button><button class="sec" id="mobGuideSkip">Skip</button></div>' +
      '  </div>' +
      '  <div class="mob-guide-words" id="mobGuideWords" style="display:none;"><h3>📖 The Hive in Words</h3><div id="mobGuideWordsBody"></div><button class="mob-guide-close" id="mobGuideWordsClose">Done</button></div>' +
      '</div>';

    document.body.appendChild(shell);
    if (clockOn) document.body.classList.add('mob-show-clock');
    if (hcOn) document.body.classList.add('mob-hc');

    /* welcome-back: replace the PC welcome on mobile */
    var pcWelcome = document.getElementById('welcomeScreen');
    if (pcWelcome) { pcWelcome.classList.add('hidden'); document.body.classList.remove('welcome-locked'); }

    wireShell();
  }

  /* ============================ WIRING ============================ */
  function wireShell() {
    /* tabs */
    qa('.mob-bb, [data-goto]').forEach(function (el) {
      el.addEventListener('click', function () { goTab(el.getAttribute('data-goto')); });
    });
    /* drawer */
    var drawer = $('mobDrawer'), o = $('mobDrawerOverlay');
    $('mobMenuBtn').addEventListener('click', function () { drawer.classList.add('show'); o.classList.add('show'); });
    $('mobDrawerClose').addEventListener('click', function () { drawer.classList.remove('show'); o.classList.remove('show'); });
    o.addEventListener('click', function () { drawer.classList.remove('show'); o.classList.remove('show'); });

    /* welcome */
    function dismissWelcome() { var w = $('mobWelcome'); w.classList.add('hidden'); setTimeout(function () { w.style.display = 'none'; }, 450); }
    $('mobWelcomeEnter').addEventListener('click', dismissWelcome);
    $('mobWelcomeSkip').addEventListener('click', dismissWelcome);

    /* quote */
    $('mobHeart').addEventListener('click', function () { if (window.toggleQuoteFav) window.toggleQuoteFav(); });

    /* timer controls */
    $('mobHeroPlay').addEventListener('click', heroPlayToggle);
    $('mobHeroPlus5').addEventListener('click', function () { if (window.extendSession) window.extendSession(5); });
    $('mobHeroLockin').addEventListener('click', openRealLockin);
    $('mobFocusPlay').addEventListener('click', focusPlay);
    $('mobFocusPause').addEventListener('click', function () { if (window.pauseSession) window.pauseSession(); });
    $('mobFocusStop').addEventListener('click', function () { var b = $('focusStopBtn'); if (b) b.click(); });
    $('mobFocusPlus5').addEventListener('click', function () { if (window.extendSession) window.extendSession(5); });
    $('mobFocusPlus10').addEventListener('click', function () { if (window.extendSession) window.extendSession(10); });
    $('mobFocusLockin').addEventListener('click', openRealLockin);
    qa('.mob-hero-chip, .mob-chip').forEach(function (c) {
      c.addEventListener('click', function () {
        qa('.mob-hero-chip, .mob-chip').forEach(function (x) { x.classList.remove('active'); });
        c.classList.add('active');
        /* stop any running session first */
        var stop = $('focusStopBtn'); if (stop) stop.click();
      });
    });
    /* subject select mirrors the real one */
    var ss = $('subjectSelect'), mss = $('mobSubjectSelect');
    if (ss && mss) {
      syncSubjects();
      mss.addEventListener('change', function () { if (ss) ss.value = mss.value; });
      setInterval(syncSubjects, 2000);
    }

    /* music */
    $('mobMusicPlay').addEventListener('click', function () { if (musicOn) mobStopMusic(); else mobPlayMusic(musicTrack); });
    qa('.mob-music-track').forEach(function (b) {
      b.addEventListener('click', function () {
        qa('.mob-music-track').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        musicTrack = b.getAttribute('data-track');
        if (musicOn) mobPlayMusic(musicTrack);
      });
    });
    $('mobMusicVol').addEventListener('input', function () {
      musicVol = parseInt(this.value, 10) / 100;
      $('mobMusicVolPct').textContent = this.value + '%';
      set('studyhive-bg-volume-v1', this.value);
      try { if (window.__lofiMaster && window.__lofiMaster.gain) window.__lofiMaster.gain.setValueAtTime(window.lofiVol ? window.lofiVol() : 0.75, 0); } catch (e) {}
    });

    /* calm */
    $('mobCalmBtn').addEventListener('click', function () {
      var l = CALM_LINES[Math.floor(Math.random() * CALM_LINES.length)];
      $('mobCalmLine').textContent = l;
    });
    /* breathe */
    $('mobBreatheBtn').addEventListener('click', function () {
      if (breatheOn) { clearInterval(breatheInt); breatheOn = false; this.textContent = 'Start the rhythm'; return; }
      breatheOn = true; this.textContent = 'Stop';
      var words = ['Breathe in', 'Hold', 'Breathe out'], wi = 0;
      $('mobBreathWord').textContent = words[0];
      breatheInt = setInterval(function () { wi = (wi + 1) % 3; $('mobBreathWord').textContent = words[wi]; }, 4000);
    });

    /* garden */
    $('mobWaterBtn').addEventListener('click', function () {
      $('mobJournalLine').textContent = JOURNAL[Math.floor(Math.random() * JOURNAL.length)];
    });
    $('mobGardenOpen').addEventListener('click', function () { var b = $('enterGardenWorldBtn'); if (b) b.click(); else if ($('gardenBtn')) $('gardenBtn').click(); });
    $('mobGardenPanelBtn').addEventListener('click', function () { var b = $('gardenBtn'); if (b) b.click(); });

    /* coach */
    $('mobCoachOpen').addEventListener('click', function () { var b = $('hiveCoachBtn'); if (b) b.click(); });

    /* settings list */
    buildSettings();
    /* all tools */
    buildTools();
    /* guide */
    $('mobGuideSpot').addEventListener('click', guideSpotStart);
    $('mobGuideWords').addEventListener('click', guideWordsStart);
    $('mobGuideNext').addEventListener('click', function () { if (gIdx < SPOT_STEPS.length - 1) { gIdx++; guideSpotRender(); } else closeGuide(); });
    $('mobGuideBack').addEventListener('click', function () { if (gIdx > 0) { gIdx--; guideSpotRender(); } });
    $('mobGuideSkip').addEventListener('click', closeGuide);
    $('mobGuideWordsClose').addEventListener('click', closeGuide);

    /* comb + garden render */
    renderComb();
    renderGarden();
    syncAll();
  }

  function goTab(name) {
    tab = name;
    qa('.mob-screen').forEach(function (s) { s.classList.toggle('active', s.id === 'mobScr-' + name); });
    qa('.mob-bb').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-goto') === name); });
    var d = $('mobDrawer'); if (d) { d.classList.remove('show'); var o = $('mobDrawerOverlay'); if (o) o.classList.remove('show'); }
    window.scrollTo({ top: 0 });
    if (name === 'hive') renderComb();
    if (name === 'garden') renderGarden();
    if (name === 'focus') syncSubjects();
  }
  /* hoisted to the IIFE scope: it used to be declared inside an `if` block,
     which made it block-scoped under 'use strict' — goTab('focus') threw
     "syncSubjects is not defined" on every Focus-tab tap. (QA round 16) */
  function syncSubjects() {
    var ss = $('subjectSelect'), mss = $('mobSubjectSelect');
    if (!ss || !mss) return;
    mss.innerHTML = ss.innerHTML;
    mss.value = ss.value;
  }
  window.goTab = goTab; /* used by home-screen shortcut deep links */

  /* ============================ TIMER ============================ */
  function activeMins() {
    var c = document.querySelector('.mob-hero-chip.active, .mob-chip.active');
    return c ? parseInt(c.getAttribute('data-mins'), 10) : 25;
  }
  function heroPlayToggle() {
    if (window.isSessionActive && window.isSessionActive()) {
      var stop = $('focusStopBtn'); if (stop) stop.click();
      setTimeout(function () { syncAll(); }, 60); /* instant button flip */
    } else {
      var preset = document.querySelector('.focus-preset-btn[data-mins="' + activeMins() + '"]');
      if (preset) preset.click();
    }
  }
  function focusPlay() {
    if (window.isPaused && window.isPaused()) { if (window.resumeSession) window.resumeSession(); return; }
    if (window.isSessionActive && window.isSessionActive()) return;
    var preset = document.querySelector('.focus-preset-btn[data-mins="' + activeMins() + '"]');
    if (preset) preset.click();
  }
  function openRealLockin() {
    var b = $('lockinBtn'); if (b) { b.click(); return; }
    /* fallback: start then open the lock-in overlay if it exists */
    var ov = $('lockinOverlay');
    if (ov) { ov.classList.add('show'); document.body.classList.add('lockin-mode'); }
  }

  /* ============================ MUSIC ============================ */
  function ensureCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); return audioCtx; }
  function noiseBuffer(ctx) { var b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
  function mobStopMusic() {
    clearInterval(musicTimer); musicTimer = null;
    musicNodes.forEach(function (n) { try { n.stop && n.stop(); } catch (e) {} try { n.disconnect && n.disconnect(); } catch (e) {} });
    musicNodes = []; musicOn = false;
    $('mobMusicState').textContent = 'Stopped';
    $('mobMusicPlay').textContent = '▶';
    var real = $('musicStopBtn'); if (real) real.click();
  }
  function mobPlayMusic(track) {
    mobStopMusic();
    /* also stop the real lofi player so they don't double up */
    var realStop = $('musicStopBtn'); if (realStop) realStop.click();
    var ctx = ensureCtx();
    var master = ctx.createGain(); master.gain.value = musicVol * 0.6; master.connect(ctx.destination);
    musicNodes.push(master);
    if (track === 'hive') {
      [110, 112].forEach(function (f) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.4; o.connect(g); g.connect(master); o.start(); musicNodes.push(o, g); });
    } else if (track === 'rain') {
      var src = ctx.createBufferSource(); src.buffer = noiseBuffer(ctx); src.loop = true;
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
      src.connect(f); f.connect(master); src.start(); musicNodes.push(src, f);
    } else if (track === 'forest') {
      var src2 = ctx.createBufferSource(); src2.buffer = noiseBuffer(ctx); src2.loop = true;
      var f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 700; f2.Q.value = 0.5;
      src2.connect(f2); f2.connect(master); src2.start(); musicNodes.push(src2, f2);
      musicTimer = setInterval(function () {
        if (Math.random() < 0.5) return;
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 1600 + Math.random() * 900;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
        o.connect(g); g.connect(master); o.start(); o.stop(ctx.currentTime + 0.18);
        musicNodes.push(o, g);
      }, 2600);
    } else if (track === 'waves') {
      var src3 = ctx.createBufferSource(); src3.buffer = noiseBuffer(ctx); src3.loop = true;
      var f3 = ctx.createBiquadFilter(); f3.type = 'lowpass'; f3.frequency.value = 500;
      var lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.12;
      var lg = ctx.createGain(); lg.gain.value = 0.08;
      lfo.connect(lg); lg.connect(master.gain);
      src3.connect(f3); f3.connect(master); src3.start(); lfo.start();
      musicNodes.push(src3, f3, lfo, lg);
    }
    musicOn = true;
    $('mobMusicState').textContent = 'Playing · ' + track;
    $('mobMusicPlay').textContent = '⏸';
  }

  /* ============================ COMB ============================ */
  var LEVELS = [{ n: 'Egg', i: '🥚', m: 0 }, { n: 'Larva', i: '🐛', m: 100 }, { n: 'Worker', i: '🐝', m: 300 }, { n: 'Drone', i: '🐝', m: 700 }, { n: 'Guard', i: '🛡️', m: 1300 }, { n: 'Queen Bee', i: '👑', m: 2200 }];
  function levelInfo(xp) { var idx = 0; for (var i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].m) idx = i; return LEVELS[idx]; }
  function renderComb() {
    var sd = studyData(), subs = sd.subjects || {};
    var comb = $('mobComb'); if (!comb) return;
    var entries = Object.keys(subs).map(function (k) { return { name: k, min: subs[k] || 0 }; }).sort(function (a, b) { return b.min - a.min; });
    var xp = xpData().xp || 0, lv = levelInfo(xp);
    var maxMin = Math.max.apply(null, entries.map(function (e) { return e.min; }).concat([1]));
    comb.innerHTML = '';
    comb.insertAdjacentHTML('beforeend', '<div class="mob-cell queen busy"><div class="mob-hex"></div><div class="mob-honeyfill" style="height:88%"></div><div class="mob-c-ico"><span>' + lv.i + '</span><em>' + lv.n + '</em><small>' + xp + ' XP</small></div></div>');
    entries.forEach(function (s, i) {
      var level = s.min / maxMin;
      var cls = level > 0.7 ? 'full' : level > 0.35 ? 'mid' : level > 0.08 ? 'low' : 'empty';
      comb.insertAdjacentHTML('beforeend',
        '<div class="mob-cell ' + cls + (i % 2 === 0 ? ' busy' : '') + '" data-sub="' + esc(s.name) + '">' +
        '<div class="mob-hex"></div><div class="mob-honeyfill"></div>' +
        '<div class="mob-c-ico"><span>📚</span><em>' + esc(s.name) + '</em><small>' + Math.round(s.min) + ' min</small></div></div>');
    });
    if (!entries.length) comb.innerHTML = '<p style="padding:20px;color:var(--brown);font-weight:600;">No subjects yet — add some in Settings.</p>';
    comb.querySelectorAll('.mob-cell[data-sub]').forEach(function (c) {
      c.addEventListener('click', function () {
        var name = c.getAttribute('data-sub');
        var sub = entries.filter(function (x) { return x.name === name; })[0];
        var pct = Math.round(sub.min / maxMin * 100);
        $('mobCellDetail').innerHTML =
          '<div class="mob-cd-title">📚 ' + esc(name) + '</div>' +
          '<div class="mob-cd-line">' + Math.round(sub.min) + ' min of honey stored · ' + pct + '% of your fullest cell</div>' +
          '<div class="mob-cd-bar"><div class="mob-cd-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="mob-cd-line" style="margin-top:6px;">' + (sub.min < 60 ? 'Tip: a 15-min block today would fill this cell nicely 🐝' : 'Tip: keep stacking — this cell is getting heavy with honey 🍯') + '</div>';
        $('mobCellDetail').classList.add('show');
      });
    });
    var total = entries.reduce(function (a, b) { return a + b.min; }, 0);
    $('mobHiTotal').textContent = Math.round(total) + ' min stored';
  }

  /* ============================ GARDEN ============================ */
  var FLOWERS = [
    { icon: '🌼', name: 'Focus Daisy', min: 60 }, { icon: '🌻', name: 'Sunflower', min: 120 },
    { icon: '🌷', name: 'Tulip', min: 180 }, { icon: '🌸', name: 'Cherry Bloom', min: 240 },
    { icon: '🌹', name: 'Rose', min: 320 }, { icon: '🌺', name: 'Hibiscus', min: 420 }
  ];
  var JOURNAL = [
    '"Watered the garden with 10 focused minutes. The bees approve." — just now',
    '"One more flower on its way. Keep going." — just now',
    '"Every drop counts. The garden knows." — just now'
  ];
  function renderGarden() {
    var total = Math.round((studyData().totalMinutes || 0));
    $('mobGardenSub').textContent = 'Watered by ' + total + ' min';
    var row = $('mobFlowerRow');
    if (!row) return;
    row.innerHTML = FLOWERS.map(function (f) {
      var grown = total >= f.min;
      return '<div class="mob-flower"><span class="mob-f-emoji" style="opacity:' + (grown ? '1' : '.35') + '">' + f.icon + '</span><span class="mob-f-name">' + f.name + '</span><span class="mob-f-min">' + f.min + ' min</span></div>';
    }).join('');
  }

  /* ============================ STATS / SYNC ============================ */
  function syncAll() {
    if (!shell) return;
    /* white-out guard: PC high-contrast must never sit on the shell */
    document.body.classList.remove('high-contrast-mode');
    var sd = studyData(), xp = xpData().xp || 0;
    var dk = todayKey();
    var todayMin = (sd.dailyLog && sd.dailyLog[dk]) || 0;
    var name = userName();
    var hr = new Date().getHours();
    var g = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
    var worry = (get('studyhive-main-worry-v1') || '').trim();
    var weakest = worry ? worry : 'your weakest topic';
    var sug = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)].replace('{topic}', weakest);
    $('mobGreet').textContent = g + (name ? ', ' + name : ', Bee') + ' — ' + sug;

    /* clock */
    var d = new Date();
    $('mobClock').textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());

    /* days/goal from the real DOM */
    var daysEl = $('days'), goalEl = $('mainTitle'), subEl = $('mainSubtitle');
    $('mobDays').textContent = daysEl ? daysEl.textContent : '00';
    $('mobGoal').textContent = goalEl ? goalEl.textContent : '🎓 The Grind';
    var teFill = $('timeElapsedFill'), tePct = $('timeElapsedPct');
    $('mobGoalFill').style.width = teFill ? (teFill.style.width || '0%') : '0%';
    $('mobGoalPct').textContent = tePct ? tePct.textContent : '0%';
    $('mobTodayLine').textContent = 'Today: ' + todayMin + ' min';
    $('mobHiveSub').textContent = (tePct ? tePct.textContent : '0%') + ' · ' + qa('.hive-bee-el, .bee-wrap').length + ' bees working';
    var hiveFill = $('hiveFill');
    $('mobHiveFill').style.width = hiveFill ? (hiveFill.style.width || '0%') : '0%';

    /* quote */
    var qt = $('quoteText'), qaEl = $('quoteAuthorName'), heart = $('quoteFavBtn');
    $('mobQuoteText').textContent = qt ? qt.textContent : '"…"';
    $('mobHeart').textContent = heart ? heart.textContent : '🤍';

    /* stats */
    $('mobStatToday').textContent = todayMin;
    $('mobStatStreak').textContent = sd.currentStreak || 0;
    $('mobStatXP').textContent = xp;
    $('mobStatBees').textContent = qa('.hive-bee-el, .bee-wrap').length;

    /* timer displays */
    var remain = window.sessionRemaining || 0, total = window.sessionTotal || 1;
    var str = pad(Math.floor(remain / 60)) + ':' + pad(remain % 60);
    $('mobTimer').textContent = str;
    $('mobFocusTime').textContent = str;
    var p = Math.max(0, Math.min(100, ((total - remain) / total) * 100));
    $('mobHeroFill').style.width = p + '%';
    $('mobFocusFill').style.width = p + '%';
    var active = !!(window.isSessionActive && window.isSessionActive());
    var paused = !!(window.isPaused && window.isPaused());
    $('mobTimerLabel').textContent = paused ? 'Paused — resume when ready' : (active ? 'Locked in — keep going' : 'Ready when you are');
    $('mobFocusLabel').textContent = paused ? 'Paused — resume when ready' : (active ? 'Locked in — keep going' : 'Ready when you are');
    $('mobHeroPlay').textContent = active ? '⏹ Stop' : '▶ Start';

    /* stats page */
    var lv = levelInfo(xp);
    $('mobLevelLine').textContent = lv.i + ' ' + lv.n;
    var next = LEVELS[LEVELS.indexOf(lv) + 1];
    var xpPct = next ? Math.min(100, Math.round(((xp - lv.m) / (next.m - lv.m)) * 100)) : 100;
    $('mobXpFill').style.width = xpPct + '%';
    $('mobXpSub').textContent = xp + ' XP · ' + xpPct + '% to ' + (next ? next.n : 'MAX');
    $('mobStatList').innerHTML =
      '<div class="mob-statrow"><span>Sessions</span><b>' + (sd.sessionsTotal || 0) + '</b></div>' +
      '<div class="mob-statrow"><span>Total time</span><b>' + Math.floor((sd.totalMinutes || 0) / 60) + 'h ' + Math.round((sd.totalMinutes || 0) % 60) + 'm</b></div>' +
      '<div class="mob-statrow"><span>Best streak</span><b>' + (sd.bestStreak || 0) + ' days</b></div>' +
      '<div class="mob-statrow"><span>Achievements</span><b>' + ((xpData().unlocked || []).length) + ' unlocked</b></div>';

    /* Hive Report (weekly recap) on the mobile Stats tab */
    if (window.hiveReport && !document.getElementById('mobReportBox')) {
      var rb = document.createElement('div');
      rb.id = 'mobReportBox';
      rb.className = 'mob-level-card';
      var rpt = window.hiveReport.collect();
      rb.innerHTML =
        '<div class="mob-level-line">📊 Hive Report</div>' +
        '<div class="mob-xp-sub" style="margin-top:8px;line-height:1.8;">' +
        '<b>' + window.hiveReport.fmtMin(rpt.weekMinutes) + '</b> this week · <b>' + rpt.weekSessions + '</b> sessions<br>' +
        '🔥 <b>' + rpt.streak + '</b> streak · 🏆 <b>' + (rpt.best ? esc(rpt.best) : '—') + '</b> best subject<br>' +
        '🃏 <b>' + rpt.cardsReviewed + '</b> cards · 📋 <b>' + rpt.planDays + '</b> plan days' + (rpt.planStreak >= 2 ? ' · 🔥 <b>' + rpt.planStreak + '</b>-day streak' : '') + '<br>' +
        '🎯 Hive sync <b>' + rpt.consistency + '%</b> · ⚡ <b>' + rpt.interrupts + '</b> interruption' + (rpt.interrupts === 1 ? '' : 's') + '</div>';
      var statsPage = document.getElementById('mobScr-stats');
      if (statsPage) statsPage.appendChild(rb);
    }

    /* daily plan (from js/65) */
    if (window.dailyPlan) {
      var pm = window.dailyPlan.message();
      var pt = $('mobPlanTitle'), pb = $('mobPlanBody');
      if (pt) pt.textContent = pm.title;
      if (pb) pb.textContent = pm.body;
    }

    /* coach line */
    $('mobCoachTitle').textContent = worry ? 'Your main focus: ' + worry : 'Your smart next move';
    $('mobCoachLine').textContent = 'Shall we open the coach to plan ' + (weakest === 'your weakest topic' ? 'your next move' : 'it') + '?';
  }

  /* ============================ TOOLS / SETTINGS ============================ */
  var TOOLS = [
    ['🗂️', 'Cards', 'cardsBtn'], ['📝', 'Notes', 'notesBtn'], ['✅', 'Tasks', 'todoToggleBtn'],
    ['📅', 'Exams', 'examBtn'], ['📊', 'Grades', 'gradeBtn'], ['🎵', 'Music', 'musicBtn'],
    ['💧', 'Water', 'waterBtn'], ['🌬️', 'Breathe', 'breatheBtn'], ['🆘', 'Calm', 'sosBtn'],
    ['🗓️', 'Heatmap', 'heatmapBtn'], ['⚔️', 'Rival', 'rivalBtn'], ['❄️', 'Freeze', 'freezeBtn'],
    ['⏳', 'Capsule', 'capsuleBtn'], ['😂', 'Puns', 'punsBtn'], ['🍅', 'Pomodoro', 'hiveMenuBtn'],
    ['🕵️', 'Secrets', 'secretsBtn'], ['🔤', 'Vocab', 'vocabBtn'], ['🎯', 'Challenge', 'challengeBtn']
  ];
  function clickReal(id) { var el = $(id); if (el) el.click(); }
  function buildTools() {
    var grid = $('mobAllTools'); if (grid) {
      grid.innerHTML = TOOLS.map(function (t) { return '<button class="mob-tool" data-id="' + t[2] + '"><span>' + t[0] + '</span><em>' + t[1] + '</em><small>Open</small></button>'; }).join('');
      qa('#mobAllTools .mob-tool').forEach(function (b) { b.addEventListener('click', function () { clickReal(b.getAttribute('data-id')); }); });
    }
    var dt = $('mobDrawerTools'); if (dt) {
      dt.innerHTML = TOOLS.map(function (t) { return '<button class="mob-drawer-link" data-id="' + t[2] + '"><span>' + t[0] + '</span><em>' + t[1] + '</em><i>›</i></button>'; }).join('');
      qa('#mobDrawerTools .mob-drawer-link').forEach(function (b) { b.addEventListener('click', function () { clickReal(b.getAttribute('data-id')); }); });
    }
  }
  function buildSettings() {
    var list = $('mobSettingsList'); if (!list) return;
    list.innerHTML =
      '<div class="mob-set-item"><span>📱</span><em>Mobile layout</em><span class="mob-toggle on" id="mobLayoutToggle"></span></div>' +
      '<div class="mob-set-item"><span>🕐</span><em>Show clock on timer</em><span class="mob-toggle' + (clockOn ? ' on' : '') + '" id="mobClockToggle"></span></div>' +
      '<div class="mob-set-item"><span>⬛</span><em>High contrast</em><span class="mob-toggle' + (hcOn ? ' on' : '') + '" id="mobHcToggle"></span></div>' +
      '<button class="mob-set-item" data-goto="guide"><span>👑</span><em>Queen guide</em><i>2 modes ›</i></button>' +
      '<button class="mob-set-item" id="mobOpenSettingsPanel"><span>⚙️</span><em>Open full settings</em><i>›</i></button>' +
      '<button class="mob-set-item" id="mobOpenBackup"><span>💾</span><em>Backup & export</em><i>›</i></button>' +
      '<button class="mob-set-item" id="mobOpenMusic"><span>🔊</span><em>Music & sounds</em><i>›</i></button>' +
      '<button class="mob-set-item" id="mobReplayTour"><span>🎬</span><em>Replay tour</em><i>›</i></button>' +
      '<button class="mob-set-item" id="mobEditPledge"><span>✍️</span><em>Edit pledge</em><i>›</i></button>';
    $('mobClockToggle').addEventListener('click', function () {
      clockOn = !clockOn; this.classList.toggle('on', clockOn);
      document.body.classList.toggle('mob-show-clock', clockOn);
      set('studyhive-mob-clock-v1', clockOn ? '1' : '0');
    });
    $('mobHcToggle').addEventListener('click', function () {
      hcOn = !hcOn; this.classList.toggle('on', hcOn);
      document.body.classList.toggle('mob-hc', hcOn);
      /* only the shell-scoped class — never the PC high-contrast-mode */
      document.body.classList.remove('high-contrast-mode');
      set('studyhive-high-contrast-v1', hcOn ? '1' : '0');
    });
    $('mobLayoutToggle').addEventListener('click', function () {
      /* turn the mobile layout OFF from inside the shell */
      set('studyhive-force-mobile-v1', '0');
      document.body.classList.remove('force-mobile', 'is-mobile', 'mobile-pro-ui');
      if (shell) shell.style.display = 'none';
      location.reload();
    });
    $('mobOpenSettingsPanel').addEventListener('click', function () { clickReal('settingsBtn'); });
    $('mobOpenBackup').addEventListener('click', function () { clickReal('settingsBtn'); setTimeout(function () { var p = $('backupCenterPanel'); if (p && p.classList) p.classList.add('show'); }, 400); });
    $('mobOpenMusic').addEventListener('click', function () { clickReal('musicBtn'); });
    $('mobReplayTour').addEventListener('click', function () { try { localStorage.removeItem('studyhive-tour-seen-v1'); } catch (e) {} if (window.HiveTour && window.HiveTour.start) window.HiveTour.start(); });
    $('mobEditPledge').addEventListener('click', function () { if (window.editPledge) window.editPledge(); else clickReal('settingsBtn'); });
  }

  /* ============================ GUIDE ============================ */
  var SUGGESTIONS = [
    'shall we give {topic} 25 focused minutes? The exam is closer than it feels. 🐝',
    'shall we start a 25-minute block? Future-you will be glad you did.',
    'shall we turn yesterday\'s notes into flashcards while they are fresh?',
    'shall we protect your streak with one honest session today?',
    'shall we knock out that practice paper — one question at a time?'
  ];
  var CALM_LINES = [
    "Take a breath. You're doing better than you think. 🐝",
    "One task at a time. The hive wasn't built in a day either.",
    "It's okay to pause. Resting is part of the work.",
    "You've gotten through every hard day so far. This one's no different.",
    "Unclench your jaw, drop your shoulders, breathe out slowly."
  ];
  var SPOT_STEPS = [
    ['🎯 Focus Timer', 'Your home base. Pick a time, press Start (it becomes Stop), or lock in for full-screen focus.', '.mob-hero'],
    ['⏳ Countdown card', 'Your goal, days to go, and progress — always one glance away.', '.mob-card'],
    ['💬 Quote', 'Tap the heart to save a favourite.', '.mob-quote'],
    ['📊 Stats', 'Today, streak, XP and bees — your hive\'s health at a glance.', '.mob-stats'],
    ['🎵 Music', 'Focus music: hive hum, rain, forest or waves — with volume.', '.mob-music-card'],
    ['🍯 The Hive', 'Your subjects as honeycomb cells. Tap a cell to see its honey.', '.mob-hive-zone'],
    ['🧰 Tools & menu', 'The ☰ menu holds every screen, quick tool and all 20 tools.', '.mob-hamburger'],
    ['📱 Bottom bar', 'Home · Hive · Focus · Garden · Coach · Stats · Settings.', '.mob-bottombar']
  ];
  function guideSpotStart() {
    guideMode = 'spot'; gIdx = 0;
    $('mobGuideOverlay').classList.add('show');
    $('mobGuideCard').style.display = '';
    $('mobGuideWords').style.display = 'none';
    guideSpotRender();
  }
  function guideSpotRender() {
    var s = SPOT_STEPS[gIdx];
    $('mobGuideTitle').textContent = s[0];
    $('mobGuideBody').textContent = s[1];
    $('mobGuideBack').style.visibility = gIdx ? 'visible' : 'hidden';
    $('mobGuideNext').textContent = gIdx === SPOT_STEPS.length - 1 ? 'Finish' : 'Next';
    var target = document.querySelector(s[2]);
    var spot = $('mobGuideSpot');
    if (target) {
      var r = target.getBoundingClientRect();
      spot.style.display = 'block';
      spot.style.top = (r.top - 6) + 'px'; spot.style.left = (r.left - 6) + 'px';
      spot.style.width = (r.width + 12) + 'px'; spot.style.height = (r.height + 12) + 'px';
      var card = $('mobGuideCard');
      card.style.left = '50%'; card.style.right = 'auto'; card.style.top = 'auto'; card.style.bottom = '20px';
      card.style.transform = 'translateX(-50%)';
    } else {
      spot.style.display = 'none';
      var c2 = $('mobGuideCard');
      c2.style.left = '50%'; c2.style.top = '50%'; c2.style.bottom = 'auto';
      c2.style.transform = 'translate(-50%,-50%)';
    }
  }
  var WORD_SECTIONS = [
    ['🏠 Home', 'The timer is front and centre: pick 15/25/45, press Start (it turns into Stop), extend with +5, or lock in for a full-screen timer. Below it: your countdown, a tappable quote, four stats, the hive summary, focus music and quick tools.'],
    ['🍯 The Hive', 'Your subjects live here as honeycomb cells. The honey filling each cell is the minutes you have studied that subject. Tap a cell for details. Worker bees fly around the comb.'],
    ['🎯 Focus', 'Same timer, bigger: presets, start/pause/stop, +5/+10, and Lock in — a dark full-screen timer that demands portrait orientation.'],
    ['🌷 Garden World', 'Study minutes grow flowers, from the Focus Daisy (60 min) to the Hibiscus (420 min). Water, plant intentions and journal your way through.'],
    ['🐝 Hive Coach', 'Your smart study partner: it knows your weakest topic and suggests the highest-impact next move — recall, practice, plan or review.'],
    ['📈 Stats', 'Your level, XP bar, sessions, total time, best streak and achievements — proof the hive is growing.'],
    ['⚙️ Settings', 'Clock toggle, high contrast, Queen\'s guide (this), full settings, backup, music, tour, pledge.'],
    ['🧰 All Tools', 'Cards, Notes, Tasks, Exams, Grades, Music, Water, Breathe, Calm, Heatmap, Rival, Freeze, Capsule, Puns, Pomodoro, Secrets, Vocab, Challenge — all in the ☰ menu.'],
    ['☰ The menu', 'Three lines top-left: Screens, Quick Tools and All Tools. Everything is two taps away.'],
    ['📱 Bottom bar', 'Seven shortcuts: Home, Hive, Focus (raised), Garden, Coach, Stats, Settings.'],
    ['🔒 Lock in', 'Full-screen, timer-only, portrait-locked. When it finishes, the bees dance for you.'],
    ['🌙 Night', 'At sunset the hive goes dark and calm — stars, shooting stars and the rare planet event. Tap the brand twice to preview it.']
  ];
  function guideWordsStart() {
    guideMode = 'words';
    $('mobGuideOverlay').classList.add('show');
    $('mobGuideCard').style.display = 'none';
    $('mobGuideSpot').style.display = 'none';
    var w = $('mobGuideWords');
    w.style.display = 'block';
    $('mobGuideWordsBody').innerHTML = WORD_SECTIONS.map(function (s) { return '<div class="mob-gw-section"><h4>' + s[0] + '</h4><p>' + s[1] + '</p></div>'; }).join('');
  }
  function closeGuide() { $('mobGuideOverlay').classList.remove('show'); gIdx = 0; }

  /* ============================ WATCH ============================ */
  var lastMode = false;
  function check() {
    var on = isMobileOn();
    if (on && !lastMode) {
      build();
      document.body.classList.add('mobile-pro-ui');
      goTab('home');
    } else if (!on && lastMode) {
      if (shell) shell.style.display = 'none';
      document.body.classList.remove('mobile-pro-ui');
    }
    lastMode = on;
    if (on) syncAll();
  }
  setInterval(check, 1000);
  setInterval(function () { if (isMobileOn()) syncAll(); }, 5000);
  if (isMobileOn()) { build(); document.body.classList.add('mobile-pro-ui'); }
})();
