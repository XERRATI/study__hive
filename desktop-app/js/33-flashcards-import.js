/* =====================================================================
   Study Hive — 33-flashcards-import.js
   Extracted from the original single-file build (script block #31).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k,f){ try{ var r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch(e){ return f; } }
  function setJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});  }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3500); }
  function dateKey(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }

  function ensureImportRefinements(){
    if(!$('importPanel')) return;
    if(!$('previewIcsBtn') && $('importIcsBtn')) $('importIcsBtn').insertAdjacentHTML('beforebegin','<button class="import-action secondary" id="previewIcsBtn">Preview events</button> ');
    if(!$('icsPreview')) $('icsStatus').insertAdjacentHTML('beforebegin','<div class="import-preview-list" id="icsPreview" style="display:none;"></div>');
    if(!$('photoCardsBtn') && $('savePhotoTextNotesBtn')) $('savePhotoTextNotesBtn').insertAdjacentHTML('afterend','<button class="import-action secondary" id="photoCardsBtn">Make cards</button>');
    if(!$('deckImportBtn') && $('photoCardsBtn')) $('photoCardsBtn').insertAdjacentHTML('afterend','<div class="import-row"><button class="import-action secondary" id="deckImportBtn">📥 Import deck (.txt/.csv)</button><input type="file" id="deckImportFile" accept=".txt,.csv,text/plain,text/csv" style="display:none"><span class="import-status" id="deckImportStatus"></span></div>');
    if($('deckImportBtn') && !$('deckImportBtn')._deckWired){
      $('deckImportBtn')._deckWired = true;
      $('deckImportBtn').addEventListener('click', function(){ var fi=$('deckImportFile'); if(fi) fi.click(); });
      $('deckImportFile').addEventListener('change', function(){
        var file = this.files && this.files[0];
        if(!file) return;
        var reader = new FileReader();
        reader.onload = function(){
          var res = importDeckText(String(reader.result || ''));
          var st = $('deckImportStatus');
          if(st){
            if(res.added) st.innerHTML = '<span class="import-success">Added '+res.added+' card(s) from "'+esc(file.name)+'".</span>'+(res.dupes?' Skipped '+res.dupes+' duplicate(s).':'');
            else st.innerHTML = '<span class="import-danger">No cards found. Use Anki File → Export → "Notes in plain text" (.txt) or a Quizlet CSV export with front/back (term/definition) columns.</span>';
          }
          if(typeof window.showMilestoneToast === 'function') window.showMilestoneToast(res.added ? ('🐝 Deck imported: '+res.added+' cards!') : 'No cards found in that file', 4000);
          try{ if(window.renderFlashcards) window.renderFlashcards(); }catch(e){}
          this.value = '';
        };
        reader.readAsText(file);
      });
    }
    if(!$('photoCleanBtn') && $('extractSubjectsBtn')) $('extractSubjectsBtn').insertAdjacentHTML('afterend','<button class="import-action secondary" id="photoCleanBtn">Clean text</button>');
    if(!$('transcribeLang') && $('transcribeStatus')) $('transcribeStatus').insertAdjacentHTML('beforebegin','<select id="transcribeLang" class="import-textarea" style="min-height:0;height:auto;"><option value="">Auto language</option><option value="en-ZA">English (South Africa)</option><option value="en-US">English (US)</option><option value="en-GB">English (UK)</option><option value="af-ZA">Afrikaans</option><option value="zu-ZA">isiZulu</option></select>');
    if(!$('importDiagnosticsBtn') && $('transcribeStatus')) $('transcribeStatus').insertAdjacentHTML('afterend','<div class="import-row"><button class="import-action secondary" id="importDiagnosticsBtn">Test import features</button></div><div class="import-status" id="importDiagnosticsOut"></div>');
  }

  function unfoldICS(text){ return String(text||'').replace(/\r\n[ \t]/g,'').replace(/\n[ \t]/g,'').replace(/\r/g,'\n'); }
  function cleanICSText(s){ return String(s||'').replace(/\\n/g,'\n').replace(/\\,/g,',').replace(/\\;/g,';').trim(); }
  function parseDate(v){
    if(!v) return null; v=String(v).trim();
    var m=v.match(/(\d{4})(\d{2})(\d{2})/); if(!m) return null;
    return m[1]+'-'+m[2]+'-'+m[3];
  }
  function classifySubject(summary, desc){
    var s=(summary+' '+(desc||'')).toLowerCase();
    var known=['math','maths','mathematics','biology','life science','physical science','physics','chemistry','english','afrikaans','history','geography','accounting','business','economics','coding','computer','tourism'];
    for(var i=0;i<known.length;i++){ if(s.indexOf(known[i])>=0) return known[i].replace(/\b\w/g,function(c){return c.toUpperCase();}); }
    return summary.replace(/exam|test|quiz|assessment|paper|final|midterm/ig,'').replace(/[-–—:]+/g,' ').trim().slice(0,40) || summary;
  }
  function parseICS(raw){
    raw=unfoldICS(raw);
    var parts=raw.split(/BEGIN:VEVENT/i).slice(1), out=[];
    parts.forEach(function(part){
      var block=(part.split(/END:VEVENT/i)[0]||part);
      var summary=cleanICSText((block.match(/\nSUMMARY(?:;[^:]*)?:(.*)/i)||block.match(/^SUMMARY(?:;[^:]*)?:(.*)/im)||[])[1]||'Imported event');
      var desc=cleanICSText((block.match(/\nDESCRIPTION(?:;[^:]*)?:(.*)/i)||block.match(/^DESCRIPTION(?:;[^:]*)?:(.*)/im)||[])[1]||'');
      var loc=cleanICSText((block.match(/\nLOCATION(?:;[^:]*)?:(.*)/i)||block.match(/^LOCATION(?:;[^:]*)?:(.*)/im)||[])[1]||'');
      var dt=(block.match(/\nDTSTART(?:;[^:]*)?:(.*)/i)||block.match(/^DTSTART(?:;[^:]*)?:(.*)/im)||[])[1];
      var date=parseDate(dt);
      if(date) out.push({subject:classifySubject(summary,desc), title:summary, desc:desc, location:loc, date:date});
    });
    return out;
  }
  function previewICS(){
    ensureImportRefinements();
    var events=parseICS(($('icsPaste')&&$('icsPaste').value)||'');
    var prev=$('icsPreview'), status=$('icsStatus');
    if(!events.length){ if(prev)prev.style.display='none'; if(status)status.innerHTML='<span class="import-danger">No dated events found.</span> Look for .ics text containing BEGIN:VEVENT, DTSTART and SUMMARY.'; return events; }
    if(prev){ prev.style.display='block'; prev.innerHTML=events.slice(0,30).map(function(e){return '<div class="import-preview-item"><b>'+esc(e.date)+'</b> · '+esc(e.title)+'<br><span class="import-chip">Subject: '+esc(e.subject)+'</span>'+(e.location?'<span class="import-chip">'+esc(e.location)+'</span>':'')+'</div>';}).join('')+(events.length>30?'<div class="import-preview-item">+'+(events.length-30)+' more...</div>':''); }
    if(status)status.innerHTML='<span class="import-success">Previewed '+events.length+' event(s).</span> Press Import calendar events to save them.';
    return events;
  }
  function importICSRefined(){
    var events=previewICS(); if(!events.length) return;
    var examList=getJSON('hive-exams-v1',[]), before=examList.length, skipped=0;
    events.forEach(function(ev){
      var duplicate=examList.some(function(x){return x.date===ev.date && String(x.subject||'').toLowerCase()===String(ev.subject||'').toLowerCase();});
      if(duplicate){ skipped++; return; }
      examList.push({id:Date.now()+'-'+Math.random().toString(36).slice(2), subject:ev.subject, title:ev.title, date:ev.date, source:'ics-import'});
    });
    setJSON('hive-exams-v1', examList);
    var added=examList.length-before;
    var status=$('icsStatus'); if(status)status.innerHTML='<span class="import-success">Imported '+added+' event(s).</span>'+ (skipped?' Skipped '+skipped+' duplicate(s).':'') +' Reopen Exams panel if already open.';
    toast('📅 Imported '+added+' calendar events');
  }
  function cleanText(text){
    return String(text||'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').split('\n').map(function(l){return l.trim();}).filter(Boolean).join('\n');
  }
  function addSubjectsFromText(text){
    var names=String(text||'').split(/[\n,;]+/).map(function(s){return s.replace(/^[-*•\d.)\s]+/,'').trim();}).filter(function(s){return s.length>=2&&s.length<=45&&!/[.!?]{2,}/.test(s);});
    var data=getJSON('study-data-v2',{subjects:{}}); data.subjects=data.subjects||{}; var added=0;
    names.forEach(function(n){ n=n.replace(/\s+/g,' '); if(!(n in data.subjects)){ data.subjects[n]=0; added++; } });
    setJSON('study-data-v2',data);
    // Update visible selects immediately.
    if(added){ qa('select').forEach(function(sel){ if(/subject/i.test(sel.id||sel.className||'')){ names.forEach(function(n){ if(!Array.from(sel.options).some(function(o){return o.value===n;})){ var opt=document.createElement('option'); opt.value=n; opt.textContent=n; sel.appendChild(opt); } }); } }); }
    return added;
  }
  function cardsFromText(text, subject){
    var parts=cleanText(text).split(/[.!?\n]+/).map(function(s){return s.trim();}).filter(function(s){return s.length>18;}).slice(0,18);
    var cards=getJSON('hive-flashcards-v1',[]);
    parts.forEach(function(s,i){ cards.push({id: window.makeCardId ? window.makeCardId() : ('nt' + i), front:'What is the key idea in note '+(i+1)+'?', back:s, subject:subject||'Imported Notes', known:false}); });
    setJSON('hive-flashcards-v1',cards); return parts.length;
  }
  function runDiagnostics(){
    var lines=[];
    lines.push('Calendar import: OK (local parser, no internet needed)');
    lines.push('Photo preview: '+(window.FileReader?'OK':'not supported'));
    lines.push('AI image read: '+(location.protocol==='file:'?'needs hosted http/https':'can try hosted mode'));
    lines.push('Speech recognition: '+((window.SpeechRecognition||window.webkitSpeechRecognition)?'supported':'not supported in this browser'));
    lines.push('localStorage: '+(function(){try{localStorage.setItem('_i','1');localStorage.removeItem('_i');return 'OK';}catch(e){return 'blocked';}})());
    var out=$('importDiagnosticsOut'); if(out)out.textContent=lines.join('\n');
  }

  // Capture handlers override earlier rough version, avoiding duplicate imports / duplicate transcript bugs.
  document.addEventListener('click', function(e){
    if(e.target && e.target.id==='previewIcsBtn'){ e.preventDefault(); e.stopImmediatePropagation(); previewICS(); }
    if(e.target && e.target.id==='importIcsBtn'){ e.preventDefault(); e.stopImmediatePropagation(); importICSRefined(); }
    if(e.target && e.target.id==='photoCleanBtn'){ e.preventDefault(); e.stopImmediatePropagation(); var el=$('photoText'); if(el){el.value=cleanText(el.value); $('photoStatus').textContent='Cleaned text spacing.';} }
    if(e.target && e.target.id==='extractSubjectsBtn'){ e.preventDefault(); e.stopImmediatePropagation(); var added=addSubjectsFromText(($('photoText')&&$('photoText').value)||''); $('photoStatus').textContent=added?'Added '+added+' subject(s) and updated subject dropdowns.':'No clear subjects found.'; }
    if(e.target && e.target.id==='photoCardsBtn'){ e.preventDefault(); e.stopImmediatePropagation(); var made=cardsFromText(($('photoText')&&$('photoText').value)||'','Photo Notes'); $('photoStatus').textContent=made?'Created '+made+' flashcard(s) from photo text.':'Need more text to make cards.'; }
    if(e.target && e.target.id==='cardsFromTranscriptBtn'){ e.preventDefault(); e.stopImmediatePropagation(); var made2=cardsFromText(($('transcriptText')&&$('transcriptText').value||'').replace(/\([^)]*\)/g,''),'Transcript'); $('transcribeStatus').textContent=made2?'Created '+made2+' flashcard(s) from transcript.':'Need more transcript text.'; }
    if(e.target && e.target.id==='importDiagnosticsBtn'){ e.preventDefault(); e.stopImmediatePropagation(); runDiagnostics(); }
  }, true);

  // Improved transcription engine to avoid repeated interim text getting saved as final text.
  var refinedRec=null, refinedFinal='';
  document.addEventListener('click', function(e){
    if(e.target && e.target.id==='startTranscribeBtn'){
      e.preventDefault(); e.stopImmediatePropagation();
      var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SR){ $('transcribeStatus').textContent='SpeechRecognition is not supported in this browser. Try Chrome/Edge, or type notes manually.'; return; }
      refinedFinal=(($('transcriptText')&&$('transcriptText').value)||'').replace(/\([^)]*\)/g,'').trim();
      refinedRec=new SR(); refinedRec.continuous=true; refinedRec.interimResults=true; refinedRec.lang=($('transcribeLang')&&$('transcribeLang').value)||navigator.language||'en-US';
      $('transcribeStatus').textContent='Listening in '+refinedRec.lang+'...';
      refinedRec.onresult=function(ev){ var interim=''; for(var i=ev.resultIndex;i<ev.results.length;i++){ var t=ev.results[i][0].transcript.trim(); if(ev.results[i].isFinal){ refinedFinal += (refinedFinal?' ':'')+t; } else interim += (interim?' ':'')+t; } $('transcriptText').value=refinedFinal+(interim?'\n('+interim+')':''); };
      refinedRec.onerror=function(ev){ $('transcribeStatus').textContent='Transcription error: '+(ev.error||'unknown'); };
      refinedRec.onend=function(){ $('transcribeStatus').textContent='Stopped listening.'; };
      try{ refinedRec.start(); }catch(err){ $('transcribeStatus').textContent='Could not start microphone transcription.'; }
    }
    if(e.target && e.target.id==='stopTranscribeBtn'){
      e.preventDefault(); e.stopImmediatePropagation();
      if(refinedRec){ try{refinedRec.stop();}catch(err){} }
      if($('transcriptText')) $('transcriptText').value=(($('transcriptText').value||'').replace(/\([^)]*\)/g,'').trim());
    }
  }, true);

  /* ============ DECK IMPORT — Anki plain text / Quizlet CSV ============
     Anki:    File → Export → "Notes in plain text" (.txt, tab-separated,
              often with a header row). HTML inside fields is stripped.
     Quizlet: Export → CSV (Term/Definition header).
     Pure JS — no libraries, no build step: FileReader + the app's own
     card store (hive-flashcards-v1), with stable makeCardId() ids. */
  function splitCSVRow(line){
    var out=[], cur='', q=false;
    for(var i=0;i<line.length;i++){
      var c=line.charAt(i);
      if(q){ if(c==='"'){ if(line.charAt(i+1)==='"'){ cur+='"'; i++; } else q=false; } else cur+=c; }
      else if(c==='"') q=true;
      else if(c===','){ out.push(cur); cur=''; }
      else cur+=c;
    }
    out.push(cur);
    return out;
  }
  function cleanDeckField(s){
    s=String(s==null?'':s).trim();
    s=s.replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]*>/g,'');
    s=s.replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'"').replace(/&#0*39;/gi,"'").replace(/&#x27;/gi,"'");
    return s.replace(/<[^>]*>/g,'').trim();
  }
  function isDeckHeader(r){
    return /^(front|question|term|word|prompt|expression|hangul|kanji)$/i.test(String(r[0]).trim()) ||
           /^(back|answer|definition|meaning|translation|reading)$/i.test(String(r[1]).trim());
  }
  function parseDeckText(text){
    text=String(text||'').replace(/^\uFEFF/,'');
    var lines=text.split(/\r?\n/).map(function(l){ return l.trim(); }).filter(Boolean);
    if(!lines.length) return {cards:[], skipped:0, total:0};
    var tabs=0, commas=0;
    lines.slice(0,20).forEach(function(l){ tabs+=l.split('\t').length-1; commas+=(l.match(/,/g)||[]).length; });
    var delim=tabs>=commas?'\t':',';
    var rows=[];
    lines.forEach(function(l){
      var r=delim==='\t'?l.split('\t'):splitCSVRow(l);
      if(r.length>=2 && (String(r[0]).trim()||String(r[1]).trim())) rows.push(r);
    });
    var start=(rows.length && isDeckHeader(rows[0]))?1:0;
    var cards=[], seen={}, total=0;
    for(var i=start;i<rows.length;i++){
      total++;
      if(cards.length>=1000) break;
      var front=cleanDeckField(rows[i][0]), back=cleanDeckField(rows[i][1]);
      if(!front && !back) continue;
      if(!front) front='…';
      if(!back) back='…';
      var key=(front+'|'+back).toLowerCase();
      if(seen[key]) continue;
      seen[key]=1;
      cards.push({front:front, back:back});
    }
    return {cards:cards, skipped:total-cards.length, total:total};
  }
  function importDeckText(text){
    var parsed=parseDeckText(text);
    if(!parsed.cards.length) return {added:0, skipped:parsed.skipped, dupes:0};
    var cards=getJSON('hive-flashcards-v1',[]);
    if(!Array.isArray(cards)) cards=[];
    var existing={};
    cards.forEach(function(c){ existing[String(c.front+'|'+c.back).toLowerCase()]=1; });
    var added=0, dupes=0;
    parsed.cards.forEach(function(c){
      var key=(c.front+'|'+c.back).toLowerCase();
      if(existing[key]){ dupes++; return; }
      existing[key]=1;
      cards.push({id: window.makeCardId ? window.makeCardId() : (c.front+'|'+c.back), front:c.front, back:c.back, subject:'', known:false});
      added++;
    });
    if(added) setJSON('hive-flashcards-v1', cards);
    return {added:added, skipped:parsed.skipped, dupes:dupes};
  }
  window.deckImport = { parse: parseDeckText, importText: importDeckText };

  setInterval(ensureImportRefinements,5000); ensureImportRefinements();
})();
