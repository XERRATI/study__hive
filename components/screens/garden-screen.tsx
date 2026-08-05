'use client'

/**
 * GARDEN WORLD — every studied minute grows a flower (60 → 420 min).
 * Water adds a journal line, and you can plant study intentions.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { FLOWERS, JOURNAL_LINES, totalMinutes } from '@/lib/storage'

export function GardenScreen() {
  const { data, setData, toast } = useApp()
  const [intent, setIntent] = useState('')
  const total = totalMinutes(data)

  const water = () => {
    const line = JOURNAL_LINES[Math.floor(Math.random() * JOURNAL_LINES.length)]
    setData((d) => ({
      ...d,
      garden: {
        ...d.garden,
        journal: [line, ...d.garden.journal].slice(0, 8),
        wateredToday: d.garden.wateredToday + 1,
      },
    }))
    toast('Watered 💧')
  }

  const plantIntent = (e: React.FormEvent) => {
    e.preventDefault()
    const v = intent.trim()
    if (!v) return
    setData((d) => ({
      ...d,
      garden: { ...d.garden, intents: [v, ...d.garden.intents].slice(0, 12) },
    }))
    setIntent('')
    toast('Intent planted 🌱')
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🌷 Garden World</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          Watered by {total} focused minutes
        </p>

        {/* flowers */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {FLOWERS.map((f) => {
            const grown = total >= f.min
            const pct = Math.min(100, Math.round((total / f.min) * 100))
            return (
              <div
                key={f.name}
                className="rounded-2xl bg-track/70 px-3 py-4 text-center"
              >
                <p className={`text-3xl ${grown ? '' : 'opacity-35 grayscale'}`} aria-hidden="true">
                  {f.icon}
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">{f.name}</p>
                <p className="text-xs font-semibold text-brown">{f.min} min</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${grown ? 100 : pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* actions */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={water}
            className="flex-1 rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            💧 Water
          </button>
        </div>

        {/* plant an intention */}
        <form onSubmit={plantIntent} className="mt-4 flex gap-2">
          <input
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Plant an intention… e.g. finish 5 past papers"
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-track px-4 py-3 text-base font-semibold text-tile-foreground transition-transform active:scale-95"
          >
            🌱
          </button>
        </form>

        {/* intentions */}
        {data.garden.intents.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-bold text-foreground">Planted intentions</p>
            {data.garden.intents.map((i, idx) => (
              <p key={idx} className="mt-1.5 text-sm font-medium text-brown">
                🌱 {i}
              </p>
            ))}
          </div>
        )}

        {/* journal */}
        <div className="mt-5 rounded-2xl bg-greeting/60 px-5 py-4">
          <p className="text-sm font-bold text-foreground">📔 Garden journal</p>
          {data.garden.journal.length ? (
            data.garden.journal.map((l, i) => (
              <p key={i} className="mt-1.5 text-sm font-medium leading-relaxed text-greeting-foreground">
                {l}
              </p>
            ))
          ) : (
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-greeting-foreground">
              &quot;Every minute grows something.&quot; — the Queen
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
