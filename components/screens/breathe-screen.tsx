'use client'

/**
 * BREATHE — a 4-4-6 box breathing rhythm with a growing circle.
 */
import { useEffect, useRef, useState } from 'react'

const PHASES = [
  { word: 'Breathe in', secs: 4, scale: 1.35 },
  { word: 'Hold', secs: 4, scale: 1.35 },
  { word: 'Breathe out', secs: 6, scale: 0.85 },
]

export function BreatheScreen() {
  const [on, setOn] = useState(false)
  const [phase, setPhase] = useState(0)
  const [scale, setScale] = useState(0.85)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!on) return
    setPhase(0)
    setScale(PHASES[0].scale)
    const run = (i: number) => {
      const p = PHASES[i % PHASES.length]
      setPhase(i % PHASES.length)
      setScale(p.scale)
      timer.current = setTimeout(() => run(i + 1), p.secs * 1000)
    }
    run(0)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [on])

  const p = PHASES[phase]

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <h2 className="text-xl font-bold text-foreground">🌬️ Breathe</h2>
        <p className="mt-1 text-sm font-semibold text-brown">4 seconds in · 4 hold · 6 out</p>

        <div className="mx-auto mt-8 flex h-56 w-56 items-center justify-center">
          <div
            className="flex h-44 w-44 items-center justify-center rounded-full bg-greeting/70 transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${scale})` }}
          >
            <p className="px-6 text-xl font-bold text-greeting-foreground">{p.word}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className="mt-8 rounded-2xl bg-honey px-8 py-3 text-lg font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          {on ? '⏹ Stop' : '▶ Start the rhythm'}
        </button>
      </div>
    </div>
  )
}
