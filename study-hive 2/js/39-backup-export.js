/* =====================================================================
   Study Hive — 39-backup-export.js
   Extracted from the original single-file build (script block #37).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3200); }
  document.body.classList.add('launch-safe-mode');

  /* Panel manager: reduce clutter by keeping only one normal panel open at a time. */
  var normalPanelSelector = '.misc-panel.show,.focus-panel.show,.grade-panel.show,.todo-panel.show,.breathing-panel.show';
  var protectedPanels = {sergeantBriefPanel:1, feedbackPreview:1};
  var internalOpen = false;
  function closeSiblingPanels(active){
    if(internalOpen || !active || !active.classList || !active.classList.contains('show')) return;
    if(protectedPanels[active.id]) return;
    internalOpen = true;
    qa(normalPanelSelector).forEach(function(p){ if(p!==active && !protectedPanels[p.id]) p.classList.remove('show'); });
    internalOpen = false;
    syncPanelOpenClass();
  }
  function syncPanelOpenClass(){ document.body.classList.toggle('panel-open', qa(normalPanelSelector).length>0); }
  var obs = new MutationObserver(function(muts){ muts.forEach(function(m){ if(m.type==='attributes' && m.attributeName==='class') closeSiblingPanels(m.target); }); syncPanelOpenClass(); });
  function watchPanels(){ qa('.misc-panel,.focus-panel,.grade-panel,.todo-panel,.breathing-panel').forEach(function(p){ if(!p.dataset.launchWatched){ p.dataset.launchWatched='1'; obs.observe(p,{attributes:true,attributeFilter:['class']}); } }); }
  watchPanels(); setInterval(watchPanels,4000);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ qa(normalPanelSelector).forEach(function(p){p.classList.remove('show');}); syncPanelOpenClass(); } });

  /* Click outside closes ordinary panels on mobile/desktop, but not major modals. */
  document.addEventListener('click', function(e){
    if(e.target.closest && e.target.closest('.misc-panel,.focus-panel,.grade-panel,.todo-panel,.breathing-panel,.misc-btn,.focus-btn,.grade-btn,.breathing-btn,.mobile-feature-launcher,.mobile-feature-sheet')) return;
    if(e.target.closest && e.target.closest('.queen-v2-overlay,.backup-center-panel,.bee-ai-panel,.hive-coach-panel,.upgrade-panel')) return;
    if(qa(normalPanelSelector).length){ qa(normalPanelSelector).forEach(function(p){p.classList.remove('show');}); syncPanelOpenClass(); }
  }, true);

  /* Overlap guard for top/bottom fixed UI vs card. */
  function guardOverlaps(){
    var card=document.querySelector('.card'), top=$('mobileTopBar'), bottom=$('mobileDockBar');
    if(!card) return;
    var cr=card.getBoundingClientRect();
    if(top && getComputedStyle(top).display!=='none'){
      var tr=top.getBoundingClientRect();
      var overlap = tr.bottom > cr.top + 4;
      document.body.classList.toggle('mobile-overlap-fix', overlap);
      if(overlap) document.documentElement.style.setProperty('--safe-top-offset', Math.ceil(tr.height+26)+'px');
    }
    if(bottom && getComputedStyle(bottom).display!=='none'){
      var br=bottom.getBoundingClientRect();
      var overlapB = br.top < cr.bottom - 4;
      document.body.classList.toggle('mobile-bottom-overlap-fix', overlapB);
      if(overlapB) document.documentElement.style.setProperty('--safe-bottom-offset', Math.ceil(br.height+26)+'px');
    }
  }
  setInterval(guardOverlaps,3000); window.addEventListener('resize', guardOverlaps); window.addEventListener('orientationchange', function(){setTimeout(guardOverlaps,250);});

  /* Floating button stacker for desktop. */
  function stackFloatingButtons(){
    if(window.innerWidth<=780) return;
    var ids=['upgradeHubBtn','hiveMenuBtn','hiveCoachBtn','grindModeBtn'];
    var base=95, gap=54;
    ids.forEach(function(id,i){ var el=$(id); if(el && getComputedStyle(el).display!=='none'){ el.style.right='14px'; el.style.left='auto'; el.style.bottom=(base+i*gap)+'px'; } });
  }
  setInterval(stackFloatingButtons,3500); stackFloatingButtons();

  /* Launch checklist */
  function ensureLaunchPanel(){
    if($('launchCheckPanel')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="launch-check-panel" id="launchCheckPanel"><h2>🚀 Launch Check</h2><p style="color:var(--brown);font-size:13px;line-height:1.45;">Checks the important things before sharing the app.</p><div class="launch-check-list" id="launchCheckList"></div><div class="launch-check-actions"><button id="runLaunchCheckBtn">Run check</button><button class="secondary" id="repairLaunchLayoutBtn">Repair layout</button><button class="secondary" id="closeLaunchCheckBtn">Close</button></div></div>');
    $('closeLaunchCheckBtn').onclick=function(){ $('launchCheckPanel').classList.remove('show'); };
    $('runLaunchCheckBtn').onclick=renderLaunchCheck;
    $('repairLaunchLayoutBtn').onclick=function(){ document.body.classList.remove('mobile-overlap-fix','mobile-bottom-overlap-fix','panel-open'); stackFloatingButtons(); guardOverlaps(); toast('Layout repaired'); };
  }
  function checkItem(name, ok, detail){ return '<div class="launch-check-item '+(ok?'pass':'warn')+'"><b>'+(ok?'✅ ':'⚠️ ')+name+'</b><br>'+detail+'</div>'; }
  function renderLaunchCheck(){
    ensureLaunchPanel();
    var items=[];
    items.push(checkItem('Critical buttons', !!($('focusBtn')&&$('settingsBtn')&&$('dockToggleBtn')&&$('hiveMenuBtn')), 'Focus, Settings, More Tools and Hive Controls should exist.'));
    items.push(checkItem('Legal links', !!document.querySelector('a[href="study-hive-privacy-policy.html"]') && !!document.querySelector('a[href="study-hive-terms-of-service.html"]'), 'Privacy and Terms links should resolve locally.'));
    items.push(checkItem('Music file', true, 'background-music.mp3 must be uploaded beside the app on GitHub.'));
    items.push(checkItem('Backup Center', !!window.StudyHiveBackupCenter, 'Backup/export/restore should be available.'));
    items.push(checkItem('Bee AI', !!window.StudyHiveBeeAI, 'Bee AI should have free-provider + offline fallback.'));
    items.push(checkItem('Ownership marker', !!window.STUDY_HIVE_COPYRIGHT_NOTICE || document.documentElement.getAttribute('data-study-hive-owner'), 'Ownership notice should be present in code and DOM.'));
    items.push(checkItem('Mobile launcher', !!$('mobileFeatureLauncher'), 'Mobile feature grid should be installed.'));
    $('launchCheckList').innerHTML=items.join('');
  }
  function addLaunchButtons(){
    var settings=$('settingsPanel');
    if(settings && !$('openLaunchCheckBtn')) settings.insertAdjacentHTML('beforeend','<div class="settings-divider"></div><div class="settings-section-title">🚀 Launch</div><button class="settings-action-btn" id="openLaunchCheckBtn" style="width:100%;">Run Launch Check</button>');
    var b=$('openLaunchCheckBtn'); if(b && !b.dataset.wired){ b.dataset.wired='1'; b.onclick=function(){ ensureLaunchPanel(); $('launchCheckPanel').classList.add('show'); renderLaunchCheck(); }; }
    var hive=$('hiveMenuPanel'); if(hive && !hive.querySelector('[data-hive-action="launch-check"]')) hive.insertAdjacentHTML('beforeend','<button data-hive-action="launch-check">🚀 Launch Check</button>');
  }
  document.addEventListener('click', function(e){ if(e.target && e.target.dataset && e.target.dataset.hiveAction==='launch-check'){ ensureLaunchPanel(); $('launchCheckPanel').classList.add('show'); renderLaunchCheck(); } }, true);
  setInterval(addLaunchButtons,4000); addLaunchButtons();
})();
