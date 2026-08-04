# Script map (js/)

Files load in this exact order from `index.html` — each is one patch layer of the app.
Renumbering or reordering them will break things.

**New in this version:** `00-shared-utils.js` (single implementation of esc/$/qa/getJSON/setJSON/pad/dateKey — every file's local copy now delegates to it with a hoist-safe fallback), SR→daily-plan cross-wire (Again-press struggle signal in `65-daily-plan.js`), backup nudge in `38`, and the in-app test run grew 22 → 38 checks.

- `00-shared-utils.js` (1.2 KB) — shared helpers: `window.shEsc / shGet / shQa / shGetJSON / shSetJSON / shPad / shDateKey`. Loaded FIRST — never reorder.
- `01-idle-timer-scheduler.js` (3.9 KB)
- `02-startup-fade.js` (0.4 KB)
- `05-countdown-hive-core.js` (43.9 KB)
- `06-xp-achievements-buddy.js` (124.4 KB)
- `07-milestones-tips-clicker.js` (63.0 KB)
- `08-study-data-core.js` (37.0 KB)
- `09-coach-focus-intention.js` (14.6 KB)
- `10-real-hive-builder.js` (1.0 KB)
- `11-settings-toggles.js` (15.5 KB)
- `12-volume-pledge-goal.js` (8.6 KB)
- `13-sounds-tour-swarm.js` (12.6 KB)
- `14-tour-onboarding.js` (13.5 KB)
- `15-bee-styles-clean-ui.js` (14.7 KB)
- `16-bee-styles-queen.js` (11.1 KB)
- `17-queen-secrets-events.js` (20.1 KB)
- `18-privacy-notifications.js` (7.8 KB)
- `19-background-music.js` (3.4 KB)
- `20-owner-contact.js` (1.7 KB)
- `21-more-tools-dock.js` (2.7 KB)
- `22-pledge-onboarding.js` (3.7 KB)
- `23-pledge-helpers.js` (4.6 KB)
- `24-pledge-upgrade-fill.js` (4.4 KB)
- `25-onboard-field-guard.js` (1.1 KB)
- `26-setup-field-guard.js` (3.0 KB)
- `27-onboard-scroll.js` (2.7 KB)
- `28-mobile-layout.js` (1.1 KB)
- `29-mobile-layout-more.js` (1.3 KB)
- `30-ai-provider-coach.js` (10.0 KB)
- `31-tour-shortcuts.js` (13.4 KB)
- `32-exams-notes-flashcards.js` (11.7 KB)
- `33-flashcards-import.js` (11.7 KB)
- `34-language-speech.js` (6.3 KB)
- `35-language-tts.js` (7.7 KB)
- `36-session-summary-data.js` (9.1 KB)
- `37-sessions-heatmap.js` (9.2 KB)
- `38-whispers-easter-eggs.js` (7.1 KB)
- `39-backup-export.js` (7.3 KB)
- `40-accessibility-settings.js` (6.9 KB)
- `41-og-cards.js` (7.7 KB)
- `42-og-cleanup.js` (0.8 KB)
- `43-master-volume-audio.js` (3.9 KB)
- `44-music-softening.js` (3.4 KB)
- `45-queen-image.js` (1.9 KB)
- `46-garden-todos-zen.js` (2.4 KB)
- `47-milestone-motivation.js` (3.3 KB)
- `48-flashcards-garden-tasks.js` (5.3 KB)
- `49-bee-xp.js` (1.6 KB)
- `50-sos-calm-focus.js` (1.2 KB)
- `51-secrets-admin.js` (4.2 KB)
- `52-admin-status-report.js` (3.2 KB)
- `53-error-log.js` (1.0 KB)
- `54-welcome-screen.js` — front page: welcome screen on every visit, "Enter the Hive" button
- `55-onboarding-wizard.js` — setup is now one question per step with a bee slider; main-screen hive progress bee
- `56-night-sky.js` — night sky events: shooting stars (every 45s–2.5min) and rare planet collisions while night mode is on
- `57-sergeant-v2.js` — test feature: Squad Leader Sergeant variant (Settings toggle)
- `58-wasp.js` (8 KB) — idle wasp: appears after 9h of inactivity and stings (haptic) every 55s until you study; redesigned SVG
- `59-lockin-mode.js` (12 KB) — full-screen portrait lock-in timer with +5/+10 extensions; bees dance when it finishes
- `62-mobile-app.js` (52 KB) — the whole mobile shell: 7-tab bottom bar, honeycomb comb, garden, coach, stats, settings, drawer of all tools, spot/word guides, report box, music player
- `63-safe-storage.js` (4 KB) — safe localStorage read/write + haptics helper `window.buzz()` + stable `window.makeCardId()`
- `64-spaced-repetition.js` (12 KB) — SM-2-style scheduling, due-queue filter, rating buttons, swipe gestures (left=Again, right=Good)
- `65-daily-plan.js` (8 KB) — exam-aware daily plan: today's move, injected on Home, Coach and mobile
- `66-hive-report.js` (8 KB) — weekly Hive Report (minutes/sessions/best subject/streak/cards/plan days) + shareable PNG
- `67-plan-notify-crosswire.js` (8 KB) — daily plan notification, SR queue plan-first ordering, plan-followed tracking + plan-streak achievements

**Also:** `sw.js` (service worker — network-first, offline fallback, enables PWA install + home-screen shortcuts). `manifest.webmanifest` now ships real icons (180/192/512 + maskable) and three shortcuts: Start Focus, Review Cards, Daily Plan.
- `68-voice-cards.js` (7 KB) — voice-to-flashcard quick capture: 🎤 button in the Cards panel, transcript → draft front/back (separator / sentence / whole-phrase parsing), `window.voiceCards.parse` unit-tested
- `69-focus-quality.js` (5 KB) — interruption tracking: visibility/blur events during an active focus session, stored per day in `studyhive-interrupts-v1`, Focus-panel chip, feeds the Hive Report
- `70-cram-mode.js` (6 KB) — exam-day cram mode: when an exam is today/tomorrow, a "🧠 Cram" button makes the review queue show only that subject's cards, hardest first (lapses desc); window.__cram test hooks
