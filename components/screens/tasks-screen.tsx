'use client'

/**
 * TASKS — add, tick off, delete. Done count feeds the progress line.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { uid } from '@/lib/storage'

export function TasksScreen() {
  const { data, setData, toast } = useApp()
  const [text, setText] = useState('')

  const add = (e: React.FormEvent) => {
    e.preventDefault()
    const v = text.trim()
    if (!v) return
    setData((d) => ({ ...d, todos: [{ id: uid(), text: v, done: false }, ...d.todos] }))
    setText('')
    toast('Task added ✅')
  }

  const toggle = (id: string) =>
    setData((d) => ({
      ...d,
      todos: d.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }))

  const remove = (id: string) =>
    setData((d) => ({ ...d, todos: d.todos.filter((t) => t.id !== id) }))

  const done = data.todos.filter((t) => t.done).length

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">✅ Tasks</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          {done} of {data.todos.length} done
        </p>

        <form onSubmit={add} className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task…"
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-honey px-5 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Add
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {data.todos.length === 0 && (
            <p className="rounded-2xl bg-track/70 px-5 py-4 text-center text-sm font-semibold text-brown">
              No tasks yet — the hive works best with a list 🐝
            </p>
          )}
          {data.todos.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-2xl bg-track/70 px-4 py-3"
            >
              <button
                type="button"
                aria-label={t.done ? 'Mark not done' : 'Mark done'}
                onClick={() => toggle(t.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm ${
                  t.done ? 'border-honey bg-honey text-primary-foreground' : 'border-brown'
                }`}
              >
                {t.done ? '✓' : ''}
              </button>
              <span
                className={`flex-1 text-base font-medium ${
                  t.done ? 'text-brown line-through' : 'text-foreground'
                }`}
              >
                {t.text}
              </span>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label="Delete task"
                className="px-1 text-base text-brown active:scale-90"
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
