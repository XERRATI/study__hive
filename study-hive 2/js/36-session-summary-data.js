/* =====================================================================
   Study Hive — 36-session-summary-data.js
   Extracted from the original single-file build (script block #34).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function getJSON(k,f){ try{ var r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch(e){ return f; } }
  function setJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3200); }
  function esc(s){ return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]}); }

  /* Import Hub polish: drag/drop, CSV timetable, subject chips, text file import. */
  function addImportPolish(){
    var panel=$('importPanel'); if(!panel) return;
    if(!$('importDropZone') && $('icsFileInput')){
      $('icsFileInput').insertAdjacentHTML('beforebegin','<div class="import-drop-zone" id="importDropZone">Drop .ics / .csv / .txt files here, or use the buttons below</div>');
      var dz=$('importDropZone');
      ['dragenter','dragover'].forEach(function(ev){ dz.addEventListener(ev,function(e){ e.preventDefault(); dz.classList.add('dragover'); }); });
      ['dragleave','drop'].forEach(function(ev){ dz.addEventListener(ev,function(e){ e.preventDefault(); dz.classList.remove('dragover'); }); });
      dz.addEventListener('drop', function(e){ var f=e.dataTransfer.files&&e.dataTransfer.files[0]; if(f) readImportFile(f); });
    }
    if(!$('calendarCsvText') && $('icsPaste')){
      $('icsPaste').insertAdjacentHTML('afterend','<textarea class="import-textarea" id="calendarCsvText" placeholder="Or paste simple CSV/timetable: Subject, YYYY-MM-DD, optional title" style="min-height:70px;"></textarea><div class="import-row"><button class="import-action secondary" id="importCsvCalendarBtn">Import CSV/timetable</button></div>');
      $('importCsvCalendarBtn').onclick=importCsvCalendar;
    }
    if(!$('subjectChipPreview') && $('photoText')) $('photoText').insertAdjacentHTML('afterend','<div class="import-chip-list" id="subjectChipPreview"></div>');
    if(!$('notesFileInput') && $('photoInput')) $('photoInput').insertAdjacentHTML('afterend','<input type="file" id="notesFileInput" accept=".txt,.md,text/plain,text/markdown" style="margin-top:8px;"><div class="import-small">You can also import .txt or .md notes here.</div>');
    var nf=$('notesFileInput'); if(nf && !nf.dataset.wired){ nf.dataset.wired='1'; nf.addEventListener('change',function(){ var f=this.files&&this.files[0]; if(f) readImportFile(f); }); }
  }
  function readImportFile(file){
    var name=file.name.toLowerCase(), r=new FileReader();
    r.onload=function(e){ var txt=String(e.target.result||''); if(name.endsWith('.ics')){ if($('icsPaste')) $('icsPaste').value=txt; if($('icsStatus')) $('icsStatus').textContent='Loaded '+file.name+'. Preview or import calendar events.'; } else if(name.endsWith('.csv')){ if($('calendarCsvText')) $('calendarCsvText').value=txt; if($('icsStatus')) $('icsStatus').textContent='Loaded '+file.name+'. Press Import CSV/timetable.'; } else { if($('photoText')) $('photoText').value=txt; if($('photoStatus')) $('photoStatus').textContent='Loaded text notes from '+file.name+'. You can save to Notes or make cards.'; updateSubjectChips(); } };
    r.readAsText(file);
  }
  function importCsvCalendar(){
    var text=($('calendarCsvText')&&$('calendarCsvText').value)||''; if(!text.trim()){ $('icsStatus').textContent='Paste CSV/timetable text first.'; return; }
    var rows=text.split(/\n+/).map(function(l){return l.trim();}).filter(Boolean), exams=getJSON('hive-exams-v1',[]), added=0, skipped=0;
    rows.forEach(function(row){
      var parts=row.split(',').map(function(x){return x.trim().replace(/^"|"$/g,'');});
      var subj=parts[0]||'Imported'; var date=(parts[1]||'').match(/\d{4}-\d{2}-\d{2}/); var title=parts[2]||subj;
      if(!date){ skipped++; return; }
      if(exams.some(function(e){return e.date===date[0] && String(e.subject).toLowerCase()===subj.toLowerCase();})){ skipped++; return; }
      exams.push({id:Date.now()+'-'+Math.random().toString(36).slice(2), subject:subj, title:title, date:date[0], source:'csv-import'}); added++;
    });
    setJSON('hive-exams-v1',exams); $('icsStatus').textContent='CSV imported '+added+' event(s). Skipped '+skipped+'.'; toast('📅 CSV calendar imported');
  }
  function updateSubjectChips(){
    var box=$('subjectChipPreview'), txt=($('photoText')&&$('photoText').value)||''; if(!box) return;
    var names=txt.split(/[\n,;]+/).map(function(s){return s.replace(/^[-*•\d.)\s]+/,'').trim();}).filter(function(s){return s.length>=2&&s.length<=35&&!/[.!?]{2,}/.test(s);}).slice(0,18);
    box.innerHTML=names.length?names.map(function(n){return '<button class="import-chip-btn" type="button" data-subject-chip="'+esc(n)+'">+ '+esc(n)+'</button>';}).join(''):'<span class="import-small">Subject chips appear here when text looks like a subject list.</span>';
  }
  document.addEventListener('input',function(e){ if(e.target&&e.target.id==='photoText') updateSubjectChips(); },true);
  document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('[data-subject-chip]'); if(!b)return; var data=getJSON('study-data-v2',{subjects:{}}); data.subjects=data.subjects||{}; data.subjects[b.dataset.subjectChip]=data.subjects[b.dataset.subjectChip]||0; setJSON('study-data-v2',data); b.textContent='✓ '+b.dataset.subjectChip; toast('Subject added: '+b.dataset.subjectChip); },true);

  /* Bee AI polish: templates + save/copy/use actions. */
  function addBeeAIPolish(){
    var panel=$('beeAIPanel'); if(!panel) return;
    if(!$('beeAITemplates') && $('beeAIPrompt')){
      $('beeAIPrompt').insertAdjacentHTML('beforebegin','<div class="bee-ai-template-row" id="beeAITemplates"><button data-ai-template="What should I study next based on my progress?">Next move</button><button data-ai-template="Make me a 30 minute plan for my weakest topic.">30m plan</button><button data-ai-template="Give me a strict but helpful Sergeant order.">Sergeant order</button><button data-ai-template="Turn my worry into a tiny first step.">Calm step</button></div>');
    }
    if(!$('beeAISaveNotes') && $('beeAIOutput')){
      $('beeAIOutput').insertAdjacentHTML('afterend','<div class="bee-ai-actions"><button class="secondary" id="beeAICopy">Copy</button><button class="secondary" id="beeAISaveNotes">Save to Notes</button><button class="secondary" id="beeAIMakeTasks">Make Tasks</button></div>');
      $('beeAICopy').onclick=function(){ var t=$('beeAIOutput').textContent||''; if(navigator.clipboard) navigator.clipboard.writeText(t); toast('Bee AI copied'); };
      $('beeAISaveNotes').onclick=function(){ var old=localStorage.getItem('hive-notes-v1')||''; var t='\n\n[Bee AI · '+new Date().toLocaleString()+']\n'+($('beeAIOutput').textContent||''); localStorage.setItem('hive-notes-v1',old+t); toast('Saved Bee AI to Notes'); };
      $('beeAIMakeTasks').onclick=function(){ var lines=($('beeAIOutput').textContent||'').split(/\n|•|- |\d+\./).map(function(x){return x.trim();}).filter(function(x){return x.length>8;}).slice(0,6); var todos=getJSON('hive-todos-v1',[]); lines.forEach(function(x){todos.push({id:Date.now()+'-'+Math.random().toString(36).slice(2), text:x, priority:'medium', done:false, created:Date.now()});}); setJSON('hive-todos-v1',todos); toast('Made '+lines.length+' task(s)'); };
    }
  }
  document.addEventListener('click',function(e){ var b=e.target.closest&&e.target.closest('[data-ai-template]'); if(b&&$('beeAIPrompt')){ $('beeAIPrompt').value=b.dataset.aiTemplate; } },true);

  /* Mobile launcher polish: search and recently used. */
  function addMobileLauncherPolish(){
    var sheet=$('mobileFeatureSheet'), grid=$('mobileFeatureGrid'); if(!sheet||!grid) return;
    if(!$('mobileFeatureSearch')) sheet.insertAdjacentHTML('afterbegin','<input class="mobile-feature-search" id="mobileFeatureSearch" placeholder="Search tools...">');
    var search=$('mobileFeatureSearch'); if(search&&!search.dataset.wired){ search.dataset.wired='1'; search.addEventListener('input',function(){ var q=this.value.toLowerCase(); qa('#mobileFeatureGrid button').forEach(function(btn){ btn.style.display=btn.textContent.toLowerCase().indexOf(q)>=0?'':'none'; }); }); }
    qa('#mobileFeatureGrid button').forEach(function(btn){ if(!btn.dataset.recentWire){ btn.dataset.recentWire='1'; btn.addEventListener('click',function(){ localStorage.setItem('studyhive-last-mobile-tool-v1', btn.textContent.replace(/\s+/g,' ').trim()); }); } });
    var last=localStorage.getItem('studyhive-last-mobile-tool-v1');
    if(last && !$('mobileRecentTool')) sheet.insertAdjacentHTML('afterbegin','<div id="mobileRecentTool" class="import-small">Last opened: <b>'+esc(last)+'</b></div>');
  }

  /* Queen guide polish: announce current step in title for orientation. */
  function guidePolish(){
    var p=$('queenV2Progress'), title=$('queenV2Title');
    if(p&&title&&$('queenV2Overlay')&&$('queenV2Overlay').classList.contains('show')) document.title='👑 '+title.textContent+' · Study Hive Guide';
  }
  setInterval(function(){ addImportPolish(); addBeeAIPolish(); addMobileLauncherPolish(); guidePolish(); },1400);
  addImportPolish(); addBeeAIPolish(); addMobileLauncherPolish();
})();
