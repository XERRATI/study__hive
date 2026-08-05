'use client'

/**
 * HONEY screen — your subjects as honeycomb cells. Each cell's honey
 * fill is the minutes you studied that subject. Tap a cell for details.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'

function Hex({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 115.47" className={className} aria-hidden="true" fill="none">
      <polygon
        points="50,2 97,28.8 97,86.6 50,113.4 3,86.6 3,28.8"
        stroke="var(--hex-line)"
        strokeWidth="2.5"
      />
    </svg>
  )
}

export function HiveScreen() {
  const { data } = useApp()
  const [selected, setSelected] = useState<string | null>(null)

  const entries = Object.entries(data.subjects)
    .map(([name, min]) => ({ name, min }))
    .sort((a, b) => b.min - a.min)
  const maxMin = Math.max(1, ...entries.map((e) => e.min))
  const total = Math.round(entries.reduce((a, e) => a + e.min, 0))
  const detail = entries.find((e) => e.name === selected)

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🍯 Inside the Hive</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          Every cell is one of your subjects. The honey inside is the time you stored there.
        </p>
        <p className="mt-2 text-lg font-bold text-honey-deep">{total} min stored</p>
      </div>

      {/* honeycomb */}
      <div className="mt-5 flex flex-wrap items-start justify-center gap-x-3 gap-y-2 px-5">
        {entries.map((s, i) => {
          const pct = Math.max(8, Math.round((s.min / maxMin) * 100))
          const offset = i % 2 === 1 ? 'mt-5' : ''
          return (
            <button
              key={s.name}
              type="button"
              onClick={() => setSelected(s.name)}
              className={`relative flex h-[118px] w-[104px] items-center justify-center ${offset}`}
              style={{ clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' }}
            >
              <Hex className="absolute inset-0 h-full w-full" />
              {/* honey fill */}
              <span
                className="absolute bottom-0 left-1/2 w-[96px] -translate-x-1/2 rounded-b-[34px] bg-honey/70"
                style={{ height: `${pct}%`, clipPath: 'polygon(0 100%, 50% 0, 100% 100%)', transform: 'translateX(-50%)' }}
              />
              <span className="relative z-10 text-center">
                <span className="block text-2xl" aria-hidden="true">
                  {s.name === 'Pomodoro' ? '🍅' : '📚'}
                </span>
                <span className="block max-w-[86px] truncate text-sm font-bold text-foreground">
                  {s.name}
                </span>
                <span className="block text-xs font-semibold text-brown">
                  {Math.round(s.min)} min
                </span>
              </span>
            </button>
          )
        })}
      </div>
      {entries.length === 0 && (
        <p className="px-7 pb-4 text-center text-sm font-semibold text-brown">
          No subjects yet — finish a focus block and they'll grow here 🐝
        </p>
      )}

      {/* cell detail */}
      {detail && (
        <div className="mx-7 mt-6 rounded-2xl bg-greeting/60 px-5 py-4">
          <p className="text-base font-bold text-foreground">📚 {detail.name}</p>
          <p className="mt-1 text-sm font-medium text-greeting-foreground">
            {Math.round(detail.min)} min of honey stored ·{' '}
            {Math.round((detail.min / maxMin) * 100)}% of your fullest cell
          </p>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-honey/40">
            <div
              className="h-full rounded-full bg-honey-deep/70"
              style={{ width: `${Math.max(4, (detail.min / maxMin) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-brown">
            {detail.min < 60
              ? 'Tip: a 15-min block today would fill this cell nicely 🐝'
              : 'Tip: keep stacking — this cell is getting heavy with honey 🍯'}
          </p>
        </div>
      )}
    </div>
  )
}
