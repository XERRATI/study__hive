'use client'

/**
 * Bottom nav — sticky, so it follows the person as they scroll and is
 * always visible. Switches between the main screens.
 */
import { useApp, type Screen } from '@/lib/store'

const ITEMS: { id: Screen; icon: string; label: string }[] = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'focus', icon: '🎯', label: 'Focus' },
  { id: 'garden', icon: '🌷', label: 'Garden' },
  { id: 'stats', icon: '📈', label: 'Stats' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
]

export function BottomNav() {
  const { screen, go } = useApp()

  return (
    <nav
      aria-label="Bottom navigation"
      className="mx-3 flex items-center justify-around rounded-3xl bg-card px-2 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] ring-1 ring-border"
    >
      {ITEMS.map(({ id, icon, label }) => {
        const active = screen === id
        return (
          <button
            key={id}
            type="button"
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            onClick={() => go(id)}
            className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition-all active:scale-90 ${
              active ? 'bg-greeting text-greeting-foreground' : 'text-brown'
            }`}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              {icon}
            </span>
            <span className="text-[10px] font-semibold">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
