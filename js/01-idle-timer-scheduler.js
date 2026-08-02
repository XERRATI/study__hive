/* =====================================================================
   Study Hive — 01-idle-timer-scheduler.js
   Extracted from the original single-file build (script block #1).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


/* ==========================================================================
   PERFORMANCE REFINEMENT -- idle-aware timer scheduler.

   Study Hive is built from many stacked patch layers, and each one added its
   own setInterval to re-assert its UI ("is my button still there?"). That adds
   up to ~2800 callback runs per minute, all of which keep firing while the tab
   is in the background -- wasted battery on phones and needless jank.

   This shim wraps setInterval BEFORE those layers register, and applies one
   rule: while the page is hidden, purely cosmetic maintenance pollers are
   suspended; the moment the page becomes visible again they run once
   immediately (catch-up) and resume their normal cadence.

   Deliberately conservative:
     - Timers faster than 400ms or slower than 15s are left completely alone
       (they are animation/audio ticks or genuine long schedules).
     - Timers that carry real time semantics -- the countdown clock, pomodoro,
       quote rotation, audio scheduling, milestones, auto-backup -- are
       explicitly excluded by name.
     - The wrapper returns a real timer id, so any existing clearInterval()
       keeps working exactly as before.
   No feature is removed; nothing runs less often while you are actually
   looking at the page.
   ========================================================================== */
(function () {
  if (window.__studyHiveIdleScheduler) return;
  window.__studyHiveIdleScheduler = true;

  var nativeSet = window.setInterval;
  var nativeClear = window.clearInterval;

  /* Never defer anything whose source mentions these: they mean real time. */
  var SEMANTIC = /updateClock|pomodoroTick|nextQuote|playPadNote|padChord|birdChirp|checkMilestones|updateTabTitle|updateTimeElapsedBar|updateSergeantAnger|updateNightMode|beeWhisper|godBeeBurst|queenRoll|Backup|backup|audio\.|currentTime|clearInterval|sessionRemaining|countdown|Countdown/;

  var managed = [];   /* {fn, delay, id, running} */
  var hidden = function () { return document.visibilityState === 'hidden'; };

  window.setInterval = function (fn, delay) {
    var extra = Array.prototype.slice.call(arguments, 2);
    /* Only manage plain function callbacks in the cosmetic-maintenance band. */
    var manageable = typeof fn === 'function' &&
                     typeof delay === 'number' &&
                     delay >= 400 && delay <= 15000 &&
                     !SEMANTIC.test(Function.prototype.toString.call(fn));

    if (!manageable) return nativeSet.apply(window, arguments);

    var rec = { fn: fn, delay: delay, extra: extra, id: null };
    function startTimer() {
      if (rec.id !== null) return;
      rec.id = nativeSet.call(window, function () {
        /* Cheap guard: skip the body entirely while hidden. */
        if (hidden()) return;
        try { rec.fn.apply(null, rec.extra); } catch (e) {}
      }, rec.delay);
    }
    startTimer();
    managed.push(rec);

    /* Hand back a normal id so clearInterval() still works unchanged. */
    var publicId = rec.id;
    rec.publicId = publicId;
    return publicId;
  };

  window.clearInterval = function (id) {
    for (var i = 0; i < managed.length; i++) {
      if (managed[i].publicId === id || managed[i].id === id) {
        nativeClear.call(window, managed[i].id);
        managed.splice(i, 1);
        break;
      }
    }
    return nativeClear.call(window, id);
  };

  /* On return to the tab, run each managed poller once so nothing looks stale. */
  document.addEventListener('visibilitychange', function () {
    if (hidden()) return;
    for (var i = 0; i < managed.length; i++) {
      try { managed[i].fn.apply(null, managed[i].extra); } catch (e) {}
    }
  });

  /* Diagnostics for the built-in health screens. */
  window.StudyHiveTimerStats = function () {
    var perMin = 0;
    for (var i = 0; i < managed.length; i++) perMin += 60000 / managed[i].delay;
    return { managedPollers: managed.length, deferredCallsPerMinuteWhenHidden: Math.round(perMin) };
  };
})();
