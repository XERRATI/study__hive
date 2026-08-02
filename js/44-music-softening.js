/* =====================================================================
   Study Hive — 44-music-softening.js
   Extracted from the original single-file build (script block #42).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }

  /* VOLUME SLIDER FIX
     This used to run on a setInterval(..., 2000) loop that clamped the music
     volume back down to 14% every two seconds whenever it read above 18%.
     That is why dragging the slider up "worked" for a moment and then snapped
     back on its own -- the loop was fighting the user.

     The one-time calm default on first run is still worth keeping, so it now
     runs ONCE and only for a brand-new user (the '...softened-v2' flag). After
     that the slider is the single source of truth and nothing overrides it. */
  function applyCalmDefaultOnce(){
    var preferred = 14; // percent
    if (get('studyhive-music-softened-v2') === '1') return; // user already past first run
    ['studyhive-master-volume-v1','studyhive-custom-bg-volume-v1','studyhive-bg-volume-v1'].forEach(function(k){
      var cur = parseInt(get(k) || '999', 10);
      if (!isFinite(cur) || cur > 18) set(k, String(preferred));
    });
    set('studyhive-music-softened-v2','1');

    ['masterMusicVolume','bgMusicVolume'].forEach(function(id){ var el=$(id); if(el && parseInt(el.value||'100',10)>18) { el.value=preferred; } });
    var label=$('masterMusicVolumeValue'); if(label && parseInt(label.textContent||'100',10)>18) label.textContent=preferred+'%';
    var audio=$('customUploadedBackgroundMusic'); if(audio && audio.volume>.18) audio.volume=preferred/100;
    try { if(window.StudyHiveCustomMusic && window.StudyHiveCustomMusic.audio) { var a=window.StudyHiveCustomMusic.audio(); if(a && a.volume>.18) a.volume=preferred/100; } } catch(e){}
  }
  applyCalmDefaultOnce();
  /* NOTE: no setInterval here on purpose. The slider keeps whatever the user sets. */

  /* Sergeant: if muted, no bubble AND no sound. Also speak less often and with context. */
  function isSergeantMuted(){
    var until = parseInt(get('sergeant-mute-until') || '0', 10);
    return Date.now() < until;
  }
  function contextPrefix(){
    if(document.querySelector('.focus-session.active')) return 'Focus context: ';
    if(document.querySelector('#gardenWorld.show')) return 'Garden context: ';
    if(document.querySelector('#beeAIPanel.show')) return 'Bee AI context: ';
    if(document.querySelector('#backupCenterPanel.show')) return 'Backup context: ';
    if(document.querySelector('#settingsPanel.show')) return 'Settings context: ';
    if(document.querySelector('#cardsPanel.show')) return 'Flashcard context: ';
    if(document.querySelector('#notesPanel.show')) return 'Notes context: ';
    if(document.querySelector('#todoPanel.show')) return 'Task context: ';
    return '';
  }
  if(typeof showSergeantNag === 'function' && !window._finalSergeantBalanceWrapped){
    window._finalSergeantBalanceWrapped = true;
    var previousSergeantNag = showSergeantNag;
    var lastSergeantLine = 0;
    showSergeantNag = function(text, angry){
      if(isSergeantMuted()) return;
      var now = Date.now();
      var minGap = angry ? 28000 : 52000;
      if(now - lastSergeantLine < minGap) return;
      lastSergeantLine = now;
      var prefix = contextPrefix();
      var out = String(text || 'Back to the mission, recruit.');
      if(prefix && out.indexOf(prefix) !== 0 && out.length < 210) out = prefix + out;
      previousSergeantNag(out, angry);
    };
  }
})();
