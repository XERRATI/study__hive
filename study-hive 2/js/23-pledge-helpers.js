/* =====================================================================
   Study Hive — 23-pledge-helpers.js
   Extracted from the original single-file build (script block #21).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s || '').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function makeSentence(prefix){
    var action = ($(prefix+'Action') && $(prefix+'Action').value || '').trim();
    var mins = ($(prefix+'Minutes') && $(prefix+'Minutes').value || '').trim();
    var reason = ($(prefix+'Reason') && $(prefix+'Reason').value || '').trim();
    var reset = ($(prefix+'Reset') && $(prefix+'Reset').value || '').trim();
    if (!action || !mins || !reason || !reset) return '';
    return 'I promise to ' + action + ' for ' + mins + ' minutes because ' + reason + '. If I get distracted, I will ' + reset + ' and start again.';
  }
  function syncPledge(prefix, targetId){
    var sentence = makeSentence(prefix);
    var target = $(targetId);
    if (target) target.value = sentence;
    var preview = $(prefix+'Preview');
    if (preview) preview.innerHTML = sentence ? ('Preview: <strong>' + esc(sentence) + '</strong>') : 'Fill the blanks to create your pledge.';
    var err = $(prefix+'Error');
    if (err && sentence) err.classList.remove('show');
    return sentence;
  }
  function buildFillBox(prefix, targetId){
    return '<div class="pledge-fill-box" data-pledge-fill="'+prefix+'">' +
      'I promise to <input class="pledge-blank-input" id="'+prefix+'Action" placeholder="study maths"> ' +
      'for <input class="pledge-blank-input" id="'+prefix+'Minutes" placeholder="25"> minutes because ' +
      '<input class="pledge-blank-input" id="'+prefix+'Reason" placeholder="my future matters">. ' +
      'If I get distracted, I will <input class="pledge-blank-input" id="'+prefix+'Reset" placeholder="take one breath"> and start again.' +
      '<div class="pledge-fill-preview" id="'+prefix+'Preview">Fill the blanks to create your pledge.</div>' +
      '<div class="pledge-fill-error" id="'+prefix+'Error">Complete every blank first.</div>' +
      '</div>';
  }
  function installOnboardFillPledge(){
    var pledge = $('onboardPledge');
    if (!pledge || $('pledgeFillAction')) return;
    pledge.style.display = 'none';
    pledge.insertAdjacentHTML('afterend', buildFillBox('pledgeFill', 'onboardPledge'));
    ['Action','Minutes','Reason','Reset'].forEach(function(k){
      var el = $('pledgeFill'+k);
      if (el) el.addEventListener('input', function(){ syncPledge('pledgeFill', 'onboardPledge'); });
    });
    // sensible defaults without completing it for them
    var mins = $('pledgeFillMinutes'); if (mins && !mins.value) mins.value = '25';
    syncPledge('pledgeFill','onboardPledge');
  }
  function installLockFillPledge(){
    var lock = $('pledgeLockInput');
    if (!lock || $('lockPledgeFillAction')) return;
    lock.style.display = 'none';
    lock.insertAdjacentHTML('afterend', buildFillBox('lockPledgeFill', 'pledgeLockInput'));
    ['Action','Minutes','Reason','Reset'].forEach(function(k){
      var el = $('lockPledgeFill'+k);
      if (el) el.addEventListener('input', function(){ syncPledge('lockPledgeFill', 'pledgeLockInput'); });
    });
    var mins = $('lockPledgeFillMinutes'); if (mins && !mins.value) mins.value = '25';
    syncPledge('lockPledgeFill','pledgeLockInput');
  }
  document.addEventListener('click', function(e){
    if (e.target && (e.target.id === 'onboardStartBtn' || e.target.id === 'onboardSkipBtn')) {
      installOnboardFillPledge();
      var sentence = syncPledge('pledgeFill', 'onboardPledge');
      if (!sentence) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var err = $('pledgeFillError'); if (err) err.classList.add('show');
        var first = ['Action','Reason','Reset'].map(function(k){return $('pledgeFill'+k);}).filter(function(x){return x && !x.value.trim();})[0] || $('pledgeFillAction');
        if (first) first.focus();
      }
    }
    if (e.target && e.target.id === 'pledgeLockSave') {
      installLockFillPledge();
      var sentence2 = syncPledge('lockPledgeFill', 'pledgeLockInput');
      if (!sentence2) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var err2 = $('lockPledgeFillError'); if (err2) err2.classList.add('show');
        var first2 = ['Action','Reason','Reset'].map(function(k){return $('lockPledgeFill'+k);}).filter(function(x){return x && !x.value.trim();})[0] || $('lockPledgeFillAction');
        if (first2) first2.focus();
      }
    }
  }, true);
  setInterval(function(){ installOnboardFillPledge(); installLockFillPledge(); },4000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', installOnboardFillPledge); else installOnboardFillPledge();
})();
