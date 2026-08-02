/* =====================================================================
   Study Hive — 49-bee-xp.js
   Extracted from the original single-file build (script block #47).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  'use strict';
  var TIER=40;
  function xp(){
    try{var data=JSON.parse(localStorage.getItem('hive-xp-v1')||'{}');if(typeof data.xp==='number')return data.xp;}catch(e){}
    try{var data2=JSON.parse(localStorage.getItem('study-hive-xp-v1')||'{}');if(typeof data2.xp==='number')return data2.xp;}catch(e){}
    /* Match the visible XP counter if the app stores XP under another key. */
    var label=document.getElementById('xpCount');var n=label&&String(label.textContent).match(/\d+/);return n?parseInt(n[0],10):0;
  }
  /* OLD BEES ARE NOW RARE (as requested): 1 at the start, and only grows
     slowly — a second at 90 XP, a third at 180 XP, max 4 in total. */
  function wanted(){return Math.min(4,1+Math.floor(Math.max(0,xp())/90));}
  function makeClone(template,index){
    var clone=template.cloneNode(true);
    clone.className='bee-wrap bonus-old-bee';
    clone.removeAttribute('id');
    clone.dataset.bonusOld='1';
    /* SYNC FIX: the stylesheet animates .bee-wrap with the
       --old-bee-* variables (NOT --old-route-*), so set the names the CSS
       actually reads. Each clone gets its own random route/bob/wing timing
       so the old bees never move in lockstep. */
    clone.style.setProperty('--old-bee-route-delay',(-Math.random()*30).toFixed(2)+'s');
    clone.style.setProperty('--old-bee-route-speed',(24+Math.random()*14).toFixed(1)+'s');
    clone.style.setProperty('--old-bee-bob-delay',(-Math.random()*2).toFixed(2)+'s');
    clone.style.setProperty('--old-bee-bob-speed',(.38+Math.random()*.28).toFixed(2)+'s');
    clone.style.setProperty('--old-bee-wing-delay',(-Math.random()*1).toFixed(2)+'s');
    clone.style.setProperty('--old-bee-wing-speed',(.10+Math.random()*.10).toFixed(2)+'s');
    document.body.appendChild(clone);return clone;
  }
  function balanceOldBees(){
    var bees=Array.prototype.slice.call(document.querySelectorAll('.bee-wrap'));
    if(!bees.length)return;
    var target=wanted(), template=bees[0];
    while(bees.length<target){bees.push(makeClone(template,bees.length));}
    bees.forEach(function(bee,index){bee.classList.toggle('balance-hidden',index>=target);});
  }
  balanceOldBees();setInterval(balanceOldBees,4000);
})();
