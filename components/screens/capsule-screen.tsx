'use client'

/**
 * TIME CAPSULE — write a message to future-you. It stays sealed until
 * the open date, then it unlocks with a countdown.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'

export function CapsuleScreen() {
  const { data, setData, toast } = useApp()
  const [msg, setMsg] = useState('')
  const [openDate, setOpenDate] = useState('')

  const hasCapsule = !!data.capsule.msg && !!data.capsule.openDate
  const now = new Date()
  const open = new Date(data.capsule.openDate + 'T00:00:00')
  const sealed = hasCapsule && open.getTime() > now.getTime()
  const daysLeft = hasCapsule
    ? Math.max(0, Math.ceil((open.getTime() - now.getTime()) / 86400000))
    : 0

  const plant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim() || !openDate) return
    setData((d) => ({ ...d, capsule: { msg: msg.trim(), openDate } }))
    setMsg('')
    setOpenDate('')
    toast('Capsule sealed ⏳')
  }

  const destroy = () => {
    if (confirm('Destroy the capsule? The message will be lost.')) {
      setData((d) => ({ ...d, capsule: { msg: '', openDate: '' } }))
      toast('Capsule destroyed')
    }
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">⏳ Time Capsule</h2>

        {!hasCapsule ? (
          <form onSubmit={plant} className="mt-4 space-y-2">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="A message to future-you…"
              rows={4}
              className="w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
            />
            <input
              type="date"
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
            >
              Seal the capsule
            </button>
          </form>
        ) : (
          <div className="mt-4 text-center">
            {sealed ? (
              <>
                <p className="text-5xl" aria-hidden="true">📦</p>
                <p className="mt-3 text-lg font-bold text-foreground">
                  Sealed · opens in {daysLeft} day{daysLeft === 1 ? '' : 's'}
                </p>
                <p className="mt-1 text-sm font-semibold text-brown">
                  {new Date(open.getTime()).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="mx-auto mt-4 max-w-xs rounded-2xl bg-track/70 px-5 py-4 text-sm font-medium leading-relaxed text-brown">
                  🔒 {data.capsule.msg}
                </p>
              </>
            ) : (
              <>
                <p className="text-5xl" aria-hidden="true">💌</p>
                <p className="mt-3 text-lg font-bold text-foreground">Your capsule is open</p>
                <p className="mx-auto mt-3 max-w-xs rounded-2xl bg-greeting/60 px-5 py-4 text-base font-medium leading-relaxed text-greeting-foreground">
                  {data.capsule.msg}
                </p>
                <p className="mt-2 text-xs font-semibold text-brown">Future-you says hi 👋</p>
              </>
            )}
            <button
              type="button"
              onClick={destroy}
              className="mt-5 text-sm font-semibold text-[#ef4a2f] underline underline-offset-4"
            >
              Destroy capsule
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
