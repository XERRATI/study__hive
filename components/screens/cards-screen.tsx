'use client'

/**
 * FLASHCARDS — add cards, study them with a tap-to-flip, delete.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { uid } from '@/lib/storage'

export function CardsScreen() {
  const { data, setData, toast } = useApp()
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!front.trim()) return
    setData((d) => ({
      ...d,
      cards: [{ id: uid(), front: front.trim(), back: back.trim() }, ...d.cards],
    }))
    setFront('')
    setBack('')
    toast('Card added 🗂️')
  }

  const remove = (id: string) => setData((d) => ({ ...d, cards: d.cards.filter((c) => c.id !== id) }))

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🗂️ Flashcards</h2>

        <form onSubmit={add} className="mt-4 space-y-2">
          <input
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Front — the question…"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-semibold text-foreground outline-none"
          />
          <input
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back — the answer…"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Add card
          </button>
        </form>

        <div className="mt-5 space-y-3">
          {data.cards.length === 0 && (
            <p className="rounded-2xl bg-track/70 px-5 py-4 text-center text-sm font-semibold text-brown">
              No cards yet — add one above and start reviewing 🐝
            </p>
          )}
          {data.cards.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl bg-track/70">
              <button
                type="button"
                onClick={() => setFlipped((f) => ({ ...f, [c.id]: !f[c.id] }))}
                className="w-full px-5 py-4 text-left"
                style={{ perspective: '600px' }}
              >
                {!flipped[c.id] ? (
                  <p className="text-base font-bold text-foreground">{c.front}</p>
                ) : (
                  <p className="text-base font-medium leading-relaxed text-brown">{c.back || '—'}</p>
                )}
                <p className="mt-2 text-xs font-semibold text-brown">
                  {flipped[c.id] ? 'tap to flip back ↺' : 'tap to reveal answer ↻'}
                </p>
              </button>
              <div className="flex items-center justify-between border-t border-border px-5 py-2">
                <p className="text-xs font-semibold text-brown">
                  {flipped[c.id] ? 'Answer' : 'Question'}
                </p>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label="Delete card"
                  className="text-sm text-brown active:scale-90"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
