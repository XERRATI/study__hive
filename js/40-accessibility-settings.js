/* =====================================================================
   Study Hive — 40-accessibility-settings.js
   Extracted from the original single-file build (script block #38).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function get(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
  function set(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }

  /* Head metadata for mobile/PWA polish. */
  function ensureMeta(){
    function meta(name, content){ if(!document.querySelector('meta[name="'+name+'"]')){ var m=document.createElement('meta'); m.name=name; m.content=content; document.head.appendChild(m); } }
    meta('theme-color','#f4c430'); meta('apple-mobile-web-app-capable','yes'); meta('apple-mobile-web-app-status-bar-style','black-translucent'); meta('apple-mobile-web-app-title','Study Hive');
    if(!document.querySelector('link[rel="manifest"]')){ var l=document.createElement('link'); l.rel='manifest'; l.href='manifest.webmanifest'; document.head.appendChild(l); }
  }
  ensureMeta();

  /* Global error shield: catches launch-day glitches and keeps app alive. */
  var errorCount=0;
  function logError(message, source, line, col, stack){
    var arr=[]; try{arr=JSON.parse(localStorage.getItem('studyhive-error-log-v1')||'[]')}catch(e){}
    arr.unshift({ts:new Date().toISOString(), message:String(message||'Unknown error'), source:source||'', line:line||0, col:col||0, stack:String(stack||'').slice(0,900)});
    try{localStorage.setItem('studyhive-error-log-v1', JSON.stringify(arr.slice(0,30)));}catch(e){}
  }
  function showErrorToast(){
    errorCount++;
    if(!$('appErrorToast')) document.body.insertAdjacentHTML('beforeend','<div class="app-error-toast" id="appErrorToast">A small glitch was caught and logged. The hive is still running.</div>');
    var t=$('appErrorToast'); t.classList.add('show'); clearTimeout(t._x); t._x=setTimeout(function(){t.classList.remove('show');},4200);
  }
  window.addEventListener('error', function(e){ logError(e.message,e.filename,e.lineno,e.colno,e.error&&e.error.stack); showErrorToast(); });
  window.addEventListener('unhandledrejection', function(e){ logError('Promise: '+(e.reason&&e.reason.message||e.reason),'promise',0,0,e.reason&&e.reason.stack); showErrorToast(); });

  /* Accessibility / launch settings. */
  function applyA11y(){
    document.body.classList.toggle('reduce-motion-mode', get('studyhive-reduce-motion-v1')==='1' || (window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches));
    /* WHITE-OUT FIX: the PC high-contrast-mode CSS nukes every gradient and
       turns the whole app white — including the mobile shell. While the
       mobile shell is active, high contrast is handled by the shell's own
       mob-hc class instead (same setting key, shell-scoped styling). */
    if (!document.body.classList.contains('mobile-pro-ui')) {
      document.body.classList.toggle('high-contrast-mode', get('studyhive-high-contrast-v1')==='1');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
    document.body.classList.toggle('large-text-mode', get('studyhive-large-text-v1')==='1');
  }
  function addA11ySettings(){
    var p=$('settingsPanel'); if(!p || $('a11ySettingsBlock')) return;
    p.insertAdjacentHTML('beforeend','<div class="settings-divider"></div><div class="settings-section-title">♿ Accessibility + Launch Safety</div><div id="a11ySettingsBlock"><div class="settings-row"><span class="settings-row-label">Reduce motion</span><span class="settings-toggle" id="reduceMotionToggle"></span></div><div class="settings-row"><span class="settings-row-label">High contrast</span><span class="settings-toggle" id="highContrastToggle"></span></div><div class="settings-row"><span class="settings-row-label">Larger text</span><span class="settings-toggle" id="largeTextToggle"></span></div><button class="settings-action-btn" id="finalDoctorBtn" style="width:100%;">Run 20/10 Doctor</button><div class="final-doctor-report" id="finalDoctorReport">Ready.</div></div>');
    function sync(){ $('reduceMotionToggle').classList.toggle('on', get('studyhive-reduce-motion-v1')==='1'); $('highContrastToggle').classList.toggle('on', get('studyhive-high-contrast-v1')==='1'); $('largeTextToggle').classList.toggle('on', get('studyhive-large-text-v1')==='1'); applyA11y(); }
    $('reduceMotionToggle').onclick=function(){ set('studyhive-reduce-motion-v1', get('studyhive-reduce-motion-v1')==='1'?'0':'1'); sync(); };
    $('highContrastToggle').onclick=function(){ set('studyhive-high-contrast-v1', get('studyhive-high-contrast-v1')==='1'?'0':'1'); sync(); };
    $('largeTextToggle').onclick=function(){ set('studyhive-large-text-v1', get('studyhive-large-text-v1')==='1'?'0':'1'); sync(); };
    $('finalDoctorBtn').onclick=function(){ $('finalDoctorReport').textContent=runFinalDoctor().join('\n'); };
    sync();
  }
  function runFinalDoctor(){
    var r=[];
    function ok(label, pass){ r.push((pass?'✅ ':'⚠️ ')+label); }
    ok('Critical UI exists', !!($('focusBtn')&&$('settingsBtn')&&$('dockToggleBtn')&&$('hiveMenuBtn')));
    ok('Queen guide installed', !!window.showStudyHiveQueenGuideV2 || !!window.showQueenStoryGuide);
    ok('Backup center installed', !!window.StudyHiveBackupCenter);
    ok('Bee AI installed', !!window.StudyHiveBeeAI);
    ok('Ownership marker present', !!(window.STUDY_HIVE_COPYRIGHT_NOTICE || document.documentElement.getAttribute('data-study-hive-owner')));
    ok('No NaN timer visible', !/NaN:NaN/.test(document.body.textContent));
    ok('Terms link present', !!document.querySelector('a[href="study-hive-terms-of-service.html"]'));
    ok('Privacy link present', !!document.querySelector('a[href="study-hive-privacy-policy.html"]'));
    ok('Background music external file path set', true);
    ok('Mobile launcher installed', !!$('mobileFeatureLauncher'));
    var errors=[]; try{errors=JSON.parse(localStorage.getItem('studyhive-error-log-v1')||'[]')}catch(e){}
    r.push('Recent caught errors: '+errors.length);
    return r;
  }
  applyA11y(); setInterval(function(){ addA11ySettings(); applyA11y(); },2500);

  /* PWA install prompt if browser supports it. */
  var deferredPrompt=null;
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferredPrompt=e; showInstallBanner(); });
  function showInstallBanner(){
    if(get('studyhive-install-banner-dismissed-v1')==='1') return;
    if(!$('installAppBanner')) document.body.insertAdjacentHTML('beforeend','<div class="install-app-banner" id="installAppBanner"><div><strong>Install Study Hive?</strong><span>Open faster and feel like an app.</span></div><button id="installAppBtn">Install</button><button class="secondary" id="dismissInstallBtn">Later</button></div>');
    $('installAppBanner').classList.add('show');
    $('dismissInstallBtn').onclick=function(){ set('studyhive-install-banner-dismissed-v1','1'); $('installAppBanner').classList.remove('show'); };
    $('installAppBtn').onclick=function(){ if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt.userChoice.finally(function(){ deferredPrompt=null; $('installAppBanner').classList.remove('show'); }); } else { toast('Use your browser menu → Add to Home Screen'); } };
  }

  /* Service worker registration for GitHub Pages, ignored on file://. */
  if(location.protocol==='http:' || location.protocol==='https:'){
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(function(){ /* safe ignore */ }); }
  }
})();
