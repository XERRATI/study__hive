'use client'

/**
 * ☰ menu button — exactly your original look, now wired to open the
 * menu drawer with all the tools.
 */
import { useApp } from '@/lib/store'

export function MenuButton() {
  const { setDrawerOpen } = useApp()
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => setDrawerOpen(true)}
      className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-foreground/90 text-foreground transition-transform active:scale-90"
    >
      <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
        <span className="h-[3px] w-full rounded-full bg-foreground/90" />
        <span className="h-[3px] w-full rounded-full bg-foreground/90" />
        <span className="h-[3px] w-full rounded-full bg-foreground/90" />
      </span>
    </button>
  )
}
