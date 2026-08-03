/* =====================================================================
   Study Hive — 60-sergeant-context.js
   SERGEANT PICTURE STATES (creator's own images, no cycling):
     · IDLE     -> sergeant-1.png (calm, default)
     · TALKING  -> sergeant-2.png (only while he's speaking)
     · ANGRY    -> sergeant-3.png (when his rage is high)
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  var TALK_MS = 5600;      /* matches the nag bubble duration */
  var lastTalk = 0;
  var state = 'idle';

  function setState(s) {
    if (state === s) return;
    state = s;
    var w = $('sergeantPersistent');
    if (!w) return;
    w.classList.remove('sgt-idle', 'sgt-talking', 'sgt-angry');
    w.classList.add('sgt-' + s);
  }

  /* Whenever the Sergeant speaks, show the talking picture. */
  function hookNag() {
    var cur = window.showSergeantNag;
    if (!cur || window.__sgtContextHooked) return;
    window.__sgtContextHooked = true;
    window.showSergeantNag = function (text, angry) {
      lastTalk = Date.now();
      setState(angry ? 'angry' : 'talking');
      return cur.apply(this, arguments);
    };
  }

  function angerLevel() {
    var w = $('sergeantPersistent');
    if (!w) return 0;
    var m = /anger-(\d)/.exec(w.className);
    return m ? parseInt(m[1], 10) : 0;
  }

  function tick() {
    hookNag();
    var w = $('sergeantPersistent');
    if (!w) return;
    /* calm-still mode (Settings toggle) always shows the calm pose */
    if (document.body.classList.contains('sergeant-v2')) { setState('idle'); return; }
    var ang = angerLevel();
    if (ang >= 2) setState('angry');                      /* rage high -> angry face */
    else if (Date.now() - lastTalk < TALK_MS) setState('talking');  /* speaking */
    else setState('idle');                                /* otherwise calm */
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setState('idle'); }, { once: true });
  } else {
    setState('idle');
  }
  setInterval(tick, 350);
})();
