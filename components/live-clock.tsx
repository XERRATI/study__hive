'use client'

/**
 * PLACEHOLDER component — swap in your real components/live-clock.tsx.
 * Shows the current time (updates every second) in the Bubblegum font.
 */
import { useEffect, useState } from 'react'

export function LiveClock() {
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  const day = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="text-center">
      <p
        className="text-6xl font-bold leading-none text-foreground"
        style={{ fontFamily: 'var(--font-bubblegum)' }}
      >
        {hh}
        <span className="text-honey">:</span>
        {mm}
      </p>
      <p className="mt-2 text-base font-semibold text-brown">
        {ss} · {day}
      </p>
    </div>
  )
}
