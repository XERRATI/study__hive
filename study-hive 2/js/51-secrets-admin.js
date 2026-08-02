/* =====================================================================
   Study Hive — 51-secrets-admin.js
   Extracted from the original single-file build (script block #49).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  'use strict';
  var EXTRA=[
    ['honey','🍯','The Magic Word','Type a certain sticky word somewhere on the page'],
    ['beefact','🐝','Bee Whisperer','Click the footer message 5 times quickly'],
    ['clicker','🎮','Hive Reflexes','Double-click the hive icon (bottom right)'],
    ['capsule','✉️','Letter to Tomorrow','Seal a Time Capsule message'],
    ['pun','😂','Comedy Bee','Open the Puns panel and get a joke'],
    ['buzz','⚡','Buzz Boost','Type a short sound a bee makes'],
    ['nectar','🌼','Nectar Shower','Type the flower fuel bees collect'],
    ['waggle','💃','Waggle Dance','Type the dance bees use to share directions'],
    ['pollen','✨','Pollen Party','Type the golden dust that clings to bees'],
    ['queenbee','👑','Royal Signal','Type the hive leader as one word'],
    ['hivefive','🖐️','Hive Five','Type a friendly hive celebration'],
    ['titlefive','🎓','Title Tapper','Tap the goal title five times quickly'],
    ['goalfour','🎯','Goal Glow','Tap the red goal percentage four times quickly'],
    ['datefour','📅','Date Detective','Tap today’s date four times quickly'],
    ['progressfour','🍯','Honey Meter','Tap the Hive Progress meter four times quickly']
  ];
  function found(){try{return JSON.parse(localStorage.getItem('secrets-found-v1')||'[]');}catch(e){return [];}}
  function render(){
    var list=document.getElementById('secretsList'),progress=document.getElementById('secretsProgress');if(!list||!progress)return;
    var f=found();progress.textContent=f.length+' / '+EXTRA.length+' found';
    list.innerHTML=EXTRA.map(function(s){var yes=f.indexOf(s[0])>=0;return '<div class="secret-row '+(yes?'found':'locked')+'"><span class="secret-icon">'+(yes?s[1]:'❓')+'</span><span>'+ (yes?s[2]:'Locked — '+s[3]) +'</span></div>';}).join('');
  }
  function mark(id){
    var f=found();if(f.indexOf(id)<0){f.push(id);try{localStorage.setItem('secrets-found-v1',JSON.stringify(f));}catch(e){}var s=EXTRA.filter(function(x){return x[0]===id;})[0];if(s&&typeof window.showMilestoneToast==='function')window.showMilestoneToast('🕵️ Secret found: '+s[1]+' '+s[2]+'!',4200);}render();
  }
  function pulse(cls){document.body.classList.add(cls);setTimeout(function(){document.body.classList.remove(cls);},2600);}
  function pollen(){for(var i=0;i<16;i++){var p=document.createElement('div');p.className='pollen-trail-dot';p.style.left=(innerWidth*.25+Math.random()*innerWidth*.5)+'px';p.style.top=(innerHeight*.2+Math.random()*innerHeight*.45)+'px';document.body.appendChild(p);setTimeout(function(x){return function(){x.remove();};}(p),950);}}
  function nectar(){for(var i=0;i<12;i++){var d=document.createElement('div');d.className='honey-rain-drop';d.textContent='🍯';d.style.left=(Math.random()*100)+'vw';d.style.animationDuration=(2+Math.random())+'s';document.body.appendChild(d);setTimeout(function(x){return function(){x.remove();};}(d),3500);}}
  var codes={buzz:function(){mark('buzz');pulse('secret-buzz');},nectar:function(){mark('nectar');pulse('secret-nectar');nectar();},waggle:function(){mark('waggle');pulse('secret-waggle');},pollen:function(){mark('pollen');pulse('secret-pollen');pollen();},queenbee:function(){mark('queenbee');pulse('secret-royal');try{localStorage.setItem('studyhive-queen-until-v1',String(Date.now()+600000));}catch(e){}},hivefive:function(){mark('hivefive');pulse('secret-five');}};
  var buffer='';
  document.addEventListener('keydown',function(e){
    var tag=(e.target&&e.target.tagName||'').toLowerCase();if(tag==='input'||tag==='textarea'||tag==='select')return;
    if(!e.key||e.key.length!==1)return;buffer=(buffer+e.key.toLowerCase()).slice(-12);
    Object.keys(codes).forEach(function(code){if(buffer.endsWith(code)){buffer='';codes[code]();}});
  });
  function tapSecret(selector,count,id,cls){
    var taps=0,timer=null;document.addEventListener('click',function(e){var el=e.target&&e.target.closest&&e.target.closest(selector);if(!el)return;taps++;clearTimeout(timer);timer=setTimeout(function(){taps=0;},1500);if(taps>=count){taps=0;mark(id);if(cls)pulse(cls);}},true);
  }
  tapSecret('#mainTitle',5,'titlefive','secret-nectar');
  tapSecret('.goal-wrap',4,'goalfour','secret-royal');
  tapSecret('#currentDate',4,'datefour','secret-waggle');
  tapSecret('.hive-progress-wrap',4,'progressfour','secret-five');
  render();setInterval(render,5000);
})();
