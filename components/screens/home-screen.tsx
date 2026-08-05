'use client'

/**
 * HOME SCREEN — your exact layout from page.txt, kept pixel-identical.
 * Only the interactive parts are WIRED:
 *  · ☰ menu button opens the drawer (all tools)
 *  · weather chip taps to change city (live weather)
 *  · greeting + next-best-move read real data
 *  · Start 15m Focus opens the Focus screen with a preset
 *  · Ask Coach opens the Coach screen
 *  · quote heart saves favourites
 *  · footer links open their pages in-app
 */
import { useEffect, useState } from 'react'
import { HoneycombBg } from '@/components/honeycomb-bg'
import { LiveClock } from '@/components/live-clock'
import { FinalsCountdown } from '@/components/finals-countdown'
import { CustomBee } from '@/components/custom-bee'
import { MenuButton } from '@/components/menu-button'
import { GoalIndicator } from '@/components/goal-indicator'
import { BottomNav } from '@/components/bottom-nav'
import { useApp } from '@/lib/store'
import { QUOTES, weakestSubject } from '@/lib/storage'

const DEFAULT_QUOTE = QUOTES[0]

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function HomeScreen() {
  const { data, setData, go, toast } = useApp()
  const [editingCity, setEditingCity] = useState(false)
  const [cityDraft, setCityDraft] = useState(data.city)

  /* weather */
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null)

  useEffect(() => {
    let alive = true
    async function loadWeather() {
      try {
        const geo = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            data.city,
          )}&count=1&language=en&format=json`,
        ).then((r) => r.json())
        const place = geo?.results?.[0]
        if (!place) return
        const w = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code`,
        ).then((r) => r.json())
        if (!alive) return
        const code = w?.current?.weather_code
        const desc =
          code === 0
            ? 'clear skys'
            : code === 1 || code === 2
              ? 'partly cloudy'
              : code >= 61 && code <= 67
                ? 'rainy'
                : code >= 71 && code <= 77
                  ? 'snowy'
                  : 'cloudy'
        const temp = Math.round(w?.current?.temperature_2m ?? 16)
        setWeather({ temp, desc })
      } catch {
        /* offline / blocked — keep the fallback */
      }
    }
    loadWeather()
    return () => {
      alive = false
    }
  }, [data.city])

  const weak = weakestSubject(data)
  const displayTemp = weather ? weather.temp : 16
  const displayDesc = weather ? weather.desc : 'clear skys'

  /* quote favourite */
  const isFav = data.favorites.includes(DEFAULT_QUOTE)
  const toggleFav = () => {
    setData((d) => ({
      ...d,
      favorites: isFav
        ? d.favorites.filter((q) => q !== DEFAULT_QUOTE)
        : [...d.favorites, DEFAULT_QUOTE],
    }))
    toast(isFav ? 'Removed from favourites' : 'Saved to favourites ❤️')
  }

  /* greeting line */
  const name = (data.name || '').trim()
  const subject = weak || 'english'
  const greeting = `${greetingFor(new Date().getHours())}${name ? ` - ${name}` : ''} shall we begin with a study block for ${subject}?`

  return (
    <div className="relative w-full max-w-[430px] bg-background">
      <HoneycombBg />

      {/* Custom animated bee slot — another coder can swap this out.
          Edit components/custom-bee.tsx to drop in your own animated bee. */}
      <CustomBee className="pointer-events-none absolute left-[-6px] top-[360px] z-20 -rotate-12" />

      {/* ---- Top bar ---- */}
      <header className="relative z-10 flex items-start justify-between px-5 pt-6">
        <MenuButton />
        {/* Goal indicator — fills up with today's goal progress (like PC) */}
        <GoalIndicator />
      </header>

      {/* ---- Main white content sheet ---- */}
      <div className="relative z-10 mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        {/* weather + bee flower */}
        <div className="relative px-7 pt-8">
          {editingCity ? (
            <form
              className="inline-flex flex-col gap-1"
              onSubmit={(e) => {
                e.preventDefault()
                const v = cityDraft.trim() || 'Pretoria'
                setData((d) => ({ ...d, city: v }))
                setEditingCity(false)
                toast('City saved 🌍')
              }}
            >
              <input
                autoFocus
                value={cityDraft}
                onChange={(e) => setCityDraft(e.target.value)}
                placeholder="Type a city…"
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-lg font-semibold text-foreground outline-none"
              />
              <button type="submit" className="text-sm font-semibold text-honey-deep underline underline-offset-4">
                Save city
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCityDraft(data.city)
                setEditingCity(true)
              }}
              title="Tap to change city"
              className="inline-flex flex-col rounded-xl border border-border bg-card/85 px-3 py-1.5 text-left text-lg font-semibold leading-tight text-foreground shadow-sm transition-transform active:scale-95"
            >
              <span>☀️ {displayTemp}C</span>
              <span>{displayDesc}</span>
            </button>
          )}
          <img
            src="/images/bee-flower.png"
            alt="Bee resting on a hand-drawn flower"
            className="pointer-events-none absolute right-6 top-2 h-28 w-auto"
          />
        </div>

        {/* clock */}
        <div className="px-7 pt-6">
          <LiveClock />
        </div>

        {/* greeting bubble */}
        <div className="px-7 pt-6">
          <div className="rounded-[1.75rem] bg-greeting px-7 py-7 text-center">
            <p className="text-2xl font-semibold leading-snug text-greeting-foreground text-balance">
              {greeting}
            </p>
          </div>
        </div>

        {/* finals countdown */}
        <div className="pt-8">
          <FinalsCountdown />
        </div>

        {/* next best move */}
        <div className="mt-6 px-4">
          <button
            type="button"
            onClick={() => go('coach')}
            className="w-full rounded-2xl bg-track/70 px-5 py-4 text-left transition-transform active:scale-[0.98]"
          >
            <p className="text-xl font-bold text-foreground">
              <span aria-hidden="true">🐝</span> Next Best move
            </p>
            <p className="mt-1 text-base font-medium leading-relaxed text-brown">
              {weak
                ? `Give ${weak} 15 minutes. It has the least logged time`
                : 'Log your first session — the hive grows with every minute 🍯'}
            </p>
          </button>
        </div>

        {/* action buttons */}
        <div className="mt-6 px-4">
          <div className="rounded-2xl bg-track/70 px-5 py-5">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => go('focus', { preset: 15, autostart: true })}
                className="rounded-2xl bg-honey px-6 py-3 text-lg font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                Start 15m Focus
              </button>
              <button
                type="button"
                onClick={() => go('coach')}
                className="rounded-2xl bg-card px-6 py-3 text-lg font-semibold text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.06)] ring-1 ring-border transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                Ask Coach
              </button>
            </div>
          </div>
        </div>

        {/* quote */}
        <div className="mt-7 px-7">
          <p className="text-xl font-semibold leading-snug text-brown text-pretty">
            {'"Study while others are sleeping; work while others are loafing."'}
          </p>
          <div className="mt-4 flex items-center justify-between text-xl font-semibold text-brown">
            <p>
              -<span className="text-red">William a.ward.</span>{' '}
            </p>
            <button
              type="button"
              aria-label={isFav ? 'Remove from favourites' : 'Save to favourites'}
              onClick={toggleFav}
              className="text-2xl transition-transform active:scale-125"
            >
              {isFav ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

        {/* almost there */}
        <p className="mt-8 text-center text-2xl font-semibold text-brown">
          <span aria-hidden="true">✨</span>almost there
          <span aria-hidden="true">✨</span>
        </p>

        {/* footer links */}
        <div className="mt-5 flex items-start justify-between gap-2 px-7 text-center">
          <button
            type="button"
            onClick={() => go('privacy')}
            className="text-base font-semibold text-brown underline underline-offset-4"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => go('terms')}
            className="text-base font-semibold text-brown underline underline-offset-4"
          >
            Terms of service
          </button>
          <button
            type="button"
            onClick={() => go('creator')}
            className="text-base font-semibold text-brown underline underline-offset-4"
          >
            Meet the Creator
          </button>
        </div>
      </div>

      {/* ---- Bottom nav ---- */}
      <div className="sticky bottom-0 z-30 mt-5 pb-[env(safe-area-inset-bottom)]">
        <BottomNav />
      </div>
    </div>
  )
}
