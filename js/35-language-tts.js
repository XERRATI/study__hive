/* =====================================================================
   Study Hive — 35-language-tts.js
   Extracted from the original single-file build (script block #33).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function qa(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function toast(msg){ if(typeof showMilestoneToast==='function') showMilestoneToast(msg,3200); }

  /* Fullscreen on mobile + fallback. */
  function realFullscreenElement(){ return document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement; }
  function requestFs(el){
    el = el || document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (fn) return fn.call(el);
    return Promise.reject(new Error('no fullscreen api'));
  }
  function exitFs(){
    var fn = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (fn && realFullscreenElement()) return fn.call(document);
    document.body.classList.remove('pseudo-fullscreen');
    return Promise.resolve();
  }
  function toggleMobileFullscreen(){
    if (realFullscreenElement() || document.body.classList.contains('pseudo-fullscreen')) { exitFs(); return; }
    requestFs(document.documentElement).catch(function(){ document.body.classList.add('pseudo-fullscreen'); toast('Fullscreen-style mobile mode on'); });
  }
  function installMobileFullscreen(){
    if(!$('mobileFullscreenExit')) document.body.insertAdjacentHTML('beforeend','<button class="mobile-fullscreen-exit" id="mobileFullscreenExit">Exit fullscreen</button>');
    var exit=$('mobileFullscreenExit'); if(exit && !exit.dataset.wired){ exit.dataset.wired='1'; exit.onclick=toggleMobileFullscreen; }
    var grid=$('mobileFeatureGrid');
    if(grid && !grid.querySelector('[data-mobile-fullscreen]')) grid.insertAdjacentHTML('afterbegin','<button class="featured" data-mobile-fullscreen="1">⛶<br>Fullscreen</button>');
    var sheet=$('mobileFeatureSheet');
    if(sheet && !sheet.dataset.fullscreenCapture){
      sheet.dataset.fullscreenCapture='1';
      sheet.addEventListener('click', function(e){ var b=e.target.closest && e.target.closest('[data-mobile-fullscreen]'); if(b){ e.preventDefault(); toggleMobileFullscreen(); sheet.classList.remove('show'); } }, true);
    }
    var fs=$('fsBtn'); if(fs && !fs.dataset.mobileFullscreenFixed){ fs.dataset.mobileFullscreenFixed='1'; fs.addEventListener('click', function(e){ if(window.innerWidth<=780){ e.preventDefault(); e.stopImmediatePropagation(); toggleMobileFullscreen(); } }, true); }
  }
  installMobileFullscreen(); setInterval(installMobileFullscreen,3500);

  /* More Asia language options + auto-detect from browser locale. */
  var extraAsian = [
    ['zh-TW','Chinese Traditional (Taiwan)'],['zh-HK','Chinese Cantonese-style (Hong Kong)'],['yue-HK','Cantonese (Hong Kong)'],['id-ID','Indonesian'],['ms-MY','Malay'],['th-TH','Thai'],['vi-VN','Vietnamese'],['km-KH','Khmer'],['lo-LA','Lao'],['my-MM','Burmese'],['ne-NP','Nepali'],['bn-BD','Bengali (Bangladesh)'],['bn-IN','Bengali (India)'],['ur-PK','Urdu (Pakistan)'],['ur-IN','Urdu (India)'],['fa-IR','Persian'],['ta-IN','Tamil'],['ta-LK','Tamil (Sri Lanka)'],['te-IN','Telugu'],['mr-IN','Marathi'],['gu-IN','Gujarati'],['kn-IN','Kannada'],['ml-IN','Malayalam'],['pa-IN','Punjabi'],['si-LK','Sinhala'],['mn-MN','Mongolian'],['kk-KZ','Kazakh'],['uz-UZ','Uzbek'],['tr-TR','Turkish'],['he-IL','Hebrew']
  ];
  function normalizeLang(code){
    if(!code) return '';
    if(code.indexOf('en-US-x-')===0) return 'en-US';
    if(code==='zh-HK') return 'zh-HK';
    if(code==='yue-HK') return 'zh-HK';
    return code;
  }
  function labelFor(code){
    var all = extraAsian.concat([
      ['en-US','English (United States)'],['es-US','Spanish (United States)'],['es-MX','Spanish (Mexico)'],['fr-CA','French (Canada)'],['en-CA','English (Canada)'],['en-GB','English (UK)'],['en-ZA','English (South Africa)'],['af-ZA','Afrikaans'],['zu-ZA','isiZulu'],['xh-ZA','isiXhosa'],['pt-BR','Portuguese (Brazil)'],['zh-CN','Chinese (Mandarin)'],['tl-PH','Filipino / Tagalog'],['ko-KR','Korean'],['ja-JP','Japanese'],['ar','Arabic'],['hi-IN','Hindi']
    ]);
    var found = all.filter(function(x){return x[0]===code;})[0];
    return found ? found[1] : code;
  }
  function bestBrowserLanguage(){
    var raw = (navigator.languages && navigator.languages[0]) || navigator.language || 'en-US';
    raw = raw.replace('_','-');
    var lower = raw.toLowerCase();
    var map = {
      'zh-hans':'zh-CN','zh-cn':'zh-CN','zh-sg':'zh-CN','zh-hant':'zh-TW','zh-tw':'zh-TW','zh-hk':'zh-HK','yue':'yue-HK',
      'ja':'ja-JP','ko':'ko-KR','hi':'hi-IN','bn':'bn-BD','ur':'ur-PK','ta':'ta-IN','te':'te-IN','mr':'mr-IN','gu':'gu-IN','kn':'kn-IN','ml':'ml-IN','pa':'pa-IN','si':'si-LK','th':'th-TH','vi':'vi-VN','id':'id-ID','ms':'ms-MY','km':'km-KH','lo':'lo-LA','my':'my-MM','ne':'ne-NP','fa':'fa-IR','he':'he-IL','tr':'tr-TR','ar':'ar','tl':'tl-PH','fil':'tl-PH'
    };
    if(map[lower]) return map[lower];
    var base = lower.split('-')[0];
    if(map[base]) return map[base];
    if(lower.indexOf('en-us')===0) return 'en-US';
    if(lower.indexOf('en-gb')===0) return 'en-GB';
    if(lower.indexOf('en-za')===0) return 'en-ZA';
    if(lower.indexOf('es-mx')===0) return 'es-MX';
    if(lower.indexOf('es')===0) return 'es-US';
    return raw;
  }
  function addOption(sel, value, label){
    if(!sel || Array.from(sel.options).some(function(o){return o.value===value;})) return;
    var opt=document.createElement('option'); opt.value=value; opt.textContent=label; sel.appendChild(opt);
  }
  function extendLanguageSelectors(){
    var selectors = ['onboardLanguage','transcribeLang'].map(function(id){return $(id);}).filter(Boolean);
    selectors.forEach(function(sel){ extraAsian.forEach(function(o){ addOption(sel, normalizeLang(o[0]), o[1]); }); });
    var detected = normalizeLang(bestBrowserLanguage());
    var onboard=$('onboardLanguage');
    if(onboard && !onboard.dataset.autoDetected){
      addOption(onboard, detected, labelFor(detected));
      if(!get('studyhive-language-v1')){ onboard.value=detected; set('studyhive-language-v1', detected); set('studyhive-speech-lang-v1', normalizeLang(detected)); }
      onboard.dataset.autoDetected='1';
      var card=onboard.closest('.start-language-card');
      if(card && !card.querySelector('.language-detect-note')){ card.classList.add('detected-language'); card.insertAdjacentHTML('beforeend','<span class="language-detect-note">Detected from your browser/location settings: '+labelFor(onboard.value)+'</span>'); }
    }
    var trans=$('transcribeLang');
    if(trans && !trans.dataset.autoDetected2){ addOption(trans, detected, labelFor(detected)); if(get('studyhive-speech-lang-v1')) trans.value=get('studyhive-speech-lang-v1'); trans.dataset.autoDetected2='1'; }
  }
  extendLanguageSelectors(); setInterval(extendLanguageSelectors,3500);

  /* Smooth explainer transitions for old/new Queen guide: add class when Next/Back clicked. */
  function smoothGuideClick(cardId, spotId){
    var card=$(cardId), spot=$(spotId); if(!card) return;
    card.classList.remove('step-ready'); card.classList.add('step-changing');
    if(spot){ spot.classList.remove('step-pulse'); }
    setTimeout(function(){ card.classList.remove('step-changing'); card.classList.add('step-ready'); if(spot){ spot.classList.add('step-pulse'); } },180);
  }
  document.addEventListener('click', function(e){
    if(!e.target) return;
    if(e.target.id==='queenV2Next'||e.target.id==='queenV2Back'){ smoothGuideClick('queenV2Card','queenV2Spot'); }
    if(e.target.id==='queenStoryNext'||e.target.id==='queenStoryBack'){ smoothGuideClick('queenStoryCard','queenStorySpot'); }
    if(e.target.id==='tourNextBtn'||e.target.id==='tourBackBtn'){ smoothGuideClick('tourCard','tourSpotlight'); }
  }, true);
})();
