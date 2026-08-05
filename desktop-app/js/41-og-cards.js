/* =====================================================================
   Study Hive — 41-og-cards.js
   Extracted from the original single-file build (script block #39).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function getJSON(k,f){ try{ var r=localStorage.getItem(k); return r?JSON.parse(r):f; }catch(e){ return f; } }
  function setJSON(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function get(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
  function set(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3600); }
  function esc(s){ if(window.shEsc) return window.shEsc(s);  return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});  }
  // IMPORTANT: for a real global first-1000 limit, connect this to a backend endpoint.
  // Expected response: { ok:true, number:123, name:"Name", email:"email", lifetime:true }
  var OG_CLAIM_ENDPOINT = localStorage.getItem('studyhive-og-endpoint-v1') || ''; // e.g. https://your-worker.yourname.workers.dev/claim-og
  function fingerprint(){
    var raw=[navigator.userAgent,navigator.language,screen.width+'x'+screen.height,new Date().getTimezoneOffset()].join('|');
    var h=0; for(var i=0;i<raw.length;i++){ h=((h<<5)-h)+raw.charCodeAt(i); h|=0; }
    return 'fh_'+Math.abs(h);
  }
  function og(){ return getJSON('studyhive-og-founder-card-v1', null); }
  function saveOG(data){ setJSON('studyhive-og-founder-card-v1', data); renderOGBadge(); }
  function ensurePanel(){
    if($('ogCardPanel')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="og-card-panel" id="ogCardPanel"><h2>👑 OG Founder Card</h2><p>The first 1000 official users can receive an OG Founder Card and free-for-life status. A real first-1000 limit needs a small backend counter; this app includes the frontend and a local preview until connected.</p><input class="og-input" id="ogName" placeholder="Your name"><input class="og-input" id="ogEmail" placeholder="Email for free-for-life record"><div class="og-actions"><button id="claimOGBtn">Claim OG Card</button><button class="secondary" id="downloadOGBtn">Download card</button><button class="secondary" id="closeOGBtn">Close</button></div><div id="ogCardRender"></div><div class="og-status" id="ogStatus"></div></div>');
    $('closeOGBtn').onclick=function(){ $('ogCardPanel').classList.remove('show'); };
    $('claimOGBtn').onclick=claimOG;
    $('downloadOGBtn').onclick=downloadOGCard;
  }
  function renderCard(data){
    if(!data){ $('ogCardRender').innerHTML=''; return; }
    $('ogCardRender').innerHTML='<div class="og-founder-card" id="ogFounderCard"><div class="og-card-content"><div class="og-label">Study Hive Founder Pass</div><div class="og-title">OG Hive Member</div><div class="og-number">🐝 #'+String(data.number||'PREVIEW').padStart(4,'0')+'</div><div class="og-benefit">'+esc(data.name||'Founder')+' gets Study Hive and future core developments free for life, subject to official verification.</div><div style="font-size:11px;margin-top:12px;opacity:.85;">© 2026 the Founder · studyhive.co.za</div></div><div class="og-watermark">👑🐝</div></div>';
  }
  function openOG(){ ensurePanel(); var data=og(); renderCard(data); $('ogCardPanel').classList.add('show'); $('ogStatus').textContent=data?'Your OG card is saved on this device.':'Enter name/email and claim.'; }
  function claimOG(){
    var name=($('ogName').value||'').trim(); var email=($('ogEmail').value||'').trim();
    if(!name || !email){ $('ogStatus').textContent='Enter both name and email first.'; return; }
    $('ogStatus').textContent='Claiming...';
    if(OG_CLAIM_ENDPOINT){
      fetch(OG_CLAIM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,fingerprint:fingerprint(),app:'Study Hive'})}).then(function(r){return r.json();}).then(function(j){ if(!j.ok) throw new Error(j.error||'Claim failed'); var data={name:j.name||name,email:j.email||email,number:j.number,lifetime:!!j.lifetime,official:true,claimedAt:new Date().toISOString()}; saveOG(data); renderCard(data); $('ogStatus').textContent='Official OG Founder Card claimed.'; toast('👑 OG Founder Card claimed'); }).catch(function(e){ $('ogStatus').textContent='Could not claim official card: '+e.message; });
    } else {
      var localCount=parseInt(get('studyhive-local-og-preview-count-v1')||'0',10)+1; set('studyhive-local-og-preview-count-v1',String(localCount));
      var num=Math.min(1000, localCount);
      var data={name:name,email:email,number:num,lifetime:true,official:false,preview:true,claimedAt:new Date().toISOString()};
      saveOG(data); renderCard(data); $('ogStatus').textContent='Preview OG card saved locally. Connect OG_CLAIM_ENDPOINT for a real global first-1000 counter.'; toast('👑 OG preview card created');
    }
  }
  function downloadOGCard(){
    var data=og(); if(!data){ $('ogStatus').textContent='Claim a card first.'; return; }
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#1f160e"/><stop offset="0.55" stop-color="#5a3613"/><stop offset="1" stop-color="#e29b1c"/></linearGradient></defs><rect width="900" height="520" rx="48" fill="url(#g)"/><text x="60" y="90" fill="#fffaf2" font-family="Arial" font-size="26" font-weight="700">Study Hive Founder Pass</text><text x="60" y="180" fill="#fffaf2" font-family="Arial" font-size="64" font-weight="900">OG Hive Member</text><text x="60" y="250" fill="#fffaf2" font-family="Arial" font-size="40" font-weight="900">#'+String(data.number||'PREVIEW').padStart(4,'0')+'</text><text x="60" y="320" fill="#fffaf2" font-family="Arial" font-size="28">'+esc(data.name||'Founder')+'</text><text x="60" y="365" fill="#fffaf2" font-family="Arial" font-size="22">Free for life status — subject to official verification</text><text x="60" y="450" fill="#fffaf2" opacity="0.75" font-family="Arial" font-size="18">© 2026 the Founder · studyhive.co.za</text><text x="690" y="390" font-size="120">🐝👑</text></svg>';
    var blob=new Blob([svg],{type:'image/svg+xml'}), url=URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download='study-hive-og-founder-card.svg'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url)},1000);
  }
  function renderOGBadge(){
    var data=og(); var old=document.getElementById('ogBadgePill'); if(old) old.remove(); if(!data) return;
    var sub=document.getElementById('mainSubtitle'); if(sub) sub.insertAdjacentHTML('afterend','<div class="og-badge-pill" id="ogBadgePill">👑 OG #'+String(data.number||'PREVIEW').padStart(4,'0')+' · Free for life</div>');
  }
  function addOGButtons(){
    var hive=document.getElementById('hiveMenuPanel'); if(hive && !hive.querySelector('[data-hive-action="og-card"]')) hive.insertAdjacentHTML('beforeend','<button data-hive-action="og-card">👑 OG Founder Card</button>');
    var settings=document.getElementById('settingsPanel'); if(settings && !document.getElementById('settingsOGCardBtn')) settings.insertAdjacentHTML('beforeend','<div class="settings-divider"></div><div class="settings-section-title">👑 OG Founder</div><input id="ogEndpointInput" class="onboard-input" placeholder="OG backend endpoint URL (optional)" style="margin-bottom:8px;"><button class="settings-action-btn" id="saveOgEndpointBtn" style="width:100%; margin-bottom:6px;">Save OG Backend URL</button><button class="settings-action-btn" id="settingsOGCardBtn" style="width:100%;">Claim / View OG Card</button>');
    var b=document.getElementById('settingsOGCardBtn'); if(b&&!b.dataset.wired){ b.dataset.wired='1'; b.onclick=openOG; }
  }
  document.addEventListener('click',function(e){ if(e.target && e.target.dataset && e.target.dataset.hiveAction==='og-card'){ e.preventDefault(); openOG(); } },true);
  setInterval(function(){ addOGButtons(); renderOGBadge(); },1800);
  addOGButtons(); renderOGBadge();
})();
