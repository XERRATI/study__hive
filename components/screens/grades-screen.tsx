'use client'

/**
 * GRADES — log marks per subject, see the average and the red flags.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { uid } from '@/lib/storage'

export function GradesScreen() {
  const { data, setData, toast } = useApp()
  const [subject, setSubject] = useState('')
  const [pct, setPct] = useState('')

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const v = Number(pct)
    if (!subject.trim() || !v || v < 0 || v > 100) return
    setData((d) => ({ ...d, grades: [{ id: uid(), subject: subject.trim(), pct: v }, ...d.grades] }))
    setSubject('')
    setPct('')
    toast('Grade added 📊')
  }

  const remove = (id: string) => setData((d) => ({ ...d, grades: d.grades.filter((g) => g.id !== id) }))

  const avg = data.grades.length
    ? Math.round(data.grades.reduce((a, g) => a + g.pct, 0) / data.grades.length)
    : null

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">📊 Grades</h2>

        <form onSubmit={add} className="mt-4 flex gap-2">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject…"
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-base font-semibold text-foreground outline-none"
          />
          <input
            value={pct}
            onChange={(e) => setPct(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="%"
            inputMode="numeric"
            className="w-20 rounded-2xl border border-border bg-card px-3 py-3 text-center text-base font-semibold text-foreground outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Add
          </button>
        </form>

        {avg !== null && (
          <div className="mt-4 rounded-2xl bg-greeting/60 px-5 py-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {avg}% <span className="text-base font-semibold text-greeting-foreground">average</span>
            </p>
          </div>
        )}

        <div className="mt-4 space-y-2">
          {data.grades.length === 0 && (
            <p className="rounded-2xl bg-track/70 px-5 py-4 text-center text-sm font-semibold text-brown">
              No grades yet — log your latest marks here 🐝
            </p>
          )}
          {data.grades.map((g) => (
            <div key={g.id} className="flex items-center gap-3 rounded-2xl bg-track/70 px-5 py-3.5">
              <span className="flex-1 truncate text-base font-semibold text-foreground">{g.subject}</span>
              <span
                className={`text-lg font-bold tabular-nums ${
                  g.pct >= 70 ? 'text-green-600' : g.pct >= 50 ? 'text-honey-deep' : 'text-[#ef4a2f]'
                }`}
              >
                {g.pct}%
              </span>
              <button
                type="button"
                onClick={() => remove(g.id)}
                aria-label="Delete grade"
                className="text-base text-brown active:scale-90"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
