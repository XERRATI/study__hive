'use client'

/**
 * App shell — the persistent frame of the mobile layout:
 *  · top bar (☰ menu + goal indicator) — sticky, always reachable
 *  · the current screen
 *  · bottom nav — sticky, always visible while scrolling
 *  · the menu drawer overlay
 */
import { CustomBee } from '@/components/custom-bee'
import { MenuButton } from '@/components/menu-button'
import { MenuDrawer } from '@/components/menu-drawer'
import { BottomNav } from '@/components/bottom-nav'
import { ScreenRouter } from '@/components/screen-router'
import { useApp } from '@/lib/store'
import { goalPct } from '@/lib/storage'

export function AppShell() {
  const { data } = useApp()
  const pct = goalPct(data)

  return (
    <>
      {/* Custom animated bee slot — another coder can swap this out.
          Edit components/custom-bee.tsx to drop in your own animated bee. */}
      <CustomBee className="pointer-events-none absolute left-[-6px] top-[360px] z-20 -rotate-12" />

      {/* ---- Top bar (sticky so the menu is never lost) ---- */}
      <header className="sticky top-0 z-30 flex items-start justify-between bg-background/85 px-5 pb-2 pt-6 backdrop-blur-sm">
        <MenuButton />
        {/* Bubble-gum styled goal indicator — now wired to real progress:
            % of today's goal reached (Settings → daily goal). */}
        <div
          className="text-right leading-[1.15]"
          style={{ fontFamily: 'var(--font-bubblegum)' }}
        >
          <p
            className="text-[32px] text-transparent"
            style={{
              WebkitTextStroke: '2px rgba(210,4,45,0.85)',
              filter: 'drop-shadow(0 2px 4px rgba(210,4,45,0.25))',
            }}
          >
            {pct} %
          </p>
          <p
            className="text-[32px] text-transparent"
            style={{
              WebkitTextStroke: '2px rgba(210,4,45,0.85)',
              filter: 'drop-shadow(0 2px 4px rgba(210,4,45,0.25))',
            }}
          >
            My Goal
          </p>
        </div>
      </header>

      {/* ---- Current screen ---- */}
      <ScreenRouter />

      {/* ---- Bottom nav: sticky so it follows the mobile user ---- */}
      <div className="sticky bottom-0 z-30 mt-5 pb-[env(safe-area-inset-bottom)]">
        <BottomNav />
      </div>

      {/* ---- Menu drawer ---- */}
      <MenuDrawer />
    </>
  )
}
