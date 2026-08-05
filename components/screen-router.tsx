'use client'

/**
 * Screen router — swaps the visible screen. The top bar and bottom nav
 * stay put; only the content between them changes.
 */
import { useApp } from '@/lib/store'
import { HomeScreen } from './screens/home-screen'
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

export function ScreenRouter() {
  const { screen } = useApp()

  switch (screen) {
    case 'home':
      return <HomeScreen />
    case 'focus':
      return <FocusScreen />
    case 'garden':
      return <GardenScreen />
    case 'stats':
      return <StatsScreen />
    case 'settings':
      return <SettingsScreen />
    case 'coach':
      return <CoachScreen />
    case 'cards':
      return <CardsScreen />
    case 'notes':
      return <NotesScreen />
    case 'tasks':
      return <TasksScreen />
    case 'exams':
      return <ExamsScreen />
    case 'grades':
      return <GradesScreen />
    case 'vocab':
      return <VocabScreen />
    case 'heatmap':
      return <HeatmapScreen />
    case 'music':
      return <MusicScreen />
    case 'breathe':
      return <BreatheScreen />
    case 'calm':
      return <CalmScreen />
    case 'pomodoro':
      return <PomodoroScreen />
    case 'freeze':
      return <FreezeScreen />
    case 'puns':
      return <PunsScreen />
    case 'challenge':
      return <ChallengeScreen />
    case 'rival':
      return <RivalScreen />
    case 'capsule':
      return <CapsuleScreen />
    case 'secrets':
      return <SecretsScreen />
    case 'privacy':
      return <LegalScreen page="privacy" />
    case 'terms':
      return <LegalScreen page="terms" />
    case 'creator':
      return <LegalScreen page="creator" />
    default:
      return <HomeScreen />
  }
}
