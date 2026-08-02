/* =====================================================================
   Study Hive — 02-startup-fade.js
   Extracted from the original single-file build (script block #2).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  document.addEventListener('DOMContentLoaded', function(){
    requestAnimationFrame(function(){ document.body.classList.add('app-ready'); });
    setTimeout(function(){
      document.body.classList.remove('startup-soft');
      document.body.classList.remove('app-ready');
      var glow = document.getElementById('startupHoneyGlow');
      if (glow) glow.remove();
    }, 1900);
  });
})();
