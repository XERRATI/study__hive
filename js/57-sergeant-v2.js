/* =====================================================================
   Study Hive — 57-sergeant-v2.js
   SERGEANT STYLE TOGGLE — now uses ONLY the creator's own artwork
   (images/sergeant-1/2/3.png). The toggle switches between:
     · Animated — the 3 poses crossfade (neutral → talking → yelling)
     · Still — calm single pose (frame 1) for people who want him quiet
   The old custom "Colonel" SVG was removed; nothing custom is drawn.
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */

(function () {
  'use strict';
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function $(id) { return document.getElementById(id); }
  function toast(msg) { if (typeof window.showMilestoneToast === 'function') { try { window.showMilestoneToast(msg, 3600); } catch (e) {} } }

  var KEY = 'studyhive-sergeant-v2-v1';
  function isV2() { return get(KEY) === '1'; }

  function applySergeant() {
    var wrap = $('sergeantPersistent');
    if (!wrap) return;
    var imgs = wrap.querySelectorAll('.sg-img');
    if (isV2()) {
      /* Still mode: show only the calm frame, remove the animation. */
      imgs.forEach(function (im, i) {
        im.style.animation = 'none';
        im.style.opacity = i === 0 ? '1' : '0';
      });
      document.body.classList.add('sergeant-v2');
    } else {
      /* Animated mode: restore the crossfade (the CSS animation runs). */
      imgs.forEach(function (im) {
        im.style.animation = '';
        im.style.opacity = '';
      });
      document.body.classList.remove('sergeant-v2');
    }
  }

  /* ---------- Settings toggle ---------- */
  function addSetting() {
    var panel = $('settingsPanel');
    if (!panel || $('sergeantV2Toggle')) return;
    var div = document.createElement('div');
    div.innerHTML = '<div class="settings-divider"></div>' +
      '<div class="settings-section-title">🫡 Sergeant style</div>' +
      '<div class="settings-row"><span class="settings-row-label">Calm still pose</span><span class="settings-toggle" id="sergeantV2Toggle"></span></div>' +
      '<div class="settings-small-note">ON = the Sergeant stays in his calm pose (no talking animation). OFF = the usual 3-pose animation.</div>';
    panel.appendChild(div);
    var t = $('sergeantV2Toggle');
    function sync() { t.classList.toggle('on', isV2()); }
    t.onclick = function () {
      set(KEY, isV2() ? '0' : '1');
      sync(); applySergeant();
      toast(isV2() ? '🫡 Sergeant: calm still pose' : '🫡 Sergeant: animated');
    };
    sync();
  }

  addSetting();
  setInterval(addSetting, 3000);
  setTimeout(applySergeant, 600);
  setInterval(applySergeant, 4000);
})();
