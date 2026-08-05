# Study Hive — NEW Island UI: Complete, Wired & Error-Free

This zip is the **new mobile UI** (the island-themed one from your screenshots),
built with **your real components**, everything pressable, and a clean
production build (zero errors).

---

## What was missing → now fixed

| Problem | Fix |
|---|---|
| `lib/utils.ts` was missing — `button.txt` imports `cn` from it → **this caused "too many errors"** | ✅ Added `lib/utils.ts` |
| `components/ui/button.tsx` (your `button.txt`) had nowhere to live | ✅ Added at the exact path `components/ui/button.tsx` |
| `bee-flower` + `beehive` images were **remote URLs** (Vercel blob) — they work online but break offline/previews | ✅ Downloaded into `public/images/bee-flower.png` and `public/images/beehive.png`, code now uses local paths |
| The 10 island wallpapers weren't referenced anywhere in the code | ✅ All 10 copied to `public/wallpapers/`, `wallpaper-3.png` is the app background |

## What every button does now

- **☰ menu button** → opens the drawer with ALL tools (Screens · Study tools · Focus & calm · Fun & secrets · Legal)
- **Bottom nav** (Home · Honey · Goals · Garden · Coach · Stats) → real screen switching, current tab highlighted, sticky while you scroll
- **Honey 🍯** → the hive screen: your subjects as honeycomb cells, tap a cell for details
- **Goals 🎯** → live countdown to finals + today's goal progress + streak/pomodoros
- **Weather chip** → tap to change city (live weather)
- **Greeting bubble** → your name + your weakest subject
- **Finals countdown** → LIVE: days/hours/mins/secs tick to your finals date, "total hrs" = your real study time, bar fills as finals approach
- **Start 15m Focus** → opens a real working timer (pause/stop/+5, subject picker) — finished sessions log minutes to stats, garden, heatmap, coach
- **Ask Coach** → Hive Coach with suggested moves that log minutes
- **Quote heart** → saves favourites
- **Footer links** (Privacy/Terms/Creator) → open in-app pages
- Everything in the drawer (Cards, Notes, Tasks, Exams, Grades, Vocab, Heatmap, Music, Breathe, Calm, Pomodoro, Freeze, Puns, Challenge, Rival, Capsule, Secrets, Settings) → **fully working**, saved on-device

## Files in this zip

```
app/layout.tsx                  (yours, unchanged)
app/page.tsx                    island wallpaper bg + router + drawer
app/globals.css                 (yours, unchanged)
components/ui/button.tsx        (your button.txt)
components/honeycomb-bg.tsx     (your real one)
components/live-clock.tsx       (your real one)
components/custom-bee.tsx       (your real one)
components/finals-countdown.tsx (your design, now LIVE)
components/bottom-nav.tsx       (your design, now wired)
components/menu-button.tsx      (your ☰, opens drawer)
components/menu-drawer.tsx      all-tools drawer
components/screen-router.tsx
components/screens/*.tsx        home + 24 working tool screens
lib/utils.ts                    THE missing file
lib/store.tsx                   app state (screens/drawer/data/toasts)
lib/storage.ts                  on-device data layer
public/images/bee-flower.png    downloaded (was remote)
public/images/beehive.png       downloaded (was remote)
public/wallpapers/wallpaper-1..10.png   your island wallpapers
package.json / package-lock.json / next.config.mjs / tsconfig.json /
postcss.config.mjs / components.json
```

## How to import into your repo

1. Unzip over your project root (same structure).
2. `npm install && npm run dev`.
3. Done — verified: `next build` compiles clean, zero console errors.

## Swap the wallpaper

The background uses `public/wallpapers/wallpaper-3.png`. To use another one,
just rename your favourite to `wallpaper-3.png` (or edit `src` in `app/page.tsx`).
The cream `--background` shows while it loads.

## Notes

- Data stays on-device (`localStorage` key `beefocus-data-v1`) — same privacy
  promise as the old app.
- If you already have your own `lib/utils.ts`, keep yours (they're identical).
- The old HTML app is NOT in this zip — this is the new Next.js UI only.
