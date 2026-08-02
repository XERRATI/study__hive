/* =====================================================================
   Study Hive — 10-real-hive-builder.js
   Extracted from the original single-file build (script block #8).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){return document.getElementById(id);}
  function buildRealHive(){
    var h=$('hiveWrap'); if(!h || h.querySelector('.real-hive-shell')) return;
    var shell=document.createElement('div'); shell.className='real-hive-shell';
    var cells=[
      [15,12],[29,12],[43,12],[10,24],[24,24],[38,24],[52,24],[15,36],[29,36],[43,36],[20,48],[34,48],[48,48]
    ];
    cells.forEach(function(c,i){ var cell=document.createElement('span'); cell.className='real-hive-cell'; cell.style.left=c[0]+'px'; cell.style.top=c[1]+'px'; cell.style.animationDelay=(i*.17)+'s'; shell.appendChild(cell); });
    var door=document.createElement('span'); door.className='hive-door-real'; shell.appendChild(door);
    ['b1','b2','b3'].forEach(function(cls){ var b=document.createElement('span'); b.className='hive-traffic-bee '+cls; b.textContent='🐝'; shell.appendChild(b); });
    h.insertBefore(shell,h.firstChild);
  }
  buildRealHive(); setTimeout(buildRealHive,1000);
})();
