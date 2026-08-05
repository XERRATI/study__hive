/* =====================================================================
   Study Hive — 08-study-data-core.js
   Extracted from the original single-file build (script block #6).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function q(sel){ return document.querySelector(sel); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });  }
  function getJSON(k, fallback){ try { var raw=localStorage.getItem(k); return raw ? JSON.parse(raw) : fallback; } catch(e){ return fallback; } }
  function setJSON(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  function todayKey(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function dateKey(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function study(){ return getJSON('study-data-v2', {subjects:{}, totalMinutes:0, currentStreak:0, bestStreak:0, dailyLog:{}, sessionsTotal:0}); }
  function subjects(){ var s=study().subjects||{}; var arr=Object.keys(s); qa('select option').forEach(function(o){ if(o.value && arr.indexOf(o.value)===-1 && !/add a subject/i.test(o.textContent)) arr.push(o.value); }); return arr.length?arr:['General Study']; }
  function exams(){ return getJSON('hive-exams-v1', []); }
  function flashcards(){ return getJSON('hive-flashcards-v1', []); }
  function saveFlashcards(cards){ setJSON('hive-flashcards-v1', cards); }
  function todos(){ return getJSON('hive-todos-v1', []); }
  function saveTodos(t){ setJSON('hive-todos-v1', t); }
  function toast(msg){ var t=$('upgradeToast'); if(!t) return; t.textContent=msg; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(function(){ t.classList.remove('show'); }, 2800); }
  function download(name, text, type){ var blob=new Blob([text], {type:type||'text/plain'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
  function minutesLabel(mins){ mins=Math.round(mins||0); var h=Math.floor(mins/60), m=mins%60; return h? h+'h '+m+'m' : m+'m'; }

  var features = [
    {id:'brief', icon:'🌅', title:'Morning Brief', summary:'A smart daily overview of your goal, next exam, streak, water and focus intention.'},
    {id:'plan', icon:'🗓️', title:'Smart Study Plan', summary:'Generate a balanced revision plan using your subjects and upcoming exam dates.'},
    {id:'intention', icon:'🎯', title:'Focus Intention', summary:'Set a one-line intention that appears on the main card before you study.'},
    {id:'blocker', icon:'🚫', title:'Distraction Blocker', summary:'Park your phone/sites with a calm fullscreen commitment timer.'},
    {id:'reflect', icon:'🪞', title:'Session Reflection', summary:'Log what worked after a focus or Pomodoro session and build a study journal.'},
    {id:'srs', icon:'🧠', title:'Spaced Review Queue', summary:'Turn flashcards into a due-today review queue with Easy / Hard scheduling.'},
    {id:'csv', icon:'📥', title:'Flashcard CSV Import/Export', summary:'Bulk import or export your flashcards in spreadsheet-friendly CSV.'},
    {id:'formulas', icon:'🧾', title:'Formula & Key Facts Bank', summary:'A searchable quick-reference sheet for formulas, quotes, rules and definitions.'},
    {id:'cram', icon:'⏰', title:'Exam Cram Mode', summary:'Pick an exam and get an urgent checklist tuned to how many days are left.'},
    {id:'rescue', icon:'🛟', title:'Grade Rescue Planner', summary:'Convert grade gaps into a realistic short action plan.'},
    {id:'analytics', icon:'📈', title:'Analytics Snapshot', summary:'A cleaner study dashboard with subject bars, streaks, sessions and heat trends.'},
    {id:'breaks', icon:'🌿', title:'Break Roulette', summary:'Random healthy breaks with a tiny timer so rest stays intentional.'},
    {id:'energy', icon:'⚡', title:'Energy-Based Study Mode', summary:'Choose your energy/stress and get a study method matched to your state.'},
    {id:'splitter', icon:'🧩', title:'Assignment Splitter', summary:'Paste a big assignment and split it into checkable tasks.'},
    {id:'wheel', icon:'🎡', title:'Subject Rotation Wheel', summary:'Let the hive pick your next subject and session length when you feel stuck.'},
    {id:'bingo', icon:'🎲', title:'Study Bingo', summary:'A daily 5×5 mini-challenge board to make productive variety fun.'},
    {id:'shop', icon:'🍯', title:'Honey Coin Rewards', summary:'Earn honey coins from study time and spend them on playful badges.'},
    {id:'account', icon:'🤝', title:'Accountability Check-in', summary:'Create a shareable promise message for a friend or parent.'},
    {id:'notesmith', icon:'🔎', title:'Notes Question Maker', summary:'Turn pasted notes into quick quiz questions without leaving the app.'},
    {id:'calm', icon:'🧘', title:'2-Minute Calm Reset', summary:'A guided emergency reset that strengthens the SOS experience.'}
  ];

  function buildChrome(){
    if ($('upgradeHubPanel')) return;
    document.body.insertAdjacentHTML('beforeend', '<button id="upgradeHubBtn">🐝 Hive Studio</button><div class="upgrade-panel" id="upgradeHubPanel" role="dialog" aria-label="Study Hive Studio"><div class="upgrade-sidebar"><div class="upgrade-head"><h3>🐝 Hive Studio</h3><button class="upgrade-close" id="upgradeCloseBtn">×</button></div><input class="upgrade-search" id="upgradeSearch" placeholder="Search hive tools…"><div class="upgrade-feature-list" id="upgradeFeatureList"></div></div><div class="upgrade-body" id="upgradeBody"></div></div><div class="upgrade-toast" id="upgradeToast"></div><div class="command-palette" id="commandPalette"><div class="command-box"><input class="command-input" id="commandInput" placeholder="Ctrl/⌘ + K — search commands, tools and coach features…"><div class="command-results" id="commandResults"></div></div></div><div class="upg-full-overlay" id="upgFullOverlay"></div>');
    $('upgradeHubBtn').addEventListener('click', function(){ openHub('brief'); });
    $('upgradeCloseBtn').addEventListener('click', closeHub);
    $('upgradeSearch').addEventListener('input', renderFeatureList);
    renderFeatureList();
    improveExistingPanels();
    addIntentionPill();
  }

  function openHub(id){ buildChrome(); $('upgradeHubPanel').classList.add('show'); renderFeature(id || currentFeature || 'brief'); }
  function closeHub(){ var p=$('upgradeHubPanel'); if(p) p.classList.remove('show'); }
  var currentFeature = 'brief';
  function renderFeatureList(){
    var term=($('upgradeSearch')&&$('upgradeSearch').value||'').toLowerCase();
    var html=features.filter(function(f){ return !term || (f.title+' '+f.summary).toLowerCase().indexOf(term)>-1; }).map(function(f){
      return '<button class="upgrade-feature-btn '+(f.id===currentFeature?'active':'')+'" data-feature="'+f.id+'"><span>'+f.icon+'</span><span>'+esc(f.title)+'</span></button>';
    }).join('');
    $('upgradeFeatureList').innerHTML=html;
    qa('.upgrade-feature-btn').forEach(function(b){ b.addEventListener('click', function(){ renderFeature(b.dataset.feature); }); });
  }
  function featureHeader(f){ return '<div class="upgrade-title"><span>'+f.icon+'</span><span>'+esc(f.title)+'</span></div><div class="upgrade-summary">'+esc(f.summary)+'</div>'; }
  function renderFeature(id){ currentFeature=id; renderFeatureList(); var f=features.filter(function(x){return x.id===id;})[0]||features[0]; var body=$('upgradeBody'); body.innerHTML=featureHeader(f)+renderContent(id); wireFeature(id); }

  function renderContent(id){
    var sd=study(), subs=subjects(), ex=exams();
    if(id==='brief'){
      var upcoming=ex.map(function(e){return {subject:e.subject, date:e.date, days:Math.ceil((new Date(e.date+'T00:00:00')-new Date(new Date().toDateString()))/86400000)};}).filter(function(e){return e.days>=0;}).sort(function(a,b){return a.days-b.days;})[0];
      var water=getJSON('hive-water-v1', {count:0,date:todayKey()}); if(water.date!==todayKey()) water.count=0;
      return '<div class="upg-grid"><div class="upg-card"><strong>🔥 Streak</strong>'+esc(sd.currentStreak||0)+' days · best '+esc(sd.bestStreak||0)+'</div><div class="upg-card"><strong>⏱️ Total studied</strong>'+minutesLabel(sd.totalMinutes||0)+' across '+esc(sd.sessionsTotal||0)+' sessions</div><div class="upg-card"><strong>📅 Next exam</strong>'+(upcoming?esc(upcoming.subject)+' · '+upcoming.days+' days left':'No exams saved yet')+'</div><div class="upg-card"><strong>💧 Hydration</strong>'+esc(water.count||0)+' / 8 glasses today</div></div><div class="upg-box" style="margin-top:12px;"><strong>Today\'s hive nudge</strong><div class="upg-output">'+esc(makeBriefNudge(sd, upcoming))+'</div><button class="upg-btn secondary" id="copyBriefBtn">Copy brief</button></div>';
    }
    if(id==='plan') return '<div class="upg-row"><label>Days <input class="upg-input" id="planDays" type="number" value="7" min="1" max="60" style="width:90px"></label><label>Minutes/day <input class="upg-input" id="planMins" type="number" value="60" min="10" max="480" style="width:120px"></label><button class="upg-btn" id="genPlanBtn">Generate Plan</button><button class="upg-btn secondary" id="copyPlanBtn">Copy</button></div><div class="upg-output" id="planOutput">Generate a plan to begin.</div>';
    if(id==='intention') return '<div class="upg-box"><div class="upg-label">My next-session intention</div><input class="upg-input" id="intentionInput" maxlength="90" placeholder="e.g. Finish biology diagrams before checking my phone"><button class="upg-btn" id="saveIntentionBtn" style="margin-top:10px;">Save intention</button><div class="upg-output">This appears under the main countdown and shows again when you start Focus.</div></div>';
    if(id==='blocker') return '<div class="upg-box"><div class="upg-label">Sites/apps I will avoid</div><textarea class="upg-textarea" id="blockSites" placeholder="TikTok\nInstagram\nYouTube Shorts"></textarea><div class="upg-row" style="margin-top:8px;"><input class="upg-input" id="blockMins" type="number" value="25" min="1" max="180" style="width:110px"><button class="upg-btn" id="startBlockBtn">Start blocker</button><button class="upg-btn secondary" id="saveBlockSitesBtn">Save list</button></div><div class="upg-output">This can\'t truly block websites from a local HTML file, but it creates a strong fullscreen commitment wall and timer.</div></div>';
    if(id==='reflect') return '<div class="upg-box"><div class="upg-row"><select class="upg-select" id="reflectMood" style="max-width:170px"><option>Focused</option><option>Distracted</option><option>Tired</option><option>Confident</option><option>Confused</option></select><input class="upg-input" id="reflectMins" type="number" placeholder="minutes" style="max-width:120px"></div><div class="upg-label">What did you learn / what next?</div><textarea class="upg-textarea" id="reflectText"></textarea><button class="upg-btn" id="saveReflectionBtn" style="margin-top:9px;">Save reflection</button></div><div id="reflectionList" class="upg-output"></div>';
    if(id==='srs') return '<div class="upg-row"><button class="upg-btn" id="refreshSrsBtn">Refresh due cards</button><button class="upg-btn secondary" id="resetSrsBtn">Reset SRS data</button></div><div id="srsList" class="upg-output"></div>';
    if(id==='csv') return '<div class="upg-box"><div class="upg-label">Paste CSV rows: front, back, subject</div><textarea class="upg-textarea" id="csvText" placeholder="What is osmosis?,Movement of water through a membrane,Biology"></textarea><div class="upg-row" style="margin-top:9px;"><button class="upg-btn" id="importCsvBtn">Import cards</button><button class="upg-btn secondary" id="exportCsvBtn">Export current cards</button></div><div class="upg-output">Tip: after importing, reopen/reload the Cards panel if it was already open.</div></div>';
    if(id==='formulas') return '<div class="upg-box"><div class="upg-row"><input class="upg-input" id="formulaTitle" placeholder="Title / topic"><input class="upg-input" id="formulaTag" placeholder="Tag" style="max-width:130px"></div><textarea class="upg-textarea" id="formulaText" placeholder="Formula, quote, rule or key fact"></textarea><button class="upg-btn" id="addFormulaBtn" style="margin-top:8px;">Add fact</button></div><input class="upg-input" id="formulaSearch" placeholder="Search bank…" style="margin-top:10px;"><div id="formulaList" class="upg-output"></div>';
    if(id==='cram') return '<div class="upg-row"><select class="upg-select" id="cramExamSelect">'+ex.map(function(e,i){return '<option value="'+i+'">'+esc(e.subject)+' — '+esc(e.date)+'</option>';}).join('')+'</select><button class="upg-btn" id="makeCramBtn">Build cram list</button></div><div id="cramOutput" class="upg-output">'+(ex.length?'Choose an exam.':'Add exams first in the Exams panel.')+'</div>';
    if(id==='rescue') return '<div class="upg-grid"><div><div class="upg-label">Current %</div><input class="upg-input" id="rescueCurrent" type="number" value="60"></div><div><div class="upg-label">Target %</div><input class="upg-input" id="rescueTarget" type="number" value="75"></div><div><div class="upg-label">Days left</div><input class="upg-input" id="rescueDays" type="number" value="14"></div><div><div class="upg-label">Hours/week possible</div><input class="upg-input" id="rescueHours" type="number" value="6"></div></div><button class="upg-btn" id="calcRescueBtn" style="margin-top:12px;">Make rescue plan</button><div id="rescueOutput" class="upg-output"></div>';
    if(id==='analytics') return '<div id="analyticsOutput" class="upg-output"></div>';
    if(id==='breaks') return '<div class="upg-box" style="text-align:center"><div id="breakIdea" style="font-size:20px;font-family:\'Baloo 2\';font-weight:800;min-height:70px;display:flex;align-items:center;justify-content:center;">Tap for a reset.</div><div class="upg-row" style="justify-content:center"><button class="upg-btn" id="newBreakBtn">🎲 New break</button><button class="upg-btn secondary" id="startBreakTimerBtn">Start 5m timer</button></div><div id="breakTimer" class="upg-output"></div></div>';
    if(id==='energy') return '<div class="upg-grid"><div><div class="upg-label">Energy</div><select class="upg-select" id="energyLevel"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></div><div><div class="upg-label">Stress</div><select class="upg-select" id="stressLevel"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></div></div><button class="upg-btn" id="recommendModeBtn" style="margin-top:12px;">Recommend mode</button><div id="energyOutput" class="upg-output"></div>';
    if(id==='splitter') return '<div class="upg-box"><div class="upg-label">Paste assignment / project brief</div><textarea class="upg-textarea" id="splitText" placeholder="Essay on the Cold War due Friday: research, outline, draft, citations..."></textarea><div class="upg-row" style="margin-top:9px"><button class="upg-btn" id="splitBtn">Split into tasks</button><button class="upg-btn secondary" id="sendTasksBtn">Save tasks to Todo</button></div></div><div id="splitOutput" class="upg-output"></div>';
    if(id==='wheel') return '<div class="upg-box" style="text-align:center"><div id="wheelPick" style="font-size:28px;font-family:\'Baloo 2\';font-weight:900;min-height:82px;display:flex;align-items:center;justify-content:center;">🎡 Ready?</div><button class="upg-btn" id="spinWheelBtn">Spin subject wheel</button></div>';
    if(id==='bingo') return '<div class="upg-row"><button class="upg-btn" id="newBingoBtn">New board</button><button class="upg-btn secondary" id="resetBingoBtn">Reset today</button></div><div class="upg-bingo" id="bingoBoard" style="margin-top:12px;"></div>';
    if(id==='shop') return '<div id="shopOutput" class="upg-output"></div>';
    if(id==='account') return '<div class="upg-box"><input class="upg-input" id="accName" placeholder="Accountability buddy name"><div class="upg-label">Promise for today</div><textarea class="upg-textarea" id="accPromise" placeholder="I will study Maths for 45 minutes before 7pm."></textarea><button class="upg-btn" id="copyAccBtn" style="margin-top:9px;">Copy check-in message</button></div><div id="accOutput" class="upg-output"></div>';
    if(id==='notesmith') return '<div class="upg-box"><div class="upg-label">Paste notes</div><textarea class="upg-textarea" id="notesmithText" placeholder="Paste notes here and generate quiz questions..."></textarea><button class="upg-btn" id="makeQuestionsBtn" style="margin-top:9px;">Make quiz questions</button><button class="upg-btn secondary" id="copyQuestionsBtn" style="margin-top:9px;">Copy</button></div><div id="questionsOutput" class="upg-output"></div>';
    if(id==='calm') return '<div class="upg-box" style="text-align:center"><div id="calmStep" style="font-size:19px;font-family:\'Baloo 2\';font-weight:800;min-height:90px;display:flex;align-items:center;justify-content:center;">Press start when the work feels too loud.</div><button class="upg-btn" id="startCalmBtn">Start 2-minute reset</button><button class="upg-btn secondary" id="stopCalmBtn">Stop</button></div>';
    return '';
  }

  function makeBriefNudge(sd, upcoming){
    var intention=localStorage.getItem('upg-focus-intention-v1')||'Pick one clear task before you start.';
    var weak=Object.entries(sd.subjects||{}).sort(function(a,b){return a[1]-b[1];})[0];
    return '1) Intention: '+intention+'\n2) Warm-up: '+(weak?('Give '+weak[0]+' 15 minutes — it has the least logged time.'): 'Do a 10-minute warm-up review.')+'\n3) '+(upcoming?('Exam focus: '+upcoming.subject+' is in '+upcoming.days+' days.'): 'Add exam dates so the hive can prioritise for you.');
  }

  function wireFeature(id){
    if(id==='brief') { $('copyBriefBtn').onclick=function(){ navigator.clipboard&&navigator.clipboard.writeText($('upgradeBody').innerText); toast('Morning brief copied'); }; }
    if(id==='plan') wirePlan();
    if(id==='intention') { $('intentionInput').value=localStorage.getItem('upg-focus-intention-v1')||''; $('saveIntentionBtn').onclick=function(){ localStorage.setItem('upg-focus-intention-v1', $('intentionInput').value.trim()); addIntentionPill(); toast('Focus intention saved'); }; }
    if(id==='blocker') wireBlocker();
    if(id==='reflect') { renderReflections(); $('saveReflectionBtn').onclick=saveReflection; }
    if(id==='srs') { renderSrs(); $('refreshSrsBtn').onclick=renderSrs; $('resetSrsBtn').onclick=function(){ localStorage.removeItem('upg-srs-v1'); renderSrs(); toast('SRS reset'); }; }
    if(id==='csv') wireCsv();
    if(id==='formulas') wireFormulas();
    if(id==='cram') wireCram();
    if(id==='rescue') $('calcRescueBtn').onclick=calcRescue;
    if(id==='analytics') renderAnalytics();
    if(id==='breaks') wireBreaks();
    if(id==='energy') $('recommendModeBtn').onclick=recommendEnergy;
    if(id==='splitter') wireSplitter();
    if(id==='wheel') $('spinWheelBtn').onclick=spinWheel;
    if(id==='bingo') wireBingo();
    if(id==='shop') renderShop();
    if(id==='account') wireAccount();
    if(id==='notesmith') wireNotesmith();
    if(id==='calm') wireCalm();
  }

  function wirePlan(){
    var last=localStorage.getItem('upg-study-plan-v1'); if(last) $('planOutput').textContent=last;
    $('genPlanBtn').onclick=function(){
      var days=parseInt($('planDays').value,10)||7, mins=parseInt($('planMins').value,10)||60, subs=subjects(), ex=exams();
      var urgent={}; ex.forEach(function(e){ var d=Math.ceil((new Date(e.date+'T00:00:00')-new Date())/86400000); if(d>=0&&d<=days+7) urgent[e.subject]=(urgent[e.subject]||0)+(days+8-d); });
      var lines=['Smart Study Plan — '+days+' days · '+mins+' min/day'];
      for(var i=0;i<days;i++){ var day=new Date(); day.setDate(day.getDate()+i); var ranked=subs.slice().sort(function(a,b){return (urgent[b]||0)-(urgent[a]||0);}); var a=ranked[i%ranked.length], b=ranked[(i+1)%ranked.length]; lines.push(dateKey(day)+': '+Math.round(mins*.6)+'m '+a+' + '+Math.round(mins*.4)+'m '+b+' · end with 5 recall questions'); }
      $('planOutput').textContent=lines.join('\n'); localStorage.setItem('upg-study-plan-v1', $('planOutput').textContent); toast('Plan generated');
    };
    $('copyPlanBtn').onclick=function(){ navigator.clipboard&&navigator.clipboard.writeText($('planOutput').textContent); toast('Plan copied'); };
  }
  function wireBlocker(){ $('blockSites').value=localStorage.getItem('upg-block-sites-v1')||''; $('saveBlockSitesBtn').onclick=function(){ localStorage.setItem('upg-block-sites-v1', $('blockSites').value); toast('Avoid list saved'); }; $('startBlockBtn').onclick=function(){ localStorage.setItem('upg-block-sites-v1', $('blockSites').value); startOverlayTimer(parseInt($('blockMins').value,10)||25, 'Distraction Blocker', 'Stay with the hive. Avoid: '+($('blockSites').value.trim().replace(/\n/g, ', ')||'your distractions')); }; }
  function saveReflection(){ var arr=getJSON('upg-reflections-v1',[]); arr.unshift({ts:Date.now(), mood:$('reflectMood').value, mins:$('reflectMins').value, text:$('reflectText').value.trim()}); setJSON('upg-reflections-v1', arr.slice(0,100)); $('reflectText').value=''; renderReflections(); toast('Reflection saved'); }
  function renderReflections(){ var arr=getJSON('upg-reflections-v1',[]); var el=$('reflectionList'); if(!el)return; el.innerHTML=arr.length?'<strong>Recent reflections</strong><ul class="upg-list">'+arr.slice(0,8).map(function(r){return '<li>'+new Date(r.ts).toLocaleString()+': <b>'+esc(r.mood)+'</b> '+(r.mins?esc(r.mins)+'m · ':'')+esc(r.text)+'</li>';}).join('')+'</ul>':'No reflections yet.'; }
  function renderSrs(){ var cards=flashcards(), srs=getJSON('upg-srs-v1',{}), today=Date.now(), due=[]; cards.forEach(function(c,i){ var rec=srs[i]||{due:0,level:0}; if(rec.due<=today) due.push({i:i,c:c,rec:rec}); }); $('srsList').innerHTML=cards.length? (due.length? due.slice(0,20).map(function(d){return '<div class="upg-card" style="margin-bottom:8px"><strong>'+esc(d.c.front)+'</strong><div>'+esc(d.c.back)+'</div><div class="upg-row" style="margin-top:8px"><button class="upg-btn secondary" data-srs="hard" data-i="'+d.i+'">Hard · tomorrow</button><button class="upg-btn" data-srs="easy" data-i="'+d.i+'">Easy · later</button></div></div>';}).join('') : '🎉 No cards due today.') : 'No flashcards yet.'; qa('[data-srs]').forEach(function(b){ b.onclick=function(){ var s=getJSON('upg-srs-v1',{}), idx=b.dataset.i, rec=s[idx]||{level:0}; if(b.dataset.srs==='easy') rec.level=(rec.level||0)+1; else rec.level=Math.max(0,(rec.level||0)-1); rec.due=Date.now()+86400000*(b.dataset.srs==='easy'?Math.min(14,Math.pow(2,rec.level)):1); s[idx]=rec; setJSON('upg-srs-v1',s); renderSrs(); }; }); }
  function wireCsv(){ $('importCsvBtn').onclick=function(){ var rows=$('csvText').value.split(/\n+/).map(function(line){return line.split(',').map(function(x){return x.trim().replace(/^"|"$/g,'');});}).filter(function(r){return r[0]&&r[1];}); var cards=flashcards(); rows.forEach(function(r){cards.push({front:r[0], back:r[1], subject:r[2]||subjects()[0], known:false});}); saveFlashcards(cards); toast('Imported '+rows.length+' flashcards'); }; $('exportCsvBtn').onclick=function(){ var csv=flashcards().map(function(c){return '"'+String(c.front).replace(/"/g,'""')+'","'+String(c.back).replace(/"/g,'""')+'","'+String(c.subject||'').replace(/"/g,'""')+'"';}).join('\n'); download('study-hive-flashcards.csv', csv, 'text/csv'); }; }
  function wireFormulas(){ renderFormulas(); $('addFormulaBtn').onclick=function(){ var arr=getJSON('upg-formulas-v1',[]); arr.unshift({id:Date.now(), title:$('formulaTitle').value.trim(), tag:$('formulaTag').value.trim(), text:$('formulaText').value.trim()}); setJSON('upg-formulas-v1', arr.filter(function(x){return x.title||x.text;})); $('formulaTitle').value=''; $('formulaTag').value=''; $('formulaText').value=''; renderFormulas(); }; $('formulaSearch').oninput=renderFormulas; }
  function renderFormulas(){ var arr=getJSON('upg-formulas-v1',[]), term=($('formulaSearch')&&$('formulaSearch').value||'').toLowerCase(); arr=arr.filter(function(x){return !term||(x.title+' '+x.tag+' '+x.text).toLowerCase().indexOf(term)>-1;}); var el=$('formulaList'); if(!el)return; el.innerHTML=arr.length?arr.map(function(x){return '<div class="upg-card" style="margin-bottom:8px"><strong>'+esc(x.title||'Untitled')+'</strong><span class="upg-chip">'+esc(x.tag||'general')+'</span><div>'+esc(x.text)+'</div><button class="upg-btn secondary" data-del-formula="'+x.id+'" style="margin-top:6px">Delete</button></div>';}).join(''):'No facts saved yet.'; qa('[data-del-formula]').forEach(function(b){b.onclick=function(){setJSON('upg-formulas-v1', getJSON('upg-formulas-v1',[]).filter(function(x){return String(x.id)!==String(b.dataset.delFormula);})); renderFormulas();};}); }
  function wireCram(){ $('makeCramBtn').onclick=function(){ var e=exams()[parseInt($('cramExamSelect').value,10)]; if(!e)return; var days=Math.ceil((new Date(e.date+'T00:00:00')-new Date(new Date().toDateString()))/86400000); var list=['Collect past papers / memo','Write your top 10 weak topics','Do one timed section','Mark in red and rewrite mistakes','Make 12 flashcards from mistakes','Sleep before midnight']; if(days<=2) list.unshift('Emergency: review only highest-value topics'); else if(days<=7) list.unshift('One full past paper under timed conditions'); $('cramOutput').innerHTML='<strong>'+esc(e.subject)+' · '+days+' days left</strong><ul class="upg-list">'+list.map(function(x,i){return '<li><label><input type="checkbox" data-cram="'+i+'"> '+esc(x)+'</label></li>';}).join('')+'</ul>'; }; }
  function calcRescue(){ var cur=+$('rescueCurrent').value, target=+$('rescueTarget').value, days=+$('rescueDays').value, hours=+$('rescueHours').value; var gap=Math.max(0,target-cur); var intensity=gap/(Math.max(1,days/7)*Math.max(1,hours)); var mode=intensity>2?'High intensity':intensity>1?'Moderate push':'Steady'; $('rescueOutput').textContent=mode+' plan:\n• Spend '+Math.round(hours*60/7)+' min/day on this subject.\n• 40% error correction, 35% exam practice, 25% recall/flashcards.\n• Every 3rd day: timed mini-test and update grade predictor.\n• Gap to close: '+gap.toFixed(1)+' percentage points.'; }
  function renderAnalytics(){ var sd=study(), entries=Object.entries(sd.subjects||{}).sort(function(a,b){return b[1]-a[1];}); var html='<div class="upg-grid"><div class="upg-card"><strong>Total</strong>'+minutesLabel(sd.totalMinutes||0)+'</div><div class="upg-card"><strong>Sessions</strong>'+(sd.sessionsTotal||0)+'</div><div class="upg-card"><strong>Current streak</strong>'+(sd.currentStreak||0)+' days</div><div class="upg-card"><strong>Best streak</strong>'+(sd.bestStreak||0)+' days</div></div><h4>Subject balance</h4>'; var max=Math.max.apply(null, entries.map(function(e){return e[1];}).concat([1])); html+=entries.length?entries.map(function(e){return '<div><b>'+esc(e[0])+'</b> · '+minutesLabel(e[1])+'<div class="upg-bar"><span style="width:'+Math.round(e[1]/max*100)+'%"></span></div></div>';}).join(''):'No subject time yet.'; $('analyticsOutput').innerHTML=html; }
  function wireBreaks(){ var ideas=['Look outside for 60 seconds','Walk to get water','Stretch wrists and neck','Do 10 slow breaths','Tidy one tiny desk area','Sunlight on your face','One song, eyes closed','20-20-20 eye break']; $('newBreakBtn').onclick=function(){ $('breakIdea').textContent=ideas[Math.floor(Math.random()*ideas.length)]; }; $('startBreakTimerBtn').onclick=function(){ startSmallTimer('breakTimer',5*60,'Break done — back to the hive 🐝'); }; }
  function recommendEnergy(){ var e=$('energyLevel').value, s=$('stressLevel').value, msg=''; if(e==='low'&&s==='high') msg='Do 10 minutes only: review flashcards + breathing. No new heavy content.'; else if(e==='high'&&s==='low') msg='Deep Work: 45 minutes on hardest subject, then past-paper questions.'; else if(s==='high') msg='Use Pomodoro: 25 minutes familiar topic, 5 minute calm break.'; else if(e==='low') msg='Light mode: summarize notes, organize tasks, or do easy recall.'; else msg='Balanced mode: 25 minutes learning + 15 minutes practice questions.'; $('energyOutput').textContent=msg; }
  var splitTasks=[]; function wireSplitter(){ $('splitBtn').onclick=function(){ var text=$('splitText').value.trim(); splitTasks=(text.match(/[^.!?;:\n]+/g)||[]).map(function(x){return x.trim();}).filter(Boolean); if(splitTasks.length<3) splitTasks=['Understand requirements','Gather resources','Create outline','Do first draft','Check and submit']; $('splitOutput').innerHTML='<ol class="upg-list">'+splitTasks.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ol>'; }; $('sendTasksBtn').onclick=function(){ var t=todos(); splitTasks.forEach(function(x){t.push({id:Date.now()+'-'+Math.random().toString(36).slice(2), text:x, priority:'medium', done:false, created:Date.now()});}); saveTodos(t); toast('Saved '+splitTasks.length+' tasks to Todo'); }; }
  function spinWheel(){ var subs=subjects(), durations=[15,25,30,45], el=$('wheelPick'), count=0; var int=setInterval(function(){ el.textContent='🎡 '+subs[Math.floor(Math.random()*subs.length)]+' · '+durations[Math.floor(Math.random()*durations.length)]+'m'; if(++count>14){clearInterval(int); toast('Subject picked');}},80); }
  function wireBingo(){ var tasks=['Read 5 pages','One flashcard round','Past-paper question','Explain aloud','Water break','Fix one mistake','Review yesterday','Make 3 cards','Tidy desk','No-phone 25m','Formula recall','One paragraph summary','Stretch break','Ask for help','Check planner','Practice diagram','Teach the wall','Mark work','Hard topic first','Sleep plan','Vocabulary x5','One timed section','Rewrite notes','Mini mind map','Celebrate progress']; function render(){ var state=getJSON('upg-bingo-'+todayKey(), {tasks:tasks.sort(function(){return Math.random()-.5}).slice(0,25), done:{}}); setJSON('upg-bingo-'+todayKey(),state); $('bingoBoard').innerHTML=state.tasks.map(function(t,i){return '<button class="'+(state.done[i]?'done':'')+'" data-bingo="'+i+'">'+esc(i===12?'FREE 🐝':t)+'</button>';}).join(''); qa('[data-bingo]').forEach(function(b){b.onclick=function(){ var s=getJSON('upg-bingo-'+todayKey(),{}); s.done=s.done||{}; s.done[b.dataset.bingo]=!s.done[b.dataset.bingo]; setJSON('upg-bingo-'+todayKey(),s); render(); };}); } $('newBingoBtn').onclick=function(){ localStorage.removeItem('upg-bingo-'+todayKey()); render(); }; $('resetBingoBtn').onclick=function(){ var s=getJSON('upg-bingo-'+todayKey(),{}); s.done={}; setJSON('upg-bingo-'+todayKey(),s); render(); }; render(); }
  function renderShop(){ var sd=study(), earned=Math.floor((sd.totalMinutes||0)/25), spent=getJSON('upg-shop-spent-v1',[]), balance=earned-spent.length*3; var items=['Golden Bee Badge','Queen Focus Crown','Forest Hive Badge','Night Owl Badge','Past Paper Warrior','Hydration Hero']; $('shopOutput').innerHTML='<div class="upg-card"><strong>🍯 Honey Coins</strong>'+balance+' available · earned from study time</div>'+items.map(function(it){var bought=spent.indexOf(it)>-1;return '<div class="upg-card" style="margin-top:8px"><strong>'+esc(it)+'</strong><button class="upg-btn '+(bought?'secondary':'')+'" data-buy="'+esc(it)+'">'+(bought?'Owned':'Buy · 3 coins')+'</button></div>';}).join(''); qa('[data-buy]').forEach(function(b){b.onclick=function(){ var spent=getJSON('upg-shop-spent-v1',[]), earned=Math.floor((study().totalMinutes||0)/25); if(spent.indexOf(b.dataset.buy)>-1)return; if(earned-spent.length*3<3){toast('Not enough honey coins yet');return;} spent.push(b.dataset.buy); setJSON('upg-shop-spent-v1',spent); renderShop(); toast('Reward unlocked');};}); }
  function wireAccount(){ $('copyAccBtn').onclick=function(){ var buddy=$('accName').value||'friend', promise=$('accPromise').value||'I will complete one focused study session today.'; var msg='Hey '+buddy+' — accountability check-in 🐝\nPromise: '+promise+'\nI\'ll message you when it\'s done.'; $('accOutput').textContent=msg; navigator.clipboard&&navigator.clipboard.writeText(msg); toast('Check-in copied'); }; }
  function wireNotesmith(){ var out=''; $('makeQuestionsBtn').onclick=function(){ var parts=($('notesmithText').value.match(/[^.!?\n]+/g)||[]).map(function(x){return x.trim();}).filter(function(x){return x.length>20;}).slice(0,10); out=parts.map(function(p,i){return (i+1)+'. What is the key idea in: "'+p.slice(0,90)+'"?\n   Answer: '+p;}).join('\n\n'); $('questionsOutput').textContent=out||'Paste more detailed notes first.'; }; $('copyQuestionsBtn').onclick=function(){ navigator.clipboard&&navigator.clipboard.writeText($('questionsOutput').textContent); toast('Questions copied'); }; }
  function wireCalm(){ var timer=null; $('startCalmBtn').onclick=function(){ var steps=['Drop your shoulders. Exhale slowly.','Inhale for 4… hold for 2… out for 6.','Name one thing you can do in the next 5 minutes.','You are safe. Begin with the smallest next action.']; var i=0; $('calmStep').textContent=steps[0]; clearInterval(timer); timer=setInterval(function(){ i++; if(i>=steps.length){ clearInterval(timer); $('calmStep').textContent='Reset complete. Choose one tiny action and start. 🐝'; } else $('calmStep').textContent=steps[i]; },30000); }; $('stopCalmBtn').onclick=function(){ clearInterval(timer); $('calmStep').textContent='Reset stopped. You can restart anytime.'; }; }

  function startSmallTimer(id, secs, done){ var el=$(id), left=secs; clearInterval(el._int); el._int=setInterval(function(){ left--; el.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0'); if(left<=0){ clearInterval(el._int); el.textContent=done; toast(done); } },1000); }
  function startOverlayTimer(mins, title, subtitle){ var ov=$('upgFullOverlay'), left=mins*60; ov.innerHTML='<div><h2>'+esc(title)+'</h2><p>'+esc(subtitle)+'</p><div id="overlayClock" style="font-size:46px;font-family:Baloo 2;font-weight:900;margin:16px 0"></div><button class="upg-btn secondary" id="closeOverlayBtn">End early</button></div>'; ov.classList.add('show'); function tick(){ $('overlayClock').textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0'); if(left--<=0){ clearInterval(ov._int); ov.classList.remove('show'); toast('Block complete'); }} tick(); clearInterval(ov._int); ov._int=setInterval(tick,1000); $('closeOverlayBtn').onclick=function(){ clearInterval(ov._int); ov.classList.remove('show'); }; }

  function improveExistingPanels(){
    qa('.misc-panel,.focus-panel,.grade-panel,.todo-panel,.breathing-panel').forEach(function(panel){
      if(panel.id==='upgradeHubPanel'||panel.querySelector('.upgrade-panel-close-x')) return;
      panel.style.position = panel.style.position || '';
      var b=document.createElement('button'); b.className='upgrade-panel-close-x'; b.textContent='×'; b.title='Close panel'; b.addEventListener('click', function(e){ e.stopPropagation(); panel.classList.remove('show'); }); panel.appendChild(b);
    });
    ['focusStopBtn','pomodoroResetBtn'].forEach(function(id){ var b=$(id); if(b&&!b.dataset.upgReflect){ b.dataset.upgReflect='1'; b.addEventListener('click', function(){ setTimeout(function(){ openHub('reflect'); }, 450); }); }});
    var fb=$('focusBtn'); if(fb&&!fb.dataset.upgIntention){ fb.dataset.upgIntention='1'; fb.addEventListener('click', function(){ var it=localStorage.getItem('upg-focus-intention-v1'); if(it) toast('Intention: '+it); }); }
  }
  function addIntentionPill(){ var it=localStorage.getItem('upg-focus-intention-v1'); var old=q('.focus-intention-pill'); if(old) old.remove(); if(!it) return; var footer=$('footerNote')||q('.footer-note'); if(footer){ footer.insertAdjacentHTML('beforebegin','<div class="focus-intention-pill">🎯 '+esc(it)+'</div>'); } }

  function buildCommands(){ var list=[]; qa('button[id]').forEach(function(b){ var txt=(b.textContent||b.title||b.id).trim(); if(txt && !/×/.test(txt)) list.push({label:txt, hint:'Open existing tool', run:function(){ b.click(); }}); }); features.forEach(function(f){ list.push({label:f.icon+' '+f.title, hint:'Hive Studio tool', run:function(){ openHub(f.id); }}); }); list.unshift({label:'✨ Open Hive Studio', hint:'20 study tools', run:function(){ openHub('brief'); }}); return list; }
  function openCommand(){ var cp=$('commandPalette'); cp.classList.add('show'); $('commandInput').value=''; renderCommands(); setTimeout(function(){ $('commandInput').focus(); },20); }
  function closeCommand(){ $('commandPalette').classList.remove('show'); }
  function renderCommands(){ var term=($('commandInput').value||'').toLowerCase(), results=buildCommands().filter(function(a){return !term||a.label.toLowerCase().indexOf(term)>-1||a.hint.toLowerCase().indexOf(term)>-1;}).slice(0,18); $('commandResults').innerHTML=results.map(function(a,i){return '<button class="command-result '+(i===0?'active':'')+'" data-cmd="'+i+'"><span>'+esc(a.label)+'</span><small>'+esc(a.hint)+'</small></button>';}).join(''); qa('[data-cmd]').forEach(function(b){ b.onclick=function(){ var a=results[+b.dataset.cmd]; closeCommand(); a.run(); }; }); $('commandResults')._results=results; }

  buildChrome();
  document.addEventListener('keydown', function(e){
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); openCommand(); }
    if(e.key==='Escape'){ closeCommand(); }
  });
  $('commandInput').addEventListener('input', renderCommands);
  $('commandInput').addEventListener('keydown', function(e){ if(e.key==='Enter'){ var r=$('commandResults')._results||[]; if(r[0]){ closeCommand(); r[0].run(); } } });
  $('commandPalette').addEventListener('click', function(e){ if(e.target.id==='commandPalette') closeCommand(); });
  // Re-run panel polishing once late-loaded/reflowed nodes settle.
  setTimeout(improveExistingPanels, 1200);
})();
