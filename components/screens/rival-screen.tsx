'use client'

/**
 * RIVAL HIVE — friendly competition: set a rival and compare daily minutes.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { todayMinutes } from '@/lib/storage'

export function RivalScreen() {
  const { data, setData, toast } = useApp()
  const [name, setName] = useState(data.rival.name)
  const [theirMin, setTheirMin] = useState(String(data.rival.theirMin))

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setData((d) => ({
      ...d,
      rival: { name: name.trim() || 'Rival', theirMin: Number(theirMin) || 0 },
    }))
    toast('Rival saved ⚔️')
  }

  const mine = todayMinutes(data)
  const theirs = data.rival.theirMin

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">⚔️ Rival Hive</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          Friendly pressure — beat your rival today
        </p>

        <form onSubmit={save} className="mt-4 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rival name…"
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-base font-semibold text-foreground outline-none"
          />
          <input
            value={theirMin}
            onChange={(e) => setTheirMin(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="min"
            inputMode="numeric"
            className="w-24 rounded-2xl border border-border bg-card px-3 py-3 text-center text-base font-semibold text-foreground outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Save
          </button>
        </form>

        {data.rival.name && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-track/70 px-5 py-4">
              <p className="text-base font-bold text-foreground">🐝 You</p>
              <p className="text-xl font-bold tabular-nums text-honey-deep">{mine} min</p>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-track/70 px-5 py-4">
              <p className="text-base font-bold text-foreground">⚔️ {data.rival.name}</p>
              <p className="text-xl font-bold tabular-nums text-brown">{theirs} min</p>
            </div>
            <p className="text-center text-sm font-bold text-brown">
              {mine >= theirs
                ? mine === theirs
                  ? 'Dead even — one more block to pull ahead!'
                  : 'You are ahead today 🏆'
                : `They are ahead — ${theirs - mine} min to close. Go! 🔥`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
