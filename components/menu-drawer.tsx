'use client'

/**
 * Menu drawer — slides in from the left when the ☰ button is tapped.
 * Groups everything from the PC version into tappable items:
 * Screens · Study tools · Focus & calm · Fun & secrets · Legal.
 * Matches the honey/cream design tokens; no visual change to the app itself.
 */
import { useEffect } from 'react'
import { useApp, type Screen } from '@/lib/store'

type Item = { s: Screen; icon: string; label: string }
type Section = { title: string; items: Item[] }

const SECTIONS: Section[] = [
  {
    title: 'Screens',
    items: [
      { s: 'home', icon: '🏠', label: 'Home' },
      { s: 'focus', icon: '🎯', label: 'Focus Timer' },
      { s: 'garden', icon: '🌷', label: 'Garden World' },
      { s: 'stats', icon: '📈', label: 'Progress & Stats' },
      { s: 'coach', icon: '🐝', label: 'Hive Coach' },
      { s: 'settings', icon: '⚙️', label: 'Settings' },
    ],
  },
  {
    title: 'Study tools',
    items: [
      { s: 'cards', icon: '🗂️', label: 'Flashcards' },
      { s: 'notes', icon: '📝', label: 'Notes' },
      { s: 'tasks', icon: '✅', label: 'Tasks' },
      { s: 'exams', icon: '📅', label: 'Exams' },
      { s: 'grades', icon: '📊', label: 'Grades' },
      { s: 'vocab', icon: '🔤', label: 'Vocab Bank' },
      { s: 'heatmap', icon: '🗓️', label: 'Heatmap' },
    ],
  },
  {
    title: 'Focus & calm',
    items: [
      { s: 'music', icon: '🎵', label: 'Focus Music' },
      { s: 'breathe', icon: '🌬️', label: 'Breathe' },
      { s: 'calm', icon: '🆘', label: 'Calm' },
      { s: 'pomodoro', icon: '🍅', label: 'Pomodoro' },
      { s: 'freeze', icon: '❄️', label: 'Freeze' },
    ],
  },
  {
    title: 'Fun & secrets',
    items: [
      { s: 'puns', icon: '😂', label: 'Bee Puns' },
      { s: 'challenge', icon: '🎯', label: 'Daily Challenge' },
      { s: 'rival', icon: '⚔️', label: 'Rival Hive' },
      { s: 'capsule', icon: '⏳', label: 'Time Capsule' },
      { s: 'secrets', icon: '🕵️', label: 'Secrets' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { s: 'privacy', icon: '🔒', label: 'Privacy Policy' },
      { s: 'terms', icon: '📜', label: 'Terms of Service' },
      { s: 'creator', icon: '👑', label: 'Meet the Creator' },
    ],
  },
]

export function MenuDrawer() {
  const { drawerOpen, setDrawerOpen, go } = useApp()

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen, setDrawerOpen])

  return (
    <>
      {/* overlay */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      {/* panel */}
      <aside
        role="dialog"
        aria-label="Menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[86vw] flex-col bg-card shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p
            className="text-xl text-foreground"
            style={{ fontFamily: 'var(--font-bubblegum)' }}
          >
            🐝 Study Hive
          </p>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-track text-tile-foreground active:scale-90"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-8 pt-2">
          {SECTIONS.map((sec) => (
            <div key={sec.title}>
              <p className="px-3 pb-1 pt-4 text-[11px] font-bold uppercase tracking-widest text-brown">
                {sec.title}
              </p>
              {sec.items.map((it) => (
                <button
                  key={it.s}
                  type="button"
                  onClick={() => go(it.s)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-base font-semibold text-foreground transition-colors hover:bg-greeting/50 active:scale-[0.98]"
                >
                  <span className="text-lg" aria-hidden="true">
                    {it.icon}
                  </span>
                  <span className="flex-1">{it.label}</span>
                  <span className="text-brown" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}
            </div>
          ))}
          <p className="mt-6 px-3 text-center text-xs font-medium text-brown">
            🍯 Your data stays on this device
          </p>
        </div>
      </aside>
    </>
  )
}
