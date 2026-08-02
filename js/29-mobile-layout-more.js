/* =====================================================================
   Study Hive — 29-mobile-layout-more.js
   Extracted from the original single-file build (script block #27).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function mobileish(){
    return window.innerWidth <= 900 || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 && window.innerWidth <= 1180);
  }
  function unlockMobileScroll(){
    if (!mobileish()) return;
    document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
    document.documentElement.style.setProperty('height', 'auto', 'important');
    document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
    document.body.style.setProperty('overflow-y', 'auto', 'important');
    document.body.style.setProperty('height', 'auto', 'important');
    document.body.style.setProperty('min-height', '100%', 'important');
    document.body.style.setProperty('display', 'block', 'important');
    document.body.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
    document.body.classList.add('is-mobile');
    document.body.classList.add('mobile-scroll-unlocked');
    document.documentElement.setAttribute('data-device', 'mobile');
  }
  unlockMobileScroll();
  window.addEventListener('resize', unlockMobileScroll);
  window.addEventListener('orientationchange', function(){ setTimeout(unlockMobileScroll, 250); });
  document.addEventListener('touchmove', function(){ unlockMobileScroll(); }, {passive:true});
  setInterval(unlockMobileScroll,3500);
})();
