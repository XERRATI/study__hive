/* =====================================================================
   Study Hive — 30-ai-provider-coach.js
   Extracted from the original single-file build (script block #28).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
  function getJSON(k,f){ try { var r=localStorage.getItem(k); return r?JSON.parse(r):f; } catch(e){ return f; } }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});  }
  function toast(msg){
    var t=$('featurePolishToast'); if(!t){ document.body.insertAdjacentHTML('beforeend','<div class="feature-polish-toast" id="featurePolishToast"></div>'); t=$('featurePolishToast'); }
    t.textContent=msg; t.classList.add('show'); clearTimeout(t._x); t._x=setTimeout(function(){t.classList.remove('show');},3200);
  }

  /* Free AI options: offline fallback, Pollinations, Puter. */
  var AI_COOLDOWN_MS = 18000;
  function aiProvider(){ return get('studyhive-ai-provider-v1') || 'pollinations'; }
  function studySnapshot(){
    var sd=getJSON('study-data-v2',{subjects:{},totalMinutes:0,currentStreak:0,bestStreak:0,sessionsTotal:0});
    var subjects=Object.keys(sd.subjects||{}).map(function(k){return k+': '+sd.subjects[k]+'m';}).join(', ')||'none yet';
    return 'Study stats: total '+(sd.totalMinutes||0)+' minutes, streak '+(sd.currentStreak||0)+', best '+(sd.bestStreak||0)+', sessions '+(sd.sessionsTotal||0)+', subjects '+subjects+'. Pledge: '+(get('studyhive-pledge-v1')||'not set')+'. Main worry: '+(get('studyhive-main-worry-v1')||'not set')+'.';
  }
  function offlineBrain(role, prompt){
    var banks={
      sergeant:[
        'Order: pick the weakest topic, set a 25 minute timer, and produce one visible result before you stop.',
        'You do not need a perfect plan. You need one question, one timer, and one honest attempt.',
        'Mission brief: remove distractions, start Focus, then write a review when the timer ends.',
        'Your next action is smaller than your panic: open the notes, choose one topic, answer one question.',
        'Sergeant verdict: stop scouting the app. Start the work. Ten minutes minimum.'
      ],
      bee:[
        'Tiny hive plan: choose one subject, do 10 minutes recall, 15 minutes practice, then reward yourself with a garden check-in.',
        'The bees suggest a gentle start: one flashcard round, one water check, one Focus block.',
        'Your next best move is to turn one confusing note into three questions.',
        'Try a calm loop: breathe once, study 15 minutes, mark one mistake, write one reflection.',
        'The hive says: small honest progress beats giant imaginary plans.'
      ],
      queen:[
        'Royal advice: build a system you can repeat on a bad day. Today, protect one short focus block and log what you learned.',
        'The Queen chooses consistency: one weak topic, one active recall session, one review note.',
        'Your hive grows by cells. Finish one cell today: a card set, a practice question, or a clean summary.'
      ]
    };
    var arr=banks[role]||banks.bee;
    return arr[Math.floor(Math.random()*arr.length)]+'\n\nBased on your prompt: '+prompt.slice(0,180);
  }
  var puterLoad=null;
  function loadPuter(){
    if(window.puter) return Promise.resolve();
    if(puterLoad) return puterLoad;
    puterLoad=new Promise(function(resolve,reject){ var s=document.createElement('script'); s.src='https://js.puter.com/v2/'; s.onload=resolve; s.onerror=reject; document.head.appendChild(s); });
    return puterLoad;
  }
  function callPollinations(role, prompt){
    var system = role==='sergeant' ? 'You are Sergeant Bee: brief, motivating, funny but not cruel. Give study commands in 1-4 sentences.' : role==='queen' ? 'You are Queen Bee: wise, warm, royal, practical. Give a clear study plan in 1-5 sentences.' : 'You are Buddy Bee: kind, encouraging, practical. Give study advice in 1-4 sentences.';
    return fetch('https://text.pollinations.ai/openai', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'openai', stream:false, temperature:0.7, max_tokens:180, messages:[{role:'system',content:system},{role:'user',content:studySnapshot()+'\nUser request: '+prompt}]})
    }).then(function(r){ if(!r.ok) throw new Error('pollinations '+r.status); return r.json(); }).then(function(j){ return (j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content)||offlineBrain(role,prompt); });
  }
  function callPuter(role, prompt){
    return loadPuter().then(function(){ if(!window.puter || !puter.ai || !puter.ai.chat) throw new Error('puter unavailable'); var prefix=role==='sergeant'?'You are Sergeant Bee, a short motivating study coach. ':'You are a kind bee study coach. '; return puter.ai.chat(prefix+studySnapshot()+'\nUser request: '+prompt); }).then(function(res){ return typeof res==='string'?res:(res&&res.message&&res.message.content)||res.text||String(res); });
  }
  function callBeeAI(role, prompt){
    var last=parseInt(get('studyhive-ai-last-call-v1')||'0',10);
    if(Date.now()-last < AI_COOLDOWN_MS) return Promise.resolve(offlineBrain(role,prompt)+'\n\n(Using offline mode for a moment so the free AI is not spammed.)');
    set('studyhive-ai-last-call-v1', String(Date.now()));
    var provider=aiProvider();
    if(provider==='offline') return Promise.resolve(offlineBrain(role,prompt));
    if(provider==='puter') return callPuter(role,prompt).catch(function(){ return offlineBrain(role,prompt)+'\n\n(Puter was unavailable, so I used offline mode.)'; });
    return callPollinations(role,prompt).catch(function(){ return offlineBrain(role,prompt)+'\n\n(Pollinations was unavailable, so I used offline mode.)'; });
  }
  window.StudyHiveBeeAI = { ask: callBeeAI, offline: offlineBrain };

  /* UI panel */
  function ensureAIPanel(){
    if($('beeAIPanel')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="bee-ai-panel" id="beeAIPanel"><h3>🐝 Bee AI</h3><p>Ask the Bee, Sergeant, or Queen for a quick study plan. It uses a free provider if available and falls back offline.</p><select id="beeAIRole"><option value="bee">Buddy Bee</option><option value="sergeant">Sergeant Bee</option><option value="queen">Queen Bee</option></select><textarea id="beeAIPrompt" rows="4" placeholder="What should I study right now? I have a test soon and feel stuck."></textarea><div class="bee-ai-actions"><button id="beeAIAsk">Ask Bee AI</button><button class="secondary" id="beeAISergeant">Sergeant order</button><button class="secondary" id="beeAIClose">Close</button></div><div class="bee-ai-output" id="beeAIOutput">Ready.</div></div>');
    $('beeAIClose').onclick=function(){ $('beeAIPanel').classList.remove('show'); };
    $('beeAIAsk').onclick=function(){ askFromPanel(); };
    $('beeAISergeant').onclick=function(){ $('beeAIRole').value='sergeant'; $('beeAIPrompt').value='Give me a short order based on what I should do next.'; askFromPanel(); };
  }
  function openAIPanel(){ ensureAIPanel(); $('beeAIPanel').classList.add('show'); }
  function askFromPanel(){
    var role=$('beeAIRole').value, prompt=($('beeAIPrompt').value||'What should I study next?').trim(), out=$('beeAIOutput');
    out.textContent='Thinking...';
    callBeeAI(role,prompt).then(function(answer){ out.textContent=answer; if(role==='sergeant' && typeof showSergeantNag==='function') showSergeantNag(answer.slice(0,180), false); }).catch(function(e){ out.textContent=offlineBrain(role,prompt); });
  }

  function addAIButtons(){
    var hive=$('hiveMenuPanel');
    if(hive && !hive.querySelector('[data-hive-action="beeai"]')) hive.insertAdjacentHTML('beforeend','<button data-hive-action="beeai">🐝 Bee AI</button>');
    var settings=$('settingsPanel');
    if(settings && !$('aiProviderSelect')){
      settings.insertAdjacentHTML('beforeend','<div class="settings-divider"></div><div class="settings-section-title">🐝 Bee AI</div><div class="settings-fix-note">Free AI options: Pollinations for no-key browser AI, Puter for user-pays AI, or Offline for no network.</div><select id="aiProviderSelect" class="bee-style-select"><option value="pollinations">Pollinations free API</option><option value="puter">Puter.js user-pays API</option><option value="offline">Offline fallback only</option></select><button class="settings-action-btn" id="testBeeAISettings" style="width:100%; margin-top:8px;">Test Bee AI</button>');
      $('aiProviderSelect').value=aiProvider();
      $('aiProviderSelect').onchange=function(){ set('studyhive-ai-provider-v1', this.value); toast('Bee AI provider: '+this.value); };
      $('testBeeAISettings').onclick=function(){ openAIPanel(); $('beeAIPrompt').value='Give me a one sentence study plan.'; askFromPanel(); };
    }
  }
  document.addEventListener('click',function(e){ if(e.target && e.target.dataset && e.target.dataset.hiveAction==='beeai'){ e.preventDefault(); openAIPanel(); } },true);
  setInterval(addAIButtons,4000); addAIButtons();

  /* Broad feature polish: small quality improvements that make tools feel better. */
  function featurePolish(){
    // Make delete/destructive buttons ask less abruptly by setting titles.
    qa('.todo-del-btn,.exam-item-del,.habit-item-del,[data-del-formula]').forEach(function(b){ if(!b.title) b.title='Delete this item'; });
    // Add Enter shortcuts to common blank fields.
    var subj=$('newSubjectInput'); if(subj && !subj.dataset.enterWired){ subj.dataset.enterWired='1'; subj.addEventListener('keydown',function(e){ if(e.key==='Enter'){ e.preventDefault(); var b=$('addSubjectBtn'); if(b)b.click(); }}); }
    var formula=$('formulaTitle'); if(formula && !formula.dataset.enterWired){ formula.dataset.enterWired='1'; formula.addEventListener('keydown',function(e){ if(e.key==='Enter'){ var b=$('addFormulaBtn'); if(b)b.click(); }}); }
    // Better empty states.
    var empty=$('flashcardEmpty'); if(empty && !empty.dataset.polished){ empty.dataset.polished='1'; empty.textContent='Add your first card, or paste notes into the AI import box to build a deck.'; }
  }
  setInterval(featurePolish,5000); featurePolish();
})();
