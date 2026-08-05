# 🚀 How to get the new UI LIVE on GitHub Pages

**Why it wasn't live:** GitHub Pages can't run Next.js code. It only serves
static files, so the code sitting in the repo does nothing until it's
**built** (converted to a static `out/` folder) and **deployed**. This zip
contains everything needed to make that happen automatically on every push.

## One-time setup (2 minutes)

1. **Unzip this over your repo** (it adds `.github/workflows/deploy.yml`,
   updates `next.config.mjs`, `app/layout.tsx`, and `lib/paths.ts`).
   Push everything to GitHub (including the `.github/` folder!).

2. **Enable Pages from Actions:**
   GitHub repo → **Settings → Pages** →
   under **Build and deployment**, set **Source** to
   **"GitHub Actions"**.

3. **Push** (or in the Actions tab, run the workflow manually).

4. Wait ~2 minutes → your new UI is live at
   `https://xerrati.github.io/study__hive/` ✅

## How it works (no more manual steps ever)

The workflow `.github/workflows/deploy.yml` runs on every push to `main`:
1. `npm ci` — installs dependencies
2. `npm run build` with `NEXT_PUBLIC_BASE_PATH=/study__hive` — produces the
   static `out/` folder with all asset paths correctly prefixed
3. Uploads `out/` and deploys it to GitHub Pages

The new UI **replaces the old site at the root URL**. Your old files
(`app.html`, `index.html`, the old HTML app) stay safe in the repo — they're
just no longer what Pages serves. Move them into a `legacy/` folder later if
you want them hosted at a subpath.

## What was changed for deployment

| File | Change |
|---|---|
| `next.config.mjs` | Added `output: 'export'` + `basePath`/`assetPrefix` (reads `NEXT_PUBLIC_BASE_PATH`) |
| `lib/paths.ts` | NEW — `asset()` helper that prefixes `/study__hive` |
| all `<img src>` | Now use `asset()` so images load on the site (wallpapers, bee-flower, beehive, settings thumbs) |
| `app/layout.tsx` | Removed Vercel Analytics (it 404s on GitHub Pages) |
| `.github/workflows/deploy.yml` | NEW — auto build + deploy on every push |

## To preview the export locally (exactly like GitHub Pages)

```
NEXT_PUBLIC_BASE_PATH=/study__hive npm run build
cd out && python3 -m http.server 8123
# open http://localhost:8123/study__hive/
```

## Adding your night-mode wallpaper later

Drop it into `public/wallpapers/wallpaper-11.png` (or rename over any of the
10) → push → the workflow redeploys automatically. It shows up in
Settings → Wallpaper.
