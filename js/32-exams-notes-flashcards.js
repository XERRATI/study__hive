/* =====================================================================
   Study Hive — 32-exams-notes-flashcards.js
   Extracted from the original single-file build (script block #30).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k,f){ try{ var r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch(e){ return f; } }
  function setJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});  }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }

  function ensureImportHub(){
    if($('importBtn')) return;
    document.body.insertAdjacentHTML('beforeend', '<button class="misc-btn dock-item" id="importBtn">📥 Import</button><div class="misc-panel" id="importPanel" style="width:320px;"><h4>Import Hub 📥</h4><div class="import-tabs"><button class="import-tab active" data-import-tab="calendar">📅 Calendar</button><button class="import-tab" data-import-tab="photo">📸 Photo</button><button class="import-tab" data-import-tab="transcribe">🎙️ Transcribe</button></div><div class="import-section active" id="importCalendarSec"><div class="import-small">Import an .ics calendar file. Events with dates become Exam items.</div><input type="file" id="icsFileInput" accept=".ics,text/calendar"><textarea class="import-textarea" id="icsPaste" placeholder="Or paste .ics calendar text here..."></textarea><div class="import-row"><button class="import-action" id="importIcsBtn">Import calendar events</button><button class="import-action secondary" id="clearIcsBtn">Clear</button></div><div class="import-status" id="icsStatus"></div></div><div class="import-section" id="importPhotoSec"><div class="import-small">Take/upload a picture of notes or subjects. AI reading works best online over https; fallback lets you type/edit extracted text.</div><input type="file" id="photoInput" accept="image/*" capture="environment"><img class="import-preview-img" id="photoPreview" alt="Selected photo preview"><div class="import-row"><button class="import-action" id="readPhotoBtn">Try AI read image</button><button class="import-action secondary" id="extractSubjectsBtn">Extract subjects</button><button class="import-action secondary" id="savePhotoTextNotesBtn">Save text to Notes</button></div><textarea class="import-textarea" id="photoText" placeholder="Extracted or typed text appears here. You can edit it before saving."></textarea><div class="import-status" id="photoStatus"></div></div><div class="import-section" id="importTranscribeSec"><div class="import-small">Use live speech-to-text for spoken notes. Works in browsers that support SpeechRecognition.</div><div class="import-row"><button class="import-action" id="startTranscribeBtn">Start dictation</button><button class="import-action secondary" id="stopTranscribeBtn">Stop</button><button class="import-action secondary" id="saveTranscriptNotesBtn">Save to Notes</button><button class="import-action secondary" id="cardsFromTranscriptBtn">Make cards</button></div><textarea class="import-textarea" id="transcriptText" placeholder="Transcript will appear here..."></textarea><div class="import-status" id="transcribeStatus"></div></div></div>');
    wireImportHub();
    placeImportButton();
  }
  function placeImportButton(){
    var bar=$('toolsDockBar'), btn=$('importBtn');
    if(bar && btn && !bar.contains(btn) && !document.body.classList.contains('is-mobile')) bar.appendChild(btn);
    var mobile=$('mobileDockBar');
    if(mobile && btn && (document.body.classList.contains('is-mobile')||document.body.classList.contains('force-mobile')) && !mobile.contains(btn)){ btn.classList.add('mb-item'); btn.classList.remove('dock-item'); mobile.appendChild(btn); }
  }
  function wireImportHub(){
    $('importBtn').addEventListener('click', function(){ $('importPanel').classList.toggle('show'); });
    qa('.import-tab').forEach(function(b){ b.addEventListener('click', function(){ qa('.import-tab').forEach(function(x){x.classList.remove('active')}); qa('.import-section').forEach(function(x){x.classList.remove('active')}); b.classList.add('active'); var sec=$('import'+b.dataset.importTab.charAt(0).toUpperCase()+b.dataset.importTab.slice(1)+'Sec'); if(sec) sec.classList.add('active'); }); });
    $('icsFileInput').addEventListener('change', function(){ var f=this.files&&this.files[0]; if(!f)return; var r=new FileReader(); r.onload=function(e){ $('icsPaste').value=String(e.target.result||''); $('icsStatus').textContent='Loaded '+f.name+'. Press Import calendar events.'; }; r.readAsText(f); });
    $('importIcsBtn').addEventListener('click', importICS);
    $('clearIcsBtn').addEventListener('click', function(){ $('icsPaste').value=''; $('icsStatus').textContent=''; });
    $('photoInput').addEventListener('change', previewPhoto);
    $('readPhotoBtn').addEventListener('click', readPhotoAI);
    $('extractSubjectsBtn').addEventListener('click', function(){ var added=extractSubjects(($('photoText').value||'')); $('photoStatus').textContent=added?('Added '+added+' subject(s). Refresh panels if needed.'): 'No clear subjects found. Put one subject per line or comma-separated.'; });
    $('savePhotoTextNotesBtn').addEventListener('click', function(){ appendToNotes($('photoText').value, 'Photo import'); $('photoStatus').textContent='Saved/imported text to Notes.'; });
    $('startTranscribeBtn').addEventListener('click', startTranscription);
    $('stopTranscribeBtn').addEventListener('click', stopTranscription);
    $('saveTranscriptNotesBtn').addEventListener('click', function(){ appendToNotes($('transcriptText').value, 'Transcript'); $('transcribeStatus').textContent='Saved transcript to Notes.'; });
    $('cardsFromTranscriptBtn').addEventListener('click', cardsFromTranscript);
  }
  function unfoldICSLine(text){ return text.replace(/\r\n[ \t]/g,'').replace(/\n[ \t]/g,''); }
  function parseICSDate(v){
    if(!v) return null; v=String(v).trim();
    var m=v.match(/(\d{4})(\d{2})(\d{2})/); if(!m)return null;
    return m[1]+'-'+m[2]+'-'+m[3];
  }
  function importICS(){
    var raw=unfoldICSLine($('icsPaste').value||''), events=[], parts=raw.split(/BEGIN:VEVENT/i).slice(1);
    parts.forEach(function(part){
      var end=part.split(/END:VEVENT/i)[0]||part;
      var summary=(end.match(/SUMMARY(?:;[^:]*)?:(.*)/i)||[])[1]||'Imported event';
      var dt=(end.match(/DTSTART(?:;[^:]*)?:(.*)/i)||end.match(/DTSTART;VALUE=DATE:(.*)/i)||[])[1];
      var date=parseICSDate(dt);
      if(date) events.push({subject:summary.replace(/\\,/g,',').trim(), date:date});
    });
    if(!events.length){ $('icsStatus').textContent='No dated events found. Make sure the .ics has DTSTART and SUMMARY lines.'; return; }
    var examList=getJSON('hive-exams-v1',[]);
    events.forEach(function(ev){ examList.push({id:Date.now()+'-'+Math.random().toString(36).slice(2), subject:ev.subject, date:ev.date}); });
    setJSON('hive-exams-v1', examList);
    $('icsStatus').textContent='Imported '+events.length+' event(s) into Exam Countdown. Reopen Exams panel if it was already open.';
    toast('📅 Calendar imported: '+events.length+' events');
  }
  function previewPhoto(){
    var f=$('photoInput').files&&$('photoInput').files[0]; if(!f)return;
    var r=new FileReader(); r.onload=function(e){ $('photoPreview').src=e.target.result; $('photoPreview').style.display='block'; $('photoStatus').textContent='Photo loaded. Try AI read image, or type what you see into the box.'; $('photoPreview').dataset.dataUrl=e.target.result; }; r.readAsDataURL(f);
  }
  var puterLoad=null;
  function loadPuter(){ if(window.puter)return Promise.resolve(); if(puterLoad)return puterLoad; puterLoad=new Promise(function(resolve,reject){ var s=document.createElement('script'); s.src='https://js.puter.com/v2/'; s.onload=resolve; s.onerror=reject; document.head.appendChild(s); }); return puterLoad; }
  function readPhotoAI(){
    var data=$('photoPreview').dataset.dataUrl; if(!data){ $('photoStatus').textContent='Choose or take a photo first.'; return; }
    if(location.protocol==='file:'){ $('photoStatus').textContent='AI image reading usually needs the app hosted over http/https. You can still type the text manually below.'; return; }
    $('photoStatus').textContent='Trying AI image read...';
    loadPuter().then(function(){
      if(!window.puter || !puter.ai || !puter.ai.chat) throw new Error('Puter AI unavailable');
      return puter.ai.chat('Extract all readable text from this study photo. If it is a subject list, output one subject per line. If it is notes, keep the text clean and organized.', data);
    }).then(function(res){ var txt=typeof res==='string'?res:(res&&res.message&&res.message.content)||res.text||String(res); $('photoText').value=txt; $('photoStatus').textContent='AI extracted text. Check/edit it before saving.'; }).catch(function(){ $('photoStatus').textContent='AI could not read the image here. Type/edit the text manually below.'; });
  }
  function extractSubjects(text){
    var names=String(text||'').split(/[\n,;]+/).map(function(s){return s.replace(/^[-*•\d.)\s]+/,'').trim();}).filter(function(s){ return s.length>=2 && s.length<=40 && !/[.!?]{2,}/.test(s); });
    var data=getJSON('study-data-v2',{subjects:{}}); data.subjects=data.subjects||{}; var added=0;
    names.forEach(function(n){ if(!(n in data.subjects)){ data.subjects[n]=0; added++; } });
    setJSON('study-data-v2',data); return added;
  }
  function appendToNotes(text,label){
    text=String(text||'').trim(); if(!text)return;
    var old=''; try{ old=localStorage.getItem('hive-notes-v1')||''; }catch(e){}
    var stamp='\n\n['+label+' · '+new Date().toLocaleString()+']\n'+text;
    try{ localStorage.setItem('hive-notes-v1', old+stamp); }catch(e){}
    var area=$('notesTextarea'); if(area) area.value=old+stamp;
  }
  var recog=null;
  function startTranscription(){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ $('transcribeStatus').textContent='SpeechRecognition is not supported in this browser. Try Chrome/Edge, or type notes manually.'; return; }
    recog=new SR(); recog.continuous=true; recog.interimResults=true; recog.lang=navigator.language||'en-US';
    $('transcribeStatus').textContent='Listening...';
    var finalText=$('transcriptText').value||'';
    recog.onresult=function(e){ var interim=''; for(var i=e.resultIndex;i<e.results.length;i++){ var t=e.results[i][0].transcript; if(e.results[i].isFinal) finalText += (finalText?' ':'')+t.trim(); else interim += t; } $('transcriptText').value=finalText+(interim?'\n('+interim+')':''); };
    recog.onerror=function(e){ $('transcribeStatus').textContent='Transcription error: '+(e.error||'unknown'); };
    recog.onend=function(){ $('transcribeStatus').textContent='Stopped listening.'; };
    try{ recog.start(); }catch(e){ $('transcribeStatus').textContent='Could not start microphone transcription.'; }
  }
  function stopTranscription(){ if(recog){ try{recog.stop();}catch(e){} } }
  function cardsFromTranscript(){
    var text=($('transcriptText').value||'').replace(/\([^)]*\)/g,'').trim(); if(!text){ $('transcribeStatus').textContent='No transcript text yet.'; return; }
    var parts=text.split(/[.!?\n]+/).map(function(s){return s.trim();}).filter(function(s){return s.length>20;}).slice(0,12);
    if(!parts.length){ $('transcribeStatus').textContent='Need longer sentences to make cards.'; return; }
    var cards=getJSON('hive-flashcards-v1',[]);
    parts.forEach(function(s,i){ cards.push({id: window.makeCardId ? window.makeCardId() : ('tr' + i), front:'Transcript idea '+(i+1)+': what is the key point?', back:s, subject:'Transcript', known:false}); });
    setJSON('hive-flashcards-v1',cards); $('transcribeStatus').textContent='Created '+parts.length+' flashcard(s) from transcript.'; toast('🧠 Transcript cards created');
  }
  ensureImportHub(); setInterval(function(){ ensureImportHub(); placeImportButton(); },2000);
})();
