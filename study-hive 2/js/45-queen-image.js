/* =====================================================================
   Study Hive — 45-queen-image.js
   Extracted from the original single-file build (script block #43).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function forceQueenEmoji(){
    // Remove the previous uploaded Queen image wherever old scripts re-add it.
    document.querySelectorAll('.custom-queen-bee-img, .queen-guide-avatar').forEach(function(el){
      try { el.remove(); } catch(e) { el.style.display = 'none'; }
    });

    // Main queen choice screen.
    var choice = document.querySelector('.queen-choice-bee');
    if (choice) {
      choice.dataset.customQueen = '1';
      choice.classList.remove('queen-img-mode');
      if (choice.textContent.trim() !== '🐝👑') choice.textContent = '🐝👑';
    }

    // Rare queen fly-by.
    var visitor = document.getElementById('queenVisitor');
    if (visitor) {
      visitor.dataset.customQueen = '1';
      visitor.classList.remove('queen-img-mode');
      if (visitor.textContent.trim() !== '🐝👑') visitor.textContent = '🐝👑';
    }

    // If old image script hijacks the guide icon, restore the crown bee.
    ['queenV2Icon','queenStoryIcon','tourIcon'].forEach(function(id){
      var el = document.getElementById(id);
      var title = document.getElementById(id.replace('Icon','Title'));
      var titleText = title ? title.textContent : '';
      if (el && /queen|royal|welcome/i.test(titleText)) {
        el.dataset.customQueen = '1';
        el.classList.remove('queen-img-mode');
        if (el.textContent.trim() !== '👑') el.textContent = '👑';
      }
    });

    // Banner text should not contain hidden image tags.
    document.querySelectorAll('.queen-banner').forEach(function(b){
      if (!/Rare Queen Bee fly-by/.test(b.textContent || '') || b.querySelector('img')) {
        b.textContent = '🐝👑 Rare Queen Bee fly-by — 10 minute blessing';
      }
    });
  }
  // Run once, then only occasionally as a safety net (no need for a 120ms loop
  // now that the old competing image-restore script has been removed).
  forceQueenEmoji();
  document.addEventListener('DOMContentLoaded', forceQueenEmoji);
  setInterval(forceQueenEmoji, 1500);
})();
