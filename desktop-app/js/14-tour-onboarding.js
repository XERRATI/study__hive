/* =====================================================================
   Study Hive — 14-tour-onboarding.js
   Extracted from the original single-file build (script block #12).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k,f){ try{ var r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch(e){ return f; } }
  function setItem(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function getItem(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
  function say(text, angry){ if(typeof showSergeantNag==='function') showSergeantNag(text, !!angry); }

  /* Position and pomodoro-in-menu */
  document.body.classList.add('pomodoro-in-hive');
  function addPomodoroToHiveMenu(){
    var panel=$('hiveMenuPanel'); if(!panel || $('hivePomoBox')) return;
    var box=document.createElement('div'); box.className='hive-pomo-box'; box.id='hivePomoBox';
    box.innerHTML='<div style="font-weight:900;font-size:12px;text-align:center;">🍅 Pomodoro</div><div class="hive-pomo-time" id="hivePomoTime">25:00</div><div class="hive-pomo-row"><button id="hivePomoStart">Start</button><button id="hivePomoReset">Reset</button></div>';
    var after=panel.querySelector('.bg-volume'); if(after) after.insertAdjacentElement('afterend', box); else panel.insertBefore(box, panel.firstChild);
    $('hivePomoStart').onclick=function(e){ e.stopPropagation(); var b=$('pomodoroStartBtn'); if(b) b.click(); };
    $('hivePomoReset').onclick=function(e){ e.stopPropagation(); var b=$('pomodoroResetBtn'); if(b) b.click(); };
  }
  function syncHivePomo(){ addPomodoroToHiveMenu(); var src=$('pomodoroTime'), dst=$('hivePomoTime'), start=$('hivePomoStart'), real=$('pomodoroStartBtn'); if(src&&dst) dst.textContent=src.textContent; if(start&&real) start.textContent=real.textContent||'Start'; }
  addPomodoroToHiveMenu(); setInterval(syncHivePomo,500);

  /* Classic Sergeant with lots of contextual lines based on what the user clicks. */
  var lastContextLine=0;
  var contextLines={
    focus:["Focus button. Good. Now choose a time and defend it.","That is the doorway to progress. Step through.","If you start the timer, I will stop yelling. Briefly."],
    pomodoro:["Pomodoro selected. Twenty-five minutes can change the whole day.","Tomato timer armed. No wandering.","Short rounds, clean effort. I approve."],
    cards:["Flashcards? Excellent. Retrieval beats rereading.","Cards turn panic into evidence. Flip them.","If you miss one, good. That is the weak spot talking."],
    notes:["Notes panel open. Write the thing before your brain drops it.","Clear notes beat heroic memory. Capture the thought.","A messy note now is better than a forgotten idea later."],
    garden:["Garden duty. Your study minutes are not abstract anymore.","Every flower is proof you showed up.","Water the garden, then water yourself."],
    music:["Music is allowed if it serves the mission, not the distraction.","Keep the sound low and the focus high.","Calm Bee Outside is approved for deep work."],
    settings:["Settings are for sharpening the tool, not avoiding the work.","Adjust the hive, then return to the mission.","Good systems make discipline easier."],
    weather:["Weather changed? Fine. Your plan does not.","Rain or shine, the books remain open.","Cold day? Warm brain. Start."],
    water:["Hydration logged. The recruit is learning.","Water first, excuses never.","A hydrated bee flies straighter."],
    tasks:["Tasks open. Pick one. Not seven. One.","Checkboxes are tiny victories. Earn one.","Prioritise high, finish small, repeat."],
    hive:["Hive menu open. Choose a tool with purpose.","The hive is not a toy box. Pick the tool that moves you forward.","Command centre open. Make a decision."],
    coach:["Hive Coach is where weak topics stop hiding.","Add the topic you fear most. That is the target.","Coach mode: honest data, better orders."],
    default:["I saw that click. Was it useful?", "Every click should have a mission.", "If this is procrastination wearing a costume, I will know."]
  };
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function contextFor(el){
    if(!el) return 'default'; var id=el.id||''; var txt=(el.textContent||'').toLowerCase();
    if(id==='focusBtn'||id==='focusStopBtn'||txt.indexOf('focus')>=0) return 'focus';
    if(id.indexOf('pomodoro')>=0||id.indexOf('Pomo')>=0||txt.indexOf('pomodoro')>=0) return 'pomodoro';
    if(id.indexOf('card')>=0||txt.indexOf('cards')>=0||txt.indexOf('flash')>=0) return 'cards';
    if(id.indexOf('notes')>=0||txt.indexOf('notes')>=0) return 'notes';
    if(id.indexOf('garden')>=0||txt.indexOf('garden')>=0) return 'garden';
    if(id.indexOf('music')>=0||txt.indexOf('music')>=0||txt.indexOf('background')>=0) return 'music';
    if(id.indexOf('settings')>=0||txt.indexOf('settings')>=0) return 'settings';
    if(id.indexOf('weather')>=0) return 'weather';
    if(id.indexOf('water')>=0||txt.indexOf('water')>=0) return 'water';
    if(id.indexOf('todo')>=0||txt.indexOf('tasks')>=0) return 'tasks';
    if(id.indexOf('hiveMenu')>=0||txt.indexOf('hive')>=0) return 'hive';
    if(id.indexOf('coach')>=0||txt.indexOf('coach')>=0) return 'coach';
    return 'default';
  }
  document.addEventListener('click', function(e){
    var el=e.target.closest&&e.target.closest('button,.settings-toggle,.lofi-track-btn,.water-glass,.mood-btn');
    if(!el) return; if(Date.now()-lastContextLine<11000) return; if(Math.random()>0.38) return;
    lastContextLine=Date.now(); var key=contextFor(el); say(pick(contextLines[key]||contextLines.default), false);
  }, true);

  /* Long Queen guide actually explains every major feature. */
  function installLongGuide(){
    if($('queenLongGuide')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="queen-long-guide" id="queenLongGuide"><div class="queen-long-card"><div class="queen-long-head"><div class="queen-long-title">👑 Queen Bee Complete Guide</div><button class="queen-long-close" id="queenLongClose">Start studying</button></div><div class="queen-guide-grid" id="queenGuideGrid"></div></div></div>');
    var sections=[
      ['⏳ Goal + countdown',['The main card shows current time, date and time until your goal.','The red goal percentage starts at 90%, but you can change it in the Hive menu.','Your pledge appears under the subtitle so your reason stays visible.']],
      ['🎯 Focus + No-touch Focus',['Focus sessions log study minutes into subjects, streaks and the garden.','No-touch Focus makes touching/clicking during a session anger the bees.','The focus meter tracks deep work progress.']],
      ['🍅 Pomodoro',['Pomodoro now lives in the Hive menu to reduce clutter.','Start, pause and reset it from the Hive menu.','Completed work sessions credit your study data.']],
      ['🐝 Hive Coach',['Add weak topics, priorities and mastery levels.','Generate adaptive quizzes from weak topics and notes.','Create a coach plan and save review logs after sessions.']],
      ['🧠 Memory tools',['Flashcards support manual cards, CSV import/export and spaced review.','Formula bank stores quotes, formulas and key facts.','Notes Question Maker turns pasted notes into retrieval questions.']],
      ['🧰 More Tools',['Tasks, notes, habits, draw-a-card, heatmap, rival hive, freeze tokens and more live in More Tools.','More Tools is separate from the Hive menu so utilities stay accessible.']],
      ['🌷 Garden World',['Study minutes grow flowers.','Enter Garden World to see the full field, water it, journal and plant an intention seed.','The garden is a visual reward system for consistent effort.']],
      ['🎵 Music + sounds',['Background music can be toggled in the Hive menu.','The Music panel has special tracks like Calm Bee Outside.','UI sounds give feedback for buttons and Sergeant messages.']],
      ['🌙 Night + Grind modes',['Night mode is calmer with moon and stars.','Grind Mode hides stimulation so only essential study remains.','You can switch bees off in Settings.']],
      ['🫡 Sergeant + bees',['Sergeant gives contextual lines based on what you click.','Bee models change as your progress grows.','Rare bee whispers reveal easter eggs, and the Queen can rarely visit for 10 minutes.']],
      ['📊 Planning + analytics',['Exam countdowns, grade predictor, grade rescue, heatmap and daily brief help plan work.','Weather hides until changed, then notifies you if temperature/weather updates.']],
      ['⚙️ Settings',['Settings control mobile layout, bees, sounds, tour reset, weather hiding, no-touch focus, themes, backups and reset options.','Use settings to make the hive calmer or more intense.']]
    ];
    $('queenGuideGrid').innerHTML=sections.map(function(s){ return '<div class="queen-guide-section"><h3>'+s[0]+'</h3><ul>'+s[1].map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul></div>'; }).join('');
    $('queenLongClose').onclick=function(){ $('queenLongGuide').classList.remove('show'); try{localStorage.setItem('studyhive-tour-seen-v1','1');}catch(e){} };
  }
  function showLongGuide(){ installLongGuide(); $('queenLongGuide').classList.add('show'); }
  installLongGuide();
  document.addEventListener('click', function(e){ if(e.target && e.target.id==='queenLongTourBtn'){ e.preventDefault(); var choice=$('queenTourChoice'); if(choice) choice.classList.remove('show'); if(window.showQueenStoryGuide) window.showQueenStoryGuide(); else showLongGuide(); e.stopImmediatePropagation(); } }, true);

  /* Bee models based on progress. */
  function progressMinutes(){ var sd=getJSON('study-data-v2',{totalMinutes:0}); return Number(sd.totalMinutes||0); }
  function applyBeeModels(){
    var mins=progressMinutes();
    var MODELS=['model-seedling','model-scholar','model-athlete','model-chemist','model-musician','model-scientist','model-explorer','model-golden','model-astronaut','model-royal'];
    qa('.hive-bee-el.bee-art-upgraded').forEach(function(b,i){
      MODELS.forEach(function(c){b.classList.remove(c);});
      if(mins>=3000 && i%19===0) b.classList.add('model-royal');
      else if(mins>=2000 && i%15===0) b.classList.add('model-astronaut');
      else if(mins>=1500 && i%9===0) b.classList.add('model-golden');
      else if(mins>=1300 && i%11===0) b.classList.add('model-explorer');
      else if(mins>=1100 && i%13===0) b.classList.add('model-scientist');
      else if(mins>=900 && i%7===0) b.classList.add('model-musician');
      else if(mins>=720 && i%7===0) b.classList.add('model-chemist');
      else if(mins>=500 && i%6===0) b.classList.add('model-athlete');
      else if(mins>=240 && i%5===0) b.classList.add('model-scholar');
      else if(mins>=60 && i%3===0) b.classList.add('model-seedling');
    });
  }
  setInterval(applyBeeModels,6000); setTimeout(applyBeeModels,1200);

  /* Better Settings: add useful switches/actions. */
  function addBetterSettings(){
    var panel=$('settingsPanel'); if(!panel || $('settingsBetterBlock')) return;
    var div=document.createElement('div'); div.id='settingsBetterBlock';
    div.innerHTML='<div class="settings-divider"></div><div class="settings-section-title">🎛️ Experience</div><div class="settings-small-note">Tune the hive for calm, focus, or more feedback.</div><div class="settings-row"><span class="settings-row-label">🎵 Background music</span><span class="settings-toggle" id="settingsBgMusic"></span></div><div class="settings-row"><span class="settings-row-label">🔔 UI sound effects</span><span class="settings-toggle" id="settingsUiSounds"></span></div><div class="settings-row"><span class="settings-row-label">🌦️ Auto-hide weather</span><span class="settings-toggle" id="settingsAutoWeather"></span></div><div class="settings-row"><span class="settings-row-label">🚫 No-touch Focus default</span><span class="settings-toggle" id="settingsNoTouchDefault"></span></div><div class="settings-row"><span class="settings-row-label">🧹 Clean interface</span><span class="settings-toggle" id="settingsCleanUi"></span></div><div class="settings-section-title">👑 Guide + Queen</div><div class="settings-btn-row"><button class="settings-action-btn" id="settingsQueenGuideBtn">Queen guide choices</button><button class="settings-action-btn" id="settingsLongGuideBtn">Long guide</button></div><button class="settings-action-btn" id="settingsResetTourBtn" style="width:100%;">Reset explainer choice</button>';
    panel.appendChild(div);
    function sync(){
      $('settingsBgMusic').classList.toggle('on', localStorage.getItem('studyhive-bg-music-v1')!=='0');
      $('settingsUiSounds').classList.toggle('on', localStorage.getItem('studyhive-ui-sounds-v1')!=='0');
      $('settingsAutoWeather').classList.toggle('on', localStorage.getItem('studyhive-auto-weather-v1')!=='0');
      $('settingsNoTouchDefault').classList.toggle('on', localStorage.getItem('studyhive-no-touch-v1')==='1');
      $('settingsCleanUi').classList.toggle('on', document.body.classList.contains('clean-ui'));
    }
    $('settingsBgMusic').onclick=function(){ localStorage.setItem('studyhive-bg-music-v1', localStorage.getItem('studyhive-bg-music-v1')==='0'?'1':'0'); sync(); };
    $('settingsUiSounds').onclick=function(){ localStorage.setItem('studyhive-ui-sounds-v1', localStorage.getItem('studyhive-ui-sounds-v1')==='0'?'1':'0'); sync(); };
    $('settingsAutoWeather').onclick=function(){ localStorage.setItem('studyhive-auto-weather-v1', localStorage.getItem('studyhive-auto-weather-v1')==='0'?'1':'0'); sync(); };
    $('settingsNoTouchDefault').onclick=function(){ localStorage.setItem('studyhive-no-touch-v1', localStorage.getItem('studyhive-no-touch-v1')==='1'?'0':'1'); sync(); };
    $('settingsCleanUi').onclick=function(){ document.body.classList.toggle('clean-ui'); localStorage.setItem('studyhive-clean-ui-v1', document.body.classList.contains('clean-ui')?'1':'0'); sync(); };
    $('settingsQueenGuideBtn').onclick=function(){ var c=$('queenTourChoice'); if(c)c.classList.add('show'); };
    $('settingsLongGuideBtn').onclick=showLongGuide;
    $('settingsResetTourBtn').onclick=function(){ localStorage.removeItem('studyhive-tour-seen-v1'); localStorage.removeItem('studyhive-tour-choice-v1'); var c=$('queenTourChoice'); if(c)c.classList.add('show'); };
    sync();
  }
  if(localStorage.getItem('studyhive-clean-ui-v1')==='0') document.body.classList.remove('clean-ui');
  addBetterSettings(); setTimeout(addBetterSettings,1200);
})();
