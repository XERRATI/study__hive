/* =====================================================================
   Study Hive — 68-voice-cards.js
   VOICE-TO-FLASHCARD QUICK CAPTURE.
   Reuses the SpeechRecognition pipeline the app already ships (js/33's
   transcribe flow) but points it at the Cards panel: tap 🎤, speak a
   thought ("mitochondria: powerhouse of the cell"), and the transcript
   is parsed into a draft front/back pair ready to hit +. No typing.

   Parsing rules (window.voiceCards.parse, unit-tested):
     1. separator ("front : back", " - ", " — ", " | ", " → ")  → front/back
        (a colon only splits when followed by a space, so times like
        12:30 survive)
     2. otherwise first sentence → front, remainder → back
     3. otherwise whole phrase → front, back left empty
   ===================================================================== */

(function () {
  'use strict';
  function $(id) { return window.shGet ? window.shGet(id) : document.getElementById(id); }
  function toast(msg) { if (typeof window.showMilestoneToast === 'function') { try { window.showMilestoneToast(msg, 3800); } catch (e) {} } }

  function parseTranscript(text) {
    text = String(text || '').trim().replace(/\s+/g, ' ');
    if (!text) return { front: '', back: '', split: 'none' };
    var m;
    /* 1. explicit separators — colon needs whitespace after it */
    m = text.match(/^(.{1,140}?)\s*[:：]\s+(.{1,500})$/);
    if (!m) m = text.match(/^(.{1,140}?)\s+[-—–|→]\s+(.{1,500})$/);
    if (m) return { front: m[1].trim(), back: m[2].trim(), split: 'separator' };
    /* 2. first sentence boundary */
    m = text.match(/^(.{1,140}?[.!?])\s+(.{1,500})$/);
    if (m) return { front: m[1].trim(), back: m[2].trim(), split: 'sentence' };
    /* 3. whole phrase as the front */
    return { front: text.slice(0, 140), back: '', split: 'none' };
  }

  function supported() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }

  var rec = null, listening = false;
  function setStatus(msg) { var el = $('voiceCardStatus'); if (el) el.textContent = msg; }
  function resetButton() {
    var b = $('voiceCardBtn');
    if (b) { b.textContent = '🎤'; b.title = 'Speak a card'; b.classList.remove('listening'); }
  }
  function stopListening() {
    if (rec) { try { rec.stop(); } catch (e) {} }
    rec = null; listening = false; resetButton();
  }
  function startListening() {
    if (!supported()) { setStatus('Speech recognition is not supported in this browser — try Chrome or Edge.'); return; }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    try { rec = new SR(); } catch (e) { setStatus('Could not start the microphone.'); return; }
    listening = true;
    var b = $('voiceCardBtn');
    if (b) { b.textContent = '⏹'; b.title = 'Stop listening'; b.classList.add('listening'); }
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = (function () { try { return localStorage.getItem('studyhive-speech-lang-v1') || ''; } catch (e) { return ''; } })() || undefined;
    setStatus('🎙️ Listening… say it like "question : answer"');
    var interim = '';
    rec.onresult = function (ev) {
      var finalText = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalText += t; else interim = t;
      }
      if (finalText) {
        var parts = parseTranscript(finalText);
        var f = $('cardFrontInput'), bk = $('cardBackInput');
        if (f) f.value = parts.front;
        if (bk) bk.value = parts.back;
        setStatus(parts.back ? 'Drafted — check it, then tap + to add.' : 'Drafted the front — add the back or tap + to keep it simple.');
        toast('🎤 Card drafted');
        stopListening();
      } else if (interim) {
        setStatus('🎙️ … "' + interim.slice(0, 60) + (interim.length > 60 ? '…' : '') + '"');
      }
    };
    rec.onerror = function (ev) {
      setStatus(ev && ev.error === 'not-allowed' ? 'Microphone blocked — allow mic access and try again.' : (ev && ev.error ? 'Mic error: ' + ev.error : 'Mic error.'));
      stopListening();
    };
    rec.onend = function () { listening = false; resetButton(); };
    try { rec.start(); } catch (e) { setStatus('Could not start the microphone.'); }
  }

  /* ---------- AI polish: turn a draft into a proper front/back card ----------
     Uses the app's existing free-AI provider (js/30 StudyHiveBeeAI.ask) with
     an offline-friendly fallback: if the AI is busy/unavailable the original
     draft stays untouched and the user edits by hand. Always a manual "tap +"
     step before anything is saved. */
  function polish(text) {
    return new Promise(function (resolve, reject) {
      var ai = window.StudyHiveBeeAI;
      if (!ai || typeof ai.ask !== 'function') { reject(new Error('no-ai')); return; }
      setStatus('✨ Asking the bee AI… (free endpoint, a few seconds)');
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; reject(new Error('timeout')); } }, 20000);
      ai.ask('coach',
        'Turn the following raw study note into ONE concise exam-style flashcard. ' +
        'Reply with exactly two lines:\nFRONT: <the question>\nBACK: <the answer>\n' +
        'No extra text. Raw note: ' + String(text || '').slice(0, 800)
      ).then(function (res) {
        if (done) return; done = true; clearTimeout(timer);
        var mf = String(res || '').match(/FRONT:\s*(.+)/i);
        var mb = String(res || '').match(/BACK:\s*(.+)/i);
        var front = mf ? mf[1].trim() : '';
        var back = mb ? mb[1].trim() : '';
        if (!front) { var parts = parseTranscript(res); front = parts.front; back = parts.back; }
        if (!front) { reject(new Error('empty')); return; }
        resolve({ front: front.slice(0, 140), back: back.slice(0, 500) });
      }).catch(function () {
        if (!done) { done = true; clearTimeout(timer); }
        reject(new Error('ai-failed'));
      });
    });
  }

  function ensureVoiceButton() {
    if ($('voiceCardBtn')) return;
    var addBtn = $('cardAddBtn');
    var row = addBtn ? addBtn.parentNode : null;
    if (!row) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'voiceCardBtn';
    btn.className = 'exam-add-btn voice-card-btn';
    btn.textContent = '🎤';
    btn.title = 'Speak a card — talk, it becomes a draft';
    btn.addEventListener('click', function () { listening ? stopListening() : startListening(); });
    addBtn.insertAdjacentElement('afterend', btn);
    var pol = document.createElement('button');
    pol.type = 'button';
    pol.id = 'voicePolishBtn';
    pol.className = 'exam-add-btn voice-card-btn';
    pol.textContent = '✨';
    pol.title = 'AI-polish the draft into a proper front/back card';
    pol.addEventListener('click', function () {
      var f = $('cardFrontInput'), bk = $('cardBackInput');
      var text = ((f && f.value) || '') + ((bk && bk.value) ? ('\n' + bk.value) : '');
      if (!text.trim()) { setStatus('Type or speak something first, then tap ✨.'); return; }
      polish(text).then(function (parts) {
        if (f) f.value = parts.front;
        if (bk) bk.value = parts.back;
        setStatus('✨ Polished — check it, then tap + to add.');
        toast('✨ Card polished');
      }).catch(function () {
        setStatus('✨ AI busy or unavailable — your draft is still there, edit it yourself.');
      });
    });
    btn.insertAdjacentElement('afterend', pol);
    var st = document.createElement('span');
    st.id = 'voiceCardStatus';
    st.className = 'voice-card-status';
    row.insertAdjacentElement('afterend', st);
  }
  setInterval(ensureVoiceButton, 2000);
  ensureVoiceButton();

  window.voiceCards = { parse: parseTranscript, polish: polish, supported: supported, start: startListening, stop: stopListening };
})();
