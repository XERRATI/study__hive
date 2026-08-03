/* =====================================================================
   Study Hive — 17-queen-secrets-events.js
   Extracted from the original single-file build (script block #15).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k,f){ try{ var r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch(e){return f;} }
  function setJSON(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} }
  function set(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }
  var ADMIN_CODE='QUEEN-ADMIN-2026';
  // Admin code intentionally not exposed on window.

  /* Admin Mode */
  function openAdmin(){
    if(!$('adminPanel')){
      document.body.insertAdjacentHTML('beforeend','<div class="admin-panel" id="adminPanel"><h2 style="font-family:Baloo 2;margin:0 0 6px;">🛠️ Study Hive Admin Mode</h2><p style="font-size:13px;line-height:1.4;margin-top:0;">Safe private testing controls. Enter the private code when prompted.</p><div class="admin-grid"><button id="adminQueen">Trigger Queen 10m</button><button id="adminSergeant">Test Sergeant</button><button id="adminAdd25">Add 25 test minutes</button><button id="adminGarden">Open Garden World</button><button id="adminTourShort">Queen short choice</button><button id="adminTourLong">Queen long guide</button><button id="adminWeather">Fake weather change</button><button id="adminMusic">Test sound ping</button><button id="adminBeeBoth">Bee style: both</button><button id="adminBeeNew">Bee style: new</button><button id="adminMobileOff">Force desktop repair</button><button id="adminDiagnostics">Diagnostics</button><button id="adminProgress">📈 Progression</button><button id="adminRunTests">🧪 Run all tests</button><button id="adminHeart">💖 Test quote heart</button><button id="adminXP">🍯 Add 100 XP</button><button id="adminAch">🏆 Unlock all achievements</button><button id="adminSession">🎯 Simulate session done</button><button id="adminToast">📣 Test toast</button><button id="adminNight">🌙 Night preview</button><button id="adminZen">🧘 Zen toggle</button><button id="adminGrind">🧱 Grind toggle</button><button id="adminSleep">🛌 Sleep toggle</button><button id="adminShoot">☄️ Shooting star</button><button id="adminPlanet">🪐 Planet event</button><button id="adminWasp">🐝 Summon wasp</button><button id="adminWaspOff">🕊️ Dismiss wasp</button><button id="adminBeeGallery">🐝 Bee gallery</button><button id="adminSgtV2">🫡 Sergeant v2 toggle</button><button id="adminBeeOld">Bee style: old</button><button id="adminBeeOff">🚫 Bees off</button><button id="adminMotion">♿ Reduce motion</button><button id="adminContrast">♿ High contrast</button><button id="adminLargeText">♿ Large text</button><button id="adminStorage">📦 Storage size</button><button class="secondary" id="adminFirstLaunch">🆕 Simulate first launch</button><button class="secondary" id="adminReset">🗑️ Factory reset</button><button class="secondary" id="adminClearLog">🧹 Clear error log</button><button class="secondary" id="adminCopyState">Copy app state</button><button class="secondary" id="adminClose">Close</button></div><div class="admin-output" id="adminOut">Ready.</div></div>');
      $('adminClose').onclick=function(){ $('adminPanel').classList.remove('show'); };
      $('adminQueen').onclick=function(){ set('studyhive-queen-until-v1', String(Date.now()+10*60*1000)); var q=$('queenVisit'); if(q) q.classList.add('show'); toast('Queen triggered for 10 minutes'); };
      $('adminSergeant').onclick=function(){ if(typeof showSergeantNag==='function') showSergeantNag('Admin test complete. Sergeant systems operational, recruit.', false); };
      $('adminAdd25').onclick=function(){ var sd=getJSON('study-data-v2',{subjects:{},totalMinutes:0,dailyLog:{},sessionsTotal:0}); sd.subjects=sd.subjects||{}; sd.subjects['Admin Test']=(sd.subjects['Admin Test']||0)+25; sd.totalMinutes=(sd.totalMinutes||0)+25; sd.sessionsTotal=(sd.sessionsTotal||0)+1; var d=new Date(), key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); sd.dailyLog=sd.dailyLog||{}; sd.dailyLog[key]=(sd.dailyLog[key]||0)+25; setJSON('study-data-v2',sd); $('adminOut').textContent='Added 25 Admin Test minutes. Refresh if a panel does not update instantly.'; };
      $('adminGarden').onclick=function(){ var b=$('enterGardenWorldBtn'); if(b) b.click(); else if($('gardenBtn')) $('gardenBtn').click(); };
      $('adminTourShort').onclick=function(){ var c=$('queenTourChoice'); if(c)c.classList.add('show'); };
      $('adminTourLong').onclick=function(){ if(window.showQueenStoryGuide) window.showQueenStoryGuide(); };
      $('adminWeather').onclick=function(){ var w=$('weatherWidget'); if(w){ w.classList.remove('weather-auto-hidden'); w.classList.add('weather-changed'); setTimeout(function(){w.classList.remove('weather-changed');},5000); } toast('Fake weather change pulse'); };
      $('adminMusic').onclick=function(){ try{ var c=new (window.AudioContext||window.webkitAudioContext)(), o=c.createOscillator(), g=c.createGain(); o.type='triangle'; o.frequency.value=660; g.gain.value=.05; o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime+.18); }catch(e){} };
      $('adminBeeBoth').onclick=function(){ set('studyhive-bee-style-v1','both'); document.body.classList.remove('bee-style-new','bee-style-old','bee-style-off'); document.body.classList.add('bee-style-both'); toast('Bee style: both'); };
      $('adminBeeNew').onclick=function(){ set('studyhive-bee-style-v1','new'); document.body.classList.remove('bee-style-both','bee-style-old','bee-style-off'); document.body.classList.add('bee-style-new'); toast('Bee style: new'); };
      $('adminMobileOff').onclick=function(){ set('studyhive-force-mobile-v1','0'); document.body.classList.remove('force-mobile','is-mobile'); toast('Mobile force off; use Repair layout if needed'); };
      $('adminDiagnostics').onclick=function(){ var checks=['Diagnostics OK','Protocol: '+location.protocol,'localStorage: '+(function(){try{localStorage.setItem('_a','1');localStorage.removeItem('_a');return 'OK';}catch(e){return 'blocked';}})(),'Audio: '+(('AudioContext'in window||'webkitAudioContext'in window)?'OK':'missing'),'Notification: '+(('Notification'in window)?Notification.permission:'unsupported'),'Puter AI: '+(window.puter&&window.puter.ai?'loaded':'not loaded')]; $('adminOut').textContent=checks.join('\n'); };
      $('adminCopyState').onclick=function(){ var keys=Object.keys(localStorage).filter(function(k){return /hive|study|goal|queen|admin|vocab|flash|todo/i.test(k);}); var out={}; keys.forEach(function(k){out[k]=localStorage.getItem(k);}); var txt=JSON.stringify(out,null,2); $('adminOut').textContent=txt; if(navigator.clipboard) navigator.clipboard.writeText(txt); };

      /* ---------------- ADMIN: Progression report ---------------- */
      $('adminProgress').onclick=function(){
        var sd=getJSON('study-data-v2',{subjects:{},totalMinutes:0,dailyLog:{},sessionsTotal:0,currentStreak:0,bestStreak:0});
        var xpData=(function(){ try{ return JSON.parse(localStorage.getItem('hive-xp-v1')||'{}'); }catch(e){ return {}; } })();
        var xp=typeof xpData.xp==='number'?xpData.xp:0;
        var unlocked=Array.isArray(xpData.unlocked)?xpData.unlocked:[];
        var LEVELS=[{name:'Egg',icon:'🥚',min:0},{name:'Larva',icon:'🐛',min:100},{name:'Worker',icon:'🐝',min:300},{name:'Drone',icon:'🐝',min:700},{name:'Guard',icon:'🛡️',min:1300},{name:'Queen Bee',icon:'👑',min:2200}];
        var idx=0; for(var i=0;i<LEVELS.length;i++){ if(xp>=LEVELS[i].min) idx=i; }
        var lvl=LEVELS[idx], next=LEVELS[idx+1];
        var pct=next?Math.min(100,Math.round((xp-lvl.min)/(next.min-lvl.min)*100)):100;
        var d=new Date(), todayKey=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
        var todayMin=(sd.dailyLog&&sd.dailyLog[todayKey])||0;
        var subs=sd.subjects||{};
        var subLines=Object.keys(subs).sort(function(a,b){return subs[b]-subs[a];}).slice(0,8)
          .map(function(k){ return '    • '+k+' — '+Math.round(subs[k]/60)+' min'; });
        if(!subLines.length) subLines.push('    (no subjects yet)');
        var lines=[];
        lines.push('📈 PROGRESSION REPORT');
        lines.push('────────────────────────');
        lines.push(lvl.icon+' Level: '+lvl.name+' ('+xp+' XP)'+(next?' · '+pct+'% to '+next.name:' · MAX'));
        lines.push('🏆 Achievements unlocked: '+unlocked.length);
        lines.push('⏱ Sessions: '+sd.sessionsTotal+' · Total time: '+Math.round((sd.totalMinutes||0)/60)+' h '+(sd.totalMinutes||0)%60+' min');
        lines.push('🔥 Streak: '+(sd.currentStreak||0)+' day'+(sd.currentStreak===1?'':'s')+' · Best: '+(sd.bestStreak||0));
        lines.push('🍯 Today: '+todayMin+' min');
        lines.push('🐝 Bees working: '+(document.querySelectorAll('.hive-bee-el').length)+' new · '+(document.querySelectorAll('.bee-wrap:not(.balance-hidden)').length)+' old');
        lines.push('📚 Subjects (by minutes):');
        lines=lines.concat(subLines);
        lines.push('');
        lines.push('Daily goal: '+(localStorage.getItem('studyhive-daily-goal-v1')||localStorage.getItem('daily-goal-v1')||'60')+' min/day');
        lines.push('Coach vibe: '+(localStorage.getItem('studyhive-coach-vibe-v1')||'balanced'));
        lines.push('Pledge saved: '+((localStorage.getItem('studyhive-pledge-v1')||'').trim()?'yes':'no'));
        $('adminOut').textContent=lines.join('\n');
      };

      /* ---------------- ADMIN: Run all tests ---------------- */
      $('adminRunTests').onclick=function(){
        function ok(name,pass,extra){ return (pass?'✅':'❌')+' '+name+(extra?' — '+extra:''); }
        var out=[];
        out.push('🧪 FULL APP TEST RUN — '+(new Date().toLocaleTimeString()));
        out.push('────────────────────────');
        var scripts=Array.prototype.slice.call(document.scripts).filter(function(s){return s.src&&s.src.indexOf('/js/')>-1;});
        out.push(ok('Scripts loaded', scripts.length===57, scripts.length+' of 57'));
        var cssLoaded=Array.prototype.slice.call(document.styleSheets).some(function(sh){return sh.href&&sh.href.indexOf('styles.css')>-1;});
        out.push(ok('Stylesheet loaded', cssLoaded));
        var ls='blocked'; try{ localStorage.setItem('__t','1'); localStorage.removeItem('__t'); ls='ok'; }catch(e){}
        out.push(ok('localStorage', ls==='ok', ls));
        out.push(ok('Welcome screen', !!document.getElementById('welcomeScreen')));
        out.push(ok('Hive button', !!document.getElementById('hiveWrap')));
        out.push(ok('Motivation bubble', !!document.getElementById('motivationBubble')));
        var days=document.getElementById('days');
        out.push(ok('Countdown ticking', !!days && /^\d+$/.test(days.textContent||''), days?days.textContent:'missing'));
        out.push(ok('Google font ready', !!(document.fonts&&document.fonts.check('12px Fredoka')), document.fonts&&document.fonts.check('12px Fredoka')?'yes':'no'));
        out.push(ok('Web Audio API', !!(window.AudioContext||window.webkitAudioContext)));
        out.push(ok('Manifest link', !!document.querySelector('link[rel="manifest"]')));
        out.push(ok('XP bar', !!document.getElementById('xpBarFill')&&!!document.getElementById('levelBadge')));
        out.push(ok('Sergeant', !!document.getElementById('sergeantPersistent')));
        out.push(ok('Focus panel', !!document.getElementById('focusPanel')));
        out.push(ok('Grades panel', !!document.getElementById('gradePanel')));
        out.push(ok('Settings panel', !!document.getElementById('settingsPanel')));
        out.push(ok('Tasks panel', !!document.getElementById('todoPanel')));
        out.push(ok('Water tracker', !!document.getElementById('waterPanel')));
        out.push(ok('Flashcards', !!document.querySelector('[data-hive-action="flashcards"],#flashcardPanel,#cardsPanel')));
        out.push(ok('Garden', !!document.getElementById('gardenBtn')));
        out.push(ok('Ambient sound buttons', document.querySelectorAll('#ambientSoundBtns .focus-preset-btn').length===4, document.querySelectorAll('#ambientSoundBtns .focus-preset-btn').length+' buttons'));
        out.push(ok('Quote rotator', (document.getElementById('quoteText')||{}).textContent!=='Loading...'));
        var errLog=(function(){ try{ return JSON.parse(localStorage.getItem('studyhive-error-log-v1')||'[]'); }catch(e){ return []; }})();
        out.push(ok('Error log', errLog.length===0, errLog.length+' logged errors'));
        $('adminOut').textContent=out.join('\n');
      };

      /* ---------------- ADMIN: Clear the stored error log ---------------- */
      $('adminClearLog').onclick=function(){
        try{ localStorage.removeItem('studyhive-error-log-v1'); }catch(e){}
        toast('🧹 Error log cleared');
        $('adminOut').textContent='Error log cleared.';
      };

      /* ---------------- ADMIN: Quote heart test ---------------- */
      $('adminHeart').onclick=function(){
        try{
          if(typeof window.toggleQuoteFav==='function'){ window.toggleQuoteFav(); }
          else { var b=$('quoteFavBtn'); if(b) b.click(); else $('adminOut').textContent='Quote panel not found.'; }
        }catch(e){ $('adminOut').textContent='Heart test error: '+e.message; }
      };
      /* ---------------- ADMIN: Add 100 XP (level-up test) ---------------- */
      $('adminXP').onclick=function(){
        var d={}; try{ d=JSON.parse(localStorage.getItem('hive-xp-v1')||'{}'); }catch(e){}
        d.xp=(typeof d.xp==='number'?d.xp:0)+100;
        try{ localStorage.setItem('hive-xp-v1', JSON.stringify(d)); }catch(e){}
        $('adminOut').textContent='Added 100 XP (total '+d.xp+'). Refresh to see the level change.';
      };
      /* ---------------- ADMIN: Unlock all achievements ---------------- */
      $('adminAch').onclick=function(){
        var ids=['first_blood','century_club','half_hive','night_owl','early_bird','sergeants_favorite','iron_streak','hive_complete','marathon_bee','quarter_century','mood_ring','task_master','clean_slate','quote_collector','grade_planner','worker_bee','guard_duty','queens_court','weekend_warrior','buzz_beginner','hydro_hero','zen_bee','pomodoro_pro','wordsmith','planner_pro','note_taker','backup_buddy','habit_hero'];
        var d={}; try{ d=JSON.parse(localStorage.getItem('hive-xp-v1')||'{}'); }catch(e){}
        d.unlocked=ids; d.xp=Math.max(typeof d.xp==='number'?d.xp:0, 999);
        try{ localStorage.setItem('hive-xp-v1', JSON.stringify(d)); }catch(e){}
        $('adminOut').textContent='Unlocked all '+ids.length+' achievements (+999 XP). Refresh to see them in Awards.';
      };
      /* ---------------- ADMIN: Simulate a finished session ---------------- */
      $('adminSession').onclick=function(){
        var sd=getJSON('study-data-v2',{subjects:{},totalMinutes:0,dailyLog:{},sessionsTotal:0});
        sd.subjects=sd.subjects||{}; sd.subjects['Admin Test']=(sd.subjects['Admin Test']||0)+25;
        sd.totalMinutes=(sd.totalMinutes||0)+25; sd.sessionsTotal=(sd.sessionsTotal||0)+1;
        var d=new Date(), key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
        sd.dailyLog=sd.dailyLog||{}; sd.dailyLog[key]=(sd.dailyLog[key]||0)+25;
        setJSON('study-data-v2',sd);
        if(typeof window.showBuddyBee==='function'){ try{ window.showBuddyBee(); }catch(e){} }
        toast('🎯 Simulated a finished 25-min session');
        $('adminOut').textContent='Added a 25-minute session (Admin Test). Refresh if panels do not update instantly.';
      };
      /* ---------------- ADMIN: Toast test ---------------- */
      $('adminToast').onclick=function(){ toast('📣 Test toast — the hive is talking to you!'); };
      /* ---------------- ADMIN: Theme / mode toggles ---------------- */
      $('adminNight').onclick=function(){ var b=$('previewNightBtn'); if(b){ b.click(); toast('🌙 Night preview toggled'); } else { document.body.classList.toggle('night-mode'); toast('🌙 Night toggled (preview only)'); } };
      $('adminZen').onclick=function(){ var b=$('zenModeBtn'); if(b){ b.click(); toast('🧘 Zen toggled'); } else { document.body.classList.toggle('zen-mode'); toast('🧘 Zen toggled'); } };
      $('adminGrind').onclick=function(){ var b=$('grindModeBtn'); if(b){ b.click(); toast('🧱 Grind toggled'); } else { document.body.classList.toggle('grind-mode'); toast('🧱 Grind toggled'); } };
      $('adminSleep').onclick=function(){ document.body.classList.toggle('sleep-mode'); toast('🛌 Sleep mode toggled (this session only)'); };
      $('adminShoot').onclick=function(){ document.body.classList.add('night-mode'); if(window.__nightSkyShoot){ window.__nightSkyShoot(); toast('☄️ Shooting star launched'); } else { toast('Night sky not loaded'); } };
      $('adminPlanet').onclick=function(){ document.body.classList.add('night-mode'); if(window.__nightSkyPlanet){ window.__nightSkyPlanet(); toast('🪐 Planet event launched'); } else { toast('Night sky not loaded'); } };

      /* ---------------- ADMIN: Wasp controls ---------------- */
      $('adminWasp').onclick=function(){
        if(window.__waspSummon){ window.__waspSummon(); toast('🐝 Wasp summoned — it will sting every ~55s'); }
        else { toast('Wasp module not loaded'); }
      };
      $('adminWaspOff').onclick=function(){
        if(window.__waspDismiss){ window.__waspDismiss(); toast('🕊️ Wasp dismissed — study clock reset'); }
        else { toast('Wasp module not loaded'); }
      };

      /* ---------------- ADMIN: Bee gallery ---------------- */
      $('adminBeeGallery').onclick=function(){
        var sd=getJSON('study-data-v2',{totalMinutes:0});
        var mins=Math.round(Number(sd.totalMinutes||0));
        var MODELS=[
          ['🌱','Seedling',60],['🎓','Scholar',240],['🏅','Athlete',500],['⚗️','Chemist',720],
          ['🎵','Musician',900],['🔬','Scientist',1100],['🧭','Explorer',1300],['✨','Golden',1500],
          ['🚀','Astronaut',2000],['👑','Royal',3000]
        ];
        var lines=['🐝 BEE GALLERY — models unlock by TOTAL study minutes','────────────────────────','Current total: '+mins+' min',''];
        MODELS.forEach(function(m){
          var on=mins>=m[2];
          lines.push((on?'✅ ':'🔒 ')+m[0]+' '+m[1]+' — '+m[2]+' min'+(on?' (unlocked)':' ('+(m[2]-mins)+' min to go)'));
        });
        lines.push('');
        lines.push('Types: Worker (default) · Drone · Guard · Queen (rare visit)');
        lines.push('Alive now: '+document.querySelectorAll('.hive-bee-el').length+' new · '+document.querySelectorAll('.bee-wrap').length+' old');
        lines.push('Wasp: '+(window.waspActive&&window.waspActive()?'PRESENT ⚠️':'not here'));
        $('adminOut').textContent=lines.join('\n');
      };

      /* ---------------- ADMIN: Sergeant v2 toggle ---------------- */
      $('adminSgtV2').onclick=function(){
        var on=localStorage.getItem('studyhive-sergeant-v2-v1')==='1';
        localStorage.setItem('studyhive-sergeant-v2-v1', on?'0':'1');
        document.body.classList.toggle('sergeant-v2', !on);
        try{ var apply=document.querySelector('.settings-toggle#sergeantV2Toggle'); if(apply) apply.classList.toggle('on', !on); }catch(e){}
        toast('🫡 Squad Leader Sergeant '+(on?'OFF':'ON'));
        setTimeout(function(){ location.reload(); }, 800);
      };
      /* ---------------- ADMIN: Bee styles (complete the set) ---------------- */
      $('adminBeeOld').onclick=function(){ set('studyhive-bee-style-v1','old'); document.body.classList.remove('bee-style-new','bee-style-both','bee-style-off'); document.body.classList.add('bee-style-old'); toast('Bee style: old'); };
      $('adminBeeOff').onclick=function(){ set('studyhive-bee-style-v1','off'); document.body.classList.remove('bee-style-new','bee-style-both','bee-style-old'); document.body.classList.add('bee-style-off'); toast('Bees hidden'); };
      /* ---------------- ADMIN: Accessibility toggles ---------------- */
      $('adminMotion').onclick=function(){ var on=localStorage.getItem('studyhive-reduce-motion-v1')!=='1'; localStorage.setItem('studyhive-reduce-motion-v1', on?'1':'0'); document.body.classList.toggle('reduce-motion-mode', on); toast('♿ Reduce motion '+(on?'ON':'off')); };
      $('adminContrast').onclick=function(){ var on=localStorage.getItem('studyhive-high-contrast-v1')!=='1'; localStorage.setItem('studyhive-high-contrast-v1', on?'1':'0'); document.body.classList.toggle('high-contrast-mode', on); toast('♿ High contrast '+(on?'ON':'off')); };
      $('adminLargeText').onclick=function(){ var on=localStorage.getItem('studyhive-large-text-v1')!=='1'; localStorage.setItem('studyhive-large-text-v1', on?'1':'0'); document.body.classList.toggle('large-text-mode', on); toast('♿ Large text '+(on?'ON':'off')); };
      /* ---------------- ADMIN: Storage size report ---------------- */
      $('adminStorage').onclick=function(){
        var keys=[], total=0;
        for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(k && /hive|study|goal|clicker|daily|challenge|sergeant|pollen|secret|god|queen|dock|bee|note|water|vocab|exam|todo|habit|flash|grade|mood/i.test(k)){ keys.push(k); total+=(localStorage.getItem(k)||'').length; } }
        $('adminOut').textContent='📦 '+keys.length+' app keys · ~'+Math.round(total/1024)+' KB used\n\n'+keys.slice(0,40).join('\n');
      };
      /* ---------------- ADMIN: Simulate first launch (two-click confirm) ---------------- */
      var adminLaunchArmed=false;
      $('adminFirstLaunch').onclick=function(){
        if(!adminLaunchArmed){ adminLaunchArmed=true; $('adminFirstLaunch').textContent='⚠️ Sure? Click again to reset onboarding'; setTimeout(function(){ adminLaunchArmed=false; $('adminFirstLaunch').textContent='🆕 Simulate first launch'; },4000); return; }
        try{ localStorage.removeItem('studyhive-onboarded-v1'); localStorage.removeItem('studyhive-tour-seen-v1'); }catch(e){}
        toast('🆕 First launch simulated');
        $('adminOut').textContent='Onboarding reset. Reloading…';
        setTimeout(function(){ location.reload(); },800);
      };
      /* ---------------- ADMIN: Factory reset (two-click confirm) ---------------- */
      var adminResetArmed=false;
      $('adminReset').onclick=function(){
        if(!adminResetArmed){ adminResetArmed=true; $('adminReset').textContent='⚠️ Sure? Click again to wipe ALL app data'; setTimeout(function(){ adminResetArmed=false; $('adminReset').textContent='🗑️ Factory reset'; },4000); return; }
        var re=/hive|study|goal|milestone|clicker|daily|challenge|night|sergeant|pollen|secret|god|upg|queen|dock|bee|note|water|vocab|exam|todo|habit|flash|grade|mood/i;
        var n=0; for(var i=localStorage.length-1;i>=0;i--){ var k=localStorage.key(i); if(k && re.test(k)){ localStorage.removeItem(k); n++; } }
        toast('🗑️ Factory reset — '+n+' keys cleared');
        $('adminOut').textContent='Cleared '+n+' keys. Reloading…';
        setTimeout(function(){ location.reload(); },800);
      };
    }
    $('adminPanel').classList.add('show');
  }
  /* ADMIN ACCESS FIX: prompt() is unreliable on phones and in-app browsers
     (it can return undefined or never show), and Ctrl+Shift+A needs a
     keyboard. Now the code is entered in a small in-app modal, and there are
     three ways to open it: Ctrl/Cmd+Shift+A, the 🛠️ Admin button in
     Settings, or tapping "Hive Progress" 5 times quickly. */
  function ensureAdminLock(){
    if (document.getElementById('adminLockVeil')) return;
    var veil=document.createElement('div'); veil.className='admin-lock-veil'; veil.id='adminLockVeil';
    veil.innerHTML='<div class="admin-lock-card"><h3>🛠️ Admin Mode</h3><p>Enter the admin code to open the testing controls.</p><input type="password" class="admin-lock-input" id="adminLockInput" placeholder="Admin code" autocomplete="off"><div class="admin-lock-row"><button id="adminLockOk">Enter</button><button class="secondary" id="adminLockCancel">Cancel</button></div></div>';
    document.body.appendChild(veil);
    var input=document.getElementById('adminLockInput'), ok=document.getElementById('adminLockOk'), cancel=document.getElementById('adminLockCancel');
    function tryOpen(){
      var code=(input.value||'').trim();
      if(code===ADMIN_CODE || code==='propolis'){ veil.classList.remove('show'); input.value=''; openAdmin(); }
      else { veil.classList.remove('show'); input.value=''; toast('Wrong admin code.'); }
    }
    ok.onclick=tryOpen;
    cancel.onclick=function(){ veil.classList.remove('show'); input.value=''; };
    veil.addEventListener('click', function(e){ if(e.target===veil){ veil.classList.remove('show'); input.value=''; } });
    input.addEventListener('keydown', function(e){ if(e.key==='Enter') tryOpen(); });
  }
  function askAdmin(){ ensureAdminLock(); document.getElementById('adminLockVeil').classList.add('show'); setTimeout(function(){ var i=document.getElementById('adminLockInput'); if(i) i.focus(); }, 60); }
  window.askAdmin = askAdmin;
  document.addEventListener('keydown',function(e){ if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='a'){ e.preventDefault(); askAdmin(); } });

  /* Tap "Hive Progress" 5x quickly — mobile-friendly admin entry. */
  (function(){
    var taps=[], label=null;
    function wire(){
      label=document.querySelector('.hive-progress-label');
      if(!label || label.dataset.adminTaps==='1') return;
      label.dataset.adminTaps='1';
      label.style.cursor='pointer';
      label.addEventListener('click', function(){
        taps.push(Date.now());
        taps=taps.filter(function(t){ return Date.now()-t<1800; });
        if(taps.length>=5){ taps=[]; askAdmin(); }
      });
    }
    wire(); setInterval(wire, 3000);
  })();
  document.addEventListener('click',function(e){ if(e.target&&e.target.dataset&&e.target.dataset.hiveAction==='admin'){ e.preventDefault(); askAdmin(); } },true);
  function addAdminToHive(){
    var panel=$('hiveMenuPanel'); if(panel && !panel.querySelector('[data-hive-action="admin"]')) panel.insertAdjacentHTML('beforeend','<button data-hive-action="admin">🛠️ Admin Mode</button>');
    var settings=$('settingsPanel');
    if(settings && !document.getElementById('settingsAdminBtn')){
      var row=document.createElement('button'); row.id='settingsAdminBtn'; row.className='settings-action-btn'; row.style.cssText='width:100%;margin-top:8px;';
      row.textContent='🛠️ Admin Mode';
      row.onclick=function(){ askAdmin(); };
      settings.appendChild(row);
    }
  }
  addAdminToHive(); setInterval(addAdminToHive,5000);

  /* Massive contextual Sergeant bank (100+ lines) */
  var BANK={
    focus:[
      'Focus is the front gate. Once you enter, no wandering.','Pick the subject you least want to touch. That is usually the one we need.','A timer is a contract. Do not sign it lightly.','Start ugly. Perfect starts are a myth.','Focus mode rewards stillness, not drama.','If your hand reaches for the phone, the bees will file a report.','Choose 15 minutes if you feel weak. Choose 45 if you feel ready.','One focused block beats three hours of pretending.','Your job is not to feel motivated. Your job is to begin.','The first two minutes are the ambush. Survive them.','You opened Focus. Now make it count.','The hive likes measurable effort. Timers are measurable.','Stop circling the work. Land on it.','If you can worry for 25 minutes, you can study for 25 minutes.','Focus is a muscle. We train it by using it.','No heroic plan. Just one clean session.','A recruit with a timer is more dangerous than a genius with excuses.','Lock in. The bees are watching the clock.','Choose a subject and give it honest attention.','A small session done now is better than a perfect session imagined later.'
    ],
    cards:[
      'Flashcards expose the truth. That is why they work.','If you miss a card, celebrate: we found the weak cell.','Active recall is the queen of memory.','Do not just flip. Predict first.','A hard card is a gift wearing a mean face.','Shuffle the deck. Comfort order lies to you.','If the back surprises you, mark it for review.','Rereading feels smooth. Recall makes you stronger.','One honest card beats a page of sleepy highlighting.','Say the answer out loud. Make your brain work.','Cards are tiny exams with no consequences. Use them.','If you know it, prove it before you peek.','Missed cards belong at the front of tomorrow.','The deck is not judging you. I am, but constructively.','Turn notes into questions. Questions become marks.','A card without review is just decoration.','Do the ugly cards first.','Mastery is built one flip at a time.','Your confidence should come from recall, not vibes.','The hive respects retrieval practice.'
    ],
    notes:[
      'Notes open. Capture the thought before it escapes.','Messy notes now beat forgotten genius later.','Write the formula and one example. Always one example.','Do not transcribe blindly. Translate into your own words.','If a note cannot help future-you, rewrite it.','Your notes should be a map, not a swamp.','Short bullets. Clear headings. No fog.','Add the mistake you made, not just the correct answer.','A good note answers: what, why, example.','Do not decorate notes to avoid studying.','Notes are tools. Keep them sharp.','Summarise the page in three lines.','If it matters, write it. If it does not, cut it.','Future-you deserves readable notes.','A note with a question is better than a note with a paragraph.','Use the notes panel for sparks, not novels.','Every formula needs units. Sergeant law.','If you copy it, explain it.','Your notes should make revision faster tomorrow.','Write the confusion too. That is the target.'
    ],
    garden:[
      'Garden duty proves effort becomes visible.','Every flower is a receipt for focus.','Water the garden, then water yourself.','The garden does not grow from intentions. It grows from minutes.','Plant an intention seed if tomorrow needs direction.','A dead patch means a missed habit, not a failed student.','Your study minutes have roots now.','Bloom by bloom, the hive becomes undeniable.','Journal the lesson while it is fresh.','The garden is pretty, but it is also evidence.','A flower cannot fake study time.','If the field looks empty, start with ten minutes.','The bees prefer consistent gardeners.','Your future results are seedlings today.','Water the work. Pull the weeds. Continue.','Every subject can grow here.','The garden rewards showing up quietly.','Do not compare gardens. Grow yours.','A small bloom is still a bloom.','The Queen approves of cultivated effort.'
    ],
    music:[
      'Music is a tool, not the mission. Keep it low.','If the beat steals your attention, turn it off.','Calm sound, sharp mind.','Background music should disappear behind the work.','No lyrics if lyrics hijack your brain.','Use music to begin, not to avoid beginning.','A quiet hive works best.','If the sound feels robotic, switch tracks.','The best study music is boring in the right way.','Volume down. Effort up.','Music may carry you to the desk. Discipline keeps you there.','Test the track, then stop fiddling.','Your ears are not the ones taking the exam. Your brain is.','Rain is good. Excuses are not.','Choose one track and commit.','A soundtrack is not a study plan.','Let the ambience serve the session.','If you keep changing music, you are not studying.','Soft music, hard work.','The hive hum is optional. The work is not.'
    ],
    settings:[
      'Settings are maintenance, not procrastination.','Tune the hive, then return to the mission.','A good system reduces the need for willpower.','Do not spend twenty minutes choosing a theme.','Backups are boring until they save you.','If the layout breaks, repair it and move on.','Choose calm if strict makes you freeze.','Choose strict if calm makes you drift.','Settings should fit your brain, not impress anyone.','One adjustment, then study.','The best setting is the one you will actually use.','Export data before you experiment wildly.','Make the tool lighter when your mind is heavy.','Mobile layout is for comfort, not hiding from work.','A clean interface is a clean runway.','Do not reset progress unless you mean it.','Subjects belong here. Add the real ones.','Your daily goal should challenge, not crush.','Systems first, panic last.','Good settings make future-you grateful.'
    ],
    coach:[
      'Hive Coach finds the weak topic you are avoiding.','Add the scary topic. That is the target.','Rate mastery honestly or the plan lies.','Weak topics are not shame. They are coordinates.','Quiz before you feel ready.','Review logs turn effort into intelligence.','The coach cannot help what you refuse to enter.','A low mastery score is a starting line.','Prioritise what costs marks.','Use the plan, then update it with reality.','The coach is not magic. It is honest tracking.','Do not make every topic critical. That means none are.','Your next best move is usually smaller than you think.','Topics with no minutes are calling your name.','Practice, mark, reflect. That is the loop.','The coach shows the battlefield. You still march.','A review log after study doubles the lesson.','Weakness named is weakness cornered.','Let data boss your panic around.','The hive coach likes truth.'
    ],
    weather:[
      'Weather changed. The mission did not.','Rainy day? Perfect for staying in and studying.','Hot day? Hydrate before focus.','Cold day? Warm up with a ten-minute review.','Storm outside, calm inside.','Weather is context, not an excuse.','If the temperature drops, keep your standards up.','The sky may change. Your timer remains.','Use gloomy weather for deep work.','Sunshine after study feels better. Earn it.'],
    default:[
      'Every click needs a reason.','Was that useful, recruit?','If this is avoidance, I can smell it.','Move with purpose.','The hive records effort, not intentions.','Do the thing you opened this app to do.','Your cursor is wandering. Bring it home.','Decision fatigue is real. Pick one.','Tiny action now. Big relief later.','Stop polishing the plan. Start the work.','The bees prefer motion.','Progress is not hidden in another menu.','If you are lost, go to Focus.','If you are anxious, breathe, then Focus.','If you are behind, start smaller.','No shame. Just action.','The app is a tool. You are the engine.','Make the next click count.','Do not confuse motion with progress.','Return to the mission.'
    ]
  };
  function keyFor(el){ var id=(el&&el.id||'').toLowerCase(), txt=(el&&el.textContent||'').toLowerCase(); if(id.includes('focus')||txt.includes('focus')) return 'focus'; if(id.includes('card')||txt.includes('card')||txt.includes('flash')) return 'cards'; if(id.includes('notes')||txt.includes('notes')) return 'notes'; if(id.includes('garden')||txt.includes('garden')) return 'garden'; if(id.includes('music')||txt.includes('music')||txt.includes('background')) return 'music'; if(id.includes('setting')||txt.includes('setting')) return 'settings'; if(id.includes('coach')||txt.includes('coach')) return 'coach'; if(id.includes('weather')) return 'weather'; return 'default'; }
  var lastSarge=0;
  /* LONGER SERGEANT LINES (new voice): longer, more encouraging sentences.
     One in three times the Sergeant speaks, he uses these instead of the
     short drill lines — same honesty, more heart. */
  var SERGEANT_LONG = [
    'Listen up, recruit. You showed up today, and showing up is the first battle of every session. The rest is just repetition, and repetition is your friend.',
    'I have seen a lot of study plans die of enthusiasm. Yours will not, because you do not need enthusiasm — you need a timer, a subject, and ten honest minutes. Go.',
    'You do not have to be the smartest bee in the hive. You have to be the most consistent one. Consistency outlasts talent every single time.',
    'Right now there is exactly one thing you should be doing. The fact that you are reading this means you are avoiding it. Close this tab and do that one thing for five minutes.',
    'A weak start still moves you forward. Ten minutes of ugly, messy, half-focused work beats an hour of planning how to work. Start ugly.',
    'You have finished every hard day you have ever had so far. That is a perfect record. Today is not the day you break it.',
    'The Queen does not ask for perfect sessions. She asks for returned sessions. Sit down, log the time, come back tomorrow. That is the whole system.',
    'Motivation is a weather report. Discipline is the hive. You built this hive with real minutes, and it does not care how you felt getting here.',
    'Do not negotiate with your own future self. Set the timer, do the block, and let future-you thank present-you. That deal never loses.',
    'Some days you will study like a champion. Other days you will drag yourself through ten minutes. Both days count exactly the same in the hive. Both.',
    'Every expert was once a beginner who refused to quit being confused. Your confusion is not a wall — it is a doorway. Keep walking through it.',
    'Rest is not quitting. Rest is rearming. But rearming means you go back to the front line after, and the front line is that open textbook. Go.',
    'You are not behind your whole life. You are exactly at the next step, and the next step is small enough to take right now. Take it.',
    'The hive remembers every hour you gave it, not the ones you planned. Planned hours are dreams. Logged hours are honey. Log some.',
    'If it were easy, everyone would be at the top of the class. You are not everyone. Prove it with one focused block tonight.'
  ];
  function sargeFor(el, hover){ if(typeof showSergeantNag!=='function') return; if(Date.now()-lastSarge<9000) return; if(Math.random()>(hover?0.16:0.42)) return; lastSarge=Date.now(); var arr=BANK[keyFor(el)]||BANK.default; var line=Math.random()<0.3?SERGEANT_LONG[Math.floor(Math.random()*SERGEANT_LONG.length)]:arr[Math.floor(Math.random()*arr.length)]; showSergeantNag(line, false); }
  document.addEventListener('click',function(e){ var el=e.target.closest&&e.target.closest('button,.misc-btn,.focus-preset-btn,.lofi-track-btn,.settings-toggle,.water-glass,.mood-btn'); if(el) sargeFor(el,false); },true);
  document.addEventListener('mouseover',function(e){ var el=e.target.closest&&e.target.closest('button,.misc-btn,.focus-preset-btn,.lofi-track-btn,.settings-toggle,#weatherWidget,.card'); if(el) sargeFor(el,true); },true);
  setInterval(function(){ if(typeof showSergeantNag!=='function') return; var msg=null; if(document.querySelector('.focus-session.active')) msg=BANK.focus[Math.floor(Math.random()*BANK.focus.length)]; else if(document.body.classList.contains('grind-mode')) msg='Grind Mode active. Clean screen, clean effort.'; else if(document.querySelector('#gardenWorld.show')) msg=BANK.garden[Math.floor(Math.random()*BANK.garden.length)]; if(msg && Date.now()-lastSarge>30000){ lastSarge=Date.now(); showSergeantNag(msg,false); } },45000);

  /* Rare bee easter egg whisper bank (100+ short whispers) */
  var WHISPERS=[
    'type honey for a sticky surprise','triple-click the hive for reflex mode','click the footer five times','the Queen loves patient students','try the Garden after a focus session','No-touch Focus makes bees angry if you tap','Hive Coach knows your weak topics','Calm Bee Outside is hidden in Music','Grind Mode makes the hive quiet','Settings has bee style choices','some shortcuts are hidden for testers','the old code is the Konami pattern','after the pattern, propolis matters','water your garden and yourself','flashcards like honest mistakes','the rival hive never sleeps','freeze tokens save streaks','your pledge can be edited','the red goal can change','queen visits are rare','notes become questions','CSV cards are powerful','weather hides until it changes','background music starts after a tap','UI sounds can be switched off','mobile layout can be forced','repair layout lives in settings','do not fear weak topics','study minutes grow flowers','the hive tracks real effort','a small session still counts','sergeant reacts to clicks','hovering can wake sergeant','the Queen can explain everything','short tour is under a minute','long tour is royal','garden journal saves thoughts','plant an intention seed','the formula bank likes clarity','spaced review beats cramming','heatmap shows your pattern','hydration is a strategy','sleep mode is not laziness','night mode is calmer now','clean interface reduces noise','old bees can return','new bees change with progress','royal bees need lots of minutes','golden bees love consistency','scholar bees love revision','chemist bees love experiments','seedling bees mean growth','pomodoro hides in Hive Controls','More Tools stays separate','Hive Studio has extra tools','SOS Calm is for overwhelm','breathing breaks are allowed','sergeant can be muted','queen guide can be replayed','admin mode is for testing only','export backups sometimes','do not reset unless sure','the hive hates doom-scrolling','one checkbox is progress','one card is progress','one minute can restart you','the hardest topic is a clue','mistakes are coordinates','review logs are gold','your future self is watching','the bees prefer honesty','focus first, polish later','turn down music if it distracts','the Queen dislikes clutter','bee facts hide in plain sight','propolis is not random','honey is not just honey','garden flowers are receipts','try drawing a motivation card','habits build quiet power','grade rescue is in Hive Studio','assignment splitter saves panic','bingo makes variety fun','accountability messages help','morning brief tells the next move','energy mode adapts the plan','break roulette protects focus','formula bank stores facts','test tools can simulate weather changes','test tools can trigger rare events','test tools can add sample progress','the app works best hosted','AI import needs http not file','notifications need permission','weather uses city or location','the hive is a system','small cells make big honeycomb','start before ready','the first five minutes lie','you can do one honest block','the Queen believes in systems','Sergeant believes in action','Buddy Bee believes in you','your notes should answer future-you','cards should be questions','weakness named is weakness cornered','the best plan is used','today only needs today','one task at a time','do the next right thing','the hive is almost perfect','you found another secret line','there are many more whispers','the bees are listening politely','buzz buzz, back to work'];
  var lastWhisper=0;
  setInterval(function(){ if(Date.now()-lastWhisper<120000 || Math.random()>0.22 || document.body.classList.contains('grind-mode')) return; var bees=Array.prototype.slice.call(document.querySelectorAll('.hive-bee-el,.bee-wrap')).filter(function(b){return b.offsetWidth||b.offsetHeight;}); if(!bees.length) return; lastWhisper=Date.now(); var b=bees[Math.floor(Math.random()*bees.length)], r=b.getBoundingClientRect(), bubble=document.createElement('div'); bubble.className='motivation-bubble show'; bubble.style.left=Math.max(8,Math.min(innerWidth-235,r.left+10))+'px'; bubble.style.top=Math.max(8,r.top-48)+'px'; bubble.style.right='auto'; bubble.style.bottom='auto'; bubble.textContent='🐝 '+WHISPERS[Math.floor(Math.random()*WHISPERS.length)]; document.body.appendChild(bubble); setTimeout(function(){bubble.classList.remove('show'); setTimeout(function(){bubble.remove();},450);},5200); },30000);
})();
