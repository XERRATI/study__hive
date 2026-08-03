/* =====================================================================
   Study Hive — 59-lockin-mode.js
   NEW FEATURES:
   1. Extend buttons (+5 / +10 min) in the Focus panel and during Lock-in.
   2. LOCK-IN MODE (timer only): a full-screen, distraction-free timer for
      people who want to lock in. Enter from the Focus panel.
   3. When a Lock-in timer finishes, the BEES DANCE for the person.
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function qa(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function toast(msg) { if (typeof window.showMilestoneToast === 'function') { try { window.showMilestoneToast(msg, 4200); } catch (e) {} } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  var overlay = null;
  var wasActive = false;
  var doneShown = false;
  var exitArmedAt = 0;

  /* ---------------- 1. Extend buttons in the Focus panel ---------------- */
  function ensureExtendButtons() {
    var panel = $('focusPanel');
    if (!panel || $('focusExtendRow')) return;
    var row = document.createElement('div');
    row.id = 'focusExtendRow';
    row.className = 'lockin-extend-row';
    row.innerHTML =
      '<button type="button" id="focusExtend5">+5 min</button>' +
      '<button type="button" id="focusExtend10">+10 min</button>' +
      '<span class="lockin-extend-hint">Extend your timer any time</span>';
    var stop = $('focusStopBtn');
    if (stop && stop.parentNode) stop.parentNode.insertBefore(row, stop.nextSibling);
    else panel.appendChild(row);
    $('focusExtend5').addEventListener('click', function () {
      if (window.extendSession && window.extendSession(5)) toast('⏳ Timer extended by 5 min');
      else toast('Start a session first, then extend it');
    });
    $('focusExtend10').addEventListener('click', function () {
      if (window.extendSession && window.extendSession(10)) toast('⏳ Timer extended by 10 min');
      else toast('Start a session first, then extend it');
    });
  }

  /* ---------------- 2. Lock-in button in the Focus panel ---------------- */
  function ensureLockinButton() {
    var panel = $('focusPanel');
    if (!panel || $('lockinBtn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'lockinBtn';
    btn.className = 'lockin-btn';
    btn.textContent = '🔒 Lock in — Timer only';
    btn.title = 'Full-screen focus timer. When it finishes, the bees dance for you.';
    panel.appendChild(btn);
    btn.addEventListener('click', openLockin);
  }

  /* ---------------- 3. Lock-in overlay ---------------- */
  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'lockinOverlay';
    overlay.className = 'lockin-overlay';
    overlay.innerHTML =
      '<div class="lockin-card">' +
      '  <div class="lockin-top"><span class="lockin-lock">🔒 LOCKED IN</span><button type="button" class="lockin-exit" id="lockinExit">Exit</button></div>' +
      '  <div class="lockin-time" id="lockinTime">25:00</div>' +
      '  <div class="lockin-label" id="lockinLabel">Focus session</div>' +
      '  <div class="lockin-progress"><div class="lockin-fill" id="lockinFill"></div></div>' +
      '  <div class="lockin-extend-row">' +
      '    <button type="button" id="lockinPlus5">⏳ +5 min</button>' +
      '    <button type="button" id="lockinPlus10">⏳ +10 min</button>' +
      '  </div>' +
      '  <div class="lockin-done" id="lockinDone" style="display:none;">' +
      '    <div class="lockin-done-emoji">🎉🐝🎉</div>' +
      '    <div class="lockin-done-text" id="lockinDoneText">Great work!</div>' +
      '    <button type="button" id="lockinFinish">Done — back to the hive</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(overlay);
    $('lockinPlus5').addEventListener('click', function () { extend(5); });
    $('lockinPlus10').addEventListener('click', function () { extend(10); });
    $('lockinExit').addEventListener('click', exitLockin);
    /* Finish = session already completed; close straight away. */
    $('lockinFinish').addEventListener('click', function () { closeLockin(); });
  }

  function extend(mins) {
    if (!window.extendSession || !window.extendSession(mins)) {
      toast('Start a session first');
      return;
    }
    toast('⏳ Timer extended by ' + mins + ' min');
    syncTime();
  }

  function openLockin() {
    ensureOverlay();
    /* minutes: active preset, else 25 */
    var mins = 25;
    var active = document.querySelector('.focus-preset-btn[data-mins].active');
    if (active) mins = parseInt(active.dataset.mins, 10) || 25;
    /* start (or restart) the session through the real preset buttons */
    var preset = document.querySelector('.focus-preset-btn[data-mins="' + mins + '"]');
    if (preset) preset.click();
    else {
      var any = document.querySelector('.focus-preset-btn[data-mins]');
      if (any) any.click();
    }
    wasActive = window.isSessionActive ? window.isSessionActive() : true;
    doneShown = false;
    overlay.classList.add('show');
    document.body.classList.add('lockin-mode');
    $('lockinDone').style.display = 'none';
    syncTime();
  }

  function syncTime() {
    if (!overlay || !overlay.classList.contains('show')) return;
    var remain = window.sessionRemaining || 0;
    var total = window.sessionTotal || 1;
    $('lockinTime').textContent = pad(Math.floor(remain / 60)) + ':' + pad(remain % 60);
    $('lockinFill').style.width = Math.max(0, Math.min(100, ((total - remain) / total) * 100)) + '%';
  }

  /* ---------------- 4. Completion -> bee dance ---------------- */
  function beeDanceParty() {
    document.body.classList.add('bee-dance-party');
    /* emoji celebration bursts */
    var emojis = ['🎉', '🐝', '✨', '🍯', '🎊'];
    for (var i = 0; i < 16; i++) {
      (function (i) {
        setTimeout(function () {
          var p = document.createElement('div');
          p.className = 'lockin-confetti';
          p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          p.style.left = (8 + Math.random() * 84) + 'vw';
          p.style.top = (10 + Math.random() * 70) + 'vh';
          p.style.fontSize = (18 + Math.random() * 22) + 'px';
          p.style.setProperty('--cf-x', (Math.random() * 120 - 60) + 'px');
          p.style.setProperty('--cf-y', (Math.random() * 140 + 30) + 'px');
          document.body.appendChild(p);
          setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1600);
        }, i * 120);
      })(i);
    }
    toast('🐝✨ The bees are dancing for you!');
    setTimeout(function () { document.body.classList.remove('bee-dance-party'); }, 9000);
  }

  function onDone() {
    if (doneShown) return;
    doneShown = true;
    $('lockinDone').style.display = 'block';
    $('lockinTime').textContent = '🎉 00:00';
    var mins = Math.round((window.sessionTotal || 0) / 60);
    $('lockinDoneText').textContent = 'You locked in and finished ' + mins + ' minutes!';
    beeDanceParty();
  }

  /* ---------------- 5. Exit (double-tap confirm) ---------------- */
  function exitLockin() {
    if (Date.now() - exitArmedAt < 1800) {
      /* confirmed: stop the session (credits elapsed minutes) */
      var stop = $('focusStopBtn');
      if (stop) stop.click();
      closeLockin();
      return;
    }
    exitArmedAt = Date.now();
    toast('Tap Exit again to leave lock-in (time so far is saved)');
  }

  function closeLockin() {
    if (!overlay) return;
    overlay.classList.remove('show');
    document.body.classList.remove('lockin-mode', 'bee-dance-party');
    wasActive = false;
    doneShown = false;
  }

  /* ---------------- 6. Loop: sync time + detect completion ---------------- */
  setInterval(function () {
    ensureExtendButtons();
    ensureLockinButton();
    if (!overlay || !overlay.classList.contains('show')) return;
    syncTime();
    var active = window.isSessionActive ? window.isSessionActive() : false;
    if (wasActive && !active) onDone();
    wasActive = active;
  }, 500);
})();
