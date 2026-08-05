'use client'

/**
 * NOTES — write quick study notes, stored on device.
 */
import { useState } from 'react'
import { useApp } from '@/lib/store'
import { uid } from '@/lib/storage'

export function NotesScreen() {
  const { data, setData, toast } = useApp()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editing, setEditing] = useState<string | null>(null)

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    if (editing) {
      setData((d) => ({
        ...d,
        notes: d.notes.map((n) =>
          n.id === editing ? { ...n, title: title.trim(), body: body.trim() } : n,
        ),
      }))
      toast('Note updated 📝')
    } else {
      setData((d) => ({
        ...d,
        notes: [{ id: uid(), title: title.trim(), body: body.trim(), ts: Date.now() }, ...d.notes],
      }))
      toast('Note saved 📝')
    }
    setTitle('')
    setBody('')
    setEditing(null)
  }

  const remove = (id: string) => setData((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== id) }))

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">📝 Notes</h2>

        <form onSubmit={save} className="mt-4 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title…"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-semibold text-foreground outline-none"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write it down before it buzzes away…"
            rows={3}
            className="w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            {editing ? 'Update note' : 'Save note'}
          </button>
        </form>

        <div className="mt-5 space-y-3">
          {data.notes.length === 0 && (
            <p className="rounded-2xl bg-track/70 px-5 py-4 text-center text-sm font-semibold text-brown">
              No notes yet — capture your first idea above 🐝
            </p>
          )}
          {data.notes.map((n) => (
            <div key={n.id} className="rounded-2xl bg-track/70 px-5 py-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-bold text-foreground">{n.title}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Edit note"
                    onClick={() => {
                      setEditing(n.id)
                      setTitle(n.title)
                      setBody(n.body)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="text-sm text-brown active:scale-90"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    aria-label="Delete note"
                    onClick={() => remove(n.id)}
                    className="text-sm text-brown active:scale-90"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {n.body && (
                <p className="mt-1 whitespace-pre-wrap text-sm font-medium leading-relaxed text-brown">
                  {n.body}
                </p>
              )}
              <p className="mt-2 text-xs font-semibold text-brown/70">
                {new Date(n.ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
