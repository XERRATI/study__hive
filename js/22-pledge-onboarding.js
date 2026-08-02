/* =====================================================================
   Study Hive — 22-pledge-onboarding.js
   Extracted from the original single-file build (script block #20).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function pledgeValue(){
    var el = $('onboardPledge');
    return el ? (el.value || '').trim() : '';
  }
  function showPledgeError(){
    var el = $('onboardPledge');
    if (!el) return;
    el.classList.add('pledge-required-error');
    var msg = $('pledgeRequiredMsg');
    if (!msg) {
      el.insertAdjacentHTML('afterend', '<div class="pledge-required-msg" id="pledgeRequiredMsg">Write your pledge first — this is required so the hive starts with your reason.</div>');
      msg = $('pledgeRequiredMsg');
    }
    msg.classList.add('show');
    try { el.scrollIntoView({block:'center'}); } catch(e) {}
    el.focus();
  }
  function clearPledgeError(){
    var el = $('onboardPledge');
    if (el) el.classList.remove('pledge-required-error');
    var msg = $('pledgeRequiredMsg');
    if (msg) msg.classList.remove('show');
  }
  function installRequiredPledge(){
    var el = $('onboardPledge');
    if (!el || el.dataset.requiredInstalled === '1') return;
    el.dataset.requiredInstalled = '1';
    el.setAttribute('required', 'required');
    el.placeholder = 'I promise to show up honestly, one focused session at a time.';
    el.addEventListener('input', function(){ if (pledgeValue()) clearPledgeError(); });
    var start = $('onboardStartBtn');
    if (start) start.textContent = 'Save my pledge + start hive 🍯';
    var skip = $('onboardSkipBtn');
    if (skip) skip.textContent = 'Skip everything except pledge';
  }
  document.addEventListener('click', function(e){
    if (e.target && (e.target.id === 'onboardStartBtn' || e.target.id === 'onboardSkipBtn')) {
      installRequiredPledge();
      if (!pledgeValue()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showPledgeError();
      }
    }
  }, true);
  setInterval(installRequiredPledge,3500);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installRequiredPledge); else installRequiredPledge();

  // If someone already completed setup before pledges were mandatory, ask once and save it.
  function pledgeExists(){ try { return !!(localStorage.getItem('studyhive-pledge-v1') || '').trim(); } catch(e){ return true; } }
  function onboarded(){ try { return localStorage.getItem('studyhive-onboarded-v1') === '1'; } catch(e){ return false; } }
  function showPledgeLock(){
    if (!onboarded() || pledgeExists() || $('pledgeLockVeil')) return;
    document.body.insertAdjacentHTML('beforeend', '<div class="pledge-lock-veil show" id="pledgeLockVeil"><div class="pledge-lock-card"><div style="font-size:42px;">✍️🐝</div><h2>Your hive needs a pledge</h2><p>Before continuing, write one honest sentence to future-you. It will stay under your countdown.</p><textarea id="pledgeLockInput" class="onboard-input" rows="3" placeholder="I promise to..." style="resize:vertical;"></textarea><button class="onboard-start-btn" id="pledgeLockSave">Save pledge</button></div></div>');
    $('pledgeLockSave').addEventListener('click', function(){
      var val = ($('pledgeLockInput').value || '').trim();
      if (!val) { $('pledgeLockInput').classList.add('pledge-required-error'); $('pledgeLockInput').focus(); return; }
      try { localStorage.setItem('studyhive-pledge-v1', val); } catch(e) {}
      $('pledgeLockVeil').remove();
      // Refresh visible pledge (shared renderer from js/12 when available).
      if (typeof window.renderPledge === 'function') { try { window.renderPledge(); } catch(e){} }
      else { document.querySelectorAll('.pledge-pill,.pledge-card').forEach(function(n){ n.remove(); }); }
    });
  }
  setTimeout(showPledgeLock, 1800);
})();
