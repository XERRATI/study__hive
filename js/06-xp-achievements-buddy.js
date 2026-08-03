/* =====================================================================
   Study Hive — 06-xp-achievements-buddy.js
   Extracted from the original single-file build (script block #4).
   Loaded from index.html in document order — do not reorder.
   ===================================================================== */


(function(){
  function $(id){ return document.getElementById(id); }
  function todayKey(){ return dateKey(new Date()); }
  function escapeHtml(s){ var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  /* ================= XP & ACHIEVEMENT SYSTEM ================= */
  var LEVELS = [
    {name:'Egg', icon:'🥚', min:0},
    {name:'Larva', icon:'🐛', min:100},
    {name:'Worker', icon:'🐝', min:300},
    {name:'Drone', icon:'🐝', min:700},
    {name:'Guard', icon:'🛡️', min:1300},
    {name:'Queen Bee', icon:'👑', min:2200}
  ];
  var ACHIEVEMENTS = [
    {id:'first_blood', name:'First Blood', icon:'🩸'},
    {id:'century_club', name:'Century Club', icon:'💯'},
    {id:'half_hive', name:'Half Hive', icon:'🍯'},
    {id:'night_owl', name:'Night Owl', icon:'🦉'},
    {id:'early_bird', name:'Early Bird', icon:'🐦'},
    {id:'sergeants_favorite', name:"Sergeant's Favorite", icon:'🫡'},
    {id:'iron_streak', name:'Iron Streak', icon:'⛓️'},
    {id:'hive_complete', name:'Hive Complete', icon:'🏆'},
    {id:'marathon_bee', name:'Marathon Bee', icon:'🏃'},
    {id:'quarter_century', name:'Quarter Century', icon:'🎯'},
    {id:'mood_ring', name:'Mood Ring', icon:'🌈'},
    {id:'task_master', name:'Task Master', icon:'✅'},
    {id:'clean_slate', name:'Clean Slate', icon:'🧹'},
    {id:'quote_collector', name:'Quote Collector', icon:'📜'},
    {id:'grade_planner', name:'Grade A Planner', icon:'📊'},
    {id:'worker_bee', name:'Worker Bee', icon:'🐝'},
    {id:'guard_duty', name:'Guard Duty', icon:'🛡️'},
    {id:'queens_court', name:"Queen's Court", icon:'👑'},
    {id:'weekend_warrior', name:'Weekend Warrior', icon:'⚔️'},
    {id:'buzz_beginner', name:'Buzz Beginner', icon:'🐣'},
    {id:'hydro_hero', name:'Hydro Hero', icon:'💧'},
    {id:'zen_bee', name:'Zen Bee', icon:'🧘'},
    {id:'pomodoro_pro', name:'Pomodoro Pro', icon:'🍅'},
    {id:'wordsmith', name:'Wordsmith', icon:'🔤'},
    {id:'planner_pro', name:'Planner Pro', icon:'📅'},
    {id:'note_taker', name:'Note Taker', icon:'📝'},
    {id:'backup_buddy', name:'Backup Buddy', icon:'💾'},
    {id:'habit_hero', name:'Habit Hero', icon:'✅'}
  ];
  var xpState = {xp:0, unlocked:[], weekendDays:[]};
  (function(){ var raw = storageGet('hive-xp-v1'); if (raw) { try { xpState = Object.assign(xpState, JSON.parse(raw)); } catch(e){} } })();
  function saveXp(){ storageSet('hive-xp-v1', JSON.stringify(xpState)); }
  function currentLevelIndex(){ var idx = 0; for (var i=0;i<LEVELS.length;i++){ if (xpState.xp >= LEVELS[i].min) idx = i; } return idx; }
  function renderXpBar(){
    var idx = currentLevelIndex(), level = LEVELS[idx], next = LEVELS[idx+1];
    var pct = next ? Math.min(100, Math.round(((xpState.xp - level.min) / (next.min - level.min)) * 100)) : 100;
    $('xpBarFill').style.width = pct + '%';
    $('levelBadge').innerHTML = level.icon + ' ' + level.name + ' <span class="xp-count" id="xpCount">' + xpState.xp + ' XP</span>';
  }
  function showLevelInfo(){
    var idx = currentLevelIndex(), level = LEVELS[idx], next = LEVELS[idx+1];
    var pct = next ? Math.min(100, Math.round(((xpState.xp - level.min) / (next.min - level.min)) * 100)) : 100;
    var msg = level.icon + ' ' + level.name + ' · ' + xpState.xp + ' XP';
    if (next) msg += ' · ' + pct + '% to ' + next.name + ' (' + (next.min - xpState.xp) + ' XP to go)';
    else msg += ' · MAX LEVEL';
    showMilestoneToast(msg, 4200);
  }
  (function(){
    var lb = $('levelBadge');
    if (lb && !lb.dataset.xpInfo) { lb.dataset.xpInfo = '1'; lb.addEventListener('click', showLevelInfo); }
    setTimeout(function(){ var lb2 = $('levelBadge'); if (lb2 && !lb2.dataset.xpInfo) { lb2.dataset.xpInfo = '1'; lb2.addEventListener('click', showLevelInfo); } }, 3000);
  })();
  function flashXpBadge(gained){
    var lb = $('levelBadge');
    if (!lb) return;
    if (gained) {
      var idx = currentLevelIndex(), level = LEVELS[idx];
      lb.innerHTML = '+' + gained + ' XP! · ' + level.icon + ' ' + level.name + ' <span class="xp-count">' + xpState.xp + ' XP</span>';
    }
    lb.classList.add('show');
    clearTimeout(flashXpBadge._t);
    flashXpBadge._t = setTimeout(function(){ lb.classList.remove('show'); }, 2400);
  }
  function addXp(amount){ xpState.xp += amount; saveXp(); renderXpBar(); flashXpBadge(amount); checkAchievements(); }
  function burstAtHive(){
    var rect = hiveWrap.getBoundingClientRect();
    var cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    for (var i=0;i<14;i++){
      var p = document.createElement('div');
      p.className = 'xp-particle';
      var angle = Math.random()*Math.PI*2, dist = 40 + Math.random()*50;
      p.style.setProperty('--dx', Math.cos(angle)*dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle)*dist + 'px');
      p.style.left = cx + 'px'; p.style.top = cy + 'px';
      document.body.appendChild(p);
      (function(el){ setTimeout(function(){ el.remove(); }, 950); })(p);
    }
  }
  function unlockAchievement(id){
    if (xpState.unlocked.indexOf(id) !== -1) return;
    xpState.unlocked.push(id); saveXp();
    var a = ACHIEVEMENTS.filter(function(x){ return x.id === id; })[0];
    if (!a) return;
    var toast = $('achievementToast');
    toast.textContent = a.icon + ' Achievement Unlocked: ' + a.name;
    toast.classList.add('show');
    clearTimeout(unlockAchievement._t);
    unlockAchievement._t = setTimeout(function(){ toast.classList.remove('show'); }, 4000);
    burstAtHive();
    addXp(25);
  }
  function checkAchievements(){
    if (studyData.sessionsTotal >= 1) unlockAchievement('first_blood');
    if (studyData.totalMinutes >= 100) unlockAchievement('century_club');
    if (studyData.currentStreak >= 7) unlockAchievement('sergeants_favorite');
    if (studyData.currentStreak >= 14) unlockAchievement('iron_streak');
    if (studyData.sessionsTotal >= 25) unlockAchievement('quarter_century');
    var _subjKeys = Object.keys(studyData.subjects);
    if (_subjKeys.length && _subjKeys.every(function(s){ return studyData.subjects[s] >= 50*60; })) unlockAchievement('hive_complete');
    if (_subjKeys.length && _subjKeys.some(function(s){ return studyData.subjects[s] >= 25*60; })) unlockAchievement('half_hive');
    var idx = currentLevelIndex();
    if (idx >= 2) unlockAchievement('worker_bee');
    if (idx >= 4) unlockAchievement('guard_duty');
    if (idx >= 5) unlockAchievement('queens_court');
  }
  renderXpBar();
  checkAchievements();

  /* ================= STUDY BUDDY BEE ================= */
  var buddyLines = [
    "You just crushed that session! 🍯", "Look at you go! Proud of you.",
    "That's another brick in the hive. 🐝", "Ok that was actually impressive ngl.",
    "Snack break? You earned it.", "Sergeant's watching, but I'm cheering for you.",
    "Not bad. Not bad at all 👀", "You + focus = unstoppable combo.",
    "Okay but did YOU know you're doing amazing?", "One session closer to done. Keep buzzing."
  ];
  buddyLines = buddyLines.concat([
    "That was a real brick in the hive wall.",
    "Your future self just high-fived a bee.",
    "Small session, real progress. That's how it works.",
    "You showed up even when it wasn't glamorous. Big win.",
    "Mistakes found are points earned. Keep them coming.",
    "The hive noticed. The hive approves.",
    "One more reason results day won't scare you.",
    "You are becoming the kind of person who follows through.",
    "That focus block had honey in it.",
    "Remember this feeling next time starting feels hard."
  ]);
  /* Longer, warmer lines — the Buddy talks in sentences now, not just slogans. */
  buddyLines = buddyLines.concat([
    "Listen. That session just happened, and it happened because you decided to sit down. That decision is the whole game, and you keep winning it.",
    "Nobody is keeping score of how fast you go — only that you keep going. You just added another honest block to today, and that counts for everything.",
    "Some days the hive grows a whole new wall; some days it adds one cell. Both are growth. Both got done today. Be proud of the one cell.",
    "You didn't wait for motivation to strike. You sat down anyway, and motivation showed up late to find you already working. That's the pro move.",
    "Future-you is looking back at right now and smiling. Seriously. Every minute you log today is a gift they'll open on results day.",
    "Progress isn't loud. It's quiet minutes stacked on quiet minutes, and you just stacked another one. The hive sees every single one of them.",
    "If studying felt hard today, that's not a sign to stop — it's a sign your brain was actually working. Hard is where the learning lives.",
    "One honest block done is one less thing weighing on you tonight. You can close the laptop with a clean conscience, recruit of the good kind.",
    "You're not behind. You're exactly where you are, doing exactly what you can, and that's been enough every single day so far.",
    "Remember this: starting was the hard part, and you already did it today. The rest of the day is downhill from here, bee."
  ]);
  function showBuddyBee(){
    var wrap = $('buddyBeeWrap');
    $('buddyBubble').textContent = buddyLines[Math.floor(Math.random()*buddyLines.length)];
    wrap.classList.add('show');
    clearTimeout(showBuddyBee._t);
    showBuddyBee._t = setTimeout(function(){ wrap.classList.remove('show'); }, 5000);
  }

  /* ================= WRAP recordStudyCompleted (XP + achievements + buddy) ================= */
  var _originalRecordStudyCompleted = recordStudyCompleted;
  recordStudyCompleted = function(subject, minutes){
    var hr = new Date().getHours();
    var wasNight = hr >= 23 || hr < 5;
    var wasEarly = hr >= 4 && hr < 6;
    var day = new Date().getDay();
    _originalRecordStudyCompleted(subject, minutes);
    addXp(minutes * 2);
    if (wasNight) unlockAchievement('night_owl');
    if (wasEarly) unlockAchievement('early_bird');
    if (minutes >= 45) unlockAchievement('marathon_bee');
    if (day === 0 || day === 6) {
      if (xpState.weekendDays.indexOf(day) === -1) xpState.weekendDays.push(day);
      if (xpState.weekendDays.indexOf(0) !== -1 && xpState.weekendDays.indexOf(6) !== -1) unlockAchievement('weekend_warrior');
      saveXp();
    }
    showBuddyBee();
    checkAchievements();
  };

  /* ================= MOOD TRACKER ================= */
  var MOOD_ADJUST = {1:-2, 2:-1, 3:0, 4:1, 5:2};
  var moodHistory = [];
  (function(){ var raw = storageGet('hive-mood-v1'); if (raw) { try { moodHistory = JSON.parse(raw); } catch(e){} } })();
  function saveMood(){ storageSet('hive-mood-v1', JSON.stringify(moodHistory)); }
  function applyTodayMoodAdjust(){
    var today = todayKey();
    var entry = moodHistory.filter(function(m){ return m.date === today; })[0];
    window.moodNagAdjust = entry ? MOOD_ADJUST[entry.mood] : 0;
  }
  function renderMoodButtons(){
    var today = todayKey();
    var entry = moodHistory.filter(function(m){ return m.date === today; })[0];
    document.querySelectorAll('.mood-btn').forEach(function(btn){
      btn.classList.toggle('today-pick', !!entry && String(entry.mood) === btn.dataset.mood);
    });
  }
  function renderSparkline(){
    var el = $('moodSparkline');
    var recent = moodHistory.slice(-10);
    if (recent.length < 2) { el.innerHTML = ''; return; }
    var w = 40, h = 24, step = w / (recent.length - 1);
    var pts = recent.map(function(m, i){
      var y = h - ((m.mood - 1) / 4) * h;
      return (i*step).toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    el.innerHTML = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '"><polyline points="' + pts + '" fill="none" stroke="#e29b1c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  document.querySelectorAll('.mood-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var mood = parseInt(btn.dataset.mood, 10);
      var today = todayKey();
      var existing = moodHistory.filter(function(m){ return m.date === today; })[0];
      if (existing) { existing.mood = mood; } else { moodHistory.push({date:today, mood:mood}); }
      if (moodHistory.length > 60) moodHistory = moodHistory.slice(-60);
      saveMood();
      applyTodayMoodAdjust();
      renderMoodButtons();
      renderSparkline();
      updateSergeantAnger();
      unlockAchievement('buzz_beginner');
      var last5 = moodHistory.slice(-5);
      if (last5.length === 5) {
        var ok = true;
        for (var i=1;i<5;i++){
          var d0 = new Date(last5[i-1].date), d1 = new Date(last5[i].date);
          if (Math.round((d1-d0)/86400000) !== 1) ok = false;
        }
        if (ok) unlockAchievement('mood_ring');
      }
    });
  });
  applyTodayMoodAdjust();
  renderMoodButtons();
  renderSparkline();

  /* ================= GRADE PREDICTOR ================= */
  var gradeBtn = $('gradeBtn'), gradePanel = $('gradePanel');
  var gradeSubjectSelect = $('gradeSubjectSelect');
  var gradeCurrent = $('gradeCurrent'), gradeWeightSoFar = $('gradeWeightSoFar'), gradeTarget = $('gradeTarget'), gradeResult = $('gradeResult');
  var gradesData = {};
  (function(){ var raw = storageGet('hive-grades-v1'); if (raw) { try { gradesData = JSON.parse(raw); } catch(e){} } })();
  function saveGrades(){ storageSet('hive-grades-v1', JSON.stringify(gradesData)); }
  function loadGradeSubject(){
    var subj = gradeSubjectSelect.value, d = gradesData[subj] || {};
    gradeCurrent.value = d.current != null ? d.current : '';
    gradeWeightSoFar.value = d.weightSoFar != null ? d.weightSoFar : '';
    gradeTarget.value = d.target != null ? d.target : '';
    computeGrade();
  }
  function computeGrade(){
    var subj = gradeSubjectSelect.value;
    var current = parseFloat(gradeCurrent.value), weightSoFar = parseFloat(gradeWeightSoFar.value), target = parseFloat(gradeTarget.value);
    gradesData[subj] = {current: gradeCurrent.value, weightSoFar: gradeWeightSoFar.value, target: gradeTarget.value};
    saveGrades();
    var usedSubjects = Object.keys(gradesData).filter(function(s){
      var d = gradesData[s];
      return d && d.current !== '' && d.weightSoFar !== '' && d.target !== '' && d.current != null && d.weightSoFar != null && d.target != null;
    });
    if (usedSubjects.length >= 3) unlockAchievement('grade_planner');
    if (isNaN(current) || isNaN(weightSoFar) || isNaN(target)) {
      gradeResult.textContent = "Fill in the fields above to see what you need on what's left.";
      gradeResult.classList.remove('panic');
      return;
    }
    if (weightSoFar >= 100) {
      gradeResult.textContent = 'All assessments are already in for this subject — final mark: ' + current.toFixed(1) + '%.';
      gradeResult.classList.remove('panic');
      return;
    }
    var remainingWeight = 100 - weightSoFar;
    var needed = (target*100 - current*weightSoFar) / remainingWeight;
    if (needed > 100) {
      var bestPossible = (current*weightSoFar/100) + remainingWeight;
      gradeResult.innerHTML = '⚠️ PANIC MODE: even 100% on everything left won\'t reach ' + target + '%. Best possible final mark is about ' + bestPossible.toFixed(1) + '%.';
      gradeResult.classList.add('panic');
    } else if (needed < 0) {
      gradeResult.textContent = "🎉 You've already secured your target! You could score 0% on the rest and still hit " + target + '%.';
      gradeResult.classList.remove('panic');
    } else {
      gradeResult.textContent = 'You need to average ' + needed.toFixed(1) + '% on the remaining ' + remainingWeight.toFixed(0) + '% of assessments to hit ' + target + '%.';
      gradeResult.classList.remove('panic');
    }
  }
  gradeBtn.addEventListener('click', function(){ gradePanel.classList.toggle('show'); loadGradeSubject(); });
  [gradeCurrent, gradeWeightSoFar, gradeTarget].forEach(function(el){ el.addEventListener('input', computeGrade); });
  gradeSubjectSelect.addEventListener('change', loadGradeSubject);

  /* ================= SMART TODO LIST ================= */
  var todos = [];
  (function(){ var raw = storageGet('hive-todos-v1'); if (raw) { try { todos = JSON.parse(raw); } catch(e){} } })();
  function saveTodos(){ storageSet('hive-todos-v1', JSON.stringify(todos)); }
  var PRIORITY_ORDER = {high:0, medium:1, low:2};
  function renderTodos(){
    var list = $('todoList');
    var sorted = todos.slice().sort(function(a,b){
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return a.created - b.created;
    });
    if (!sorted.length) { list.innerHTML = '<div class="todo-empty">No tasks yet — add one above 🐝</div>'; return; }
    list.innerHTML = sorted.map(function(t){
      return '<li class="todo-item priority-' + t.priority + (t.done ? ' done' : '') + '" data-id="' + t.id + '">' +
        '<input type="checkbox" ' + (t.done ? 'checked' : '') + '>' +
        '<span class="todo-text">' + escapeHtml(t.text) + '</span>' +
        '<button class="todo-del-btn" title="Delete">🗑️</button></li>';
    }).join('');
  }
  var todoToggleBtn = $('todoToggleBtn'), todoPanel = $('todoPanel');
  todoToggleBtn.addEventListener('click', function(){ todoPanel.classList.toggle('show'); });
  function addTodo(){
    var input = $('todoInput'), text = input.value.trim();
    if (!text) return;
    todos.push({id: Date.now() + '-' + Math.random().toString(36).slice(2,7), text: text, priority: $('todoPrioritySelect').value, done:false, created: Date.now()});
    input.value = '';
    saveTodos(); renderTodos();
  }
  $('todoAddBtn').addEventListener('click', addTodo);
  $('todoInput').addEventListener('keydown', function(e){ if (e.key === 'Enter') addTodo(); });
  $('todoList').addEventListener('click', function(e){
    var li = e.target.closest('.todo-item');
    if (!li) return;
    var id = li.dataset.id;
    if (e.target.matches('input[type="checkbox"]')) {
      var t = todos.filter(function(x){ return x.id === id; })[0];
      if (t) {
        t.done = e.target.checked;
        saveTodos(); renderTodos();
        if (todos.filter(function(x){ return x.done; }).length >= 10) unlockAchievement('task_master');
      }
    } else if (e.target.matches('.todo-del-btn')) {
      todos = todos.filter(function(x){ return x.id !== id; });
      saveTodos(); renderTodos();
      if (todos.length === 0) unlockAchievement('clean_slate');
    }
  });
  renderTodos();
  var lastTodoNagTime = 0;
  setInterval(function(){
    var stale = todos.some(function(t){ return !t.done && (Date.now() - t.created) > 2*60*60*1000; });
    if (stale && Date.now() - lastTodoNagTime > 90000) {
      lastTodoNagTime = Date.now();
      showSergeantNag("Those tasks aren't going to check themselves off, recruit. 📋", false);
    }
  }, 60000);

  /* ================= DAILY QUOTE ROTATOR ================= */
  var quotes = [
    {text:"The secret of getting ahead is getting started.", author:"Mark Twain"},
    {text:"It always seems impossible until it's done.", author:"Nelson Mandela"},
    {text:"Success is the sum of small efforts repeated day in and day out.", author:"Robert Collier"},
    {text:"Discipline is the bridge between goals and accomplishment.", author:"Jim Rohn"},
    {text:"The expert in anything was once a beginner.", author:"Helen Hayes"},
    {text:"Don't watch the clock; do what it does. Keep going.", author:"Sam Levenson"},
    {text:"You don't have to be great to start, but you have to start to be great.", author:"Zig Ziglar"},
    {text:"Push yourself, because no one else is going to do it for you.", author:"Unknown"},
    {text:"A little progress each day adds up to big results.", author:"Unknown"},
    {text:"Well done is better than well said.", author:"Benjamin Franklin"},
    {text:"Study while others are sleeping; work while others are loafing.", author:"William A. Ward"},
    {text:"Knowledge is power. Information is liberating.", author:"Kofi Annan"},
    {text:"Believe you can and you're halfway there.", author:"Theodore Roosevelt"},
    {text:"The future belongs to those who prepare for it today.", author:"Malcolm X"},
    {text:"Difficult roads often lead to beautiful destinations.", author:"Unknown"},
    {text:"Small daily improvements are the key to staggering long-term results.", author:"Unknown"}
  ];
  quotes = quotes.concat([
    {text:"The best time to plant a tree was 20 years ago. The second best time is now.", author:"Proverb"},
    {text:"You do not rise to the level of your goals. You fall to the level of your systems.", author:"James Clear"},
    {text:"Success is the product of daily habits, not once-in-a-lifetime transformations.", author:"James Clear"},
    {text:"Do the hard jobs first. The easy jobs will take care of themselves.", author:"Dale Carnegie"},
    {text:"The beautiful thing about learning is nobody can take it away from you.", author:"B.B. King"},
    {text:"Energy and persistence conquer all things.", author:"Benjamin Franklin"},
    {text:"A year from now you may wish you had started today.", author:"Karen Lamb"},
    {text:"The secret of your future is hidden in your daily routine.", author:"Mike Murdock"},
    {text:"What we learn with pleasure we never forget.", author:"Alfred Mercier"},
    {text:"Start where you are. Use what you have. Do what you can.", author:"Arthur Ashe"},
    {text:"Great things are done by a series of small things brought together.", author:"Vincent van Gogh"},
    {text:"It is not that I'm so smart. But I stay with the questions much longer.", author:"Albert Einstein"},
    {text:"Learning never exhausts the mind when curiosity is awake.", author:"Leonardo da Vinci"},
    {text:"The man who moves a mountain begins by carrying away small stones.", author:"Confucius"},
    {text:"Focus on being productive instead of busy.", author:"Tim Ferriss"},
    {text:"The expert was once a beginner who kept going.", author:"Unknown"},
    {text:"Your attention is your most valuable study tool.", author:"Study Hive"},
    {text:"A calm mind remembers more than a panicked one.", author:"Study Hive"},
    {text:"One honest review beats ten anxious rereads.", author:"Study Hive"},
    {text:"Build the hive one cell at a time.", author:"Study Hive"}
  ]);

  /* ULTIMATE_QUOTE_PACK_V2 */
  quotes = quotes.concat([{"text": "Focus is a promise kept in minutes, not moods.", "author": "Study Hive"}, {"text": "Your future is built in the quiet blocks nobody sees.", "author": "Study Hive"}, {"text": "A weak topic is not an enemy; it is a map pin.", "author": "Study Hive"}, {"text": "One honest attempt teaches more than ten perfect intentions.", "author": "Study Hive"}, {"text": "Study like you are building evidence for your confidence.", "author": "Study Hive"}, {"text": "Small effort repeated becomes identity.", "author": "Study Hive"}, {"text": "The page you avoid is probably the page you need.", "author": "Study Hive"}, {"text": "A timer turns fear into a boundary.", "author": "Study Hive"}, {"text": "Do less than you planned if you must, but do not do nothing.", "author": "Study Hive"}, {"text": "Your notes should serve your memory, not your aesthetic.", "author": "Study Hive"}, {"text": "Recall is uncomfortable because it is working.", "author": "Study Hive"}, {"text": "A mistake found today is a mark saved tomorrow.", "author": "Study Hive"}, {"text": "Consistency is focus with a memory.", "author": "Study Hive"}, {"text": "Begin before the excuse finishes speaking.", "author": "Study Hive"}, {"text": "The hardest part of studying is often the doorway.", "author": "Study Hive"}, {"text": "The best revision is active, honest, and repeated.", "author": "Study Hive"}, {"text": "You cannot cram a habit, but you can start one.", "author": "Study Hive"}, {"text": "Confidence grows from proof, not wishing.", "author": "Study Hive"}, {"text": "Your effort is allowed to be quiet.", "author": "Study Hive"}, {"text": "One solved question is better than one hour of dread.", "author": "Study Hive"}, {"text": "Do not wait for clarity; work creates clarity.", "author": "Study Hive"}, {"text": "The study block you finish badly still counts.", "author": "Study Hive"}, {"text": "Your brain trusts patterns more than panic.", "author": "Study Hive"}, {"text": "Rest protects the work.", "author": "Study Hive"}, {"text": "A calm plan beats a loud panic.", "author": "Study Hive"}, {"text": "You are not behind everything; you are at the next step.", "author": "Study Hive"}, {"text": "Progress can be boring and still be beautiful.", "author": "Study Hive"}, {"text": "If you cannot do an hour, do ten minutes with honor.", "author": "Study Hive"}, {"text": "The question you fear is a teacher in disguise.", "author": "Study Hive"}, {"text": "Effort becomes easier when it becomes familiar.", "author": "Study Hive"}, {"text": "Your attention is a garden; water it carefully.", "author": "Study Hive"}, {"text": "A clean desk will not save you, but it can stop stealing from you.", "author": "Study Hive"}, {"text": "Do the first ugly version.", "author": "Study Hive"}, {"text": "Every expert has a history of being confused.", "author": "Study Hive"}, {"text": "You do not need to feel ready to be responsible.", "author": "Study Hive"}, {"text": "Turn the unknown into a list.", "author": "Study Hive"}, {"text": "Your future self reads the notes you write today.", "author": "Study Hive"}, {"text": "A short focused session can rescue a messy day.", "author": "Study Hive"}, {"text": "Discipline is kindness with a schedule.", "author": "Study Hive"}, {"text": "The answer is often one timer away.", "author": "Study Hive"}, {"text": "Study the mistake until it becomes a warning sign.", "author": "Study Hive"}, {"text": "A plan without a start time is a wish.", "author": "Study Hive"}, {"text": "When motivation leaves, systems stay.", "author": "Study Hive"}, {"text": "One page can break the spell of avoidance.", "author": "Study Hive"}, {"text": "Review before panic writes the timetable.", "author": "Study Hive"}, {"text": "You can restart the day at any minute.", "author": "Study Hive"}, {"text": "The quiet student who returns wins more than the loud student who quits.", "author": "Study Hive"}, {"text": "Make the next action too small to refuse.", "author": "Study Hive"}, {"text": "A flashcard is a tiny mirror.", "author": "Study Hive"}, {"text": "If you cannot explain it simply, make that your task.", "author": "Study Hive"}, {"text": "Your streak is not perfection; it is returning.", "author": "Study Hive"}, {"text": "The goal is not to study forever; it is to study honestly.", "author": "Study Hive"}, {"text": "Difficult is not impossible; it is unpracticed.", "author": "Study Hive"}, {"text": "A solved problem is a captured bee.", "author": "Study Hive"}, {"text": "Use pressure as a signal, not a prison.", "author": "Study Hive"}, {"text": "Notes plus questions become memory.", "author": "Study Hive"}, {"text": "Your exam brain is trained by today brain.", "author": "Study Hive"}, {"text": "Start with the part you can name.", "author": "Study Hive"}, {"text": "The hive grows because each cell is finished.", "author": "Study Hive"}, {"text": "No one sees the root work, but every flower depends on it.", "author": "Study Hive"}, {"text": "Be patient with the skill you are building.", "author": "Study Hive"}, {"text": "The second attempt is where learning often begins.", "author": "Study Hive"}, {"text": "A grade is feedback, not a verdict.", "author": "Study Hive"}, {"text": "Do not let one bad session define the system.", "author": "Study Hive"}, {"text": "A focused minute is stronger than a distracted hour.", "author": "Study Hive"}, {"text": "Your study plan should survive a tired day.", "author": "Study Hive"}, {"text": "The next step does not need applause.", "author": "Study Hive"}, {"text": "Questions are hooks for memory.", "author": "Study Hive"}, {"text": "Practice under pressure before pressure arrives.", "author": "Study Hive"}, {"text": "You can be stressed and still take one useful action.", "author": "Study Hive"}, {"text": "Every review is a vote for remembering.", "author": "Study Hive"}, {"text": "The work becomes lighter after the first mark on the page.", "author": "Study Hive"}, {"text": "You are training your attention, not just your knowledge.", "author": "Study Hive"}, {"text": "Give your brain a starting line.", "author": "Study Hive"}, {"text": "Tiny wins are how trust returns.", "author": "Study Hive"}, {"text": "Make confusion specific.", "author": "Study Hive"}, {"text": "Do not admire the problem; work it.", "author": "Study Hive"}, {"text": "Study until the question changes shape.", "author": "Study Hive"}, {"text": "The best time block is the one you protect.", "author": "Study Hive"}, {"text": "Your future confidence needs receipts.", "author": "Study Hive"}, {"text": "If the plan is too heavy, cut it smaller, not away.", "author": "Study Hive"}, {"text": "You can care without panicking.", "author": "Study Hive"}, {"text": "A good break returns you to the work.", "author": "Study Hive"}, {"text": "Discomfort is not danger; sometimes it is learning.", "author": "Study Hive"}, {"text": "The answer you forget today can become automatic next week.", "author": "Study Hive"}, {"text": "Let effort be enough to begin.", "author": "Study Hive"}, {"text": "Use the timer to stop negotiating.", "author": "Study Hive"}, {"text": "A weak foundation improves one brick at a time.", "author": "Study Hive"}, {"text": "The hive does not rush; it repeats.", "author": "Study Hive"}, {"text": "Your attention deserves protection.", "author": "Study Hive"}, {"text": "Do the next question, then decide again.", "author": "Study Hive"}, {"text": "Memory likes spacing more than drama.", "author": "Study Hive"}, {"text": "Fear gets smaller when the task gets clearer.", "author": "Study Hive"}, {"text": "Make revision visible.", "author": "Study Hive"}, {"text": "One honest reflection can improve ten future sessions.", "author": "Study Hive"}, {"text": "Your best study tool is returning after distraction.", "author": "Study Hive"}, {"text": "The goal is progress you can repeat.", "author": "Study Hive"}, {"text": "You can be imperfect and still be consistent.", "author": "Study Hive"}, {"text": "Finish one cell of the honeycomb.", "author": "Study Hive"}, {"text": "Let the first five minutes be messy.", "author": "Study Hive"}, {"text": "Your notes are a conversation with tomorrow.", "author": "Study Hive"}, {"text": "Strong students ask sharper questions.", "author": "Study Hive"}, {"text": "The subject you avoid is asking for structure.", "author": "Study Hive"}, {"text": "Your brain learns from tests it gives itself.", "author": "Study Hive"}, {"text": "Do not outsource your confidence to luck.", "author": "Study Hive"}, {"text": "You do not need more pressure; you need a next action.", "author": "Study Hive"}, {"text": "Today’s review is tomorrow’s relief.", "author": "Study Hive"}, {"text": "A timer is a fence for your focus.", "author": "Study Hive"}, {"text": "Build proof slowly.", "author": "Study Hive"}, {"text": "The hive believes in repeatable effort.", "author": "Study Hive"}]);
  /* QUOTE PACK V3 — more Study Hive lines */
  quotes = quotes.concat([
    {"text": "The hardest exam question is often the one you avoided reading twice.", "author": "Study Hive"},
    {"text": "Your brain is a hive: store well, and it always knows where the honey is.", "author": "Study Hive"},
    {"text": "A boring review done today is a calm exam room tomorrow.", "author": "Study Hive"},
    {"text": "You are not racing anyone. You are building a body of work.", "author": "Study Hive"},
    {"text": "The page you open is the page you beat.", "author": "Study Hive"},
    {"text": "Little and often beats big and rare. Every single time.", "author": "Study Hive"},
    {"text": "A mistake on paper is a mistake out of your head.", "author": "Study Hive"},
    {"text": "Revision is not repeating. It is recalling until it sticks.", "author": "Study Hive"},
    {"text": "Your focus is a muscle, and muscles grow under gentle resistance.", "author": "Study Hive"},
    {"text": "Do not compare your chapter one to someone's chapter twenty.", "author": "Study Hive"},
    {"text": "The best study session is the one you actually started.", "author": "Study Hive"},
    {"text": "Clarity comes from writing things down, not worrying them around.", "author": "Study Hive"},
    {"text": "One topic fully understood beats five half-understood.", "author": "Study Hive"},
    {"text": "Your future self is watching today's choices with gratitude or regret. Choose.", "author": "Study Hive"},
    {"text": "A ten-minute review before bed is a gift to tomorrow's you.", "author": "Study Hive"},
    {"text": "The exam tests recall, and recall is built in quiet, spaced sessions.", "author": "Study Hive"},
    {"text": "Confusion is not failure. It is the doorway learning walks through.", "author": "Study Hive"},
    {"text": "You have survived every bad study day so far. This one is no different.", "author": "Study Hive"},
    {"text": "Small cells of effort become a honeycomb of results.", "author": "Study Hive"},
    {"text": "The best time to study was yesterday. The second best is right now.", "author": "Study Hive"},
    {"text": "A tidy goal beats a clever excuse.", "author": "Study Hive"},
    {"text": "Speed is not the goal. Understanding is. Speed follows.", "author": "Study Hive"},
    {"text": "Your notes are the mirror of your attention. Make them honest.", "author": "Study Hive"},
    {"text": "Every flashcard answered is a future mark banked.", "author": "Study Hive"},
    {"text": "Discipline is remembering what you wanted when you were motivated.", "author": "Study Hive"}
  ]);
  var quoteIdx = Math.floor(Math.random()*quotes.length);
  var favQuotes = [];
  (function(){ var raw = storageGet('hive-fav-quotes-v1'); if (raw) { try { favQuotes = JSON.parse(raw); } catch(e){} } })();
  function saveFav(){ storageSet('hive-fav-quotes-v1', JSON.stringify(favQuotes)); }
  function isFav(q){ return favQuotes.some(function(f){ return f.text === q.text; }); }
  function renderFavPopover(){
    var pop = $('quoteFavPopover');
    if (!favQuotes.length) { pop.innerHTML = '<div class="quote-fav-item">No favorites yet. Tap 🤍 on a quote to save it here.</div>'; return; }
    pop.innerHTML = favQuotes.map(function(f, i){
      return '<div class="quote-fav-item">"' + escapeHtml(f.text) + '" — ' + escapeHtml(f.author) +
        ' <button class="quote-fav-remove" data-i="' + i + '" title="Remove from favorites" aria-label="Remove quote">✕</button></div>';
    }).join('');
    Array.prototype.forEach.call(pop.querySelectorAll('.quote-fav-remove'), function(btn){
      btn.addEventListener('click', function(){
        var idx = parseInt(btn.getAttribute('data-i'), 10);
        if (!isNaN(idx) && favQuotes[idx]) {
          favQuotes.splice(idx, 1);
          saveFav();
          $('quoteFavCount').textContent = favQuotes.length;
          renderFavPopover();
          updateFavBtn();
          showMilestoneToast('💔 Removed from favorites');
        }
      });
    });
  }
  function updateFavBtn(){
    var q = quotes[quoteIdx]; var btn = $('quoteFavBtn'); if (!btn || !q) return;
    var fav = isFav(q);
    btn.textContent = fav ? '❤️' : '🤍';
    btn.setAttribute('aria-pressed', fav ? 'true' : 'false');
    btn.title = fav ? 'Remove from favorites' : 'Save to favorites';
  }
  function renderQuote(){
    var q = quotes[quoteIdx];
    var textEl = $('quoteText'), authorEl = $('quoteAuthor'), nameEl = $('quoteAuthorName'), favBtn = $('quoteFavBtn');
    textEl.classList.remove('show'); authorEl.classList.remove('show');
    setTimeout(function(){
      textEl.textContent = '"' + q.text + '"';
      nameEl.textContent = '— ' + q.author;
      updateFavBtn();
      textEl.classList.add('show'); authorEl.classList.add('show');
    }, 350);
  }
  function nextQuote(){ quoteIdx = (quoteIdx + 1) % quotes.length; renderQuote(); }
  renderQuote();
  setInterval(nextQuote, 30000);
  /* INTERACTIVE: tap the quote itself for another one. */
  (function(){
    var qt = $('quoteText');
    if (qt && !qt.dataset.qq) { qt.dataset.qq = '1'; qt.title = 'Tap for another quote'; qt.addEventListener('click', nextQuote); }
    setTimeout(function(){ var q2 = $('quoteText'); if (q2 && !q2.dataset.qq) { q2.dataset.qq='1'; q2.title='Tap for another quote'; q2.addEventListener('click', nextQuote); } }, 3000);
  })();
  window.toggleQuoteFav = function(){
    var q = quotes[quoteIdx]; if (!q) return;
    if (isFav(q)) {
      favQuotes = favQuotes.filter(function(f){ return f.text !== q.text; });
      showMilestoneToast('💔 Removed from favorites');
    } else {
      favQuotes.push(q);
      if (favQuotes.length >= 5) unlockAchievement('quote_collector');
      showMilestoneToast('❤️ Saved to favorites (' + favQuotes.length + ')');
    }
    saveFav();
    updateFavBtn();
    $('quoteFavCount').textContent = favQuotes.length;
    renderFavPopover();
  };
  $('quoteFavBtn').addEventListener('click', window.toggleQuoteFav);
  $('quoteFavCount').textContent = favQuotes.length;
  renderFavPopover();
  $('quoteFavListBtn').addEventListener('click', function(){ $('quoteFavPopover').classList.toggle('show'); });

  /* ================= LOFI MUSIC PLAYER (Web Audio, generative) ================= */
  var audioCtx = null, currentTrack = null, trackNodes = [], trackTimers = [];
  function addTrackTimer(id){ trackTimers.push(id); return id; }
  function ensureCtx(){
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function stopTrack(){
    trackTimers.forEach(function(id){ clearInterval(id); });
    trackTimers = [];
    clearInterval(stopTrack._beatInterval);
    stopTrack._beatInterval = null;
    var nodesToStop = trackNodes.slice();
    trackNodes = [];
    nodesToStop.forEach(function(n){
      try {
        if (n.gain && audioCtx) n.gain.cancelScheduledValues(audioCtx.currentTime);
        if (n.gain && audioCtx) n.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
      } catch(e){}
    });
    nodesToStop.forEach(function(n){ try { n.stop && n.stop(audioCtx ? audioCtx.currentTime + 0.2 : undefined); } catch(e){} });
    setTimeout(function(){
      nodesToStop.forEach(function(n){ try { n.disconnect && n.disconnect(); } catch(e){} });
    }, 240);
    $('vinylSpinner').classList.remove('spinning');
    document.querySelectorAll('.lofi-track-btn').forEach(function(b){ b.classList.remove('playing'); });
    currentTrack = null;
  }
  function makeNoiseBuffer(ctx){
    var bufferSize = 2 * ctx.sampleRate;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) data[i] = Math.random()*2 - 1;
    return buffer;
  }
  /* LOUDNESS CONTROL: all lofi tracks scale through this. Default 35% —
     soft but clearly audible. Slider lives in the Lofi Player panel. */
  function lofiVol(){
    var v = parseInt(localStorage.getItem('studyhive-bg-volume-v1') || '30', 10);
    if (isNaN(v)) v = 30;
    return Math.max(0, Math.min(2.5, v / 40));
  }
  window.lofiVol = lofiVol;
  function playHiveHum(ctx){
    var master = ctx.createGain(); master.gain.value = 0.18 * lofiVol(); master.connect(ctx.destination); window.__lofiMaster = master;
    [110, 112].forEach(function(freq){
      var osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
      var g = ctx.createGain(); g.gain.value = 0.5;
      osc.connect(g); g.connect(master); osc.start();
      trackNodes.push(osc); trackNodes.push(g);
    });
    trackNodes.push(master);
    var notes = [440, 494, 523, 587, 659];
    stopTrack._beatInterval = setInterval(function(){
      var osc = ctx.createOscillator(); osc.type = 'triangle';
      osc.frequency.value = notes[Math.floor(Math.random()*notes.length)];
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(g); g.connect(master); osc.start(); osc.stop(ctx.currentTime + 1.3);
    }, 2200);
  }
  function playStudyRain(ctx){
    var master = ctx.createGain(); master.gain.value = 0.16 * lofiVol(); master.connect(ctx.destination); window.__lofiMaster = master;
    var noise = ctx.createBufferSource(); noise.buffer = makeNoiseBuffer(ctx); noise.loop = true;
    var filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 900;
    noise.connect(filter); filter.connect(master); noise.start();
    trackNodes.push(noise); trackNodes.push(filter); trackNodes.push(master);
    stopTrack._beatInterval = setInterval(function(){
      var osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 90;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(g); g.connect(master); osc.start(); osc.stop(ctx.currentTime + 0.25);
    }, 900);
  }
  function playDawnFocus(ctx){
    var master = ctx.createGain(); master.gain.value = 0.16 * lofiVol(); master.connect(ctx.destination); window.__lofiMaster = master;
    var pluckNotes = [392, 440, 494, 587];
    stopTrack._beatInterval = setInterval(function(){
      var osc = ctx.createOscillator(); osc.type = 'triangle';
      osc.frequency.value = pluckNotes[Math.floor(Math.random()*pluckNotes.length)];
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
      osc.connect(g); g.connect(master); osc.start(); osc.stop(ctx.currentTime + 1);
      if (Math.random() < 0.4) {
        var bird = ctx.createOscillator(); bird.type = 'sine';
        var bg = ctx.createGain();
        bg.gain.setValueAtTime(0.0001, ctx.currentTime);
        bird.frequency.setValueAtTime(2200 + Math.random()*800, ctx.currentTime);
        bird.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.15);
        bg.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02);
        bg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        bird.connect(bg); bg.connect(master); bird.start(); bird.stop(ctx.currentTime + 0.2);
      }
    }, 1600);
  }
  function playOceanWaves(ctx){
    var master = ctx.createGain(); master.gain.value = 0.2 * lofiVol(); master.connect(ctx.destination); window.__lofiMaster = master;
    var noise = ctx.createBufferSource(); noise.buffer = makeNoiseBuffer(ctx); noise.loop = true;
    var filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 500;
    var waveLfo = ctx.createOscillator(); waveLfo.type = 'sine'; waveLfo.frequency.value = 0.12;
    var waveGain = ctx.createGain(); waveGain.gain.value = 0.09;
    waveLfo.connect(waveGain); waveGain.connect(master.gain);
    noise.connect(filter); filter.connect(master); noise.start(); waveLfo.start();
    trackNodes.push(noise); trackNodes.push(filter); trackNodes.push(master); trackNodes.push(waveLfo); trackNodes.push(waveGain);
  }
  function playForest(ctx){
    var master = ctx.createGain(); master.gain.value = 0.14 * lofiVol(); master.connect(ctx.destination); window.__lofiMaster = master;
    var noise = ctx.createBufferSource(); noise.buffer = makeNoiseBuffer(ctx); noise.loop = true;
    var filter = ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 700; filter.Q.value = 0.5;
    var windGain = ctx.createGain(); windGain.gain.value = 0.06;
    noise.connect(filter); filter.connect(windGain); windGain.connect(master); noise.start();
    trackNodes.push(noise); trackNodes.push(filter); trackNodes.push(windGain); trackNodes.push(master);
    stopTrack._beatInterval = setInterval(function(){
      if (Math.random() < 0.5) {
        var chirp = ctx.createOscillator(); chirp.type = 'sine';
        var cg = ctx.createGain();
        cg.gain.setValueAtTime(0.0001, ctx.currentTime);
        chirp.frequency.setValueAtTime(1800 + Math.random()*1200, ctx.currentTime);
        chirp.frequency.exponentialRampToValueAtTime(1100 + Math.random()*400, ctx.currentTime + 0.12);
        cg.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.02);
        cg.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
        chirp.connect(cg); cg.connect(master); chirp.start(); chirp.stop(ctx.currentTime + 0.2);
      }
    }, 1400);
  }

  function playCalmBeeOutside(ctx){
    var master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.19, ctx.currentTime + 1.6);
    master.connect(ctx.destination);
    trackNodes.push(master);

    // Soft outdoor air bed.
    var noise = ctx.createBufferSource(); noise.buffer = makeNoiseBuffer(ctx); noise.loop = true;
    var windFilter = ctx.createBiquadFilter(); windFilter.type = 'lowpass'; windFilter.frequency.value = 720; windFilter.Q.value = 0.45;
    var windGain = ctx.createGain(); windGain.gain.value = 0.055;
    var windLfo = ctx.createOscillator(); windLfo.type = 'sine'; windLfo.frequency.value = 0.055;
    var windLfoGain = ctx.createGain(); windLfoGain.gain.value = 0.025;
    windLfo.connect(windLfoGain); windLfoGain.connect(windGain.gain);
    noise.connect(windFilter); windFilter.connect(windGain); windGain.connect(master);
    noise.start(); windLfo.start();
    trackNodes.push(noise, windFilter, windGain, windLfo, windLfoGain);

    // Gentle, distant bee hum — warm and calm, not harsh.
    [174, 196, 233].forEach(function(freq, idx){
      var osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
      var lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.08 + idx * 0.035;
      var lfoGain = ctx.createGain(); lfoGain.gain.value = 2.8 + idx;
      var g = ctx.createGain(); g.gain.value = 0.018 / (idx + 1);
      lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
      osc.connect(g); g.connect(master);
      osc.start(); lfo.start();
      trackNodes.push(osc, lfo, lfoGain, g);
    });

    // Slow, soft musical pads in a sunny pentatonic palette.
    var padNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    function playPadNote(){
      var freq = padNotes[Math.floor(Math.random()*padNotes.length)];
      var osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = freq;
      var g = ctx.createGain();
      var t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.055, t + 0.55);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
      osc.connect(g); g.connect(master); osc.start(t); osc.stop(t + 3.8);
      osc.onended = function(){ try { osc.disconnect(); g.disconnect(); } catch(e){} };
    }
    playPadNote();
    addTrackTimer(setInterval(playPadNote, 4200));

    // Occasional quiet birds outside the window.
    function birdChirp(){
      if (Math.random() < 0.28) return;
      var chirps = 1 + Math.floor(Math.random()*3);
      for (var i = 0; i < chirps; i++) {
        (function(i){
          setTimeout(function(){
            var bird = ctx.createOscillator(); bird.type = 'sine';
            var bg = ctx.createGain();
            var t = ctx.currentTime;
            var start = 1500 + Math.random()*1100;
            bird.frequency.setValueAtTime(start, t);
            bird.frequency.exponentialRampToValueAtTime(start * (0.62 + Math.random()*0.18), t + 0.16);
            bg.gain.setValueAtTime(0.0001, t);
            bg.gain.exponentialRampToValueAtTime(0.035, t + 0.025);
            bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
            bird.connect(bg); bg.connect(master); bird.start(t); bird.stop(t + 0.24);
            bird.onended = function(){ try { bird.disconnect(); bg.disconnect(); } catch(e){} };
          }, i * 170);
        })(i);
      }
    }
    addTrackTimer(setInterval(birdChirp, 2600));
  }

  function playWhiteNoise(ctx){
    var master = ctx.createGain(); master.gain.value = 0.1 * lofiVol(); master.connect(ctx.destination); window.__lofiMaster = master;
    var noise = ctx.createBufferSource(); noise.buffer = makeNoiseBuffer(ctx); noise.loop = true;
    noise.connect(master); noise.start();
    trackNodes.push(noise); trackNodes.push(master);
  }
  (function(){
    function ensureLofiVolume(){
      var panel=document.getElementById('musicPanel');
      if(!panel || document.getElementById('lofiVolumeSlider')) return;
      var v=parseInt(localStorage.getItem('studyhive-bg-volume-v1')||'30',10); if(isNaN(v)) v=30;
      var box=document.createElement('div'); box.className='lofi-volume-box';
      box.innerHTML='<label>🎚️ Volume</label><input id="lofiVolumeSlider" type="range" min="0" max="100" value="'+v+'"><span class="lofi-volume-value" id="lofiVolumeValue">'+v+'%</span>';
      var h4=panel.querySelector('h4'); if(h4) h4.insertAdjacentElement('afterend', box); else panel.insertAdjacentElement('afterbegin', box);
      document.getElementById('lofiVolumeSlider').addEventListener('input', function(){
        var val=parseInt(this.value,10)||0;
        localStorage.setItem('studyhive-bg-volume-v1', String(val));
        localStorage.setItem('studyhive-master-volume-v1', String(val));
        var out=document.getElementById('lofiVolumeValue'); if(out) out.textContent=val+'%';
        if(window.__lofiMaster && window.__lofiMaster.gain){
          try{ window.__lofiMaster.gain.setValueAtTime(lofiVol(), window.__lofiMaster.context?window.__lofiMaster.context.currentTime:0); }catch(e){}
        }
        try{ var au=document.getElementById('customUploadedBackgroundMusic'); if(au) au.volume=val/100; }catch(e){}
        var old=document.getElementById('masterMusicVolume'); if(old) old.value=val;
        var oldv=document.getElementById('masterMusicVolumeValue'); if(oldv) oldv.textContent=val+'%';
      });
    }
    ensureLofiVolume(); setInterval(ensureLofiVolume, 3000);
  })();

  document.querySelectorAll('.lofi-track-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var track = btn.dataset.track;
      if (currentTrack === track) { stopTrack(); return; }
      stopTrack();
      var ctx = ensureCtx();
      if (track === 'hive') playHiveHum(ctx);
      else if (track === 'rain') playStudyRain(ctx);
      else if (track === 'dawn') playDawnFocus(ctx);
      else if (track === 'ocean') playOceanWaves(ctx);
      else if (track === 'forest') playForest(ctx);
      else if (track === 'outside') playCalmBeeOutside(ctx);
      else if (track === 'white') playWhiteNoise(ctx);
      currentTrack = track;
      btn.classList.add('playing');
      $('vinylSpinner').classList.add('spinning');
    });
  });

  /* ================= AMBIENT WEATHER ================= */
  var WEATHER_DEFAULT = { name: 'Pretoria', lat: -25.7479, lon: 28.2293 };
  function weatherCodeInfo(code){
    if (code === 0) return {icon:'sun', desc:'Clear sky', tint:'warm'};
    if (code === 1 || code === 2) return {icon:'sun-cloud', desc:'Partly cloudy', tint:'warm'};
    if (code === 3) return {icon:'cloud', desc:'Overcast', tint:'cool'};
    if (code === 45 || code === 48) return {icon:'cloud', desc:'Foggy', tint:'cool'};
    if (code >= 51 && code <= 67) return {icon:'rain', desc:'Rainy', tint:'cool'};
    if (code >= 71 && code <= 77) return {icon:'cloud', desc:'Snowy', tint:'cool'};
    if (code >= 80 && code <= 82) return {icon:'rain', desc:'Showers', tint:'cool'};
    if (code >= 95) return {icon:'rain', desc:'Thunderstorms', tint:'cool'};
    return {icon:'cloud', desc:'Cloudy', tint:'cool'};
  }
  function renderWeatherIcon(kind){
    var el = $('weatherIcon');
    if (kind === 'sun') {
      el.innerHTML = '<div class="weather-sun"></div>';
    } else if (kind === 'sun-cloud') {
      el.innerHTML = '<div class="weather-sun" style="width:70%;height:70%;top:0;left:0;"></div><div class="weather-cloud c1"></div><div class="weather-cloud c2"></div>';
    } else if (kind === 'rain') {
      el.innerHTML = '<div class="weather-cloud c1" style="width:26px;height:16px;top:2px;left:2px;"></div><div class="weather-cloud c2" style="width:18px;height:12px;top:0;left:10px;"></div><div class="weather-rain r1"></div><div class="weather-rain r2"></div><div class="weather-rain r3"></div>';
    } else {
      el.innerHTML = '<div class="weather-cloud c1" style="width:26px;height:16px;top:6px;left:2px;"></div><div class="weather-cloud c2" style="width:18px;height:12px;top:2px;left:10px;"></div>';
    }
  }
  function applyWeather(data, cityName){
    if (!data || !data.current) { $('weatherDesc').textContent = 'Weather unavailable'; return; }
    var temp = Math.round(data.current.temperature_2m);
    var info = weatherCodeInfo(data.current.weather_code);
    $('weatherTemp').textContent = temp + '°C';
    $('weatherDesc').textContent = (cityName ? cityName + ' · ' : '') + info.desc;
    renderWeatherIcon(info.icon);
    var tint = $('weatherTint');
    tint.classList.remove('warm','cool');
    tint.classList.add(info.tint);
  }
  function fetchWeather(lat, lon, cityName){
    /* SUNSET SUPPORT: also request daily sunrise/sunset so night mode can
       switch on at the predicted sunset of the user's location. */
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto')
      .then(function(r){ return r.json(); })
      .then(function(data){
        applyWeather(data, cityName);
        var cache = { data: data, cityName: cityName, ts: Date.now(), lat: lat, lon: lon };
        try {
          if (data && data.daily && data.daily.sunrise && data.daily.sunset) {
            cache.sunrise = data.daily.sunrise[0];
            cache.sunset = data.daily.sunset[0];
            cache.sunriseDate = String(cache.sunrise || '').slice(0, 10);
            cache.sunsetDate = String(cache.sunset || '').slice(0, 10);
          }
        } catch(e){}
        storageSet('hive-weather-cache-v1', JSON.stringify(cache));
      })
      .catch(function(){ $('weatherDesc').textContent = 'Weather unavailable'; });
  }
  function geocodeCity(name){
    $('weatherDesc').textContent = 'Searching…';
    fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&name=' + encodeURIComponent(name))
      .then(function(r){ return r.json(); })
      .then(function(data){
        if (data.results && data.results.length){
          var loc = data.results[0];
          fetchWeather(loc.latitude, loc.longitude, loc.name);
        } else {
          $('weatherDesc').textContent = 'City not found';
        }
      })
      .catch(function(){ $('weatherDesc').textContent = 'Weather unavailable'; });
  }
  function initWeather(){
    var cached = storageGet('hive-weather-cache-v1');
    var haveCache = false;
    if (cached) {
      try {
        var c = JSON.parse(cached);
        if (Date.now() - c.ts < 20*60*1000) { applyWeather(c.data, c.cityName); haveCache = true; }
      } catch(e){}
    }
    if (!haveCache) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos){
          fetchWeather(pos.coords.latitude, pos.coords.longitude, null);
        }, function(){
          fetchWeather(WEATHER_DEFAULT.lat, WEATHER_DEFAULT.lon, WEATHER_DEFAULT.name);
        }, { timeout: 6000 });
      } else {
        fetchWeather(WEATHER_DEFAULT.lat, WEATHER_DEFAULT.lon, WEATHER_DEFAULT.name);
      }
    }
    setInterval(function(){
      var cached2 = storageGet('hive-weather-cache-v1');
      if (cached2) { try { var c2 = JSON.parse(cached2); fetchWeather(c2.lat, c2.lon, c2.cityName); } catch(e){} }
    }, 20*60*1000);
  }
  (function(){
    var ww = $('weatherWidget');
    if (ww && !ww.dataset.weatherTap) {
      ww.dataset.weatherTap = '1';
      ww.addEventListener('click', function(){
        var c = null; try { c = JSON.parse(storageGet('hive-weather-cache-v1') || 'null'); } catch(e){}
        if (c && c.lat && c.lon) { fetchWeather(c.lat, c.lon, c.cityName); showMilestoneToast('🌦️ Refreshing weather…'); }
        else { initWeather(); showMilestoneToast('🌦️ Fetching weather…'); }
      });
    }
  })();
  $('weatherCityInput').addEventListener('keydown', function(e){
    if (e.key === 'Enter' && this.value.trim()){
      geocodeCity(this.value.trim());
      this.value = '';
      this.blur();
    }
  });
  initWeather();

  /* ================= POMODORO TIMER ================= */
  var POMODORO_WORK = 25*60, POMODORO_SHORT = 5*60, POMODORO_LONG = 15*60;
  var pomodoroRingEl = $('pomodoroRing');
  var POMODORO_CIRC = 2 * Math.PI * 36;
  pomodoroRingEl.style.strokeDasharray = POMODORO_CIRC;
  pomodoroRingEl.style.strokeDashoffset = 0;
  var pomodoroState = { phase: 'work', remaining: POMODORO_WORK, total: POMODORO_WORK, sessionsDone: 0, running: false };
  (function(){
    var raw = storageGet('hive-pomodoro-v1');
    if (raw) { try { var saved = JSON.parse(raw); pomodoroState.sessionsDone = saved.sessionsDone || 0; } catch(e){} }
  })();
  var pomodoroInterval = null;
  var pomodoroWidgetEl = $('pomodoroWidget');
  var pomodoroStartBtn = $('pomodoroStartBtn');

  function pomodoroSavePersist(){ storageSet('hive-pomodoro-v1', JSON.stringify({ sessionsDone: pomodoroState.sessionsDone })); }

  function updatePomodoroDisplay(){
    var m = Math.floor(pomodoroState.remaining / 60), s = pomodoroState.remaining % 60;
    $('pomodoroTime').textContent = pad(m) + ':' + pad(s);
    var pct = pomodoroState.total > 0 ? (pomodoroState.remaining / pomodoroState.total) : 0;
    pomodoroRingEl.style.strokeDashoffset = POMODORO_CIRC * (1 - pct);
    $('pomodoroState').textContent = pomodoroState.phase === 'work' ? 'Focus Time' : (pomodoroState.phase === 'long' ? 'Long Break' : 'Short Break');
    $('pomodoroSessions').textContent = 'Session ' + (pomodoroState.sessionsDone % 4 + 1) + ' · ' + pomodoroState.sessionsDone + ' done';
    pomodoroWidgetEl.classList.toggle('on-break', pomodoroState.phase !== 'work');
  }

  function pomodoroChime(){
    if (typeof appSettings !== 'undefined' && appSettings && appSettings.sound === false) return;
    try {
      var ctx = ensureCtx();
      [523, 659, 784].forEach(function(freq, i){
        var osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = freq;
        var g = ctx.createGain();
        var t0 = ctx.currentTime + i*0.15;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.2, t0+0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0+0.5);
        osc.connect(g); g.connect(ctx.destination); osc.start(t0); osc.stop(t0+0.55);
      });
    } catch(e){}
  }

  function pomodoroPhaseComplete(){
    pomodoroChime();
    if (pomodoroState.phase === 'work') {
      var subject = $('pomodoroSubjectSelect').value;
      recordStudyCompleted(subject, Math.round(POMODORO_WORK/60));
      pomodoroState.sessionsDone++;
      pomodoroSavePersist();
      if (pomodoroState.sessionsDone % 4 === 0) {
        pomodoroState.phase = 'long'; pomodoroState.total = POMODORO_LONG; pomodoroState.remaining = POMODORO_LONG;
      } else {
        pomodoroState.phase = 'short'; pomodoroState.total = POMODORO_SHORT; pomodoroState.remaining = POMODORO_SHORT;
      }
      if (pomodoroState.sessionsDone >= 5) unlockAchievement('pomodoro_pro');
    } else {
      pomodoroState.phase = 'work'; pomodoroState.total = POMODORO_WORK; pomodoroState.remaining = POMODORO_WORK;
    }
    clearInterval(pomodoroInterval);
    pomodoroState.running = false;
    pomodoroStartBtn.textContent = 'Start';
    updatePomodoroDisplay();
  }

  function pomodoroTick(){
    pomodoroState.remaining--;
    updatePomodoroDisplay();
    if (pomodoroState.remaining <= 0) pomodoroPhaseComplete();
  }

  function pomodoroToggle(){
    if (pomodoroState.running) {
      clearInterval(pomodoroInterval);
      pomodoroState.running = false;
      pomodoroStartBtn.textContent = 'Start';
    } else {
      pomodoroState.running = true;
      pomodoroStartBtn.textContent = 'Pause';
      pomodoroInterval = setInterval(pomodoroTick, 1000);
    }
  }
  pomodoroStartBtn.addEventListener('click', pomodoroToggle);
  $('pomodoroResetBtn').addEventListener('click', function(){
    // Resetting mid-way through a work phase shouldn't erase the minutes
    // already put in — credit them first, same as the Focus timer's Stop.
    if (pomodoroState.phase === 'work') {
      var elapsedMins = Math.floor((pomodoroState.total - pomodoroState.remaining) / 60);
      if (elapsedMins >= 1) {
        recordStudyCompleted($('pomodoroSubjectSelect').value, elapsedMins);
      }
    }
    clearInterval(pomodoroInterval);
    pomodoroState.running = false;
    pomodoroStartBtn.textContent = 'Start';
    pomodoroState.phase = 'work';
    pomodoroState.total = POMODORO_WORK;
    pomodoroState.remaining = POMODORO_WORK;
    updatePomodoroDisplay();
  });
  updatePomodoroDisplay();

  /* ================= WATER TRACKER ================= */
  var WATER_GOAL = 8;
  var waterState = { count: 0, date: todayKey() };
  (function(){
    var raw = storageGet('hive-water-v1');
    if (raw) {
      try { var saved = JSON.parse(raw); if (saved.date === todayKey()) waterState = saved; } catch(e){}
    }
  })();
  function saveWater(){ storageSet('hive-water-v1', JSON.stringify(waterState)); }
  function renderWater(){
    var wrap = $('waterGlasses');
    wrap.innerHTML = '';
    for (var i = 0; i < WATER_GOAL; i++) {
      var span = document.createElement('span');
      span.className = 'water-glass' + (i < waterState.count ? ' filled' : '');
      span.textContent = i < waterState.count ? '💧' : '🥛';
      span.dataset.idx = i;
      wrap.appendChild(span);
    }
    $('waterCount').textContent = waterState.count + ' / ' + WATER_GOAL;
  }
  $('waterGlasses').addEventListener('click', function(e){
    var t = e.target.closest('.water-glass');
    if (!t) return;
    var idx = parseInt(t.dataset.idx, 10);
    waterState.count = (idx + 1 === waterState.count) ? idx : idx + 1;
    waterState.date = todayKey();
    saveWater();
    renderWater();
    if (waterState.count >= WATER_GOAL) unlockAchievement('hydro_hero');
  });
  renderWater();

  /* ================= BREATHING EXERCISE ================= */
  var breathingBtn = $('breathingBtn'), breathingPanel = $('breathingPanel');
  var breathingOrb = $('breathingOrb'), breathingOrbLabel = $('breathingOrbLabel');
  var breathingCountEl = $('breathingCount');
  var breathingPattern = [4,4,4,4];
  var breathingPhaseNames = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
  var breathingTimer = null, breathingPhaseIdx = 0, breathingCycles = 0, breathingRunning = false;
  var breathTips = [
    "Stand up and stretch your arms overhead for 20 seconds.",
    "Look at something far away for 20 seconds to rest your eyes.",
    "Drink a glass of water before you sit back down.",
    "Walk to the window and get some daylight on your face.",
    "Roll your shoulders back slowly, five times.",
    "Do 10 jumping jacks to wake your body up.",
    "Send someone you care about a quick hello.",
    "Tidy one small thing on your desk.",
    "Step outside for fresh air, even just onto a balcony.",
    "Put on one favourite song and just listen.",
    "Write the next task on paper, then hide every other task.",
    "Do a 30-second reset: jaw loose, shoulders down, long exhale.",
    "Review one mistake and write why it happened.",
    "Step outside and listen for the furthest sound you can hear.",
    "Open a window or change rooms for a clean mental reset.",
    "Make tea or water, then start a 10-minute gentle focus sprint.",
    "Close your eyes and picture finishing the next tiny step.",
    "Delete or archive one distracting tab.",
    "Ask: what would make this task 10% easier? Then do that."
  ];
  breathingBtn.addEventListener('click', function(){ breathingPanel.classList.toggle('show'); });
  document.querySelectorAll('.breathing-preset-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.breathing-preset-btn').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      breathingPattern = btn.dataset.pattern.split('-').map(Number);
      stopBreathing();
    });
  });
  function breathingRunPhase(){
    var dur = breathingPattern[breathingPhaseIdx];
    if (dur === 0) { breathingPhaseIdx = (breathingPhaseIdx + 1) % 4; breathingRunPhase(); return; }
    var name = breathingPhaseNames[breathingPhaseIdx];
    breathingOrbLabel.textContent = name;
    breathingOrb.style.transition = 'transform ' + dur + 's ease-in-out, box-shadow ' + dur + 's ease-in-out';
    if (breathingPhaseIdx === 0) breathingOrb.className = 'breathing-orb grow';
    else if (breathingPhaseIdx === 2) breathingOrb.className = 'breathing-orb shrink';
    breathingTimer = setTimeout(function(){
      breathingPhaseIdx++;
      if (breathingPhaseIdx >= 4) {
        breathingPhaseIdx = 0;
        breathingCycles++;
        breathingCountEl.textContent = breathingCycles + ' cycle' + (breathingCycles === 1 ? '' : 's') + ' this session';
        if (breathingCycles === 1) addXp(5);
        if (breathingCycles >= 10) unlockAchievement('zen_bee');
      }
      if (breathingRunning) breathingRunPhase();
    }, dur * 1000);
  }
  function startBreathing(){
    if (breathingRunning) return;
    breathingRunning = true;
    breathingPhaseIdx = 0;
    breathingRunPhase();
  }
  function stopBreathing(){
    breathingRunning = false;
    clearTimeout(breathingTimer);
    breathingOrb.className = 'breathing-orb';
    breathingOrbLabel.textContent = 'Ready?';
  }
  $('breathingStartBtn').addEventListener('click', startBreathing);
  $('breathingStopBtn').addEventListener('click', stopBreathing);
  $('breathingTipBtn').addEventListener('click', function(){
    $('breathingTip').textContent = '💡 ' + breathTips[Math.floor(Math.random()*breathTips.length)];
  });

  /* ================= GENERIC MISC PANEL TOGGLES ================= */
  function wirePanelToggle(btnId, panelId){
    var b = $(btnId), p = $(panelId);
    if (b && p) b.addEventListener('click', function(){ p.classList.toggle('show'); });
  }
  wirePanelToggle('awardsBtn', 'awardsPanel');
  wirePanelToggle('vocabBtn', 'vocabPanel');
  wirePanelToggle('examBtn', 'examPanel');
  wirePanelToggle('notesBtn', 'notesPanel');
  wirePanelToggle('settingsBtn', 'settingsPanel');
  wirePanelToggle('cardsBtn', 'cardsPanel');
  wirePanelToggle('habitsBtn', 'habitsPanel');
  wirePanelToggle('drawBtn', 'drawPanel');
  wirePanelToggle('shortcutsBtn', 'shortcutsPanel');

  function showToastMessage(msg){
    var toast = $('achievementToast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToastMessage._t);
    showToastMessage._t = setTimeout(function(){ toast.classList.remove('show'); }, 3000);
  }

  /* ================= ACHIEVEMENT GALLERY + SHARE PROGRESS ================= */
  function renderAwardsGallery(){
    var grid = $('awardsGrid');
    if (!grid) return;
    grid.innerHTML = ACHIEVEMENTS.map(function(a){
      var unlocked = xpState.unlocked.indexOf(a.id) !== -1;
      return '<div class="award-cell' + (unlocked ? '' : ' locked') + '" title="' + escapeHtml(a.name) + (unlocked ? '' : ' (locked)') + '">' + a.icon + '</div>';
    }).join('');
    $('awardsProgress').textContent = xpState.unlocked.length + ' / ' + ACHIEVEMENTS.length + ' unlocked';
  }
  renderAwardsGallery();
  var _origUnlockAchievement = unlockAchievement;
  unlockAchievement = function(id){ _origUnlockAchievement(id); renderAwardsGallery(); };

  $('shareProgressBtn').addEventListener('click', function(){
    var level = LEVELS[currentLevelIndex()];
    var daysLeftEl = document.getElementById('days');
    var daysLeft = daysLeftEl ? daysLeftEl.textContent : '?';
    var text = "🐝 My Hive Progress\n" +
      level.icon + " " + level.name + " · " + xpState.xp + " XP\n" +
      "🔥 " + studyData.currentStreak + " day streak (best " + studyData.bestStreak + ")\n" +
      "⏱️ " + Math.round(studyData.totalMinutes / 60) + " hours studied total\n" +
      "🏆 " + xpState.unlocked.length + " / " + ACHIEVEMENTS.length + " achievements\n" +
      "📅 " + daysLeft + " days until the last day of school!";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){
        showToastMessage('📋 Progress copied to clipboard!');
      }).catch(function(){ window.prompt('Copy your progress:', text); });
    } else {
      window.prompt('Copy your progress:', text);
    }
  });

  /* ================= WORD OF THE DAY ================= */
  var VOCAB_WORDS = [
    {word:"Ubiquitous", pos:"adjective", def:"Present, appearing, or found everywhere.", example:"Smartphones have become ubiquitous in modern life."},
    {word:"Ephemeral", pos:"adjective", def:"Lasting for a very short time.", example:"The beauty of cherry blossoms is ephemeral."},
    {word:"Resilience", pos:"noun", def:"The capacity to recover quickly from difficulties.", example:"Her resilience helped her bounce back after the setback."},
    {word:"Ambiguous", pos:"adjective", def:"Open to more than one interpretation.", example:"The instructions were ambiguous, so nobody knew what to do."},
    {word:"Candid", pos:"adjective", def:"Truthful and straightforward; frank.", example:"He gave a candid answer about his mistakes."},
    {word:"Meticulous", pos:"adjective", def:"Showing great attention to detail.", example:"She was meticulous when checking her exam answers."},
    {word:"Pragmatic", pos:"adjective", def:"Dealing with things sensibly and realistically.", example:"We need a pragmatic solution, not an idealistic one."},
    {word:"Diligent", pos:"adjective", def:"Showing careful and persistent effort.", example:"A diligent student reviews notes every day."},
    {word:"Eloquent", pos:"adjective", def:"Fluent and persuasive in speaking or writing.", example:"Her eloquent speech moved the whole hall."},
    {word:"Tenacious", pos:"adjective", def:"Holding firmly to a course of action; persistent.", example:"He was tenacious in pursuing his goals despite setbacks."},
    {word:"Cognizant", pos:"adjective", def:"Having knowledge or awareness of something.", example:"Be cognizant of the time limit during the exam."},
    {word:"Substantiate", pos:"verb", def:"To provide evidence to support a claim.", example:"You must substantiate your argument with facts."},
    {word:"Discern", pos:"verb", def:"To recognize or find something out clearly.", example:"It can be hard to discern fact from opinion under pressure."},
    {word:"Conundrum", pos:"noun", def:"A confusing or difficult problem.", example:"Balancing school and rest is a common conundrum."},
    {word:"Empathy", pos:"noun", def:"The ability to understand and share the feelings of another.", example:"Good leaders show empathy towards their team."},
    {word:"Fortitude", pos:"noun", def:"Courage in facing pain or adversity.", example:"She showed great fortitude during exam season."},
    {word:"Innovate", pos:"verb", def:"To make changes by introducing new methods or ideas.", example:"Scientists constantly innovate to solve global problems."},
    {word:"Juxtapose", pos:"verb", def:"To place things side by side for contrasting effect.", example:"The essay juxtaposes wealth and poverty."},
    {word:"Lucid", pos:"adjective", def:"Clear and easy to understand.", example:"He gave a lucid explanation of the theorem."},
    {word:"Nostalgia", pos:"noun", def:"A sentimental longing for the past.", example:"The old photos filled her with nostalgia."},
    {word:"Obsolete", pos:"adjective", def:"No longer produced or used; out of date.", example:"That old textbook edition is now obsolete."},
    {word:"Perpetual", pos:"adjective", def:"Never ending or changing.", example:"The hive symbolises perpetual hard work."},
    {word:"Quandary", pos:"noun", def:"A state of uncertainty over what to do.", example:"She was in a quandary about which subject to prioritise."},
    {word:"Redundant", pos:"adjective", def:"Not or no longer needed; superfluous.", example:"Remove any redundant words from your essay."},
    {word:"Skeptical", pos:"adjective", def:"Not easily convinced; having doubts.", example:"He remained skeptical of the rumour."},
    {word:"Transient", pos:"adjective", def:"Lasting only for a short time.", example:"Motivation can feel transient without good habits."},
    {word:"Unprecedented", pos:"adjective", def:"Never done or known before.", example:"The exam results were unprecedented this year."},
    {word:"Versatile", pos:"adjective", def:"Able to adapt to many different functions.", example:"A versatile student can handle any subject."},
    {word:"Zealous", pos:"adjective", def:"Having great energy or enthusiasm for a cause.", example:"She was zealous about improving her grades."},
    {word:"Articulate", pos:"adjective", def:"Able to express ideas clearly and effectively.", example:"He is articulate when presenting his arguments."}
  ];

  VOCAB_WORDS = VOCAB_WORDS.concat([{"word": "Abate", "pos": "verb", "def": "To become less intense or widespread.", "example": "The storm began to abate before the students left school."}, {"word": "Aberration", "pos": "noun", "def": "A departure from what is normal or expected.", "example": "The low mark was an aberration, not a pattern."}, {"word": "Abhor", "pos": "verb", "def": "To regard with disgust or hatred.", "example": "She abhors careless mistakes in final answers."}, {"word": "Acquiesce", "pos": "verb", "def": "To accept something reluctantly but without protest.", "example": "He chose to acquiesce to the group plan."}, {"word": "Alacrity", "pos": "noun", "def": "Cheerful readiness or eagerness.", "example": "She accepted the challenge with alacrity."}, {"word": "Ameliorate", "pos": "verb", "def": "To make something better.", "example": "Extra practice can ameliorate weak exam technique."}, {"word": "Anachronistic", "pos": "adjective", "def": "Belonging to a different time period.", "example": "The play used an anachronistic smartphone in a medieval scene."}, {"word": "Apathy", "pos": "noun", "def": "Lack of interest or enthusiasm.", "example": "Apathy is dangerous during revision season."}, {"word": "Appease", "pos": "verb", "def": "To calm or satisfy by giving in.", "example": "The explanation appeased the frustrated class."}, {"word": "Arbitrary", "pos": "adjective", "def": "Based on random choice rather than reason.", "example": "The rule felt arbitrary until the teacher explained it."}, {"word": "Arduous", "pos": "adjective", "def": "Very difficult and requiring effort.", "example": "Preparing for finals can be arduous but worthwhile."}, {"word": "Assiduous", "pos": "adjective", "def": "Showing great care and perseverance.", "example": "Assiduous revision helped her improve steadily."}, {"word": "Austere", "pos": "adjective", "def": "Plain, strict, or severe.", "example": "The austere room had only desks and a clock."}, {"word": "Benevolent", "pos": "adjective", "def": "Kind and well meaning.", "example": "The benevolent tutor stayed late to help."}, {"word": "Bolster", "pos": "verb", "def": "To support or strengthen.", "example": "Evidence can bolster an argument."}, {"word": "Bombastic", "pos": "adjective", "def": "Overly grand or inflated in speech.", "example": "The essay sounded bombastic but lacked evidence."}, {"word": "Brevity", "pos": "noun", "def": "Concise use of words.", "example": "Brevity can make an answer clearer."}, {"word": "Cacophony", "pos": "noun", "def": "A harsh mixture of sounds.", "example": "The hallway became a cacophony after the bell."}, {"word": "Capitulate", "pos": "verb", "def": "To surrender or give in.", "example": "Do not capitulate to procrastination."}, {"word": "Catalyst", "pos": "noun", "def": "Something that causes change.", "example": "One good result became a catalyst for confidence."}, {"word": "Caustic", "pos": "adjective", "def": "Sarcastic or harsh in tone.", "example": "His caustic comment hurt the group morale."}, {"word": "Censure", "pos": "verb", "def": "To strongly criticise.", "example": "The report censured the unsafe decision."}, {"word": "Coalesce", "pos": "verb", "def": "To come together and form one whole.", "example": "Their ideas coalesced into a strong plan."}, {"word": "Cogent", "pos": "adjective", "def": "Clear, logical, and convincing.", "example": "A cogent argument needs evidence and structure."}, {"word": "Complacent", "pos": "adjective", "def": "Too satisfied to notice danger or weakness.", "example": "Complacent students often stop revising too early."}, {"word": "Concede", "pos": "verb", "def": "To admit something is true after resistance.", "example": "She conceded that the method was faster."}, {"word": "Conciliatory", "pos": "adjective", "def": "Intended to calm conflict.", "example": "His conciliatory tone helped the debate continue."}, {"word": "Conspicuous", "pos": "adjective", "def": "Easy to notice.", "example": "The missing conclusion was conspicuous."}, {"word": "Contend", "pos": "verb", "def": "To argue or claim.", "example": "The historian contends that trade caused the conflict."}, {"word": "Contrite", "pos": "adjective", "def": "Feeling sorry for wrongdoing.", "example": "He was contrite after missing the deadline."}, {"word": "Copious", "pos": "adjective", "def": "Abundant; large in amount.", "example": "She took copious notes during the lecture."}, {"word": "Corroborate", "pos": "verb", "def": "To confirm with evidence.", "example": "The graph corroborates the hypothesis."}, {"word": "Credible", "pos": "adjective", "def": "Able to be believed.", "example": "Use credible sources in research."}, {"word": "Cursory", "pos": "adjective", "def": "Quick and not thorough.", "example": "A cursory review is not enough before an exam."}, {"word": "Deference", "pos": "noun", "def": "Respectful submission to another.", "example": "The class listened with deference to the expert."}, {"word": "Deleterious", "pos": "adjective", "def": "Harmful.", "example": "Sleep deprivation has deleterious effects on memory."}, {"word": "Delineate", "pos": "verb", "def": "To describe or outline precisely.", "example": "The diagram delineates the cell structure."}, {"word": "Demur", "pos": "verb", "def": "To raise doubts or objections.", "example": "She demurred when asked to accept the flawed answer."}, {"word": "Denounce", "pos": "verb", "def": "To publicly condemn.", "example": "The article denounced corruption."}, {"word": "Deride", "pos": "verb", "def": "To mock or ridicule.", "example": "Do not deride someone for asking a question."}, {"word": "Despondent", "pos": "adjective", "def": "In low spirits from loss of hope.", "example": "He felt despondent after the mock exam."}, {"word": "Dichotomy", "pos": "noun", "def": "A division between two contrasting things.", "example": "The speech creates a dichotomy between fear and hope."}, {"word": "Diffident", "pos": "adjective", "def": "Shy or lacking confidence.", "example": "The diffident speaker improved with practice."}, {"word": "Disparage", "pos": "verb", "def": "To speak of as unimportant or inferior.", "example": "Do not disparage small progress."}, {"word": "Disseminate", "pos": "verb", "def": "To spread information widely.", "example": "The school disseminated the exam timetable."}, {"word": "Divergent", "pos": "adjective", "def": "Moving in different directions.", "example": "The two theories take divergent approaches."}, {"word": "Ebullient", "pos": "adjective", "def": "Cheerful and full of energy.", "example": "She was ebullient after finishing the project."}, {"word": "Egregious", "pos": "adjective", "def": "Outstandingly bad.", "example": "The calculation contained an egregious error."}, {"word": "Elucidate", "pos": "verb", "def": "To make clear.", "example": "The teacher elucidated the difficult theorem."}, {"word": "Emulate", "pos": "verb", "def": "To imitate with the aim of matching.", "example": "He tried to emulate the best essay structure."}, {"word": "Enervate", "pos": "verb", "def": "To drain energy.", "example": "Too much screen time can enervate focus."}, {"word": "Engender", "pos": "verb", "def": "To cause or give rise to.", "example": "Clear goals engender motivation."}, {"word": "Epistolary", "pos": "adjective", "def": "Written as letters.", "example": "The novel has an epistolary structure."}, {"word": "Equanimity", "pos": "noun", "def": "Calmness under pressure.", "example": "Equanimity helps during timed tests."}, {"word": "Erudite", "pos": "adjective", "def": "Having great knowledge.", "example": "The erudite lecturer cited many sources."}, {"word": "Esoteric", "pos": "adjective", "def": "Known by only a few specialists.", "example": "The article used esoteric terminology."}, {"word": "Eulogy", "pos": "noun", "def": "A speech praising someone who has died.", "example": "The eulogy celebrated her courage."}, {"word": "Euphemism", "pos": "noun", "def": "A mild expression replacing a harsh one.", "example": "Passed away is a euphemism for died."}, {"word": "Exacerbate", "pos": "verb", "def": "To make worse.", "example": "Leaving revision late can exacerbate stress."}, {"word": "Exemplary", "pos": "adjective", "def": "Serving as a desirable model.", "example": "Her lab report was exemplary."}, {"word": "Exonerate", "pos": "verb", "def": "To clear from blame.", "example": "The evidence exonerated the accused."}, {"word": "Expedite", "pos": "verb", "def": "To speed up a process.", "example": "A checklist can expedite revision."}, {"word": "Extol", "pos": "verb", "def": "To praise enthusiastically.", "example": "Teachers extol the value of reading."}, {"word": "Facetious", "pos": "adjective", "def": "Treating serious issues with inappropriate humour.", "example": "His facetious answer annoyed the examiner."}, {"word": "Fastidious", "pos": "adjective", "def": "Very attentive to detail.", "example": "A fastidious proof leaves no steps unclear."}, {"word": "Fervent", "pos": "adjective", "def": "Showing intense passion.", "example": "She made a fervent appeal for change."}, {"word": "Flippant", "pos": "adjective", "def": "Not showing a serious attitude.", "example": "The flippant response cost him marks."}, {"word": "Fortuitous", "pos": "adjective", "def": "Happening by chance, often luckily.", "example": "Their meeting was fortuitous."}, {"word": "Frugal", "pos": "adjective", "def": "Careful with money or resources.", "example": "The frugal plan used only cheap materials."}, {"word": "Garrulous", "pos": "adjective", "def": "Excessively talkative.", "example": "The garrulous witness delayed the hearing."}, {"word": "Gregarious", "pos": "adjective", "def": "Sociable and fond of company.", "example": "The gregarious student enjoyed group work."}, {"word": "Hackneyed", "pos": "adjective", "def": "Overused and lacking originality.", "example": "Avoid hackneyed phrases in essays."}, {"word": "Harangue", "pos": "noun", "def": "A long aggressive speech.", "example": "The coach delivered a harangue at halftime."}, {"word": "Haughty", "pos": "adjective", "def": "Arrogantly superior.", "example": "The haughty tone weakened the argument."}, {"word": "Hedonistic", "pos": "adjective", "def": "Devoted to pleasure.", "example": "The poem criticises a hedonistic lifestyle."}, {"word": "Hypothetical", "pos": "adjective", "def": "Based on a possible idea, not fact.", "example": "Consider a hypothetical situation."}, {"word": "Iconoclast", "pos": "noun", "def": "A person who attacks accepted beliefs.", "example": "The scientist was an iconoclast in her field."}, {"word": "Idiosyncratic", "pos": "adjective", "def": "Distinctive or unusual to an individual.", "example": "His idiosyncratic method still worked."}, {"word": "Imminent", "pos": "adjective", "def": "About to happen.", "example": "The exam is imminent, so revise strategically."}, {"word": "Impetuous", "pos": "adjective", "def": "Acting quickly without thought.", "example": "An impetuous guess can lose marks."}, {"word": "Implacable", "pos": "adjective", "def": "Unable to be appeased.", "example": "The implacable critic rejected every draft."}, {"word": "Implicit", "pos": "adjective", "def": "Suggested but not directly stated.", "example": "The implicit message is that courage matters."}, {"word": "Inadvertent", "pos": "adjective", "def": "Unintentional.", "example": "The error was inadvertent but costly."}, {"word": "Incessant", "pos": "adjective", "def": "Continuing without pause.", "example": "The incessant noise made studying difficult."}, {"word": "Incisive", "pos": "adjective", "def": "Clear, sharp, and intelligent.", "example": "Her incisive analysis impressed the class."}, {"word": "Incongruous", "pos": "adjective", "def": "Out of place or not fitting.", "example": "The comic scene felt incongruous in the tragedy."}, {"word": "Indolent", "pos": "adjective", "def": "Lazy.", "example": "The indolent approach failed during finals."}, {"word": "Ineffable", "pos": "adjective", "def": "Too great to describe in words.", "example": "The view inspired ineffable awe."}, {"word": "Inexorable", "pos": "adjective", "def": "Impossible to stop.", "example": "The countdown moved inexorably forward."}, {"word": "Ingenuous", "pos": "adjective", "def": "Innocent and unsuspecting.", "example": "His ingenuous question revealed a real gap."}, {"word": "Inimical", "pos": "adjective", "def": "Harmful or hostile.", "example": "Constant distraction is inimical to learning."}, {"word": "Insipid", "pos": "adjective", "def": "Lacking flavour or interest.", "example": "The insipid introduction needed a stronger hook."}, {"word": "Insular", "pos": "adjective", "def": "Narrow-minded or isolated.", "example": "The insular community resisted new ideas."}, {"word": "Intrepid", "pos": "adjective", "def": "Fearless and adventurous.", "example": "The intrepid researcher entered the cave."}, {"word": "Inveterate", "pos": "adjective", "def": "Long-established and unlikely to change.", "example": "He was an inveterate procrastinator."}, {"word": "Jocular", "pos": "adjective", "def": "Humorous or joking.", "example": "Her jocular comment eased the tension."}, {"word": "Judicious", "pos": "adjective", "def": "Showing good judgement.", "example": "A judicious quote can strengthen an essay."}, {"word": "Laconic", "pos": "adjective", "def": "Using few words.", "example": "His laconic answer was brief but correct."}, {"word": "Lament", "pos": "verb", "def": "To express sorrow or regret.", "example": "Students lament missed opportunities after exams."}, {"word": "Laudable", "pos": "adjective", "def": "Deserving praise.", "example": "Her effort was laudable."}, {"word": "Lethargic", "pos": "adjective", "def": "Sluggish and lacking energy.", "example": "He felt lethargic after too little sleep."}, {"word": "Loquacious", "pos": "adjective", "def": "Very talkative.", "example": "The loquacious presenter exceeded the time limit."}, {"word": "Lucid", "pos": "adjective", "def": "Clear and easy to understand.", "example": "Write lucid explanations in science answers."}, {"word": "Magnanimous", "pos": "adjective", "def": "Generous and forgiving.", "example": "She was magnanimous in victory."}, {"word": "Malevolent", "pos": "adjective", "def": "Having evil intentions.", "example": "The villain is driven by malevolent ambition."}, {"word": "Malleable", "pos": "adjective", "def": "Easily shaped or influenced.", "example": "Young minds are malleable."}, {"word": "Maverick", "pos": "noun", "def": "An independent-minded person.", "example": "The maverick artist rejected tradition."}, {"word": "Mendacious", "pos": "adjective", "def": "Dishonest.", "example": "The mendacious witness changed his story."}, {"word": "Mercurial", "pos": "adjective", "def": "Changing moods quickly.", "example": "His mercurial temper worried the team."}, {"word": "Metaphor", "pos": "noun", "def": "A comparison that says one thing is another.", "example": "The hive is a metaphor for steady work."}, {"word": "Mitigate", "pos": "verb", "def": "To make less severe.", "example": "Planning can mitigate exam stress."}, {"word": "Mollify", "pos": "verb", "def": "To calm anger or anxiety.", "example": "A clear plan mollified the worried student."}, {"word": "Morose", "pos": "adjective", "def": "Gloomy or ill-tempered.", "example": "He became morose after the defeat."}, {"word": "Munificent", "pos": "adjective", "def": "Very generous.", "example": "The donor made a munificent gift."}, {"word": "Nascent", "pos": "adjective", "def": "Just beginning to exist.", "example": "Her nascent confidence grew after practice."}, {"word": "Nefarious", "pos": "adjective", "def": "Wicked or criminal.", "example": "The plot revealed a nefarious scheme."}, {"word": "Nostalgic", "pos": "adjective", "def": "Longing for the past.", "example": "The poem has a nostalgic tone."}, {"word": "Nuance", "pos": "noun", "def": "A subtle difference in meaning.", "example": "Good analysis notices nuance."}, {"word": "Obdurate", "pos": "adjective", "def": "Stubbornly refusing to change.", "example": "The obdurate leader ignored advice."}, {"word": "Obfuscate", "pos": "verb", "def": "To make unclear.", "example": "Do not obfuscate your answer with jargon."}, {"word": "Obsequious", "pos": "adjective", "def": "Too eager to please.", "example": "The obsequious servant flattered everyone."}, {"word": "Onerous", "pos": "adjective", "def": "Difficult and burdensome.", "example": "The onerous assignment required planning."}, {"word": "Ostensible", "pos": "adjective", "def": "Stated but not necessarily true.", "example": "His ostensible reason was illness."}, {"word": "Paradox", "pos": "noun", "def": "A statement that seems contradictory but may be true.", "example": "Less haste, more speed is a paradox."}, {"word": "Paragon", "pos": "noun", "def": "A model of excellence.", "example": "She is a paragon of discipline."}, {"word": "Partisan", "pos": "adjective", "def": "Strongly biased toward one side.", "example": "The source was too partisan to trust fully."}, {"word": "Paucity", "pos": "noun", "def": "A lack or small amount.", "example": "The essay suffered from a paucity of evidence."}, {"word": "Pedantic", "pos": "adjective", "def": "Overly concerned with minor details.", "example": "The pedantic correction interrupted the discussion."}, {"word": "Penchant", "pos": "noun", "def": "A strong liking.", "example": "He has a penchant for history documentaries."}, {"word": "Perfunctory", "pos": "adjective", "def": "Done with little care.", "example": "A perfunctory conclusion weakens an essay."}, {"word": "Pernicious", "pos": "adjective", "def": "Harmful in a gradual way.", "example": "A pernicious habit can damage focus."}, {"word": "Perspicacious", "pos": "adjective", "def": "Having sharp insight.", "example": "Her perspicacious comment changed the debate."}, {"word": "Pertinent", "pos": "adjective", "def": "Relevant.", "example": "Include only pertinent evidence."}, {"word": "Pervasive", "pos": "adjective", "def": "Spread throughout.", "example": "The theme of ambition is pervasive."}, {"word": "Placate", "pos": "verb", "def": "To make someone less angry.", "example": "He tried to placate the audience."}, {"word": "Plausible", "pos": "adjective", "def": "Seeming reasonable or probable.", "example": "The explanation is plausible but unproven."}, {"word": "Precarious", "pos": "adjective", "def": "Not secure; dangerous.", "example": "His grade was in a precarious position."}, {"word": "Preclude", "pos": "verb", "def": "To prevent from happening.", "example": "A clash may preclude attendance."}, {"word": "Prudent", "pos": "adjective", "def": "Wise and careful.", "example": "It is prudent to revise early."}, {"word": "Quixotic", "pos": "adjective", "def": "Unrealistically idealistic.", "example": "The plan was noble but quixotic."}, {"word": "Rancorous", "pos": "adjective", "def": "Bitter and resentful.", "example": "The rancorous debate solved nothing."}, {"word": "Recalcitrant", "pos": "adjective", "def": "Stubbornly disobedient.", "example": "The recalcitrant recruit ignored orders."}, {"word": "Refute", "pos": "verb", "def": "To prove wrong.", "example": "Use evidence to refute the claim."}, {"word": "Relegate", "pos": "verb", "def": "To move to a lower position.", "example": "Do not relegate sleep to an afterthought."}, {"word": "Reproach", "pos": "verb", "def": "To express disapproval.", "example": "The teacher reproached the careless work."}, {"word": "Rescind", "pos": "verb", "def": "To cancel officially.", "example": "The committee rescinded the rule."}, {"word": "Sagacious", "pos": "adjective", "def": "Wise and showing good judgement.", "example": "The sagacious mentor gave simple advice."}, {"word": "Salient", "pos": "adjective", "def": "Most noticeable or important.", "example": "Identify the salient points in the source."}, {"word": "Sanguine", "pos": "adjective", "def": "Optimistic.", "example": "She remained sanguine after the setback."}, {"word": "Scrupulous", "pos": "adjective", "def": "Very careful and honest.", "example": "Scrupulous referencing avoids plagiarism."}, {"word": "Spurious", "pos": "adjective", "def": "False or not genuine.", "example": "The spurious argument lacked evidence."}, {"word": "Stoic", "pos": "adjective", "def": "Enduring hardship without complaint.", "example": "He stayed stoic during the challenge."}, {"word": "Succinct", "pos": "adjective", "def": "Brief and clearly expressed.", "example": "A succinct thesis helps the reader."}, {"word": "Superfluous", "pos": "adjective", "def": "Unnecessary.", "example": "Remove superfluous words from the answer."}, {"word": "Tacit", "pos": "adjective", "def": "Understood without being stated.", "example": "There was tacit agreement in the group."}, {"word": "Tenuous", "pos": "adjective", "def": "Weak or slight.", "example": "The link between the ideas was tenuous."}, {"word": "Trenchant", "pos": "adjective", "def": "Sharp and effective.", "example": "Her trenchant criticism exposed the flaw."}, {"word": "Ubiquity", "pos": "noun", "def": "The state of being everywhere.", "example": "The ubiquity of phones affects study habits."}, {"word": "Vacillate", "pos": "verb", "def": "To waver between choices.", "example": "Do not vacillate forever; pick a topic."}, {"word": "Venerate", "pos": "verb", "def": "To regard with deep respect.", "example": "Many venerate the pioneering scientist."}, {"word": "Verbose", "pos": "adjective", "def": "Using too many words.", "example": "Verbose answers can hide the main point."}, {"word": "Vigilant", "pos": "adjective", "def": "Watchful and alert.", "example": "Be vigilant for sign errors."}, {"word": "Vindicate", "pos": "verb", "def": "To prove right or justified.", "example": "The results vindicate her method."}, {"word": "Volatile", "pos": "adjective", "def": "Likely to change suddenly.", "example": "The political situation was volatile."}, {"word": "Zeal", "pos": "noun", "def": "Great energy or enthusiasm.", "example": "She approached revision with zeal."}]);
  var vocabLearned = [];
  (function(){ var raw = storageGet('hive-vocab-learned-v1'); if (raw) { try { vocabLearned = JSON.parse(raw); } catch(e){} } })();
  function saveVocabLearned(){ storageSet('hive-vocab-learned-v1', JSON.stringify(vocabLearned)); }
  var vocabIdx = (function(){
    var d = new Date();
    var dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    return dayOfYear % VOCAB_WORDS.length;
  })();
  function renderVocab(){
    var w = VOCAB_WORDS[vocabIdx];
    $('vocabWord').textContent = w.word;
    $('vocabPos').textContent = w.pos;
    $('vocabDef').textContent = w.def;
    $('vocabExample').textContent = '"' + w.example + '"';
    $('vocabLearnedBtn').textContent = vocabLearned.indexOf(w.word) !== -1 ? '✓ Learned' : '✓ I know this one';
    $('vocabCount').textContent = vocabLearned.length + ' word' + (vocabLearned.length === 1 ? '' : 's') + ' learned';
  }
  $('vocabLearnedBtn').addEventListener('click', function(){
    var w = VOCAB_WORDS[vocabIdx];
    if (vocabLearned.indexOf(w.word) === -1) {
      vocabLearned.push(w.word);
      saveVocabLearned();
      addXp(5);
      if (vocabLearned.length >= 10) unlockAchievement('wordsmith');
    }
    renderVocab();
  });
  $('vocabNextBtn').addEventListener('click', function(){
    vocabIdx = (vocabIdx + 1) % VOCAB_WORDS.length;
    renderVocab();
  });
  renderVocab();

  /* ================= EXAM COUNTDOWN ================= */
  var examList = [];
  (function(){ var raw = storageGet('hive-exams-v1'); if (raw) { try { examList = JSON.parse(raw); } catch(e){} } })();
  function saveExams(){ storageSet('hive-exams-v1', JSON.stringify(examList)); }
  function examUrgencyTier(days){
    if (days < 0) return '';
    if (days <= 2) return ' tier-critical';
    if (days <= 6) return ' tier-high';
    if (days <= 13) return ' tier-med';
    return ' tier-low';
  }
  function updateExamCountdownBadge(){
    var badge = $('examCountdownBadge');
    if (!badge) return;
    if (!examList.length) { badge.classList.remove('show'); return; }
    var upcoming = examList
      .map(function(ex){ return { subject: ex.subject, days: Math.ceil((new Date(ex.date + 'T00:00:00') - new Date(new Date().toDateString())) / 86400000) }; })
      .filter(function(e){ return e.days >= 0; })
      .sort(function(a, b){ return a.days - b.days; });
    if (!upcoming.length) { badge.classList.remove('show'); return; }
    var next = upcoming[0];
    var tierClass = examUrgencyTier(next.days).trim();
    badge.className = 'exam-countdown-badge show' + (tierClass ? ' ' + tierClass : '');
    var label = next.days === 0 ? 'Today!' : next.days + 'd left';
    badge.textContent = '📅 ' + next.subject + ': ' + label;
  }
  function renderExams(){
    var ul = $('examList');
    if (!examList.length) { ul.innerHTML = '<div class="exam-empty">No exams added yet.</div>'; updateExamCountdownBadge(); return; }
    var sorted = examList.slice().sort(function(a, b){ return new Date(a.date) - new Date(b.date); });
    ul.innerHTML = sorted.map(function(ex){
      var days = Math.ceil((new Date(ex.date + 'T00:00:00') - new Date(new Date().toDateString())) / 86400000);
      var label = days < 0 ? 'Passed' : (days === 0 ? 'Today!' : days + 'd left');
      return '<li class="exam-item' + examUrgencyTier(days) + '">' +
        '<span class="exam-item-name">' + escapeHtml(ex.subject) + '</span>' +
        '<span><span class="exam-item-days">' + label + '</span><button class="exam-item-del" data-del="' + ex.id + '">✕</button></span>' +
        '</li>';
    }).join('');
    updateExamCountdownBadge();
  }
  $('examAddBtn').addEventListener('click', function(){
    var subject = $('examSubjectSelect').value;
    var date = $('examDateInput').value;
    if (!date) return;
    examList.push({ id: Date.now(), subject: subject, date: date });
    saveExams();
    renderExams();
    $('examDateInput').value = '';
    if (examList.length >= 3) unlockAchievement('planner_pro');
  });
  $('examList').addEventListener('click', function(e){
    var delId = e.target.getAttribute('data-del');
    if (delId) {
      examList = examList.filter(function(ex){ return String(ex.id) !== delId; });
      saveExams();
      renderExams();
    }
  });
  renderExams();

  /* ================= QUICK NOTES ================= */
  var notesTextarea = $('notesTextarea');
  (function(){ var raw = storageGet('hive-notes-v1'); if (raw !== null) notesTextarea.value = raw; })();
  function updateNotesCount(){ $('notesCount').textContent = notesTextarea.value.length + ' characters · saved'; }
  updateNotesCount();
  var notesSaveTimeout = null;
  var notesUnlocked = false;
  notesTextarea.addEventListener('input', function(){
    clearTimeout(notesSaveTimeout);
    $('notesCount').textContent = notesTextarea.value.length + ' characters · saving…';
    notesSaveTimeout = setTimeout(function(){
      storageSet('hive-notes-v1', notesTextarea.value);
      updateNotesCount();
      if (!notesUnlocked && notesTextarea.value.trim().length > 0) { notesUnlocked = true; unlockAchievement('note_taker'); }
    }, 500);
  });
  $('notesClearBtn').addEventListener('click', function(){
    if (notesTextarea.value && !confirm('Clear all notes?')) return;
    notesTextarea.value = '';
    storageSet('hive-notes-v1', '');
    updateNotesCount();
  });

  /* ================= SETTINGS: EYE BREAKS, SOUND, BACKUP ================= */
  var appSettings = { eyeBreak: false, sound: true };
  (function(){ var raw = storageGet('hive-settings-v1'); if (raw) { try { appSettings = Object.assign(appSettings, JSON.parse(raw)); } catch(e){} } })();
  function saveSettings(){ storageSet('hive-settings-v1', JSON.stringify(appSettings)); }
  function renderSettingsToggles(){
    $('eyeBreakToggle').classList.toggle('on', appSettings.eyeBreak);
    $('soundToggle').classList.toggle('on', appSettings.sound);
  }
  renderSettingsToggles();
  var eyeBreakInterval = null;
  function startEyeBreakReminders(){
    clearInterval(eyeBreakInterval);
    eyeBreakInterval = setInterval(function(){
      var toast = $('eyeBreakToast');
      toast.textContent = '👀 20-20-20 break: look at something 20 metres away for 20 seconds.';
      toast.classList.add('show');
      setTimeout(function(){ toast.classList.remove('show'); }, 8000);
    }, 20 * 60 * 1000);
  }
  function stopEyeBreakReminders(){ clearInterval(eyeBreakInterval); }
  if (appSettings.eyeBreak) startEyeBreakReminders();
  $('eyeBreakToggle').addEventListener('click', function(){
    appSettings.eyeBreak = !appSettings.eyeBreak;
    saveSettings();
    renderSettingsToggles();
    if (appSettings.eyeBreak) startEyeBreakReminders(); else stopEyeBreakReminders();
  });
  $('soundToggle').addEventListener('click', function(){
    appSettings.sound = !appSettings.sound;
    saveSettings();
    renderSettingsToggles();
  });

  function gatherBackupData(){
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      studyData: studyData,
      xpState: xpState,
      favQuotes: favQuotes,
      waterState: waterState,
      vocabLearned: vocabLearned,
      examList: examList,
      notes: notesTextarea.value,
      settings: appSettings
    };
  }
  $('exportDataBtn').addEventListener('click', function(){
    var data = JSON.stringify(gatherBackupData(), null, 2);
    var blob = new Blob([data], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'hive-progress-backup.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    unlockAchievement('backup_buddy');
    showToastMessage('💾 Backup downloaded!');
  });
  $('importDataBtn').addEventListener('click', function(){ $('importDataFile').click(); });
  $('importDataFile').addEventListener('change', function(e){
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){
      try {
        var data = JSON.parse(ev.target.result);
        if (!confirm('This will replace your current progress with the backup. Continue?')) return;
        if (data.studyData) { studyData = Object.assign(studyData, data.studyData); saveStudyData(); }
        if (data.xpState) { xpState = Object.assign(xpState, data.xpState); saveXp(); }
        if (data.favQuotes) { favQuotes = data.favQuotes; saveFav(); }
        if (data.waterState) { waterState = data.waterState; saveWater(); }
        if (data.vocabLearned) { vocabLearned = data.vocabLearned; saveVocabLearned(); }
        if (data.examList) { examList = data.examList; saveExams(); }
        if (data.notes !== undefined) { notesTextarea.value = data.notes; storageSet('hive-notes-v1', data.notes); }
        if (data.settings) { appSettings = Object.assign(appSettings, data.settings); saveSettings(); }
        showToastMessage('✅ Backup restored! Reloading…');
        setTimeout(function(){ location.reload(); }, 1200);
      } catch (err) {
        showToastMessage('⚠️ Could not read that backup file.');
      }
    };
    reader.readAsText(file);
  });
  $('resetDataBtn').addEventListener('click', function(){
    if (!confirm('This will permanently erase ALL your progress (study time, XP, achievements, notes, everything). Are you sure?')) return;
    if (!confirm('Really sure? This cannot be undone.')) return;
    try { localStorage.clear(); } catch (e) {}
    location.reload();
  });

  /* ================= CONFETTI ================= */
  var confettiCanvas = $('confettiCanvas');
  var confettiCtx = confettiCanvas.getContext('2d');
  var confettiParticles = [];
  var confettiRunning = false;
  function resizeConfettiCanvas(){ confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
  resizeConfettiCanvas();
  window.addEventListener('resize', resizeConfettiCanvas);
  var CONFETTI_COLORS = ['#f4c430', '#e29b1c', '#c97a12', '#ffe9a8', '#6b5641'];
  function fireConfetti(){
    for (var i = 0; i < 80; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width, y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 3,
        size: 4 + Math.random() * 5, color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot: Math.random() * 360, vrot: (Math.random() - 0.5) * 10
      });
    }
    if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(confettiTick); }
  }
  function confettiTick(){
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(function(p){
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot * Math.PI / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      confettiCtx.restore();
    });
    confettiParticles = confettiParticles.filter(function(p){ return p.y < confettiCanvas.height + 30; });
    if (confettiParticles.length > 0) {
      requestAnimationFrame(confettiTick);
    } else {
      confettiRunning = false;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* ================= THEME PICKER ================= */
  (function(){
    var savedTheme = storageGet('hive-theme-v1');
    if (savedTheme) document.body.setAttribute('data-theme', savedTheme);
    document.querySelectorAll('.theme-swatch').forEach(function(sw){
      if (sw.dataset.theme === (savedTheme || 'honey')) sw.classList.add('active');
      else sw.classList.remove('active');
      sw.addEventListener('click', function(){
        document.querySelectorAll('.theme-swatch').forEach(function(s){ s.classList.remove('active'); });
        sw.classList.add('active');
        if (sw.dataset.theme === 'honey') document.body.removeAttribute('data-theme');
        else document.body.setAttribute('data-theme', sw.dataset.theme);
        storageSet('hive-theme-v1', sw.dataset.theme);
      });
    });
  })();

  /* ================= DAILY STUDY GOAL ================= */
  var dailyGoalMins = parseInt(storageGet('hive-daily-goal-v1') || '60', 10);
  var dailyGoalCelebrated = false;
  (function(){ var raw = storageGet('hive-daily-goal-celebrated-v1'); dailyGoalCelebrated = raw === todayKey(); })();
  $('dailyGoalMinsLabel').textContent = dailyGoalMins;
  var dailyMinutesLog = { date: todayKey(), minutes: 0 };
  (function(){
    var raw = storageGet('hive-daily-minutes-v1');
    if (raw) { try { var saved = JSON.parse(raw); if (saved.date === todayKey()) dailyMinutesLog = saved; } catch(e){} }
  })();
  function saveDailyMinutesLog(){ storageSet('hive-daily-minutes-v1', JSON.stringify(dailyMinutesLog)); }
  var _origRecordStudyCompletedForGoal = recordStudyCompleted;
  recordStudyCompleted = function(subject, minutes){
    _origRecordStudyCompletedForGoal(subject, minutes);
    if (dailyMinutesLog.date !== todayKey()) { dailyMinutesLog = { date: todayKey(), minutes: 0 }; dailyGoalCelebrated = false; }
    dailyMinutesLog.minutes += minutes;
    saveDailyMinutesLog();
    renderDailyGoal();
  };
  function todayStudiedMinutes(){
    if (dailyMinutesLog.date !== todayKey()) return 0;
    return dailyMinutesLog.minutes;
  }
  function renderDailyGoal(){
    var mins = todayStudiedMinutes();
    var pct = Math.min(100, Math.round((mins / dailyGoalMins) * 100));
    $('dailyGoalFill').style.width = pct + '%';
    $('dailyGoalStatus').textContent = mins + ' / ' + dailyGoalMins + ' min today';
    if (pct >= 100 && !dailyGoalCelebrated) {
      dailyGoalCelebrated = true;
      storageSet('hive-daily-goal-celebrated-v1', todayKey());
      fireConfetti();
      showToastMessage('🎉 Daily goal smashed!');
    }
  }
  $('dailyGoalEdit').addEventListener('click', function(){
    var val = prompt('Set your daily study goal (minutes):', dailyGoalMins);
    var n = parseInt(val, 10);
    if (n && n > 0) {
      dailyGoalMins = n;
      storageSet('hive-daily-goal-v1', String(n));
      $('dailyGoalMinsLabel').textContent = n;
      dailyGoalCelebrated = false;
      renderDailyGoal();
    }
  });
  renderDailyGoal();
  var _origRenderSubjectProgress2 = renderSubjectProgress;
  renderSubjectProgress = function(){ _origRenderSubjectProgress2(); renderDailyGoal(); };

  /* ================= GRADE TREND CHART ================= */
  var gradeMarks = {};
  (function(){ var raw = storageGet('hive-grade-marks-v1'); if (raw) { try { gradeMarks = JSON.parse(raw); } catch(e){} } })();
  function saveGradeMarks(){ storageSet('hive-grade-marks-v1', JSON.stringify(gradeMarks)); }
  function renderGradeTrend(){
    var subj = $('gradeSubjectSelect').value;
    var marks = gradeMarks[subj] || [];
    var svg = $('gradeTrendChart');
    if (!marks.length) {
      svg.innerHTML = '';
      $('gradeTrendEmpty').style.display = 'block';
      return;
    }
    $('gradeTrendEmpty').style.display = 'none';
    var w = 240, h = 70, pad = 8;
    var pts = marks.map(function(m, i){
      var x = pad + (marks.length === 1 ? 0 : (i / (marks.length - 1)) * (w - pad * 2));
      var y = h - pad - (m / 100) * (h - pad * 2);
      return x + ',' + y;
    });
    var circles = marks.map(function(m, i){
      var x = pad + (marks.length === 1 ? 0 : (i / (marks.length - 1)) * (w - pad * 2));
      var y = h - pad - (m / 100) * (h - pad * 2);
      return '<circle cx="' + x + '" cy="' + y + '" r="3" fill="var(--honey3)"></circle>';
    }).join('');
    svg.innerHTML = '<polyline points="' + pts.join(' ') + '" fill="none" stroke="var(--honey2)" stroke-width="2"></polyline>' + circles;
  }
  $('gradeTrendAddBtn').addEventListener('click', function(){
    var subj = $('gradeSubjectSelect').value;
    var val = parseFloat($('gradeTrendInput').value);
    if (isNaN(val)) return;
    if (!gradeMarks[subj]) gradeMarks[subj] = [];
    gradeMarks[subj].push(Math.max(0, Math.min(100, val)));
    saveGradeMarks();
    $('gradeTrendInput').value = '';
    renderGradeTrend();
  });
  $('gradeSubjectSelect').addEventListener('change', renderGradeTrend);
  renderGradeTrend();

  /* ================= WEEKLY RECAP ================= */
  function renderWeeklyRecap(){
    var subjects = Object.entries(studyData.subjects || {});
    var strongest = subjects.length ? subjects.reduce(function(a, b){ return b[1] > a[1] ? b : a; })[0] : '—';
    var totalHrs = Math.round((studyData.totalMinutes || 0) / 60);
    $('weeklyRecap').innerHTML =
      '📊 <strong>' + totalHrs + 'h</strong> studied all-time · ' +
      '🔥 <strong>' + (studyData.currentStreak || 0) + '</strong> day streak · ' +
      '🏅 Most time in <strong>' + strongest + '</strong>';
  }
  renderWeeklyRecap();
  var _origRenderAwardsGallery = renderAwardsGallery;
  renderAwardsGallery = function(){ _origRenderAwardsGallery(); renderWeeklyRecap(); };

  /* ================= FLASHCARDS ================= */
  var flashcards = [];
  (function(){ var raw = storageGet('hive-flashcards-v1'); if (raw) { try { flashcards = JSON.parse(raw); } catch(e){} } })();
  function saveFlashcards(){ storageSet('hive-flashcards-v1', JSON.stringify(flashcards)); }
  var flashcardPos = 0; // position within the currently visible (filtered) list, not the raw array
  var flashcardFilterUnmastered = false;

  function visibleCardIndices(){
    if (!flashcardFilterUnmastered) return flashcards.map(function(_, i){ return i; });
    var arr = [];
    flashcards.forEach(function(c, i){ if (!c.known) arr.push(i); });
    return arr;
  }

  function renderFlashcards(){
    var stage = $('flashcardStage'), controls = $('flashcardControls'), btnsRow = $('flashcardBtnsRow'),
        masteryRow = $('flashcardMasteryRow'), progress = $('flashcardProgress'), filterBtn = $('cardFilterBtn');
    var knownCount = flashcards.filter(function(c){ return c.known; }).length;
    if (filterBtn) filterBtn.classList.toggle('active', flashcardFilterUnmastered);

    if (!flashcards.length) {
      stage.innerHTML = '<div class="flashcard-empty" id="flashcardEmpty">Add a card above to start your deck.</div>';
      controls.style.display = 'none';
      btnsRow.style.display = 'none';
      masteryRow.style.display = 'none';
      if (progress) progress.textContent = '';
      return;
    }
    if (progress) progress.textContent = knownCount + ' / ' + flashcards.length + ' mastered';

    var visible = visibleCardIndices();
    if (!visible.length) {
      stage.innerHTML = '<div class="flashcard-empty">🎉 Every card in your deck is mastered! Turn off the filter to review them anyway.</div>';
      controls.style.display = 'none';
      masteryRow.style.display = 'none';
      btnsRow.style.display = 'flex';
      return;
    }
    if (flashcardPos >= visible.length) flashcardPos = 0;
    var realIdx = visible[flashcardPos];
    var card = flashcards[realIdx];
    stage.innerHTML = '<div class="flashcard" id="activeFlashcard" data-flipped="0">' + escapeHtml(card.front) +
      '<span class="flashcard-tag">' + escapeHtml(card.subject) + (card.known ? ' · ✓ mastered' : '') + ' · tap to flip</span></div>';
    controls.style.display = 'flex';
    btnsRow.style.display = 'flex';
    masteryRow.style.display = 'none';
    $('flashcardCounter').textContent = (flashcardPos + 1) + ' / ' + visible.length;
    $('activeFlashcard').addEventListener('click', function(){
      var flipped = this.dataset.flipped === '1';
      var card2 = flashcards[realIdx];
      if (!flipped) {
        this.textContent = card2.back;
        this.classList.add('flipped');
        this.dataset.flipped = '1';
        var tag = document.createElement('span');
        tag.className = 'flashcard-tag';
        tag.textContent = card2.subject + ' · tap to flip back';
        this.appendChild(tag);
        masteryRow.style.display = 'flex';
      } else {
        renderFlashcards();
      }
    });
  }
  $('cardAddBtn').addEventListener('click', function(){
    var front = $('cardFrontInput').value.trim();
    var back = $('cardBackInput').value.trim();
    var subject = $('cardSubjectSelect').value;
    if (!front || !back) return;
    flashcards.push({ front: front, back: back, subject: subject, known: false });
    saveFlashcards();
    $('cardFrontInput').value = '';
    $('cardBackInput').value = '';
    flashcardPos = visibleCardIndices().length - 1;
    renderFlashcards();
    if (flashcards.length >= 5) unlockAchievement('planner_pro');
  });
  $('cardPrevBtn').addEventListener('click', function(){
    var visible = visibleCardIndices();
    if (!visible.length) return;
    flashcardPos = (flashcardPos - 1 + visible.length) % visible.length;
    renderFlashcards();
  });
  $('cardNextBtn').addEventListener('click', function(){
    var visible = visibleCardIndices();
    if (!visible.length) return;
    flashcardPos = (flashcardPos + 1) % visible.length;
    renderFlashcards();
  });
  $('cardShuffleBtn').addEventListener('click', function(){
    for (var i = flashcards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = flashcards[i]; flashcards[i] = flashcards[j]; flashcards[j] = tmp;
    }
    saveFlashcards();
    flashcardPos = 0;
    renderFlashcards();
  });
  if ($('cardFilterBtn')) $('cardFilterBtn').addEventListener('click', function(){
    flashcardFilterUnmastered = !flashcardFilterUnmastered;
    flashcardPos = 0;
    renderFlashcards();
  });
  if ($('cardGotItBtn')) $('cardGotItBtn').addEventListener('click', function(){
    var visible = visibleCardIndices();
    var realIdx = visible[flashcardPos];
    if (realIdx === undefined) return;
    flashcards[realIdx].known = true;
    saveFlashcards();
    var newVisible = visibleCardIndices();
    if (flashcardPos >= newVisible.length) flashcardPos = 0;
    renderFlashcards();
  });
  if ($('cardAgainBtn')) $('cardAgainBtn').addEventListener('click', function(){
    var visible = visibleCardIndices();
    var realIdx = visible[flashcardPos];
    if (realIdx === undefined) return;
    flashcards[realIdx].known = false;
    saveFlashcards();
    var newVisible = visibleCardIndices();
    flashcardPos = newVisible.length ? (flashcardPos + 1) % newVisible.length : 0;
    renderFlashcards();
  });
  $('cardDeleteBtn').addEventListener('click', function(){
    if (!flashcards.length) return;
    var visible = visibleCardIndices();
    var realIdx = visible[flashcardPos];
    if (realIdx === undefined) return;
    if (!confirm('Delete this flashcard? This cannot be undone.')) return;
    flashcards.splice(realIdx, 1);
    saveFlashcards();
    renderFlashcards();
  });
  renderFlashcards();

  /* ---------------- AI: summarize imported notes into flashcards ---------------- */
  (function(){
    var textarea = $('aiImportTextarea');
    var fileInput = $('aiImportFile');
    var genBtn = $('aiGenerateBtn');
    var statusEl = $('aiImportStatus');
    if (!genBtn) return;

    // Reading a file just fills the textarea — the user can review/edit before generating.
    if (fileInput) fileInput.addEventListener('change', function(){
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function(e){
        textarea.value = (textarea.value ? textarea.value + '\n\n' : '') + String(e.target.result || '');
        statusEl.textContent = 'Loaded ' + f.name + ' (' + Math.round(f.size/1024) + ' KB) — review below, then generate.';
      };
      reader.onerror = function(){ statusEl.textContent = 'Could not read that file — try a plain .txt file.'; };
      reader.readAsText(f);
    });

    function extractJsonArray(text){
      // The model may wrap JSON in prose or code fences — pull out the first [...] block.
      var match = text.match(/\[[\s\S]*\]/);
      if (!match) return null;
      try { return JSON.parse(match[0]); } catch (e) { return null; }
    }

    var puterLoadPromise = null;
    function loadPuter(){
      if (window.puter) return Promise.resolve();
      if (puterLoadPromise) return puterLoadPromise;
      puterLoadPromise = new Promise(function(resolve, reject){
        var s = document.createElement('script');
        s.src = 'https://js.puter.com/v2/';
        s.onload = resolve;
        s.onerror = function(){ reject(new Error('load-failed')); };
        document.head.appendChild(s);
      });
      return puterLoadPromise;
    }

    genBtn.addEventListener('click', function(){
      var notes = (textarea.value || '').trim();
      var subject = ($('cardSubjectSelect') && $('cardSubjectSelect').value) || '';
      if (!notes) { statusEl.textContent = 'Paste some notes or import a file first.'; return; }

      // Puter.js refuses to run at all under the file:// protocol (opening the
      // .html file directly by double-clicking it) and pops its own big warning
      // dialog when it detects that. Catch it ourselves first with a plainer message.
      if (window.location.protocol === 'file:') {
        statusEl.innerHTML = '⚠️ The AI generator needs this page to be served over http(s) — it won\'t work opened directly from a file. ' +
          'Easiest fix: run <code>npx serve .</code> (or <code>python3 -m http.server</code>) in this folder and open the localhost link, ' +
          'or upload the file to a free static host like Netlify Drop or GitHub Pages.';
        return;
      }

      genBtn.disabled = true;
      statusEl.textContent = '🤖 Reading your notes and writing flashcards…';

      loadPuter().then(function(){
        if (!window.puter || !puter.ai || !puter.ai.chat) throw new Error('puter-unavailable');
        var prompt = 'You are a study assistant. Read the notes below and turn the key facts into flashcards.\n' +
          'Reply with ONLY a JSON array, no prose, no markdown fences, in this exact shape:\n' +
          '[{"front":"question or term","back":"concise answer"}, ...]\n' +
          'Make between 5 and 15 cards depending on how much material there is. Keep each side short (under 25 words).\n\n' +
          'NOTES:\n' + notes.slice(0, 8000);
        return puter.ai.chat(prompt);
      }).then(function(response){
        var text = (typeof response === 'string') ? response : (response && response.message && response.message.content) || (response && response.text) || JSON.stringify(response);
        var cards = extractJsonArray(text);
        if (!cards || !cards.length) {
          statusEl.textContent = "Couldn't parse a card list from the AI's reply — try shortening the notes and generating again.";
          genBtn.disabled = false;
          return;
        }
        var added = 0;
        cards.forEach(function(c){
          var front = (c.front || c.question || '').toString().trim();
          var back = (c.back || c.answer || '').toString().trim();
          if (!front || !back) return;
          flashcards.push({ front: front, back: back, subject: subject, known: false });
          added++;
        });
        saveFlashcards();
        flashcardPos = Math.max(0, flashcards.length - added);
        renderFlashcards();
        if (flashcards.length >= 5 && typeof unlockAchievement === 'function') unlockAchievement('planner_pro');
        statusEl.textContent = '✅ Added ' + added + ' flashcard' + (added === 1 ? '' : 's') + ' to your deck!';
        genBtn.disabled = false;
      }).catch(function(err){
        statusEl.textContent = 'AI service failed to load or respond — check your connection (and that this isn\'t a file:// page) and try again.';
        genBtn.disabled = false;
      });
    });
  })();

  /* ================= HABIT TRACKER ================= */
  var habits = [];
  (function(){ var raw = storageGet('hive-habits-v1'); if (raw) { try { habits = JSON.parse(raw); } catch(e){} } })();
  function saveHabits(){ storageSet('hive-habits-v1', JSON.stringify(habits)); }
  function last7Days(){
    var days = [];
    for (var i = 6; i >= 0; i--) days.push(dateKey(new Date(Date.now() - i * 86400000)));
    return days;
  }
  function habitStreak(h){
    var log = h.log || {};
    var d = new Date();
    // If today isn't checked yet, the streak is still "alive" as of yesterday —
    // don't zero it out just because the user hasn't checked in yet today.
    if (!log[dateKey(d)]) d.setDate(d.getDate() - 1);
    var streak = 0;
    while (log[dateKey(d)]) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }
  function renderHabits(){
    var wrap = $('habitList');
    if (!habits.length) { wrap.innerHTML = '<div class="habit-empty">No habits yet — add one above.</div>'; return; }
    var days = last7Days();
    var today = todayKey();
    wrap.innerHTML = habits.map(function(h, idx){
      var doneToday = h.log && h.log[today];
      var streak = habitStreak(h);
      var dots = days.map(function(d){ return '<div class="habit-dot' + (h.log && h.log[d] ? ' done' : '') + '"></div>'; }).join('');
      return '<div class="habit-item" data-idx="' + idx + '">' +
        '<div class="habit-item-top"><span class="habit-item-name"><span class="habit-check' + (doneToday ? ' done' : '') + '" data-check="' + idx + '">' + (doneToday ? '✓' : '') + '</span>' + escapeHtml(h.name) + '</span>' +
        '<span class="habit-item-right">' + (streak > 0 ? '<span class="habit-streak-badge">🔥 ' + streak + (streak === 1 ? ' day' : ' days') + '</span>' : '') +
        '<button class="habit-item-del" data-delh="' + idx + '">✕</button></span></div>' +
        '<div class="habit-dots">' + dots + '</div>' +
      '</div>';
    }).join('');
  }
  $('habitAddBtn').addEventListener('click', function(){
    var name = $('habitInput').value.trim();
    if (!name) return;
    habits.push({ name: name, log: {} });
    saveHabits();
    $('habitInput').value = '';
    renderHabits();
  });
  $('habitList').addEventListener('click', function(e){
    var checkIdx = e.target.getAttribute('data-check');
    var delIdx = e.target.getAttribute('data-delh');
    if (checkIdx !== null) {
      var h = habits[parseInt(checkIdx, 10)];
      var today = todayKey();
      h.log = h.log || {};
      h.log[today] = !h.log[today];
      saveHabits();
      renderHabits();
      var allDoneToday = habits.length > 0 && habits.every(function(hh){ return hh.log && hh.log[today]; });
      if (allDoneToday) unlockAchievement('habit_hero');
    } else if (delIdx !== null) {
      var habitName = habits[parseInt(delIdx, 10)].name;
      if (!confirm('Delete "' + habitName + '"? Its history will be lost.')) return;
      habits.splice(parseInt(delIdx, 10), 1);
      saveHabits();
      renderHabits();
    }
  });
  renderHabits();

  /* ================= DRAW A CARD ================= */
  var DRAW_CARDS = [
    "🐝 One page at a time builds a whole hive.",
    "🍯 Progress hides in ordinary, unglamorous days.",
    "🌻 You don't need to feel ready to begin — just begin.",
    "🔑 Discipline today is freedom on results day.",
    "🌤️ Bad study session? Tomorrow is a fresh comb.",
    "💪 The version of you a year from now is built right now.",
    "🧭 Small, consistent effort beats big, occasional bursts.",
    "🌱 Confusion is part of learning — keep going anyway.",
    "🕰️ Rest is productive. Don't skip it out of guilt.",
    "🏆 You've already survived 100% of your hard days so far.",
    "📚 Understanding beats memorising — slow down if you must.",
    "🎯 Pick one small task. Do just that. Then decide again."
  ];
  var drawCount = parseInt(storageGet('hive-draw-count-v1') || '0', 10);
  $('drawCount').textContent = drawCount + ' card' + (drawCount === 1 ? '' : 's') + ' drawn';
  function drawACard(){
    var card = $('drawCard');
    card.classList.remove('flipped');
    setTimeout(function(){
      $('drawCardFront').textContent = DRAW_CARDS[Math.floor(Math.random() * DRAW_CARDS.length)];
      card.classList.add('flipped');
      drawCount++;
      storageSet('hive-draw-count-v1', String(drawCount));
      $('drawCount').textContent = drawCount + ' card' + (drawCount === 1 ? '' : 's') + ' drawn';
      if (drawCount >= 15) unlockAchievement('zen_bee');
    }, 80);
  }
  $('drawCard').addEventListener('click', drawACard);
  $('drawAgainBtn').addEventListener('click', drawACard);

  /* ================= KEYBOARD SHORTCUTS ================= */
  document.addEventListener('keydown', function(e){
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (e.key === ' ') { e.preventDefault(); pomodoroToggle(); }
    else if (e.key === 'b' || e.key === 'B') { breathingPanel.classList.toggle('show'); }
    else if (e.key === 'n' || e.key === 'N') { $('notesPanel').classList.toggle('show'); }
    else if (e.key === 'w' || e.key === 'W') { $('awardsPanel').classList.toggle('show'); }
    else if (e.key === 'z' || e.key === 'Z') { toggleZenMode(); }
    else if (e.key === 'Escape') {
      if (document.body.classList.contains('zen-mode')) { toggleZenMode(false); }
      document.querySelectorAll('.misc-panel, .breathing-panel, .focus-panel, .grade-panel, .todo-panel').forEach(function(p){ p.classList.remove('show'); });
    }
  });

  /* ================= PRINT SUMMARY ================= */
  $('printSummaryBtn').addEventListener('click', function(){
    var level = LEVELS[currentLevelIndex()];
    var subjLines = Object.entries(studyData.subjects || {}).map(function(e){
      var hrs = Math.floor(e[1] / 60), mins = e[1] % 60;
      return '<p>' + escapeHtml(e[0]) + ': ' + hrs + 'h ' + mins + 'm</p>';
    }).join('');
    $('printSummary').innerHTML =
      '<h1>🐝 My Study Progress</h1>' +
      '<p>Level: ' + level.icon + ' ' + escapeHtml(level.name) + ' (' + xpState.xp + ' XP)</p>' +
      '<p>Current streak: ' + studyData.currentStreak + ' days (best ' + studyData.bestStreak + ')</p>' +
      '<p>Total time studied: ' + Math.round((studyData.totalMinutes || 0) / 60) + ' hours</p>' +
      '<p>Achievements unlocked: ' + xpState.unlocked.length + ' / ' + ACHIEVEMENTS.length + '</p>' +
      '<p><strong>By subject:</strong></p>' + subjLines +
      '<p style="margin-top:20px; font-size:11px; color:#666;">Printed ' + new Date().toLocaleDateString() + '</p>';
    window.print();
  });

  /* ================= HIVE SWARM (ambient bees) ================= */
  var hiveSwarmEl = $('hiveSwarm');
  var hivePopBadge = $('hivePopulationBadge');
  var swarmBees = [];
  var beeIdCounter = 0;
  var isAngrySwarm = false;
  var HIVE_HOME = { x: 46, y: window.innerHeight - 70 };
  window.addEventListener('resize', function(){
    HIVE_HOME.x = 46; HIVE_HOME.y = window.innerHeight - 70;
  });

  function desiredBeePopulation(){
    /* Balanced hive: 2 new bees at zero XP, then one new bee per 40 XP.
       The paired old-bee renderer below uses the exact same formula. */
    var base = 2;
    var fromXp = Math.floor((xpState.xp || 0) / 40);
    return Math.max(base, Math.min(10, base + fromXp));
  }

  function pickBeeType(){
    var r = Math.random();
    if (r < 0.7) return 'worker';
    if (r < 0.9) return 'drone';
    return 'guard';
  }

  function createBee(type, bornAnimated){
    var el = document.createElement('div');
    el.className = 'hive-bee-el type-' + type + (bornAnimated ? ' born' : '');
    el.textContent = '🐝';
    hiveSwarmEl.appendChild(el);
    var bee = {
      id: 'bee' + (beeIdCounter++),
      type: type,
      el: el,
      x: HIVE_HOME.x + (Math.random() * 40 - 20),
      y: HIVE_HOME.y + (Math.random() * 40 - 20),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      target: null,
      sleeping: false,
      conga: false,
      angle: 0,
      trailTimer: 0
    };
    swarmBees.push(bee);
    return bee;
  }

  function spawnBeesUpTo(n){
    while (swarmBees.length < n) createBee(pickBeeType(), true);
  }

  function ensureQueen(){
    var hasQueen = swarmBees.some(function(b){ return b.type === 'queen'; });
    if (!hasQueen && swarmBees.length >= 30) {
      var q = createBee('queen', true);
      q.x = window.innerWidth / 2; q.y = 90;
      showToastMessage('👑 The Queen Bee has emerged!');
    }
  }

  function newWanderTarget(bee){
    var w = window.innerWidth, h = window.innerHeight;
    if (bee.type === 'guard') {
      var edge = Math.floor(Math.random() * 4);
      if (edge === 0) return { x: Math.random() * w, y: 20 };
      if (edge === 1) return { x: Math.random() * w, y: h - 20 };
      if (edge === 2) return { x: 20, y: Math.random() * h };
      return { x: w - 20, y: Math.random() * h };
    }
    if (bee.type === 'queen') {
      return { x: w / 2 + (Math.random() * 160 - 80), y: 70 + Math.random() * 60 };
    }
    return { x: Math.random() * w, y: Math.random() * h };
  }

  function spawnPollenParticle(x, y){
    var p = document.createElement('div');
    p.className = 'pollen-particle';
    p.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    hiveSwarmEl.appendChild(p);
    setTimeout(function(){ p.remove(); }, 950);
  }

  function renderBeeEl(bee){
    bee.el.style.transform = 'translate(' + bee.x + 'px,' + bee.y + 'px) rotate(' + (bee.angle || 0) + 'deg)';
    bee.el.classList.toggle('sleeping', !!bee.sleeping);
    bee.el.classList.toggle('angry', !!isAngrySwarm && !bee.sleeping);
  }

  function updateBee(bee, step){
    if (bee.sleeping) {
      bee.x += Math.sin(animClock / 900 + bee.id.length) * 0.05 * step;
      renderBeeEl(bee);
      return;
    }
    if (bee.conga) return;

    if (!bee.target || Math.hypot(bee.target.x - bee.x, bee.target.y - bee.y) < 12) {
      bee.target = newWanderTarget(bee);
    }
    var speed = bee.type === 'drone' ? 0.35 : (bee.type === 'guard' ? 0.9 : (bee.type === 'queen' ? 0.4 : 1.1));
    if (isAngrySwarm) speed *= 2.2;

    var dx = bee.target.x - bee.x, dy = bee.target.y - bee.y;
    var dist = Math.hypot(dx, dy) || 1;
    var jitter = isAngrySwarm ? 3.4 : (bee.type === 'drone' ? 0.6 : 0.5);
    bee.vx += ((dx / dist) * speed * 0.05 + (Math.random() - 0.5) * jitter * 0.1) * step;
    bee.vy += ((dy / dist) * speed * 0.05 + (Math.random() - 0.5) * jitter * 0.1) * step;

    if (bee.type === 'drone') {
      var loopAngle = animClock / 700;
      bee.vx += Math.cos(loopAngle) * 0.03 * step;
      bee.vy += Math.sin(loopAngle) * 0.03 * step;
    }

    var damping = Math.pow(0.94, step);
    bee.vx *= damping; bee.vy *= damping;
    var maxSpeed = (bee.type === 'guard' ? 3 : bee.type === 'drone' ? 1 : bee.type === 'queen' ? 1.2 : 2.4) * (isAngrySwarm ? 1.5 : 1);
    var sp = Math.hypot(bee.vx, bee.vy);
    if (sp > maxSpeed) { bee.vx = bee.vx / sp * maxSpeed; bee.vy = bee.vy / sp * maxSpeed; }

    bee.x += bee.vx * step; bee.y += bee.vy * step;
    bee.x = Math.max(10, Math.min(window.innerWidth - 10, bee.x));
    bee.y = Math.max(10, Math.min(window.innerHeight - 10, bee.y));
    bee.angle = Math.atan2(bee.vy, bee.vx) * 180 / Math.PI;

    if (bee.type === 'worker') {
      bee.trailTimer = (bee.trailTimer || 0) + step;
      if (bee.trailTimer >= 8) {
        bee.trailTimer = 0;
        spawnPollenParticle(bee.x, bee.y);
      }
    }

    renderBeeEl(bee);
  }

  /* Progress bees roam independently; conga-line clumping is disabled. */
  function maybeStartConga(){ return; }

  function applySleepState(){
    var isNight = document.body.classList.contains('night-mode') || document.body.classList.contains('sleep-mode');
    swarmBees.forEach(function(bee){
      if (isNight && !bee.sleeping) {
        bee.target = { x: HIVE_HOME.x + (Math.random() * 30 - 15), y: HIVE_HOME.y + (Math.random() * 20 - 10) };
      }
      bee.sleeping = isNight;
    });
  }

  function checkAngrySwarm(){
    var sergeantEl = $('sergeantPersistent');
    isAngrySwarm = !!(sergeantEl && (sergeantEl.classList.contains('anger-4') || sergeantEl.classList.contains('anger-5')));
  }

  function renderPopulationBadge(){
    var working = swarmBees.filter(function(b){ return !b.sleeping && b.type !== 'queen'; }).length;
    hivePopBadge.textContent = '🐝 ' + working + ' bee' + (working === 1 ? '' : 's') + ' working';
  }

  var lastSwarmSync = 0;
  var lastFrameTime = null;
  var animClock = 0;
  function swarmLoop(ts){
    // Drive movement off real elapsed time (capped) instead of "one fixed
    // nudge per frame". If frames get throttled or dropped — backgrounded
    // tab, GPU/CPU hiccup, whatever — a big gap is treated as a single
    // normal-sized step instead of one giant catch-up jump, and the
    // clock-based motions (sleeping sway, drone loop) never leap to a
    // different phase than the velocity-based ones. That mismatch was what
    // made the swarm look like it froze in sync and then glitched.
    if (lastFrameTime == null) lastFrameTime = ts;
    var dt = ts - lastFrameTime;
    lastFrameTime = ts;
    if (!(dt > 0) || dt > 100) dt = 16.67;
    animClock += dt;
    var step = dt / 16.67;

    var desired = desiredBeePopulation();
    if (swarmBees.length < desired) spawnBeesUpTo(desired);
    ensureQueen();

    var now = Date.now();
    if (now - lastSwarmSync > 1500) {
      applySleepState();
      checkAngrySwarm();
      maybeStartConga();
      renderPopulationBadge();
      lastSwarmSync = now;
    }

    swarmBees.forEach(function(bee){ if (!bee.conga) updateBee(bee, step); });
    requestAnimationFrame(swarmLoop);
  }
  spawnBeesUpTo(desiredBeePopulation());
  renderPopulationBadge();
  requestAnimationFrame(swarmLoop);
})();
