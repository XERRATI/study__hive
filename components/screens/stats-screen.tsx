'use client'

/**
 * PROGRESS & STATS — level/XP (minutes = XP, like the PC version),
 * totals, streak, best subject, and a honey heatmap of the last 15 weeks.
 */
import { useApp } from '@/lib/store'
import {
  computeStreak,
  dateKey,
  levelInfo,
  totalMinutes,
  todayMinutes,
} from '@/lib/storage'

export function StatsScreen() {
  const { data } = useApp()
  const xp = Math.round(totalMinutes(data))
  const lv = levelInfo(xp)

  const days: { key: string; min: number }[] = []
  for (let i = 104; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = dateKey(d)
    days.push({ key, min: data.dailyLog[key] || 0 })
  }

  const best = Object.entries(data.subjects).sort((a, b) => b[1] - a[1])[0]

  const now = new Date()
  const finals = new Date(data.finals + 'T00:00:00')
  const daysLeft = Math.max(0, Math.ceil((finals.getTime() - now.getTime()) / 86400000))

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">📈 Progress</h2>

        {/* level card */}
        <div className="mt-4 rounded-2xl bg-greeting/60 px-5 py-5 text-center">
          <p className="text-4xl" aria-hidden="true">{lv.i}</p>
          <p className="text-xl font-bold text-foreground">{lv.n}</p>
          <p className="text-sm font-semibold text-greeting-foreground">{xp} XP · {xp} minutes studied</p>
        </div>

        {/* stat tiles */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-track/70 px-4 py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{todayMinutes(data)}m</p>
            <p className="text-xs font-semibold text-brown">Today</p>
          </div>
          <div className="rounded-2xl bg-track/70 px-4 py-4 text-center">
            <p className="text-2xl font-bold text-foreground">🔥 {computeStreak(data.dailyLog)}</p>
            <p className="text-xs font-semibold text-brown">Day streak</p>
          </div>
          <div className="rounded-2xl bg-track/70 px-4 py-4 text-center">
            <p className="text-2xl font-bold text-foreground">{data.sessionsTotal}</p>
            <p className="text-xs font-semibold text-brown">Sessions</p>
          </div>
          <div className="rounded-2xl bg-track/70 px-4 py-4 text-center">
            <p className="text-2xl font-bold text-foreground">📅 {daysLeft}</p>
            <p className="text-xs font-semibold text-brown">Days to finals</p>
          </div>
        </div>

        {/* best subject */}
        {best && (
          <div className="mt-4 rounded-2xl bg-track/70 px-5 py-4">
            <p className="text-sm font-bold text-foreground">🏆 Best subject</p>
            <p className="mt-1 text-base font-semibold text-brown">
              {best[0]} — {Math.round(best[1])} min of honey stored
            </p>
          </div>
        )}

        {/* heatmap */}
        <p className="mt-6 text-sm font-bold text-foreground">🗓️ Heatmap — last 15 weeks</p>
        <div className="mt-2 grid grid-cols-[repeat(15,1fr)] gap-1">
          {days.map(({ key, min }) => (
            <div
              key={key}
              title={`${key}: ${min} min`}
              className="aspect-square rounded-[4px]"
              style={{
                background:
                  min === 0
                    ? 'var(--track)'
                    : min < 15
                      ? '#f7e2a9'
                      : min < 30
                        ? '#f4cf6b'
                        : min < 60
                          ? '#edb84a'
                          : '#c9962f',
              }}
            />
          ))}
        </div>

        {/* subject list */}
        {Object.keys(data.subjects).length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-bold text-foreground">📚 Subjects</p>
            {Object.entries(data.subjects)
              .sort((a, b) => b[1] - a[1])
              .map(([s, m]) => (
                <div key={s} className="mt-2 flex items-center gap-3">
                  <span className="w-24 truncate text-sm font-semibold text-brown">{s}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-track">
                    <div
                      className="h-full rounded-full bg-honey"
                      style={{ width: `${Math.min(100, (m / Math.max(1, best[1])) * 100)}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-sm font-bold tabular-nums text-foreground">
                    {Math.round(m)}m
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
