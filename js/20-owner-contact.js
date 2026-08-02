/* =====================================================================
   Study Hive — 20-owner-contact.js
   Extracted from the original single-file build (script block #18).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  var OWNER = 'Omphemetse Mogale';
  var EMAIL = 'omphemetse.mogale0409@gmail.com';
  var NOTICE = 'Study Hive © 2026 ' + OWNER + '. All rights reserved. Unauthorized copying, cloning, rebranding, resale, redistribution, hosting, mirroring, or derivative works are prohibited. Contact: ' + EMAIL;
  try {
    Object.defineProperty(window, 'STUDY_HIVE_OWNER', { value: OWNER, writable: false, configurable: false });
    Object.defineProperty(window, 'STUDY_HIVE_COPYRIGHT_NOTICE', { value: NOTICE, writable: false, configurable: false });
  } catch(e) {}
  try { console.info('%c' + NOTICE, 'font-weight:700;color:#c97a12;font-size:13px;'); } catch(e) {}
  function ensureOwnershipNotice(){
    document.documentElement.setAttribute('data-study-hive-owner', OWNER);
    document.documentElement.setAttribute('data-study-hive-copyright', '© 2026 ' + OWNER);
    if (!document.querySelector('meta[name="owner"]')) {
      var m=document.createElement('meta'); m.name='owner'; m.content=OWNER; document.head.appendChild(m);
    }
    if (!document.getElementById('studyHiveOwnershipNotice')) {
      var n=document.createElement('div');
      n.id='studyHiveOwnershipNotice';
      n.setAttribute('aria-label','Study Hive ownership notice');
      n.textContent='Study Hive © 2026 Omphemetse Mogale. All rights reserved.';
      n.style.cssText='position:fixed;left:8px;bottom:6px;z-index:1;font:10px Arial,sans-serif;color:rgba(91,68,47,.55);pointer-events:none;user-select:none;';
      document.body.appendChild(n);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureOwnershipNotice); else ensureOwnershipNotice();
  setInterval(ensureOwnershipNotice,10000);
})();
