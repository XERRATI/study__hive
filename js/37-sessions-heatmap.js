/* =====================================================================
   Study Hive — 37-sessions-heatmap.js
   Extracted from the original single-file build (script block #35).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k,f){ try{ var r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch(e){ return f; } }
  function setJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function get(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
  function set(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
  function today(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }
  function esc(s){ return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  /* Smart next action on main card. */
  function smartSuggestion(){
    var sd=getJSON('study-data-v2',{subjects:{},totalMinutes:0,currentStreak:0,dailyLog:{}}), subjects=Object.entries(sd.subjects||{}), exams=getJSON('hive-exams-v1',[]);
    var upcoming=exams.map(function(e){return {subject:e.subject||e.title||'Exam', days:Math.ceil((new Date((e.date||'')+'T00:00:00')-new Date(new Date().toDateString()))/86400000)};}).filter(function(e){return e.days>=0;}).sort(function(a,b){return a.days-b.days;})[0];
    var weak=subjects.length?subjects.sort(function(a,b){return a[1]-b[1];})[0][0]:'';
    if(upcoming && upcoming.days<=3) return {title:'🚨 Cram priority', body:upcoming.subject+' is in '+upcoming.days+' day(s). Do one timed practice question now.', action:'Start 25m Focus', subject:upcoming.subject};
    if(weak) return {title:'🐝 Next best move', body:'Give '+weak+' 15 minutes. It has the least logged time.', action:'Start 15m Focus', subject:weak};
    return {title:'🍯 Build the first cell', body:'Add subjects or start a general 15-minute focus block.', action:'Start Focus', subject:''};
  }
  function renderSmartNext(){
    if(!document.querySelector('.card') || $('smartNextCard')) return;
    var footer=document.getElementById('footerNote') || document.querySelector('.footer-note'); if(!footer) return;
    footer.insertAdjacentHTML('beforebegin','<div class="smart-next-card" id="smartNextCard"><strong id="smartNextTitle"></strong><span id="smartNextBody"></span><div class="smart-next-actions"><button id="smartStartBtn">Start</button><button class="secondary" id="smartCoachBtn">Ask Coach</button></div></div>');
    $('smartStartBtn').onclick=function(){ var f=$('focusBtn'); if(f) f.click(); var s=smartSuggestion(); var sel=$('subjectSelect'); if(sel && s.subject) sel.value=s.subject; };
    $('smartCoachBtn').onclick=function(){ var b=$('hiveCoachBtn'); if(b) b.click(); };
    updateSmartNext();
  }
  function updateSmartNext(){ var c=$('smartNextCard'); if(!c)return; var s=smartSuggestion(); $('smartNextTitle').textContent=s.title; $('smartNextBody').textContent=s.body; $('smartStartBtn').textContent=s.action; }
  setInterval(function(){ renderSmartNext(); updateSmartNext(); },2500);

  /* Session summary after completed study. */
  function ensureSummary(){
    if($('sessionSummaryVeil')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="session-summary-veil" id="sessionSummaryVeil"><div class="session-summary-card"><h2>🍯 Session complete</h2><p id="sessionSummaryMeta"></p><label style="font-weight:900;font-size:12px;">What went well?</label><textarea id="sessionWentWell" rows="3" placeholder="I stayed focused / understood a concept..."></textarea><label style="font-weight:900;font-size:12px;">Next tiny action</label><input id="sessionNextAction" placeholder="e.g. Review diagram mistakes tomorrow"><div class="session-summary-actions"><button id="saveSessionSummaryBtn">Save reflection</button><button class="secondary" id="makeNextTaskBtn">Make task</button><button class="secondary" id="closeSessionSummaryBtn">Close</button></div></div></div>');
    $('closeSessionSummaryBtn').onclick=function(){ $('sessionSummaryVeil').classList.remove('show'); };
    $('saveSessionSummaryBtn').onclick=function(){ saveSummary(false); };
    $('makeNextTaskBtn').onclick=function(){ saveSummary(true); };
  }
  var pendingSummary=null;
  function showSummary(subject, minutes){
    if(!minutes || minutes<1) return;
    ensureSummary(); pendingSummary={subject:subject||'General Study', minutes:minutes, ts:Date.now()};
    $('sessionSummaryMeta').textContent='You logged '+minutes+' minute(s) for '+pendingSummary.subject+'. Capture one lesson before it disappears.';
    $('sessionWentWell').value=''; $('sessionNextAction').value=''; $('sessionSummaryVeil').classList.add('show');
  }
  function saveSummary(makeTask){
    if(!pendingSummary) return;
    var arr=getJSON('studyhive-session-summaries-v1',[]);
    var item={ts:pendingSummary.ts, subject:pendingSummary.subject, minutes:pendingSummary.minutes, wentWell:($('sessionWentWell').value||'').trim(), next:($('sessionNextAction').value||'').trim()};
    arr.unshift(item); setJSON('studyhive-session-summaries-v1',arr.slice(0,120));
    if(makeTask && item.next){ var todos=getJSON('hive-todos-v1',[]); todos.push({id:Date.now()+'-'+Math.random().toString(36).slice(2), text:item.next, priority:'medium', done:false, created:Date.now()}); setJSON('hive-todos-v1',todos); }
    $('sessionSummaryVeil').classList.remove('show'); toast(makeTask?'Reflection saved + task created':'Reflection saved');
  }
  if(typeof recordStudyCompleted==='function' && !window._summaryRecordWrapped){
    window._summaryRecordWrapped=true;
    var prev=recordStudyCompleted;
    recordStudyCompleted=function(subject, minutes){ prev(subject, minutes); setTimeout(function(){ showSummary(subject, minutes); },450); };
  }

  /* Health doctor and auto-backup. */
  function healthCheck(){
    var issues=[];
    if(document.body.textContent.indexOf('NaN:NaN')>=0) issues.push('Timer NaN text detected');
    ['focusBtn','settingsBtn','dockToggleBtn','hiveMenuBtn','currentTime','days','hours','minutes','seconds'].forEach(function(id){ if(!$(id)) issues.push('Missing #'+id); });
    if(!document.querySelector('a[href="study-hive-privacy-policy.html"]')) issues.push('Privacy link missing');
    if(!document.querySelector('a[href="study-hive-terms-of-service.html"]')) issues.push('Terms link missing');
    var musicOk=!!document.querySelector('audio#customUploadedBackgroundMusic') || true;
    return issues;
  }
  function runDoctor(){
    var issues=healthCheck();
    if($('appHealthOutput')) $('appHealthOutput').innerHTML='<span class="health-dot '+(issues.length?'warn':'')+'"></span>'+(issues.length?issues.map(esc).join('\n'):'All critical checks passed.');
    return issues;
  }
  function makeBackup(reason){
    var keys=Object.keys(localStorage).filter(function(k){return /hive|study|goal|queen|flash|todo|notes|exam|mood|water|pledge|coach/i.test(k);});
    var data={ts:Date.now(), day:today(), reason:reason||'manual', values:{}}; keys.forEach(function(k){data.values[k]=localStorage.getItem(k);});
    var backups=getJSON('studyhive-auto-backups-v1',[]); backups.unshift(data); setJSON('studyhive-auto-backups-v1',backups.slice(0,10));
    return data;
  }
  function addAdvancedSettings(){
    var panel=$('settingsPanel'); if(!panel || $('appHealthOutput')) return;
    panel.insertAdjacentHTML('beforeend','<div class="settings-divider"></div><div class="settings-section-title">💎 11/10 Tools</div><div class="app-mode-card"><b>App Health</b><div id="appHealthOutput" style="white-space:pre-wrap;margin-top:6px;"></div><div class="settings-btn-row" style="margin-top:8px;"><button class="settings-action-btn" id="runHealthDoctorBtn">Run health check</button><button class="settings-action-btn" id="makeBackupNowBtn">Backup now</button></div><div class="settings-btn-row"><button class="settings-action-btn" id="restoreLatestBackupBtn">Restore latest backup</button><button class="settings-action-btn" id="densityToggleBtn">Toggle density</button></div></div>');
    $('runHealthDoctorBtn').onclick=function(){ var issues=runDoctor(); toast(issues.length?'Health found '+issues.length+' issue(s)':'Health check passed'); };
    $('makeBackupNowBtn').onclick=function(){ makeBackup('manual'); toast('Backup saved locally'); };
    $('restoreLatestBackupBtn').onclick=function(){ var backups=getJSON('studyhive-auto-backups-v1',[]); if(!backups.length){toast('No backups yet');return;} if(!confirm('Restore latest local backup? This will replace saved app data.'))return; Object.entries(backups[0].values).forEach(function(e){localStorage.setItem(e[0],e[1]);}); toast('Backup restored. Reloading...'); setTimeout(function(){location.reload();},900); };
    $('densityToggleBtn').onclick=function(){ var mode=get('studyhive-density-v1')==='compact'?'comfy':'compact'; set('studyhive-density-v1',mode); applyDensity(); toast('Density: '+mode); };
    runDoctor();
  }
  function applyDensity(){ document.body.classList.remove('density-compact','density-comfy'); document.body.classList.add('density-'+(get('studyhive-density-v1')||'comfy')); }
  applyDensity();
  setInterval(function(){ addAdvancedSettings(); runDoctor(); },3000);
  setInterval(function(){ var last=get('studyhive-last-auto-backup-day'); if(last!==today()){ makeBackup('daily'); set('studyhive-last-auto-backup-day',today()); } },60000);
})();
