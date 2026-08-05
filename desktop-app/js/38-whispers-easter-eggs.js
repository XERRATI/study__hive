/* =====================================================================
   Study Hive — 38-whispers-easter-eggs.js
   Extracted from the original single-file build (script block #36).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3500); }
  var BACKUP_PREFIXES = /^(hive|studyhive|study-data|goal|milestones|browser-notif|time-capsule|clicker|daily|challenges|night|sergeant|pollen|secrets|god|upg|queen|dock|bee|notes|water|vocab|exam|todo|habit|flash|grade|mood)/i;
  function safeGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function safeSet(k,v){ try { localStorage.setItem(k,v); return true; } catch(e){ return false; } }
  function collectBackup(){
    var keys = [];
    try { keys = Object.keys(localStorage).filter(function(k){ return BACKUP_PREFIXES.test(k); }).sort(); } catch(e) {}
    var data = { type:'StudyHiveBackup', version:2, exportedAt:new Date().toISOString(), app:'Study Hive', values:{} };
    keys.forEach(function(k){ data.values[k] = safeGet(k); });
    return data;
  }
  function backupString(){ return JSON.stringify(collectBackup(), null, 2); }
  function download(name, text){
    var blob = new Blob([text], {type:'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1200);
  }
  function openBackupCenter(){
    ensureBackupCenter();
    $('backupCenterPanel').classList.add('show');
    $('backupExportText').value = backupString();
    $('backupStatus').textContent = 'Backup ready. Download it, copy it, or save it somewhere safe.';
  }
  function ensureBackupCenter(){
    if($('backupCenterPanel')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="backup-center-panel" id="backupCenterPanel"><h2>💾 Backup Center</h2><p>Use this before closing the tab, changing phones, clearing browser data, or uploading a new version. You can download a file or copy text and paste it back later.</p><div class="backup-warning">Restoring replaces saved Study Hive progress in this browser. Download a fresh backup first if you are unsure.</div><div class="backup-actions"><button id="backupDownloadBtn">Download backup file</button><button class="secondary" id="backupCopyBtn">Copy backup text</button><button class="secondary" id="backupRefreshBtn">Refresh backup text</button></div><textarea class="backup-textarea" id="backupExportText" readonly placeholder="Your backup text appears here..."></textarea><h3 style="font-family:Baloo 2;margin:14px 0 4px;">Restore from pasted backup</h3><textarea class="backup-textarea" id="backupImportText" placeholder="Paste backup JSON here to restore..."></textarea><div class="backup-actions"><button id="backupRestoreBtn">Restore pasted backup</button><button class="secondary" id="backupLoadFileBtn">Choose backup file</button><button class="secondary" id="backupCloseBtn">Close</button></div><input type="file" id="backupFileInput" accept=".json,application/json,text/plain" style="display:none"><div class="backup-status" id="backupStatus"></div></div>');
    $('backupCloseBtn').onclick=function(){ $('backupCenterPanel').classList.remove('show'); };
    $('backupRefreshBtn').onclick=function(){ $('backupExportText').value = backupString(); $('backupStatus').textContent='Backup text refreshed.'; };
    $('backupDownloadBtn').onclick=function(){ var txt=backupString(); $('backupExportText').value=txt; var d=new Date(); var stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'-'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0'); download('study-hive-backup-'+stamp+'.json', txt); $('backupStatus').textContent='Downloaded backup file. Keep it safe.'; toast('💾 Backup downloaded'); };
    $('backupCopyBtn').onclick=function(){ var txt=$('backupExportText').value || backupString(); $('backupExportText').value=txt; if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(function(){ $('backupStatus').textContent='Copied backup text. Paste it into Notes, email, Drive, or a safe place.'; toast('📋 Backup copied'); }).catch(function(){ fallbackCopy(txt); }); } else fallbackCopy(txt); };
    $('backupRestoreBtn').onclick=function(){ restoreBackup(($('backupImportText').value||'').trim()); };
    $('backupLoadFileBtn').onclick=function(){ $('backupFileInput').click(); };
    $('backupFileInput').onchange=function(){ var f=this.files&&this.files[0]; if(!f)return; var r=new FileReader(); r.onload=function(e){ $('backupImportText').value=String(e.target.result||''); $('backupStatus').textContent='Loaded '+f.name+'. Press Restore pasted backup to apply it.'; }; r.readAsText(f); };
  }
  function fallbackCopy(txt){
    $('backupExportText').removeAttribute('readonly');
    $('backupExportText').focus(); $('backupExportText').select();
    try { document.execCommand('copy'); $('backupStatus').textContent='Copied backup text.'; toast('📋 Backup copied'); }
    catch(e){ $('backupStatus').textContent='Could not auto-copy. Select the text and copy it manually.'; }
    $('backupExportText').setAttribute('readonly','readonly');
  }
  function restoreBackup(txt){
    if(!txt){ $('backupStatus').textContent='Paste backup JSON first.'; return; }
    var data;
    try { data = JSON.parse(txt); } catch(e){ $('backupStatus').textContent='That is not valid JSON. Make sure you pasted the full backup.'; return; }
    if(!data || data.type!=='StudyHiveBackup' || !data.values){ $('backupStatus').textContent='This does not look like a Study Hive backup.'; return; }
    if(!confirm('Restore this Study Hive backup? This replaces current saved progress in this browser.')) return;
    var count=0, failed=0;
    Object.keys(data.values).forEach(function(k){ if(safeSet(k, data.values[k])) count++; else failed++; });
    $('backupStatus').textContent='Restored '+count+' saved item(s). '+(failed?failed+' failed. ':'')+'Reloading...';
    toast('✅ Backup restored');
    setTimeout(function(){ location.reload(); }, 900);
  }
  function addBackupButtons(){
    // Hive Controls
    var hive=$('hiveMenuPanel');
    if(hive && !hive.querySelector('[data-hive-action="backup-center"]')) hive.insertAdjacentHTML('beforeend','<button data-hive-action="backup-center">💾 Backup Center</button>');
    // Settings
    var settings=$('settingsPanel');
    if(settings && !$('settingsBackupCenterBtn')) settings.insertAdjacentHTML('beforeend','<div class="settings-divider"></div><div class="settings-section-title">💾 Backup Center</div><button class="settings-action-btn" id="settingsBackupCenterBtn" style="width:100%;">Download / Copy / Restore Backup</button>');
    var btn=$('settingsBackupCenterBtn'); if(btn && !btn.dataset.wired){ btn.dataset.wired='1'; btn.onclick=openBackupCenter; }
  }
  document.addEventListener('click', function(e){ if(e.target && e.target.dataset && e.target.dataset.hiveAction==='backup-center'){ e.preventDefault(); openBackupCenter(); } }, true);
  setInterval(addBackupButtons,4000);
  addBackupButtons();
  window.StudyHiveBackupCenter = { open: openBackupCenter, backup: backupString, restore: restoreBackup };

  /* ============ BACKUP NUDGE (round 13) ============
     The daily auto-backup (js/37) lives in this browser's localStorage —
     it dies with a cleared cache like everything else. The only truly
     portable copy is the downloaded file / copied text. So after real
     usage (>=120 min, >=5 sessions) we gently remind once every 21 days,
     right after an achievement unlock, to grab a portable backup. */
  var NUDGE_KEY = 'studyhive-backup-nudge-v1';
  function nudgeToday(){ var d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  function maybeBackupNudge(){
    try{
      var today = nudgeToday();
      var last = safeGet(NUDGE_KEY);
      if(last === today) return;                       /* once per day max */
      if(last){
        var diff = (new Date(today) - new Date(last)) / 86400000;
        if(diff < 21) return;                          /* every ~3 weeks */
      }
      var raw = safeGet('study-data-v2');
      if(!raw) return;
      var sd = JSON.parse(raw);
      if(!sd || (sd.totalMinutes||0) < 120 || (sd.sessionsTotal||0) < 5) return;
      safeSet(NUDGE_KEY, today);
      toast('💾 Your hive is worth backing up — open Settings → Backup Center and download a file. Auto-backups live in this browser; the file survives anywhere.');
    }catch(e){}
  }
  setTimeout(maybeBackupNudge, 9000);
  var nudgeHooked = false;
  function hookBackupNudge(){
    if(nudgeHooked) return;
    if(!window.unlockAchievement) return;
    nudgeHooked = true;
    var orig = window.unlockAchievement;
    window.unlockAchievement = function(id){
      try{ maybeBackupNudge(); }catch(e){}
      return orig.apply(this, arguments);
    };
  }
  setInterval(hookBackupNudge, 1500);
  window.__maybeBackupNudge = maybeBackupNudge;
})();
