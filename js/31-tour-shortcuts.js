/* =====================================================================
   Study Hive — 31-tour-shortcuts.js
   Extracted from the original single-file build (script block #29).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){return document.getElementById(id)}
  function qa(sel){return Array.prototype.slice.call(document.querySelectorAll(sel))}
  function getJSON(k,f){try{var r=localStorage.getItem(k);return r?JSON.parse(r):f}catch(e){return f}}
  function setJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function toast(msg){if(typeof showMilestoneToast==='function')showMilestoneToast(msg,3200)}
  var MORE={'cardsBtn':1,'notesBtn':1,'todoToggleBtn':1,'gardenBtn':1,'musicBtn':1,'heatmapBtn':1,'rivalBtn':1,'freezeBtn':1,'waterBtn':1,'habitsBtn':1,'drawBtn':1,'capsuleBtn':1,'punsBtn':1,'secretsBtn':1,'challengeBtn':1,'feedbackBtn':1,'tipsBtn':1};
  var SHORT=[
    ['👑','Welcome to the hive','I am the Queen Bee. In one minute: this app helps you choose a goal, protect focus, remember more, and turn effort into visible progress.',null,'Start with one honest timer.'],
    ['⏳','Countdown and pledge','The main card is your reason: goal date, goal percentage, countdown, and your fill-in pledge.', '.card','If you feel lost, come back to this card.'],
    ['🎯','Focus system','Focus and No-touch Focus log minutes and protect attention. The bees get angry if No-touch is on and you tap during study.', '#focusBtn','Use 15 minutes when starting feels hard.'],
    ['🐝','Hive Coach','Hive Coach tells you what weak topic to attack next, then quizzes you and logs reviews.', '#hiveMenuBtn','Open Hive Controls → Hive Coach.'],
    ['🧰','More Tools','More Tools holds tasks, notes, flashcards, music, garden, habits, heatmap, water and more.', '#dockToggleBtn','Use one tool at a time.'],
    ['🌷','Garden World','Your study minutes grow flowers. Enter Garden World to water, journal, and plant tomorrow’s intention.', '#gardenBtn','Progress should feel visible.'],
    ['🌿','Calm or Grind','Music, SOS, Breathing, Night Mode and Grind Mode help the app match your energy.', '#sosBtn','Calm first, then action.'],
    ['🎉','Begin','Pick a subject, choose a timer, and start. The hive rewards returning, not perfection.', null,'The first five minutes count.']
  ];
  var LONG=[
    ['👑','Royal overview','I will explain every major feature, where it is, what it does, and how to use it without getting overwhelmed.',null,'You do not need every tool today. Choose the one that creates the next action.'],
    ['⏳','Main countdown','The center card shows time, date, your goal title, subtitle, countdown and pledge. It is your study cockpit.', '.card','Keep this screen open while you study.'],
    ['🎯','Goal percentage','The red goal starts at 90% by default. Hive Controls lets you change it if your target is different.', '.goal-wrap','A goal should challenge you without crushing you.'],
    ['✍️','Fill-in pledge','The pledge makes the app personal. It turns vague motivation into a sentence you completed yourself.', '.pledge-pill','A pledge is a reason you can reread on tired days.'],
    ['📱','Mobile layout','The app has forced mobile layout, scroll controls and readable typing previews for setup on phones.', '#settingsBtn','If mobile gets weird, Settings has repair options.'],
    ['🎯','Focus timer','Focus records real study minutes. Those minutes feed streaks, subjects, garden, bees and analytics.', '#focusBtn','Use Focus when you need one clean block.'],
    ['🚫','No-touch Focus','Inside Focus, No-touch mode turns a session into a discipline challenge: no tapping while studying.', '#focusPanel','It is perfect for phone temptation.'],
    ['🍅','Pomodoro','Pomodoro is controlled from Hive Controls so it does not clutter the main screen. Reset returns to 25 minutes.', '#hiveMenuBtn','Use Pomodoro for classic 25/5 rhythm.'],
    ['🐝','Hive Controls','Hive Controls contains background music, Pomodoro, Hive Coach, Hive Studio, Grind Mode, pledge and goal controls.', '#hiveMenuBtn','This is the command menu, not a toy box.'],
    ['🧰','More Tools','More Tools opens the bottom utility dock. The Queen opens it automatically when explaining those features.', '#dockToggleBtn','Keep it closed when you want less clutter.'],
    ['🐝','Hive Coach','Hive Coach stores topics, mastery, priorities, quizzes, coach plans and review logs.', '#hiveCoachBtn','Weak topics are coordinates, not shame.'],
    ['🐝','Bee AI','Bee AI can use Pollinations, Puter or offline fallback to give study advice from Buddy, Sergeant or Queen.', '#hiveMenuBtn','Use AI for next-step advice, not cheating.'],
    ['📝','Notes','Notes are an auto-saving scratchpad. Use them for formulas, thoughts, mistakes and reminders.', '#notesBtn','A note should help future-you.'],
    ['✅','Tasks','Tasks are for concrete work. Add small tasks, set priority, and check them off.', '#todoToggleBtn','One checkbox is a real win.'],
    ['🧠','Flashcards','Flashcards train active recall. Add cards, import CSV, use AI note import if hosted, and review hard cards.', '#cardsBtn','Predict before flipping.'],
    ['🔤','Vocab','Vocab teaches academic words with definitions and examples. The bank now has many more words.', '#vocabBtn','Words make essays sharper.'],
    ['🧾','Formula bank','Hive Studio includes a key facts/formula bank for quotes, rules, formulas and definitions.', '#upgradeHubBtn','Store what you always forget.'],
    ['🔎','Notes question maker','Paste notes and turn them into retrieval questions so revision becomes active.', '#upgradeHubBtn','Questions beat highlighting.'],
    ['📥','CSV tools','Flashcard CSV import/export lets you move decks between spreadsheets and the app.', '#upgradeHubBtn','Great for bulk decks.'],
    ['🌷','Garden panel','The small Garden panel shows quick garden progress and lets you enter the full Garden World.', '#gardenBtn','Study minutes become flowers.'],
    ['🌷','Garden World','Garden World is a separate screen with a field, hive house, flowers, watering, journal and intention seed.', '#gardenWorld','Make progress visible and calm.'],
    ['🎵','Music panel','Music panel has tracks like Calm Bee Outside, rain, forest and white noise.', '#musicBtn','Sound should serve focus.'],
    ['🎵','Background music','Hive Controls has uploaded background music and volume. Browsers require a tap before it plays.', '#hiveMenuBtn','If music distracts, switch it off.'],
    ['🌦️','Weather','Weather hides when unchanged and returns when temperature or conditions change.', '#weatherWidget','Weather is context, not an excuse.'],
    ['💧','Water','Water tracker keeps hydration beside studying.', '#waterBtn','A hydrated brain works better.'],
    ['🙂','Mood','Mood tracking helps the app understand whether you are tired, frustrated, okay or pumped.', '#moodTracker','Mood is data, not judgment.'],
    ['🌬️','Breathing','Breathing gives guided calm patterns and break ideas.', '#breathingBtn','Use before panic becomes the plan.'],
    ['🆘','SOS Calm','SOS Calm gives a fast emotional reset when the workload feels too loud.', '#sosBtn','One breath, one next action.'],
    ['📅','Exams','Exams stores subject dates and creates urgency badges for the next deadline.', '#examBtn','Dates make revision real.'],
    ['📊','Grades','Grade Predictor estimates what you need on remaining assessments to hit a target.', '#gradeBtn','Use it for planning, not panic.'],
    ['🗓️','Heatmap','Heatmap shows which days you studied and how strong your consistency is.', '#heatmapBtn','Patterns reveal habits.'],
    ['⚔️','Rival Hive','Rival Hive compares your minutes against a simulated rival for friendly pressure.', '#rivalBtn','Compete without obsessing.'],
    ['❄️','Streak Freeze','Freeze tokens protect streaks when life interrupts you.', '#freezeBtn','Streaks should motivate, not punish.'],
    ['🎲','Study Bingo','Bingo gives variety and small daily challenge squares.', '#challengeBtn','Use when studying feels stale.'],
    ['🧘','Break and energy tools','Hive Studio includes break roulette, energy-based study mode and rescue planners.', '#upgradeHubBtn','Match the method to your state.'],
    ['🧱','Grind Mode','Grind Mode hides stimulation and keeps the screen clean for serious work.', '#hiveMenuBtn','Use when the hive feels too busy.'],
    ['🌙','Night Mode','Night Mode makes the app calmer and easier to read late in the day.', '#shareCountdownBtn','Rest still matters.'],
    ['🐝','Bee styles','Settings lets you choose old bees, progress bees, both, or no extra bees. Sergeant stays separate.', '#settingsBtn','Choose the visual energy you want.'],
    ['🐝','Progress bees','Progress bees change models as total study minutes grow: seedling, scholar, chemist, golden and royal.', '#hiveSwarm','The bee count matches visible bees.'],
    ['🫡','Sergeant Bee','Sergeant reacts to time away, clicks, hovers and current activity with contextual motivation.', '#sergeantPersistent','He is motivation, not the boss of your worth.'],
    ['👑','Queen Bee','Queen Bee gives short or long guides and may rarely visit for 10 minutes.', '#queenTourChoice','The Queen explains, then you act.'],
    ['⚙️','Settings','Settings controls subjects, theme, backups, mobile layout, bee style, sounds, privacy, AI provider and guide replay.', '#settingsBtn','If something feels wrong, check Settings.'],
    ['🛡️','Privacy and Terms','The app is local-first, includes Privacy Mode, and links Terms, Privacy and Contact Creator.', '.legal-links','Do not store sensitive data in notes.'],
    ['🎉','Royal ending','That is the hive. Choose one feature now: Focus if avoiding, Coach if lost, Cards if forgetting, Garden if you need reward.', null,'The hive grows from real effort.']
  ];
  var steps=SHORT,idx=0,queenDock=false;
  function ensure(){if($('queenV2Overlay'))return;document.body.insertAdjacentHTML('beforeend','<div class="queen-v2-overlay" id="queenV2Overlay"><div class="queen-v2-spot" id="queenV2Spot"></div><div class="queen-v2-card" id="queenV2Card"><div class="queen-v2-icon" id="queenV2Icon">👑</div><div class="queen-v2-progress" id="queenV2Progress"></div><h3 id="queenV2Title"></h3><p id="queenV2Body"></p><div class="queen-v2-tip" id="queenV2Tip"></div><div class="queen-v2-actions"><button class="secondary" id="queenV2Back">Back</button><button id="queenV2Next">Next</button><button class="secondary" id="queenV2Skip">Skip</button></div></div></div>');$('queenV2Back').onclick=function(){if(idx>0){idx--;render()}};$('queenV2Next').onclick=function(){if(idx<steps.length-1){idx++;render()}else close()};$('queenV2Skip').onclick=close}
  function visible(el){return!!(el&&(el.offsetWidth||el.offsetHeight||el.getClientRects().length))}
  function openDock(needs){var btn=$('dockToggleBtn'),open=document.body.classList.contains('dock-open');if(needs&&!open){queenDock=true;if(btn)btn.click();else document.body.classList.add('dock-open')}if(!needs&&open&&queenDock){if(btn)btn.click();else document.body.classList.remove('dock-open');queenDock=false}}
  function target(sel){try{return sel?document.querySelector(sel):null}catch(e){return null}}
  function render(){ensure();var s=steps[idx],el=target(s[3]);var needs=!!(s[3]&&s[3].charAt(0)==='#'&&MORE[s[3].slice(1)]);openDock(needs);$('queenV2Icon').textContent=s[0];$('queenV2Title').textContent=s[1];$('queenV2Body').textContent=s[2];$('queenV2Tip').textContent=s[4]||'';$('queenV2Progress').textContent=(steps===LONG?'Complete Queen guide ':'Short Queen guide ')+(idx+1)+' of '+steps.length;$('queenV2Back').style.visibility=idx?'visible':'hidden';$('queenV2Next').textContent=idx===steps.length-1?'Finish':'Next';if(el&&el.scrollIntoView){try{el.scrollIntoView({block:'center',inline:'center'})}catch(e){}}setTimeout(function(){position(el)},150)}
  function position(el){var spot=$('queenV2Spot'),card=$('queenV2Card'),vw=innerWidth,vh=innerHeight;if(el&&visible(el)){var r=el.getBoundingClientRect(),pad=8;spot.style.display='block';spot.style.top=(r.top-pad)+'px';spot.style.left=(r.left-pad)+'px';spot.style.width=(r.width+pad*2)+'px';spot.style.height=(r.height+pad*2)+'px';if(r.top<vh*.45){card.style.top='auto';card.style.bottom='18px'}else{card.style.bottom='auto';card.style.top='18px'}if(r.left<vw*.34){card.style.left='auto';card.style.right='18px';card.style.transform='none'}else if(r.right>vw*.66){card.style.left='18px';card.style.right='auto';card.style.transform='none'}else{card.style.left='50%';card.style.right='auto';card.style.transform='translateX(-50%)'}}else{spot.style.display='none';card.style.left='50%';card.style.right='auto';card.style.top='50%';card.style.bottom='auto';card.style.transform='translate(-50%,-50%)'}}
  function start(mode){ensure();steps=mode==='long'?LONG:SHORT;idx=0;$('queenV2Overlay').classList.add('show');render()}
  function close(){$('queenV2Overlay').classList.remove('show');openDock(false);try{localStorage.setItem('studyhive-tour-seen-v1','1');localStorage.setItem('studyhive-tour-choice-v1',steps===LONG?'long':'short')}catch(e){}}
  window.showStudyHiveQueenGuideV2=start;
  document.addEventListener('click',function(e){if(!e.target)return;if(e.target.id==='queenShortTourBtn'){e.preventDefault();e.stopImmediatePropagation();var c=$('queenTourChoice');if(c)c.classList.remove('show');start('short')}if(e.target.id==='queenLongTourBtn'||e.target.id==='settingsLongGuideBtn'){e.preventDefault();e.stopImmediatePropagation();var c2=$('queenTourChoice');if(c2)c2.classList.remove('show');start('long')}if(e.target.id==='replayTourBtn'||e.target.id==='settingsQueenGuideBtn'){e.preventDefault();e.stopImmediatePropagation();var c3=$('queenTourChoice');if(c3)c3.classList.add('show')}},true);
  window.addEventListener('resize',function(){if($('queenV2Overlay')&&$('queenV2Overlay').classList.contains('show'))render()});
})();
