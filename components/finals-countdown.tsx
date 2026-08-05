'use client'

/**
 * Finals countdown — same design as the original, but LIVE:
 * days/hours/mins/secs tick down to the finals date you set in
 * Settings, "total hrs" is your real studied time, and the progress
 * bar fills as finals get closer.
 */
import { useEffect, useState } from 'react'
import { useApp } from '@/lib/store'
import { totalMinutes } from '@/lib/storage'

const DAY_SPAN = 90 // the bar assumes a 90-day run-up to finals

export function FinalsCountdown() {
  const { data } = useApp()
  const [now, setNow] = useState(() => new Date('2026-08-05T00:00:00'))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  /* avoid hydration mismatch: server renders the static shell only */
  if (!mounted) {
    return (
      <section className="px-7 pt-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-bold leading-none text-foreground">Finals</h2>
            <p className="mt-2 text-base font-medium text-foreground/90">Countdown to finals</p>
          </div>
          <img
            src="/images/beehive.png"
            alt="Hanging beehive"
            className="h-24 w-auto shrink-0 -translate-y-1"
          />
        </div>
        <div className="mt-6 text-center">
          <div className="text-8xl font-bold leading-none text-foreground">—</div>
          <div className="mt-2 text-3xl font-bold text-foreground">Days to go</div>
        </div>
        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-honey">
          <div className="h-full rounded-full bg-honey-deep/70" style={{ width: '0%' }} />
        </div>
        <div className="mt-5 grid grid-cols-4 gap-3">
          {['hours', 'total hrs', 'mins', 'secs'].map((label) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-2xl bg-tile px-1 py-3 text-tile-foreground"
            >
              <span className="text-3xl font-bold leading-none">—</span>
              <span className="mt-1 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const finals = new Date(data.finals + 'T00:00:00')
  const diffMs = Math.max(0, finals.getTime() - now.getTime())
  const days = Math.floor(diffMs / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)
  const mins = Math.floor((diffMs % 3600000) / 60000)
  const secs = Math.floor((diffMs % 60000) / 1000)
  const totalHrs = Math.round(totalMinutes(data) / 60)
  const pct = Math.max(0, Math.min(100, Math.round((1 - diffMs / (DAY_SPAN * 86400000)) * 100)))

  const STATS = [
    { value: String(hours), label: 'hours' },
    { value: String(totalHrs), label: 'total hrs' },
    { value: String(mins), label: 'mins' },
    { value: String(secs), label: 'secs' },
  ]

  return (
    <section className="px-7 pt-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold leading-none text-foreground">Finals</h2>
          <p className="mt-2 text-base font-medium text-foreground/90">Countdown to finals</p>
        </div>
        <img
          src="/images/beehive.png"
          alt="Hanging beehive"
          className="h-24 w-auto shrink-0 -translate-y-1"
        />
      </div>

      <div className="mt-6 text-center">
        <div className="text-8xl font-bold leading-none text-foreground">{days}</div>
        <div className="mt-2 text-3xl font-bold text-foreground">Days to go</div>
      </div>

      {/* progress bar */}
      <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-honey">
        <div className="h-full rounded-full bg-honey-deep/70" style={{ width: `${pct}%` }} />
      </div>

      {/* stat tiles */}
      <div className="mt-5 grid grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center rounded-2xl bg-tile px-1 py-3 text-tile-foreground"
          >
            <span className="text-3xl font-bold leading-none tabular-nums">{s.value}</span>
            <span className="mt-1 text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
