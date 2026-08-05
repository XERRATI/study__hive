'use client'

/**
 * BEE PUNS — random puns with a heart to favourite your best ones.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { PUNS } from '@/lib/storage'

export function PunsScreen() {
  const { data, setData, toast } = useApp()
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * PUNS.length))
  const pun = PUNS[idx]
  const fav = data.punsFav.includes(pun)

  const toggleFav = () => {
    setData((d) => ({
      ...d,
      punsFav: fav ? d.punsFav.filter((p) => p !== pun) : [...d.punsFav, pun],
    }))
    toast(fav ? 'Unfavoured' : 'Favourite saved 😄')
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <p className="text-5xl" aria-hidden="true">😂</p>
        <h2 className="mt-2 text-xl font-bold text-foreground">Bee Puns</h2>
        <p className="mx-auto mt-4 min-h-16 max-w-xs text-lg font-semibold leading-relaxed text-brown">
          {pun}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % PUNS.length)}
            className="rounded-2xl bg-honey px-6 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Another one
          </button>
          <button
            type="button"
            onClick={toggleFav}
            aria-label="Favourite pun"
            className="rounded-2xl bg-track px-4 py-3 text-xl transition-transform active:scale-125"
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>
        {data.punsFav.length > 0 && (
          <div className="mt-6 rounded-2xl bg-greeting/60 px-5 py-4 text-left">
            <p className="text-sm font-bold text-foreground">Favourites ({data.punsFav.length})</p>
            {data.punsFav.map((p, i) => (
              <p key={i} className="mt-1.5 text-sm font-medium leading-relaxed text-greeting-foreground">
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
