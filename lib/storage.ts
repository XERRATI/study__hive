/**
 * Study Hive (BeeFocus) — local data layer.
 * Everything is stored on-device in localStorage under one key,
 * mirroring the "your data stays on this device" promise of the PC version.
 */

export type Todo = { id: string; text: string; done: boolean }
export type Note = { id: string; title: string; body: string; ts: number }
export type Card = { id: string; front: string; back: string }
export type Exam = { id: string; name: string; date: string }
export type Grade = { id: string; subject: string; pct: number }
export type Vocab = { id: string; word: string; meaning: string; known: boolean }

export type AppData = {
  name: string
  goalName: string
  dailyGoal: number
  finals: string // YYYY-MM-DD
  city: string
  dailyLog: Record<string, number> // 'YYYY-MM-DD' -> minutes
  subjects: Record<string, number> // subject -> minutes
  sessionsTotal: number
  favorites: string[]
  todos: Todo[]
  notes: Note[]
  cards: Card[]
  exams: Exam[]
  grades: Grade[]
  vocab: Vocab[]
  garden: { intents: string[]; journal: string[]; wateredToday: number }
  rival: { name: string; theirMin: number }
  freeze: { on: boolean; note: string }
  capsule: { msg: string; openDate: string }
  pomodoro: { round: number; doneToday: number }
  challenge: { lastDate: string; done: number }
  punsFav: string[]
  secretsFound: string[]
  music: { track: string; vol: number }
  wallpaper: number
}

const KEY = 'beefocus-data-v1'

export function dateKey(d: Date = new Date()): string {
  const p = (n: number) => (n < 10 ? '0' : '') + n
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function defaultData(): AppData {
  return {
    name: '',
    goalName: 'Finals',
    dailyGoal: 60,
    finals: '2026-10-26',
    city: 'Pretoria',
    dailyLog: {},
    subjects: {},
    sessionsTotal: 0,
    favorites: [],
    todos: [],
    notes: [],
    cards: [],
    exams: [],
    grades: [],
    vocab: [],
    garden: { intents: [], journal: [], wateredToday: 0 },
    rival: { name: '', theirMin: 0 },
    freeze: { on: false, note: '' },
    capsule: { msg: '', openDate: '' },
    pomodoro: { round: 0, doneToday: 0 },
    challenge: { lastDate: '', done: 0 },
    punsFav: [],
    secretsFound: [],
    music: { track: 'hive', vol: 30 },
    wallpaper: 3,
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultData()
    const parsed = JSON.parse(raw)
    return { ...defaultData(), ...parsed }
  } catch {
    return defaultData()
  }
}

export function saveData(d: AppData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d))
  } catch {
    /* storage full / blocked — ignore */
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

/** Current streak in days (ends today or yesterday). */
export function computeStreak(dailyLog: Record<string, number>): number {
  const days = Object.keys(dailyLog)
    .filter((k) => (dailyLog[k] || 0) > 0)
    .sort()
  if (!days.length) return 0
  const set = new Set(days)
  let streak = 0
  const cursor = new Date()
  if (!set.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1) // allow today not logged yet
  while (set.has(dateKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function totalMinutes(data: AppData): number {
  return Object.values(data.dailyLog).reduce((a, b) => a + (b || 0), 0)
}

export function todayMinutes(data: AppData): number {
  return data.dailyLog[dateKey()] || 0
}

export function weakestSubject(data: AppData): string | null {
  const entries = Object.entries(data.subjects).sort((a, b) => a[1] - b[1])
  return entries.length ? entries[0][0] : null
}

export function goalPct(data: AppData): number {
  const goal = Math.max(1, data.dailyGoal || 60)
  return Math.min(100, Math.round((todayMinutes(data) / goal) * 100))
}

/* ------------------------------------------------------------------ */
/* Content banks (mirrors the PC version's flavour)                    */
/* ------------------------------------------------------------------ */

export const FLOWERS = [
  { icon: '🌼', name: 'Focus Daisy', min: 60 },
  { icon: '🌻', name: 'Sunflower', min: 120 },
  { icon: '🌷', name: 'Tulip', min: 180 },
  { icon: '🌸', name: 'Cherry Bloom', min: 240 },
  { icon: '🌹', name: 'Rose', min: 320 },
  { icon: '🌺', name: 'Hibiscus', min: 420 },
]

export const LEVELS = [
  { n: 'Egg', i: '🥚', m: 0 },
  { n: 'Larva', i: '🐛', m: 100 },
  { n: 'Worker', i: '🐝', m: 300 },
  { n: 'Drone', i: '🐝', m: 700 },
  { n: 'Guard', i: '🛡️', m: 1300 },
  { n: 'Queen Bee', i: '👑', m: 2200 },
]

export function levelInfo(xp: number) {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].m) idx = i
  return LEVELS[idx]
}

export const PUNS = [
  'Why did the bee get a promotion? It was outstanding in its field. 🐝',
  'Bee happy, bee bright, bee you. 🍯',
  'What do you call a bee that can’t make up its mind? A maybe. 🤔',
  'The bee’s knees are actually the pollen baskets. Fun fact. 📚',
  'To bee or not to bee — that is the question. 🎭',
  'Bees are honey-obsessed, and honestly, same. 🍯',
  'A bee’s favourite movie? The Honey Potter series. 🎬',
  'What did the bee say to the flower? Hi, honey! 💛',
  'Bees work so hard they never have to bee-worry about results. 💪',
  'You’re un-bee-lievable. 🐝',
  'When bees get old, they go buzz-y. 😄',
  'A bee’s favourite singer? Sting. 🎸',
  'Bee-lieve in yourself, even on the hard days. ✨',
  'The hive mind is real — bees share their study notes. 📝',
  'Busy as a bee, but calm as honey. 🧘',
  'What do bees use to brush their hair? Honeycombs. 🪮',
  'Why are bees so good at math? They know their honey-comb-ination. ➗',
  'Bees never cram — they space their study across the hive. 🗓️',
  'One bee’s trash is another bee’s treasure (pollen, obviously). 🐝',
  'Bee kind — it costs nothing but a little honey. 💛',
]

export const CALM_LINES = [
  "Take a breath. You're doing better than you think. 🐝",
  "One task at a time. The hive wasn't built in a day either.",
  "It's okay to pause. Resting is part of the work.",
  "You've gotten through every hard day so far. This one's no different.",
  "Unclench your jaw, drop your shoulders, breathe out slowly.",
  "Progress, not perfection — that's the bee way.",
  "Even the Queen takes breaks. Drink some water. 💧",
  "You don't need to do it all today. Just the next small step.",
]

export const CHALLENGES = [
  'Start a 15-minute focus block before lunch. 🎯',
  'Teach someone (or a cushion) one thing you learned today. 🧠',
  'Turn your last notes into 3 flashcards. 🗂️',
  'Study without your phone in the same room. 📵',
  'Write one sentence about why this goal matters to you. ✍️',
  'Do a 10-minute recall test on your weakest topic. 🔁',
  'Walk for 5 minutes between study blocks. 🚶',
  'Explain today’s topic out loud in 60 seconds. 🗣️',
  'Drink two glasses of water during your next block. 💧',
  'End the day by planning tomorrow’s first block. 🗓️',
  'Log your mood before and after a session. 😌',
  'Get 15 minutes of fresh air before studying. 🌳',
]

export const JOURNAL_LINES = [
  '"Watered the garden with focused minutes. The bees approve." — just now',
  '"One more flower on its way. Keep going." — just now',
  '"Every drop counts. The garden knows." — just now',
  '"Studied, watered, repeated. Growth is happening." — just now',
]

export const SECRETS = [
  "Queen's whisper: tap the brand five times… 👑",
  "The swarm knows: finish 3 sessions in a day and a special bee visits.",
  "Night mode hides in the old hive. Some secrets only glow at night.",
  "Every 100 XP the Queen adds a new rule to the hive.",
]

export const QUOTES = [
  '"Study while others are sleeping; work while others are loafing."',
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"It always seems impossible until it is done." — Nelson Mandela',
  '"Success is the sum of small efforts, repeated day in and day out." — R. Collier',
  '"Don\'t watch the clock; do what it does. Keep going." — Sam Levenson',
]
