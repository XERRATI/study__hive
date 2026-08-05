'use client'

/**
 * SECRETS — hidden whispers from the hive. Tap the 🕵️ a few times…
 * or find the real secrets out in the app. Discovered ones light up.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { SECRETS } from '@/lib/storage'

export function SecretsScreen() {
  const { data, setData, toast } = useApp()
  const [taps, setTaps] = useState(0)

  const tap = () => {
    const n = taps + 1
    setTaps(n)
    if (n >= 5) {
      setTaps(0)
      const found = 'tapped-the-logo'
      if (!data.secretsFound.includes(found)) {
        setData((d) => ({ ...d, secretsFound: [...d.secretsFound, found] }))
        toast('Secret found: the logo tap 👑')
      } else {
        toast('You already found this one 😉')
      }
    }
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <button
          type="button"
          onClick={tap}
          className="mx-auto block text-6xl transition-transform active:scale-90"
          aria-label="Secret"
        >
          🕵️
        </button>
        <p className="mt-2 text-xs font-semibold text-brown">tap… tap… tap…</p>

        <h2 className="mt-4 text-xl font-bold text-foreground">Secrets</h2>
        <p className="mx-auto mt-1 max-w-xs text-sm font-semibold text-brown">
          The hive hides whispers. Tap around the app to find them.
        </p>

        <div className="mt-5 space-y-2 text-left">
          {SECRETS.map((s, i) => {
            const found = data.secretsFound.length > 0 || i < 1
            return (
              <div
                key={i}
                className={`rounded-2xl px-5 py-3.5 ${
                  found ? 'bg-greeting/60' : 'bg-track/40'
                }`}
              >
                <p className={`text-sm font-medium leading-relaxed ${found ? 'text-greeting-foreground' : 'text-brown/50'}`}>
                  {found ? s : '????????' }
                </p>
              </div>
            )
          })}
        </div>
        <p className="mt-4 text-xs font-semibold text-brown">
          {data.secretsFound.length} secret{data.secretsFound.length === 1 ? '' : 's'} found
        </p>
      </div>
    </div>
  )
}
