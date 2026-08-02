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
    var clearBtn=document.createElement('button');clearBtn.id='startupReportClearBtn';clearBtn.textContent='🧹 Clear log';
    clearBtn.style.cssText='margin-top:6px;font-size:11px;padding:4px 12px;border:none;border-radius:8px;background:var(--tan);color:var(--deep-brown);cursor:pointer;font-family:Fredoka,sans-serif;display:none;';
    clearBtn.onclick=function(){
      try{ localStorage.removeItem('studyhive-error-log-v1'); }catch(e){}
      box.textContent='Error log cleared.';
      clearBtn.style.display='none';
      if(typeof showMilestoneToast==='function'){ try{ showMilestoneToast('🧹 Error log cleared'); }catch(e){} }
    };
    button.onclick=function(){
      var logs=report();
      /* Ignore stale entries from the very old Study_Hive build (corrupted 49-ten-extra-secrets.js). */
      var fresh=logs.filter(function(x){ return !/ten-extra-secrets/.test(x.source||''); });
      var stale=logs.length-fresh.length;
      var lines=[];
      if(!fresh.length){
        lines.push(stale
          ? 'No current errors. ('+stale+' stale entries from an old build were ignored — press Clear log to wipe them.)'
          : 'No JavaScript errors have been recorded on this device.');
      } else {
        fresh.slice(0,5).forEach(function(x){
          var age='';
          try{ var d=new Date(x.ts); if(!isNaN(d.getTime())){ var days=Math.floor((Date.now()-d.getTime())/86400000); age=days>0?(days+'d ago'):'today'; } }catch(e){}
          lines.push('['+age+'] '+(x.ts||'').slice(0,10)+'\n'+(x.message||'Unknown error')+'\n'+(x.source||'').split('/').pop()+':'+(x.line||0));
        });
        if(stale) lines.push('('+stale+' older entries from a previous build hidden — Clear log to remove)');
      }
      box.textContent=lines.join('\n\n');
      clearBtn.style.display=logs.length?'inline-block':'none';
      box.classList.toggle('hidden');
    };
    panel.appendChild(button);panel.appendChild(box);panel.appendChild(clearBtn);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
  setTimeout(attach,2000);
})();
