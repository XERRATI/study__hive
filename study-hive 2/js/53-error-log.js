/* =====================================================================
   Study Hive — 53-error-log.js
   Extracted from the original single-file build (script block #51).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function report(){try{return JSON.parse(localStorage.getItem('studyhive-error-log-v1')||'[]');}catch(e){return [];}}
  function attach(){
    var panel=document.getElementById('settingsPanel');if(!panel||document.getElementById('startupReportBtn'))return;
    var button=document.createElement('button');button.id='startupReportBtn';button.className='startup-report-btn';button.textContent='🐞 View App Error Report';
    var box=document.createElement('div');box.id='startupReportBox';box.className='startup-report-box hidden';
    button.onclick=function(){var logs=report();box.textContent=logs.length?logs.slice(0,5).map(function(x){return (x.ts||'')+'\n'+(x.message||'Unknown error')+'\n'+(x.source||'')+':'+(x.line||0);}).join('\n\n'):'No JavaScript errors have been recorded on this device.';box.classList.toggle('hidden');};
    panel.appendChild(button);panel.appendChild(box);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
  setTimeout(attach,2000);
})();
