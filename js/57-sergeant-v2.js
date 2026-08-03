/* =====================================================================
   Study Hive — 57-sergeant-v2.js
   TEST FEATURE: a second Sergeant — the "Squad Leader" — switchable in
   Settings. Different look (navy beret, monocle, mustache, medal) and a
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
    /* SERGEANT V2 REDESIGN — "The Colonel": a distinguished veteran bee
       with a tilted navy beret + gold badge, a monocle, a proud mustache
       and a campaign medal. Completely different from the classic drill
       sergeant (and from the old peaked-cap test version). */
    '<div class="sergeant-rank-badge" id="sergeantRankBadge">PVT</div>',
    '<div class="sergeant-steam s1"></div>',
    '<div class="sergeant-steam s2"></div>',
    '<div class="sergeant-fist left"></div>',
    '<div class="sergeant-fist right"></div>',
    '<svg class="sergeant-bob" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">',
    '  <defs><linearGradient id="colBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#d99a14"/></linearGradient></defs>',
    '  <ellipse cx="14" cy="17" rx="9" ry="6" fill="rgba(255,255,255,.78)" stroke="#d3b995" stroke-width="1"></ellipse>',
    '  <ellipse cx="32" cy="17" rx="9" ry="6" fill="rgba(255,255,255,.78)" stroke="#d3b995" stroke-width="1"></ellipse>',
    '  <ellipse cx="23" cy="26" rx="12" ry="9" fill="url(#colBody)" stroke="#6b5636" stroke-width="1"></ellipse>',
    '  <rect x="16" y="19" width="3.4" height="15" fill="#3a2f22" opacity=".9" rx="1.6"></rect>',
    '  <rect x="23.3" y="18.5" width="3.4" height="16" fill="#3a2f22" opacity=".9" rx="1.6"></rect>',
    '  <rect x="30.6" y="19" width="3.4" height="15" fill="#3a2f22" opacity=".9" rx="1.6"></rect>',
    '  <circle cx="19" cy="31" r="2.1" fill="#f4c430" stroke="#8a6a20" stroke-width=".8"></circle>',
    '  <path d="M19 28.8 L20.2 30.2 L17.8 30.2 Z" fill="#8a6a20"></path>',
    '  <circle cx="33.5" cy="24.5" r="6.6" fill="#2b241d"></circle>',
    '  <circle cx="35.6" cy="23.5" r="2.7" fill="none" stroke="#cbbf93" stroke-width="1.1"></circle>',
    '  <path d="M38.3 23.5 Q41.5 23.5 42 26" stroke="#cbbf93" stroke-width=".9" fill="none"></path>',
    '  <circle cx="31" cy="23.5" r="1.9" fill="#fff"></circle>',
    '  <circle cx="31" cy="23.5" r=".9" fill="#111"></circle>',
    '  <path d="M29.2 28 Q33.5 31.4 37.8 28 Q36.6 30.8 33.5 30.8 Q30.4 30.8 29.2 28 Z" fill="#b9a37c"></path>',
    '  <path d="M25.6 19.8 Q26.8 13.8 33.5 13.4 Q40.2 13.8 41.4 19.8 Z" fill="#3b4a63" stroke="#2c3850" stroke-width="1"></path>',
    '  <path d="M25.6 19.8 Q33.5 17.6 41.4 19.8 L41.4 20.6 Q33.5 18.6 25.6 20.6 Z" fill="#2c3850"></path>',
    '  <circle cx="33.5" cy="16.8" r="1.8" fill="#f4c430"></circle>',
    '  <circle cx="33.5" cy="16.8" r=".8" fill="#8a6a20"></circle>',
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
      '<div class="settings-small-note">Test the new-look Sergeant: navy beret, monocle and campaign medal. Classic stays the default.</div>';
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
