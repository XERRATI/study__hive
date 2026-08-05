'use client'

/**
 * POMODORO — classic rounds: 25m focus / 5m break, 4 rounds, then a long break.
 * Finished focus rounds are logged as study minutes.
 */
import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/lib/store'
import { dateKey } from '@/lib/storage'

const FOCUS = 25 * 60
const BREAK = 5 * 60
const LONG = 15 * 60
const ROUNDS = 4

export function PomodoroScreen() {
  const { data, setData, toast } = useApp()
  const [onBreak, setOnBreak] = useState(false)
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(FOCUS)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundRef = useRef(data.pomodoro.round)

  useEffect(() => {
    if (!running) return
    interval.current = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => {
      if (interval.current) clearInterval(interval.current)
    }
  }, [running])

  /* completion watcher — side effects live here, not inside the updater */
  useEffect(() => {
    if (!running || remaining !== 0) return
    if (!onBreak) {
      // focus round finished → log 25 minutes
      const key = dateKey()
      const round = roundRef.current + 1
      roundRef.current = round
      setData((d) => ({
        ...d,
        dailyLog: { ...d.dailyLog, [key]: (d.dailyLog[key] || 0) + 25 },
        subjects: { ...d.subjects, Pomodoro: (d.subjects.Pomodoro || 0) + 25 },
        sessionsTotal: d.sessionsTotal + 1,
        pomodoro: {
          ...d.pomodoro,
          round,
          doneToday: d.pomodoro.doneToday + 1,
        },
      }))
      toast('Pomodoro done — 25 min logged 🍅')
      setOnBreak(true)
      setRemaining(round % ROUNDS === 0 ? LONG : BREAK)
    } else {
      setOnBreak(false)
      setRemaining(FOCUS)
      toast('Break over — back to the hive 🐝')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, running, onBreak])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <h2 className="text-xl font-bold text-foreground">🍅 Pomodoro</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          {onBreak ? 'Break time — rest is part of the work' : 'Focus round'}
        </p>

        <p
          className="mt-4 text-7xl font-bold tabular-nums leading-none text-foreground"
          style={{ fontFamily: 'var(--font-bubblegum)' }}
        >
          {mm}
          <span className="text-honey">:</span>
          {ss}
        </p>

        {/* round dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${
                i < (data.pomodoro.round % ROUNDS === 0 && data.pomodoro.round > 0 ? ROUNDS : data.pomodoro.round % ROUNDS)
                  ? 'bg-honey'
                  : 'bg-track'
              }`}
            />
          ))}
          <span className="ml-1 text-sm font-semibold text-brown">
            {data.pomodoro.doneToday} done today
          </span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="rounded-2xl bg-honey px-8 py-3 text-lg font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false)
              setOnBreak(false)
              setRemaining(FOCUS)
            }}
            className="rounded-2xl bg-track px-6 py-3 text-lg font-semibold text-tile-foreground transition-transform active:scale-95"
          >
            ⏹ Reset
          </button>
        </div>

        <p className="mt-5 text-sm font-semibold text-brown">
          {ROUNDS} rounds · focus rounds log 25 minutes to your stats
        </p>
      </div>
    </div>
  )
}
