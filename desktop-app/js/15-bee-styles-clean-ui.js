/* =====================================================================
   Study Hive — 15-bee-styles-clean-ui.js
   Extracted from the original single-file build (script block #13).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function get(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
  function set(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }

  /* More Tools stability: keep it visible and working. */
  function stabilizeMoreTools(){
    var btn=$('dockToggleBtn'), bar=$('toolsDockBar');
    /* MORE TOOLS DOCK FIX
       A second "stability" click listener used to be stacked on #dockToggleBtn
       here. It ran `classList.toggle('dock-open', <current state>)`, which is a
       no-op that re-asserts the state the real handler had just set -- so the
       two listeners fought and the dock would fail to open/close on some
       clicks. The visibility styling below is genuinely useful, so that stays;
       only the redundant listener is gone. The original open/close toggle
       (section 17) is now the single source of truth. */
    if(btn){ btn.style.opacity='1'; btn.style.pointerEvents='auto'; btn.style.visibility='visible'; }
    if(bar){ bar.style.pointerEvents='none'; qa('.tools-dock-bar .dock-item').forEach(function(x){x.style.pointerEvents='auto';}); }
  }
  stabilizeMoreTools(); setInterval(stabilizeMoreTools,6000);

  /* Mobile layout can now be switched off and restored. */
  var TOP_IDS=['gradeBtn','breathingBtn','awardsBtn','vocabBtn','examBtn','fsBtn','shareCountdownBtn','settingsBtn','hiveCoachBtn','upgradeHubBtn'];
  var DOCK_IDS=['todoToggleBtn','notesBtn','cardsBtn','habitsBtn','drawBtn','capsuleBtn','punsBtn','secretsBtn','challengeBtn','heatmapBtn','rivalBtn','gardenBtn','freezeBtn','sosBtn','waterBtn','musicBtn','feedbackBtn','tipsBtn'];
  function viewportMobile(){ return (window.innerWidth||document.documentElement.clientWidth) <= 780; }
  function moveToMobileBars(){
    var top=$('mobileTopBar'), dock=$('mobileDockBar'); if(!top||!dock) return;
    TOP_IDS.forEach(function(id){ var el=$(id); if(el&&!top.contains(el)){ el.classList.add('mb-item'); top.appendChild(el); }});
    DOCK_IDS.forEach(function(id){ var el=$(id); if(el&&!dock.contains(el)){ el.classList.add('mb-item'); el.classList.remove('dock-item'); dock.appendChild(el); }});
  }
  function restoreDesktopBars(){
    if(viewportMobile()) return; // real mobile should keep mobile bars
    var bar=$('toolsDockBar');
    TOP_IDS.forEach(function(id){ var el=$(id); if(el){ el.classList.remove('mb-item'); document.body.appendChild(el); }});
    DOCK_IDS.forEach(function(id){ var el=$(id); if(el&&bar){ el.classList.remove('mb-item'); el.classList.add('dock-item'); bar.appendChild(el); }});
    document.body.classList.remove('is-mobile','force-mobile');
    document.documentElement.setAttribute('data-device','desktop');
  }
  function setForceMobile(on){
    set('studyhive-force-mobile-v1', on?'1':'0');
    document.body.classList.toggle('force-mobile', !!on);
    if(on){ document.body.classList.add('is-mobile'); moveToMobileBars(); }
    else restoreDesktopBars();
    syncFixSettings(); stabilizeMoreTools();
  }
  document.addEventListener('click', function(e){
    if(e.target && e.target.id==='mobileToggleSetting'){ e.preventDefault(); e.stopImmediatePropagation(); setForceMobile(get('studyhive-force-mobile-v1')!=='1'); }
  }, true);
  window.addEventListener('fullscreenchange', function(){ if(get('studyhive-force-mobile-v1')!=='1') setTimeout(restoreDesktopBars,120); });
  window.addEventListener('resize', function(){ if(get('studyhive-force-mobile-v1')!=='1') setTimeout(restoreDesktopBars,120); });

  /* Bee style selector and settings fixes. */
  function applyBeeStyle(){
    var style=get('studyhive-bee-style-v1')||'new';
    document.body.classList.remove('bee-style-old','bee-style-new','bee-style-both','bee-style-off','bees-off');
    document.body.classList.add('bee-style-'+style);
    if(style==='off') document.body.classList.add('bees-off');
  }
  function syncFixSettings(){
    var mt=$('mobileToggleSetting'); if(mt) mt.classList.toggle('on', get('studyhive-force-mobile-v1')==='1');
    var clean=$('settingsCleanUi'); if(clean) clean.classList.toggle('on', get('studyhive-clean-ui-v1')==='1');
    var select=$('beeStyleSelect'); if(select) select.value=get('studyhive-bee-style-v1')||'new';
  }
  function addSettingsFixes(){
    var panel=$('settingsPanel'); if(!panel || $('beeStyleSelect')) return;
    var block=document.createElement('div');
    block.innerHTML='<div class="settings-divider"></div><div class="settings-section-title">🐝 Bees</div><div class="settings-fix-note">Choose which non-Sergeant bees appear. Sergeant stays separate.</div><select id="beeStyleSelect" class="bee-style-select"><option value="new">New progress bees only</option><option value="old">Old flying bees only</option><option value="both">Both old and new bees</option><option value="off">No extra bees (Sergeant stays)</option></select><div class="settings-divider"></div><div class="settings-section-title">🧪 Diagnostics</div><button class="settings-action-btn" id="aiDiagnosticsBtn" style="width:100%;">Test AI / browser features</button><button class="settings-action-btn" id="repairLayoutBtn" style="width:100%; margin-top:6px;">Repair layout positions</button><div id="aiDiagnosticsOut" class="settings-fix-note"></div>';
    panel.appendChild(block);
    $('beeStyleSelect').onchange=function(){ set('studyhive-bee-style-v1', this.value); applyBeeStyle(); syncFixSettings(); };
    $('repairLayoutBtn').onclick=function(){ set('studyhive-force-mobile-v1','0'); restoreDesktopBars(); document.body.classList.remove('force-mobile'); stabilizeMoreTools(); toast('Layout repaired'); };
    $('aiDiagnosticsBtn').onclick=function(){
      var checks=[];
      checks.push('Protocol: '+location.protocol+(location.protocol==='file:'?' (AI imports need http/https)':' ✅'));
      checks.push('localStorage: '+(function(){try{localStorage.setItem('_t','1');localStorage.removeItem('_t');return 'OK ✅';}catch(e){return 'blocked ⚠️';}})());
      checks.push('Web Audio: '+(('AudioContext'in window||'webkitAudioContext'in window)?'OK ✅':'missing ⚠️'));
      checks.push('Notifications: '+(('Notification'in window)?Notification.permission:'unsupported'));
      checks.push('Puter AI loaded: '+(window.puter&&window.puter.ai?'yes ✅':'not loaded yet / unavailable'));
      checks.push('Flashcard AI note: if opened as file://, AI generation is intentionally blocked by browser/provider rules.');
      $('aiDiagnosticsOut').textContent=checks.join('\n');
    };
    syncFixSettings();
  }
  applyBeeStyle(); addSettingsFixes(); setInterval(function(){ applyBeeStyle(); addSettingsFixes(); },6000);

  /* Clean UI fixed: toggle no longer breaks controls. */
  document.addEventListener('click', function(e){
    if(e.target && e.target.id==='settingsCleanUi'){
      e.preventDefault(); e.stopImmediatePropagation();
      var on=get('studyhive-clean-ui-v1')!=='1'; set('studyhive-clean-ui-v1', on?'1':'0'); document.body.classList.toggle('clean-ui', on); syncFixSettings(); stabilizeMoreTools();
    }
  }, true);

  /* New V4 music engine: no white-noise bed, softer musical loops. */
  var M={ctx:null,nodes:[],timers:[],enabled:get('studyhive-bg-music-v1')!=='0',playing:false};
  function ctx(){ M.ctx=M.ctx||new (window.AudioContext||window.webkitAudioContext)(); if(M.ctx.state==='suspended') M.ctx.resume(); return M.ctx; }
  function stopMusic(){ M.timers.forEach(clearInterval); M.timers=[]; var c=M.ctx; M.nodes.forEach(function(n){ try{ if(n.gain&&c) n.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+.22); }catch(e){} }); M.nodes.forEach(function(n){ try{ n.stop&&n.stop(c?c.currentTime+.28:undefined); }catch(e){} }); setTimeout(function(){M.nodes.forEach(function(n){try{n.disconnect&&n.disconnect();}catch(e){}}); M.nodes=[]; M.playing=false; musicUi();},340); }
  function envGain(c, out, start, peak, end){ var g=c.createGain(); g.gain.setValueAtTime(0.0001,start); g.gain.exponentialRampToValueAtTime(peak,start+.06); g.gain.exponentialRampToValueAtTime(0.0001,end); g.connect(out); return g; }
  function startMusic(){
    if(!M.enabled||M.playing) return;
    try{
      var c=ctx(), master=c.createGain(); master.gain.value=(parseInt(get('studyhive-bg-volume-v1')||'32',10)/100)*0.24; master.connect(c.destination); M.nodes.push(master); M.playing=true;
      var chords=[[261.63,329.63,392.00],[220,293.66,349.23],[246.94,329.63,392.00],[196,261.63,329.63]], idx=0;
      function padChord(){
        var chord=chords[idx%chords.length]; idx++;
        chord.forEach(function(freq,i){ var o=c.createOscillator(), g=envGain(c,master,c.currentTime,.028/(i+1),c.currentTime+7.8); o.type='sine'; o.frequency.value=freq/2; o.connect(g); o.start(); o.stop(c.currentTime+8); M.nodes.push(o,g); });
      }
      function pluck(){ var notes=[392,440,493.88,523.25,587.33,659.25], o=c.createOscillator(), g=envGain(c,master,c.currentTime,.045,c.currentTime+1.7); o.type='triangle'; o.frequency.value=notes[Math.floor(Math.random()*notes.length)]; o.connect(g); o.start(); o.stop(c.currentTime+1.8); M.nodes.push(o,g); }
      padChord(); M.timers.push(setInterval(padChord,7600)); M.timers.push(setInterval(function(){ if(Math.random()<.72) pluck(); },2100));
      musicUi();
    }catch(e){ var n=$('bgMusicNote')||$('musicV4Status'); if(n) n.textContent='Audio blocked. Tap the page, then press Start.'; }
  }
  function musicUi(){ var b=$('bgMusicToggle'); if(b){ b.textContent=M.enabled?(M.playing?'On':'Start'):'Off'; b.classList.toggle('playing',M.playing); } var n=$('bgMusicNote')||$('musicV4Status'); if(n) n.textContent=M.enabled?(M.playing?'Soft musical background is playing.':'Tap Start after any page tap. No white-noise bed.'): 'Background music is off.'; }
  function ensureMusicStatus(){ var panel=$('hiveMenuPanel'); if(panel && !$('musicV4Status')){ var vol=$('bgMusicVolume'); if(vol) vol.insertAdjacentHTML('afterend','<div class="music-v4-status" id="musicV4Status"></div>'); } musicUi(); }
  ensureMusicStatus(); setInterval(ensureMusicStatus,4000);
  document.addEventListener('click', function(e){ if(e.target&&e.target.id==='bgMusicToggle'){ e.preventDefault(); e.stopImmediatePropagation(); M.enabled=!M.enabled; set('studyhive-bg-music-v1',M.enabled?'1':'0'); if(M.enabled) startMusic(); else stopMusic(); musicUi(); } }, true);
  document.addEventListener('input', function(e){ if(e.target&&e.target.id==='bgMusicVolume'){ set('studyhive-bg-volume-v1',e.target.value); if(M.nodes[0]&&M.nodes[0].gain) M.nodes[0].gain.value=(parseInt(e.target.value,10)/100)*0.24; } }, true);
  document.addEventListener('pointerdown', function(){ if(M.enabled&&!M.playing) setTimeout(startMusic,30); }, {passive:true});

  /* Queen long guide map: every feature + where it is + what it does. */
  var featureMap=[
    ['Countdown card','Center main card','Shows current time, date, days/hours/minutes left, pledge and target goal percentage.'],
    ['Goal percentage','☰ Hive → Goal %','Change the red goal from the default 90% to your own target.'],
    ['Pledge','Onboarding or ☰ Hive → Edit pledge','A promise shown under your countdown to keep your reason visible.'],
    ['Focus timer','Top left Focus button','Timed sessions that log study minutes to streaks, subjects, garden and analytics.'],
    ['No-touch Focus','Inside Focus panel','If enabled, touching/clicking during focus angers the bees.'],
    ['Pomodoro','☰ Hive menu','Start/pause/reset Pomodoro without the floating widget clutter.'],
    ['Hive Coach','☰ Hive → Hive Coach','Topic mastery, adaptive quiz, weak-topic plans and review logs.'],
    ['More Tools','Bottom center More Tools','Opens extra utilities without hiding the Hive menu.'],
    ['Tasks','More Tools → Tasks','Priority checklist for one-off work.'],
    ['Notes','More Tools → Notes','Auto-saving scratchpad for formulas, reminders and thoughts.'],
    ['Flashcards','More Tools → Cards','Manual cards, AI import helper, CSV import/export and spaced review.'],
    ['Habits','More Tools → Habits','Daily habit tracker with streak dots.'],
    ['Garden World','More Tools → Garden → Enter Garden World','Full-screen garden grown by study minutes, with journal, watering and intention seeds.'],
    ['Heatmap','More Tools → Heatmap','Calendar-like study consistency view.'],
    ['Rival Hive','More Tools → Rival Hive','Race your logged minutes against a simulated rival hive.'],
    ['Streak Freeze','More Tools → Freeze','Earn freeze tokens to protect streaks.'],
    ['Music panel','More Tools → Music','Choose lofi/generative tracks like Calm Bee Outside.'],
    ['Background music','☰ Hive top controls','Soft musical background, separate from lofi tracks, with volume and off switch.'],
    ['Weather','Top center when changed','Shows weather only when interacted with or when the weather changes.'],
    ['Grade Predictor','Top Grades button','Calculate what marks you need to hit a target.'],
    ['Exams','Top Exams button','Add exam dates and see urgency badges.'],
    ['Breathing / SOS','Breathe button + Calm button','Guided breathing and fast calm reset.'],
    ['Settings','Top/right Settings','Themes, subjects, data backup, mobile layout, bee style, sounds and guide choices.'],
    ['Sergeant Bee','Left side Sergeant','Context-aware motivator; comments on what you click and how long since studying.'],
    ['Bee styles','Settings → Bees','Choose new progress bees, old bees, both, or no extra bees while keeping Sergeant.'],
    ['Queen Bee','Tour choice + rare event','Explains the app and may rarely visit for 10 minutes.']
  ];
  function renderQueenFeatureMap(){
    var grid=$('queenGuideGrid'); if(!grid) return;
    grid.innerHTML='<div class="queen-feature-map">'+featureMap.map(function(f){return '<div class="queen-map-item"><h3>'+f[0]+'</h3><p><b>Where:</b> '+f[1]+'<br><b>Does:</b> '+f[2]+'</p></div>';}).join('')+'</div>';
  }
  document.addEventListener('click', function(e){ if(e.target&&e.target.id==='queenLongTourBtn') setTimeout(renderQueenFeatureMap,60); }, true);
  setInterval(function(){ var g=$('queenLongGuide'); if(g&&g.classList.contains('show')) renderQueenFeatureMap(); },1000);

  /* Replay tour must always show Queen choices, not jump directly into a tour. */
  document.addEventListener('click', function(e){
    if(e.target && (e.target.id==='replayTourBtn' || e.target.id==='settingsQueenGuideBtn')){
      e.preventDefault(); e.stopImmediatePropagation();
      try{ localStorage.removeItem('studyhive-tour-choice-v1'); localStorage.removeItem('studyhive-tour-seen-v1'); }catch(err){}
      var settings=$('settingsPanel'); if(settings) settings.classList.remove('show');
      var choice=$('queenTourChoice'); if(choice) choice.classList.add('show');
    }
  }, true);

  /* Bee flight normalizer removed: original swarm AI now controls movement naturally. */

})();
