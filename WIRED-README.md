# Study Hive (BeeFocus) — Mobile Layout: Fully Wired

**Mission:** every icon and button in the mobile layout is now pressable and
opens its respective tool — without changing how anything looks.

Your layout (`app/page.tsx`) was kept pixel-identical. The home screen's
markup lives unchanged in `components/screens/home-screen.tsx` — only the
interactions were added.

---

## What was wired

| Element | Now does |
|---|---|
| ☰ menu button (top-left) | Opens the full menu drawer |
| "100% My Goal" indicator | Shows **real** % of today's goal (Settings → daily goal) |
| ☀️ weather chip | Tap to change city (live weather via Open-Meteo, falls back to the design default offline) |
| Greeting bubble | Real greeting + your name + your weakest subject |
| "Next Best move" | Real: the subject with the least logged minutes |
| "Start 15m Focus" | Opens the Focus screen with a 15m preset, auto-start |
| "Ask Coach" | Opens the Hive Coach screen |
| Quote heart 🤍 | Saves/removes the quote from favourites |
| Privacy / Terms / Creator links | Open in-app pages (with links to the full old-site pages) |
| Bottom nav (Home/Focus/Garden/Stats/Settings) | Real screen switching — **sticky, always visible while scrolling** |
| Top bar | Now sticky too, so the ☰ menu is never lost |

## The menu drawer (☰) — all PC-version features, grouped

- **Screens:** Home, Focus Timer, Garden World, Progress & Stats, Hive Coach, Settings
- **Study tools:** Flashcards, Notes, Tasks, Exams, Grades, Vocab Bank, Heatmap
- **Focus & calm:** Focus Music, Breathe, Calm, Pomodoro, Freeze
- **Fun & secrets:** Bee Puns, Daily Challenge, Rival Hive, Time Capsule, Secrets
- **Legal:** Privacy Policy, Terms of Service, Meet the Creator

Every tool is a **working** screen backed by on-device storage
(`localStorage`, one key: `beefocus-data-v1`):

- **Focus timer** — 15/25/45 presets, start/pause/stop, +5, subject picker,
  progress bar. Finished sessions log minutes → stats, garden, heatmap, coach.
- **Garden** — flowers grow from real studied minutes (60→420), water +
  journal, plant intentions.
- **Stats** — level/XP (minutes = XP), streak, sessions, days to finals,
  best subject, 15-week honey heatmap, per-subject bars.
- **Coach** — weakest subject, suggested moves that log minutes instantly.
- **Cards / Notes / Tasks / Exams / Grades / Vocab** — full add / edit /
  delete / mark-done flows with persistence.
- **Music** — generative WebAudio lofi (hive hum / rain / forest / waves),
  no files, volume in Settings.
- **Breathe** — 4-4-6 rhythm with growing circle. **Calm** — gentle lines.
- **Pomodoro** — 4 rounds × 25m + breaks, logs minutes.
- **Puns / Challenge / Rival / Freeze / Capsule / Secrets** — each fully
  functional, favourites persist.
- **Settings** — name, daily goal, finals date, city, volume, backup
  download/restore, reset, link to the full PC version.

## How to drop this into your real project

1. Copy these folders/files into your repo (they match your configs exactly):
   - `app/page.tsx` — replace yours (your original design, now the app shell)
   - `app/layout.tsx`, `app/globals.css` — unchanged from yours
   - `components/` — all new files (see tree below)
   - `lib/` — new (store + data layer)
2. Your real `components/honeycomb-bg.tsx`, `live-clock.tsx`,
   `finals-countdown.tsx`, `custom-bee.tsx` can replace the clearly-marked
   placeholders whenever you have them — everything else keeps working.
3. Set your real URLs in:
   - `components/screens/settings-screen.tsx` → `PC_SITE`
   - `components/screens/legal-screen.tsx` → `PC_SITE`

## File tree (new/changed)

```
app/page.tsx                      shell: honeycomb + provider + top bar + screens + bottom nav
lib/store.tsx                     app state: screen, drawer, data, toasts
lib/storage.ts                    data layer + content banks (puns, calm, challenges…)
components/app-shell.tsx          persistent top bar + router + sticky bottom nav
components/menu-button.tsx        ☰ button (same look, opens drawer)
components/menu-drawer.tsx        the full tools/settings drawer
components/bottom-nav.tsx         sticky nav — always visible
components/screen-router.tsx      screen ↔ component mapping
components/screens/home-screen.tsx   your original page markup, wired
components/screens/focus-screen.tsx  garden / stats / settings / coach / legal…
components/screens/*.tsx          one file per tool (cards, notes, tasks…)
```

## Notes

- Everything stays on-device — same privacy promise as the PC version.
- `next.config.mjs` (yours) already ignores TS build errors; code is clean TS.
- Run with `npm install && npm run dev`.
