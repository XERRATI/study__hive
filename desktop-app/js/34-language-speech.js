/* =====================================================================
   Study Hive — 34-language-speech.js
   Extracted from the original single-file build (script block #32).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function clickId(id){ var el=$(id); if(el) el.click(); }
  var languageOptions = [
    ['en-US','English (United States)'],['en-US-x-south','English (US Southern-style)'],['en-US-x-ny','English (US New York-style)'],['en-US-x-california','English (US California-style)'],['en-US-x-midwest','English (US Midwest-style)'],
    ['es-US','Spanish (United States)'],['es-MX','Spanish (Mexico)'],['fr-CA','French (Canada)'],['en-CA','English (Canada)'],['en-GB','English (UK)'],['en-ZA','English (South Africa)'],['af-ZA','Afrikaans'],['zu-ZA','isiZulu'],['xh-ZA','isiXhosa'],['st-ZA','Sesotho'],['tn-ZA','Setswana'],['pt-BR','Portuguese (Brazil)'],['ht-HT','Haitian Creole'],['zh-CN','Chinese (Mandarin)'],['tl-PH','Filipino / Tagalog'],['ko-KR','Korean'],['ja-JP','Japanese'],['ar','Arabic'],['hi-IN','Hindi']
  ];
  function normalizeSpeechLang(code){
    // SpeechRecognition will not understand fake regional variants; keep labels but use closest real BCP-47.
    if(!code) return '';
    if(code.indexOf('en-US-x-')===0) return 'en-US';
    return code;
  }
  function addStartLanguage(){
    var vibe = $('onboardVibe');
    if(!vibe || $('onboardLanguage')) return;
    var html = '<div class="start-language-card"><label class="onboard-label" for="onboardLanguage" style="margin-top:0;">Language / speech preference</label><select id="onboardLanguage" class="onboard-input">'+languageOptions.map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>';}).join('')+'</select><div style="font-size:11px;color:var(--brown);line-height:1.35;margin-top:5px;">This helps transcription and future voice/AI settings. American options are included.</div></div>';
    vibe.closest('label') ? vibe.insertAdjacentHTML('afterend', html) : vibe.insertAdjacentHTML('afterend', html);
    var saved = localStorage.getItem('studyhive-language-v1'); if(saved && $('onboardLanguage')) $('onboardLanguage').value=saved;
    $('onboardLanguage').addEventListener('change', function(){ localStorage.setItem('studyhive-language-v1', this.value); localStorage.setItem('studyhive-speech-lang-v1', normalizeSpeechLang(this.value)); });
  }
  function makeMobileChoiceProminent(){
    var cb=$('onboardMobileMode');
    if(!cb || cb.closest('.mobile-start-choice')) return;
    var label=cb.closest('label'); if(!label) return;
    var div=document.createElement('div'); div.className='mobile-start-choice';
    div.innerHTML='<label><input type="checkbox" id="onboardMobileModeBig"><div><strong>📱 Phone Mode Recommended</strong><span>Use bigger buttons, no horizontal sliders, and a mobile feature grid. Best for Safari, Brave, iPhone and Android.</span></div></label>';
    label.replaceWith(div);
    var big=$('onboardMobileModeBig'); big.checked = cb.checked || window.innerWidth<=780;
    big.id='onboardMobileMode';
  }
  function installLauncher(){
    if($('mobileFeatureLauncher')) return;
    document.body.insertAdjacentHTML('beforeend','<div class="mobile-feature-launcher" id="mobileFeatureLauncher"><button class="primary" id="mobileOpenFeatures">🧰<br>Tools</button><button id="mobileFocusNow">🎯<br>Focus</button><button id="mobileCoachNow">🐝<br>Coach</button><button id="mobileSettingsNow">⚙️<br>Settings</button></div><div class="mobile-feature-sheet" id="mobileFeatureSheet"><h3>🧰 Choose a feature</h3><div class="mobile-feature-grid" id="mobileFeatureGrid"></div></div>');
    var features = [
      ['🎯 Focus','focusBtn','featured'],['🐝 Hive Coach','hiveCoachBtn','featured'],['🍅 Pomodoro','hiveMenuBtn',''],['📝 Notes','notesBtn',''],['✅ Tasks','todoToggleBtn',''],['🧠 Cards','cardsBtn',''],['📥 Import','importBtn','featured'],['🌷 Garden','gardenBtn',''],['🎵 Music','musicBtn',''],['💧 Water','waterBtn',''],['📅 Exams','examBtn',''],['📊 Grades','gradeBtn',''],['🌬️ Breathe','breathingBtn',''],['🆘 Calm','sosBtn','featured'],['🗓️ Heatmap','heatmapBtn',''],['⚔️ Rival','rivalBtn',''],['❄️ Freeze','freezeBtn',''],['⚙️ Settings','settingsBtn','']
    ];
    $('mobileFeatureGrid').innerHTML = features.map(function(f){ return '<button class="'+(f[2]||'')+'" data-mobile-click="'+f[1]+'">'+f[0]+'</button>'; }).join('');
    $('mobileOpenFeatures').onclick=function(){ $('mobileFeatureSheet').classList.toggle('show'); };
    $('mobileFocusNow').onclick=function(){ clickId('focusBtn'); };
    $('mobileCoachNow').onclick=function(){ clickId('hiveCoachBtn'); };
    $('mobileSettingsNow').onclick=function(){ clickId('settingsBtn'); };
    document.addEventListener('click', function(e){ var b=e.target.closest&&e.target.closest('[data-mobile-click]'); if(!b)return; $('mobileFeatureSheet').classList.remove('show'); clickId(b.dataset.mobileClick); }, true);
  }
  function patchTranscribeLanguage(){
    var sel=$('transcribeLang'); if(!sel || sel.dataset.extendedLangs==='1') return;
    sel.dataset.extendedLangs='1';
    sel.innerHTML='<option value="">Auto language</option>'+languageOptions.map(function(o){return '<option value="'+normalizeSpeechLang(o[0])+'">'+o[1]+'</option>';}).join('');
    var saved = localStorage.getItem('studyhive-speech-lang-v1') || normalizeSpeechLang(localStorage.getItem('studyhive-language-v1')||''); if(saved) sel.value=saved;
    sel.addEventListener('change', function(){ localStorage.setItem('studyhive-speech-lang-v1', this.value); });
  }
  function saveOnboardLanguage(){
    var lang=$('onboardLanguage'); if(lang){ localStorage.setItem('studyhive-language-v1', lang.value); localStorage.setItem('studyhive-speech-lang-v1', normalizeSpeechLang(lang.value)); }
  }
  document.addEventListener('click', function(e){ if(e.target && (e.target.id==='onboardStartBtn'||e.target.id==='onboardSkipBtn')) saveOnboardLanguage(); }, true);
  function loop(){ addStartLanguage(); makeMobileChoiceProminent(); installLauncher(); patchTranscribeLanguage(); }
  loop(); setInterval(loop,3500);

  document.addEventListener('click', function(e){
    if(e.target && e.target.id==='saveOgEndpointBtn'){
      var input=document.getElementById('ogEndpointInput');
      if(input){ localStorage.setItem('studyhive-og-endpoint-v1', input.value.trim()); if(typeof showMilestoneToast==='function') showMilestoneToast('OG backend URL saved', 2500); }
    }
  }, true);
  setInterval(function(){ var input=document.getElementById('ogEndpointInput'); if(input && !input.value) input.value=localStorage.getItem('studyhive-og-endpoint-v1')||''; }, 1500);
})();
