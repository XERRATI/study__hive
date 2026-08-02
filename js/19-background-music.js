/* =====================================================================
   Study Hive — 19-background-music.js
   Extracted from the original single-file build (script block #17).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  var TRACK_URL = 'background-music.mp3';
  var customAudio = null;
  var customEnabled = localStorage.getItem('studyhive-custom-bg-enabled-v1') !== '0';
  function $(id){ return document.getElementById(id); }
  function ensureAudio(){
    if (customAudio) return customAudio;
    customAudio = document.createElement('audio');
    customAudio.id = 'customUploadedBackgroundMusic';
    customAudio.src = TRACK_URL;
    customAudio.loop = true;
    customAudio.preload = 'auto';
    customAudio.volume = (parseInt(localStorage.getItem('studyhive-custom-bg-volume-v1') || localStorage.getItem('studyhive-bg-volume-v1') || '32', 10) / 100);
    customAudio.style.display = 'none';
    document.body.appendChild(customAudio);
    return customAudio;
  }
  function updateUI(){
    var btn = $('customBgMusicToggle') || $('bgMusicToggle');
    var vol = $('bgMusicVolume');
    var note = $('bgMusicNote') || $('musicV4Status');
    if (btn) {
      btn.textContent = customEnabled ? (customAudio && !customAudio.paused ? 'On' : 'Start') : 'Off';
      btn.classList.toggle('playing', !!(customAudio && !customAudio.paused));
      btn.title = 'Uploaded background track: background-music.mp3';
    }
    if (vol) vol.value = localStorage.getItem('studyhive-custom-bg-volume-v1') || localStorage.getItem('studyhive-bg-volume-v1') || '32';
    if (note) note.textContent = customEnabled ? 'Uploaded background music ready. Tap Start/On if your browser paused it.' : 'Uploaded background music is off.';
  }
  function play(){
    if (!customEnabled) return;
    try { localStorage.setItem('studyhive-bg-music-v1', '0'); } catch(e){}
    var a = ensureAudio();
    var vol = $('bgMusicVolume');
    if (vol) a.volume = parseInt(vol.value || '32', 10) / 100;
    var p = a.play();
    if (p && p.catch) p.catch(function(){ updateUI(); });
    updateUI();
  }
  function pause(){ if (customAudio) customAudio.pause(); updateUI(); }
  function install(){
    var oldBtn = $('bgMusicToggle');
    if (oldBtn && oldBtn.id !== 'customBgMusicToggle') {
      var clone = oldBtn.cloneNode(true);
      clone.id = 'customBgMusicToggle';
      clone.textContent = 'Start';
      oldBtn.replaceWith(clone);
    }
    var btn = $('customBgMusicToggle');
    if (btn && !btn.dataset.customMusicWired) {
      btn.dataset.customMusicWired = '1';
      btn.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        customEnabled = !customEnabled || !(customAudio && !customAudio.paused);
        localStorage.setItem('studyhive-custom-bg-enabled-v1', customEnabled ? '1' : '0');
        if (customEnabled) play(); else pause();
      }, true);
    }
    var vol = $('bgMusicVolume');
    if (vol && !vol.dataset.customMusicWired) {
      vol.dataset.customMusicWired = '1';
      vol.addEventListener('input', function(){
        localStorage.setItem('studyhive-custom-bg-volume-v1', this.value);
        localStorage.setItem('studyhive-bg-volume-v1', this.value);
        if (customAudio) customAudio.volume = parseInt(this.value || '32', 10) / 100;
      }, true);
    }
    updateUI();
  }
  document.addEventListener('pointerdown', function(){ if (customEnabled) play(); }, {once:true, passive:true});
  setInterval(install, 1000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
  window.StudyHiveCustomMusic = { play: play, pause: pause, audio: ensureAudio };
})();
