/* =====================================================================
   Study Hive — 57-sergeant-v2.js
   TEST FEATURE: a second Sergeant — the "Squad Leader" — switchable in
   Settings. Different look (peaked cap, aviator glasses, whistle) and a
   few extra lines. Classic Sergeant stays the default; this is opt-in.
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

  /* The v2 Squad Leader bee: peaked cap, aviator glasses, whistle, shoulder
     boards. Same outer classes so anger states/rank badge still work. */
  var V2_SVG = [
    '<div class="sergeant-rank-badge" id="sergeantRankBadge">PVT</div>',
    '<div class="sergeant-steam s1"></div>',
    '<div class="sergeant-steam s2"></div>',
    '<div class="sergeant-fist left"></div>',
    '<div class="sergeant-fist right"></div>',
    '<svg class="sergeant-bob" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">',
    '  <defs><linearGradient id="sgtV2Body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdf6b"/><stop offset="1" stop-color="#e29b1c"/></linearGradient></defs>',
    '  <ellipse cx="14" cy="18" rx="9" ry="6" fill="rgba(255,255,255,0.75)" stroke="#d3b995" stroke-width="1"></ellipse>',
    '  <ellipse cx="32" cy="18" rx="9" ry="6" fill="rgba(255,255,255,0.75)" stroke="#d3b995" stroke-width="1"></ellipse>',
    '  <ellipse cx="23" cy="26" rx="12" ry="9" fill="url(#sgtV2Body)" stroke="#6b5636" stroke-width="1"></ellipse>',
    '  <rect x="15" y="19" width="3" height="15" fill="#2b2b2b" opacity=".85"></rect>',
    '  <rect x="22" y="19" width="3" height="15" fill="#2b2b2b" opacity=".85"></rect>',
    '  <rect x="29" y="19" width="3" height="15" fill="#2b2b2b" opacity=".85"></rect>',
    '  <circle cx="33" cy="26" r="6" fill="#2b241d" stroke="#1c1710" stroke-width="1"></circle>',
    '  <circle cx="33" cy="26" r="2.4" fill="#fff"></circle>',
    '  <circle cx="33" cy="26" r="1.1" fill="#111"></circle>',
    '  <path d="M13 13 L33 11 L34 16 L12 16 Z" fill="#5c6b3a" stroke="#39421f" stroke-width="1"></path>',
    '  <path d="M13 13 L33 11 L34 12 L14 14 Z" fill="#39421f"></path>',
    '  <rect x="30" y="9" width="8" height="4" rx="2" fill="#39421f" stroke="#2a3216" stroke-width=".8"></rect>',
    '  <circle cx="34" cy="10.6" r="1.1" fill="#f4c430"></circle>',
    '  <rect x="8" y="27" width="6" height="9" rx="3" fill="#5c6b3a" stroke="#39421f" stroke-width=".8"></rect>',
    '  <rect x="9.4" y="29.5" width="3.2" height="2" rx="1" fill="#f4c430"></rect>',
    '  <circle cx="13" cy="22" r="1.6" fill="#c1392b"></circle>',
    '</svg>'
  ].join('\n');

  var V1_SVG = null;

  function applySergeant() {
    var wrap = $('sergeantPersistent');
    if (!wrap) return;
    var rankText = '';
    var badge = $('sergeantRankBadge');
    if (badge) rankText = badge.textContent;
    if (isV2()) {
      if (!V1_SVG) V1_SVG = wrap.innerHTML;
      /* keep the rank badge id intact: v2 svg already includes it */
      wrap.innerHTML = V2_SVG;
      document.body.classList.add('sergeant-v2');
    } else {
      if (V1_SVG) wrap.innerHTML = V1_SVG;
      document.body.classList.remove('sergeant-v2');
    }
    /* re-set the rank badge text that the swap may have reset */
    var badge2 = $('sergeantRankBadge');
    if (badge2 && rankText) badge2.textContent = rankText;
  }

  /* ---------- Settings toggle ---------- */
  function addSetting() {
    var panel = $('settingsPanel');
    if (!panel || $('sergeantV2Toggle')) return;
    var div = document.createElement('div');
    div.innerHTML = '<div class="settings-divider"></div>' +
      '<div class="settings-section-title">🫡 Sergeant style (test)</div>' +
      '<div class="settings-row"><span class="settings-row-label">Squad Leader Sergeant</span><span class="settings-toggle" id="sergeantV2Toggle"></span></div>' +
      '<div class="settings-small-note">Test the new-look Sergeant: peaked cap, aviator glasses and a whistle. Classic stays the default.</div>';
    panel.appendChild(div);
    var t = $('sergeantV2Toggle');
    function sync() { t.classList.toggle('on', isV2()); }
    t.onclick = function () {
      set(KEY, isV2() ? '0' : '1');
      sync(); applySergeant();
      toast(isV2() ? '🫡 Squad Leader Sergeant on — test away!' : '🫡 Classic Sergeant restored');
    };
    sync();
  }

  /* ---------- A few v2-only lines (used 1 in 3 while v2 is active) ---------- */
  var V2_LINES = [
    'Squad Leader on deck. This unit studies in formation: timer set, book open, phone away.',
    'Listen up — I fly first, I land last, and I expect one honest block from every bee in this squad.',
    'You do not need a pep talk. You need a plan with a start time. Squad Leader out.',
    'Cap is on. Glasses are clear. Now let us make today look disciplined.',
    'Whistle ready. The only thing I blow it for is focus. Begin.',
    'A squad is only as strong as its least consistent member. That means you today. Go.'
  ];
  (function wrapLines() {
    var orig = null, tries = 0;
    (function tryWrap() {
      if (typeof showSergeantNag !== 'function') { if (++tries < 30) setTimeout(tryWrap, 300); return; }
      if (window.__sgtV2Wrapped) return;
      window.__sgtV2Wrapped = true;
      orig = showSergeantNag;
      showSergeantNag = function (text, angry) {
        if (isV2() && !angry && Math.random() < 0.3) {
          text = V2_LINES[Math.floor(Math.random() * V2_LINES.length)];
        }
        return orig(text, angry);
      };
    })();
  })();

  addSetting();
  setInterval(addSetting, 3000);
  setTimeout(applySergeant, 600);
  setInterval(applySergeant, 4000);
})();
