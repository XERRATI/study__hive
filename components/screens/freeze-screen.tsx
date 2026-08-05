'use client'

/**
 * FREEZE — press pause on the hive for a day (or a week) without guilt.
 * The streak stays frozen, not broken.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'

export function FreezeScreen() {
  const { data, setData, toast } = useApp()
  const [note, setNote] = useState(data.freeze.note)

  const toggle = () => {
    const on = !data.freeze.on
    setData((d) => ({ ...d, freeze: { on, note } }))
    toast(on ? 'Hive frozen ❄️ — rest well' : 'Hive unfrozen — welcome back 🐝')
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <p className="text-5xl" aria-hidden="true">❄️</p>
        <h2 className="mt-2 text-xl font-bold text-foreground">Freeze</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm font-semibold leading-relaxed text-brown">
          Burned out? Freeze the hive for a day or two. Your streak won&apos;t
          break — it waits for you.
        </p>

        <div
          className={`mx-auto mt-5 max-w-xs rounded-2xl px-6 py-5 ${
            data.freeze.on ? 'bg-[#e8f1fb]' : 'bg-track/70'
          }`}
        >
          <p className="text-base font-bold text-foreground">
            {data.freeze.on ? 'Frozen since you pressed it ❄️' : 'Hive is running 🐝'}
          </p>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why the freeze? (optional)"
            className="mt-3 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none"
          />
        </div>

        <button
          type="button"
          onClick={toggle}
          className={`mt-6 rounded-2xl px-8 py-3 text-lg font-semibold transition-transform active:scale-95 ${
            data.freeze.on
              ? 'bg-honey text-primary-foreground'
              : 'bg-foreground text-background'
          }`}
        >
          {data.freeze.on ? 'Unfreeze the hive' : 'Freeze the hive'}
        </button>
      </div>
    </div>
  )
}
