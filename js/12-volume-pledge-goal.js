/* =====================================================================
   Study Hive — 12-volume-pledge-goal.js
   Extracted from the original single-file build (script block #10).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function showMsg(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg, 3600); }

  /* Clean Hive menu */
  if(!document.getElementById('hiveMenuBtn')){
    document.body.insertAdjacentHTML('beforeend','<button class="hive-menu-btn" id="hiveMenuBtn">☰ Hive</button><div class="hive-menu-panel" id="hiveMenuPanel"><div class="bg-music-mini"><span>🎵 Background</span><button id="bgMusicToggle" style="width:auto;margin:0;padding:6px 9px;text-align:center;">On</button></div><input class="bg-volume" id="bgMusicVolume" type="range" min="0" max="100" value="28"><button data-hive-action="coach">🐝 Hive Coach</button><button data-hive-action="studio">🍯 Hive Studio</button><button data-hive-action="tools">🧰 More Tools</button><button data-hive-action="grind">🧱 Grind Mode</button><button data-hive-action="pledge">✍️ Edit pledge</button><button data-hive-action="goal">🎯 Goal %</button><button data-hive-action="queen">👑 Queen legend</button></div><div class="queen-visit" id="queenVisit"><div class="queen-banner">👑 Rare Queen Bee fly-by — 10 minute blessing</div><div class="queen-visitor" id="queenVisitor"><img src="images/queen.png?v=3" alt="The Queen" draggable="false"></div></div>');
  }
  document.body.classList.add('clean-ui');
  $('hiveMenuBtn').onclick=function(){ $('hiveMenuPanel').classList.toggle('show'); };
  document.addEventListener('click', function(e){ if(!e.target.closest || (!e.target.closest('#hiveMenuPanel') && !e.target.closest('#hiveMenuBtn'))) $('hiveMenuPanel').classList.remove('show'); });
  qa('[data-hive-action]').forEach(function(b){ b.onclick=function(){ var a=b.dataset.hiveAction; if(a==='coach' && $('hiveCoachBtn')) $('hiveCoachBtn').click(); if(a==='studio' && $('upgradeHubBtn')) $('upgradeHubBtn').click(); if(a==='tools' && $('dockToggleBtn')) $('dockToggleBtn').click(); if(a==='grind' && $('grindModeBtn')) $('grindModeBtn').click(); if(a==='pledge') editPledge(); if(a==='goal') editGoalPct(); if(a==='queen') showMsg('The Queen Bee is extremely rare. If she visits, she blesses the hive for 10 minutes.'); $('hiveMenuPanel').classList.remove('show'); }; });

  /* Background music: starts only after a user gesture, can be switched off. */
  var bgCtx=null, bgNodes=[], bgOn=false, bgStarted=false; // legacy background engine disabled; reliable engine below handles music
  function stopBg(){ bgNodes.forEach(function(n){ try{ if(n.gain&&bgCtx) n.gain.exponentialRampToValueAtTime(0.0001,bgCtx.currentTime+.25); }catch(e){} }); bgNodes.forEach(function(n){ try{ n.stop&&n.stop(bgCtx?bgCtx.currentTime+.3:undefined); }catch(e){} }); setTimeout(function(){ bgNodes.forEach(function(n){ try{n.disconnect&&n.disconnect();}catch(e){} }); bgNodes=[]; },360); bgStarted=false; }
  function startBg(){ if(!bgOn || bgStarted) return; try{ bgCtx=bgCtx||new (window.AudioContext||window.webkitAudioContext)(); if(bgCtx.state==='suspended') bgCtx.resume(); var master=bgCtx.createGain(); master.gain.value=(parseInt(localStorage.getItem('studyhive-bg-volume-v1')||'28',10)/100)*0.22; master.connect(bgCtx.destination); bgNodes.push(master); [196,246.94,293.66].forEach(function(freq,i){ var o=bgCtx.createOscillator(); o.type='sine'; o.frequency.value=freq; var g=bgCtx.createGain(); g.gain.value=.055/(i+1); var l=bgCtx.createOscillator(); l.type='sine'; l.frequency.value=.035+i*.012; var lg=bgCtx.createGain(); lg.gain.value=2.2; l.connect(lg); lg.connect(o.frequency); o.connect(g); g.connect(master); o.start(); l.start(); bgNodes.push(o,g,l,lg); }); var buffer=bgCtx.createBuffer(1,bgCtx.sampleRate*2,bgCtx.sampleRate), data=buffer.getChannelData(0); for(var i=0;i<data.length;i++) data[i]=Math.random()*2-1; var noise=bgCtx.createBufferSource(); noise.buffer=buffer; noise.loop=true; var f=bgCtx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=650; var ng=bgCtx.createGain(); ng.gain.value=.025; noise.connect(f); f.connect(ng); ng.connect(master); noise.start(); bgNodes.push(noise,f,ng); bgStarted=true; }catch(e){} }
  function syncBgUI(){ var b=$('bgMusicToggle'), v=$('bgMusicVolume'); if(b) b.textContent=bgOn?'On':'Off'; if(v) v.value=localStorage.getItem('studyhive-bg-volume-v1')||'28'; }
  $('bgMusicToggle').onclick=function(e){ e.stopPropagation(); bgOn=!bgOn; localStorage.setItem('studyhive-bg-music-v1', bgOn?'1':'0'); if(bgOn) startBg(); else stopBg(); syncBgUI(); };
  $('bgMusicVolume').oninput=function(e){ e.stopPropagation(); localStorage.setItem('studyhive-bg-volume-v1', this.value); if(bgNodes[0]&&bgNodes[0].gain) bgNodes[0].gain.value=(parseInt(this.value,10)/100)*0.22; };
  syncBgUI();

  /* Custom red goal percentage, default 90. */
  function getGoalPct(){ return Math.max(1, Math.min(100, parseInt(localStorage.getItem('studyhive-red-goal-pct-v1')||'90',10)||90)); }
  function applyGoalPct(){ var pct=getGoalPct(); qa('.goal-back,.goal-front').forEach(function(el){ el.textContent=pct+'%'; }); var wrap=document.querySelector('.goal-wrap'); if(wrap) wrap.classList.toggle('goal-custom', pct!==90); }
  function editGoalPct(){ var val=prompt('Set your red goal percentage (base/default is 90):', getGoalPct()); if(val===null) return; var n=Math.max(1,Math.min(100,parseInt(val,10)||90)); localStorage.setItem('studyhive-red-goal-pct-v1', String(n)); applyGoalPct(); showMsg('Goal set to '+n+'%'); }
  applyGoalPct(); setInterval(applyGoalPct,5000);

  /* Pledge — now an expandable card: click the head to open/close the full
     promise. Exposed globally so the Calm (SOS) button can open it too. */
  function pledge(){ return localStorage.getItem('studyhive-pledge-v1')||''; }
  function escPledge(t){ return String(t||'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function renderPledge(){
    document.querySelectorAll('.pledge-card').forEach(function(n){ n.remove(); });
    var p=pledge(); if(!p) return;
    var sub=$('mainSubtitle'); if(!sub) return;
    var card=document.createElement('div'); card.className='pledge-card'; card.id='pledgeCard';
    card.innerHTML='<button type="button" class="pledge-head" id="pledgeHeadBtn" aria-expanded="false"><span>✍️</span><span class="pledge-head-text">'+escPledge(p)+'</span><span class="pledge-chev">▾</span></button>'+
      '<div class="pledge-body"><span class="pledge-full-text">'+escPledge(p)+'</span><div class="pledge-actions"><button type="button" id="editPledgeInline">edit pledge</button><button type="button" id="closePledgeInline">close</button></div></div>';
    sub.insertAdjacentElement('afterend', card);
    var head=$('pledgeHeadBtn'); if(head) head.onclick=function(){ togglePledge(); };
    var e=$('editPledgeInline'); if(e) e.onclick=function(){ editPledge(); };
    var c=$('closePledgeInline'); if(c) c.onclick=function(){ closePledge(); };
    if (typeof window.__pledgeOpenRequested === 'number' && Date.now() - window.__pledgeOpenRequested < 2500) openPledge();
  }
  function isPledgeOpen(){ var c=document.getElementById('pledgeCard'); return !!(c && c.classList.contains('pledge-open')); }
  function openPledge(){
    var c=document.getElementById('pledgeCard'); if(!c) { window.__pledgeOpenRequested=Date.now(); return; }
    c.classList.add('pledge-open');
    var h=document.getElementById('pledgeHeadBtn'); if(h) h.setAttribute('aria-expanded','true');
  }
  function closePledge(){
    var c=document.getElementById('pledgeCard'); if(!c) return;
    c.classList.remove('pledge-open');
    var h=document.getElementById('pledgeHeadBtn'); if(h) h.setAttribute('aria-expanded','false');
  }
  function togglePledge(){ isPledgeOpen() ? closePledge() : openPledge(); }
  window.renderPledge = renderPledge;
  window.openPledge = openPledge;
  window.closePledge = closePledge;
  window.togglePledge = togglePledge;
  /* ROBUSTNESS FIX: some in-app browsers (Instagram/Facebook webviews, and
     any context where dialogs are suppressed) return undefined from prompt()
     rather than null. The old code only checked !== null, then called
     val.trim() and threw "Cannot read properties of undefined", which killed
     the click handler. Accept only real strings. */
  function editPledge(){ var val=prompt('Write your pledge to yourself:', pledge()||'I promise to show up honestly, one focused session at a time.'); if(typeof val==='string'){ localStorage.setItem('studyhive-pledge-v1', val.trim()); renderPledge(); showMsg('Pledge saved'); } }
  renderPledge(); setTimeout(renderPledge,1200);

  /* Cooler hive drips */
  function addHiveDrips(){ var h=$('hiveWrap'); if(!h || h.querySelector('.hive-honey-drip-real')) return; ['d1','d2','d3'].forEach(function(c){ var s=document.createElement('span'); s.className='hive-honey-drip-real '+c; h.appendChild(s); }); }
  addHiveDrips(); setTimeout(addHiveDrips,1200);

  /* Rare Queen Bee: very rare roll, lasts 10 minutes. */
  function queenActive(){ return Date.now() < parseInt(localStorage.getItem('studyhive-queen-until-v1')||'0',10); }
  function activateQueen(force){ var until=Date.now()+10*60*1000; localStorage.setItem('studyhive-queen-until-v1', String(until)); $('queenVisit').classList.add('show'); showMsg('👑 The Queen Bee is visiting for 10 minutes!'); if(typeof showSergeantNag==='function') showSergeantNag('QUEEN ON DECK. Stand tall, recruit.', false); }
  function syncQueen(){ $('queenVisit').classList.toggle('show', queenActive()); }
  function queenRoll(){ if(queenActive()) return; var seen=parseInt(localStorage.getItem('studyhive-queen-rolls-v1')||'0',10)+1; localStorage.setItem('studyhive-queen-rolls-v1', String(seen)); var chance = seen===1 ? 1/500 : 1/900; if(Math.random()<chance) activateQueen(); }
  setTimeout(queenRoll, 6500); setInterval(queenRoll, 4*60*1000); setInterval(syncQueen, 12000); syncQueen();
  setInterval(function(){ if(!queenActive()) return; var q=$('queenVisitor'); if(!q) return; var r=q.getBoundingClientRect(); var s=document.createElement('span'); s.className='queen-sparkle'; s.textContent=Math.random()<.5?'✦':'✧'; s.style.left=(r.left+r.width/2+(Math.random()*80-40))+'px'; s.style.top=(r.top+r.height/2+(Math.random()*60-30))+'px'; document.body.appendChild(s); setTimeout(function(){s.remove();},1300); },900);

  /* Sergeant visual gear */
  function gearSergeant(){ var s=$('sergeantPersistent'); if(!s || s.querySelector('.sergeant-gear')) return; var g=document.createElement('div'); g.className='sergeant-gear'; g.innerHTML='<span class="sgt-cap"></span><span class="sgt-medals"><span></span><span></span><span></span></span><span class="sgt-baton"></span>'; s.appendChild(g); }
  gearSergeant(); setTimeout(gearSergeant,1200); setInterval(gearSergeant,7000);
})();
