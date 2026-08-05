'use client'

/**
 * EXAMS — track exam dates with a live countdown for each one.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { uid } from '@/lib/storage'

export function ExamsScreen() {
  const { data, setData, toast } = useApp()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !date) return
    setData((d) => ({ ...d, exams: [...d.exams, { id: uid(), name: name.trim(), date }] }))
    setName('')
    setDate('')
    toast('Exam added 📅')
  }

  const remove = (id: string) => setData((d) => ({ ...d, exams: d.exams.filter((x) => x.id !== id) }))

  const daysTo = (dateStr: string) => {
    const diff = new Date(dateStr + 'T00:00:00').getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / 86400000))
  }

  const sorted = [...data.exams].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">📅 Exams</h2>

        <form onSubmit={add} className="mt-4 flex flex-col gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exam name… e.g. Maths Paper 2"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-semibold text-foreground outline-none"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
            />
            <button
              type="submit"
              className="rounded-2xl bg-honey px-5 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
            >
              Add
            </button>
          </div>
        </form>

        <div className="mt-5 space-y-2">
          {sorted.length === 0 && (
            <p className="rounded-2xl bg-track/70 px-5 py-4 text-center text-sm font-semibold text-brown">
              No exams yet — add your dates so the hive counts down for you 🐝
            </p>
          )}
          {sorted.map((x) => {
            const d = daysTo(x.date)
            const urgent = d <= 7
            return (
              <div
                key={x.id}
                className="flex items-center gap-3 rounded-2xl bg-track/70 px-5 py-4"
              >
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">{x.name}</p>
                  <p className="text-sm font-semibold text-brown">
                    {new Date(x.date + 'T00:00:00').toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
                <p
                  className={`text-lg font-bold tabular-nums ${
                    urgent ? 'text-[#ef4a2f]' : 'text-honey-deep'
                  }`}
                >
                  {d}d
                </p>
                <button
                  type="button"
                  onClick={() => remove(x.id)}
                  aria-label="Delete exam"
                  className="text-base text-brown active:scale-90"
                >
                  🗑️
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
