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
  function wanted(){return Math.min(10,2+Math.floor(Math.max(0,xp())/TIER));}
  function makeClone(template,index){
    var clone=template.cloneNode(true);
    clone.className='bee-wrap bonus-old-bee';
    clone.removeAttribute('id');
    clone.dataset.bonusOld='1';
    clone.style.setProperty('--old-route-duration',(29+index*2+Math.random()*3).toFixed(1)+'s');
    clone.style.setProperty('--old-bob-duration',(.50+Math.random()*.24).toFixed(2)+'s');
    clone.style.setProperty('--old-wing-duration',(.14+Math.random()*.08).toFixed(2)+'s');
    clone.style.animationDelay=(-Math.random()*30).toFixed(2)+'s';
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
