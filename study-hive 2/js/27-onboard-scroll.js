/* =====================================================================
   Study Hive — 27-onboard-scroll.js
   Extracted from the original single-file build (script block #25).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function ensureOnboardScrollWheel(){
    var veil = $('onboardVeil');
    if (!veil || $('onboardScrollWheel')) return;
    veil.insertAdjacentHTML('beforeend', '<div class="onboard-scroll-wheel" id="onboardScrollWheel" aria-label="Onboarding scroll controls"><button type="button" id="onboardScrollUp" aria-label="Scroll up">↑</button><div class="onboard-scroll-track"><div class="onboard-scroll-thumb" id="onboardScrollThumb"></div></div><button type="button" id="onboardScrollDown" aria-label="Scroll down">↓</button></div><div class="onboard-scroll-hint" id="onboardScrollHint">Swipe or use ↑ ↓ to move through setup</div>');
    $('onboardScrollUp').addEventListener('click', function(e){ e.preventDefault(); scrollOnboard(-260); });
    $('onboardScrollDown').addEventListener('click', function(e){ e.preventDefault(); scrollOnboard(260); });
    veil.addEventListener('scroll', updateOnboardScrollThumb, {passive:true});
    window.addEventListener('resize', updateOnboardScrollThumb);
    setTimeout(updateOnboardScrollThumb, 100);
  }
  function scrollOnboard(delta){
    var veil = $('onboardVeil');
    var card = veil && veil.querySelector('.onboard-card');
    if (!veil) return;
    // Mobile uses the veil as the page scroller, but desktop square card uses internal scroll.
    var target = (window.innerWidth > 780 && card) ? card : veil;
    try { target.scrollBy({top: delta, behavior: 'smooth'}); }
    catch(e) { target.scrollTop += delta; }
    setTimeout(updateOnboardScrollThumb, 260);
  }
  function updateOnboardScrollThumb(){
    var veil = $('onboardVeil');
    var thumb = $('onboardScrollThumb');
    var hint = $('onboardScrollHint');
    if (!veil || !thumb) return;
    var card = veil.querySelector('.onboard-card');
    var scroller = (window.innerWidth > 780 && card) ? card : veil;
    var max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
    var pct = Math.max(0, Math.min(1, scroller.scrollTop / max));
    var trackH = 92;
    var thumbH = Math.max(18, Math.min(trackH, (scroller.clientHeight / Math.max(scroller.scrollHeight, 1)) * trackH));
    thumb.style.height = thumbH + 'px';
    thumb.style.transform = 'translateY(' + ((trackH - thumbH) * pct) + 'px)';
    var needsScroll = max > 8;
    var wheel = $('onboardScrollWheel');
    if (wheel) wheel.style.opacity = needsScroll ? '1' : '.35';
    if (hint) hint.style.display = (needsScroll && veil.classList.contains('show') && window.innerWidth <= 780) ? 'block' : 'none';
  }
  setInterval(function(){ ensureOnboardScrollWheel(); updateOnboardScrollThumb(); }, 3000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureOnboardScrollWheel); else ensureOnboardScrollWheel();
})();
