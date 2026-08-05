/* =====================================================================
   Study Hive — 52-admin-status-report.js
   Extracted from the original single-file build (script block #50).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  'use strict';
  var safari=/^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  if(safari) document.body.classList.add('safari-performance');
  function scroller(){
    var veil=document.getElementById('onboardVeil');
    if(!veil||!veil.classList.contains('show'))return null;
    var card=veil.querySelector('.onboard-card');
    return card&&card.scrollHeight>card.clientHeight+4?card:veil;
  }
  function wire(){
    var veil=document.getElementById('onboardVeil');
    if(!veil||veil.dataset.safariWheel==='1')return;
    veil.dataset.safariWheel='1';

    /* Desktop Safari: mouse wheel. */
    veil.addEventListener('wheel',function(e){
      var target=scroller(); if(!target)return;
      var before=target.scrollTop; target.scrollTop+=e.deltaY;
      if(target.scrollTop!==before)e.preventDefault();
    },{passive:false});

    /* SAFARI ONBOARDING SCROLL FIX (touch)
       The patch above only handled 'wheel', so the onboarding card scrolled on
       desktop Safari with a mouse but stayed stuck on real iPhone/iPad, where
       there is no wheel event at all. These touch handlers mirror the wheel
       logic so a finger drag scrolls the same element.

       touchstart is passive (never blocks the tap). touchmove must NOT be
       passive, because it only calls preventDefault() when it actually
       consumed the gesture -- that is what stops iOS from rubber-banding the
       page behind the overlay. When the card is already at its top/bottom
       edge we deliberately let the event through so the gesture still feels
       native instead of dead. */
    var touchY=null, touchTarget=null;

    veil.addEventListener('touchstart',function(e){
      if(!e.touches||e.touches.length!==1){ touchY=null; touchTarget=null; return; }
      touchTarget=scroller();
      touchY=e.touches[0].clientY;
    },{passive:true});

    veil.addEventListener('touchmove',function(e){
      if(touchY===null||!touchTarget)return;
      if(!e.touches||e.touches.length!==1)return;

      /* IOS NATIVE SCROLL FIX: the veil itself now scrolls natively
         (overflow-y:auto + touch-action:pan-y). Hand-scrolling it with
         scrollTop + preventDefault fought iOS momentum scrolling and made
         onboarding feel stuck on iPhone. Let the browser do it. */
      if(touchTarget === veil) return;

      var y=e.touches[0].clientY;
      var delta=touchY-y;          // finger up => positive => scroll down
      touchY=y;

      var max=touchTarget.scrollHeight-touchTarget.clientHeight;
      if(max<=0)return;            // nothing to scroll, let the page have it

      var before=touchTarget.scrollTop;
      var next=Math.max(0,Math.min(max,before+delta));
      if(next===before)return;     // at an edge: don't swallow the gesture

      touchTarget.scrollTop=next;
      if(e.cancelable)e.preventDefault();
    },{passive:false});

    veil.addEventListener('touchend',function(){ touchY=null; touchTarget=null; },{passive:true});
    veil.addEventListener('touchcancel',function(){ touchY=null; touchTarget=null; },{passive:true});
  }
  wire(); document.addEventListener('DOMContentLoaded',wire,{once:true});
  window.StudyHiveQuickTest=function(){
    var ids=['hiveWrap','focusBtn','smartStartBtn','smartCoachBtn','sosBtn','onboardVeil'];
    var result={}; ids.forEach(function(id){result[id]=!!document.getElementById(id);});
    result.safariWheel=!!document.getElementById('onboardVeil');
    result.beeCap='10 old + 10 new';
    result.tripleHiveClick='enabled';
    return result;
  };
})();
