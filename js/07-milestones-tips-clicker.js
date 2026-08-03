/* =====================================================================
   Study Hive — 07-milestones-tips-clicker.js
   Extracted from the original single-file build (script block #5).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function storageGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function storageSet(k,v){ try { localStorage.setItem(k, v); } catch(e){} }

  function showMilestoneToast(msg, holdMs){
    var t = $('milestoneToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showMilestoneToast._t);
    showMilestoneToast._t = setTimeout(function(){ t.classList.remove('show'); }, holdMs || 4200);
  }
  /* GLOBAL TOAST FIX: showMilestoneToast used to stay private to this file,
     so every guarded call elsewhere in the app (typeof showMilestoneToast)
     was silently dead. Exposing it makes toasts work everywhere. */
  window.showMilestoneToast = showMilestoneToast;

  function wireSimpleToggle(btnId, panelId){
    var b = $(btnId), p = $(panelId);
    if (b && p) b.addEventListener('click', function(){ p.classList.toggle('show'); });
  }
  wireSimpleToggle('capsuleBtn', 'capsulePanel');
  wireSimpleToggle('punsBtn', 'punsPanel');
  wireSimpleToggle('waterBtn', 'waterPanel');
  wireSimpleToggle('musicBtn', 'musicPanel');
  wireSimpleToggle('feedbackBtn', 'feedbackPanel');
  wireSimpleToggle('tipsBtn', 'tipsPanel');

  /* ---------------- Feedback ----------------
     Fill in FEEDBACK_ENDPOINT with a free Formspree (or similar) form
     endpoint to receive these by email. Until it's set, this falls back
     to opening the visitor's email client instead, so it still works. */
  var FEEDBACK_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxxxxx'
  function buildFeedbackMessage(){
    var text = ($('feedbackText').value || '').trim();
    var email = ($('feedbackEmail').value || '').trim();
    var cat = ($('feedbackCategory') && $('feedbackCategory').value) || 'General';
    var rating = ($('feedbackRating') && $('feedbackRating').value) || 'not rated';
    var context = '';
    if ($('feedbackIncludeStats') && $('feedbackIncludeStats').checked) {
      context = '\n\nContext (non-sensitive):\n' +
        '- Page: ' + location.pathname + '\n' +
        '- Screen: ' + window.innerWidth + 'x' + window.innerHeight + '\n' +
        '- Device mode: ' + (window.HiveDevice && window.HiveDevice.type || 'unknown') + '\n' +
        '- Theme: ' + (document.body.getAttribute('data-theme') || 'honey') + '\n' +
        '- Night mode: ' + document.body.classList.contains('night-mode');
    }
    return 'Study Hive Feedback\nCategory: ' + cat + '\nRating: ' + rating + '/5\nReply email: ' + (email || 'not provided') + '\n\nMessage:\n' + (text || '[empty]') + context;
  }
  function updateFeedbackPreview(){
    var msg = buildFeedbackMessage();
    var prev = $('feedbackPreview');
    if (prev) { prev.textContent = msg; prev.style.display = 'block'; }
    return msg;
  }
  var feedbackSendBtn = $('feedbackSendBtn');
  if (feedbackSendBtn) feedbackSendBtn.addEventListener('click', function(){
    var text = ($('feedbackText').value || '').trim();
    var statusEl = $('feedbackStatus');
    if (!text) { statusEl.textContent = 'Type a few details first — even one sentence helps the hive.'; return; }
    var msg = updateFeedbackPreview();
    try { localStorage.setItem('hive-feedback-last-v1', msg); } catch(e){}
    if (FEEDBACK_ENDPOINT) {
      statusEl.textContent = 'Sending...';
      fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ category: $('feedbackCategory').value, rating: $('feedbackRating').value, message: text, email: $('feedbackEmail').value, context: msg })
      }).then(function(r){
        if (r.ok) { $('feedbackText').value = ''; statusEl.textContent = '✅ Sent — thank you for helping the hive improve.'; showMilestoneToast('🐝 Feedback sent — thank you!', 4200); }
        else statusEl.textContent = "Couldn't send that — use Copy and send it manually.";
      }).catch(function(){ statusEl.textContent = "Couldn't send that — use Copy and send it manually."; });
    } else {
      statusEl.textContent = 'Feedback prepared below. Use Copy, or your email app may open now.';
      var subject = encodeURIComponent('Study Hive feedback — ' + (($('feedbackCategory') && $('feedbackCategory').value) || 'General'));
      var body = encodeURIComponent(msg);
      try { window.location.href = 'mailto:studyhive.co.za@gmail.com?subject=' + subject + '&body=' + body; } catch(e){}
    }
  });
  var feedbackCopyBtn = $('feedbackCopyBtn');
  if (feedbackCopyBtn) feedbackCopyBtn.addEventListener('click', function(){
    var msg = updateFeedbackPreview();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(function(){ $('feedbackStatus').textContent = '📋 Copied feedback to clipboard.'; });
    else window.prompt('Copy this feedback:', msg);
  });
  var feedbackDraftBtn = $('feedbackDraftBtn');
  if (feedbackDraftBtn) feedbackDraftBtn.addEventListener('click', function(){
    try { localStorage.setItem('hive-feedback-draft-v1', JSON.stringify({text:$('feedbackText').value,email:$('feedbackEmail').value,category:$('feedbackCategory').value,rating:$('feedbackRating').value})); } catch(e){}
    $('feedbackStatus').textContent = '💾 Draft saved locally.';
  });
  (function(){
    try { var d = JSON.parse(localStorage.getItem('hive-feedback-draft-v1') || 'null'); if (d) { if($('feedbackText')) $('feedbackText').value=d.text||''; if($('feedbackEmail')) $('feedbackEmail').value=d.email||''; if($('feedbackCategory')) $('feedbackCategory').value=d.category||'Bug'; if($('feedbackRating')) $('feedbackRating').value=d.rating||'5'; } } catch(e){}
  })();

  /* ---------------- Study Tips ---------------- */
  var STUDY_TIPS = [
    "The Pomodoro technique works because it fights dread, not focus — 25 minutes feels doable when an hour doesn't.",
    "Study right before sleep if you can. Your brain consolidates memory overnight, and last-in tends to stick.",
    "Explain it out loud like you're teaching it to someone. If you get stuck, that's exactly the gap to go study.",
    "Spaced repetition beats re-reading. Quiz yourself a day later, then three days later, then a week later.",
    "A messy desk is a decision tax — every glance at clutter is a tiny decision. Clear it before you start, not during.",
    "Drink water before you sit down, not during a slump. Mild dehydration shows up as fatigue, not thirst.",
    "Switch subjects when you plateau, not when you finish. Interleaving beats single-subject marathons for retention.",
    "Write down the one thing you're avoiding studying. That's usually exactly what to study first.",
    "A 5-minute walk resets focus better than another cup of coffee once you're already wired.",
    "Set a timer for 'just 10 minutes' when you don't want to start. Starting is the whole battle."
  ];
  var lastTipIdx = -1;
  function showRandomTip(){
    var idx;
    do { idx = Math.floor(Math.random() * STUDY_TIPS.length); } while (idx === lastTipIdx && STUDY_TIPS.length > 1);
    lastTipIdx = idx;
    var el = $('tipText');
    if (el) el.textContent = STUDY_TIPS[idx];
  }
  var tipsBtnEl = $('tipsBtn');
  if (tipsBtnEl) tipsBtnEl.addEventListener('click', showRandomTip);
  var tipNextBtn = $('tipNextBtn');
  if (tipNextBtn) tipNextBtn.addEventListener('click', showRandomTip);

  /* ---------------- 1. Live tab-title countdown ---------------- */
  function updateTabTitle(){
    try {
      if (window.sessionInterval && window.sessionRemaining > 0) {
        var m2 = Math.floor(window.sessionRemaining / 60), s2 = window.sessionRemaining % 60;
        document.title = '🎯 ' + pad(m2) + ':' + pad(s2) + ' focusing…';
        return;
      }
      var target = getTargetDate();
      var diff = target - new Date();
      if (diff <= 0) { document.title = "🎉 School's Out!"; return; }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      document.title = '🐝 ' + d + 'd ' + h + 'h left · Countdown';
    } catch(e) {}
  }
  updateTabTitle();
  setInterval(updateTabTitle, 30000);
  window.updateTabTitle = updateTabTitle;

  /* ---------------- 12. Browser notification permission ---------------- */
  var notifEnabled = storageGet('browser-notif-v1') === '1';
  function setNotifToggleUI(){ var el = $('browserNotifToggle'); if (el) el.classList.toggle('on', notifEnabled); }
  setNotifToggleUI();
  var notifToggleEl = $('browserNotifToggle');
  if (notifToggleEl) notifToggleEl.addEventListener('click', function(){
    if (!notifEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then(function(perm){
          if (perm === 'granted') {
            notifEnabled = true;
            storageSet('browser-notif-v1', '1');
            setNotifToggleUI();
            showMilestoneToast('🔔 Milestone notifications enabled!');
          } else {
            showMilestoneToast('Notifications blocked — check your browser settings.');
          }
        });
      } else {
        showMilestoneToast('Notifications aren\'t supported in this browser.');
      }
    } else {
      notifEnabled = false;
      storageSet('browser-notif-v1', '0');
      setNotifToggleUI();
    }
  });
  function maybeNotify(msg){
    if (notifEnabled && 'Notification' in window && Notification.permission === 'granted') {
      try { new Notification('🐝 Study Hive', { body: msg }); } catch(e){}
    }
  }
  window.maybeNotify = maybeNotify;

  /* ---------------- 2. Milestone celebrations ---------------- */
  var MILESTONES = [100, 50, 30, 21, 14, 10, 7, 3, 1, 0];
  function checkMilestones(){
    try {
      var target = getTargetDate();
      var diff = target - new Date();
      var daysLeft = Math.ceil(diff / 86400000);
      var seen = JSON.parse(storageGet('milestones-seen-v1') || '[]');
      if (MILESTONES.indexOf(daysLeft) !== -1 && seen.indexOf(daysLeft) === -1) {
        seen.push(daysLeft);
        storageSet('milestones-seen-v1', JSON.stringify(seen));
        var msg = daysLeft === 0 ? "🎉 TODAY'S THE DAY — you made it!" : ('🐝 ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's') + ' left — the whole hive can feel it!');
        showMilestoneToast(msg, 5500);
        maybeNotify(msg);
      }
    } catch(e) {}
  }
  checkMilestones();
  setInterval(checkMilestones, 60000);

  /* ---------------- 3. Time Capsule to your future self ---------------- */
  function refreshCapsuleUI(){
    var lockedView = $('capsuleLockedView'), unlockedView = $('capsuleUnlockedView');
    if (!lockedView || !unlockedView) return;
    var raw = storageGet('time-capsule-v1');
    if (!raw) {
      lockedView.style.display = '';
      unlockedView.style.display = 'none';
      $('capsuleTextarea').disabled = false;
      $('capsuleSaveBtn').disabled = false;
      $('capsuleStatus').textContent = 'No capsule sealed yet.';
      return;
    }
    var data;
    try { data = JSON.parse(raw); } catch(e) { data = null; }
    if (!data) return;
    if (Date.now() >= data.unlockAt) {
      lockedView.style.display = 'none';
      unlockedView.style.display = '';
      $('capsuleRevealText').textContent = data.message;
    } else {
      lockedView.style.display = '';
      unlockedView.style.display = 'none';
      $('capsuleTextarea').disabled = true;
      $('capsuleSaveBtn').disabled = true;
      var daysLeft = Math.ceil((data.unlockAt - Date.now()) / 86400000);
      $('capsuleStatus').textContent = '🔒 Sealed. Unlocks in ' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's') + '.';
    }
  }
  var capsuleSaveBtn = $('capsuleSaveBtn');
  if (capsuleSaveBtn) capsuleSaveBtn.addEventListener('click', function(){
    var msg = $('capsuleTextarea').value.trim();
    if (!msg) return;
    var unlockAt = getTargetDate().getTime();
    storageSet('time-capsule-v1', JSON.stringify({ message: msg, unlockAt: unlockAt, sealedAt: Date.now() }));
    refreshCapsuleUI();
    markSecretFound('capsule');
    showMilestoneToast('✉️ Sealed! Come back on the last day to read it.');
  });
  var capsuleClearBtn = $('capsuleClearBtn');
  if (capsuleClearBtn) capsuleClearBtn.addEventListener('click', function(){
    try { localStorage.removeItem('time-capsule-v1'); } catch(e){}
    $('capsuleTextarea').value = '';
    refreshCapsuleUI();
  });
  refreshCapsuleUI();
  setInterval(refreshCapsuleUI, 60000);

  /* ---------------- 4. Cursor pollen trail ---------------- */
  var pollenEnabled = storageGet('pollen-trail-v1') === '1';
  function setPollenToggleUI(){ var el = $('pollenTrailToggle'); if (el) el.classList.toggle('on', pollenEnabled); }
  setPollenToggleUI();
  var pollenToggleEl = $('pollenTrailToggle');
  if (pollenToggleEl) pollenToggleEl.addEventListener('click', function(){
    pollenEnabled = !pollenEnabled;
    storageSet('pollen-trail-v1', pollenEnabled ? '1' : '0');
    setPollenToggleUI();
  });
  var lastPollenTime = 0;
  document.addEventListener('mousemove', function(e){
    if (!pollenEnabled) return;
    var now = Date.now();
    if (now - lastPollenTime < 70) return;
    lastPollenTime = now;
    var dot = document.createElement('div');
    dot.className = 'pollen-trail-dot';
    dot.style.left = (e.clientX - 3) + 'px';
    dot.style.top = (e.clientY - 3) + 'px';
    document.body.appendChild(dot);
    setTimeout(function(){ dot.remove(); }, 900);
  });

  /* ---------------- 5. Misc input handling ---------------- */
  var seqA = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var seqAProgress = 0;
  var seqBTarget = 'propolis';
  var seqBBuffer = '';
  var armedUntil = 0;
  var ARM_WINDOW_MS = 6000;
  var godModeActive = false;
  var godModeRainTimer = null;
  var godModeCrownTimer = null;

  document.addEventListener('keydown', function(e){
    var key = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
    var expected = seqA[seqAProgress];
    if (key === expected) {
      seqAProgress++;
      if (seqAProgress === seqA.length) {
        seqAProgress = 0;
        armedUntil = Date.now() + ARM_WINDOW_MS;
        seqBBuffer = '';
      }
    } else {
      seqAProgress = (key === seqA[0]) ? 1 : 0;
    }
  });
  document.addEventListener('keypress', function(e){
    if (Date.now() > armedUntil) return;
    var k = (e.key || '').toLowerCase();
    if (k.length !== 1) return;
    seqBBuffer += k;
    if (seqBBuffer.length > seqBTarget.length) seqBBuffer = seqBBuffer.slice(-seqBTarget.length);
    if (seqBBuffer === seqBTarget) {
      armedUntil = 0;
      seqBBuffer = '';
      godModeActive ? deactivateGodMode() : activateGodMode();
    }
  });

  function spawnGodBee(){
    var b = document.createElement('div');
    b.textContent = '🐝';
    b.style.cssText = 'position:fixed;top:-30px;left:' + (Math.random()*100) + 'vw;font-size:' + (16 + Math.random()*14) + 'px;z-index:200;pointer-events:none;filter:drop-shadow(0 0 5px #ffd54f);transition:transform 2.4s linear, opacity 2.4s linear;';
    document.body.appendChild(b);
    requestAnimationFrame(function(){
      b.style.transform = 'translateY(110vh) rotate(' + (Math.random()*360) + 'deg)';
    });
    setTimeout(function(){ b.remove(); }, 2500);
  }
  function godBeeBurst(count){
    for (var i = 0; i < count; i++) {
      (function(i){ setTimeout(spawnGodBee, i * 75); })(i);
    }
  }

  function activateGodMode(){
    if (godModeActive) return;
    godModeActive = true;
    document.body.classList.add('god-mode');
    var t = $('godModeToast');
    if (t) {
      t.textContent = '🐝👑 Long live the Queen.';
      t.classList.add('show');
      setTimeout(function(){ t.classList.remove('show'); }, 3000);
    }
    var veil = $('godModeVeil');
    if (veil) veil.classList.add('show');

    godBeeBurst(26);
    // gentle ongoing bee rain + crown particles while active
    godModeRainTimer = setInterval(function(){ godBeeBurst(6); }, 4000);
    godModeCrownTimer = setInterval(function(){
      var c = document.createElement('div');
      c.className = 'god-mode-crown-particle';
      c.textContent = '👑';
      c.style.left = (Math.random()*100) + 'vw';
      c.style.top = (Math.random()*30) + 'vh';
      document.body.appendChild(c);
      setTimeout(function(){ c.remove(); }, 1000);
    }, 900);

    // Preview every locked achievement in gold while god mode is on
    document.querySelectorAll('.award-cell.locked').forEach(function(el){ el.classList.add('god-preview'); });

    // Level badge gets a temporary crown
    var lb = $('levelBadge');
    if (lb && lb.dataset.godOrig === undefined) {
      lb.dataset.godOrig = lb.innerHTML;
      lb.innerHTML = '👑 GOD MODE <span class="xp-count">unlimited</span>';
      lb.classList.add('show');
    }
  }

  function deactivateGodMode(){
    if (!godModeActive) return;
    godModeActive = false;
    document.body.classList.remove('god-mode');
    clearInterval(godModeRainTimer);
    clearInterval(godModeCrownTimer);
    var veil = $('godModeVeil');
    if (veil) veil.classList.remove('show');
    document.querySelectorAll('.award-cell.god-preview').forEach(function(el){ el.classList.remove('god-preview'); });
    var lb = $('levelBadge');
    if (lb && lb.dataset.godOrig !== undefined) {
      lb.innerHTML = lb.dataset.godOrig;
      delete lb.dataset.godOrig;
      lb.classList.remove('show');
    }
  }
  /* ---------------- 6. "honey" magic word easter egg ---------------- */
  var honeyBuffer = '';
  document.addEventListener('keypress', function(e){
    honeyBuffer += (e.key || '').toLowerCase();
    if (honeyBuffer.length > 20) honeyBuffer = honeyBuffer.slice(-20);
    if (honeyBuffer.indexOf('honey') !== -1) {
      honeyBuffer = '';
      triggerHoneyRain();
    }
  });
  function triggerHoneyRain(){
    markSecretFound('honey');
    showMilestoneToast('🍯 Someone said the magic word!');
    for (var i = 0; i < 18; i++) {
      (function(i){
        setTimeout(function(){
          var d = document.createElement('div');
          d.className = 'honey-rain-drop';
          d.textContent = '🍯';
          d.style.left = (Math.random()*100) + 'vw';
          d.style.animationDuration = (2 + Math.random()*1.5) + 's';
          document.body.appendChild(d);
          setTimeout(function(){ d.remove(); }, 4000);
        }, i * 70);
      })(i);
    }
  }

  /* ---------------- 7. Bee-clicker mini-game (triple-click the hive) ---------------- */
  var clickerBest = parseInt(storageGet('clicker-best-v1') || '0', 10);
  var clickerCountdown = null, clickerScore = 0, clickerSecondsLeft = 10;
  function moveClickerTarget(){
    var arena = $('clickerArena'), t = $('clickerTarget');
    if (!arena || !t) return;
    var maxX = Math.max(0, arena.clientWidth - 40), maxY = Math.max(0, arena.clientHeight - 40);
    t.style.left = (Math.random() * maxX) + 'px';
    t.style.top = (Math.random() * maxY) + 'px';
  }
  /* DOUBLE-PRESS FIX: opening the clicker overlay used to be bound to
     dblclick, so an accidental fast double-press hijacked the whole screen
     (and on phones the browser also zoomed in — see touch-action in styles.css).
     Now it needs THREE quick taps, never opens on top of another open panel,
     and never restarts while already open. */
  window.__anyOverlayShowing = function(){
    var sels = ['.onboard-veil.show','.upg-full-overlay.show','.tour-overlay.show',
      '.queen-story-overlay.show','.queen-v2-overlay.show','.god-mode-veil.show',
      '.sos-veil.show','.session-summary-veil.show','.pledge-lock-veil.show',
      '.celebration-overlay.show','.misc-panel.show','.bee-ai-panel.show',
      '.focus-panel.show','.todo-panel.show','.grade-panel.show',
      '.garden-panel-full.show','.hive-menu-panel.show','.upgrade-panel.show',
      '.backup-center-panel.show','.admin-panel.show','.breathing-panel.show',
      '.og-card-panel.show','.launch-check-panel.show','.hive-coach-panel.show'];
    return !!document.querySelector(sels.join(','));
  };
  function openClicker(){
    var ov = $('clickerOverlay');
    if (!ov || ov.classList.contains('show')) return;       /* already open */
    if (window.__anyOverlayShowing()) return;               /* another panel is open */
    markSecretFound('clicker');
    clickerScore = 0; clickerSecondsLeft = 10;
    $('clickerScore').textContent = 'Score: 0';
    $('clickerTime').textContent = '10s';
    $('clickerBest').textContent = 'Best: ' + clickerBest;
    $('clickerOverlay').classList.add('show');
    moveClickerTarget();
    clearInterval(clickerCountdown);
    clickerCountdown = setInterval(function(){
      clickerSecondsLeft--;
      $('clickerTime').textContent = clickerSecondsLeft + 's';
      if (clickerSecondsLeft <= 0) endClicker();
    }, 1000);
  }
  function endClicker(){
    clearInterval(clickerCountdown);
    if (clickerScore > clickerBest) {
      clickerBest = clickerScore;
      storageSet('clicker-best-v1', String(clickerBest));
      showMilestoneToast('🏆 New bee-clicker high score: ' + clickerBest + '!');
    }
    $('clickerOverlay').classList.remove('show');
  }
  var clickerTargetEl = $('clickerTarget');
  if (clickerTargetEl) clickerTargetEl.addEventListener('click', function(){
    clickerScore++;
    $('clickerScore').textContent = 'Score: ' + clickerScore;
    moveClickerTarget();
  });
  var clickerCloseBtn = $('clickerCloseBtn');
  if (clickerCloseBtn) clickerCloseBtn.addEventListener('click', endClicker);
  /* Triple-tap (not double-tap) opens the reflex mini-game. */
  var hiveWrapEl = $('hiveWrap');
  if (hiveWrapEl) {
    var hiveTapTimes = [];
    hiveWrapEl.addEventListener('click', function(){
      hiveTapTimes.push(Date.now());
      hiveTapTimes = hiveTapTimes.filter(function(t){ return Date.now() - t < 500; });
      if (hiveTapTimes.length >= 3) { hiveTapTimes = []; openClicker(); }
    });
  }

  /* ---------------- 8. Bee puns generator ---------------- */
  var BEE_PUNS = [
    "I'm not lion, bees are un-bee-lievably hardworking.",
    "What do you call a bee that can't make up its mind? A may-bee.",
    "Some study tips are just the bee's knees.",
    "Don't worry, be honey.",
    "This countdown is un-bee-atable.",
    "You're doing great — no need to buzz about it.",
    "Bee yourself, everyone else is already taken.",
    "Time flies when you're studying... or so bees tell me.",
    "Queen bee status: unlocked.",
    "Let's stick together, like a bee and honey.",
    "Studying? Just keep buzzing.",
    "A bee's favorite subject is buzz-iness studies.",
    "Why did the bee blush? Because it saw the honey-comb!",
    "Never bee-little your own progress."
  ];
  function showRandomPun(){ var el = $('punText'); if (el) el.textContent = BEE_PUNS[Math.floor(Math.random()*BEE_PUNS.length)]; }
  var punNextBtn = $('punNextBtn');
  if (punNextBtn) punNextBtn.addEventListener('click', showRandomPun);

  /* ---------------- 9. Name your bees ---------------- */
  function loadBeeNames(){
    try { return JSON.parse(storageGet('bee-names-v1') || '{}'); } catch(e){ return {}; }
  }
  var beeNames = loadBeeNames();
  if (beeNames.sergeant && $('sergeantNameInput')) $('sergeantNameInput').value = beeNames.sergeant;
  if (beeNames.buddy && $('buddyNameInput')) $('buddyNameInput').value = beeNames.buddy;
  var saveBeeNamesBtn = $('saveBeeNamesBtn');
  if (saveBeeNamesBtn) saveBeeNamesBtn.addEventListener('click', function(){
    beeNames = {
      sergeant: ($('sergeantNameInput').value || '').trim() || 'Sergeant',
      buddy: ($('buddyNameInput').value || '').trim() || 'Buddy'
    };
    storageSet('bee-names-v1', JSON.stringify(beeNames));
    showMilestoneToast('💾 Saved! ' + beeNames.sergeant + ' and ' + beeNames.buddy + ' say hi. 🐝');
  });

  /* ---------------- 9b. Configurable goal (title / label / target date) ---------------- */
  (function(){
    var titleInput = $('goalTitleInput'), labelInput = $('goalLabelInput'), dateInput = $('goalDateInput'), saveBtn = $('saveGoalBtn');
    if (!saveBtn) return;
    if (titleInput) titleInput.value = getGoalTitle();
    if (labelInput) labelInput.value = getGoalLabel();
    if (dateInput) {
      var d = getTargetDate();
      var yyyy = d.getFullYear(), mm = String(d.getMonth()+1).padStart(2,'0'), dd = String(d.getDate()).padStart(2,'0');
      dateInput.value = yyyy + '-' + mm + '-' + dd;
    }
    saveBtn.addEventListener('click', function(){
      var newTitle = (titleInput.value || '').trim() || '🎓 The Grind';
      var newLabel = (labelInput.value || '').trim() || 'Countdown to your goal';
      var newDateVal = dateInput.value;
      try {
        localStorage.setItem(GOAL_TITLE_KEY, newTitle);
        localStorage.setItem(GOAL_LABEL_KEY, newLabel);
        if (newDateVal) {
          var parsed = new Date(newDateVal + 'T23:59:00');
          if (!isNaN(parsed.getTime())) {
            localStorage.setItem(GOAL_DATE_KEY, parsed.toISOString());
            localStorage.setItem('goal-start-date-v1', new Date().toISOString());
          }
        }
      } catch (e) {}
      showMilestoneToast('💾 Goal saved! Refreshing…');
      setTimeout(function(){ location.reload(); }, 700);
    });
  })();

  /* ---------------- 10. Copy / share countdown summary ---------------- */
  var shareCountdownBtn = $('shareCountdownBtn');
  if (shareCountdownBtn) shareCountdownBtn.addEventListener('click', function(){
    try {
      var target = getTargetDate();
      var diff = Math.max(0, target - new Date());
      var d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000);
      var streak = (typeof studyData !== 'undefined' && studyData.currentStreak) ? studyData.currentStreak : 0;
      var sergeantName = beeNames.sergeant || 'the Sergeant';
      var text = '🎓 ' + d + ' days, ' + h + ' hours until the last day of school!\n🔥 Study streak: ' + streak + ' day' + (streak === 1 ? '' : 's') + '\n' + sergeantName + ' is keeping me on track. 🐝';
      if (navigator.share) {
        navigator.share({ text: text }).catch(function(){});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function(){ showMilestoneToast('📋 Copied to clipboard!'); }, function(){ showMilestoneToast('Could not copy — try again.'); });
      } else {
        window.prompt('Copy this:', text);
      }
    } catch(e) {}
  });

  /* ---------------- 11. Secret bee fact (click footer note 5x fast) ---------------- */
  var BEE_FACTS = [
    "A bee visits about 2 million flowers to make one pound of honey.",
    "Bees 'talk' to each other through a waggle dance that points the way to food.",
    "Honey never spoils — archaeologists have found edible honey in ancient tombs.",
    "A queen bee can lay up to 2,000 eggs a day.",
    "Bees have five eyes — two big ones and three tiny ones on top.",
    "Every worker bee you see out foraging is female.",
    "A bee's wings beat about 200 times per second.",
    "Bees are one of the only insects that make food humans eat.",
    "A single hive can hold up to 60,000 bees."
  ];
  var footerClicks = 0, footerClickTimer = null;
  var footerEl = $('footerNote');
  if (footerEl) {
    footerEl.style.cursor = 'pointer';
    footerEl.title = footerEl.title || 'psst...';
    footerEl.addEventListener('click', function(){
      footerClicks++;
      clearTimeout(footerClickTimer);
      footerClickTimer = setTimeout(function(){ footerClicks = 0; }, 1500);
      if (footerClicks >= 5) {
        footerClicks = 0;
        markSecretFound('beefact');
        var fact = BEE_FACTS[Math.floor(Math.random() * BEE_FACTS.length)];
        var p = $('beeFactPopup');
        if (!p) return;
        p.textContent = '🐝 Bee Fact: ' + fact;
        p.classList.add('show');
        clearTimeout(p._t);
        p._t = setTimeout(function(){ p.classList.remove('show'); }, 5200);
      }
    });
  }

  /* ---------------- 13. Secrets / Easter Egg Tracker ---------------- */
  var SECRETS_LIST = [
    { id: 'honey',    icon: '🍯', name: 'The Magic Word',  hint: 'Type a certain sticky word somewhere on the page' },
    { id: 'beefact',  icon: '🐝', name: 'Bee Whisperer',   hint: 'Click the footer message 5 times quickly' },
    { id: 'clicker',  icon: '🎮', name: 'Hive Reflexes',   hint: 'Double-click the hive icon (bottom right)' },
    { id: 'capsule',  icon: '✉️', name: 'Letter to Tomorrow', hint: 'Seal a Time Capsule message' },
    { id: 'pun',      icon: '😂', name: 'Comedy Bee',      hint: 'Open the Puns panel and get a joke' },
    { id: 'buzz',     icon: '⚡', name: 'Buzz Boost',       hint: 'Type a short sound a bee makes' },
    { id: 'nectar',   icon: '🌼', name: 'Nectar Shower',    hint: 'Type the flower fuel bees collect' },
    { id: 'waggle',   icon: '💃', name: 'Waggle Dance',     hint: 'Type the dance bees use to share directions' },
    { id: 'pollen',   icon: '✨', name: 'Pollen Party',     hint: 'Type the golden dust that clings to bees' },
    { id: 'queenbee', icon: '👑', name: 'Royal Signal',     hint: 'Type the hive leader as one word' },
    { id: 'hivefive', icon: '🖐️', name: 'Hive Five',        hint: 'Type a friendly hive celebration' },
    { id: 'titlefive',icon: '🎓', name: 'Title Tapper',     hint: 'Tap the goal title five times quickly' },
    { id: 'goalfour', icon: '🎯', name: 'Goal Glow',        hint: 'Tap the red goal percentage four times quickly' },
    { id: 'datefour', icon: '📅', name: 'Date Detective',   hint: 'Tap today’s date four times quickly' },
    { id: 'progressfour', icon: '🍯', name: 'Honey Meter',  hint: 'Tap the Hive Progress meter four times quickly' }
  ];
  function getFoundSecrets(){ try { return JSON.parse(storageGet('secrets-found-v1') || '[]'); } catch(e){ return []; } }
  function markSecretFound(id){
    var found = getFoundSecrets();
    if (found.indexOf(id) === -1) {
      found.push(id);
      storageSet('secrets-found-v1', JSON.stringify(found));
      var entry = SECRETS_LIST.filter(function(s){ return s.id === id; })[0];
      if (entry) showMilestoneToast('🕵️ Secret found: ' + entry.icon + ' ' + entry.name + '!', 4800);
    }
    renderSecretsPanel();
  }
  function renderSecretsPanel(){
    var list = $('secretsList'), progress = $('secretsProgress');
    if (!list || !progress) return;
    var found = getFoundSecrets();
    progress.textContent = found.length + ' / ' + SECRETS_LIST.length + ' found';
    list.innerHTML = SECRETS_LIST.map(function(s){
      var isFound = found.indexOf(s.id) !== -1;
      return '<div class="secret-row ' + (isFound ? 'found' : 'locked') + '">' +
        '<span class="secret-icon">' + (isFound ? s.icon : '❓') + '</span>' +
        '<span>' + (isFound ? s.name : ('Locked — ' + s.hint)) + '</span>' +
      '</div>';
    }).join('');
  }
  renderSecretsPanel();
  wireSimpleToggle('secretsBtn', 'secretsPanel');

  var punNextBtnForSecret = $('punNextBtn');
  if (punNextBtnForSecret) punNextBtnForSecret.addEventListener('click', function(){ markSecretFound('pun'); });

  /* ---------------- 14. Time-elapsed countdown progress bar ---------------- */
  function updateTimeElapsedBar(){
    try {
      var fill = $('timeElapsedFill'), pctEl = $('timeElapsedPct');
      if (!fill || !pctEl) return;
      var total = targetDate.getTime() - startDate.getTime();
      var done = Date.now() - startDate.getTime();
      var pct = Math.max(0, Math.min(100, Math.round((done / total) * 100)));
      fill.style.width = pct + '%';
      pctEl.textContent = pct + '%';
    } catch(e) {}
  }
  updateTimeElapsedBar();
  setInterval(updateTimeElapsedBar, 30000);

  /* ---------------- 15. Daily Study Challenge generator ---------------- */
  var CHALLENGES = [
    'Explain today\'s trickiest topic out loud, like you\'re teaching it to someone else.',
    'Write 5 new vocabulary words in a sentence of your own.',
    'Do a 25-minute focused session with your phone in another room.',
    'Redo one flashcard deck without peeking at the answers.',
    'Summarize a chapter in exactly 3 sentences.',
    'Teach a sibling, friend, or even the wall one concept from today.',
    'Find and fix one mistake in your last piece of written work.',
    'Set a 10-minute timer and just start — momentum first, motivation later.',
    'Review yesterday\'s notes before starting anything new.',
    'Write down 3 things you understood well and 1 thing that still confuses you.'
  ];
  function todayChallengeKey(){
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }
  function refreshChallengeUI(){
    var raw = storageGet('daily-challenge-v1');
    var data = null;
    try { data = raw ? JSON.parse(raw) : null; } catch(e){}
    var card = $('challengeCard'), doneBtn = $('challengeDoneBtn');
    if (!card) return;
    if (data && data.date === todayChallengeKey()) {
      card.textContent = data.text;
      /* GLITCH FIX: classList.toggle() takes ONE class token. This passed
         'challenge-done-btn done' (two tokens, with a space), which throws
         InvalidCharacterError and aborted the rest of this function -- so the
         Daily Challenge button never refreshed its label or state. */
      if (doneBtn) {
        doneBtn.classList.add('challenge-done-btn');
        doneBtn.classList.toggle('done', !!data.done);
      }
      if (doneBtn) doneBtn.textContent = data.done ? '✓ Completed today!' : '✓ Mark Done';
    } else {
      card.textContent = 'Tap "New Challenge" to get one.';
      if (doneBtn) { doneBtn.classList.remove('done'); doneBtn.textContent = '✓ Mark Done'; }
    }
  }
  var challengeNewBtn = $('challengeNewBtn');
  if (challengeNewBtn) challengeNewBtn.addEventListener('click', function(){
    var text = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    storageSet('daily-challenge-v1', JSON.stringify({ date: todayChallengeKey(), text: text, done: false }));
    refreshChallengeUI();
  });
  var challengeDoneBtn = $('challengeDoneBtn');
  if (challengeDoneBtn) challengeDoneBtn.addEventListener('click', function(){
    var raw = storageGet('daily-challenge-v1');
    if (!raw) return;
    var data;
    try { data = JSON.parse(raw); } catch(e){ return; }
    if (data.date !== todayChallengeKey() || data.done) return;
    data.done = true;
    storageSet('daily-challenge-v1', JSON.stringify(data));
    var completedCount = parseInt(storageGet('challenges-completed-v1') || '0', 10) + 1;
    storageSet('challenges-completed-v1', String(completedCount));
    refreshChallengeUI();
    showMilestoneToast('🎯 Challenge complete! (' + completedCount + ' total)');
  });
  refreshChallengeUI();
  wireSimpleToggle('challengeBtn', 'challengePanel');

  /* ---------------- 17. Collapsible bottom dock ---------------- */
  var DOCK_PANEL_IDS = ['todoPanel','notesPanel','cardsPanel','habitsPanel','drawPanel','capsulePanel','punsPanel','secretsPanel','challengePanel','waterPanel','musicPanel','feedbackPanel','tipsPanel'];
  var dockToggleBtn = $('dockToggleBtn');
  function setDockOpen(open){
    document.body.classList.toggle('dock-open', open);
    storageSet('dock-open-v1', open ? '1' : '0');
    if (dockToggleBtn) dockToggleBtn.textContent = open ? '🧰 Hide Tools' : '🧰 More Tools';
    if (!open) {
      DOCK_PANEL_IDS.forEach(function(id){
        var p = $(id);
        if (p) p.classList.remove('show');
      });
    }
  }
  if (dockToggleBtn) {
    setDockOpen(storageGet('dock-open-v1') === '1');
    dockToggleBtn.addEventListener('click', function(){
      setDockOpen(!document.body.classList.contains('dock-open'));
    });
  }

  /* ---------------- 18. Zen Focus Mode ---------------- */
  function toggleZenMode(force){
    var open = typeof force === 'boolean' ? force : !document.body.classList.contains('zen-mode');
    document.body.classList.toggle('zen-mode', open);
    if (open) { focusPanel.classList.add('show'); }
  }
  /* ZEN FIX: toggleZenMode was private to this closure, so the Z-key
     shortcut in the XP layer threw "toggleZenMode is not defined". */
  window.toggleZenMode = toggleZenMode;
  var zenModeBtn = $('zenModeBtn');
  if (zenModeBtn) zenModeBtn.addEventListener('click', function(){ toggleZenMode(true); });
  var zenExitBtn = $('zenExitBtn');
  if (zenExitBtn) zenExitBtn.addEventListener('click', function(){ toggleZenMode(false); });

  /* ---------------- 19. Adjustable Night Dimness ---------------- */
  var nightDimSlider = $('nightDimSlider');
  function applyNightDim(pct){
    document.documentElement.style.setProperty('--night-dim', (pct / 100).toFixed(2));
  }
  if (nightDimSlider) {
    var savedDim = parseInt(storageGet('night-dim-v1') || '100', 10);
    nightDimSlider.value = savedDim;
    applyNightDim(savedDim);
    nightDimSlider.addEventListener('input', function(){
      applyNightDim(nightDimSlider.value);
      storageSet('night-dim-v1', nightDimSlider.value);
    });
  }

  /* ---------------- 20. Manual Night Mode Preview ---------------- */
  window.nightPreviewActive = false;
  var previewNightBtn = $('previewNightBtn');
  if (previewNightBtn) previewNightBtn.addEventListener('click', function(){
    window.nightPreviewActive = !window.nightPreviewActive;
    previewNightBtn.textContent = window.nightPreviewActive ? '☀️ Exit Night Preview' : '🌘 Preview Night Mode';
    updateNightMode();
  });

  /* ---------------- 21. Do Not Disturb (mute Sergeant) ---------------- */
  var dndSergeantBtn = $('dndSergeantBtn');
  function isSergeantMuted(){
    var until = parseInt(storageGet('sergeant-mute-until') || '0', 10);
    return Date.now() < until;
  }
  if (dndSergeantBtn) dndSergeantBtn.addEventListener('click', function(){
    storageSet('sergeant-mute-until', String(Date.now() + 3600000));
    showMilestoneToast('🤫 Sergeant muted for 1 hour.');
  });
  var _origShowSergeantNag = showSergeantNag;
  showSergeantNag = function(text, angry){
    if (isSergeantMuted()) return;
    _origShowSergeantNag(text, angry);
  };

  /* ---------------- 22. Ambient Focus Sound ---------------- */
  var ambientCtx = null, ambientSource = null, ambientGain = null, ambientNodes = [], ambientTimers = [];
  function stopAmbientSound(){
    ambientTimers.forEach(function(id){ clearInterval(id); });
    ambientTimers = [];
    if (ambientGain && ambientCtx) {
      try {
        ambientGain.gain.cancelScheduledValues(ambientCtx.currentTime);
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, ambientCtx.currentTime + 0.18);
      } catch(e){}
    }
    ambientNodes.forEach(function(n){ try { n.stop && n.stop(ambientCtx ? ambientCtx.currentTime + 0.2 : undefined); } catch(e){} });
    ambientNodes.forEach(function(n){ try { n.disconnect && n.disconnect(); } catch(e){} });
    ambientNodes = [];
    if (ambientSource) { try { ambientSource.stop(ambientCtx ? ambientCtx.currentTime + 0.2 : undefined); } catch(e){} ambientSource = null; }
    document.querySelectorAll('#ambientSoundBtns .focus-preset-btn').forEach(function(b){ b.classList.remove('active'); });
  }
  function playAmbientSound(type){
    /* AMBIENT SOUND FIX: this used to call stopAmbientSound() first, which
       strips the 'active' class from every button AFTER the handler just
       added it — so the button never stayed lit. The handler already stops
       the previous sound before calling us, so the duplicate stop is gone. */
    try {
      if (!ambientCtx) ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (ambientCtx.state === 'suspended' && ambientCtx.resume) { try { ambientCtx.resume(); } catch(e){} }
      var bufferSize = 2 * ambientCtx.sampleRate;
      var buffer = ambientCtx.createBuffer(1, bufferSize, ambientCtx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      var noise = ambientCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;
      var filter = ambientCtx.createBiquadFilter();
      if (type === 'rain') { filter.type = 'highpass'; filter.frequency.value = 900; }
      else if (type === 'waves') { filter.type = 'lowpass'; filter.frequency.value = 400; }
      else if (type === 'outside') { filter.type = 'lowpass'; filter.frequency.value = 720; filter.Q.value = 0.45; }
      else { filter.type = 'lowpass'; filter.frequency.value = 4000; }
      var gain = ambientCtx.createGain();
      gain.gain.setValueAtTime(0.0001, ambientCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(type === 'outside' ? 0.15 : 0.18, ambientCtx.currentTime + 0.8);
      noise.connect(filter); filter.connect(gain); gain.connect(ambientCtx.destination);
      noise.start();
      ambientSource = noise; ambientGain = gain;
      if (type === 'outside') {
        [185, 231].forEach(function(freq, idx){
          var bee = ambientCtx.createOscillator(); bee.type = 'sine'; bee.frequency.value = freq;
          var bg = ambientCtx.createGain(); bg.gain.value = idx === 0 ? 0.018 : 0.012;
          bee.connect(bg); bg.connect(gain); bee.start(); ambientNodes.push(bee, bg);
        });
        ambientTimers.push(setInterval(function(){
          if (Math.random() < 0.45) return;
          var bird = ambientCtx.createOscillator(); bird.type = 'sine';
          var cg = ambientCtx.createGain();
          bird.frequency.setValueAtTime(1800 + Math.random()*900, ambientCtx.currentTime);
          bird.frequency.exponentialRampToValueAtTime(1200, ambientCtx.currentTime + 0.14);
          cg.gain.setValueAtTime(0.0001, ambientCtx.currentTime);
          cg.gain.exponentialRampToValueAtTime(0.025, ambientCtx.currentTime + 0.02);
          cg.gain.exponentialRampToValueAtTime(0.0001, ambientCtx.currentTime + 0.18);
          bird.connect(cg); cg.connect(gain); bird.start(); bird.stop(ambientCtx.currentTime + 0.2);
        }, 3200));
      }
    } catch(e) {}
  }
  document.querySelectorAll('#ambientSoundBtns .focus-preset-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var wasActive = btn.classList.contains('active');
      stopAmbientSound();
      if (!wasActive) { btn.classList.add('active'); playAmbientSound(btn.dataset.sound); }
    });
  });
  var ambientStopBtn = $('ambientStopBtn');
  if (ambientStopBtn) ambientStopBtn.addEventListener('click', stopAmbientSound);

  /* ---------------- 16. SOS Calm Button ---------------- */
  var SOS_LINES = [
    "Take a breath. You're doing better than you think. 🐝",
    "One task at a time. The hive wasn't built in a day either.",
    "It's okay to pause. Resting is part of the work.",
    "You've gotten through every hard day so far. This one's no different.",
    "Unclench your jaw, drop your shoulders, breathe out slowly."
  ];
  SOS_LINES = SOS_LINES.concat([
    "Pause. One slow breath is already a restart.",
    "You are not behind your whole life. You are just at the next step.",
    "Make the task smaller until it stops scaring you.",
    "Your worth is not your productivity. Let's simply do the next kind thing.",
    "Drink water, unclench your hands, and choose one tiny action.",
    "Panic wants the whole future. Give it the next 60 seconds instead.",
    "You can return gently. No shame, no drama, just one step.",
    "The hive can wait while you breathe. Then we begin again."
  ]);
  var sosBtn = $('sosBtn'), sosVeil = $('sosVeil'), sosMessage = $('sosMessage'), sosCloseBtn = $('sosCloseBtn');
  if (sosBtn) sosBtn.addEventListener('click', function(){
    $('sosMessageText').textContent = SOS_LINES[Math.floor(Math.random() * SOS_LINES.length)];
    sosVeil.classList.add('show');
    sosMessage.classList.add('show');
    /* CALM REMINDER: open the pledge card so the user is reminded of the
       promise they made to themselves while they breathe. */
    if (typeof window.openPledge === 'function') {
      try {
        setTimeout(function(){ window.openPledge(); }, 350);
        var pc = document.getElementById('pledgeCard');
        if (pc) {
          pc.classList.add('pledge-nudge');
          setTimeout(function(){ pc.classList.remove('pledge-nudge'); }, 2200);
        }
      } catch(e){}
    }
  });
  function closeSos(){
    if (sosVeil) sosVeil.classList.remove('show');
    if (sosMessage) sosMessage.classList.remove('show');
  }
  if (sosCloseBtn) sosCloseBtn.addEventListener('click', closeSos);
  if (sosVeil) sosVeil.addEventListener('click', closeSos);

  /* ---------------- 17. Study Heatmap ---------------- */
  function heatmapLevelClass(mins){
    if (mins <= 0) return '';
    if (mins < 15) return ' lvl-1';
    if (mins < 30) return ' lvl-2';
    if (mins < 60) return ' lvl-3';
    return ' lvl-4';
  }
  function renderHeatmap(){
    var grid = $('heatmapGrid');
    if (!grid) return;
    var log = (studyData.dailyLog || {});
    var today = new Date(); today.setHours(0,0,0,0);
    var begin = new Date(startDate); begin.setHours(0,0,0,0);
    if (begin > today) begin = new Date(today);
    var lead = begin.getDay();
    var html = '';
    for (var i = 0; i < lead; i++) html += '<div class="heatmap-cell" style="visibility:hidden;"></div>';
    var d = new Date(begin);
    var daysStudied = 0, totalDays = 0;
    while (d <= today) {
      var key = dateKey(d);
      var mins = log[key] || 0;
      if (mins > 0) daysStudied++;
      totalDays++;
      var label = (d.getMonth() + 1) + '/' + d.getDate() + ': ' + mins + ' min';
      html += '<div class="heatmap-cell' + heatmapLevelClass(mins) + '" title="' + label + '"></div>';
      d.setDate(d.getDate() + 1);
    }
    grid.innerHTML = html;
    var statsEl = $('heatmapStats');
    if (statsEl) {
      statsEl.textContent = daysStudied + ' / ' + totalDays + ' days studied so far · current streak ' +
        studyData.currentStreak + ' (best ' + studyData.bestStreak + ')';
    }
  }
  wireSimpleToggle('heatmapBtn', 'heatmapPanel');
  var heatmapBtn = $('heatmapBtn');
  if (heatmapBtn) heatmapBtn.addEventListener('click', renderHeatmap);

  /* ---------------- 18. Rival Hive Race ---------------- */
  var RIVAL_RATE_KEY = 'hive-rival-rate-v1';
  var rivalRate = parseInt(storageGet(RIVAL_RATE_KEY) || '30', 10);
  function renderRivalRace(){
    var youFill = $('raceYouFill'), rivalFill = $('raceRivalFill'), status = $('raceStatus');
    if (!youFill) return;
    document.querySelectorAll('.rival-rate-btn').forEach(function(b){
      b.classList.toggle('active', parseInt(b.dataset.rate, 10) === rivalRate);
    });
    var now = new Date();
    var daysElapsed = Math.max(0, Math.min(90, (now - startDate) / 86400000));
    var rivalMinutes = daysElapsed * rivalRate;
    var yourMinutes = studyData.totalMinutes || 0;
    var maxMinutes = Math.max(yourMinutes, rivalMinutes, 1);
    youFill.style.width = Math.min(100, (yourMinutes / maxMinutes) * 100) + '%';
    rivalFill.style.width = Math.min(100, (rivalMinutes / maxMinutes) * 100) + '%';
    var diff = Math.round(yourMinutes - rivalMinutes);
    if (diff > 0) status.textContent = "🎉 You're ahead by " + diff + ' min!';
    else if (diff < 0) status.textContent = '⏳ Rival is ahead by ' + Math.abs(diff) + ' min — catch up!';
    else status.textContent = "🤝 Dead even!";
  }
  document.querySelectorAll('.rival-rate-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      rivalRate = parseInt(btn.dataset.rate, 10);
      storageSet(RIVAL_RATE_KEY, String(rivalRate));
      renderRivalRace();
    });
  });
  wireSimpleToggle('rivalBtn', 'rivalPanel');
  var rivalBtn = $('rivalBtn');
  if (rivalBtn) rivalBtn.addEventListener('click', renderRivalRace);

  /* ---------------- 19. Bee Garden ---------------- */
  var GARDEN_MINUTES_PER_FLOWER = 20;
  var GARDEN_MAX_FLOWERS = 30;
  var GARDEN_FLOWER_EMOJIS = ['🌼', '🌻', '🌷', '🌹', '🪻', '🌺'];
  function renderGarden(){
    var grid = $('gardenGrid');
    if (!grid) return;
    var totalMinutes = studyData.totalMinutes || 0;
    var grown = Math.min(GARDEN_MAX_FLOWERS, Math.floor(totalMinutes / GARDEN_MINUTES_PER_FLOWER));
    var html = '';
    for (var i = 0; i < GARDEN_MAX_FLOWERS; i++) {
      if (i < grown) html += '<div class="garden-cell bloom">' + GARDEN_FLOWER_EMOJIS[i % GARDEN_FLOWER_EMOJIS.length] + '</div>';
      else html += '<div class="garden-cell"></div>';
    }
    grid.innerHTML = html;
    var statsEl = $('gardenStats');
    if (statsEl) {
      if (grown >= GARDEN_MAX_FLOWERS) {
        statsEl.textContent = GARDEN_MAX_FLOWERS + ' / ' + GARDEN_MAX_FLOWERS + ' flowers grown · Garden complete! 🌼';
      } else {
        var nextIn = (grown + 1) * GARDEN_MINUTES_PER_FLOWER - totalMinutes;
        statsEl.textContent = grown + ' / ' + GARDEN_MAX_FLOWERS + ' flowers grown · ' + nextIn + ' more min to next bloom';
      }
    }
  }
  wireSimpleToggle('gardenBtn', 'gardenPanel');
  var gardenBtn = $('gardenBtn');
  if (gardenBtn) gardenBtn.addEventListener('click', renderGarden);

  /* ---------------- 20. Streak Freeze ---------------- */
  function renderFreezeUI(){
    var countEl = $('freezeCount'), explainerEl = $('freezeExplainer');
    if (countEl) countEl.textContent = freezeState.tokens;
    if (explainerEl) {
      explainerEl.textContent = 'You have ' + freezeState.tokens + ' streak freeze' +
        (freezeState.tokens === 1 ? '' : 's') + ' saved (max 3).';
    }
  }
  function checkFreezeAward(){
    var streak = studyData.currentStreak;
    if (streak > 0 && streak % 7 === 0 && freezeState.awardedMilestones.indexOf(streak) === -1) {
      freezeState.awardedMilestones.push(streak);
      if (freezeState.tokens < 3) {
        freezeState.tokens += 1;
        showMilestoneToast('❄️ Streak Freeze earned! (' + freezeState.tokens + ' saved)', 3500);
      }
      saveFreezeState();
      renderFreezeUI();
    }
  }
  wireSimpleToggle('freezeBtn', 'freezePanel');
  renderFreezeUI();
  if (window.streakFreezeUsed) {
    showMilestoneToast('❄️ A streak freeze protected your streak while you were away!', 4000);
    window.streakFreezeUsed = false;
    renderFreezeUI();
  }

  var _origRecordStudyCompletedForNewFeatures = recordStudyCompleted;
  recordStudyCompleted = function(subject, minutes){
    _origRecordStudyCompletedForNewFeatures(subject, minutes);
    renderHeatmap();
    renderRivalRace();
    renderGarden();
    checkFreezeAward();
  };

  renderHeatmap();
  renderRivalRace();
  renderGarden();

  /* ---------------- Mobile/PC detection & responsive dock reflow ---------------- */
  (function(){
    // Real device family, not just current window width — a touch tablet
    // rotated to a wide landscape width should still count as touch/tablet
    // for things like hover-only affordances, while a narrow *desktop*
    // window (e.g. a resized browser) should not be treated like a phone.
    var ua = navigator.userAgent || '';
    var hasCoarsePointer = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) &&
      (!window.matchMedia || window.matchMedia('(pointer: coarse)').matches);
    // iPadOS 13+ Safari reports itself as "Macintosh" but is touch-first —
    // catch it via touch support + multitouch, since UA sniffing alone misses it.
    var isIPadOS = /Macintosh/.test(ua) && hasCoarsePointer;
    var isTabletUA = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua) || isIPadOS;
    var isPhoneUA = /iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry/i.test(ua);

    function currentWidth(){ return window.innerWidth || document.documentElement.clientWidth; }

    function classify(){
      var w = currentWidth();
      var touch = hasCoarsePointer;
      var type;
      if (w <= 780 && (touch || isPhoneUA)) type = 'mobile';
      else if (w <= 780) type = 'mobile'; // narrow window, treat like mobile regardless of pointer
      else if (w <= 1180 && (touch || isTabletUA)) type = 'tablet';
      else type = 'desktop';
      return { type: type, touch: touch, width: w };
    }

    function isMobileViewport(){
      return classify().type === 'mobile';
    }
    window.HiveDevice = classify();
    var topBar = document.getElementById('mobileTopBar');
    var dockBar = document.getElementById('mobileDockBar');
    // Buttons that sit near the top of the desktop layout (left-anchored, would collide/overflow)
    var TOP_IDS = ['gradeBtn', 'breathingBtn', 'awardsBtn', 'vocabBtn', 'examBtn',
      'fsBtn', 'shareCountdownBtn', 'settingsBtn'];
    // Buttons that sit along the bottom desktop dock
    var DOCK_IDS = ['todoToggleBtn', 'notesBtn', 'cardsBtn', 'habitsBtn', 'drawBtn',
      'capsuleBtn', 'punsBtn', 'secretsBtn', 'challengeBtn', 'heatmapBtn', 'rivalBtn',
      'gardenBtn', 'freezeBtn', 'sosBtn', 'waterBtn', 'musicBtn', 'feedbackBtn', 'tipsBtn'];
    var moved = false;
    function reflowForMobile(){
      if (moved || !topBar || !dockBar) return;
      TOP_IDS.forEach(function(id){
        var el = document.getElementById(id);
        if (el) { el.classList.add('mb-item'); topBar.appendChild(el); }
      });
      DOCK_IDS.forEach(function(id){
        var el = document.getElementById(id);
        if (el) { el.classList.remove('dock-item'); el.classList.add('mb-item'); dockBar.appendChild(el); }
      });
      moved = true;
    }
    function applyMode(){
      var info = classify();
      window.HiveDevice = info;
      var mobile = info.type === 'mobile';
      document.body.classList.toggle('is-mobile', mobile);
      document.body.classList.toggle('is-tablet', info.type === 'tablet');
      document.body.classList.toggle('is-desktop', info.type === 'desktop');
      document.body.classList.toggle('is-touch', info.touch);
      document.documentElement.setAttribute('data-device', info.type);
      if (mobile) reflowForMobile();
    }
    applyMode();
    window.addEventListener('resize', applyMode);
    window.addEventListener('orientationchange', function(){ setTimeout(applyMode, 200); });
    if (window.matchMedia) {
      try { window.matchMedia('(max-width: 780px)').addEventListener('change', applyMode); } catch (e) {}
      try { window.matchMedia('(pointer: coarse)').addEventListener('change', applyMode); } catch (e) {}
    }
  })();
})();

/* ---------------- Fix: reflow the "More Tools" dock into a wrapping bar ----------------
   These buttons (Notes, Cards, Habits, Draw, Capsule, Puns, Secrets, Challenge,
   Heatmap, Rival Hive, Garden, Freeze, Water, Music, Tasks) each had a hardcoded
   inline "left: Npx" running from 300px up to 1730px. That only lines up on a
   screen wider than ~1800px, so on every normal laptop/monitor the later ones
   (Water and Music worst of all) rendered off the right edge of the screen or
   stacked on top of the timer card. Moving them into #toolsDockBar (a centered,
   wrapping flex row) makes them lay out correctly at any window size, while
   leaving the open/close "More Tools" toggle behavior untouched. */
(function () {
  var bar = document.getElementById('toolsDockBar');
  if (!bar) return;
  // The mobile-detection script above already claimed these same buttons for
  // #mobileDockBar when the page loads under 780px — don't steal them back.
  if (document.body.classList.contains('is-mobile')) return;
  var ids = ['todoToggleBtn', 'notesBtn', 'cardsBtn', 'habitsBtn', 'drawBtn',
    'capsuleBtn', 'punsBtn', 'secretsBtn', 'challengeBtn', 'heatmapBtn',
    'rivalBtn', 'gardenBtn', 'freezeBtn', 'waterBtn', 'musicBtn',
    'feedbackBtn', 'tipsBtn'];
  ids.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) bar.appendChild(el);
  });
})();

/* ---------------- Guided feature tour ---------------- */
(function () {
  var TOUR_SEEN_KEY = 'studyhive-tour-seen-v1';
  var ONBOARD_KEY = 'studyhive-onboarded-v1';

  var STEPS = [
    { icon: '🐝', title: '60-second Hive Tour', body: 'This is your calm study cockpit: countdown, focus, coach, garden, cards and wellness in one hive.' },
    { icon: '⏳', title: 'Goal + Pledge', body: 'The main card tracks your goal date, goal percentage and personal pledge so the app starts with your reason.', target: '.card' },
    { icon: '🎯', title: 'Focus that protects attention', body: 'Use Focus or Pomodoro to log minutes. Turn on No-touch Focus if you want the bees to guard your screen.', target: '#focusBtn' },
    { icon: '🐝', title: 'Hive Coach', body: 'Open the Hive menu, then Hive Coach: add weak topics, quiz yourself and get your next-best move.', target: '#hiveMenuBtn' },
    { icon: '🌷', title: 'Garden World', body: 'Your minutes grow a separate garden world. Enter it to water flowers, journal and plant tomorrow’s intention.', target: '#gardenBtn', dock: true },
    { icon: '🧠', title: 'Memory tools', body: 'Flashcards, CSV import, formula bank and question maker help you remember instead of rereading.', target: '#cardsBtn', dock: true },
    { icon: '🌿', title: 'Calm or Grind', body: 'Use background music, SOS, better night mode or Grind Mode from the Hive menu when you need less stimulation.', target: '#hiveMenuBtn' },
    { icon: '🎉', title: 'Start small', body: 'That is the hive. Pick one subject, one timer, one honest session. The bees will track the rest.' }
  ];

  var overlay = document.getElementById('tourOverlay');
  if (!overlay) return;
  var cardEl = document.getElementById('tourCard');
  var spotlight = document.getElementById('tourSpotlight');
  var iconEl = document.getElementById('tourIcon');
  var progressEl = document.getElementById('tourProgress');
  var titleEl = document.getElementById('tourTitle');
  var bodyEl = document.getElementById('tourBody');
  var backBtn = document.getElementById('tourBackBtn');
  var nextBtn = document.getElementById('tourNextBtn');
  var skipBtn = document.getElementById('tourSkipBtn');

  var idx = 0;
  var openedPanelId = null;
  var resizeHandler = null;

  function closePriorPanel() {
    if (openedPanelId) {
      var p = document.getElementById(openedPanelId);
      if (p) p.classList.remove('show');
      openedPanelId = null;
    }
  }

  function positionSpotlight(el) {
    var r = el ? el.getBoundingClientRect() : null;
    if (!r || (r.width === 0 && r.height === 0)) {
      // No target (or it isn't actually rendered) — dim the whole screen with a
      // zero-size cutout instead of hiding the spotlight, so intro/outro steps
      // still darken the background behind the card.
      spotlight.style.top = '50%';
      spotlight.style.left = '50%';
      spotlight.style.width = '0px';
      spotlight.style.height = '0px';
      spotlight.classList.remove('hidden');
      return;
    }
    var pad = 8;
    spotlight.style.top = (r.top - pad) + 'px';
    spotlight.style.left = (r.left - pad) + 'px';
    spotlight.style.width = (r.width + pad * 2) + 'px';
    spotlight.style.height = (r.height + pad * 2) + 'px';
    spotlight.classList.remove('hidden');
  }

  function renderStep() {
    var step = STEPS[idx];
    closePriorPanel();

    if (step.dock && !document.body.classList.contains('dock-open')) {
      var dockBtn = document.getElementById('dockToggleBtn');
      if (dockBtn) dockBtn.click();
    }
    // The More Tools dock sits at the bottom of the screen, which is exactly
    // where the tour card normally lives — so it ends up hiding the very
    // tool being explained. Move the card up to the top for dock steps, and
    // put it back at the bottom for everything else.
    if (cardEl) cardEl.classList.toggle('dock-mode', !!step.dock);
    if (step.openPanel) {
      var panel = document.getElementById(step.openPanel);
      if (panel) { panel.classList.add('show'); openedPanelId = step.openPanel; }
    }

    iconEl.textContent = step.icon;
    titleEl.textContent = step.title;
    bodyEl.textContent = step.body;
    progressEl.textContent = 'Step ' + (idx + 1) + ' of ' + STEPS.length;
    backBtn.disabled = idx === 0;
    nextBtn.textContent = idx === STEPS.length - 1 ? 'Finish' : 'Next';
    skipBtn.style.display = idx === STEPS.length - 1 ? 'none' : 'block';

    var target = null;
    if (step.target) {
      target = document.querySelector(step.target);
      if (target && typeof target.scrollIntoView === 'function') {
        try { target.scrollIntoView({ block: 'center', inline: 'center' }); } catch (e) {}
      }
    }
    // Dock items animate in (opacity + transform) over 0.25s when the dock opens —
    // wait that out before measuring, or the ring lands on their mid-animation spot.
    var settleDelay = step.dock ? 320 : 60;
    setTimeout(function () { positionSpotlight(target); }, settleDelay);
  }

  function next() { if (idx < STEPS.length - 1) { idx++; renderStep(); } else finish(); }
  function back() { if (idx > 0) { idx--; renderStep(); } }

  function finish() {
    closePriorPanel();
    try { localStorage.setItem(TOUR_SEEN_KEY, '1'); } catch (e) {}
    overlay.classList.remove('show');
    if (resizeHandler) { window.removeEventListener('resize', resizeHandler); resizeHandler = null; }
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) { if (e.key === 'Escape') finish(); }

  function start() {
    idx = 0;
    overlay.classList.add('show');
    renderStep();
    resizeHandler = function () { renderStep(); };
    window.addEventListener('resize', resizeHandler);
    document.addEventListener('keydown', onKeydown);
  }

  nextBtn.addEventListener('click', next);
  backBtn.addEventListener('click', back);
  skipBtn.addEventListener('click', finish);

  var replayBtn = document.getElementById('replayTourBtn');
  if (replayBtn) {
    replayBtn.addEventListener('click', function () {
      var settingsPanel = document.getElementById('settingsPanel');
      if (settingsPanel) settingsPanel.classList.remove('show');
      start();
    });
  }

  function maybeAutoStart() {
    try {
      if (!localStorage.getItem(ONBOARD_KEY)) return;
      if (localStorage.getItem(TOUR_SEEN_KEY)) return;
    } catch (e) { return; }
    setTimeout(function(){ if (window.HiveTour && window.HiveTour.start) window.HiveTour.start(); else start(); }, 1500);
  }

  window.HiveTour = { start: start, maybeAutoStart: maybeAutoStart };
})();

/* ---------------- Onboarding welcome modal (first visit only) ---------------- */
(function () {
  var ONBOARD_KEY = 'studyhive-onboarded-v1';

  function maybeAutoStartTour() {
    if (window.HiveTour && typeof window.HiveTour.maybeAutoStart === 'function') {
      window.HiveTour.maybeAutoStart();
    }
  }

  var veil = document.getElementById('onboardVeil');
  if (!veil) { maybeAutoStartTour(); return; }
  try {
    if (localStorage.getItem(ONBOARD_KEY)) { maybeAutoStartTour(); return; } // already onboarded
  } catch (e) { return; }

  veil.classList.add('show');
  var nameInput = document.getElementById('onboardName');
  var goalInput = document.getElementById('onboardGoal');
  var dateInput = document.getElementById('onboardDate');
  var subjectsInput = document.getElementById('onboardSubjects');
  var dailyGoalInput = document.getElementById('onboardDailyGoal');
  var vibeInput = document.getElementById('onboardVibe');
  var mobileModeInput = document.getElementById('onboardMobileMode');
  var worryInput = document.getElementById('onboardWorry');
  var pledgeInput = document.getElementById('onboardPledge');
  var startBtn = document.getElementById('onboardStartBtn');
  var skipBtn = document.getElementById('onboardSkipBtn');

  // Default the date picker to 90 days out so it's never empty.
  var d = new Date(); d.setDate(d.getDate() + 90);
  dateInput.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  function finish() {
    try { localStorage.setItem(ONBOARD_KEY, '1'); } catch (e) {}
    veil.classList.remove('show');
  }

  startBtn.addEventListener('click', function () {
    try {
      var name = (nameInput.value || '').trim();
      var goal = (goalInput.value || '').trim() || 'Goal Day';
      if (name) localStorage.setItem('studyhive-name-v1', name);
      localStorage.setItem('goal-title-v1', '🎓 ' + goal);
      localStorage.setItem('goal-label-v1', name ? ('Countdown to ' + goal + ', ' + name) : ('Countdown to ' + goal));
      if (dateInput.value) {
        var parsed = new Date(dateInput.value + 'T23:59:00');
        if (!isNaN(parsed.getTime())) {
          localStorage.setItem('goal-target-date-v1', parsed.toISOString());
          localStorage.setItem('goal-start-date-v1', new Date().toISOString());
        }
      }
      var subjectsRaw = (subjectsInput && subjectsInput.value || '').trim();
      if (subjectsRaw) {
        var names = subjectsRaw.split(/[\n,]+/).map(function(s){ return s.trim(); }).filter(Boolean);
        var data = {};
        try { data = JSON.parse(localStorage.getItem('study-data-v2') || '{}'); } catch(e) { data = {}; }
        data.subjects = data.subjects || {};
        names.forEach(function(s){ if (!(s in data.subjects)) data.subjects[s] = 0; });
        localStorage.setItem('study-data-v2', JSON.stringify(data));
      }
      if (dailyGoalInput && dailyGoalInput.value) localStorage.setItem('hive-daily-goal-v1', String(Math.max(10, Math.min(480, parseInt(dailyGoalInput.value, 10) || 60))));
      if (vibeInput) localStorage.setItem('studyhive-coach-vibe-v1', vibeInput.value || 'balanced');
      if (mobileModeInput) localStorage.setItem('studyhive-force-mobile-v1', mobileModeInput.checked ? '1' : '0');
      if (worryInput && worryInput.value.trim()) localStorage.setItem('studyhive-main-worry-v1', worryInput.value.trim());
      if (pledgeInput && pledgeInput.value.trim()) localStorage.setItem('studyhive-pledge-v1', pledgeInput.value.trim());
    } catch (e) {}
    finish();
    // The guided tour auto-starts on the reloaded page (ONBOARD_KEY is now set,
    // and the tour hasn't been seen yet) — see maybeAutoStartTour() above.
    location.reload();
  });

  skipBtn.addEventListener('click', function () {
    finish();
    maybeAutoStartTour();
  });
})();
