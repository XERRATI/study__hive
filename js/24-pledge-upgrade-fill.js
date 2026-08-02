/* =====================================================================
   Study Hive — 24-pledge-upgrade-fill.js
   Extracted from the original single-file build (script block #22).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s || '').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var FIELDS = ['Name','Feeling','Action','Minutes','Reason','Subject','Distraction','Reset','Reminder'];
  function longBox(prefix){
    return '<div class="pledge-fill-box long-pledge" id="'+prefix+'LongBox" data-long-pledge="1">' +
      'I, <input class="pledge-blank-input" id="'+prefix+'Name" placeholder="my name">, promise that when studying feels ' +
      '<input class="pledge-blank-input" id="'+prefix+'Feeling" placeholder="hard / boring">, I will still ' +
      '<input class="pledge-blank-input" id="'+prefix+'Action" placeholder="study honestly"> for at least ' +
      '<input class="pledge-blank-input" id="'+prefix+'Minutes" placeholder="25"> minutes. I am doing this because ' +
      '<input class="pledge-blank-input" id="'+prefix+'Reason" placeholder="my future matters">, and the subject I most want to improve is ' +
      '<input class="pledge-blank-input" id="'+prefix+'Subject" placeholder="Maths">. If I get distracted by ' +
      '<input class="pledge-blank-input" id="'+prefix+'Distraction" placeholder="my phone">, I will ' +
      '<input class="pledge-blank-input" id="'+prefix+'Reset" placeholder="take one breath">, return to my timer, and remind myself: “' +
      '<input class="pledge-blank-input" id="'+prefix+'Reminder" placeholder="one step at a time">.”' +
      '<div class="pledge-fill-preview" id="'+prefix+'Preview">Fill every blank to create your full pledge.</div>' +
      '<div class="pledge-fill-error" id="'+prefix+'Error">Complete every blank first.</div>' +
      '</div>';
  }
  function sentence(prefix){
    var v = {};
    FIELDS.forEach(function(f){ var el=$(prefix+f); v[f]=el?(el.value||'').trim():''; });
    var missing = FIELDS.filter(function(f){ return !v[f]; });
    if (missing.length) return '';
    return 'I, ' + v.Name + ', promise that when studying feels ' + v.Feeling + ', I will still ' + v.Action + ' for at least ' + v.Minutes + ' minutes. I am doing this because ' + v.Reason + ', and the subject I most want to improve is ' + v.Subject + '. If I get distracted by ' + v.Distraction + ', I will ' + v.Reset + ', return to my timer, and remind myself: “' + v.Reminder + '.”';
  }
  function sync(prefix, targetId){
    var s = sentence(prefix);
    var target = $(targetId); if (target) target.value = s;
    var prev = $(prefix+'Preview'); if (prev) prev.innerHTML = s ? ('Preview: <strong>'+esc(s)+'</strong>') : 'Fill every blank to create your full pledge.';
    var err = $(prefix+'Error'); if (err && s) err.classList.remove('show');
    return s;
  }
  function upgrade(prefix, targetId){
    var target = $(targetId); if (!target) return;
    var old = document.querySelector('[data-pledge-fill="'+prefix+'"], #'+prefix+'LongBox');
    if (old && old.dataset.longPledge === '1') return;
    if (old) old.remove();
    target.style.display = 'none';
    target.insertAdjacentHTML('afterend', longBox(prefix));
    FIELDS.forEach(function(f){ var el=$(prefix+f); if(el) el.addEventListener('input', function(){ sync(prefix,targetId); }); });
    var mins=$(prefix+'Minutes'); if(mins && !mins.value) mins.value='25';
    sync(prefix,targetId);
  }
  function missingFocus(prefix){
    return FIELDS.map(function(f){return $(prefix+f);}).filter(function(el){return el && !el.value.trim();})[0] || $(prefix+'Name');
  }
  document.addEventListener('click', function(e){
    if (e.target && (e.target.id === 'onboardStartBtn' || e.target.id === 'onboardSkipBtn')) {
      upgrade('pledgeFill','onboardPledge');
      if (!sync('pledgeFill','onboardPledge')) {
        e.preventDefault(); e.stopImmediatePropagation();
        var err=$('pledgeFillError'); if(err) err.classList.add('show');
        var first=missingFocus('pledgeFill'); if(first) first.focus();
      }
    }
    if (e.target && e.target.id === 'pledgeLockSave') {
      upgrade('lockPledgeFill','pledgeLockInput');
      if (!sync('lockPledgeFill','pledgeLockInput')) {
        e.preventDefault(); e.stopImmediatePropagation();
        var err2=$('lockPledgeFillError'); if(err2) err2.classList.add('show');
        var first2=missingFocus('lockPledgeFill'); if(first2) first2.focus();
      }
    }
  }, true);
  setInterval(function(){ upgrade('pledgeFill','onboardPledge'); upgrade('lockPledgeFill','pledgeLockInput'); },4000);
})();
