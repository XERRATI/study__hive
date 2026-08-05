'use client'

/**
 * GOALS screen — the big countdown to finals plus your daily goal
 * progress, streak and totals. Every number is real and live.
 */
import { useEffect, useState } from 'react'
import { useApp } from '@/lib/store'
import { computeStreak, dateKey, todayMinutes } from '@/lib/storage'

export function GoalsScreen() {
  const { data, go } = useApp()
  const [now, setNow] = useState(() => new Date('2026-08-05T00:00:00'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const finals = new Date(data.finals + 'T00:00:00')
  const diffMs = Math.max(0, finals.getTime() - now.getTime())
  const days = Math.floor(diffMs / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)
  const mins = Math.floor((diffMs % 3600000) / 60000)
  const secs = Math.floor((diffMs % 60000) / 1000)

  const today = todayMinutes(data)
  const goal = Math.max(1, data.dailyGoal || 60)
  const pct = Math.min(100, Math.round((today / goal) * 100))
  const streak = computeStreak(data.dailyLog)
  const goalName = data.goalName || 'Finals'

  if (!mounted) return null

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🎯 {goalName}</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          {new Date(data.finals + 'T00:00:00').toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <div className="mt-5 text-center">
          <div className="text-8xl font-bold leading-none text-foreground tabular-nums">{days}</div>
          <div className="mt-2 text-3xl font-bold text-foreground">Days to go</div>
          <div className="mt-2 text-base font-semibold tabular-nums text-brown">
            {String(hours).padStart(2, '0')} : {String(mins).padStart(2, '0')} :{' '}
            {String(secs).padStart(2, '0')}
          </div>
        </div>

        {/* daily goal */}
        <div className="mt-6 rounded-2xl bg-track/70 px-5 py-5">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-foreground">Today's goal</p>
            <p className="text-base font-bold text-honey-deep">
              {today}m / {goal}m
            </p>
          </div>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-honey/40">
            <div
              className="h-full rounded-full bg-honey-deep/70 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold text-brown">{pct}% of today's goal 🍯</p>
        </div>

        {/* quick stats */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-track/70 px-3 py-3">
            <p className="text-2xl font-bold text-foreground">🔥 {streak}</p>
            <p className="text-xs font-semibold text-brown">Day streak</p>
          </div>
          <div className="rounded-2xl bg-track/70 px-3 py-3">
            <p className="text-2xl font-bold text-foreground">{data.sessionsTotal}</p>
            <p className="text-xs font-semibold text-brown">Sessions</p>
          </div>
          <div className="rounded-2xl bg-track/70 px-3 py-3">
            <p className="text-2xl font-bold text-foreground">🍅 {data.pomodoro.doneToday}</p>
            <p className="text-xs font-semibold text-brown">Pomodoros</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => go('focus', { preset: 25, autostart: true })}
          className="mt-5 w-full rounded-2xl bg-honey px-4 py-3 text-lg font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          ▶ Start 25m block
        </button>
      </div>
    </div>
  )
}
