'use client'

/**
 * WALLPAPER BACKGROUND — the island wallpaper sits UNDER the main white
 * sheet, showing around it (top, sides, bottom). You can pick which
 * wallpaper in Settings → Wallpaper. Just drop any image into
 * public/wallpapers/ (e.g. your night-mode one) and it appears here.
 */
import { useApp } from '@/lib/store'
import { asset } from '@/lib/paths'

export function WallpaperBg() {
  const { data } = useApp()
  const n = Math.max(1, Math.min(10, data.wallpaper || 3))

  return (
    <img
      src={asset(`/wallpapers/wallpaper-${n}.png`)}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
    />
  )
}
