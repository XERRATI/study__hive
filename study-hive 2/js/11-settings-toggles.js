/* =====================================================================
   Study Hive — 11-settings-toggles.js
   Extracted from the original single-file build (script block #9).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k,f){ try { var raw=localStorage.getItem(k); return raw?JSON.parse(raw):f; } catch(e){ return f; } }
  function setJSON(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  function toastGarden(msg){ var t=$('gardenWorldToast'); if(!t) return; t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(function(){ t.classList.remove('show'); },2600); }
  function study(){ return getJSON('study-data-v2',{totalMinutes:0,currentStreak:0,bestStreak:0,subjects:{},dailyLog:{}}); }

  /* Mobile mode toggle from onboarding/settings */
  function applyForcedMobile(){
    var forced = localStorage.getItem('studyhive-force-mobile-v1') === '1';
    document.body.classList.toggle('force-mobile', forced);
    if (!forced) return;
    document.body.classList.add('is-mobile');
    var topBar=$('mobileTopBar'), dockBar=$('mobileDockBar');
    var top=['gradeBtn','breathingBtn','awardsBtn','vocabBtn','examBtn','fsBtn','shareCountdownBtn','settingsBtn','hiveCoachBtn','upgradeHubBtn'];
    var dock=['todoToggleBtn','notesBtn','cardsBtn','habitsBtn','drawBtn','capsuleBtn','punsBtn','secretsBtn','challengeBtn','heatmapBtn','rivalBtn','gardenBtn','freezeBtn','sosBtn','waterBtn','musicBtn','feedbackBtn','tipsBtn'];
    top.forEach(function(id){ var el=$(id); if(el&&topBar&&!topBar.contains(el)){ el.classList.add('mb-item'); topBar.appendChild(el); }});
    dock.forEach(function(id){ var el=$(id); if(el&&dockBar&&!dockBar.contains(el)){ el.classList.remove('dock-item'); el.classList.add('mb-item'); dockBar.appendChild(el); }});
  }
  document.body.insertAdjacentHTML('beforeend','<button class="mobile-mode-chip" id="mobileModeChip">📱 Mobile UI on</button><div class="night-sky-layer" aria-hidden="true"></div><button class="grind-mode-btn" id="grindModeBtn">🧱 Grind Mode</button>');
  applyForcedMobile(); setTimeout(applyForcedMobile,700); window.addEventListener('resize', applyForcedMobile);
  $('mobileModeChip').addEventListener('click', function(){ localStorage.setItem('studyhive-force-mobile-v1','0'); document.body.classList.remove('force-mobile'); this.style.display='none'; });

  /* Settings additions: mobile, bees, grind */
  function addSettingsRows(){
    var panel=$('settingsPanel'); if(!panel || $('beesToggleSetting')) return;
    var block=document.createElement('div');
    block.innerHTML='<div class="settings-divider"></div><div class="settings-row"><span class="settings-row-label">📱 Force mobile layout</span><span class="settings-toggle" id="mobileToggleSetting"></span></div><div class="settings-row"><span class="settings-row-label">🐝 Show animated bees</span><span class="settings-toggle" id="beesToggleSetting"></span></div><div class="settings-row"><span class="settings-row-label">🧱 Grind mode</span><span class="settings-toggle" id="grindToggleSetting"></span></div>';
    panel.appendChild(block);
    function sync(){ $('mobileToggleSetting').classList.toggle('on', localStorage.getItem('studyhive-force-mobile-v1')==='1'); $('beesToggleSetting').classList.toggle('on', localStorage.getItem('studyhive-bees-off-v1')!=='1'); $('grindToggleSetting').classList.toggle('on', localStorage.getItem('studyhive-grind-mode-v1')==='1'); }
    $('mobileToggleSetting').onclick=function(){ localStorage.setItem('studyhive-force-mobile-v1', localStorage.getItem('studyhive-force-mobile-v1')==='1'?'0':'1'); applyForcedMobile(); sync(); };
    $('beesToggleSetting').onclick=function(){ localStorage.setItem('studyhive-bees-off-v1', localStorage.getItem('studyhive-bees-off-v1')==='1'?'0':'1'); applyBeeVisibility(); sync(); };
    $('grindToggleSetting').onclick=function(){ setGrindMode(!document.body.classList.contains('grind-mode')); sync(); };
    sync();
  }
  function applyBeeVisibility(){ document.body.classList.toggle('bees-off', localStorage.getItem('studyhive-bees-off-v1')==='1'); }
  function setGrindMode(on){ document.body.classList.toggle('grind-mode', !!on); localStorage.setItem('studyhive-grind-mode-v1', on?'1':'0'); $('grindModeBtn').textContent=on?'🍯 Exit Grind':'🧱 Grind Mode'; }
  $('grindModeBtn').onclick=function(){ setGrindMode(!document.body.classList.contains('grind-mode')); };
  applyBeeVisibility(); setGrindMode(localStorage.getItem('studyhive-grind-mode-v1')==='1'); addSettingsRows(); setTimeout(addSettingsRows,1200);

  /* No-touch focus mode */
  function injectNoTouch(){
    var focusPanel=$('focusPanel'); if(!focusPanel || $('noTouchToggle')) return;
    var row=document.createElement('div'); row.className='no-touch-row';
    row.innerHTML='<div><strong>🚫 No-touch Focus</strong><div class="no-touch-status" id="noTouchStatus">Do not touch/click during a focus session. Touches anger the bees.</div></div><span class="settings-toggle" id="noTouchToggle"></span>';
    var session=$('focusSession'); focusPanel.insertBefore(row, session || focusPanel.firstChild);
    var enabled=localStorage.getItem('studyhive-no-touch-v1')==='1';
    function sync(){ $('noTouchToggle').classList.toggle('on', enabled); }
    $('noTouchToggle').onclick=function(){ enabled=!enabled; localStorage.setItem('studyhive-no-touch-v1', enabled?'1':'0'); sync(); };
    sync();
  }
  document.body.insertAdjacentHTML('beforeend','<div class="no-touch-toast" id="noTouchToast">🐝 Hands off the hive!</div>');
  var violations=0, lastTouch=0;
  function focusRunning(){ return !!(window.sessionInterval && window.sessionRemaining>0); }
  function punishTouch(e){
    if(localStorage.getItem('studyhive-no-touch-v1')!=='1') return;
    if(!focusRunning()) return;
    var target=e.target;
    if(target && target.closest && (target.closest('#focusStopBtn') || target.closest('#noTouchToggle') || target.closest('#noTouchToast'))) return;
    var now=Date.now(); if(now-lastTouch<650) return; lastTouch=now; violations++;
    var status=$('noTouchStatus'); if(status) status.textContent='Touches this session: '+violations+' — bees are getting angry.';
    document.body.classList.add('no-touch-anger');
    var t=$('noTouchToast'); t.textContent = violations===1 ? '🐝 Hands off! The bees noticed.' : '🐝 Bees angry x'+violations+' — focus means stillness.'; t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); },1600);
    if(typeof showSergeantNag==='function') showSergeantNag(violations<3?'Hands off the screen, recruit. Your focus timer is sacred.':'The bees are furious. Screen discipline starts NOW.', true);
    setTimeout(function(){ document.body.classList.remove('no-touch-anger'); },2600);
  }
  ['pointerdown','click','touchstart'].forEach(function(ev){ document.addEventListener(ev, punishTouch, true); });
  injectNoTouch(); setTimeout(injectNoTouch,1000);

  /* Tour card smart positioning so it does not cover the highlighted thing. */
  function smartPositionTour(){
    var overlay=$('tourOverlay'), card=$('tourCard'), spot=$('tourSpotlight');
    if(!overlay || !card || !spot || !overlay.classList.contains('show')) return;
    var r=spot.getBoundingClientRect(), vw=window.innerWidth, vh=window.innerHeight;
    card.classList.add('smart-positioned');
    card.style.left='50%'; card.style.transform='translateX(-50%)'; card.style.right='auto';
    if(r.top < vh*0.42){ card.style.top='auto'; card.style.bottom='18px'; }
    else { card.style.bottom='auto'; card.style.top='18px'; }
    if(r.width>0 && r.left<vw*.34){ card.style.left='calc(100% - min(360px, 46vw) - 18px)'; card.style.transform='none'; }
    else if(r.width>0 && r.right>vw*.66){ card.style.left='18px'; card.style.transform='none'; }
  }
  setInterval(smartPositionTour,1200); window.addEventListener('resize', smartPositionTour);

  /* Full garden world */
  if(!$('gardenWorld')){
    document.body.insertAdjacentHTML('beforeend','<div class="garden-world" id="gardenWorld"><div class="garden-topbar"><h2>🌷 Bee Garden</h2><button class="garden-close" id="gardenCloseBtn">Close Garden</button></div><div class="garden-wrap-full"><div class="garden-stats-row" id="gardenStatsFull"></div><div class="garden-field" id="gardenField"><div class="garden-path"></div><div class="garden-hive-house"><div class="roof"></div><div class="base"></div><div class="door"></div></div><div class="garden-bee-friend">🐝</div></div><div class="garden-panel-full"><div class="garden-journal"><h3>Garden Journal</h3><textarea class="garden-textarea" id="gardenJournalText" placeholder="What grew today? What did you learn?"></textarea><br><button class="garden-btn" id="saveGardenJournalBtn">Save journal</button><button class="garden-btn secondary" id="clearGardenJournalBtn">Clear</button></div><div class="garden-actions"><h3>Garden Actions</h3><p>Your study minutes grow flowers. Watering adds sparkle and planting a seed saves an intention for tomorrow.</p><button class="garden-btn" id="waterGardenBtn">💧 Water garden</button><button class="garden-btn" id="plantSeedBtn">🌱 Plant intention seed</button><button class="garden-btn secondary" id="copyGardenBtn">Copy garden stats</button><div id="gardenActionOut" style="font-size:12px;margin-top:8px;"></div></div></div></div><div class="garden-toast" id="gardenWorldToast"></div></div>');
  }
  function openGardenWorld(){ $('gardenWorld').classList.add('show'); renderGardenWorld(); }
  function closeGardenWorld(){ $('gardenWorld').classList.remove('show'); }
  function renderGardenWorld(){
    var sd=study(), total=sd.totalMinutes||0, flowers=Math.min(60, Math.floor(total/10)), subjects=Object.keys(sd.subjects||{}), journal=localStorage.getItem('studyhive-garden-journal-v1')||'';
    $('gardenJournalText').value=journal;
    $('gardenStatsFull').innerHTML='<div class="garden-stat-card"><strong>'+flowers+'</strong>flowers grown</div><div class="garden-stat-card"><strong>'+Math.floor(total/60)+'h</strong>total focus time</div><div class="garden-stat-card"><strong>'+subjects.length+'</strong>subjects feeding the soil</div><div class="garden-stat-card"><strong>'+((sd.currentStreak||0))+'</strong>day streak sunshine</div>';
    var field=$('gardenField'); qa('.garden-plot').forEach(function(x){x.remove();});
    var blooms=['🌼','🌻','🌷','🌹','🪻','🌺','🌸','🌿'];
    for(var i=0;i<60;i++){
      var x=7+(i%10)*9.2+(Math.sin(i)*1.4), y=18+Math.floor(i/10)*12.5+(Math.cos(i)*1.6);
      var plot=document.createElement('div'); plot.className='garden-plot'+(i>=flowers?' locked':''); plot.style.left=x+'%'; plot.style.top=y+'%'; plot.style.transform='scale('+(0.78+((i%5)*0.07))+')';
      plot.innerHTML='<span class="stem"></span><span class="leaf l"></span><span class="leaf r"></span><span class="bloom-full">'+(i<flowers?blooms[i%blooms.length]:'🌱')+'</span>';
      plot.title=i<flowers?'Flower '+(i+1)+' · grown by study time':'Locked — study 10 more minutes per flower';
      plot.onclick=function(){ toastGarden(this.title); };
      field.appendChild(plot);
    }
  }
  function addGardenButtons(){
    var panel=$('gardenPanel'); if(panel && !$('enterGardenWorldBtn')) panel.insertAdjacentHTML('beforeend','<button class="breathing-action-btn" id="enterGardenWorldBtn" style="width:100%; margin-top:10px;">🌷 Enter Garden World</button>');
    var btn=$('enterGardenWorldBtn'); if(btn && !btn.dataset.wired){ btn.dataset.wired='1'; btn.addEventListener('click', openGardenWorld); }
  }
  addGardenButtons(); setTimeout(addGardenButtons,1000);
  var gardenBtn=$('gardenBtn'); if(gardenBtn && !gardenBtn.dataset.worldDouble){ gardenBtn.dataset.worldDouble='1'; gardenBtn.addEventListener('dblclick', function(e){ e.preventDefault(); openGardenWorld(); }); }
  $('gardenCloseBtn').onclick=closeGardenWorld;
  $('saveGardenJournalBtn').onclick=function(){ localStorage.setItem('studyhive-garden-journal-v1', $('gardenJournalText').value); toastGarden('Garden journal saved'); };
  $('clearGardenJournalBtn').onclick=function(){ $('gardenJournalText').value=''; localStorage.removeItem('studyhive-garden-journal-v1'); toastGarden('Journal cleared'); };
  $('waterGardenBtn').onclick=function(){ document.body.classList.add('garden-watered'); toastGarden('The garden sparkles. The bees approve.'); qa('.garden-plot:not(.locked)').forEach(function(p,i){ setTimeout(function(){ p.style.filter='brightness(1.25) drop-shadow(0 0 8px rgba(255,255,255,.7))'; setTimeout(function(){p.style.filter='';},900); }, i*18); }); };
  $('plantSeedBtn').onclick=function(){ var seed=prompt('What intention should this seed hold for tomorrow?'); if(seed){ localStorage.setItem('upg-focus-intention-v1', seed); $('gardenActionOut').textContent='🌱 Seed planted: '+seed; toastGarden('Intention seed planted'); } };
  $('copyGardenBtn').onclick=function(){ var sd=study(), msg='🌷 My Study Hive Garden\nFlowers: '+Math.min(60,Math.floor((sd.totalMinutes||0)/10))+'\nTotal study: '+(sd.totalMinutes||0)+' minutes\nStreak: '+(sd.currentStreak||0)+' days'; if(navigator.clipboard) navigator.clipboard.writeText(msg); toastGarden('Garden stats copied'); };

  /* Sergeant improvements: click-to-briefing and tone-aware extra replies. */
  if(!$('sergeantBriefPanel')) document.body.insertAdjacentHTML('beforeend','<div class="misc-panel" id="sergeantBriefPanel" style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:140; width:300px;"><h4>🫡 Sergeant Briefing</h4><div id="sergeantBriefText" style="font-size:13px;line-height:1.5;color:var(--deep-brown);"></div><div class="settings-divider"></div><button class="settings-action-btn" id="sergeantOrderBtn" style="width:100%;">Give me orders</button><button class="settings-action-btn" id="sergeantToneBtn" style="width:100%; margin-top:6px;">Switch tone</button><button class="settings-action-btn" id="sergeantBriefClose" style="width:100%; margin-top:6px;">Close</button></div>');
  function sergeantBrief(){ var vibe=localStorage.getItem('studyhive-coach-vibe-v1')||'balanced', worry=localStorage.getItem('studyhive-main-worry-v1')||'staying consistent'; var sd=study(); $('sergeantBriefText').innerHTML='<b>Tone:</b> '+vibe+'<br><b>Main mission:</b> '+worry+'<br><b>Current streak:</b> '+(sd.currentStreak||0)+' days<br><br>Order: pick one task, set a timer, and report back with a reflection.'; $('sergeantBriefPanel').classList.add('show'); }
  var sp=$('sergeantPersistent'); if(sp && !sp.dataset.brief){ sp.dataset.brief='1'; sp.style.cursor='pointer'; sp.title='Click for Sergeant briefing'; sp.addEventListener('click', sergeantBrief); }
  $('sergeantBriefClose').onclick=function(){ $('sergeantBriefPanel').classList.remove('show'); };
  $('sergeantOrderBtn').onclick=function(){ var orders=['10 minutes weak-topic recall. No negotiations.','Open your notes and write the first three questions you cannot answer.','Do one ugly practice question and mark it honestly.','Start with the smallest task you are avoiding.','One Pomodoro. Then water. Then report.']; var o=orders[Math.floor(Math.random()*orders.length)]; $('sergeantBriefText').innerHTML+='<br><br><b>New order:</b> '+o; if(typeof showSergeantNag==='function') showSergeantNag(o, false); };
  $('sergeantToneBtn').onclick=function(){ var tones=['calm','balanced','strict','fun'], cur=localStorage.getItem('studyhive-coach-vibe-v1')||'balanced', next=tones[(tones.indexOf(cur)+1)%tones.length]; localStorage.setItem('studyhive-coach-vibe-v1', next); sergeantBrief(); };
  if(typeof showSergeantNag==='function' && !window._sergeantToneWrapped){ window._sergeantToneWrapped=true; var original=showSergeantNag; showSergeantNag=function(text, angry){ var vibe=localStorage.getItem('studyhive-coach-vibe-v1')||'balanced'; if(vibe==='calm' && angry) { text='Gentle order: '+String(text).replace(/MOVE IT|UNACCEPTABLE|pathetic/gi,'start small'); angry=false; } if(vibe==='fun' && Math.random()<.35) text += ' 🍯'; original(text, angry); }; }
})();
