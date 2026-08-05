/* =====================================================================
   Study Hive — 54-welcome-screen.js
   NEW FEATURE: the front page. A full welcome screen shows FIRST on
   every visit; the app loads behind it. "Enter the Hive" drops you in.
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  var screen = document.getElementById('welcomeScreen');
  var enterBtn = document.getElementById('welcomeEnterBtn');
  if (!screen) return;

  /* Mobile: the shell owns the welcome (welcome-back card) — never show
     the PC front page on phones, or the two can flash together. The
     mobile body classes are set by earlier scripts (js/11, js/28). */
  if (document.body.classList.contains('is-mobile') || document.body.classList.contains('force-mobile')) {
    screen.classList.add('hidden');
    screen.style.display = 'none';
    return;
  }

  /* Show the front page immediately on every visit. */
  screen.classList.remove('hidden');
  document.body.classList.add('welcome-locked');

  function enter() {
    screen.classList.add('hidden');
    document.body.classList.remove('welcome-locked');
    /* Small celebratory nudge so the app feels alive right away. */
    if (typeof window.showMilestoneToast === 'function') {
      setTimeout(function () {
        try { window.showMilestoneToast('🐝 Welcome back to the hive!'); } catch (e) {}
      }, 250);
    }
  }

  if (enterBtn) enterBtn.addEventListener('click', enter);

  /* Allow Escape to skip in (handy for admin/testing). */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !screen.classList.contains('hidden')) {
      enter();
    }
  });

  /* Prevent the page behind from scrolling while the front page is up. */
  screen.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
})();
