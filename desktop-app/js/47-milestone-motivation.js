/* =====================================================================
   Study Hive — 47-milestone-motivation.js
   Extracted from the original single-file build (script block #45).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  'use strict';
  function $(id){return document.getElementById(id);}
  function toast(message){ if(typeof window.showMilestoneToast==='function') window.showMilestoneToast(message,3600); else alert(message); }

  /* The pledge leaves the card only where there is actual room beside it. */
  function placePledge(){
    var p=document.querySelector('.pledge-pill');
    if(!p)return;
    if(window.innerWidth>=1000){
      p.style.setProperty('position','absolute','important');
      p.style.setProperty('left','calc(100% + 18px)','important');
      p.style.setProperty('top','52%','important');
      p.style.setProperty('width','190px','important');
      p.style.setProperty('max-width','190px','important');
      p.style.setProperty('margin','0','important');
      p.style.setProperty('transform','translateY(-50%)','important');
    } else {
      p.style.removeProperty('position'); p.style.removeProperty('left'); p.style.removeProperty('top');
      p.style.removeProperty('width'); p.style.removeProperty('max-width'); p.style.removeProperty('margin'); p.style.removeProperty('transform');
    }
  }

  /* Functional Next best move buttons.

     GLITCH FIX (double-fire): there were THREE handlers racing for
     #smartStartBtn / #smartCoachBtn -- an .onclick assigned where the card is
     built, this delegated capture listener, and a later, more complete one
     (startNextFocus / openCoach). Because each delegated copy called
     stopImmediatePropagation(), whichever registered last silently swallowed
     the others, so behaviour depended on script order and a single tap could
     fire two different "start focus" paths. This redundant middle copy is
     removed; the later handler is the single owner. */

  /* Make Queen legend and Bee AI Close definite actions. */
  document.addEventListener('click',function(e){
    var queen=e.target&&e.target.closest&&e.target.closest('[data-hive-action="queen"]');
    if(queen){e.preventDefault();e.stopImmediatePropagation();toast('👑 Queen legend: the Queen Bee is a rare visitor who blesses the hive for 10 minutes.');var menu=$('hiveMenuPanel');if(menu)menu.classList.remove('show');}
    var beeClose=e.target&&e.target.closest&&e.target.closest('#beeAIClose');
    if(beeClose){e.preventDefault();e.stopImmediatePropagation();var ai=$('beeAIPanel');if(ai)ai.classList.remove('show');}
  },true);

  /* Native XP progress bees remain untouched. */
  function restoreSimpleBees(){}

  /* No message can become a giant empty rectangle. */
  function containMessages(){
    document.querySelectorAll('.motivation-bubble,.sergeant-nag-bubble,.buddy-bubble').forEach(function(b){
      b.style.setProperty('width','auto','important');
      b.style.setProperty('height','auto','important');
      b.style.setProperty('min-height','0','important');
      b.style.setProperty('max-width','145px','important');
      b.style.setProperty('max-height','72px','important');
      b.style.setProperty('overflow','hidden','important');
      b.style.setProperty('padding','7px 9px','important');
      b.style.setProperty('font-size','10.5px','important');
      b.style.setProperty('line-height','1.25','important');
    });
  }
  placePledge();restoreSimpleBees();containMessages();
  window.addEventListener('resize',placePledge);
  setInterval(function(){placePledge();restoreSimpleBees();containMessages();},800);
})();
