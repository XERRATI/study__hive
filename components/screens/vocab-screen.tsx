'use client'

/**
 * VOCAB BANK — add words, tap to reveal the meaning, mark as known.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { uid } from '@/lib/storage'

export function VocabScreen() {
  const { data, setData, toast } = useApp()
  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!word.trim() || !meaning.trim()) return
    setData((d) => ({
      ...d,
      vocab: [{ id: uid(), word: word.trim(), meaning: meaning.trim(), known: false }, ...d.vocab],
    }))
    setWord('')
    setMeaning('')
    toast('Word added 🔤')
  }

  const markKnown = (id: string) =>
    setData((d) => ({ ...d, vocab: d.vocab.map((v) => (v.id === id ? { ...v, known: !v.known } : v)) }))

  const remove = (id: string) => setData((d) => ({ ...d, vocab: d.vocab.filter((v) => v.id !== id) }))

  const knownCount = data.vocab.filter((v) => v.known).length

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🔤 Vocab Bank</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          {knownCount} of {data.vocab.length} words known
        </p>

        <form onSubmit={add} className="mt-4 space-y-2">
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Word…"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-semibold text-foreground outline-none"
          />
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="Meaning…"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Add word
          </button>
        </form>

        <div className="mt-5 space-y-2">
          {data.vocab.length === 0 && (
            <p className="rounded-2xl bg-track/70 px-5 py-4 text-center text-sm font-semibold text-brown">
              No words yet — build your bank one word at a time 🐝
            </p>
          )}
          {data.vocab.map((v) => (
            <div key={v.id} className="rounded-2xl bg-track/70 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => markKnown(v.id)}
                  aria-label="Mark known"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${
                    v.known ? 'border-honey bg-honey text-primary-foreground' : 'border-brown'
                  }`}
                >
                  {v.known ? '✓' : ''}
                </button>
                <p className={`flex-1 text-base font-bold ${v.known ? 'text-brown line-through' : 'text-foreground'}`}>
                  {v.word}
                </p>
                <button
                  type="button"
                  onClick={() => remove(v.id)}
                  aria-label="Delete word"
                  className="text-sm text-brown active:scale-90"
                >
                  🗑️
                </button>
              </div>
              {v.meaning && (
                <p className="mt-1.5 pl-9 text-sm font-medium leading-relaxed text-brown">
                  {v.meaning}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
