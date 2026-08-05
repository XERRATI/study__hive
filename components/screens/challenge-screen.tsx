'use client'

/**
 * DAILY CHALLENGE — one small study challenge a day. Marking it done
 * adds to your challenge streak.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { CHALLENGES, dateKey } from '@/lib/storage'

export function ChallengeScreen() {
  const { data, setData, toast } = useApp()
  const today = dateKey()
  const isToday = data.challenge.lastDate === today
  const challenge = CHALLENGES[Math.abs(hash(today)) % CHALLENGES.length]

  function hash(s: string) {
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
    return h
  }

  const [doneToday, setDoneToday] = useState(isToday)

  const complete = () => {
    setData((d) => ({
      ...d,
      challenge: { lastDate: today, done: d.challenge.done + 1 },
    }))
    setDoneToday(true)
    toast('Challenge complete 🏅')
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8 text-center">
        <p className="text-5xl" aria-hidden="true">🎯</p>
        <h2 className="mt-2 text-xl font-bold text-foreground">Daily Challenge</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          {data.challenge.done} challenges completed
        </p>

        <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-greeting/60 px-6 py-6">
          <p className="text-lg font-bold leading-relaxed text-foreground">{challenge}</p>
        </div>

        <button
          type="button"
          disabled={doneToday}
          onClick={complete}
          className="mt-6 rounded-2xl bg-honey px-8 py-3 text-lg font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
        >
          {doneToday ? 'Done for today ✅' : 'I did it! 🏅'}
        </button>

        <p className="mt-4 text-sm font-semibold text-brown">
          A new challenge lands every morning. One small win beats a big plan.
        </p>
      </div>
    </div>
  )
}
