/* =====================================================================
   Study Hive — 50-sos-calm-focus.js
   Extracted from the original single-file build (script block #48).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  'use strict';
  function $(id){return document.getElementById(id);}
  function startNextFocus(){
    var panel=$('focusPanel'),button=$('focusBtn'),preset=document.querySelector('.focus-preset-btn[data-mins="15"]');
    if(panel&&!panel.classList.contains('show')&&button)button.click();
    if(panel)panel.classList.add('show');
    setTimeout(function(){if(preset)preset.click();},50);
  }
  function openCoach(){
    var button=$('hiveCoachBtn');if(button)button.click();
    setTimeout(function(){var panel=$('hiveCoachPanel');if(panel)panel.classList.add('show');},0);
  }
  document.addEventListener('click',function(e){
    var button=e.target&&e.target.closest&&e.target.closest('#smartStartBtn,#smartCoachBtn');
    if(!button)return;
    e.preventDefault();e.stopImmediatePropagation();
    if(button.id==='smartStartBtn')startNextFocus();else openCoach();
  },true);

  /* Calm is a primary safety control, never a hidden More Tools item. */
  function restoreCalm(){
    var calm=$('sosBtn');if(!calm)return;
    calm.classList.remove('dock-item','mb-item');
    if(calm.parentElement!==document.body)document.body.appendChild(calm);
  }
  restoreCalm();setInterval(restoreCalm,3500);
})();
