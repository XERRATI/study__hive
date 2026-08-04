# Study Hive — QA & Test Map

Everything that guards this codebase, in one place. **Nothing here needs a
build step** — the in-app suite runs inside the app, the rest run with
plain `node` + puppeteer on any machine (the same scripts the CI-style
checks use).

## 1. In-app suite — "🧪 Run all tests" (Admin mode)

Where: `js/17-queen-secrets-events.js` → `adminRunTests` → Ctrl+Shift+A →
code (`QUEEN-ADMIN-2026` or `propolis`) → 🧪 Run all tests.

43 checks, run live in the app after every upload:
- scripts loaded (66/66), stylesheet, localStorage, fonts, Web Audio
- core UI presence: welcome screen, hive, motivation bubble, countdown
  ticking, XP bar, Sergeant, all panels (focus/grades/settings/tasks/
  water/flashcards/garden), ambient sound buttons, quote rotator
- error log cleanliness
- round 12+: shared utils + esc delegation, SR engine, daily plan +
  struggle signal, plan streak, deck-import parser, haptics, stable card
  ids, Hive Report, **Backup Center + Backup nudge**, voice cards + AI
  polish, focus quality, cram mode, mobile shell (when mobile is on),
  service worker API, manifest icons + shortcuts (fetched live), SW
  registration

## 2. Puppeteer suites (`tools/pptr/`)

All run headless against the local server. Every round ships only after
all of these pass.

| Suite | Covers |
|---|---|
| `full_test.js` | 43 in-app checks end-to-end + admin progression + ambient sounds + zero page errors |
| `sr_test.js` | SM-2 scheduling, due queue, rating buttons, daily-plan message, desktop + mobile |
| `report_test.js` | Hive Report body, share PNG (900×560), SR×plan cross-wire order, plan-followed flag, mobile box |
| `mobile_ux_test.js` | PWA meta, swipe gestures → Good → interval 1, haptics (buzz calls) |
| `round12_test.js` | manifest icons/shortcuts, sw.js served + registered, deck import, plan streak → achievement, shortcut deep links, XSS probe |
| `round13_test.js` | shared utils, SR→plan cross-wire, **backup nudge** (fires after threshold + 21 days, once/day), 43 in-app checks, 7-vector XSS probe |
| `round14_test.js` | voice-card parser, focus-quality tracking → report, card-count nudge, Hive sync score + weekDays fix |
| `round15_test.js` | Locked In achievement, AI polish (4 paths), cram queue + ordering + toggle |
| `longuse_test.js` | **Everyday-use simulator**: seeds 1000h or 10,000h of real data (60k–637k minutes, 230–2,300 days, 3,000+ cards, 2,000-day streak) and drives the real UI: countdown ticking, 39-button walkthrough, simulated sessions, timer extension, deck import, cram + plan-card cram hint, report/share, mobile shell tabs + drawer, unpressable-button geometry scan (desktop + mobile), full error sweep |

Run one: `node <suite>.js` from `tools/pptr/` (needs `npm install
puppeteer` once + Chrome system libs on a fresh machine).

## 3. How it fits the drag-and-drop workflow

- **In-app suite**: run it inside the app after every GitHub upload —
  zero tooling on your side.
- **Puppeteer suites**: run locally by anyone with node (or ask the
  assistant to run them — that's what happens every round before a zip
  ships).
- **GitHub Actions was deliberately declined**: on a drag-and-drop
  upload workflow, cloud CI runs blind — the person uploading can't see
  or fix failures without local tooling, which defeats the point. The
  in-app suite is the workflow-native equivalent and ships with the app.
