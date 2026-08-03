/* =====================================================================
   Study Hive — 05-countdown-hive-core.js
   Extracted from the original single-file build (script block #3).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


/* ==========================================================================
   CRASH FIX (root cause): guarded IIFE around the countdown block.

   This block used to declare targetDate / startDate / TOTAL_MS (and 15 more
   const/let bindings) as bare top-level globals. Including this script twice
   threw "SyntaxError: Identifier 'targetDate' has already been declared".
   That is a PARSE-time error, so the entire block was discarded and every
   feature defined below it died with it -- the volume slider, the More Tools
   dock, favourite quotes, the Bee AI close button and the legal links all
   looked "broken" for this one reason.

   Two layers of protection:
     1. Function scope -- the declarations are no longer top-level, so a
        duplicate inclusion can never collide, no matter how it is loaded.
     2. A re-entry guard -- a second inclusion returns immediately instead of
        double-binding listeners and double-starting the countdown timers.
   ========================================================================== */
(function () {
  if (window.__studyHiveCountdownLoaded) {
    /* Already initialised by an earlier copy of this script. Bail out quietly
       so a duplicate inclusion is a harmless no-op instead of a hard crash. */
    return;
  }
  window.__studyHiveCountdownLoaded = true;

  /* ---- Export bridge -------------------------------------------------
     Later script blocks still refer to these as bare globals, and several of
     them (showSergeantNag, recordStudyCompleted, studyData,
     renderSubjectProgress) are REASSIGNED by later "wrapper" patches. Plain
     value copies would break that chain, so each name is published as an
     accessor bound to the variable in this scope: reads always see the current
     value and writes from other blocks land on the real variable.
     -------------------------------------------------------------------- */
  var __shBridge = function (name, getter, setter) {
    try {
      Object.defineProperty(window, name, {
        configurable: true,
        enumerable: true,
        get: getter,
        set: setter || function () { /* const: assignment intentionally ignored */ }
      });
    } catch (e) { /* never let the bridge break startup */ }
  };
  __shBridge('targetDate', function () { return targetDate; });
  __shBridge('startDate', function () { return startDate; });
  __shBridge('hiveWrap', function () { return hiveWrap; });
  __shBridge('GOAL_DATE_KEY', function () { return GOAL_DATE_KEY; }, function (v) { GOAL_DATE_KEY = v; });
  __shBridge('GOAL_LABEL_KEY', function () { return GOAL_LABEL_KEY; }, function (v) { GOAL_LABEL_KEY = v; });
  __shBridge('GOAL_TITLE_KEY', function () { return GOAL_TITLE_KEY; }, function (v) { GOAL_TITLE_KEY = v; });
  __shBridge('dateKey', function () { return dateKey; }, function (v) { dateKey = v; });
  __shBridge('focusPanel', function () { return focusPanel; }, function (v) { focusPanel = v; });
  __shBridge('freezeState', function () { return freezeState; }, function (v) { freezeState = v; });
  __shBridge('getGoalLabel', function () { return getGoalLabel; }, function (v) { getGoalLabel = v; });
  __shBridge('getGoalTitle', function () { return getGoalTitle; }, function (v) { getGoalTitle = v; });
  __shBridge('getTargetDate', function () { return getTargetDate; }, function (v) { getTargetDate = v; });
  __shBridge('isNight', function () { return isNight; }, function (v) { isNight = v; });
  __shBridge('pad', function () { return pad; }, function (v) { pad = v; });
  __shBridge('recordStudyCompleted', function () { return recordStudyCompleted; }, function (v) { recordStudyCompleted = v; });
  __shBridge('renderSubjectProgress', function () { return renderSubjectProgress; }, function (v) { renderSubjectProgress = v; });
  __shBridge('saveFreezeState', function () { return saveFreezeState; }, function (v) { saveFreezeState = v; });
  __shBridge('saveStudyData', function () { return saveStudyData; }, function (v) { saveStudyData = v; });
  __shBridge('showSergeantNag', function () { return showSergeantNag; }, function (v) { showSergeantNag = v; });
  __shBridge('storageGet', function () { return storageGet; }, function (v) { storageGet = v; });
  __shBridge('storageSet', function () { return storageSet; }, function (v) { storageSet = v; });
  __shBridge('studyData', function () { return studyData; }, function (v) { studyData = v; });
  __shBridge('updateNightMode', function () { return updateNightMode; }, function (v) { updateNightMode = v; });
  __shBridge('updateSergeantAnger', function () { return updateSergeantAnger; }, function (v) { updateSergeantAnger = v; });
  __shBridge('startSession', function () { return startSession; }, function (v) { startSession = v; });

  // ---- Configurable goal (replaces old hardcoded "Sept 23rd" date) ----
  var GOAL_DATE_KEY = 'goal-target-date-v1';
  var GOAL_LABEL_KEY = 'goal-label-v1';
  var GOAL_TITLE_KEY = 'goal-title-v1';

  function getStoredGoalDate() {
    try {
      var raw = localStorage.getItem(GOAL_DATE_KEY);
      if (!raw) return null;
      var d = new Date(raw);
      if (isNaN(d.getTime())) return null;
      return d;
    } catch (e) { return null; }
  }
  function getTargetDate() {
    var stored = getStoredGoalDate();
    if (stored) return stored;
    // Default for first-time users: 90 days from now, so the app is usable
    // out of the box for anyone without assuming a school calendar.
    var d = new Date();
    d.setDate(d.getDate() + 90);
    d.setHours(23, 59, 0, 0);
    return d;
  }
  function getGoalLabel() {
    try { return localStorage.getItem(GOAL_LABEL_KEY) || 'Countdown to your goal'; }
    catch (e) { return 'Countdown to your goal'; }
  }
  function getGoalTitle() {
    try { return localStorage.getItem(GOAL_TITLE_KEY) || '🎓 The Grind'; }
    catch (e) { return '🎓 The Grind'; }
  }
  function applyGoalTextToDOM() {
    var t = document.getElementById('mainTitle');
    var s = document.getElementById('mainSubtitle');
    if (t) t.textContent = getGoalTitle();
    if (s) s.textContent = getGoalLabel();
  }
  applyGoalTextToDOM();

  function getStoredStartDate() {
    try {
      var raw = localStorage.getItem('goal-start-date-v1');
      var d = raw ? new Date(raw) : null;
      return (d && !isNaN(d.getTime())) ? d : null;
    } catch (e) { return null; }
  }
  const targetDate = getTargetDate();
  // If the user set a custom goal, use the date they set it on as the start
  // of the countdown; otherwise fall back to a 90-day window ending at the target.
  const startDate = getStoredStartDate() || new Date(targetDate.getTime() - 90 * 24 * 60 * 60 * 1000);
  const TOTAL_MS = Math.max(24 * 60 * 60 * 1000, targetDate.getTime() - startDate.getTime());
  const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function pad(n) { return n.toString().padStart(2, '0'); }

  const hiveWrap = document.getElementById('hiveWrap');
  const hiveFill = document.getElementById('hiveFill');
  const hivePct = document.getElementById('hivePct');
  const celebrationOverlay = document.getElementById('celebrationOverlay');
  const goalFront = document.getElementById('goalFront');
  let celebrated = false;

  // Subject & Study Data
  const SUBJECT_TARGET_MINUTES = 50 * 60;
  const GOAL_UNLOCK_MINUTES = 50 * 60;
  const GOAL_MAX = 90;

  let studyData = {
    subjects: {},
    totalMinutes: 0,
    consistencyScore: 0,
    lastStudyTime: null,
    lastStudyDate: null,
    currentStreak: 0,
    bestStreak: 0,
    sessionsTotal: 0
  };
  let finaleActive = false;
  let nightFixed = false;

  function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function dateKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function saveStudyData() { storageSet('study-data-v2', JSON.stringify(studyData)); }

  let freezeState = { tokens: 0, awardedMilestones: [] };
  (function(){ var raw = storageGet('hive-streak-freeze-v1'); if (raw) { try { freezeState = Object.assign(freezeState, JSON.parse(raw)); } catch(e){} } })();
  function saveFreezeState(){ storageSet('hive-streak-freeze-v1', JSON.stringify(freezeState)); }

  function getSubjectPct(subject) {
    return Math.min(100, Math.round((studyData.subjects[subject] / SUBJECT_TARGET_MINUTES) * 100));
  }
  function renderSubjectProgress() {
    const list = document.getElementById('subjectProgressList');
    if (!list) return;
    const entries = Object.entries(studyData.subjects);
    let minSubj = entries.length ? entries[0][0] : null;
    entries.forEach(function(e){ if (e[1] < studyData.subjects[minSubj]) minSubj = e[0]; });
    let html = '';
    for (const [subj, mins] of entries) {
      const pct = getSubjectPct(subj);
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      const needsAttention = subj === minSubj && mins < 25 * 60;
      html += '<div class="subject-progress-item">' +
        '<div class="subject-progress-name"><span>' + subj + (needsAttention ? ' <span class="needs-attention-badge">FOCUS</span>' : '') + '</span><span class="subject-progress-pct">' + pct + '% (' + hrs + 'h ' + remMins + 'm)</span></div>' +
        '<div class="subject-progress-track"><div class="subject-progress-fill" style="width:' + pct + '%"></div></div>' +
      '</div>';
    }
    list.innerHTML = html;
  }

  function updateStreakUI() {
    const cEl = document.getElementById('streakCount');
    const uEl = document.getElementById('streakUnit');
    const bEl = document.getElementById('streakBest');
    if (!cEl) return;
    cEl.textContent = studyData.currentStreak;
    uEl.textContent = studyData.currentStreak === 1 ? 'day' : 'days';
    bEl.textContent = 'Best: ' + studyData.bestStreak + (studyData.bestStreak === 1 ? ' day' : ' days');
  }

  function applyConsistencyDecay() {
    const today = dateKey(new Date());
    if (studyData.lastStudyDate && studyData.lastStudyDate !== today) {
      const yesterday = dateKey(new Date(Date.now() - 86400000));
      if (studyData.lastStudyDate !== yesterday) {
        if (freezeState.tokens > 0) {
          freezeState.tokens -= 1;
          saveFreezeState();
          window.streakFreezeUsed = true;
        } else {
          studyData.currentStreak = 0;
        }
      }
      if (studyData.totalMinutes >= GOAL_UNLOCK_MINUTES) {
        studyData.consistencyScore = Math.max(0, Math.floor(studyData.consistencyScore * 0.52));
      }
    }
  }

  function initStudyData() {
    const raw = storageGet('study-data-v2');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        studyData = Object.assign(studyData, parsed);
        if (!studyData.subjects || typeof studyData.subjects !== 'object') studyData.subjects = {};
      } catch (e) {}
    }
    if (!studyData.lastStudyTime) {
      studyData.lastStudyTime = Date.now();
    }
    applyConsistencyDecay();
    saveStudyData();
    updateStreakUI();
    renderSubjectProgress();
    updateSergeantAnger();
    updateGoalDisplay();
    renderWeeklyChart();
    populateSubjectSelects();
  }

  function getSubjectNames(){ return Object.keys(studyData.subjects || {}); }
  function populateSubjectSelects(){
    var selectIds = ['gradeSubjectSelect', 'examSubjectSelect', 'cardSubjectSelect', 'subjectSelect', 'pomodoroSubjectSelect'];
    var names = getSubjectNames();
    selectIds.forEach(function(id){
      var sel = document.getElementById(id);
      if (!sel) return;
      var prevVal = sel.value;
      if (!names.length) {
        sel.innerHTML = '<option value="">Add a subject in Settings</option>';
        return;
      }
      sel.innerHTML = names.map(function(n){
        var safe = n.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        return '<option value="' + safe + '">' + safe + '</option>';
      }).join('');
      if (names.indexOf(prevVal) !== -1) sel.value = prevVal;
    });
  }
  function renderManageSubjects(){
    var list = document.getElementById('manageSubjectsList');
    if (!list) return;
    var names = getSubjectNames();
    if (!names.length) {
      list.innerHTML = '<div class="exam-empty">No subjects yet — add one below.</div>';
      return;
    }
    list.innerHTML = names.map(function(n){
      var safe = n.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      return '<li class="exam-item"><span class="exam-item-name">' + safe + '</span>' +
        '<button class="exam-item-del" data-del-subject="' + safe + '">✕</button></li>';
    }).join('');
  }
  function addSubjectByName(name){
    name = (name || '').trim();
    if (!name) return false;
    if (!studyData.subjects) studyData.subjects = {};
    if (name in studyData.subjects) return false;
    studyData.subjects[name] = 0;
    saveStudyData();
    populateSubjectSelects();
    renderManageSubjects();
    if (typeof renderSubjectProgress === 'function') renderSubjectProgress();
    return true;
  }
  function removeSubjectByName(name){
    if (!studyData.subjects || !(name in studyData.subjects)) return;
    delete studyData.subjects[name];
    saveStudyData();
    populateSubjectSelects();
    renderManageSubjects();
    if (typeof renderSubjectProgress === 'function') renderSubjectProgress();
  }

  // Wire up the Manage Subjects UI (add one, delete one, bulk import)
  document.addEventListener('DOMContentLoaded', function(){
    renderManageSubjects();
    var newSubjectInput = document.getElementById('newSubjectInput');
    var addSubjectBtn = document.getElementById('addSubjectBtn');
    var bulkTextarea = document.getElementById('bulkSubjectTextarea');
    var bulkBtn = document.getElementById('bulkAddSubjectsBtn');
    var manageList = document.getElementById('manageSubjectsList');

    function addOne(){
      if (!newSubjectInput) return;
      if (addSubjectByName(newSubjectInput.value)) newSubjectInput.value = '';
    }
    if (addSubjectBtn) addSubjectBtn.addEventListener('click', addOne);
    if (newSubjectInput) newSubjectInput.addEventListener('keydown', function(e){
      if (e.key === 'Enter') addOne();
    });
    if (bulkBtn) bulkBtn.addEventListener('click', function(){
      if (!bulkTextarea) return;
      var raw = bulkTextarea.value || '';
      var names = raw.split(/[\n,]/).map(function(s){ return s.trim(); }).filter(Boolean);
      var added = 0;
      names.forEach(function(n){ if (addSubjectByName(n)) added++; });
      bulkTextarea.value = '';
      if (typeof showMilestoneToast === 'function') showMilestoneToast('📚 Added ' + added + ' subject' + (added === 1 ? '' : 's') + '!');
    });
    if (manageList) manageList.addEventListener('click', function(e){
      var btn = e.target.closest('[data-del-subject]');
      if (btn) removeSubjectByName(btn.getAttribute('data-del-subject'));
    });
  });

  function renderWeeklyChart() {
    var el = document.getElementById('weeklyChart');
    if (!el) return;
    var log = studyData.dailyLog || {};
    var days = [];
    var max = 5;
    for (var i = 6; i >= 0; i--) {
      var d = new Date(Date.now() - i * 86400000);
      var key = dateKey(d);
      var mins = log[key] || 0;
      max = Math.max(max, mins);
      days.push({ label: ['S','M','T','W','T','F','S'][d.getDay()], mins: mins });
    }
    el.innerHTML = days.map(function(day){
      var h = Math.max(3, Math.round((day.mins / max) * 56));
      return '<div class="weekly-chart-col" title="' + day.mins + ' min">' +
        '<div class="weekly-chart-bar" style="height:' + h + 'px;"></div>' +
        '<div class="weekly-chart-label">' + day.label + '</div>' +
      '</div>';
    }).join('');
  }

  function recordStudyCompleted(subject, minutes) {
    const now = Date.now();
    const today = dateKey(new Date(now));
    if (subject) studyData.subjects[subject] = (studyData.subjects[subject] || 0) + minutes;
    studyData.totalMinutes += minutes;
    studyData.dailyLog = studyData.dailyLog || {};
    studyData.dailyLog[today] = (studyData.dailyLog[today] || 0) + minutes;
    if (studyData.lastStudyDate !== today) {
      const yesterday = dateKey(new Date(now - 86400000));
      studyData.currentStreak = (studyData.lastStudyDate === yesterday) ? studyData.currentStreak + 1 : 1;
      studyData.lastStudyDate = today;
      studyData.bestStreak = Math.max(studyData.bestStreak, studyData.currentStreak);
    }
    studyData.lastStudyTime = now;
    studyData.sessionsTotal = (studyData.sessionsTotal || 0) + 1;
    if (studyData.totalMinutes >= GOAL_UNLOCK_MINUTES) {
      studyData.consistencyScore = Math.min(GOAL_MAX, studyData.consistencyScore + Math.round(minutes / 30));
    }
    saveStudyData();
    updateStreakUI();
    renderSubjectProgress();
    updateSergeantAnger();
    updateGoalDisplay();
    renderWeeklyChart();
    if (isNight()) {
      nightFixed = true;
      document.body.classList.add('night-fixed');
      showSergeantNag("Fine. You're studying. I'll hold the darkness back. For now. 🫡", false);
      setTimeout(function() {
        nightFixed = false;
        document.body.classList.remove('night-fixed');
      }, 300000);
    } else {
      showSergeantNag("Good. That's how it's done, recruit. 🫡", false);
    }
  }

  function updateGoalDisplay() {
    if (studyData.totalMinutes < GOAL_UNLOCK_MINUTES) {
      goalFront.style.clipPath = 'inset(100% 0 0 0)';
      return;
    }
    const pct = studyData.consistencyScore / GOAL_MAX;
    goalFront.style.clipPath = 'inset(' + (100 - pct * 100) + '% 0 0 0)';
  }

  // Night Mode
  function isNight() {
    var now = new Date();
    /* SUNSET NIGHT MODE: use the predicted sunset/sunrise from the weather
       cache (Open-Meteo daily=sunrise,sunset) when available, so night mode
       switches on at the real sunset of the user's location. Falls back to
       the old 18:00-05:00 window when there's no data or it's stale. */
    try {
      var c = JSON.parse(localStorage.getItem('hive-weather-cache-v1') || 'null');
      if (c && c.sunset && c.sunrise) {
        var today = now.toISOString().slice(0, 10);
        if (c.sunriseDate === today && c.sunsetDate === today) {
          var ms = now.getTime();
          var rise = new Date(c.sunrise).getTime();
          var set = new Date(c.sunset).getTime();
          if (!isNaN(rise) && !isNaN(set)) return ms >= set || ms < rise;
        }
      }
    } catch (e) {}
    var h = now.getHours();
    return h >= 18 || h < 5;
  }
  function updateNightMode() {
    if (isNight() || window.nightPreviewActive) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
      document.body.classList.remove('night-fixed');
      nightFixed = false;
    }
  }

  // Sergeant Lines
  var sergeantNagLines = {
    1: [
      "Tick tock. When's the next study block, recruit?",
      "One hour down. Don't get comfortable.",
      "The hive didn't build itself. Neither will your grades.",
      "I've seen bees work harder on a Tuesday morning.",
      "Your books are collecting dust. So is your future.",
      "A little hustle never killed a recruit. Laziness did.",
      "The clock is ticking. Are you?",
      "One hour gone. That's one hour closer to failure.",
      "Move it, move it, MOVE IT!",
      "I didn't wake up this morning to watch you scroll."
    ],
    2: [
      "Two hours and NOTHING? Open a book!",
      "The hive doesn't wait around for you. MOVE.",
      "I'm starting to think you LIKE disappointing the queen.",
      "TWO HOURS. That's 120 minutes of pure slacking.",
      "Your textbooks are crying. Yes, I can hear them.",
      "Even the lazy bees get kicked out. You're on thin comb.",
      "Two hours of zero effort. Impressively bad.",
      "If procrastination was a subject, you'd have 100%."
    ],
    3: [
      "THREE HOURS. I'm watching you slack off, recruit.",
      "This is your final warning. STUDY. NOW.",
      "Three hours of nothing. The hive is ASHAMED.",
      "I'm not angry. I'm just... very disappointed. Actually, no, I'm FURIOUS.",
      "THREE HOURS? Do you WANT to repeat this year?",
      "The queen has been notified. She's not pleased.",
      "I can feel my stripes turning grey from stress.",
      "Three hours of wasted potential. Pick. Up. The. Pen."
    ],
    4: [
      "I HAVE NEVER BEEN THIS DISAPPOINTED. HIT THE FOCUS TIMER.",
      "UNACCEPTABLE. THE HIVE DESERVES BETTER FROM YOU.",
      "FOUR HOURS. I'm running out of ways to say STUDY.",
      "You're making the other bees look bad. And they're BEES.",
      "If I had a dollar for every minute you wasted, I'd buy a new recruit.",
      "This is pathetic. Absolutely pathetic. DO SOMETHING.",
      "Four hours of avoidance. Your brain is atrophying.",
      "I'm going to start calling you 'Private Procrastinator'."
    ]
  };

  var sergeantSleepLines = [
    "It's night, recruit. REST. You need to be up at 0500 sharp.",
    "Sleep is part of the mission. Recharge for tomorrow's grind.",
    "No studying after 1800? Good. Your brain needs REM more than it needs another flashcard.",
    "Hit the sack. 5 AM comes fast, and I'll be waiting.",
    "Even drill sergeants sleep. Difference is, I dream about your success.",
    "Your pillow is calling. Answer it. 0500 formation.",
    "The hive sleeps so it can work harder tomorrow. You should too.",
    "No blue light. No guilt. Just rest. I'll see you at dawn.",
    "Recharge those neurons, soldier. Tomorrow we conquer.",
    "Sleep now, study later. That's an ORDER.",
    "Your sergeant approves of this bedtime. Lights out.",
    "5 AM wake-up. Don't make me sting you out of bed.",
    "Rest is not laziness. It's strategy. Use it.",
    "The best bees sleep deep and work deep. Be a best bee.",
    "Night is for recovery. Morning is for domination."
  ];

  var sergeantNightStudyLines = [
    "Studying at night? You're either dedicated or insane. I respect both.",
    "The hive burns midnight honey. I see you, recruit.",
    "Night owl mode activated. Just don't burn out before dawn.",
    "Late night grind? The sergeant sees your sacrifice.",
    "While others sleep, you study. That's how wars are won.",
    "Dark hours, bright mind. Keep it up, soldier.",
    "Night shift approved. But you BETTER sleep after this.",
    "The 0500 formation still stands. Don't make me regret this approval."
  ];

  sergeantNagLines[1] = sergeantNagLines[1].concat([
    "Tiny session. Ten minutes. I don't care. Start the engine.",
    "Your future self just filed a complaint. Something about 'please study'.",
    "No heroic speech today. Just open the tab, pick a subject, begin.",
    "A recruit who starts badly still beats a recruit who never starts.",
    "The first five minutes count. Give me five and we'll negotiate after."
  ]);
  sergeantNagLines[2] = sergeantNagLines[2].concat([
    "Two hours is enough drifting. Anchor yourself with one task.",
    "I checked the hive ledger. It says: unpaid study debt.",
    "The bees voted. They want one Pomodoro, immediately.",
    "Don't make motivation do discipline's job. Start anyway.",
    "Your notes are not decorations, recruit. Use them."
  ]);
  sergeantNagLines[3] = sergeantNagLines[3].concat([
    "Three hours means emergency protocol: one page, one pen, one timer.",
    "Stop negotiating with procrastination. It is a terrible lawyer.",
    "You don't need the perfect mood. You need the next question.",
    "If panic is loud, action has to be louder. Begin small.",
    "The hive is forming a search party for your focus."
  ]);
  sergeantNagLines[4] = sergeantNagLines[4].concat([
    "FOUR HOURS. This is not a break. This is a hostage situation.",
    "I am deploying the bees. Open Focus before they arrive.",
    "Do the ugly first draft. Do the messy calculation. Do SOMETHING.",
    "Your comeback arc starts with a single boring minute.",
    "Private Procrastinator, report to the Focus button immediately."
  ]);
  sergeantSleepLines = sergeantSleepLines.concat([
    "Your brain files memories while you sleep. Let the librarian work.",
    "Lights out is not quitting. It's maintenance.",
    "Tomorrow's focus is built tonight. Close the laptop with honor.",
    "A tired bee makes crooked honeycomb. Rest.",
    "Sleep is the quiet study session your brain runs without you."
  ]);
  sergeantNightStudyLines = sergeantNightStudyLines.concat([
    "Good discipline includes knowing when to stop. Set a finish line.",
    "Night study approved for one mission only. No doom-scrolling after.",
    "Keep it gentle: recall, review, then bed.",
    "Midnight focus is powerful, but recovery still outranks bravado.",
    "If your eyes sting more than the bees do, wrap it up."
  ]);
  var lastNagTime = 0;
  var sergeantPersistent = document.getElementById('sergeantPersistent');
  var sergeantNagBubble = document.getElementById('sergeantNagBubble');
  var sergeantNagText = document.getElementById('sergeantNagText');
  var sergeantShadow = document.getElementById('sergeantShadow');
  var rageMeterEl = document.getElementById('rageMeter');
  var sergeantRankBadge = document.getElementById('sergeantRankBadge');
  var SERGEANT_RANKS = ['Private', 'Corporal', 'Sergeant', 'Captain', 'Captain'];
  var SERGEANT_RANK_ABBR = ['PVT', 'CPL', 'SGT', 'CPT', 'CPT'];
  var lastRankLevel = null;

  function showSergeantNag(text, angry) {
    (sergeantNagText || sergeantNagBubble).textContent = text;
    sergeantNagBubble.classList.toggle('angry', !!angry);
    sergeantNagBubble.classList.add('show');
    clearTimeout(showSergeantNag._t);
    showSergeantNag._t = setTimeout(function() {
      sergeantNagBubble.classList.remove('show');
    }, 5000);
  }

  function setSergeantVisuals(level) {
    var cls = 'anger-' + level;
    sergeantPersistent.className = 'sergeant-persistent ' + cls;
    if (sergeantShadow) sergeantShadow.className = 'sergeant-shadow ' + cls;
    if (rageMeterEl) rageMeterEl.className = 'rage-meter ' + cls;
    var promoted = false;
    if (sergeantRankBadge) {
      sergeantRankBadge.textContent = SERGEANT_RANK_ABBR[level];
      sergeantRankBadge.title = SERGEANT_RANKS[level];
      sergeantRankBadge.setAttribute('data-rank', String(level));
      if (lastRankLevel !== null && level > lastRankLevel) {
        promoted = true;
        sergeantRankBadge.classList.remove('promoted');
        void sergeantRankBadge.offsetWidth;
        sergeantRankBadge.classList.add('promoted');
      }
      lastRankLevel = level;
    }
    return promoted;
  }

  function updateSergeantAnger() {
    if (finaleActive || !sergeantPersistent) return;
    var hours = (Date.now() - (studyData.lastStudyTime || Date.now())) / 3600000;

    if (isNight()) {
      setSergeantVisuals(0);
      if (Date.now() - lastNagTime > 60000) {
        lastNagTime = Date.now();
        var pool = nightFixed ? sergeantNightStudyLines : sergeantSleepLines;
        showSergeantNag(pool[Math.floor(Math.random() * pool.length)], false);
      }
      return;
    }

    var level = Math.max(0, Math.min(4, Math.floor(hours) + (window.moodNagAdjust || 0)));
    var promoted = setSergeantVisuals(level);
    if (promoted) {
      lastNagTime = Date.now();
      showSergeantNag('🎖️ PROMOTED TO ' + SERGEANT_RANKS[level].toUpperCase() + '!', level >= 3);
      return;
    }
    if (level >= 1 && Date.now() - lastNagTime > 45000) {
      lastNagTime = Date.now();
      var pool = sergeantNagLines[level] || sergeantNagLines[1];
      showSergeantNag(pool[Math.floor(Math.random() * pool.length)], level >= 3);
    }
  }

  initStudyData();
  setInterval(updateSergeantAnger, 20000);
  setInterval(updateNightMode, 30000);
  updateNightMode();

  // Finale
  var sergeantWrap = document.getElementById('sergeantWrap');
  var sergeantBubble = document.getElementById('sergeantBubble');
  var sergeantHugLines = [
    "MISSION ACCOMPLISHED, RECRUIT! 🫡",
    "YOU FOUGHT THROUGH EVERY STUDY BLOCK. OUTSTANDING WORK!",
    "Even when it felt like nobody was watching... the hive was. 🐝",
    "If you ever feel alone out there, remember — you have the hive. 🍯",
    "DISMISSED, SOLDIER. GO ENJOY IT. YOU EARNED THIS. 🫡",
    "From day one to the finish line — you NEVER gave up.",
    "The queen is proud. I'm proud. YOU should be PROUD.",
    "Every flashcard, every late night, every tear — it ALL paid off.",
    "You didn't just survive school. You CONQUERED it.",
    "The hive is complete because YOU built it, brick by brick."
  ];
  var sergeantToughLines = [
    "TIME'S UP AND YOU NEVER HIT THE BOOKS. THAT ENDS TODAY, RECRUIT!",
    "ZERO STUDY BLOCKS LOGGED?! THE HIVE DOES NOT RUN ON EXCUSES!",
    "NO HUGS FOR SLACKERS! HIT THAT FOCUS TIMER — MOVE IT!",
    "You're at the finish line with empty hands. PATHETIC.",
    "The bell rings and you have NOTHING to show for it. START OVER."
  ];

  function runSergeantFinale() {
    finaleActive = true;
    sergeantWrap.classList.add('active');
    if (studyData.sessionsTotal > 0) {
      sergeantWrap.classList.remove('tough');
      var i = 0;
      sergeantBubble.textContent = sergeantHugLines[0];
      var cycle = setInterval(function() {
        i = (i + 1) % sergeantHugLines.length;
        sergeantBubble.textContent = sergeantHugLines[i];
      }, 15000);
      setTimeout(function() {
        clearInterval(cycle);
        sergeantWrap.classList.remove('active');
        finaleActive = false;
        updateSergeantAnger();
      }, 5 * 60 * 1000);
    } else {
      sergeantWrap.classList.add('tough');
      sergeantBubble.textContent = sergeantToughLines[Math.floor(Math.random() * sergeantToughLines.length)];
      setTimeout(function() {
        sergeantWrap.classList.remove('active');
        finaleActive = false;
        updateSergeantAnger();
      }, 20000);
    }
  }

  // Clock & Countdown
  function updateClock() {
    var now = new Date();
    var hrs = now.getHours();
    var ampm = hrs >= 12 ? 'PM' : 'AM';
    var displayHrs = hrs % 12;
    if (displayHrs === 0) displayHrs = 12;
    document.getElementById('currentTime').textContent =
      pad(displayHrs) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + ' ' + ampm;
    document.getElementById('currentDate').textContent =
      weekdays[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

    var diff = targetDate - now;
    var progress = (now - startDate) / TOTAL_MS;
    progress = Math.max(0, Math.min(1, progress));
    var pct = Math.round(progress * 100);
    hiveFill.style.width = pct + '%';
    hivePct.textContent = pct + '%';

    var stage = Math.min(4, Math.floor(progress * 5));
    hiveWrap.className = 'hive-wrap stage-' + stage;
    document.body.setAttribute('data-stage', stage);

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('todayHours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      document.getElementById('footerNote').textContent = "🎉 It's here! 🎉";
      hiveFill.style.width = '100%';
      hivePct.textContent = '100%';
      if (!celebrated) {
        celebrated = true;
        celebrationOverlay.classList.add('show');
        runSergeantFinale();
      }
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor(diff / (1000 * 60 * 60));
    var todayHours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diff / (1000 * 60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent = pad(days);
    document.getElementById('hours').textContent = pad(hours);
    document.getElementById('todayHours').textContent = pad(todayHours);
    document.getElementById('minutes').textContent = pad(minutes);
    document.getElementById('seconds').textContent = pad(seconds);
  }

  updateClock();
  setInterval(updateClock, 1000);

  // Focus Timer
  var focusBtn = document.getElementById('focusBtn');
  var focusPanel = document.getElementById('focusPanel');
  var presetBtns = document.querySelectorAll('.focus-preset-btn[data-mins]');
  var focusSession = document.getElementById('focusSession');
  var focusSessionTime = document.getElementById('focusSessionTime');
  var focusSessionFill = document.getElementById('focusSessionFill');
  var focusStopBtn = document.getElementById('focusStopBtn');
  var focusMeterFill = document.getElementById('focusMeterFill');
  var focusMeterPct = document.getElementById('focusMeterPct');
  var subjectSelect = document.getElementById('subjectSelect');

  var FOCUS_GOAL_SECONDS = 3 * 60 * 60;
  var sessionInterval = null;
  var sessionRemaining = 0;
  var sessionTotal = 0;
  var cumulativeSeconds = 0;

  focusBtn.addEventListener('click', function() {
    focusPanel.classList.toggle('show');
    renderSubjectProgress();
  });

  function updateSessionDisplay() {
    var m = Math.floor(sessionRemaining / 60);
    var s = sessionRemaining % 60;
    focusSessionTime.textContent = pad(m) + ':' + pad(s);
    var donePct = sessionTotal > 0 ? ((sessionTotal - sessionRemaining) / sessionTotal) * 100 : 0;
    focusSessionFill.style.width = donePct + '%';
  }

  function updateMeter() {
    var pct2 = Math.min(100, Math.round((cumulativeSeconds / FOCUS_GOAL_SECONDS) * 100));
    focusMeterFill.style.width = pct2 + '%';
    focusMeterPct.textContent = pct2 + '%';
  }

  function startSession(seconds) {
    clearInterval(sessionInterval);
    sessionTotal = seconds;
    sessionRemaining = seconds;
    window.sessionTotal = sessionTotal;
    window.sessionRemaining = sessionRemaining;
    focusSession.classList.add('active');
    updateSessionDisplay();
    sessionInterval = setInterval(function() {
      sessionRemaining--;
      window.sessionRemaining = sessionRemaining;
      window.sessionInterval = sessionInterval;
      cumulativeSeconds++;
      updateSessionDisplay();
      updateMeter();
      if (window.updateTabTitle) window.updateTabTitle();
      if (sessionRemaining <= 0) {
        clearInterval(sessionInterval);
        sessionInterval = null;
        window.sessionInterval = null;
        window.sessionRemaining = 0;
        focusSession.classList.remove('active');
        presetBtns.forEach(function(b) { b.classList.remove('active'); });
        var subject = subjectSelect.value;
        recordStudyCompleted(subject, Math.round(sessionTotal / 60));
        if (window.maybeNotify) window.maybeNotify('Focus session complete — nice work! 🎯');
        if (window.updateTabTitle) window.updateTabTitle();
      }
    }, 1000);
  }

  presetBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      presetBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      startSession(parseInt(btn.dataset.mins, 10) * 60);
    });
  });

  focusStopBtn.addEventListener('click', function() {
    clearInterval(sessionInterval);
    sessionInterval = null;
    window.sessionInterval = null;
    window.sessionRemaining = 0;
    // Stopping early shouldn't erase progress already made — credit whatever
    // whole minutes were completed before crediting nothing at all.
    var elapsedMins = Math.floor((sessionTotal - sessionRemaining) / 60);
    if (elapsedMins >= 1) {
      recordStudyCompleted(subjectSelect.value, elapsedMins);
    }
    sessionTotal = 0;
    sessionRemaining = 0;
    focusSession.classList.remove('active');
    presetBtns.forEach(function(b) { b.classList.remove('active'); });
    if (window.updateTabTitle) window.updateTabTitle();
  });

  /* EXTEND TIMER + SESSION HOOKS (used by the +5/+10 buttons and Lock-in mode):
     the interval reads the local sessionRemaining/sessionTotal, so we expose
     controlled accessors from inside this closure. */
  window.extendSession = function(mins) {
    if (!sessionInterval || sessionRemaining <= 0) return false;
    var m = Math.max(1, Math.round(mins));
    sessionRemaining += m * 60;
    sessionTotal += m * 60;
    window.sessionRemaining = sessionRemaining;
    window.sessionTotal = sessionTotal;
    updateSessionDisplay();
    return true;
  };
  window.isSessionActive = function() {
    return !!sessionInterval && sessionRemaining > 0;
  };
  /* PAUSE / RESUME (used by the mobile timer page). Pausing stops the
     countdown without crediting anything; resuming continues from where
     it stopped. */
  var pausedRemaining = 0;
  window.pauseSession = function() {
    if (!sessionInterval || sessionRemaining <= 0) return false;
    clearInterval(sessionInterval);
    sessionInterval = null;
    pausedRemaining = sessionRemaining;
    window.sessionInterval = null;
    return true;
  };
  window.resumeSession = function() {
    if (sessionInterval || pausedRemaining <= 0) return false;
    sessionRemaining = pausedRemaining;
    pausedRemaining = 0;
    sessionTotal = Math.max(sessionTotal, sessionRemaining);
    window.sessionRemaining = sessionRemaining;
    window.sessionTotal = sessionTotal;
    focusSession.classList.add('active');
    updateSessionDisplay();
    sessionInterval = setInterval(function() {
      sessionRemaining--;
      window.sessionRemaining = sessionRemaining;
      cumulativeSeconds++;
      updateSessionDisplay();
      updateMeter();
      if (window.updateTabTitle) window.updateTabTitle();
      if (sessionRemaining <= 0) {
        clearInterval(sessionInterval);
        sessionInterval = null;
        window.sessionInterval = null;
        window.sessionRemaining = 0;
        pausedRemaining = 0;
        focusSession.classList.remove('active');
        presetBtns.forEach(function(b) { b.classList.remove('active'); });
        var subject = subjectSelect.value;
        recordStudyCompleted(subject, Math.round(sessionTotal / 60));
        if (window.maybeNotify) window.maybeNotify('Focus session complete — nice work! 🎯');
        if (window.updateTabTitle) window.updateTabTitle();
      }
    }, 1000);
    return true;
  };
  window.isPaused = function() { return pausedRemaining > 0; };

  // Hive Motivation
  var motivationBubble = document.getElementById('motivationBubble');
  var motivationTimeout = null;

  function getHourBucket() {
    var h = new Date().getHours();
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    if (h >= 17 && h < 18) return 'dusk';
    return 'night';
  }

  var motivationByTime = {
    dawn: [
      "🌅 The sun is up and so are you. Let's build something today.",
      "🐝 Dawn is the hive's favorite time to start fresh.",
      "🍯 Morning nectar is the sweetest — grab it while it's fresh.",
      "🐝 The early bee gets the A. You're already ahead.",
      "🍯 5 AM courage beats 5 PM regret. Every single time.",
      "🐝 The world is quiet. Your mind shouldn't be. Study.",
      "🍯 Sunrise + flashcards = unstoppable combo.",
      "🐝 While others snooze, you choose to improve.",
      "🍯 Dawn is proof that every day is a reset button.",
      "🐝 The hive hums loudest in the morning. Join the chorus.",
      "🍯 Your brain is a sponge right now. Soak up the knowledge.",
      "🐝 First light, first fight — against procrastination.",
      "🍯 Morning grind > morning scroll. You know this.",
      "🐝 The queen is watching your morning hustle. Impress her.",
      "🍯 Every sunrise is the universe saying 'try again'."
    ],
    morning: [
      "🐝 Buzz buzz — one more page, you've got this!",
      "🍯 Every minute you study sweetens the hive.",
      "🐝 The colony believes in you. Keep going!",
      "🍯 Small steps today, golden results later.",
      "🐝 You're closer to the goal than you think.",
      "🍯 Stay focused — the honey doesn't make itself!",
      "🐝 Deep breath. You've handled harder than this.",
      "🍯 90% is waiting for you. Go get it.",
      "🐝 The hive is proud of your hustle today.",
      "🍯 Consistency is the real honey — keep it flowing.",
      "🐝 One more flashcard, one more flower.",
      "🍯 The queen believes in your grind.",
      "🐝 Worker bees built empires one trip at a time.",
      "🍯 You don't need motivation, just the next five minutes.",
      "🐝 Every rep in the hive matters — even the small ones.",
      "🍯 Progress is sticky, sweet, and slow. That's okay.",
      "🐝 Sting your doubts, not your goals.",
      "🍯 A focused bee never checks its phone mid-flight.",
      "🐝 You're not behind. You're building a hive, brick by brick.",
      "🍯 Nectar today, honey tomorrow.",
      "🐝 Even bees rest — but they always come back to work.",
      "🍯 The hive remembers every hour you gave it.",
      "🐝 Keep your wings moving, even in small circles.",
      "🍯 You showed up. That's half the battle, buzzing bee.",
      "🐝 No hive was built by bees who quit early.",
      "🍯 Golden days are made of unremarkable ones.",
      "🐝 Trust the process — the comb fills itself slowly.",
      "🍯 You are exactly the bee this hive needs.",
      "🐝 Discipline is just love for your future self.",
      "🍯 Ten more minutes. Then rest. Deal?"
    ],
    afternoon: [
      "🐝 The midday grind separates champions from wannabes.",
      "🍯 Afternoon energy dip? Push through. The hive needs you.",
      "🐝 Lunch break is over. Time to feast on knowledge.",
      "🍯 The sun is high. Your standards should be higher.",
      "🐝 Afternoon sessions build the deepest comb.",
      "🍯 Tired? Good. That means you're working hard enough.",
      "🐝 The 2 PM slump is a myth for bees like you.",
      "🍯 Keep buzzing — the afternoon belongs to the persistent.",
      "🐝 One more chapter before the sun starts setting.",
      "🍯 Your future self is rooting for you RIGHT NOW.",
      "🐝 Afternoon focus is a superpower. Use it.",
      "🍯 The hive doesn't pause for tea time. Neither do you.",
      "🐝 Push through the wall. There's honey on the other side.",
      "🍯 Every afternoon session is a deposit in your success account.",
      "🐝 The grind doesn't stop because you're sleepy. WAKE UP.",
      "🍯 You've got more in the tank than you think. Empty it.",
      "🐝 Afternoon doubt is the enemy. Swarm it.",
      "🍯 The best bees work while others nap. Be the best bee.",
      "🐝 This is where average ends and excellence begins.",
      "🍯 One more problem set. One more step toward freedom."
    ],
    dusk: [
      "🐝 The day is ending. Did you give it your all?",
      "🍯 Dusk is for reflection — and one last push.",
      "🐝 The sun sets on today, but your effort remains forever.",
      "🍯 One more session before the stars come out.",
      "🐝 Evening bees are the most determined. Prove it.",
      "🍯 Close strong. The hive remembers how you finish.",
      "🐝 Dusk is not an excuse to stop. It's a deadline to beat.",
      "🍯 Finish today so tomorrow thanks you.",
      "🐝 The golden hour is now. Make it count.",
      "🍯 Last lap of the day. Sprint it."
    ],
    night: [
      "🌙 The hive sleeps, but your dreams are still working.",
      "🍯 Rest is not quitting. It's reloading.",
      "🐝 Tomorrow's victory starts with tonight's sleep.",
      "🍯 Close the books. Open your eyes to rest.",
      "🐝 Even the hardest working bee needs darkness.",
      "🍯 Your brain is organizing today while you sleep. Let it.",
      "🐝 Night is the hive's way of saying 'pause, don't stop'.",
      "🍯 Sleep deep. The 5 AM alarm is your friend, not foe.",
      "🐝 Recharge tonight. Dominate tomorrow.",
      "🍯 The moon watches over your textbooks. They'll be there in the morning.",
      "🐝 Rest now so the sergeant doesn't have to drag you out of bed.",
      "🍯 Your pillow is your most important study tool right now.",
      "🐝 Night is for recovery, not regret. Sleep well.",
      "🍯 The stars are out. So should your lights be.",
      "🐝 Tomorrow's energy is brewed in tonight's sleep.",
      "🍯 The hive glows even in darkness. So do you. Rest.",
      "🐝 8 hours of sleep = 8 hours of invisible progress.",
      "🍯 Let go of today. Grab tomorrow after sunrise.",
      "🐝 The night belongs to dreamers who work by day.",
      "🍯 Sleep is the ultimate productivity hack. Use it.",
      "🍯 Your brain is defragmenting right now. Let it run.",
      "🐝 Your sergeant approves of this bedtime. 0500 formation.",
      "🍯 Rest hard, study harder. That's the motto.",
      "🐝 The darkness is temporary. Your grind is permanent.",
      "🍯 Close your eyes. The hive has your back.",
      "🐝 Goodnight, recruit. The morning awaits your greatness.",
      "🍯 Sleep is the bridge between today's effort and tomorrow's results.",
      "🐝 Recharge those neurons. The battlefield opens at dawn.",
      "🍯 The best study session is the one after great sleep.",
      "🐝 Night mode: activated. Recovery mode: engaged.",
      "🍯 Don't fear the dark. Fear being tired when the light returns."
    ]
  };

  /* DOUBLE-TAP FIX: a quick second tap used to fire a second,
     randomly-different quote and restart the 4s timer (flicker + weird feel).
     Now taps within 450ms of the previous one are ignored. */
  var motivationLastShownAt = 0;
  function showMotivation() {
    var now = Date.now();
    if (now - motivationLastShownAt < 450) return;
    motivationLastShownAt = now;
    var bucket = getHourBucket();
    var pool = motivationByTime[bucket] || motivationByTime.morning;
    var line = pool[Math.floor(Math.random() * pool.length)];
    motivationBubble.textContent = line;
    motivationBubble.classList.add('show');
    clearTimeout(motivationTimeout);
    motivationTimeout = setTimeout(function() {
      motivationBubble.classList.remove('show');
    }, 4000);
  }

  hiveWrap.addEventListener('click', showMotivation);
  hiveWrap.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showMotivation();
    }
  });

  // Fullscreen
  var fsBtn = document.getElementById('fsBtn');
  var fsIcon = document.getElementById('fsIcon');
  var expandPath = '<path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>';
  var collapsePath = '<path d="M9 3v3a2 2 0 0 1-2 2H4"></path><path d="M15 3v3a2 2 0 0 0 2 2h3"></path><path d="M9 21v-3a2 2 0 0 0-2-2H4"></path><path d="M15 21v-3a2 2 0 0 1 2-2h3"></path>';
  function updateIcon() {
    fsIcon.innerHTML = document.fullscreenElement ? collapsePath : expandPath;
  }
  fsBtn.addEventListener('click', function() {
    /* ROBUSTNESS FIX: iPhone Safari (and some in-app webviews) do not expose
       requestFullscreen on <body>, so this used to throw "requestFullscreen is
       not a function" instead of failing quietly. Feature-detect, try the
       vendor-prefixed forms, and fall back to the app's own pseudo-fullscreen
       class if the real API is unavailable. */
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        var el = document.body;
        var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (req) {
          var r = req.call(el);
          if (r && typeof r.catch === 'function') r.catch(function(){});
        } else {
          document.body.classList.add('pseudo-fullscreen');
        }
      } else {
        var exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if (exit) {
          var x = exit.call(document);
          if (x && typeof x.catch === 'function') x.catch(function(){});
        }
        document.body.classList.remove('pseudo-fullscreen');
      }
    } catch (e) { /* never let the fullscreen button break the page */ }
  });
  document.addEventListener('fullscreenchange', updateIcon);
  updateIcon();

/* ---- end guarded countdown IIFE (crash fix) ---- */
})();
