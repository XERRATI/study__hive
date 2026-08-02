/* =====================================================================
   Study Hive — 55-onboarding-wizard.js
   NEW FEATURES:
   1. Setup card is now one question per step, with a bee slider that
      shows how far through setup you are (the bee rides a honey track).
   2. A bee slider on the main screen that rides the Hive Progress bar
      to show how much progress you have until the hive is complete.
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';

  /* ================= 1. Main-screen bee slider (always active) ================= */
  function syncProgressBee() {
    var fill = document.getElementById('hiveFill');
    var bee = document.getElementById('hiveProgressBee');
    if (!fill || !bee) return;
    var w = parseFloat(fill.style.width) || 0;
    bee.style.left = Math.min(100, Math.max(0, w)) + '%';
  }
  syncProgressBee();
  setInterval(syncProgressBee, 1500);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) syncProgressBee();
  });
  window.addEventListener('resize', syncProgressBee);

  /* ================= 2. Setup wizard (only while onboarding) ================= */
  var veil = document.getElementById('onboardVeil');
  if (!veil || !veil.classList.contains('show')) return;

  var steps = Array.prototype.slice.call(document.querySelectorAll('.onboard-step'));
  var total = steps.length;
  if (!total) return;

  var prevBtn = document.getElementById('onboardPrevBtn');
  var nextBtn = document.getElementById('onboardNextBtn');
  var startBtn = document.getElementById('onboardStartBtn');
  var sliderFill = document.getElementById('onboardSliderFill');
  var sliderBee = document.getElementById('onboardSliderBee');
  var sliderLabel = document.getElementById('onboardSliderLabel');
  var current = 1;

  var STEP_LABELS = [
    'Say hello',
    'Pick your goal',
    'Set the date',
    'List your subjects',
    'Daily study goal',
    'Coaching style',
    'Layout choice',
    'What you need help with',
    'Your pledge'
  ];

  function updateSlider() {
    var pct = total > 1 ? ((current - 1) / (total - 1)) * 100 : 100;
    if (sliderFill) sliderFill.style.width = pct + '%';
    if (sliderBee) sliderBee.style.left = pct + '%';
    var label = 'Step ' + current + ' of ' + total;
    if (STEP_LABELS[current - 1]) label += ' · ' + STEP_LABELS[current - 1];
    if (sliderLabel) sliderLabel.textContent = label;
  }

  /* The pledge system (js/23) hides the pledge textarea and replaces it with
     a fill-in-the-blanks sentence builder. Make sure that builder is present
     by the time the user reaches the pledge step — same IDs, same guard, so
     it never double-installs. */
  function ensurePledgeBuilder() {
    var pledge = document.getElementById('onboardPledge');
    if (!pledge || document.getElementById('pledgeFillAction')) return;
    pledge.style.display = 'none';
    pledge.insertAdjacentHTML('afterend',
      '<div class="pledge-fill-box" data-pledge-fill="pledgeFill">' +
      'I promise to <input class="pledge-blank-input" id="pledgeFillAction" placeholder="study maths"> ' +
      'for <input class="pledge-blank-input" id="pledgeFillMinutes" placeholder="25"> minutes because ' +
      '<input class="pledge-blank-input" id="pledgeFillReason" placeholder="my future matters">. ' +
      'If I get distracted, I will <input class="pledge-blank-input" id="pledgeFillReset" placeholder="take one breath"> and start again.' +
      '<div class="pledge-fill-preview" id="pledgeFillPreview">Fill the blanks to create your pledge.</div>' +
      '<div class="pledge-fill-error" id="pledgeFillError">Complete every blank first.</div>' +
      '</div>');
    function sync() {
      var action = document.getElementById('pledgeFillAction').value.trim();
      var mins = document.getElementById('pledgeFillMinutes').value.trim();
      var reason = document.getElementById('pledgeFillReason').value.trim();
      var reset = document.getElementById('pledgeFillReset').value.trim();
      var sentence = (action && mins && reason && reset)
        ? 'I promise to ' + action + ' for ' + mins + ' minutes because ' + reason + '. If I get distracted, I will ' + reset + ' and start again.'
        : '';
      document.getElementById('onboardPledge').value = sentence;
      var prev = document.getElementById('pledgeFillPreview');
      if (prev) prev.innerHTML = sentence ? ('Preview: <strong>' + sentence.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }) + '</strong>') : 'Fill the blanks to create your pledge.';
      var err = document.getElementById('pledgeFillError');
      if (err && sentence) err.classList.remove('show');
    }
    ['Action', 'Minutes', 'Reason', 'Reset'].forEach(function (k) {
      var el = document.getElementById('pledgeFill' + k);
      if (el) el.addEventListener('input', sync);
    });
    var mins = document.getElementById('pledgeFillMinutes');
    if (mins && !mins.value) mins.value = '25';
    sync();
  }

  function showStep(n) {
    current = Math.min(total, Math.max(1, n));
    steps.forEach(function (s, i) {
      s.classList.toggle('active', i === current - 1);
    });
    if (prevBtn) prevBtn.disabled = current === 1;
    if (current === total) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (startBtn) startBtn.style.display = '';
      ensurePledgeBuilder();
    } else {
      if (nextBtn) nextBtn.style.display = '';
      if (startBtn) startBtn.style.display = 'none';
    }
    updateSlider();
    var active = steps[current - 1];
    if (active) {
      var input = active.querySelector('input, textarea, select');
      if (input && input.focus) { try { input.focus(); } catch (e) {} }
    }
  }

  function goNext() {
    /* Gentle defaults so nothing blocks the flow. */
    var goalInput = document.getElementById('onboardDailyGoal');
    if (current === 5 && goalInput && !String(goalInput.value || '').trim()) {
      goalInput.value = '60';
    }
    if (current >= total) {
      if (startBtn) { startBtn.click(); return; }
    }
    showStep(current + 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { showStep(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  /* Enter key inside a step's input moves to the next step (except textareas). */
  veil.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (!t || !t.closest || !t.closest('.onboard-step')) return;
    if (t.tagName === 'TEXTAREA') return;
    e.preventDefault();
    goNext();
  });

  showStep(1);
})();
