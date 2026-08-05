'use client'

/**
 * HIVE COACH — reads real data (weakest subject, today's minutes,
 * streak) and suggests a next move. Actions log study minutes.
 */
import { useApp } from '@/lib/store'
import { computeStreak, dateKey, todayMinutes, weakestSubject } from '@/lib/storage'

export function CoachScreen() {
  const { data, setData, toast } = useApp()
  const weak = weakestSubject(data)
  const today = todayMinutes(data)
  const streak = computeStreak(data.dailyLog)

  const quickLog = (mins: number, label: string) => {
    const key = dateKey()
    const sub = weak || 'General'
    setData((d) => ({
      ...d,
      dailyLog: { ...d.dailyLog, [key]: (d.dailyLog[key] || 0) + mins },
      subjects: { ...d.subjects, [sub]: (d.subjects[sub] || 0) + mins },
      sessionsTotal: d.sessionsTotal + 1,
    }))
    toast(`Logged ${mins} min on ${sub} 🍯`)
  }

  const moves = weak
    ? [
        { mins: 10, label: `🔁 10m recall — ${weak}` },
        { mins: 20, label: `✏️ 20m practice — ${weak}` },
        { mins: 15, label: `🗂️ 15m flashcards — ${weak}` },
        { mins: 25, label: `🎯 25m deep block — ${weak}` },
      ]
    : [
        { mins: 15, label: '🎯 First 15m block of the day' },
        { mins: 25, label: '🍅 25m pomodoro to break the ice' },
      ]

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🐝 Hive Coach</h2>

        <div className="mt-4 rounded-2xl bg-greeting/60 px-5 py-5 text-center">
          <p className="text-3xl" aria-hidden="true">🐝</p>
          <p className="mt-1 text-lg font-bold text-foreground">Your smart next move</p>
          <p className="mt-1 text-base font-medium leading-relaxed text-greeting-foreground">
            {weak
              ? `${weak} has the least logged time. Attack it while it's fresh.`
              : 'Log your first session to unlock coaching — the hive learns from real minutes.'}
          </p>
        </div>

        {/* hive status */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-track/70 px-3 py-3">
            <p className="text-xl font-bold text-foreground">{today}m</p>
            <p className="text-xs font-semibold text-brown">Today</p>
          </div>
          <div className="rounded-2xl bg-track/70 px-3 py-3">
            <p className="text-xl font-bold text-foreground">🔥 {streak}</p>
            <p className="text-xs font-semibold text-brown">Streak</p>
          </div>
          <div className="rounded-2xl bg-track/70 px-3 py-3">
            <p className="text-xl font-bold text-foreground">{data.sessionsTotal}</p>
            <p className="text-xs font-semibold text-brown">Sessions</p>
          </div>
        </div>

        {/* suggested moves */}
        <p className="mt-6 text-sm font-bold text-foreground">Suggested next moves</p>
        <div className="mt-2 space-y-2">
          {moves.map((m) => (
            <button
              key={m.label}
              type="button"
              onClick={() => quickLog(m.mins, m.label)}
              className="flex w-full items-center justify-between rounded-2xl bg-track/70 px-5 py-3.5 text-left text-base font-semibold text-foreground transition-transform active:scale-[0.98]"
            >
              <span>{m.label}</span>
              <span className="text-sm font-bold text-honey-deep">+{m.mins}m</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold text-brown">
          Tap a move and the minutes are logged straight into your stats, garden & heatmap.
        </p>
      </div>
    </div>
  )
}
