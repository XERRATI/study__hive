/* =====================================================================
   Study Hive — 48-flashcards-garden-tasks.js
   Extracted from the original single-file build (script block #46).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  'use strict';
  function visible(el){return !!(el&&(el.offsetWidth||el.offsetHeight||el.getClientRects().length));}
  function oldBees(){return Array.prototype.slice.call(document.querySelectorAll('.bee-wrap')).filter(visible);}
  function randomizeBeeTiming(){
    document.querySelectorAll('.bee-wrap').forEach(function(bee,i){
      if(bee.dataset.oldBeeTiming)return;
      bee.dataset.oldBeeTiming='1';
      bee.style.setProperty('--old-route-duration',(27+i*3+Math.random()*3).toFixed(1)+'s');
      bee.style.setProperty('--old-bob-duration',(.48+Math.random()*.24).toFixed(2)+'s');
      bee.style.setProperty('--old-wing-duration',(.14+Math.random()*.08).toFixed(2)+'s');
      bee.style.animationDelay=(-Math.random()*25).toFixed(2)+'s';
    });
    document.querySelectorAll('.hive-bee-el').forEach(function(bee){
      if(bee.dataset.xpBeeTiming)return;
      bee.dataset.xpBeeTiming='1';
      bee.style.setProperty('--xp-bob-delay',(-Math.random()*1.6).toFixed(2)+'s');
      bee.style.setProperty('--xp-wing-delay',(-Math.random()*.7).toFixed(2)+'s');
      bee.style.setProperty('--xp-bob-speed',(.48+Math.random()*.44).toFixed(2)+'s');
      bee.style.setProperty('--xp-wing-speed',(.10+Math.random()*.10).toFixed(2)+'s');
    });
  }
  function tip(){var b=document.getElementById('oldBeeTip');if(b)return b;b=document.createElement('div');b.id='oldBeeTip';b.className='old-bee-tip';document.body.appendChild(b);return b;}
  var speaker=null,hideTimer=null;
  function positionTip(){
    var b=tip();if(!b.classList.contains('show')){speaker=null;return;}
    if(!speaker||!visible(speaker)){var bees=oldBees();speaker=bees.length?bees[Math.floor(Math.random()*bees.length)]:null;}
    if(!speaker)return;
    var r=speaker.getBoundingClientRect(),w=b.offsetWidth||145,h=b.offsetHeight||32;
    var left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2)),top=r.top-h-9;
    if(top<8)top=Math.min(innerHeight-h-8,r.bottom+9);
    b.style.setProperty('left',Math.round(left)+'px','important');b.style.setProperty('top',Math.round(top)+'px','important');
  }
  function showTip(text){
    if(!text)return;var bees=oldBees();if(!bees.length)return;
    speaker=bees[Math.floor(Math.random()*bees.length)];var b=tip();b.textContent=text;b.classList.add('show');positionTip();clearTimeout(hideTimer);hideTimer=setTimeout(function(){b.classList.remove('show');speaker=null;},3800);
  }
  function featureTip(el){
    var id=((el&&el.id)||'').toLowerCase(),label=((el&&el.textContent)||'').toLowerCase();
    if(id.includes('focus')||label.includes('focus'))return 'Focus records a timed study session and grows your progress bees.';
    if(id.includes('grade')||label.includes('grade'))return 'Grades helps you estimate what mark you need next.';
    if(id.includes('vocab')||label.includes('vocab'))return 'Vocab gives you a new word and a quick example.';
    if(id.includes('exam')||label.includes('exam'))return 'Exams keeps important dates and shows what is coming up.';
    if(id.includes('setting')||label.includes('setting'))return 'Settings changes the hive experience and your bee style.';
    if(id.includes('coach')||label.includes('coach'))return 'Hive Coach helps you choose weak topics and make a plan.';
    if(id.includes('garden')||label.includes('garden'))return 'Garden turns study time into flowers and a growing hive.';
    if(id.includes('card')||label.includes('flashcard'))return 'Flashcards help you practise remembering, not just rereading.';
    if(id.includes('task')||label.includes('task'))return 'Tasks keeps the next small action clear.';
    return '';
  }
  /* Old bees explain a feature after a useful control is pressed. */
  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest&&e.target.closest('button,.misc-btn,.focus-btn,.grade-btn,.breathing-btn,.todo-toggle-btn');
    if(!el||el.classList.contains('stable-panel-close')||el.classList.contains('upgrade-panel-close-x'))return;
    var message=featureTip(el);if(message)setTimeout(function(){showTip(message);},80);
  },true);
  /* BEEHIVE CRASH FIX (was an infinite loop):
     The old sweeper called classList.remove('show') unconditionally on any
     .motivation-bubble. Chrome fires an attribute record even for a no-op
     remove, so the observer re-triggered itself forever the moment any bubble
     got 'show' — tapping the hive pegged the CPU and the app froze/glitched.
     Fix: (1) pause the observer while sweeping so our own mutations cannot
     re-trigger it, (2) only touch bubbles that actually have 'show', and
     (3) only sweep the DYNAMIC legacy bubbles — the static #motivationBubble
     (the hive-tap quote) is protected so the feature works again. */
  var legacyBubbleSweeper = null;
  function sweepLegacyBubbles(){
    if (legacyBubbleSweeper) legacyBubbleSweeper.disconnect();
    try {
      document.querySelectorAll('.motivation-bubble:not(#motivationBubble)').forEach(function(b){
        if (b.classList.contains('show')) b.classList.remove('show');
        b.remove();
      });
    } finally {
      if (legacyBubbleSweeper) legacyBubbleSweeper.observe(document.body,{subtree:true,childList:true});
    }
  }
  legacyBubbleSweeper = new MutationObserver(sweepLegacyBubbles);
  legacyBubbleSweeper.observe(document.body,{subtree:true,childList:true});
  function tick(){randomizeBeeTiming();positionTip();requestAnimationFrame(tick);}requestAnimationFrame(tick);
})();
