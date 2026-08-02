/* =====================================================================
   Study Hive — 13-sounds-tour-swarm.js
   Extracted from the original single-file build (script block #11).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function storageGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function storageSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }

  /* Make sure More Tools is separate again. */
  function unhideMoreTools(){ document.body.classList.add('clean-ui'); var dock=$('dockToggleBtn'); if(dock){ dock.style.opacity='1'; dock.style.pointerEvents='auto'; dock.style.visibility='visible'; } }
  unhideMoreTools(); setInterval(unhideMoreTools,6000);

  /* Improve sergeant visuals without hat. */
  function sergeantBetterGear(){
    var s=$('sergeantPersistent'); if(!s) return;
    var g=s.querySelector('.sergeant-gear');
    if(!g){ g=document.createElement('div'); g.className='sergeant-gear'; s.appendChild(g); }
    if(!g.querySelector('.sgt-aura')) g.insertAdjacentHTML('afterbegin','<span class="sgt-aura"></span>');
    if(!g.querySelector('.sgt-chevron')) g.insertAdjacentHTML('beforeend','<span class="sgt-chevron">🎖️</span>');
    if(!g.querySelector('.sgt-glasses')) g.insertAdjacentHTML('beforeend','<span class="sgt-glasses"></span>');
    var cap=g.querySelector('.sgt-cap'); if(cap) cap.remove();
  }
  sergeantBetterGear(); setInterval(sergeantBetterGear,7000);

  /* Reliable audio engine for background music and UI sounds. */
  var audio = {ctx:null, bg:null, bgNodes:[], enabled: storageGet('studyhive-bg-music-v1') !== '0', uiEnabled: storageGet('studyhive-ui-sounds-v1') !== '0'};
  function ctx(){ audio.ctx = audio.ctx || new (window.AudioContext || window.webkitAudioContext)(); if(audio.ctx.state==='suspended') audio.ctx.resume(); return audio.ctx; }
  function tone(freq, dur, type, vol, delay){
    try{ var c=ctx(), o=c.createOscillator(), g=c.createGain(), t=c.currentTime+(delay||0); o.type=type||'sine'; o.frequency.setValueAtTime(freq,t); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol||0.08,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.16)); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+(dur||0.18)+0.03); }catch(e){}
  }
  function clickSound(kind){ if(!audio.uiEnabled) return; if(kind==='sergeant'){ tone(160,.12,'sawtooth',.045); tone(95,.18,'square',.025,.08); return; } if(kind==='queen'){ tone(523,.22,'triangle',.06); tone(784,.26,'triangle',.045,.12); return; } if(kind==='panel'){ tone(440,.08,'triangle',.035); tone(660,.12,'sine',.03,.05); return; } tone(620,.055,'triangle',.025); }
  function stopBg(){ audio.bgNodes.forEach(function(n){ try{ if(n.gain) n.gain.exponentialRampToValueAtTime(0.0001,ctx().currentTime+.25); }catch(e){} }); audio.bgNodes.forEach(function(n){ try{ n.stop&&n.stop(ctx().currentTime+.3); }catch(e){} }); setTimeout(function(){ audio.bgNodes.forEach(function(n){ try{n.disconnect&&n.disconnect();}catch(e){} }); audio.bgNodes=[]; audio.bg=null; },350); }
  function startBg(){
    if(!audio.enabled || audio.bg) return;
    try{
      var c=ctx(), master=c.createGain(); master.gain.value=(parseInt(storageGet('studyhive-bg-volume-v1')||'34',10)/100)*0.26; master.connect(c.destination); audio.bgNodes.push(master); audio.bg=master;
      var chords=[[196,246.94,293.66],[174.61,220,261.63],[207.65,261.63,329.63]], chordIndex=0;
      function addOsc(freq){ var o=c.createOscillator(), g=c.createGain(), l=c.createOscillator(), lg=c.createGain(); o.type='sine'; o.frequency.value=freq; g.gain.value=.045; l.type='sine'; l.frequency.value=.04+Math.random()*.03; lg.gain.value=1.8; l.connect(lg); lg.connect(o.frequency); o.connect(g); g.connect(master); o.start(); l.start(); audio.bgNodes.push(o,g,l,lg); }
      chords[0].forEach(addOsc);
      var interval=setInterval(function(){ if(!audio.bg){ clearInterval(interval); return; } audio.bgNodes.slice(1).forEach(function(n){ try{n.stop&&n.stop(c.currentTime+.2);}catch(e){} try{ if(n!==master) n.disconnect&&n.disconnect(); }catch(e){} }); audio.bgNodes=[master]; chordIndex=(chordIndex+1)%chords.length; chords[chordIndex].forEach(addOsc); },18000); audio.bgNodes.push({stop:function(){clearInterval(interval)}, disconnect:function(){}});
      // airy texture
      var buffer=c.createBuffer(1,c.sampleRate*2,c.sampleRate), data=buffer.getChannelData(0); for(var i=0;i<data.length;i++) data[i]=Math.random()*2-1; var src=c.createBufferSource(); src.buffer=buffer; src.loop=true; var f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=520; var ng=c.createGain(); ng.gain.value=.018; src.connect(f); f.connect(ng); ng.connect(master); src.start(); audio.bgNodes.push(src,f,ng);
      updateMusicUI('playing');
    }catch(e){ updateMusicUI('blocked'); }
  }
  function updateMusicUI(state){ var btn=$('bgMusicToggle'), note=$('bgMusicNote'); if(btn){ btn.textContent=audio.enabled ? (audio.bg?'On':'Start') : 'Off'; btn.classList.toggle('playing', !!audio.bg); } if(note){ note.textContent = state==='blocked' ? 'Tap again if your browser blocked audio.' : (audio.enabled ? 'Soft background music is ready after any tap.' : 'Background music is off.'); } }
  function rebuildMusicMenu(){ var panel=$('hiveMenuPanel'); if(!panel || $('bgMusicNote')) return; var mini=panel.querySelector('.bg-music-mini'); if(mini) mini.insertAdjacentHTML('afterend','<div class="music-state-note" id="bgMusicNote"></div><button id="uiSoundToggle">🔔 UI sounds: On</button>'); var ui=$('uiSoundToggle'); if(ui){ ui.textContent='🔔 UI sounds: '+(audio.uiEnabled?'On':'Off'); ui.onclick=function(e){ e.stopPropagation(); audio.uiEnabled=!audio.uiEnabled; storageSet('studyhive-ui-sounds-v1', audio.uiEnabled?'1':'0'); ui.textContent='🔔 UI sounds: '+(audio.uiEnabled?'On':'Off'); clickSound('panel'); }; } updateMusicUI(); }
  rebuildMusicMenu(); setTimeout(rebuildMusicMenu,1000);
  // disabled old background auto-start; V4 music engine handles audio reliably
  var bgBtn=$('bgMusicToggle'); if(bgBtn){ bgBtn.onclick=function(e){ e.stopPropagation(); audio.enabled=!audio.enabled; storageSet('studyhive-bg-music-v1', audio.enabled?'1':'0'); if(audio.enabled) startBg(); else stopBg(); updateMusicUI(); clickSound('panel'); }; }
  var vol=$('bgMusicVolume'); if(vol){ vol.value=storageGet('studyhive-bg-volume-v1')||'34'; vol.oninput=function(e){ e.stopPropagation(); storageSet('studyhive-bg-volume-v1', this.value); if(audio.bg&&audio.bg.gain) audio.bg.gain.value=(parseInt(this.value,10)/100)*0.26; }; }

  /* Sound for buttons, panels, and sergeant talking (not speech). */
  document.addEventListener('click', function(e){ var b=e.target.closest&&e.target.closest('button,.settings-toggle,.lofi-track-btn,.mood-btn,.water-glass'); if(b) clickSound(b.id&&b.id.indexOf('sergeant')>=0?'sergeant':(b.closest&&b.closest('.misc-panel')?'panel':'click')); }, true);
  if(typeof showSergeantNag==='function' && !window._sergeantSoundWrapped){ window._sergeantSoundWrapped=true; var oldNag=showSergeantNag; showSergeantNag=function(text, angry){ clickSound('sergeant'); setTimeout(function(){clickSound('sergeant');},160); oldNag(text, angry); }; }

  /* Bee easter-egg whispers. Rare, not annoying. */
  var beeWhispers=[
    'psst… type “honey” anywhere 🍯',
    'double-click the hive if your reflexes are ready 🎮',
    'the footer likes being clicked five times 🐝',
    'some secrets prefer quiet students… try propolis after the old code',
    'the queen visits rarely. be patient 👑',
    'Garden World grows faster after honest focus sessions 🌷'
  ];
  function beeWhisper(){
    if(document.body.classList.contains('bees-off') || document.body.classList.contains('grind-mode')) return;
    if(Math.random()>0.18) return;
    var bees=qa('.hive-bee-el:not(.sleeping)'); if(!bees.length) return;
    var bee=bees[Math.floor(Math.random()*bees.length)], r=bee.getBoundingClientRect(), msg=beeWhispers[Math.floor(Math.random()*beeWhispers.length)];
    var bubble=document.createElement('div'); bubble.className='motivation-bubble show'; bubble.style.left=Math.max(8,Math.min(window.innerWidth-240,r.left+18))+'px'; bubble.style.top=Math.max(8,r.top-48)+'px'; bubble.style.right='auto'; bubble.style.bottom='auto'; bubble.style.borderRadius='18px 18px 18px 4px'; bubble.textContent=msg; document.body.appendChild(bubble); clickSound('panel'); setTimeout(function(){ bubble.classList.remove('show'); setTimeout(function(){bubble.remove();},450); },5200);
  }
  setInterval(beeWhisper, 90000);

  /* Queen chooses tour length before the normal explainer. */
  function installQueenTourChoice(){
    if($('queenTourChoice')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="queen-tour-choice" id="queenTourChoice"><div class="queen-choice-card"><div class="queen-choice-bee">🐝👑</div><h2>The Queen can show you around.</h2><p>Choose a quick royal briefing, a longer complete explanation, or skip and explore the hive yourself.</p><div class="queen-choice-actions"><button id="queenShortTourBtn">Short tour — under 1 minute</button><button id="queenLongTourBtn" class="secondary">Long tour — explain everything</button><button id="queenSkipTourBtn" class="secondary">Skip explanation</button></div></div></div>');
    $('queenShortTourBtn').onclick=function(){ clickSound('queen'); storageSet('studyhive-tour-choice-v1','short'); $('queenTourChoice').classList.remove('show'); if(window.HiveTour&&window.HiveTour._realStart) window.HiveTour._realStart('short'); };
    $('queenLongTourBtn').onclick=function(){ clickSound('queen'); storageSet('studyhive-tour-choice-v1','long'); $('queenTourChoice').classList.remove('show'); if(window.HiveTour&&window.HiveTour._realStart) window.HiveTour._realStart('long'); };
    $('queenSkipTourBtn').onclick=function(){ clickSound('panel'); storageSet('studyhive-tour-choice-v1','skip'); try{localStorage.setItem('studyhive-tour-seen-v1','1');}catch(e){} $('queenTourChoice').classList.remove('show'); };
  }
  function makeLongTourThenStart(){
    // Instead of editing the original closure, start short tour and then invite Hive Studio / Coach.
    if(window.HiveTour && window.HiveTour._realStart) window.HiveTour._realStart('short');
    setTimeout(function(){ toast('Long guide tip: after the short tour, open ☰ Hive → Hive Coach and Hive Studio for deeper explanations.'); },2500);
  }
  function wrapHiveTour(){
    if(!window.HiveTour || window.HiveTour._queenWrapped) return;
    installQueenTourChoice();
    window.HiveTour._realStart = window.HiveTour.start;
    window.HiveTour.start = function(mode){
      var choice=mode||storageGet('studyhive-tour-choice-v1');
      if(choice==='skip') return;
      if(choice==='long') return makeLongTourThenStart();
      if(choice==='short') return window.HiveTour._realStart();
      $('queenTourChoice').classList.add('show'); clickSound('queen');
    };
    var oldMaybe=window.HiveTour.maybeAutoStart;
    window.HiveTour.maybeAutoStart=function(){
      try{ if(!localStorage.getItem('studyhive-onboarded-v1')) return; if(localStorage.getItem('studyhive-tour-seen-v1')) return; }catch(e){return;}
      setTimeout(function(){ window.HiveTour.start(); },650);
    };
    window.HiveTour._queenWrapped=true;
  }
  wrapHiveTour(); setTimeout(wrapHiveTour,1200);

  /* Weather: hide if unchanged, reappear and notify if changed. */
  var weatherTouched=false, lastWeather=storageGet('studyhive-weather-signature-v1')||'';
  function weatherSignature(){ return (($('weatherTemp')&&$('weatherTemp').textContent)||'')+'|'+(($('weatherDesc')&&$('weatherDesc').textContent)||''); }
  function hideWeatherIfQuiet(){ var w=$('weatherWidget'); if(!w || weatherTouched) return; w.classList.add('weather-auto-hidden'); }
  function revealWeather(change){ var w=$('weatherWidget'); if(!w) return; w.classList.remove('weather-auto-hidden'); if(change){ w.classList.add('weather-changed'); setTimeout(function(){w.classList.remove('weather-changed');},5200); } }
  var w=$('weatherWidget'); if(w){ ['pointerdown','mouseenter','focusin'].forEach(function(ev){ w.addEventListener(ev,function(){ weatherTouched=true; revealWeather(false); }); }); setTimeout(hideWeatherIfQuiet,18000); }
  setInterval(function(){
    var sig=weatherSignature(); if(!sig || sig.indexOf('--')===0 || sig.indexOf('Loading')>=0) return;
    if(lastWeather && sig!==lastWeather){ revealWeather(true); var msg='Weather changed: '+sig.replace('|',' · '); toast(msg); if(window.maybeNotify) window.maybeNotify(msg); else if('Notification' in window && Notification.permission==='granted') try{new Notification('Study Hive Weather',{body:msg});}catch(e){} setTimeout(function(){ if(!weatherTouched) hideWeatherIfQuiet(); },45000); }
    lastWeather=sig; storageSet('studyhive-weather-signature-v1',sig);
  },7000);
})();
