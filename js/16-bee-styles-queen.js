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
  /* QUEEN AVATAR: a little queen bee with her crown ON her head, shown at
     the top of every guide step. */
  var QUEEN_AVATAR = [
    '<svg viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">',
    '  <defs><linearGradient id="qaBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe38b"/><stop offset="1" stop-color="#e2a91c"/></linearGradient></defs>',
    '  <ellipse cx="14" cy="18" rx="9" ry="6" fill="rgba(255,255,255,.8)" stroke="#d3b995" stroke-width="1"></ellipse>',
    '  <ellipse cx="32" cy="18" rx="9" ry="6" fill="rgba(255,255,255,.8)" stroke="#d3b995" stroke-width="1"></ellipse>',
    '  <ellipse cx="23" cy="27" rx="12" ry="9" fill="url(#qaBody)" stroke="#8a6a20" stroke-width="1"></ellipse>',
    '  <rect x="16" y="20" width="3.2" height="15" fill="#372b18" opacity=".9" rx="1.6"></rect>',
    '  <rect x="23.3" y="19.5" width="3.2" height="16" fill="#372b18" opacity=".9" rx="1.6"></rect>',
    '  <rect x="30.6" y="20" width="3.2" height="15" fill="#372b18" opacity=".9" rx="1.6"></rect>',
    '  <circle cx="33.5" cy="25" r="6.4" fill="#2b241d"></circle>',
    '  <circle cx="35.2" cy="23.6" r="1.9" fill="#fff"></circle>',
    '  <circle cx="35.2" cy="23.6" r=".9" fill="#111"></circle>',
    '  <circle cx="31.2" cy="23.6" r="1.9" fill="#fff"></circle>',
    '  <circle cx="31.2" cy="23.6" r=".9" fill="#111"></circle>',
    /* crown ON the head */
    '  <path d="M27.6 16.4 L29.4 12.2 L32.2 14.8 L34.6 11.4 L37 14.8 L39.8 12.2 L41.6 16.4 Z" fill="#f4c430" stroke="#c97a12" stroke-width="1"></path>',
    '  <path d="M27.6 16.4 L41.6 16.4 L41.6 17.6 L27.6 17.6 Z" fill="#f4c430" stroke="#c97a12" stroke-width=".8"></path>',
    '  <circle cx="30.2" cy="13.4" r="1.1" fill="#e2362a"></circle>',
    '  <circle cx="37.8" cy="13.4" r="1.1" fill="#e2362a"></circle>',
    '</svg>'
  ].join('\n');
  var STORY_STEPS=[
    ['👑','Welcome, worker bee','I am the Queen Bee. This is the royal tour of your whole hive — 33 stops, each with a Queen\'s tip. Use Next when ready, or press the arrow keys.','#welcomeEnterBtn','Queen\'s tip: you can skip the tour anytime with Skip, or tap anywhere outside this card.'],
    ['⏳','Main countdown card','This is your home base. It shows the current time, your goal title, your pledge, and the countdown to the thing you are working toward.','.card','Tip: tap the quote near the top to cycle to another quote. Tap the heart to save your favourites.'],
    ['🎯','Red goal percentage','This starts at 90% by default — the app\'s strong target. You can change it in Hive Controls → Goal %, but the base stays 90 so you always aim high.','.goal-wrap','Tip: tap the goal percentage 4 times quickly for a secret.'],
    ['✍️','Pledge','Your pledge is a promise to yourself. It appears under the countdown and can now be opened and closed — tap it to read the full promise.','.pledge-card','Tip: pressing 🆘 Calm automatically opens your pledge so you remember why you started while you breathe.'],
    ['🎯','Focus timer','The Focus button starts study blocks. Pick a subject and duration; every completed minute feeds your streak, analytics, hive progress and garden.','#focusBtn','Tip: short honest sessions beat long distracted ones. 25 real minutes is a victory.'],
    ['🚫','No-touch Focus','Inside Focus, No-touch mode turns your session into a discipline challenge. Touching the screen angers the bees; staying hands-off protects your attention.','#focusPanel','Tip: the bees visibly get angrier the more you touch — the rage meter tells the truth.'],
    ['🍅','Pomodoro','Pomodoro lives in Hive Controls now, out of the way. It is still the classic 25-minute work timer, and completed work sessions credit your study data.','#hiveMenuBtn','Tip: use the break minutes to stand, stretch or drink water.'],
    ['🐝','Hive Controls','This menu is the command deck: background music, volume slider, Pomodoro, Hive Coach, Hive Studio, Grind Mode, pledge editing and goal controls.','#hiveMenuBtn','Tip: the 🎚️ Music volume slider starts at a soft 35% — easy to hear, easy on the ears.'],
    ['🧰','More Tools','The utility dock: tasks, notes, cards, habits, garden, music, water, heatmap, rival hive, freeze tokens and more. Panels are a bit larger now.','#dockToggleBtn','Tip: every panel opens as a neat bottom sheet on your phone.'],
    ['🐝','Hive Coach','The smart study centre: add weak topics, rate mastery, get adaptive quizzes, generate plans and log reviews after sessions.','#hiveCoachBtn','Tip: the coach reads your main worry from setup and aims its advice at that.'],
    ['🧠','Flashcards','Active recall practice. Add cards, import CSV, use AI note import when hosted, and run spaced reviews so memory sticks.','#cardsBtn','Tip: mistakes on cards are gold — each one is a future mark saved.'],
    ['📝','Notes','A quick auto-saving scratchpad for formulas, reminders and ideas you must not forget.','#notesBtn','Tip: notes become questions — turn pasted notes into retrieval practice.'],
    ['✅','Tasks','Today\'s concrete work, prioritised so you choose what matters instead of drowning in the list.','#todoToggleBtn','Tip: one checkbox done is real progress. Tick it.'],
    ['📆','Exams','Stores subject exam dates and creates urgency badges so your revision plan matches real deadlines.','#examBtn','Tip: entering exam dates lets the countdown and planner talk to each other.'],
    ['📊','Grades','The Grade Predictor estimates what you need on remaining assessments to hit your target mark.','#gradeBtn','Tip: a grade is feedback, not a verdict.'],
    ['🌷','Garden panel','The small garden panel summarises the flowers you grew with study minutes. Press Enter Garden World for the full screen.','#gardenBtn','Tip: every logged minute plants something.'],
    ['🌷','Garden World','A full-screen reward space grown by real effort: water flowers, journal after sessions, plant intention seeds for tomorrow.','#gardenWorld','Tip: journal entries are private to your device.'],
    ['🎵','Music panel','Study tracks: Calm Bee Outside, rain, forest, white noise and more — with the new volume slider right in the panel.','#musicBtn','Tip: the Outside track has subtle bees and birds.'],
    ['🎵','Background music','Hive Controls has the soft background music toggle and volume. It starts after a tap because browsers block autoplay.','#hiveMenuPanel','Tip: volume is remembered between visits.'],
    ['🌦️','Weather','Weather hides when unchanged. If conditions change, it returns, pulses, and can notify you. Tap it to refresh.','#weatherWidget','Tip: night mode uses the predicted sunset from this data — it turns on when the sun really sets.'],
    ['🌬️','Breathing','Guided calm patterns (Box, 4-7-8, Simple) and break ideas for when your nervous system needs a reset.','#breathingBtn','Tip: 4-7-8 is the fastest way to slow a racing heart.'],
    ['🆘','SOS Calm','The fast emotional reset: one supportive line, one breath, and your pledge opens to remind you of your promise.','#sosBtn','Tip: you are not alone in this hive. Press it as often as you need.'],
    ['🧱','Grind Mode','Reduces stimulation: busy visuals, bees and extras hide so only the essential study card remains.','#hiveMenuBtn','Tip: grind mode is a focus weapon, not a punishment.'],
    ['🌙','Night Mode','Night mode now follows the real sunset of your location and switches off at sunrise. The sky gets twinkling stars, shooting stars and very rare planet events.','#sleepToggle','Tip: shooting stars appear every 45 seconds to a few minutes — planets are far rarer, once every hour or two.'],
    ['🐝','Bee styles','Settings lets you choose new progress bees, old flying bees, both, or none. Sergeant stays separate.','#settingsBtn','Tip: old bees are rare now — only 1–4 fly, each on its own timing.'],
    ['🐝','Progress bees','The new bees change as you study: seedling, scholar, athlete, musician, scientist, explorer, chemist, golden, astronaut and royal — each with a hat that sits on their head.','#hiveSwarm','Tip: every 60 minutes of study unlocks the next model tier.'],
    ['🫡','Sergeant Bee','Sergeant is the motivator. He reacts to time away and what you click. A second Sergeant — the Squad Leader with the peaked cap — is being tested in Settings.','#sergeantPersistent','Tip: click the Sergeant for his briefing. Mute him for an hour in Settings if he gets loud.'],
    ['🗓️','Heatmap','Shows consistency over time: which days had study minutes and how strong your habit is becoming.','#heatmapBtn','Tip: streaks are about returning, not perfection.'],
    ['⚔️','Rival Hive','Compares your total minutes against a simulated rival studying at a pace you choose — Chill, Steady or Turbo. A friendly benchmark, not a real enemy.','#rivalBtn','Tip: the rival never sleeps, so catching up feels great.'],
    ['❄️','Streak Freeze','Freeze tokens protect your streak when life interrupts. Earn them through longer streak milestones.','#freezeBtn','Tip: you can hold up to 3 freezes.'],
    ['💧','Water','Tap glasses so focus never comes at the cost of hydration.','#waterBtn','Tip: your brain is mostly water. This is science.'],
    ['⚙️','Settings','Controls subjects, themes, backups, mobile layout, bee style, sounds, tour reset, weather behaviour, accessibility and admin.','#settingsBtn','Tip: ♿ Reduce motion and High contrast live here — and the 🛠️ Admin button at the bottom too.'],
    ['🐝','The Wasp (please read)','If you go more than 9 hours without logging any study, a wasp enters the hive and stings your bees, one by one, until the hive is nearly empty. The moment you study again — even five honest minutes — the wasp flees and your bees return. Rest is welcome; 9 hours of silence is not.','#hiveSwarm','Queen\'s tip: the wasp never touches your real progress. It only reminds you the hive needs you.'],
    ['🎉','End of royal tour','That is the whole hive — 33 stops. Start with one focused session, log a review, and let the hive grow from real effort. I will be watching.','#focusBtn','Queen\'s blessing: consistency outlasts talent. Now go build your honeycomb.']
  ];
  var idx=0;
  function ensureOverlay(){
    if($('queenStoryOverlay')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="queen-story-overlay" id="queenStoryOverlay"><div class="queen-story-spotlight" id="queenStorySpot"></div><div class="queen-story-card" id="queenStoryCard"><div class="queen-story-avatar" id="queenStoryAvatar" aria-hidden="true">'+QUEEN_AVATAR+'</div><div class="queen-story-icon" id="queenStoryIcon">👑</div><div class="queen-story-progress" id="queenStoryProgress"></div><div class="queen-story-track"><div class="queen-story-fill" id="queenStoryFill"></div></div><h3 id="queenStoryTitle"></h3><p id="queenStoryBody"></p><div class="queen-story-tip" id="queenStoryTip" style="display:none;"></div><div class="queen-story-actions"><button class="ghost" id="queenStoryTry" style="display:none;">✨ Try it now</button><button class="secondary" id="queenStoryBack">Back</button><button id="queenStoryNext">Next</button><button class="secondary" id="queenStorySkip">Skip</button></div></div></div>');
    $('queenStoryBack').onclick=function(){ if(idx>0){idx--; renderStory();} };
    $('queenStoryNext').onclick=function(){ if(idx<STORY_STEPS.length-1){idx++; renderStory();} else closeStory(); };
    $('queenStorySkip').onclick=closeStory;
    $('queenStoryTry').onclick=function(){ var s=STORY_STEPS[idx]; var t=s[4]?targetFor(s[3]):null; closeStory(); if(t){ setTimeout(function(){ try{ t.click(); }catch(e){} }, 400); } };
    $('queenStoryOverlay').addEventListener('click', function(e){ if(e.target===$('queenStoryOverlay')) closeStory(); });
  }
  function closeStory(){ $('queenStoryOverlay').classList.remove('show'); try{localStorage.setItem('studyhive-tour-seen-v1','1'); localStorage.setItem('studyhive-tour-choice-v1','long');}catch(e){} }
  function targetFor(sel){ try{return sel?document.querySelector(sel):null;}catch(e){return null;} }
  function renderStory(){
    ensureOverlay(); var s=STORY_STEPS[idx], target=targetFor(s[3]);
    $('queenStoryIcon').textContent=s[0]; $('queenStoryTitle').textContent=s[1]; $('queenStoryBody').textContent=s[2];
    $('queenStoryProgress').textContent='Queen guide '+(idx+1)+' of '+STORY_STEPS.length;
    var fill=$('queenStoryFill'); if(fill) fill.style.width=((idx+1)/STORY_STEPS.length*100)+'%';
    $('queenStoryBack').style.visibility=idx?'visible':'hidden';
    $('queenStoryNext').textContent=idx===STORY_STEPS.length-1?'Finish':'Next';
    var tip=$('queenStoryTip'); if(tip){ if(s[4]){ tip.style.display='block'; tip.textContent='👑 '+s[4]; } else { tip.style.display='none'; } }
    var tryBtn=$('queenStoryTry'); if(tryBtn){ var tryable=!!(target && target.click && (target.tagName==='BUTTON'||target.tagName==='A'||target.tagName==='INPUT'||target.tagName==='SELECT'||target.getAttribute('role')==='button')); tryBtn.style.display=tryable?'inline-block':'none'; }
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
  document.addEventListener('keydown',function(e){
    var ov=$('queenStoryOverlay');
    if(!ov || !ov.classList.contains('show')) return;
    if(e.key==='Escape') closeStory();
    else if(e.key==='ArrowRight'){ if(idx<STORY_STEPS.length-1){ idx++; renderStory(); } else closeStory(); }
    else if(e.key==='ArrowLeft'){ if(idx>0){ idx--; renderStory(); } }
  });
  window.addEventListener('resize',function(){ if($('queenStoryOverlay')&&$('queenStoryOverlay').classList.contains('show')) renderStory(); });
})();
