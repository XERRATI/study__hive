# 🐝 Study Hive — Project Files

Your Study Hive app, split from one giant 900 KB file into a clean project that
GitHub can host for free. **This is the version you upload to GitHub.**

---

## 📁 What's in here

```
study-hive/
├── index.html            ← ⭐ THE LANDING PAGE (first thing visitors see)
├── app.html              ← the app itself (welcome screen + full hive)
├── css/
│   └── styles.css        ← ALL the styling (51 style blocks joined)
├── js/                   ← the app logic, split into 55 ordered files
│   ├── 01-idle-timer-scheduler.js
│   ├── 02-startup-fade.js
│   ├── 05-countdown-hive-core.js    ← countdown clock + hive tap + quotes
│   ├── 07-milestones-tips-clicker.js ← includes the bee-clicker mini-game
│   └── ... (51 files total)
├── docs/
│   ├── SCRIPT-MAP.md     ← what each js file is (read this!)
│   └── HOW-TO-UPDATE.md  ← ⭐ how to update your app on GitHub
├── manifest.webmanifest      ← lets the app be installed like an app
├── study-hive-privacy-policy.html  ← your real Privacy Policy
├── study-hive-terms-of-service.html ← your real Terms of Service
├── LICENSE.txt               ← your licence (proprietary)
└── COPYRIGHT_NOTICE.txt      ← your copyright notice
```

**Flow:** `index.html` (landing) → press **Launch the Hive** → `app.html`
(welcome screen) → press **🍯 Enter the Hive** → the app.

**Rule:** the files in `js/` load in exactly this order. Don't renumber or
reorder them, and don't rename files without updating `app.html`.

---

## ✅ The beehive double-press glitch — FIXED

This was a real bug hiding in the code, not just a "too-fast" press:

1. **The freeze:** one of your old patches added a `MutationObserver` that
   watched the whole page and stripped `show` off any `.motivation-bubble`.
   Chrome fires an event even when a class removal changes nothing, so the
   observer kept re-triggering **itself forever**. The moment a bubble appeared
   (tapping the hive), the app's main thread got stuck in an endless loop →
   glitch / freeze. Fixed in `js/48-flashcards-garden-tasks.js` (the observer
   now pauses while it works, only touches what it must, and leaves the
   hive-tap quote bubble alone).
2. **The zoom:** on phones, a double-tap used to zoom the page in.
   `touch-action: manipulation` in `css/styles.css` stops that.
3. **The hijack:** a fast double-press used to launch the hidden "Bee Clicker"
   mini-game over your screen. It now needs **three quick taps** (within half a
   second), it never opens on top of another open panel, and it never restarts
   while already open.
4. **The flicker:** pressing twice used to fire two different quotes.
   `showMotivation` in `js/05-countdown-hive-core.js` now ignores taps within
   450 ms of the last one.

**Result:** tap the hive → one motivation quote, nothing else. Triple-tap fast
→ the reflex mini-game, if you still want it.

---

## ✨ What's new in this version

- **🧠 Cram mode now finds YOU** — the daily plan card grows a direct
  link when an exam is today/tomorrow: "🧠 Chemistry is TOMORROW — cram
  mode is ready, open it →". One tap turns cram on and opens the review
  (desktop + mobile; on mobile it sits at the top of the plan card so
  the tab bar can't hide it).
- **⏱️ Countdown hours fixed** — at long ranges (e.g. 1000+ hours to
  go) the "Hours" unit showed the *total* hours (999) instead of the
  remainder (16). Now: Days 41 · Hours 15 · **Total Hrs** 1000 · Mins ·
  Secs — the fifth unit is relabelled to make it honest.
- **🔬 10,000-hour QA pass** — the full everyday-use simulation at 10×
  scale: 637,000+ minutes (~6 years, 2,300 days), 3,000 + 10,000
  imported cards (13,000-card deck), 2,000-day streak, 100 exams, 50,000
  XP. Everything held: countdown, report + share image, heatmap, admin
  progression, all mobile tabs, cram + hint, geometry scan with **zero
  covered buttons on desktop**. (One seed nuance: the heatmap window
  starts from your stored goal-start date — the test now seeds it like a
  real user.)
- **🔍 1000-hour QA pass** — a full everyday-use simulation (60,000+
  minutes, 230 days, 30 exams, 300+1000 flashcards, 200-day streak)
  drove the real UI end-to-end. Four real bugs found and fixed:
  - **Mobile Focus tab threw an error every tap** — `syncSubjects` was
    declared inside an `if` block (block-scoped under `'use strict'`),
    so `goTab('focus')` hit "syncSubjects is not defined". Hoisted.
  - **Install banner covered the desktop dock and mobile tab bar** —
    it spanned the full bottom width at z-650. Now desktop sits
    bottom-left, mobile sits below the header, and it auto-dismisses
    after 6 seconds (plus a guard around the install prompt).
  - **Exam countdown badge covered the shortcuts button** — it was
    hard-coded to `left: 910px`, overlapping the top-right button
    cluster. Now right-anchored clear of the buttons with ellipsis.
  - **"Mobile UI on" chip overlapped the shell header** — hidden inside
    the shell (the shell has its own layout toggle).
  - Verified as NOT bugs: hidden overlay layering, content scrolling
    under the fixed tab bar (120px clearance built in), the share
    button's clipboard fallbacks, and the 404 `background-music.mp3`
    placeholder.
- **🔒 Locked In achievement** — 5 zero-interruption focus sessions
  unlock it (+25 XP). Clean focus is now rewarded, not just counted:
  every unbroken session increments the counter, and interrupted
  sessions don't reset it. The Focus-panel chip shows both stats:
  "⚡ 2 interruptions today · 🔒 5 unbroken sessions".
- **✨ AI-polished flashcards** — next to the 🎤 button there's ✨: it
  sends your draft (spoken or typed) through the app's existing free-AI
  provider (Pollinations/Puter/offline) with "turn this into a
  front/back card" and fills the inputs for a manual check before you
  tap +. Graceful fallbacks: AI busy → your draft stays untouched;
  unstructured reply → falls back to the built-in parser. 20s timeout,
  never blocks.
- **🧠 Exam-day cram mode (`js/70`)** — when an exam is today or
  tomorrow, the review area grows a "🧠 Cram: Subject (tomorrow)"
  button. Tapping it makes the review queue show ONLY that subject's
  cards, hardest first (highest "Again" count at the top) — the exact
  final-pass cards the night before. Works with the due-only filter;
  tap again to leave.
- **🎤 Speak a card (`js/68`)** — in the Cards panel there's a 🎤 button:
  tap it, talk ("mitochondria: powerhouse of the cell"), and the app
  parses your words into a draft front/back pair ready to hit +. It
  understands "front : back", " - ", " — ", " | ", " → ", or splits at
  the first sentence. Times like 12:30 survive the parser. Reuses the
  speech recognition the app already shipped — no new infrastructure.
- **⚡ Focus quality (`js/69`)** — interruptions are now real data: every
  tab-switch / app-switch / window-blur during a running focus session
  counts against that session. The Focus panel shows today's count, and
  the Hive Report adds "⚡ N interruptions this week" (text + share
  image + mobile box). A 25-minute session with 6 tab-aways no longer
  counts the same as 25 unbroken minutes.
- **📝 "Add more cards" nudge** — when the daily plan picks a subject
  with a high "Again" rate but fewer than 5 cards, the plan card grows a
  button: "📝 Chemistry has a high 'Again' rate but only 2 cards — add
  more?" — it opens the Cards panel pre-filtered to that subject with
  the front input focused. Turns a review problem into a content problem
  you can act on.
- **🎯 Hive sync score** — the Hive Report now blends two habits into one
  headline: days studied this week (50%) + days the plan was followed
  (50%) → "Hive sync N%", shown in the report, the share image and the
  mobile stats box.
- **🐞 Hive Report "days" bug fixed** — the weekly recap counted
  sessions but always showed "0 days" (a counter that was never
  incremented). Now it counts the real days studied, which also powers
  the sync score.
- **🧪 In-app tests grew 38 → 40** — new checks: voice-cards parser and
  focus-quality tracker.
- **🧰 One shared helpers file (`js/00-shared-utils.js`)** — the escape
  helper (and friends) used to be re-declared in ~15 files. Now there is
  exactly ONE implementation (`window.shEsc` etc.), and every file's local
  copy delegates to it with a hoist-safe fallback: a missing file can
  never break the app. New code should use `shEsc / shGet / shQa /
  shGetJSON / shSetJSON / shPad / shDateKey` instead of copying bodies.
- **🎯 Smarter daily plan (SR cross-wire)** — the plan used to rank by
  exam proximity + minutes logged. Now spaced-repetition **"Again"
  presses** (the strongest "you're struggling here" signal in the app)
  boost a subject's priority when there's no exam edge: 5 lapses ≈ a
  600-minute head start in the ranking. Exam proximity still wins — the
  countdown is the countdown. When the plan picks a struggling subject it
  says so: "⚠️ You've rated 4 Chemistry card(s) 'Again' — review them
  after the recall pass."
- **💾 Backup nudge** — after real usage (120+ minutes, 5+ sessions) the
  app gently reminds you every ~3 weeks (right after an achievement
  unlock) to download a portable backup from the Backup Center —
  auto-backups live in this browser, the file survives anywhere.
- **🧪 In-app tests grew 22 → 38** — Admin → Run all tests now also
  checks: shared utils + esc delegation, SR engine, daily plan + struggle
  signal, plan streak, deck-import parser, haptics, stable card ids,
  Hive Report, Backup Center, mobile shell (when mobile mode is on),
  service worker API, manifest icons + shortcuts (fetched live), and SW
  registration.
- **📱 Installable PWA + shortcuts** — the manifest now ships real icons
  (180/192/512 + maskable) and **home-screen shortcuts**: long-press the
  installed icon to jump straight to **Start Focus**, **Review Cards** or
  **Daily Plan**. A network-first service worker (`sw.js`) keeps the app
  opening offline too — while online you always get the newest files, so
  updating stays exactly as easy as before.
- **📥 Deck import (Anki / Quizlet)** — in the Import panel, "📥 Import
  deck (.txt/.csv)" reads an **Anki "Notes in plain text" export** or a
  **Quizlet CSV export** and adds every card straight into your deck with
  spaced-repetition ids. Pure JavaScript — no libraries, no build step.
- **📋 Plan-streak rewards** — follow the daily plan's subject for
  **3 days** → unlock **Plan Loyalist**; **7 days** → **Plan Legend**
  (+25 XP each). Your streak shows in the plan card, the daily
  notification and the Hive Report image.
- **🛡️ innerHTML audit finished** — every user-entered value in the app
  is now escaped at render time. Four late-found sinks (the subject
  progress list, the Hive Report's "best subject" line, the Awards
  panel's weekly recap, and the mobile report box) were closed this
  round, and a live browser probe confirms a hostile subject name can no
  longer inject markup anywhere — desktop or mobile shell.
- **🐝 Front page (every visit)** — the app now opens on a welcome screen
  first. Press **🍯 Enter the Hive** to go in. (`js/54-welcome-screen.js`)
- **🔢 Setup, one question at a time** — the setup card is now 9 easy steps
  (name → goal → date → subjects → daily goal → coaching style → layout →
  what you need help with → your pledge) with Back/Next buttons.
  (`js/55-onboarding-wizard.js`)
- **🐝 Bee sliders** — a bee rides a honey track at the top of the setup card
  showing how far through the steps you are, and on the main screen a bee
  rides the Hive Progress bar showing progress until completion.
- **🐝 Old bees are rare + out of sync** — the old-style bees used to march
  in lockstep (a wrong CSS variable name made every bee share one 14s timer).
  Fixed; now only 1–4 old bees appear and each flies on its own timing.
- **🎧 Ambient Focus Sounds fixed** — Rain / Waves / Outside / White used to
  be silently blocked by an old patch (a capture-phase listener that killed
  the buttons' own clicks) plus a double-stop that unlit the button.
  Fixed, slightly louder, and the button now stays lit while playing.
- **🛠️ Admin: Progression + Run all tests** — press `Ctrl+Shift+A` (or
  `Cmd+Shift+A`), enter the admin code, and you get:
  - **📈 Progression** — XP, level, achievements, sessions, minutes, streak,
    today's minutes, per-subject minutes, bee counts.
  - **🧪 Run all tests** — 22 automated checks (scripts, styles, storage,
    countdown, fonts, panels, audio…) with ✅/❌ results.
  - **🧹 Clear error log** — wipes the stored error log.
  - Admin codes: `QUEEN-ADMIN-2026` or `propolis` (change it in
    `js/17-queen-secrets-events.js`).
- **💬 Coach talks more** — the Sergeant now has longer, warmer lines (used
  1 in 3 times) and Buddy Bee has 10 new full-sentence encouragements.
- **🛠️ Admin mode grew** — `Ctrl+Shift+A` → code `QUEEN-ADMIN-2026` or
  `propolis`. New buttons: Test quote heart, Add 100 XP, Unlock all
  achievements, Simulate session done, Test toast, Night/Zen/Grind/Sleep
  toggles, Bee style old/off, ♿ Reduce motion / High contrast / Large text,
  Storage size report, 🆕 Simulate first launch and 🗑️ Factory reset
  (both two-click confirmed).
- **❤️ Quote hearting upgraded** — tapping 🤍 now shows a toast, keeps the
  ❤️ state on the button (with aria-pressed for accessibility), and favorites
  can be removed from the list with an ✕ button.
- **🐞 Error report cleaned up** — the Settings error report now hides stale
  entries from the old `Study_Hive` build (the corrupted
  `49-ten-extra-secrets.js`), shows how old each error is, and has its own
  🧹 Clear log button.
- **🔔 Global toast fix** — `showMilestoneToast` was private to one file, so
  most toast messages app-wide silently never appeared. It's now global;
  toasts work everywhere.
- **🎚️ Music volume slider** — the Lofi Player now has its own volume slider
  (defaults to 35%: soft but clearly audible). It controls every lofi track
  live while it plays, plus the background/custom music.
- **🛠️ Admin mode is now reachable on phones** — no more keyboard shortcut
  needed. Three ways in: `Ctrl/Cmd+Shift+A`, the **🛠️ Admin Mode** button at
  the bottom of Settings, or **tap "Hive Progress" 5 times** quickly. The code
  is typed into a proper in-app box (the old browser `prompt()` was
  unreliable on mobile). Codes: `QUEEN-ADMIN-2026` or `propolis`.
- **❤️ Quote hearting actually usable** — the quote + heart used to sit at
  the very bottom of a super-tall card, off-screen (the heart was a 9px dot
  you had to scroll to). The quote block now sits near the top of the card,
  right under the clock — always visible — and the heart is a proper 27px
  tap target. Favouriting, un-favouriting and the ✕-remove in the list all
  work.
- **📦 More Tools panels are a bit larger** — panels went from 280px to
  320px wide with bigger headings and buttons (not too big, promise).
- **✍️ Pledge card opens & closes** — click the pledge to expand the full
  promise, click again to collapse (with an edit + close action inside).
  Pressing **🆘 Calm** now auto-opens your pledge with a gentle highlight so
  you're reminded of your promise while you breathe.
- **📜 Hive Studio scrolls** — the Studio panel had a CSS grid bug that
  clipped the feature list and tool bodies instead of scrolling them.
  Fixed: the 20-tool list and every tool page now scroll properly on
  desktop and mobile.
- **🌙 Night mode follows the real sunset** — the app asks Open-Meteo for
  the daily sunrise/sunset of your location (via the weather widget) and
  switches night mode on at the *predicted sunset*, off at sunrise. Falls
  back to 18:00–05:00 when there's no location data yet.
- **🌠 Better night sky** — twinkling stars, a soft moon glow, **shooting
  stars** every 45s–2.5min, and a very rare **planet collision** (two orbs
  meet with a flash, roughly once every 1–2 hours of night). Admin Mode has
  ☄️/🪐 buttons to test them.
- **🫡 Sergeant visual upgrade** — polished badge (colour-coded by rank),
  glow on hover, softer steam/fists. Plus a **test feature**: a second
  Sergeant — the Squad Leader (peaked cap, aviator glasses, whistle) — with
  a toggle in Settings under "Sergeant style (test)". Classic stays default.
- **🐝 5 new bee models** — 🏅 Athlete, 🎵 Musician, 🔬 Scientist, 🧭
  Explorer, 🚀 Astronaut join 🌱🎓⚗️✨👑 as your minutes grow.
- **💬 25 new quotes** — fresh Study Hive lines in the daily rotator.
- **⏳ Extend your timer** — the Focus panel now has **+5 min / +10 min**
  buttons so you can extend a session without losing your progress. They
  also live inside Lock-in mode.
- **🔒 Lock-in mode (timer only)** — a full-screen, distraction-free focus
  timer for people who want to lock in. Everything else dims away; just you
  and the clock. Enter it from the Focus panel ("🔒 Lock in — Timer only"),
  extend with +5/+10, and exit with a double-tap.
- **🐝 The bees dance for you** — when a Lock-in timer finishes, every bee in
  the hive throws a dance party: they bounce, leap and wiggle (each on its
  own beat), emoji confetti rains down, and a celebration card shows how
  many minutes you locked in.
- **🧠 Real spaced repetition for flashcards** — SM-2-lite scheduling: rate
  each card 😵 Again / 😓 Hard / 🙂 Good / 😄 Easy and it's scheduled for
  the right moment (10 min / 1 day / 2.5× / 3.5×). Cards panel shows a
  "🐝 Due today" badge and a "Review due cards only" queue. Existing cards
  are all due immediately. Daily reason to come back.
- **📱 PWA tags on the app itself** — app.html now has the manifest,
  theme-color (honey), apple-mobile-web-app-capable, apple-touch-icon and a
  real `icon.png` — so "Add to Home Screen" works from the app, not just
  the landing page.
- **👈👉 Swipe flashcards** — swipe LEFT = Again, swipe RIGHT = Good
  (Anki/Tinder style). The card follows your finger, then rates itself.
  Taps still flip the card.
- **📳 Haptics** — tiny vibration pulses at 5 moments: card rated, focus
  session finished, achievement unlocked, wasp appears, lock-in done.
  Safe no-op on desktop.
- **📊 Hive Report (weekly recap)** — Spotify-Wrapped style: this week's
  minutes, sessions, days, best subject, streak, cards reviewed, plan-followed
  days — plus a **shareable PNG image** (streak + level + best subject).
  Lives in the Awards panel and the mobile Stats tab.
- **🔔 Daily plan notification** — once per day the app fires "🐝 Today's
  move: Chemistry, exam in 3d" as a local notification (reuses your
  existing notification permission). *Works while the app is open in a
  tab — a true "phone buzzes when the app is closed" reminder needs a
  server (push infrastructure), not a client tweak.*
- **🔀 SR + plan cross-wired** — the "Review due cards only" queue surfaces
  the daily plan's top subject's cards first, so "study Chemistry today"
  and "review Chemistry cards" line up. Completing a session on the plan
  subject marks the day as "followed" (feeds the Hive Report).
- **⏳ Exam-based daily plan** — the app now tells you what to study today:
  closest exam + furthest-behind subject = today's move (e.g. "⏳ Chemistry
  in 4d — one 25-min block of active recall"). Shows on the Home card, the
  Coach screen, and the mobile home. Pure arithmetic, no AI.
- **📱 THE MOBILE APP (final design) is now live in the app** — the moment
  mobile layout is on, the whole app becomes the new mobile experience:
  welcome-back screen, smart greeting, giant focus timer with Start→Stop
  in place, countdown card, quote, honey stats, generative focus music
  player with volume, animated hive zone, the honeycomb screen (real
  subjects as cells with real minutes + working bees), an improved Garden
  World screen, Calm & Breathe screens, Stats, Coach, Settings with clock
  + high-contrast toggles, a 7-item bottom bar, the ☰ drawer with
  Screens/Quick/All tools (all wired to the real panels), and the new
  Queen guide with both a Spotlight tour and a Word tour. Lock-in is the
  real one (portrait-only, bees dance on finish). Desktop untouched.
- **📱 Mobile reset to the stable layout + polish** — the experimental
  mobile shell was removed completely. Mobile is back to the proven,
  glitch-free layout (desktop card, flying bees, hive, sergeant, feature
  launcher with the Tools sheet). Improvements on top: the launcher now
  hides during the welcome screen and onboarding, and tool panels open
  above the launcher.
- **🐝 Full hive on mobile (premium)** — the mobile shell now keeps ALL
  the PC ambience: the real countdown card embedded in Home, flying new &
  old bees, the tap-able hive button (bottom-right, honey glow), the hive
  progress pill (bottom-left), the red goal % pill (bottom-center), the
  mood tracker, the weather pill, the XP level pill in the header, the
  Sergeant + his rage aura on the left, the buddy bee and the wasp —
  all repositioned so nothing overlaps the tab bar or content.
- **📱 Professional mobile UI (new shell)** — the moment mobile layout is
  on (auto on phones, or the toggle in Settings), the app becomes a
  native-feeling app: bottom tab bar (Home · Tools · Focus · Stats ·
  Settings), a hero countdown dashboard with live stats (today, streak,
  XP, bees), a tappable quote card, quick actions, a 20-tool grid, a
  full focus-timer page with presets + pause/resume/extend + lock-in,
  a progress page (level, XP bar, sessions, achievements), and a settings
  page. Desktop is completely untouched.
- **🐝 Reverted to the original bee characters** — the PNG picture
  experiment is gone. The Sergeant is back to the classic hand-drawn SVG
  drill-sergeant bee (bob animation, anger states, cap, medals), and the
  Queen guide + rare Queen fly-by use the original bee emoji. No image
  files needed.
- **👑 Queen = your actual image** — the app now uses your Queen PNG
  (`images/queen.png`) in the Queen guide avatar and the rare Queen fly-by
  banner. (An old patch that force-replaced the Queen with emoji every 1.5s
  was found and disabled — that's why she wasn't showing up.)
- **🫡 Sergeant = your actual images** — the Sergeant is now your three PNG
  animation frames (`images/sergeant-1/2/3.png`) crossfading in a loop
  (neutral → talking → yelling); the angrier he gets, the faster he talks.
- **🐝 New Queen design** — the Queen guide now shows your front-facing
  Queen bee: big golden head, soft face patch, blush cheeks, tiny smile,
  antennae with golden tips — and her **crown sitting on her head**.
- **🫡 New Sergeant design with 3-frame animation** — the classic Sergeant
  is now your front-facing design: golden head, drill helmet with badge,
  face patch — and he **animates through 3 poses** (neutral → talking →
  yelling) on a loop. The angrier he gets, the faster he talks.
- **🔧 Zen key fixed** — the Z-key shortcut threw "toggleZenMode is not
  defined" (the function was private to another file). It's exposed now;
  Z toggles Zen focus, Esc exits.
- **🐝 Wasp redesigned** — friendlier-but-menacing cartoon wasp: round
  head, big eyes with angry brows, yellow-banded abdomen, curved stinger.
- **🫡 Sergeant v2 redesigned — "The Colonel"** — the test Sergeant is now
  a distinguished veteran bee with a tilted navy beret + gold badge, a
  monocle, a proud mustache and a campaign medal. Toggle it in Settings →
  "Sergeant style (test)", or via the Admin 🫡 button.
- **👑 Queen guide got her crown** — the royal tour now opens with a little
  Queen Bee avatar whose crown sits right on her head.
- **🐝 The Wasp (new pressure system)** — if you go **more than 9 hours**
  without logging study time, a wasp enters the hive and stings your bees one
  by one (every ~55s) until the hive is nearly empty. Log *any* session —
  even 5 minutes — and it flees and your bees regrow. Warned about in the
  Queen guide; Admin has 🐝 Summon / 🕊️ Dismiss buttons to test it.
- **🫡 New Sergeant — how to view it** — the **Squad Leader** (peaked cap,
  aviator glasses, whistle) is a test feature: open **Settings → scroll to
  "Sergeant style (test)"** and toggle **Squad Leader Sergeant**. Classic
  stays the default; Admin also has a quick 🫡 toggle button.
- **👑 Queen crown on her head** — the Queen bee's crown now sits right on
  her head (was floating above it).
- **🐝 Bee gallery (admin)** — Admin Mode → **🐝 Bee gallery** shows all 10
  bee models (🌱 60m, 🎓 240m, 🏅 500m, ⚗️ 720m, 🎵 900m, 🔬 1100m, 🧭
  1300m, ✨ 1500m, 🚀 2000m, 👑 3000m) with your current minutes, which are
  unlocked, how far to the next one, and whether the wasp is present.
- **📱 Mobile bees no longer stuck at the wall** — found it: the app
  auto-detects your phone's **Reduce Motion** setting, and the reduce-motion
  CSS killed every animation instantly, freezing bees at the screen edge.
  Bees now keep a slow, calm drift instead of freezing.
- **👑 Queen explainer rebuilt** — the royal tour is now 33 richer stops with
  a "Queen's tip" on every one, an animated progress bar, floating avatar,
  pulsing spotlight, ←/→ keyboard navigation, tap-outside-to-close, and an
  **✨ Try it now** button that opens the feature it's explaining. On phones
  it becomes a scrollable bottom sheet. Content updated to cover everything
  new (sunset night mode, shooting stars, bee models, Squad Leader
  Sergeant, admin, etc.).
- **📱 Mobile layout refined** — the mobile launcher got a honey-gradient bar
  with **🎯 Focus as the raised hero button**, the feature sheet is a proper
  bottom sheet with a handle, tool chips are pill-shaped with press
  feedback, and the main card uses fluid typography that scales on every
  phone size.
- **✨ Everything more interactive** — every button/chip now gives instant
  press feedback (scale + brightness) with visible focus rings for keyboard
  users; **tap the quote to cycle it**, **tap the XP badge** to see your
  level progress, **tap the weather** to refresh it, and tapping the hive
  sends a golden pulse ring.
- **📱 iPhone onboarding scroll FIXED** — on iOS, the setup overlay could
  not be scrolled when the card was taller than the screen (a fixed,
  blur-filtered, flex-centered overlay is a known iPhone Safari bug that
  makes the scroll area unresponsive, and an old patch's manual
  touch-scroller fought the native momentum scroll). The overlay now scrolls
  natively on every phone, the blur was moved off the scroll container, and
  the welcome screen + admin code box got the same treatment.
- **📱 Mobile 100x pass** — every tool panel is now a bottom sheet that fits
  the screen (no more off-screen panels), 44px+ tap targets, no iOS input
  zoom, internal scrolling everywhere.
- **🎓 Bee hats sit ON the heads** — the model emojis (🌱🎓⚗️✨👑) used to
  float above/behind the bees; they now sit properly on their heads (with a
  little settle animation), and the new bees got a subtle polish pass
  (rounder bodies, soft wing shimmer, brighter eyes). Old bees untouched.

---

## 🚀 How to put it on GitHub (first time)

1. Go to https://github.com and sign in (make a free account if you don't have one).
2. Click the **+** (top right) → **New repository**.
3. Name it `study-hive` (any name works). Leave it **Public** (free hosting)
   and click **Create repository**.
4. On the new empty repo page, click **uploading an existing file**.
5. Drag **all** the files and folders from this `study-hive` folder into the
   upload box — *including* the `css`, `js` and `docs` folders and the
   `.nojekyll` file (drag the whole folder's contents, not the folder itself).
6. Click **Commit changes**.
7. Click **Settings** (top tab) → **Pages** (left menu).
8. Under **Branch**, pick `main`, folder `/ (root)`, click **Save**.
9. Wait 1–2 minutes, then open: `https://YOUR-USERNAME.github.io/study-hive/`
   (your username, lowercase) — the landing page loads first.

That URL is your app's home page. Bookmark it — this is what you share.

**Already have it hosted? Just re-upload:** download the newest ZIP, extract,
and upload the whole `study-hive` folder again (Add file → Upload files → drag
the folder). Files with the same names replace the old ones automatically —
no deleting, and new files just appear. Then wait ~1 minute.

---

## 🔁 How to update it later (short version)

You never need to delete a file on GitHub. Git keeps every version, so:

- **Small text change?** Open the file on github.com → ✏️ Edit → change → **Commit changes**.
- **Replacing a file?** Use **Add file → Upload files** and drag in the new
  file with the *same name* — GitHub replaces it automatically.
- **Doing this properly (recommended):** use GitHub Desktop or git commands —
  full step-by-step guide in **`docs/HOW-TO-UPDATE.md`**.

The live site updates itself a minute or two after every commit. No deleting,
no re-uploading from scratch, ever.

---

## 💡 Notes & tips

- **Background music:** the app looks for a file called `background-music.mp3`
  in this folder. Drop your own mp3 in here (same name) and it will play.
- **Legal pages:** the app ships with your real Privacy Policy and Terms of
  Service (© 2026 Omphemetse Mogale), plus `LICENSE.txt` and
  `COPYRIGHT_NOTICE.txt`. The app's footer, feedback system and owner tags
  all use `omphemetse.mogale0409@gmail.com` — change it in one place if you
  ever want a different contact address (`js/20-owner-contact.js`).
- **Fonts:** the app loads Google Fonts from the internet, so it needs to be
  hosted (GitHub Pages) or served over `http://localhost` — opening
  `index.html` directly from your hard drive breaks a few features (the app
  even warns about this in its own hints).
- **Testing locally:** `python3 -m http.server` inside this folder, then open
  `http://localhost:8000`. On Windows: `py -m http.server 8000`.
- **Regenerating:** if you ever save a newer single-file version from your old
  host, the included `split_app.py` rebuilds this whole project from it
  (keep the original file as `uploads/study-hive-smoother (19).html`).
- **Copyright:** the proprietary header from your original file is kept in
  `index.html` — it's your code, and GitHub Pages just hosts it.

Happy buzzing! 🍯
