import { HoneycombBg } from '@/components/honeycomb-bg'
import { WallpaperBg } from '@/components/wallpaper-bg'
import { AppProvider } from '@/lib/store'
import { ScreenRouter } from '@/components/screen-router'
import { MenuDrawer } from '@/components/menu-drawer'

/**
 * App page — the new island-themed mobile layout.
 * The island wallpaper sits UNDER the main white sheet (pick it in
 * Settings → Wallpaper). The cream --background shows while it loads.
 */
export default function Page() {
  return (
    <main className="relative flex min-h-screen justify-center bg-background">
      <div className="relative z-10 w-full max-w-[430px]">
        <HoneycombBg />

        <AppProvider>
          {/* island wallpaper background (under the white sheet) */}
          <WallpaperBg />
          <ScreenRouter />
          <MenuDrawer />
        </AppProvider>
      </div>
    </main>
  )
}
