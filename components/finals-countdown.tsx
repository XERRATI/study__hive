'use client'

/**
 * PLACEHOLDER component — swap in your real components/finals-countdown.tsx.
 * Counts down to a target date. Set TARGET to your real finals date.
 */
import { useEffect, useState } from 'react'

// 👇 set your real finals date here
const TARGET = new Date('2026-10-26T00:00:00')

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    mins: Math.floor((ms / 60000) % 60),
    secs: Math.floor((ms / 1000) % 60),
  }
}

export function FinalsCountdown() {
  const [d, setD] = useState(() => diff(TARGET))

  useEffect(() => {
    const t = setInterval(() => setD(diff(TARGET)), 1000)
    return () => clearInterval(t)
  }, [])

  const tiles = [
    [d.days, 'DAYS'],
    [d.hours, 'HOURS'],
    [d.mins, 'MIN'],
    [d.secs, 'SEC'],
  ] as const

  return (
    <div className="flex items-stretch justify-center gap-2 px-4">
      {tiles.map(([value, label]) => (
        <div
          key={label}
          className="flex w-16 flex-col items-center rounded-2xl bg-tile px-2 py-3 text-tile-foreground"
        >
          <span className="text-2xl font-bold tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-[11px] font-semibold tracking-wide">{label}</span>
        </div>
      ))}
    </div>
  )
}
