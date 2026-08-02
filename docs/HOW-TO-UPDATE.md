# 🔁 How to update your app on GitHub (the no-delete way)

The golden rule: **GitHub never needs you to delete a file.** Every file has a
history — when you upload a file with the same name, it *replaces* the old one
and keeps the old version safely in history. If you ever mess up, you can
restore any previous version.

Here are three ways to update, easiest first.

---

## Method 1 — GitHub Desktop (easiest, recommended)

GitHub Desktop is a free app for Windows/Mac that does the "update" part
with buttons instead of typing commands. **This is the workflow to learn.**

1. Download and install https://desktop.github.com and sign in.
2. **File → Clone repository…** → pick `study-hive` → choose where to save it.
   This creates a folder on your computer with ALL your app files.
3. Now edit any file in that folder with any editor (Notepad, VS Code, etc.).
4. Open GitHub Desktop again. It shows a list of **changed files**.
   - Write a short **Summary** of what you changed, e.g. `fixed hive quote`.
   - Click **Commit to main** (this saves the change in your *local* history).
   - Click **Push origin** (this uploads the change to GitHub).
5. Wait ~1 minute and reload your site — it's live.

Do this every time:
**edit → commit → push**. Three clicks. Nothing is ever deleted, and every
commit is a restore point.

---

## Method 2 — Website only (no software at all)

For tiny changes you can do everything in your browser on github.com.

**Editing one file (e.g. a spelling fix):**
1. Open your repo → click the file (e.g. `js/05-countdown-hive-core.js`).
2. Click the ✏️ **Edit** (pencil) button.
3. Make your change → scroll down → **Commit changes** → confirm.
4. Done. The site updates in ~1 minute.

**Replacing a file (e.g. your new version of a js file):**
1. Open your repo → **Add file** → **Upload files**.
2. Drag in the new file. **Important:** name it *exactly* the same as the old
   one (e.g. `styles.css`). GitHub sees the same name and replaces the old
   version — you do NOT delete the old one first.
3. **Commit changes.** Done.

**If you want to upload many files at once:** same upload screen, drag them
all in, commit once. Same-name files get replaced, new files get added.

---

## Method 3 — Command line (when you're ready to feel powerful)

Once, on your computer:

```bash
git clone https://github.com/YOUR-USERNAME/study-hive.git
cd study-hive
```

Every time you make changes:

```bash
git add .                          # 1. stage everything you changed
git commit -m "describe the change"  # 2. save a snapshot locally
git push                           # 3. upload to GitHub
```

One-line cheat sheet of what each command does:

| Command | What it does |
|---|---|
| `git add .` | Marks all changed files to be saved |
| `git commit -m "message"` | Takes the snapshot (local only) |
| `git push` | Uploads your commits to GitHub |
| `git pull` | Downloads changes from GitHub to your computer (do this before editing if you ever edit on the website too) |
| `git status` | Shows what changed — run it if you're unsure |
| `git log --oneline` | Shows your version history |

---

## ⚠️ Things to never do

- ❌ **Don't delete a file before re-uploading it.** Upload the same name and
  it replaces automatically. Deleting + re-adding also works, but it's
  unnecessary and loses the file's history.
- ❌ **Don't keep "new version" copies** like `index (2).html` or
  `styles-final-v3.css`. Old versions live in git history — you can restore
  them anytime (GitHub: file → History).
- ❌ **Don't edit files directly in the "deployed" site** — there is no
  deployed site, only your repo. The hosted page is generated FROM your repo.
- ❌ **Don't forget `git pull` first** if you sometimes edit on the website
  and sometimes on your computer — otherwise you'll get a "merge conflict"
  (git's way of saying two versions changed at once; the fix is to keep one
  of them and commit again).

---

## 🧪 Preview before you push (so you never break the live app)

1. Copy the file you're changing into the local folder, or just edit in place.
2. Open a terminal in the folder and run:
   - Windows: `py -m http.server 8000`
   - Mac/Linux: `python3 -m http.server 8000`
3. Open `http://localhost:8000` and test.
4. Only when it looks good: commit + push.

## ♻️ Restoring an old version (oops button)

1. On github.com, open the file → click **History** (top right).
2. Find the version you want → **View** → copy its content, or use
   **Browse files** to see the whole repo at that commit.
3. Paste it back / upload it with the same name, commit. Done.

---

*Bottom line: edit → commit → push. The site updates itself. You can never
"break" it permanently — every version is one click away.*
