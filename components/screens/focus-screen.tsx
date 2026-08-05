'use client'

/**
 * FOCUS screen — a real working focus timer.
 * Presets 15/25/45, start / pause / stop, +5 min, subject picker.
 * Finished sessions are logged to the hive: daily minutes, subject
 * minutes, sessions count, streak — feeding Stats, Garden, Heatmap, Coach.
 */
import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/lib/store'
import { dateKey, FLOWERS } from '@/lib/storage'

const PRESETS = [15, 25, 45]

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 880
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.45)
    setTimeout(() => ctx.close(), 800)
  } catch {
    /* audio unavailable */
  }
}

export function FocusScreen() {
  const { data, setData, params, toast } = useApp()
  const initialPreset = typeof params.preset === 'number' ? params.preset : 25
  const [mins, setMins] = useState(initialPreset)
  const [remaining, setRemaining] = useState(initialPreset * 60)
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [subject, setSubject] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = mins * 60

  useEffect(() => {
    setRemaining(mins * 60)
  }, [mins])

  useEffect(() => {
    if (typeof params.autostart === 'boolean' && params.autostart) {
      start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!running || paused) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, paused])

  /* completion watcher — side effects live here, not inside the updater */
  useEffect(() => {
    if (running && !paused && remaining === 0) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, running, paused])

  function finish() {
    stopTimer()
    const key = dateKey()
    const sub = subject.trim() || 'General'
    setData((d) => ({
      ...d,
      dailyLog: { ...d.dailyLog, [key]: (d.dailyLog[key] || 0) + mins },
      subjects: { ...d.subjects, [sub]: (d.subjects[sub] || 0) + mins },
      sessionsTotal: d.sessionsTotal + 1,
    }))
    beep()
    toast(`Session complete — ${mins} min logged to ${sub} 🍯`)
  }

  function stopTimer() {
    setRunning(false)
    setPaused(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function start() {
    if (remaining <= 0) setRemaining(mins * 60)
    setRunning(true)
    setPaused(false)
  }

  function stopAndReset() {
    stopTimer()
    setRemaining(mins * 60)
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const pct = total ? Math.max(0, Math.min(100, ((total - remaining) / total) * 100)) : 0

  const subjectNames = Object.keys(data.subjects).sort()

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <h2 className="text-xl font-bold text-foreground">
          🎯 Focus Timer
        </h2>
        <p
          className="mt-3 text-7xl font-bold tabular-nums leading-none text-foreground"
          style={{ fontFamily: 'var(--font-bubblegum)' }}
        >
          {mm}
          <span className="text-honey">:</span>
          {ss}
        </p>
        <p className="mt-2 text-sm font-semibold text-brown">
          {running ? (paused ? 'Paused — resume when ready' : 'Locked in — keep going 🐝') : 'Ready when you are'}
        </p>

        {/* progress */}
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-track">
          <div
            className="h-full rounded-full bg-honey transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* presets */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              disabled={running}
              onClick={() => setMins(p)}
              className={`rounded-2xl px-5 py-2 text-base font-semibold transition-transform active:scale-95 ${
                mins === p ? 'bg-honey text-primary-foreground' : 'bg-track text-tile-foreground'
              }`}
            >
              {p}m
            </button>
          ))}
        </div>

        {/* subject */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <label htmlFor="focusSubject" className="text-sm font-semibold text-brown">
            Subject
          </label>
          <select
            id="focusSubject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground outline-none"
          >
            <option value="">General</option>
            {subjectNames.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {!running ? (
            <button
              type="button"
              onClick={start}
              className="rounded-2xl bg-honey px-8 py-3 text-lg font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              ▶ Start
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="rounded-2xl bg-honey px-8 py-3 text-lg font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95"
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}
          <button
            type="button"
            onClick={stopAndReset}
            className="rounded-2xl bg-track px-6 py-3 text-lg font-semibold text-tile-foreground transition-transform active:scale-95"
          >
            ⏹ Stop
          </button>
          <button
            type="button"
            disabled={!running}
            onClick={() => setRemaining((r) => r + 300)}
            className="rounded-2xl bg-track px-4 py-3 text-lg font-semibold text-tile-foreground transition-transform active:scale-95 disabled:opacity-40"
          >
            +5
          </button>
        </div>

        <p className="mt-6 text-sm font-semibold text-brown">
          Finish a block and the minutes flow into your stats, garden & heatmap 🌷
        </p>

        {/* today so far */}
        <div className="mx-auto mt-5 flex max-w-xs items-center justify-around rounded-2xl bg-track/70 px-4 py-3">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {data.dailyLog[dateKey()] || 0}m
            </p>
            <p className="text-xs font-semibold text-brown">Today</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {FLOWERS.filter((f) => (data.dailyLog[dateKey()] || 0) >= f.min).length}
            </p>
            <p className="text-xs font-semibold text-brown">Flowers today</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{data.sessionsTotal}</p>
            <p className="text-xs font-semibold text-brown">Sessions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
