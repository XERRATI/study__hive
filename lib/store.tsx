'use client'

/**
 * Global app state for the mobile shell:
 *  - current screen + optional params (e.g. start focus with a preset)
 *  - menu drawer open/close
 *  - the on-device data store (loaded/saved to localStorage)
 *  - tiny toast for feedback
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { loadData, saveData, type AppData } from './storage'

export type Screen =
  | 'home'
  | 'hive'
  | 'goals'
  | 'focus'
  | 'garden'
  | 'stats'
  | 'settings'
  | 'coach'
  | 'cards'
  | 'notes'
  | 'tasks'
  | 'exams'
  | 'grades'
  | 'music'
  | 'breathe'
  | 'calm'
  | 'heatmap'
  | 'rival'
  | 'freeze'
  | 'capsule'
  | 'puns'
  | 'pomodoro'
  | 'secrets'
  | 'vocab'
  | 'challenge'
  | 'privacy'
  | 'terms'
  | 'creator'

type Ctx = {
  screen: Screen
  go: (s: Screen, params?: Record<string, string | number | boolean>) => void
  params: Record<string, string | number | boolean>
  drawerOpen: boolean
  setDrawerOpen: (v: boolean) => void
  data: AppData
  setData: (updater: (d: AppData) => AppData) => void
  toast: (msg: string) => void
}

const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('home')
  const [params, setParams] = useState<Record<string, string | number | boolean>>({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [data, setDataState] = useState<AppData>(() => loadData())
  const [toastMsg, setToastMsg] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const go = useCallback((s: Screen, p?: Record<string, string | number | boolean>) => {
    setParams(p || {})
    setScreen(s)
    setDrawerOpen(false)
    window.scrollTo({ top: 0 })
  }, [])

  const setData = useCallback((updater: (d: AppData) => AppData) => {
    setDataState((prev) => {
      const next = updater(prev)
      saveData(next)
      return next
    })
  }, [])

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600)
  }, [])

  /* persist whenever data changes */
  useEffect(() => {
    saveData(data)
  }, [data])

  return (
    <AppCtx.Provider
      value={{ screen, go, params, drawerOpen, setDrawerOpen, data, setData, toast }}
    >
      {children}
      {toastMsg && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-6">
          <div className="rounded-full bg-foreground/90 px-5 py-2.5 text-sm font-semibold text-background shadow-lg">
            {toastMsg}
          </div>
        </div>
      )}
    </AppCtx.Provider>
  )
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
