/* =====================================================================
   Study Hive — 21-more-tools-dock.js
   Extracted from the original single-file build (script block #19).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  var MORE_TOOL_TARGETS = {
    cardsBtn: true,
    notesBtn: true,
    todoToggleBtn: true,
    gardenBtn: true,
    musicBtn: true,
    heatmapBtn: true,
    rivalBtn: true,
    freezeBtn: true,
    waterBtn: true,
    habitsBtn: true,
    drawBtn: true,
    capsuleBtn: true,
    punsBtn: true,
    secretsBtn: true,
    challengeBtn: true,
    feedbackBtn: true,
    tipsBtn: true
  };
  var queenOpenedDock = false;
  function currentQueenTargetId(){
    var spot = $('queenStorySpot');
    if (!spot || spot.style.display === 'none') return '';
    var sr = spot.getBoundingClientRect();
    var best = null, bestScore = Infinity;
    Object.keys(MORE_TOOL_TARGETS).forEach(function(id){
      var el = $(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      var score = Math.abs(r.left - sr.left) + Math.abs(r.top - sr.top) + Math.abs(r.width - sr.width) + Math.abs(r.height - sr.height);
      if (score < bestScore) { bestScore = score; best = id; }
    });
    return bestScore < 80 ? best : '';
  }
  function queenBodyMentionsMoreTools(){
    var body = $('queenStoryBody');
    var title = $('queenStoryTitle');
    var txt = ((title && title.textContent) || '') + ' ' + ((body && body.textContent) || '');
    return /More Tools|Flashcards|Notes|Tasks|Garden|Music panel|Heatmap|Rival Hive|Streak Freeze|Water/i.test(txt);
  }
  function setDock(open){
    var btn = $('dockToggleBtn');
    var isOpen = document.body.classList.contains('dock-open');
    if (open && !isOpen) {
      queenOpenedDock = true;
      if (btn) btn.click(); else document.body.classList.add('dock-open');
    } else if (!open && isOpen && queenOpenedDock) {
      if (btn) btn.click(); else document.body.classList.remove('dock-open');
      queenOpenedDock = false;
    }
  }
  function syncQueenDock(){
    var overlay = $('queenStoryOverlay');
    if (!overlay || !overlay.classList.contains('show')) {
      if (queenOpenedDock && document.body.classList.contains('dock-open')) setDock(false);
      return;
    }
    var id = currentQueenTargetId();
    var needsDock = !!(id && MORE_TOOL_TARGETS[id]) || queenBodyMentionsMoreTools();
    setDock(needsDock);
  }
  setInterval(syncQueenDock, 1500);
  document.addEventListener('click', function(e){
    if (e.target && (e.target.id === 'queenStoryNext' || e.target.id === 'queenStoryBack' || e.target.id === 'queenStorySkip')) {
      setTimeout(syncQueenDock, 40);
      setTimeout(syncQueenDock, 260);
    }
  }, true);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setTimeout(syncQueenDock, 60); }, true);
})();
