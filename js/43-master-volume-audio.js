/* =====================================================================
   Study Hive — 43-master-volume-audio.js
   Extracted from the original single-file build (script block #41).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* Desync all bee animations and keep newly spawned bees unique. */
  function rand(min,max){ return min + Math.random() * (max-min); }
  function naturalizeProgressBee(el){
    if(!el || el.dataset.beeDesync === '1') return;
    el.dataset.beeDesync = '1';
    el.style.setProperty('--bee-bob-delay', (-rand(0,1.6)).toFixed(2)+'s');
    el.style.setProperty('--bee-wing-delay', (-rand(0,.7)).toFixed(2)+'s');
    el.style.setProperty('--bee-bob-speed', rand(.45,.92).toFixed(2)+'s');
    el.style.setProperty('--bee-wing-speed', rand(.08,.18).toFixed(2)+'s');
    el.style.setProperty('--bee-offset-x', rand(-3.5,3.5).toFixed(1)+'px');
    el.style.setProperty('--bee-offset-y', rand(-3.5,3.5).toFixed(1)+'px');
  }
  function naturalizeOldBee(el){
    if(!el || el.dataset.oldBeeDesync === '1') return;
    el.dataset.oldBeeDesync = '1';
    el.style.setProperty('--old-bee-route-delay', (-rand(0,14)).toFixed(2)+'s');
    el.style.setProperty('--old-bee-route-speed', rand(11,20).toFixed(2)+'s');
    el.style.setProperty('--old-bee-bob-delay', (-rand(0,1.5)).toFixed(2)+'s');
    el.style.setProperty('--old-bee-bob-speed', rand(.28,.62).toFixed(2)+'s');
    el.style.setProperty('--old-bee-wing-delay', (-rand(0,.5)).toFixed(2)+'s');
    el.style.setProperty('--old-bee-wing-speed', rand(.08,.18).toFixed(2)+'s');
  }
  function desyncBees(){
    qa('.hive-bee-el').forEach(naturalizeProgressBee);
    qa('.bee-wrap').forEach(naturalizeOldBee);
  }
  desyncBees();
  setInterval(desyncBees,3500);

  /* Clear old normalizer marks if any, so desync can apply to existing bees. */
  setTimeout(function(){ qa('.hive-bee-el').forEach(function(b){ if(!b.dataset.beeDesync){ b.dataset.naturalized=''; } }); desyncBees(); }, 1500);

  /* Obvious master music volume in Hive Controls. */
  function ensureMusicSlider(){
    var panel=$('hiveMenuPanel'); if(!panel || $('masterMusicVolume')) return;
    var current = localStorage.getItem('studyhive-master-volume-v1') || localStorage.getItem('studyhive-custom-bg-volume-v1') || localStorage.getItem('studyhive-bg-volume-v1') || '30';
    var html='<div class="music-volume-box"><label><span>🎚️ Music volume</span><span class="music-volume-value" id="masterMusicVolumeValue">'+current+'%</span></label><input id="masterMusicVolume" type="range" min="0" max="100" value="'+current+'"></div>';
    var bg=document.querySelector('.bg-music-mini');
    if(bg) bg.insertAdjacentHTML('afterend', html); else panel.insertAdjacentHTML('afterbegin', html);
    $('masterMusicVolume').addEventListener('input', function(){
      var v=this.value;
      localStorage.setItem('studyhive-master-volume-v1', v);
      localStorage.setItem('studyhive-custom-bg-volume-v1', v);
      localStorage.setItem('studyhive-bg-volume-v1', v);
      var val=$('masterMusicVolumeValue'); if(val) val.textContent=v+'%';
      var old=$('bgMusicVolume'); if(old) old.value=v;
      var pct=$('bgVolumePct'); if(pct) pct.textContent=v+'%';
      var lv=$('lofiVolumeValue'); if(lv) lv.textContent=v+'%';
      var sl=$('lofiVolumeSlider'); if(sl) sl.value=v;
      var audio=$('customUploadedBackgroundMusic'); if(audio) audio.volume=parseInt(v,10)/100;
      try { if(window.StudyHiveCustomMusic && window.StudyHiveCustomMusic.audio) window.StudyHiveCustomMusic.audio().volume=parseInt(v,10)/100; } catch(e){}
    });
  }
  ensureMusicSlider(); setInterval(ensureMusicSlider,3500);

  /* Admin-only tools: add note and set admin-mode based on admin panel state. */
  function syncAdminMode(){
    var active = !!($('adminPanel') && $('adminPanel').classList.contains('show'));
    document.body.classList.toggle('admin-mode', active);
    var settings=$('settingsPanel');
    if(settings && !$('adminOnlyNote')){
      settings.insertAdjacentHTML('beforeend','<div class="admin-only-note" id="adminOnlyNote">Testing and diagnostic tools are hidden. Open Admin Mode to access them.</div>');
    }
  }
  setInterval(syncAdminMode, 3500);
  syncAdminMode();
})();
