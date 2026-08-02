/* =====================================================================
   Study Hive — 16-bee-styles-queen.js
   Extracted from the original single-file build (script block #14).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function visible(el){ return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length)); }

  function renameHiveControls(){ var b=$('hiveMenuBtn'); if(b) b.textContent='🐝 Hive Controls'; }
  renameHiveControls(); setInterval(renameHiveControls,5000);

  /* Pomodoro: hidden until controlled by Hive Controls; always resets to original 25m when reset is pressed. */
  document.body.classList.add('pomodoro-in-hive');
  function ensureHivePomoControls(){
    var start=$('hivePomoStart'), reset=$('hivePomoReset');
    if(start && !start.dataset.fixedPomo){
      start.dataset.fixedPomo='1';
      start.onclick=function(e){ e.stopPropagation(); var b=$('pomodoroStartBtn'); if(b) b.click(); };
    }
    if(reset && !reset.dataset.fixedPomo){
      reset.dataset.fixedPomo='1';
      reset.onclick=function(e){ e.stopPropagation(); var b=$('pomodoroResetBtn'); if(b) b.click(); setTimeout(function(){ var d=$('hivePomoTime'); if(d) d.textContent=($('pomodoroTime')&&$('pomodoroTime').textContent)||'25:00'; },80); };
    }
  }
  setInterval(ensureHivePomoControls,2500); ensureHivePomoControls();

  /* Natural bee swarm fixes: no synced wing/bob timing, and count matches actual visible bees. */
  function randomizeBee(el){
    if(!el || el.dataset.naturalized==='1') return;
    el.dataset.naturalized='1';
    el.style.setProperty('--bee-bob-delay', (-Math.random()*1.2).toFixed(2)+'s');
    el.style.setProperty('--bee-wing-delay', (-Math.random()*0.5).toFixed(2)+'s');
    el.style.setProperty('--bee-bob-speed', (0.46+Math.random()*0.42).toFixed(2)+'s');
    el.style.setProperty('--bee-wing-speed', (0.09+Math.random()*0.08).toFixed(2)+'s');
  }
  function naturalizeAllBees(){ qa('.hive-bee-el').forEach(randomizeBee); }
  naturalizeAllBees(); setInterval(naturalizeAllBees,4000);
  function updateBeeCount(){
    var badge=$('hivePopulationBadge'); if(!badge) return;
    var style=localStorage.getItem('studyhive-bee-style-v1')||'new';
    var count=0;
    if(style==='new'||style==='both') count += qa('.hive-bee-el').filter(function(b){return visible(b)&&!b.classList.contains('sleeping');}).length;
    if(style==='old'||style==='both') count += qa('.bee-wrap').filter(visible).length;
    if(style==='off') count=0;
    badge.textContent='🐝 '+count+' bee'+(count===1?'':'s')+' working';
  }
  setInterval(updateBeeCount,4000); setTimeout(updateBeeCount,800);

  /* Queen Story Guide: long explanation as a real guided tour, not a static map. */
  var STORY_STEPS=[
    ['👑','Welcome, worker bee','I am the Queen Bee. I will show you every important part of the hive, where it lives, and what it does. Use Next when ready.',null],
    ['⏳','Main countdown card','This is your home base. It shows the current time, your goal title, goal date, pledge, and the countdown to the thing you are working toward.','.card'],
    ['🎯','Red goal percentage','This starts at 90% by default. Use Hive Controls → Goal % to change it, but the base goal remains 90 so the app has a strong default target.','.goal-wrap'],
    ['✍️','Pledge','Your pledge is a promise to yourself. It appears under the main countdown to remind you why you are studying when motivation drops.','.pledge-pill'],
    ['🎯','Focus timer','The Focus button starts study blocks. Pick a subject and duration; completed minutes feed your streak, analytics, hive progress and garden.','#focusBtn'],
    ['🚫','No-touch Focus','Inside Focus, No-touch mode turns your session into a discipline challenge. Touching the screen angers the bees; staying hands-off protects attention.','#focusPanel'],
    ['🍅','Pomodoro','Pomodoro is no longer floating all the time. Open Hive Controls to start, pause, or reset it. It is still the classic 25-minute work timer.','#hiveMenuBtn'],
    ['🐝','Hive Controls','This menu holds background music, Pomodoro controls, Hive Coach, Hive Studio, Grind Mode, pledge editing and goal percentage controls.','#hiveMenuBtn'],
    ['🧰','More Tools','This is separate from Hive Controls. It opens the utility dock: tasks, notes, cards, habits, garden, music, water, heatmap, rival hive and more.','#dockToggleBtn'],
    ['🐝','Hive Coach','Hive Coach is the smart study centre. Add weak topics, rate mastery, get adaptive quizzes, generate plans and log reviews.','#hiveCoachBtn'],
    ['🧠','Flashcards','Cards help you practice active recall. You can add cards, import CSV, use AI note import when hosted correctly, and run spaced reviews.','#cardsBtn'],
    ['📝','Notes','Notes are a quick auto-saving scratchpad for formulas, reminders, essay ideas or things you must not forget.','#notesBtn'],
    ['✅','Tasks','Tasks are for today’s concrete work. Priorities help you choose what matters instead of drowning in a long list.','#todoToggleBtn'],
    ['📆','Exams','The Exams panel stores subject exam dates and creates urgency badges so your revision plan matches real deadlines.','#examBtn'],
    ['📊','Grades','The Grade Predictor estimates what you need on remaining assessments to hit your target mark.','#gradeBtn'],
    ['🌷','Garden panel','The small garden panel summarizes your grown flowers. Press Enter Garden World for the full separate garden screen.','#gardenBtn'],
    ['🌷','Garden World','Garden World is a reward space grown by study minutes. Water flowers, journal after sessions, and plant intention seeds for tomorrow.','#gardenWorld'],
    ['🎵','Music panel','The Music panel gives study tracks like Calm Bee Outside, rain, forest and white noise. Background music is separate in Hive Controls.','#musicBtn'],
    ['🎵','Background music','Hive Controls has the soft background music toggle and volume. It starts after a tap because browsers block autoplay.','#hiveMenuPanel'],
    ['🌦️','Weather','Weather hides when unchanged. If temperature or conditions change, it returns, pulses, and can notify you.','#weatherWidget'],
    ['🌬️','Breathing','Breathing gives guided calm patterns and break ideas for when your nervous system needs a reset.','#breathingBtn'],
    ['🆘','SOS Calm','SOS Calm is the fast emotional reset: one supportive line, one breath, one small next step.','#sosBtn'],
    ['🧱','Grind Mode','Grind Mode reduces stimulation by hiding busy visuals, bees and extras so the main study card stays clean.','#hiveMenuBtn'],
    ['🌙','Night Mode','Night mode now uses a calmer moon-and-stars style, better contrast, and fewer glitchy animations.','#sleepToggle'],
    ['🐝','Bee styles','Settings lets you choose new progress bees, old flying bees, both, or no extra bees. Sergeant stays separate.','#settingsBtn'],
    ['🐝','Progress bees','The bees change as you study: seedling, scholar, chemist, golden and royal bees appear based on your total minutes.','#hiveSwarm'],
    ['🫡','Sergeant Bee','Sergeant is the motivator. He reacts to time away and sometimes comments on what you click: focus, cards, notes, garden and more.','#sergeantPersistent'],
    ['🗓️','Heatmap','Heatmap shows consistency over time: which days had study minutes and how strong the habit is becoming.','#heatmapBtn'],
    ['⚔️','Rival Hive','Rival Hive compares your study minutes against a simulated rival pace for friendly pressure.','#rivalBtn'],
    ['❄️','Streak Freeze','Freeze tokens protect a streak when life interrupts you. Earn them through longer streak milestones.','#freezeBtn'],
    ['💧','Water','Water tracker is simple: tap glasses so focus does not come at the cost of hydration.','#waterBtn'],
    ['⚙️','Settings','Settings controls subjects, themes, backups, mobile layout, bee style, sounds, tour reset, weather behavior and diagnostics.','#settingsBtn'],
    ['🎉','End of royal tour','That is the full hive. Start with one focused session, log a review, and let the hive grow from real effort.',null]
  ];
  var idx=0;
  function ensureOverlay(){
    if($('queenStoryOverlay')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="queen-story-overlay" id="queenStoryOverlay"><div class="queen-story-spotlight" id="queenStorySpot"></div><div class="queen-story-card" id="queenStoryCard"><div class="queen-story-icon" id="queenStoryIcon">👑</div><div class="queen-story-progress" id="queenStoryProgress"></div><h3 id="queenStoryTitle"></h3><p id="queenStoryBody"></p><div class="queen-story-actions"><button class="secondary" id="queenStoryBack">Back</button><button id="queenStoryNext">Next</button><button class="secondary" id="queenStorySkip">Skip</button></div></div></div>');
    $('queenStoryBack').onclick=function(){ if(idx>0){idx--; renderStory();} };
    $('queenStoryNext').onclick=function(){ if(idx<STORY_STEPS.length-1){idx++; renderStory();} else closeStory(); };
    $('queenStorySkip').onclick=closeStory;
  }
  function closeStory(){ $('queenStoryOverlay').classList.remove('show'); try{localStorage.setItem('studyhive-tour-seen-v1','1'); localStorage.setItem('studyhive-tour-choice-v1','long');}catch(e){} }
  function targetFor(sel){ try{return sel?document.querySelector(sel):null;}catch(e){return null;} }
  function renderStory(){
    ensureOverlay(); var s=STORY_STEPS[idx], target=targetFor(s[3]);
    $('queenStoryIcon').textContent=s[0]; $('queenStoryTitle').textContent=s[1]; $('queenStoryBody').textContent=s[2]; $('queenStoryProgress').textContent='Queen guide '+(idx+1)+' of '+STORY_STEPS.length; $('queenStoryBack').style.visibility=idx?'visible':'hidden'; $('queenStoryNext').textContent=idx===STORY_STEPS.length-1?'Finish':'Next';
    if(target && target.scrollIntoView) { try{ target.scrollIntoView({block:'center',inline:'center'}); }catch(e){} }
    setTimeout(function(){ positionStory(target); },120);
  }
  function positionStory(target){
    var spot=$('queenStorySpot'), card=$('queenStoryCard'), vw=innerWidth, vh=innerHeight;
    if(target && visible(target)){ var r=target.getBoundingClientRect(), pad=8; spot.style.display='block'; spot.style.top=(r.top-pad)+'px'; spot.style.left=(r.left-pad)+'px'; spot.style.width=(r.width+pad*2)+'px'; spot.style.height=(r.height+pad*2)+'px'; if(r.top<vh*.45){card.style.top='auto';card.style.bottom='18px';}else{card.style.bottom='auto';card.style.top='18px';} if(r.left<vw*.33){card.style.left='auto';card.style.right='18px';card.style.transform='none';}else if(r.right>vw*.66){card.style.left='18px';card.style.right='auto';card.style.transform='none';}else{card.style.left='50%';card.style.right='auto';card.style.transform='translateX(-50%)';} }
    else { spot.style.display='none'; card.style.left='50%'; card.style.right='auto'; card.style.top='50%'; card.style.bottom='auto'; card.style.transform='translate(-50%,-50%)'; }
  }
  window.showQueenStoryGuide=function(){ ensureOverlay(); idx=0; $('queenStoryOverlay').classList.add('show'); renderStory(); };

  document.addEventListener('click', function(e){ if(e.target && e.target.id==='settingsLongGuideBtn'){ e.preventDefault(); if(window.showQueenStoryGuide) window.showQueenStoryGuide(); e.stopImmediatePropagation(); } }, true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && $('queenStoryOverlay') && $('queenStoryOverlay').classList.contains('show')) closeStory(); });
  window.addEventListener('resize',function(){ if($('queenStoryOverlay')&&$('queenStoryOverlay').classList.contains('show')) renderStory(); });
})();
