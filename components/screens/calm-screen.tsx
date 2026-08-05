'use client'

/**
 * CALM — a gentle reminder on tap, from the same bank as the PC version.
 */
import { useState } from 'react'
import { CALM_LINES } from '@/lib/storage'

export function CalmScreen() {
  const [line, setLine] = useState(CALM_LINES[0])

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <p className="text-5xl" aria-hidden="true">🆘</p>
        <h2 className="mt-2 text-xl font-bold text-foreground">Calm</h2>
        <p className="mx-auto mt-3 max-w-xs text-lg font-medium leading-relaxed text-brown">{line}</p>
        <button
          type="button"
          onClick={() => setLine(CALM_LINES[Math.floor(Math.random() * CALM_LINES.length)])}
          className="mt-6 rounded-2xl bg-honey px-6 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          Another gentle reminder
        </button>
        <button
          type="button"
          onClick={() => setLine('Breathe with me — in for 4, hold for 4, out for 6. 🌬️')}
          className="mt-3 block w-full text-sm font-semibold text-brown underline underline-offset-4"
        >
          Or try the breathing rhythm →
        </button>
      </div>
    </div>
  )
}
