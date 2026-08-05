'use client'

/**
 * Screen router — swaps the visible screen. Home keeps your exact full
 * layout; every other screen gets the same frame: ☰ menu header,
 * content card, and the sticky bottom nav (so you never lose them).
 */
import type { ReactNode } from 'react'
import { useApp } from '@/lib/store'
import { MenuButton } from './menu-button'
import { GoalIndicator } from './goal-indicator'
import { BottomNav } from './bottom-nav'
import { HomeScreen } from './screens/home-screen'
import { HiveScreen } from './screens/hive-screen'
import { GoalsScreen } from './screens/goals-screen'
import { FocusScreen } from './screens/focus-screen'
import { GardenScreen } from './screens/garden-screen'
import { StatsScreen } from './screens/stats-screen'
import { SettingsScreen } from './screens/settings-screen'
import { CoachScreen } from './screens/coach-screen'
import { CardsScreen } from './screens/cards-screen'
import { NotesScreen } from './screens/notes-screen'
import { TasksScreen } from './screens/tasks-screen'
import { ExamsScreen } from './screens/exams-screen'
import { GradesScreen } from './screens/grades-screen'
import { VocabScreen } from './screens/vocab-screen'
import { HeatmapScreen } from './screens/heatmap-screen'
import { MusicScreen } from './screens/music-screen'
import { BreatheScreen } from './screens/breathe-screen'
import { CalmScreen } from './screens/calm-screen'
import { PomodoroScreen } from './screens/pomodoro-screen'
import { FreezeScreen } from './screens/freeze-screen'
import { PunsScreen } from './screens/puns-screen'
import { ChallengeScreen } from './screens/challenge-screen'
import { RivalScreen } from './screens/rival-screen'
import { CapsuleScreen } from './screens/capsule-screen'
import { SecretsScreen } from './screens/secrets-screen'
import { LegalScreen } from './screens/legal-screen'

function ScreenFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[430px]">
      <header className="sticky top-0 z-30 flex items-start justify-between bg-background/85 px-5 pb-2 pt-6 backdrop-blur-sm">
        <MenuButton />
        <GoalIndicator />
      </header>
      {children}
      <div className="sticky bottom-0 z-30 mt-5 pb-[env(safe-area-inset-bottom)]">
        <BottomNav />
      </div>
    </div>
  )
}

export function ScreenRouter() {
  const { screen } = useApp()

  let body: ReactNode
  switch (screen) {
    case 'home':
      body = <HomeScreen />
      break
    case 'hive':
      body = <HiveScreen />
      break
    case 'goals':
      body = <GoalsScreen />
      break
    case 'focus':
      body = <FocusScreen />
      break
    case 'garden':
      body = <GardenScreen />
      break
    case 'stats':
      body = <StatsScreen />
      break
    case 'settings':
      body = <SettingsScreen />
      break
    case 'coach':
      body = <CoachScreen />
      break
    case 'cards':
      body = <CardsScreen />
      break
    case 'notes':
      body = <NotesScreen />
      break
    case 'tasks':
      body = <TasksScreen />
      break
    case 'exams':
      body = <ExamsScreen />
      break
    case 'grades':
      body = <GradesScreen />
      break
    case 'vocab':
      body = <VocabScreen />
      break
    case 'heatmap':
      body = <HeatmapScreen />
      break
    case 'music':
      body = <MusicScreen />
      break
    case 'breathe':
      body = <BreatheScreen />
      break
    case 'calm':
      body = <CalmScreen />
      break
    case 'pomodoro':
      body = <PomodoroScreen />
      break
    case 'freeze':
      body = <FreezeScreen />
      break
    case 'puns':
      body = <PunsScreen />
      break
    case 'challenge':
      body = <ChallengeScreen />
      break
    case 'rival':
      body = <RivalScreen />
      break
    case 'capsule':
      body = <CapsuleScreen />
      break
    case 'secrets':
      body = <SecretsScreen />
      break
    case 'privacy':
      body = <LegalScreen page="privacy" />
      break
    case 'terms':
      body = <LegalScreen page="terms" />
      break
    case 'creator':
      body = <LegalScreen page="creator" />
      break
    default:
      body = <HomeScreen />
  }

  return screen === 'home' ? body : <ScreenFrame>{body}</ScreenFrame>
}
