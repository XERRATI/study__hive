'use client'

/**
 * Bottom nav — your original design (Home · Honey · Goals · Garden ·
 * Coach · Stats), now WIRED: tapping switches screens, and the current
 * one is highlighted with a soft honey pill. Sticky so it follows you.
 */
import { useApp, type Screen } from '@/lib/store'

const ITEMS: { emoji: string; label: string; screen: Screen }[] = [
  { emoji: '🏠', label: 'Home', screen: 'home' },
  { emoji: '🍯', label: 'Honey', screen: 'hive' },
  { emoji: '🎯', label: 'Goals', screen: 'goals' },
  { emoji: '🌷', label: 'Garden', screen: 'garden' },
  { emoji: '🐝', label: 'Coach', screen: 'coach' },
  { emoji: '📈', label: 'Stats', screen: 'stats' },
]

export function BottomNav() {
  const { screen, go } = useApp()

  return (
    <nav
      aria-label="Primary"
      className="mx-4 mb-4 flex items-center justify-between rounded-3xl bg-card px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
    >
      {ITEMS.map((item) => {
        const active = screen === item.screen
        return (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            onClick={() => go(item.screen)}
            className={`flex flex-col items-center gap-0.5 rounded-2xl px-2 py-1 text-2xl leading-none transition-transform hover:-translate-y-0.5 active:scale-90 ${
              active ? 'bg-greeting text-greeting-foreground' : 'text-foreground'
            }`}
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
