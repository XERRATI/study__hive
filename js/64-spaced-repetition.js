/* =====================================================================
   Study Hive — 64-spaced-repetition.js
   REAL SPACED REPETITION (SM-2-lite) for flashcards.
   · Each card gains scheduling fields: ease, interval, reps, lapses,
     due (timestamp), lastRating.
   · Existing cards (created before this feature) become due immediately.
   · Rating a card (Again / Hard / Good / Easy) schedules its next review:
       Again -> 10 min, resets the step
       Hard  -> interval * 1.2 (min 1 day)
       Good  -> interval * 2.5 (SM-2 standard)
       Easy  -> interval * 3.5
   · The Cards panel gets a "Due today" count + a Review Queue that only
     shows cards due now (plus 20 new cards when the queue is empty).
   · Works with the existing visibleCardIndices()/renderFlashcards()
     machinery — we only ADD due-awareness and the rating buttons.
   ===================================================================== */

(function () {
  'use strict';
  function getJSON(k, fb) { try { return JSON.parse(localStorage.getItem(k) || 'null') || fb; } catch (e) { return fb; } }
  function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function todayStart() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmtDate(ts) { var d = new Date(ts); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1); }

  var SR_KEY = 'hive-sr-v1';
  var state = getJSON(SR_KEY, {}); // { cardId: {ease, interval, reps, lapses, due} }

  /* -------- core scheduling -------- */
  function ensureCard(id) {
    if (!state[id]) {
      state[id] = { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: Date.now() };
    }
    return state[id];
  }

  function rate(id, rating) {
    var s = ensureCard(id);
    var now = Date.now();
    s.lastRating = rating; /* round 13: keep rating history for smarter plans */
    if (window.buzz) window.buzz(rating === 'again' ? 25 : 15);
    if (rating === 'again') {
      s.reps = 0;
      s.lapses = (s.lapses || 0) + 1;
      s.ease = Math.max(1.3, (s.ease || 2.5) - 0.2);
      s.interval = 10 / 1440; /* 10 minutes in days */
      s.due = now + 10 * 60 * 1000;
    } else if (rating === 'hard') {
      s.reps = (s.reps || 0) + 1;
      s.ease = Math.max(1.3, (s.ease || 2.5) - 0.15);
      s.interval = Math.max(1, Math.round(((s.interval || 0) * 1.2) * 10) / 10);
      if (s.reps === 1) s.interval = 1;
      s.due = now + s.interval * 86400000;
    } else if (rating === 'good') {
      s.reps = (s.reps || 0) + 1;
      s.interval = s.reps === 1 ? 1 : Math.round(((s.interval || 0) * 2.5) * 10) / 10;
      s.due = now + s.interval * 86400000;
    } else if (rating === 'easy') {
      s.reps = (s.reps || 0) + 1;
      s.ease = (s.ease || 2.5) + 0.15;
      s.interval = s.reps === 1 ? 4 : Math.round(((s.interval || 0) * 3.5) * 10) / 10;
      s.due = now + s.interval * 86400000;
    }
    setJSON(SR_KEY, state);
    return s.interval;
  }

  /* -------- helpers used by the cards panel -------- */
  function dueCount() {
    var cards = getJSON('hive-flashcards-v1', []);
    var n = 0;
    cards.forEach(function (c) {
      if (!c.id) c.id = c.front + '|' + c.back;
      var s = state[c.id];
      if (!s || s.due <= Date.now()) n++;
    });
    return n;
  }

  /* One-time migration: old cards without an id get a stable random one
     (and it is stored on the card object so it never changes again). */
  function ensureId(card) {
    if (!card.id) card.id = window.makeCardId ? window.makeCardId() : (card.front + '|' + card.back);
    return card.id;
  }
  function isDue(card) {
    ensureId(card);
    var s = state[card.id];
    return !s || s.due <= Date.now();
  }

  function dueList() {
    var cards = getJSON('hive-flashcards-v1', []);
    return cards.filter(isDue);
  }

  function nextDueLabel(card) {
    ensureId(card);
    var s = state[card.id];
    if (!s) return 'due now';
    var days = Math.ceil((s.due - Date.now()) / 86400000);
    if (days <= 0) return 'due now';
    if (days === 1) return 'due tomorrow';
    return 'due in ' + days + 'd';
  }

  /* -------- inject "Due today" badge + review-queue toggle into the Cards panel -------- */
  function injectUI() {
    var panel = document.getElementById('cardsPanel');
    if (!panel || document.getElementById('srBadge')) return;
    var h4 = panel.querySelector('h4');
    if (!h4) return;
    var wrap = document.createElement('div');
    wrap.id = 'srWrap';
    wrap.className = 'sr-wrap';
    wrap.innerHTML =
      '<div class="sr-badge" id="srBadge">🐝 Due today: <b>0</b></div>' +
      '<button class="sr-toggle" id="srToggle">🔁 Review due cards only</button>';
    h4.insertAdjacentElement('afterend', wrap);
    document.getElementById('srToggle').addEventListener('click', function () {
      window.__srQueueOnly = !window.__srQueueOnly;
      this.classList.toggle('on', !!window.__srQueueOnly);
      this.textContent = window.__srQueueOnly ? '🔁 All cards' : '🔁 Review due cards only';
      try { if (window.renderFlashcards) window.renderFlashcards(); } catch (e) {}
    });
    /* refresh the badge periodically */
    setInterval(function () {
      var b = document.getElementById('srBadge');
      if (b) b.innerHTML = '🐝 Due today: <b>' + dueCount() + '</b>';
    }, 5000);
  }

  /* -------- make the existing panel due-aware: hook renderFlashcards + the rating buttons -------- */
  var hooked = false;
  function hook() {
    if (hooked) return;
    hooked = true;

    /* 1. due-only filtering: wrap visibleCardIndices so the queue respects
          "due cards only". The cards panel (js/06) loads LATER than us, so
          re-apply the wrap on an interval until it's in place. */
    function wrapVisible() {
      var cur = window.visibleCardIndices;
      if (cur && cur.__srHooked) return;
      if (!cur) return;
      var wrapped = function () {
        var base = cur();
        if (!window.__srQueueOnly) return base;
        return base.filter(function (i) {
          try {
            var cards = JSON.parse(localStorage.getItem('hive-flashcards-v1') || '[]');
            return isDue(cards[i]);
          } catch (e) { return true; }
        });
      };
      wrapped.__srHooked = true;
      window.visibleCardIndices = wrapped;
    }
    wrapVisible();
    setInterval(wrapVisible, 1000);

    /* 2. add the 4 rating buttons next to the existing Got it / Again */
    function ensureRatingButtons() {
      var row = document.getElementById('flashcardMasteryRow');
      if (!row || document.getElementById('srRatingRow')) return;
      var r = document.createElement('div');
      r.id = 'srRatingRow';
      r.className = 'sr-rating-row';
      r.innerHTML =
        '<button class="sr-rate again" data-rate="again">😵 Again</button>' +
        '<button class="sr-rate hard" data-rate="hard">😓 Hard</button>' +
        '<button class="sr-rate good" data-rate="good">🙂 Good</button>' +
        '<button class="sr-rate easy" data-rate="easy">😄 Easy</button>' +
        '<div class="sr-swipe-hint">👈 swipe left = Again · swipe right = Good 👉</div>';
      row.appendChild(r);
      r.querySelectorAll('.sr-rate').forEach(function (b) {
        b.addEventListener('click', function () {
          var vis = window.visibleCardIndices ? window.visibleCardIndices() : [];
          var pos = (window.flashcardPosRef ? window.flashcardPosRef() : (window.flashcardPos || 0));
          var realIdx = vis[pos];
          if (realIdx === undefined) return;
          var cards = JSON.parse(localStorage.getItem('hive-flashcards-v1') || '[]');
          var card = cards[realIdx];
          ensureId(card);
          rate(card.id, b.getAttribute('data-rate'));
          /* keep the old known flag in sync: Again => unknown, others => known-ish */
          if (b.getAttribute('data-rate') === 'again') { card.known = false; }
          else { card.known = true; }
          setJSON('hive-flashcards-v1', cards);
          try { if (window.renderFlashcards) window.renderFlashcards(); } catch (e) {}
        });
      });
    }
    setInterval(ensureRatingButtons, 1500);
  }

  /* -------- SWIPE GESTURES on flashcards (Anki/Tinder style) --------
     Swipe LEFT  = Again  (😵)
     Swipe RIGHT = Good   (🙂)
     Works on the #activeFlashcard element; taps still flip the card.
     A swipe suppresses the flip-click that would otherwise fire. */
  window.__srSwipeJust = false;
  function attachSwipe() {
    var card = document.getElementById('activeFlashcard');
    if (!card || card.dataset.swipe === '1') return;
    card.dataset.swipe = '1';
    var x0 = 0, y0 = 0, dragging = false;

    card.addEventListener('touchstart', function (e) {
      var t = e.touches && e.touches[0];
      if (!t) return;
      x0 = t.clientX; y0 = t.clientY; dragging = true;
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var t = e.touches && e.touches[0];
      if (!t) return;
      var dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      if (Math.abs(dx) > Math.abs(dy)) e.preventDefault(); /* stop scroll on horizontal swipe */
      card.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 22) + 'deg)';
      card.style.opacity = String(Math.max(0.25, 1 - Math.abs(dx) / 420));
    }, { passive: false });

    card.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      var t = e.changedTouches && e.changedTouches[0];
      var dx = t ? t.clientX - x0 : 0;
      card.style.transition = '';
      if (Math.abs(dx) > 70) {
        var rating = dx < 0 ? 'again' : 'good';
        window.__srSwipeJust = true;
        setTimeout(function () { window.__srSwipeJust = false; }, 450);
        /* slide the card out, then rate + rerender */
        card.style.transform = 'translateX(' + (dx < 0 ? '-130%' : '130%') + ') rotate(' + (dx < 0 ? -16 : 16) + 'deg)';
        card.style.opacity = '0';
        setTimeout(function () {
          var vis = window.visibleCardIndices ? window.visibleCardIndices() : [];
          var pos = window.flashcardPosRef ? window.flashcardPosRef() : 0;
          var realIdx = vis[pos];
          if (realIdx !== undefined) {
            var cards = JSON.parse(localStorage.getItem('hive-flashcards-v1') || '[]');
            var c = cards[realIdx];
            ensureId(c);
            rate(c.id, rating);
            if (rating === 'again') c.known = false; else c.known = true;
            setJSON('hive-flashcards-v1', cards);
            try { if (window.renderFlashcards) window.renderFlashcards(); } catch (err) {}
          }
        }, 170);
      } else {
        card.style.transform = '';
        card.style.opacity = '';
      }
    }, { passive: true });
  }
  /* suppress the flip click right after a swipe */
  document.addEventListener('click', function (e) {
    if (window.__srSwipeJust && e.target && e.target.id === 'activeFlashcard') {
      e.stopPropagation(); e.preventDefault();
    }
  }, true);
  setInterval(attachSwipe, 2000);

  /* -------- expose for the exam planner + tests -------- */
  window.spacedRep = { rate: rate, dueCount: dueCount, dueList: dueList, isDue: isDue, nextDueLabel: nextDueLabel, state: state };

  injectUI();
  setInterval(injectUI, 3000);
  hook();
})();
