/* =====================================================================
   Study Hive — 09-coach-focus-intention.js
   Extracted from the original single-file build (script block #7).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});  }
  function getJSON(k,f){ try { var r=localStorage.getItem(k); return r?JSON.parse(r):f; } catch(e){ return f; } }
  function setJSON(k,v){ try { localStorage.setItem(k,JSON.stringify(v)); } catch(e){} }
  function todayKey(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function subjects(){ var sd=getJSON('study-data-v2',{subjects:{}}); var arr=Object.keys(sd.subjects||{}); qa('select option').forEach(function(o){ if(o.value && arr.indexOf(o.value)<0 && !/add a subject/i.test(o.textContent)) arr.push(o.value); }); return arr.length?arr:['General Study']; }
  function studyData(){ return getJSON('study-data-v2',{subjects:{},totalMinutes:0,currentStreak:0,bestStreak:0,sessionsTotal:0,dailyLog:{}}); }
  function toast(msg){ var t=$('coachToast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._timer); t._timer=setTimeout(function(){t.classList.remove('show');},3000); }
  var KEY='hive-coach-v1';
  var state=getJSON(KEY,{topics:[], quizHistory:[], reviewLog:[]});
  var current='dashboard';
  function save(){ setJSON(KEY,state); }
  function uid(){ return Date.now()+'-'+Math.random().toString(36).slice(2,7); }
  function weakTopics(){ return state.topics.slice().sort(function(a,b){ return scoreTopic(b)-scoreTopic(a); }); }
  function scoreTopic(t){ return (Number(t.priority)||3)*(6-(Number(t.mastery)||0)) + Math.max(0, 30-(Number(t.minutes)||0))/20; }
  function avgMastery(){ if(!state.topics.length) return 0; return state.topics.reduce(function(n,t){return n+Number(t.mastery||0);},0)/state.topics.length; }
  function subjectOptions(selected){ return subjects().map(function(s){return '<option '+(s===selected?'selected':'')+'>'+esc(s)+'</option>';}).join(''); }
  function render(){
    qa('.coach-tab-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.coachTab===current); });
    var titles={dashboard:['Dashboard','Your smartest next move, chosen from your weak topics.'],topics:['Topic Mastery','Build a mastery map for every subject.'],quiz:['Adaptive Quiz','Practice retrieval using your topics and notes.'],plan:['Coach Plan','Generate a realistic plan based on weak topics.'],review:['Review Log','Reflect, spot patterns, and improve how you study.']};
    $('coachTitle').textContent=titles[current][0]; $('coachSub').textContent=titles[current][1];
    if(current==='dashboard') renderDashboard();
    if(current==='topics') renderTopics();
    if(current==='quiz') renderQuiz();
    if(current==='plan') renderPlan();
    if(current==='review') renderReview();
  }
  function open(tab){ current=tab||current; $('hiveCoachPanel').classList.add('show'); render(); }
  function close(){ $('hiveCoachPanel').classList.remove('show'); }
  $('hiveCoachBtn').addEventListener('click',function(){open('dashboard');});
  $('coachCloseBtn').addEventListener('click',close);
  qa('.coach-tab-btn').forEach(function(b){ b.addEventListener('click',function(){ current=b.dataset.coachTab; render(); }); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });

  function renderDashboard(){
    var sd=studyData(), weak=weakTopics()[0], due=weakTopics().slice(0,4), doneToday=state.reviewLog.filter(function(r){return r.day===todayKey();}).length;
    var pct=Math.round(avgMastery()/5*100);
    $('coachBody').innerHTML='<div class="coach-grid"><div class="coach-card"><strong>🍯 Mastery</strong><div style="font-size:28px;font-family:Baloo 2;font-weight:900">'+pct+'%</div><div class="coach-progress"><span style="width:'+pct+'%"></span></div></div><div class="coach-card"><strong>🔥 Streak</strong><div style="font-size:28px;font-family:Baloo 2;font-weight:900">'+esc(sd.currentStreak||0)+' days</div><div>Best: '+esc(sd.bestStreak||0)+'</div></div><div class="coach-card"><strong>🪞 Reflections today</strong><div style="font-size:28px;font-family:Baloo 2;font-weight:900">'+doneToday+'</div><div>Use reviews to improve your strategy.</div></div></div>'+
      '<div class="coach-card" style="margin-top:12px"><strong>Next best move</strong><div class="coach-output">'+(weak?('Study <b>'+esc(weak.name)+'</b> in '+esc(weak.subject)+'. Do 10 minutes recall, 20 minutes practice, then mark mistakes.'): 'Add topics in Topic Mastery so the coach can guide you.')+'</div><div class="coach-row" style="margin-top:10px"><button class="coach-btn" id="coachSetFocusBtn">Set as Focus Intention</button><button class="coach-btn secondary" id="coachMakeQuizBtn">Quiz weak topics</button></div></div>'+
      '<div class="coach-honeycomb">'+(due.length?due.map(topicCard).join(''):'<div class="coach-card">No topics yet — build your mastery map.</div>')+'</div>';
    var sf=$('coachSetFocusBtn'); if(sf) sf.onclick=function(){ if(!weak)return; localStorage.setItem('upg-focus-intention-v1','Study '+weak.name+' — recall, practice, mark mistakes'); toast('Focus intention set'); };
    var q=$('coachMakeQuizBtn'); if(q) q.onclick=function(){ current='quiz'; render(); };
  }
  function topicCard(t){ var dots=''; for(var i=1;i<=5;i++) dots+='<span class="'+(i<=Number(t.mastery||0)?'on':'')+'"></span>'; return '<div class="topic-comb" data-topic="'+t.id+'"><div class="topic-name">'+esc(t.name)+'</div><div class="topic-meta">'+esc(t.subject)+' · priority '+esc(t.priority)+' · '+esc(t.minutes||0)+'m</div><div class="mastery-dots">'+dots+'</div><div class="topic-actions"><button data-master="down" data-id="'+t.id+'">−</button><button data-master="up" data-id="'+t.id+'">+ mastery</button><button data-del-topic="'+t.id+'">×</button></div></div>'; }
  function renderTopics(){
    $('coachBody').innerHTML='<div class="coach-card"><div class="coach-grid"><div><div class="coach-label">Subject</div><select class="coach-select" id="topicSubject">'+subjectOptions()+'</select></div><div><div class="coach-label">Topic</div><input class="coach-input" id="topicName" placeholder="e.g. Photosynthesis"></div><div><div class="coach-label">Priority</div><select class="coach-select" id="topicPriority"><option value="5">Critical</option><option value="4">High</option><option value="3" selected>Normal</option><option value="2">Low</option><option value="1">Tiny</option></select></div></div><button class="coach-btn" id="addTopicBtn" style="margin-top:12px">Add topic</button></div><div class="coach-honeycomb">'+(state.topics.length?state.topics.map(topicCard).join(''):'<div class="coach-card">Add your first topic. The coach will rank what to study next.</div>')+'</div>';
    $('addTopicBtn').onclick=function(){ var name=$('topicName').value.trim(); if(!name)return; state.topics.push({id:uid(), subject:$('topicSubject').value, name:name, priority:Number($('topicPriority').value), mastery:0, minutes:0, created:Date.now()}); save(); renderTopics(); toast('Topic added'); };
    qa('[data-master]').forEach(function(b){ b.onclick=function(){ var t=state.topics.filter(function(x){return x.id===b.dataset.id;})[0]; if(!t)return; t.mastery=Math.max(0,Math.min(5,Number(t.mastery||0)+(b.dataset.master==='up'?1:-1))); save(); renderTopics(); }; });
    qa('[data-del-topic]').forEach(function(b){ b.onclick=function(){ state.topics=state.topics.filter(function(x){return x.id!==b.dataset.delTopic;}); save(); renderTopics(); }; });
  }
  function renderQuiz(){
    var opts=weakTopics().slice(0,12).map(function(t){return '<option value="'+t.id+'">'+esc(t.subject)+' · '+esc(t.name)+'</option>';}).join('');
    $('coachBody').innerHTML='<div class="coach-card"><div class="coach-row"><select class="coach-select" id="quizTopic" style="max-width:320px">'+opts+'</select><button class="coach-btn" id="buildCoachQuizBtn">Build adaptive quiz</button></div><div class="coach-label">Optional notes to include</div><textarea class="coach-textarea" id="quizNotes" placeholder="Paste notes. The coach will turn sentences into retrieval questions."></textarea></div><div id="coachQuizArea"></div>';
    $('buildCoachQuizBtn').onclick=buildQuiz;
  }
  function buildQuiz(){
    var topic=state.topics.filter(function(t){return t.id===$('quizTopic').value;})[0] || weakTopics()[0];
    var notes=($('quizNotes').value.match(/[^.!?\n]+/g)||[]).map(function(x){return x.trim();}).filter(function(x){return x.length>18;}).slice(0,5);
    var qs=[]; if(topic){ qs.push({q:'Explain '+topic.name+' without looking at your notes.', a:'Key points should match your class notes for '+topic.subject+'.'}); qs.push({q:'What is one common mistake in '+topic.name+'?', a:'Look for a misconception, formula error, or missing step.'}); qs.push({q:'Create one exam-style question about '+topic.name+'.', a:'Then solve it and mark your steps.'}); }
    notes.forEach(function(n){ qs.push({q:'What is the key idea in: "'+n.slice(0,100)+'"?', a:n}); });
    if(!qs.length) qs=[{q:'Add topics or paste notes first.',a:'Then build a quiz.'}];
    $('coachQuizArea').innerHTML=qs.map(function(x,i){return '<div class="coach-quiz-card"><strong>Q'+(i+1)+': '+esc(x.q)+'</strong><div class="coach-output" id="ans'+i+'" style="display:none;margin-top:8px">'+esc(x.a)+'</div><div class="coach-row" style="margin-top:10px"><button class="coach-btn secondary" data-reveal="'+i+'">Reveal</button><button class="coach-btn secondary" data-wrong="'+(topic?topic.id:'')+'">Hard</button><button class="coach-btn" data-right="'+(topic?topic.id:'')+'">Got it</button></div></div>';}).join('');
    qa('[data-reveal]').forEach(function(b){b.onclick=function(){ var a=$('ans'+b.dataset.reveal); a.style.display=a.style.display==='none'?'block':'none';};});
    qa('[data-right]').forEach(function(b){b.onclick=function(){ markQuiz(b.dataset.right,true);};});
    qa('[data-wrong]').forEach(function(b){b.onclick=function(){ markQuiz(b.dataset.wrong,false);};});
  }
  function markQuiz(id, right){ var t=state.topics.filter(function(x){return x.id===id;})[0]; if(t){ t.mastery=Math.max(0,Math.min(5,Number(t.mastery||0)+(right?0.35:-0.15))); } state.quizHistory.unshift({ts:Date.now(), topic:id, right:right}); save(); toast(right?'Nice — mastery nudged up':'Marked hard — coach will prioritise it'); }
  function renderPlan(){ $('coachBody').innerHTML='<div class="coach-card"><div class="coach-row"><label>Days <input class="coach-input" id="coachDays" type="number" value="7" min="1" max="45" style="width:90px"></label><label>Minutes/day <input class="coach-input" id="coachMins" type="number" value="60" min="10" max="300" style="width:120px"></label><button class="coach-btn" id="coachGenPlanBtn">Generate coach plan</button><button class="coach-btn secondary" id="coachCopyPlanBtn">Copy</button></div></div><div class="coach-card coach-output" id="coachPlanOut" style="margin-top:12px">Generate a plan from your weakest topics.</div>'; $('coachGenPlanBtn').onclick=genCoachPlan; $('coachCopyPlanBtn').onclick=function(){ navigator.clipboard&&navigator.clipboard.writeText($('coachPlanOut').textContent); toast('Coach plan copied'); }; }
  function genCoachPlan(){ var days=+$('coachDays').value||7, mins=+$('coachMins').value||60, weak=weakTopics(); var lines=['Hive Coach Plan']; for(var i=0;i<days;i++){ var t=weak[i%Math.max(1,weak.length)]; var d=new Date(); d.setDate(d.getDate()+i); lines.push(d.toLocaleDateString()+': '+(t? t.subject+' — '+t.name : 'General review')+' · '+Math.round(mins*.45)+'m learn, '+Math.round(mins*.4)+'m practice, '+Math.round(mins*.15)+'m recall'); } $('coachPlanOut').textContent=lines.join('\n'); }
  function renderReview(){ $('coachBody').innerHTML='<div class="coach-card"><div class="coach-row"><select class="coach-select" id="reviewTopic" style="max-width:260px">'+state.topics.map(function(t){return '<option value="'+t.id+'">'+esc(t.subject)+' · '+esc(t.name)+'</option>';}).join('')+'</select><input class="coach-input" id="reviewMinutes" type="number" placeholder="minutes" style="max-width:110px"></div><div class="coach-label">What changed after this session?</div><textarea class="coach-textarea" id="reviewText" placeholder="Mistakes fixed, what still feels weak, next action..."></textarea><button class="coach-btn" id="saveCoachReviewBtn" style="margin-top:10px">Save review</button></div><div class="coach-output" id="coachReviewList" style="margin-top:12px"></div>'; $('saveCoachReviewBtn').onclick=saveReview; renderReviewList(); }
  function saveReview(){ var id=$('reviewTopic').value, t=state.topics.filter(function(x){return x.id===id;})[0]; var mins=+$('reviewMinutes').value||0; if(t) t.minutes=Number(t.minutes||0)+mins; state.reviewLog.unshift({ts:Date.now(), day:todayKey(), topic:id, topicName:t?t.name:'General', minutes:mins, text:$('reviewText').value.trim()}); save(); toast('Review saved'); renderReview(); }
  function renderReviewList(){ var el=$('coachReviewList'); if(!el)return; el.innerHTML=state.reviewLog.length?state.reviewLog.slice(0,12).map(function(r){return '<div class="coach-card" style="margin-bottom:8px"><strong>'+new Date(r.ts).toLocaleString()+' · '+esc(r.topicName)+'</strong>'+esc(r.minutes)+'m · '+esc(r.text)+'</div>';}).join(''):'No coach reviews yet.'; }

  // Make plain emoji swarm become richer art as bees are created.
  function upgradeBee(el){
    if(!el || !el.classList || !el.classList.contains('hive-bee-el') || el.dataset.beeArt==='1') return;
    el.dataset.beeArt='1'; el.classList.add('bee-art-upgraded');
    el.innerHTML='<span class="bee-core"><span class="bee-wing-art left"></span><span class="bee-wing-art right"></span><span class="bee-stinger-art"></span><span class="bee-body-art"></span><span class="bee-head-art"></span><span class="bee-eye-art"></span><span class="bee-antenna-art"></span><span class="bee-pollen-art"></span><span class="bee-crown-art">👑</span><span class="bee-zzz-art">z</span></span>';
  }
  function upgradeAllBees(){ qa('.hive-bee-el').forEach(upgradeBee); }
  var swarm=$('hiveSwarm'); if(swarm){ upgradeAllBees(); new MutationObserver(function(muts){ muts.forEach(function(m){ Array.prototype.forEach.call(m.addedNodes,function(n){ if(n.nodeType===1){ upgradeBee(n); if(n.querySelectorAll) Array.prototype.forEach.call(n.querySelectorAll('.hive-bee-el'),upgradeBee); } }); }); }).observe(swarm,{childList:true,subtree:true}); }
  setInterval(upgradeAllBees,2500);
  setInterval(function(){ var bees=qa('.hive-bee-el.bee-art-upgraded:not(.sleeping)'); if(!bees.length)return; var b=bees[Math.floor(Math.random()*bees.length)], r=b.getBoundingClientRect(); var s=document.createElement('div'); s.className='bee-spark-art'; s.textContent=Math.random()<.5?'✦':'•'; s.style.left=(r.left+r.width/2)+'px'; s.style.top=(r.top+r.height/2)+'px'; document.body.appendChild(s); setTimeout(function(){s.remove();},1150); },650);
})();
