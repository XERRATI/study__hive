/* =====================================================================
   Study Hive — 26-setup-field-guard.js
   Extracted from the original single-file build (script block #24).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function isSetupField(el){
    return !!(el && el.matches && el.matches('.onboard-card input, .onboard-card textarea, .onboard-card select, .pledge-blank-input, #pledgeLockInput'));
  }
  function forceReadable(el){
    if (!isSetupField(el)) return;
    el.style.setProperty('color', '#1f160e', 'important');
    el.style.setProperty('-webkit-text-fill-color', '#1f160e', 'important');
    el.style.setProperty('background-color', '#fffaf2', 'important');
    el.style.setProperty('caret-color', '#c97a12', 'important');
    el.style.setProperty('font-size', '16px', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('text-shadow', 'none', 'important');
  }
  function forceAllReadable(){
    document.querySelectorAll('.onboard-card input, .onboard-card textarea, .onboard-card select, .pledge-blank-input, #pledgeLockInput').forEach(forceReadable);
  }
  function mirror(){
    var m = document.getElementById('mobileTypingMirror');
    if (!m) {
      document.body.insertAdjacentHTML('beforeend', '<div class="mobile-typing-mirror" id="mobileTypingMirror"><small>Typing preview</small><span id="mobileTypingMirrorText"></span></div>');
      m = document.getElementById('mobileTypingMirror');
    }
    return m;
  }
  function updateMirror(el){
    if (!isSetupField(el)) return;
    forceReadable(el);
    var m = mirror();
    var txt = '';
    if (el.tagName === 'SELECT') txt = el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : el.value;
    else txt = el.value || el.getAttribute('placeholder') || 'Start typing...';
    document.getElementById('mobileTypingMirrorText').textContent = txt;
    if (window.innerWidth <= 780) m.classList.add('show');
    setTimeout(function(){
      try { el.scrollIntoView({block:'center', inline:'nearest', behavior:'smooth'}); } catch(e) {}
    }, 80);
  }
  function hideMirrorSoon(){
    setTimeout(function(){
      if (!isSetupField(document.activeElement)) {
        var m = document.getElementById('mobileTypingMirror');
        if (m) m.classList.remove('show');
      }
    }, 250);
  }
  document.addEventListener('focusin', function(e){ if (isSetupField(e.target)) updateMirror(e.target); }, true);
  document.addEventListener('input', function(e){ if (isSetupField(e.target)) updateMirror(e.target); }, true);
  document.addEventListener('keyup', function(e){ if (isSetupField(e.target)) updateMirror(e.target); }, true);
  document.addEventListener('change', function(e){ if (isSetupField(e.target)) updateMirror(e.target); }, true);
  document.addEventListener('compositionupdate', function(e){ if (isSetupField(e.target)) updateMirror(e.target); }, true);
  document.addEventListener('compositionend', function(e){ if (isSetupField(e.target)) updateMirror(e.target); }, true);
  document.addEventListener('focusout', function(e){ if (isSetupField(e.target)) hideMirrorSoon(); }, true);
  setInterval(forceAllReadable, 3500);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', forceAllReadable); else forceAllReadable();
})();
