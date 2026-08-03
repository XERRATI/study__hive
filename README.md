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
