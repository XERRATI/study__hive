# 🐝 Study Hive — Project Files

Your Study Hive app, split from one giant 900 KB file into a clean project that
GitHub can host for free. **This is the version you upload to GitHub.**

---

## 📁 What's in here

```
study-hive/
├── index.html            ← the page itself (markup only)
├── css/
│   └── styles.css        ← ALL the styling (51 style blocks joined)
├── js/                   ← the app logic, split into 51 ordered files
│   ├── 01-idle-timer-scheduler.js
│   ├── 02-startup-fade.js
│   ├── 05-countdown-hive-core.js    ← countdown clock + hive tap + quotes
│   ├── 07-milestones-tips-clicker.js ← includes the bee-clicker mini-game
│   └── ... (51 files total)
├── docs/
│   ├── SCRIPT-MAP.md     ← what each js file is (read this!)
│   └── HOW-TO-UPDATE.md  ← ⭐ how to update your app on GitHub
├── manifest.webmanifest      ← lets the app be installed like an app
├── study-hive-landing.html   ← your marketing/landing page
├── study-hive-privacy-policy.html  ← your real Privacy Policy
├── study-hive-terms-of-service.html ← your real Terms of Service
├── LICENSE.txt               ← your licence (proprietary)
└── COPYRIGHT_NOTICE.txt      ← your copyright notice
```

**Rule:** the files in `js/` load in exactly this order. Don't renumber or
reorder them, and don't rename files without updating `index.html`.

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
   (your username, lowercase).

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
