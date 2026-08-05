'use client'

/**
 * GOAL INDICATOR — the top-right "My Goal" widget.
 * Now matches the app font (Fredoka) and FILLS UP like the PC version:
 * a honey ring that fills as you reach today's goal (Settings → daily goal).
 * Same size/position as before, so the layout is untouched.
 */
import { useApp } from '@/lib/store'
import { goalPct } from '@/lib/storage'

export function GoalIndicator() {
  const { data } = useApp()
  const pct = goalPct(data)
  const r = 28
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(100, Math.max(0, pct)) / 100)

  return (
    <div className="flex flex-col items-end">
      <div className="relative h-[72px] w-[72px]">
        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden="true">
          {/* track */}
          <circle cx="36" cy="36" r={r} fill="none" stroke="var(--track)" strokeWidth="7" />
          {/* honey fill */}
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="var(--honey)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset .6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[17px] font-bold tabular-nums text-foreground">{pct}%</span>
        </div>
      </div>
      <span className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brown">
        My Goal
      </span>
    </div>
  )
}
