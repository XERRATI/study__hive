/* =====================================================================
   Study Hive — 42-og-cleanup.js
   Extracted from the original single-file build (script block #40).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function removeOgClaimUi(){
    document.querySelectorAll('[data-hive-action="og-card"], #ogBadgePill, #ogCardPanel').forEach(function(el){
      try { el.remove(); } catch(e) { el.style.display = 'none'; }
    });
    var settings = document.getElementById('settingsPanel');
    if (settings && !document.getElementById('ogFutureNote')) {
      settings.insertAdjacentHTML('beforeend', '<div class="settings-divider"></div><div class="settings-section-title">👑 Future OG Founder Cards</div><div class="og-future-note" id="ogFutureNote"><strong>Coming later:</strong> once Study Hive reaches 1000 users, we will announce an update and add official OG Founder Cards. For now, claiming is paused so nobody gets a fake or unfair number.</div>');
    }
  }
  removeOgClaimUi();
  setInterval(removeOgClaimUi, 1200);
})();
