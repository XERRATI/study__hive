/* =====================================================================
   Study Hive — 46-garden-todos-zen.js
   Extracted from the original single-file build (script block #44).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  'use strict';
  function $(id){return document.getElementById(id);}

  /* Native panel closers: make every existing × reliably remove .show. */
  document.addEventListener('click',function(e){
    var x=e.target&&e.target.closest&&e.target.closest('.upgrade-panel-close-x,#upgradeCloseBtn,.upgrade-close,#coachCloseBtn,.coach-close,#sergeantBriefClose');
    if(x){
      var panel=x.closest('.misc-panel,.focus-panel,.grade-panel,.todo-panel,.breathing-panel,.upgrade-panel,.hive-coach-panel');
      if(panel){ e.preventDefault(); e.stopImmediatePropagation(); panel.classList.remove('show'); }
      return;
    }
    if(e.target&&e.target.closest&&e.target.closest('#zenExitBtn')){
      e.preventDefault(); e.stopImmediatePropagation(); document.body.classList.remove('zen-mode');
      var focus=$('focusPanel'); if(focus)focus.classList.remove('show');
    }
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape')return;
    document.body.classList.remove('zen-mode');
    document.querySelectorAll('.misc-panel.show,.focus-panel.show,.grade-panel.show,.todo-panel.show,.breathing-panel.show,.upgrade-panel.show,.hive-coach-panel.show').forEach(function(p){p.classList.remove('show');});
    var hive=$('hiveMenuPanel');if(hive)hive.classList.remove('show');
  },true);

  /* Garden World is a full screen experience: close its small menu first. */
  document.addEventListener('click',function(e){
    if(!(e.target&&e.target.closest&&e.target.closest('#enterGardenWorldBtn')))return;
    setTimeout(function(){
      var p=$('gardenPanel');if(p)p.classList.remove('show');
      document.querySelectorAll('.misc-panel.show').forEach(function(panel){if(panel.id!=='gardenPanel')panel.classList.remove('show');});
      var dock=$('toolsDockBar');if(dock)document.body.classList.remove('dock-open');
    },0);
  },true);

  /* Add exactly one close button to the native Hive Controls menu. */
  function installHiveClose(){
    var p=$('hiveMenuPanel');if(!p||$('hiveMenuClose'))return;
    p.insertAdjacentHTML('afterbegin','<div class="hive-menu-title">🐝 Hive Controls</div><button type="button" class="hive-menu-close" id="hiveMenuClose" aria-label="Close Hive Controls">×</button>');
    $('hiveMenuClose').addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();p.classList.remove('show');},true);
  }
  installHiveClose();setInterval(installHiveClose,3500);
})();
