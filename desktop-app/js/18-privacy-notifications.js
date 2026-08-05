/* =====================================================================
   Study Hive — 18-privacy-notifications.js
   Extracted from the original single-file build (script block #16).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function get(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
  function set(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }

  /* AMBIENT SOUND FIX: this listener used to call e.stopPropagation() in the
     CAPTURE phase for ambient buttons (.focus-preset-btn[data-sound]).
     Capture-phase stopPropagation stops the event BEFORE it reaches the
     button, so the button's own play-sound listener never fired and the
     Ambient Focus Sounds were dead. The NaN fix is already handled below by
     the guard interval + the [data-mins] filter in the focus presets, so the
     stopPropagation is simply removed. */
  document.addEventListener('click', function(e){
    var b=e.target.closest&&e.target.closest('.focus-preset-btn[data-sound]');
    if(b){ /* intentional: let the button's own listener run */ }
  }, true);
  setInterval(function(){ var t=$('focusSessionTime'); if(t && /NaN/.test(t.textContent)){ t.textContent='00:00'; var f=$('focusSessionFill'); if(f) f.style.width='0%'; } },500);

  /* Hide admin hints and do not expose code in UI. */
  window.STUDY_HIVE_ADMIN_CODE = undefined;
  setInterval(function(){ qa('[data-hive-action="admin"]').forEach(function(x){x.remove();}); qa('.motivation-bubble').forEach(function(b){ if(/admin|ctrl\+shift\+a|queen-admin/i.test(b.textContent||'')) b.remove(); }); },1200);

  /* Legal / student privacy setup in Settings. */
  function addLegalSettings(){
    var panel=$('settingsPanel'); if(!panel || $('legalSettingsBlock')) return;
    var div=document.createElement('div'); div.id='legalSettingsBlock';
    div.innerHTML='<div class="settings-divider"></div><div class="settings-section-title">🛡️ Privacy + Student Safety</div><div class="settings-legal-card">Study Hive stores most progress locally in this browser. Review <a href="study-hive-privacy-policy.html">Privacy Policy</a> and <a href="study-hive-terms-of-service.html">Terms</a>. For school/student use, avoid storing sensitive personal info in notes or feedback. <strong>Your data stays on this device for now</strong> — no accounts, nothing uploaded. Accounts + cross-device sync are in active development, and we won\'t add them until they\'re safe and ready.</div><div class="settings-row" style="margin-top:10px;"><span class="settings-row-label">🕶️ Privacy mode</span><span class="settings-toggle" id="privacyModeToggle"></span></div><div class="settings-fix-note">Privacy mode hides weather, disables browser notification preference, and turns off feedback context by default.</div>';
    panel.appendChild(div);
    function sync(){ var on=get('studyhive-privacy-mode-v1')==='1'; $('privacyModeToggle').classList.toggle('on',on); document.body.classList.toggle('privacy-mode',on); if($('weatherWidget')) $('weatherWidget').style.display=on?'none':''; if($('feedbackIncludeStats')) $('feedbackIncludeStats').checked=!on; }
    $('privacyModeToggle').onclick=function(){ var on=get('studyhive-privacy-mode-v1')!=='1'; set('studyhive-privacy-mode-v1',on?'1':'0'); if(on) set('browser-notif-v1','0'); sync(); toast(on?'Privacy mode on':'Privacy mode off'); };
    sync();
  }
  addLegalSettings(); setInterval(addLegalSettings,5000);

  /* Another 100+ contextual Sergeant lines, chosen by hover/click/current activity. */
  var EXTRA=[
    'Check the timer, then check your excuses at the door.','If you hover over it this long, you may as well use it.','That button is not decoration, recruit.','Your cursor has ambition. Give it direction.','The hive likes decisive clicks.','A tool opened without action is just procrastination in uniform.','If you are reading menus, choose one and move.','The Queen values clean intent. So do I.','Every feature should answer: what do I do next?','If the screen feels busy, use Grind Mode and get serious.',
    'Do not hunt features to avoid the assignment.','One click, one purpose.','A student with a plan beats a student with panic.','You are allowed to start small. You are not allowed to vanish.','If the work is scary, make it specific.','Your next mark improves during practice, not during worrying.','Hovering does not count as studying.','Open the weak topic. I dare you.','The bees can smell hesitation.','Do not let customization become camouflage.',
    'A clean interface is good. A clean conscience is better.','If music helps, keep it. If it distracts, cut it.','Use weather as context, never as permission to quit.','The garden grows from minutes, not vibes.','The Coach needs honesty, not optimism.','Flashcards punish guessing gently. Use them.','Notes should be useful tomorrow, not pretty today.','Tasks should be small enough to finish.','Your pledge is a promise, not a poster.','If you break focus, restart without a speech.',
    'The hardest subject deserves the first brave minute.','You are training recovery from distraction.','A missed answer is a flare in the dark.','Do not fear the red marks; fear not checking.','One Pomodoro can rescue an entire afternoon.','If you are tired, choose a lighter task, not no task.','Sleep is a strategy, not surrender.','Water your brain before demanding miracles from it.','A formula without an example is half a tool.','A plan without review is a rumor.',
    'Use the Queen guide if you are lost. Use Focus if you are avoiding.','The hive is complex so your next step can be simple.','You do not need every feature today. You need one.','If you are overwhelmed, SOS first, work second.','Your future self requested fewer excuses.','A tiny honest session is still a win.','The app can guide you, but your hand must move.','Read the question twice. Answer once.','The clock is not your enemy; drifting is.','Do not confuse nervous energy with preparation.',
    'If you cannot start, write the title.','If you cannot write the title, open the notes.','If you cannot open the notes, breathe once and click Focus.','Learning is allowed to feel awkward.','The first draft is supposed to be rough.','The first answer is supposed to reveal gaps.','The first review is supposed to sting.','Then it gets better.','The hive respects returns more than streak bragging.','The Queen rewards steady wings.',
    'Your attention leaked. Patch it.','The next ten minutes are negotiable with nobody.','Stop building a perfect system and run the current one.','If the feature does not serve the session, close it.','Put the phone down unless it is the textbook.','The browser has many tabs; your mind needs one.','Choose the question that costs marks.','Make the invisible work visible.','Use review logs like a scientist.','You are collecting evidence that you can improve.',
    'One mark gained is worth the discomfort.','A weak day can still contain a strong choice.','Do not ask if you feel like it. Ask what the next action is.','When stuck, define the stuck.','When panicked, shrink the task.','When bored, test yourself.','When confident, prove it.','When tired, protect the habit.','When distracted, reset the environment.','When done, reflect.',
    'The hive does not need perfection. It needs attendance.','Every subject is less scary with a timer.','You are not lazy; you may be under-structured. Add structure.','Make one promise and keep it.','The Queen is watching for consistency.','I am watching for nonsense.','Good studying looks boring from the outside.','Boring progress is still progress.','If you want results, become repeatable.','This click can be the start or another delay. Choose.',
    'Do the work before the motivation expires.','Your confidence is waiting inside the practice set.','Stop feeding the fear with imagination. Feed the skill with reps.','A calendar does not care about panic. Plan early.','The best study method is the one you actually complete.','If you are still here, you have not quit. Use that.','The hive is ready. Are you?','One more cell in the honeycomb.','Return to the mission, recruit.','Begin.'
  ];
  var last=0;
  function extraSay(){ if(typeof showSergeantNag!=='function') return; if(Date.now()-last<14000||Math.random()>.22) return; last=Date.now(); showSergeantNag(EXTRA[Math.floor(Math.random()*EXTRA.length)], false); }
  document.addEventListener('mouseover',function(e){ if(e.target.closest&&e.target.closest('button,.card,.misc-panel,.focus-panel,.hive-coach-panel,.upgrade-panel')) extraSay(); },true);
  document.addEventListener('click',function(){ extraSay(); },true);
})();
