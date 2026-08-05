import { HoneycombBg } from '@/components/honeycomb-bg'
import { AppProvider } from '@/lib/store'
import { AppShell } from '@/components/app-shell'

export default function Page() {
  return (
    <main className="flex min-h-screen justify-center bg-background">
      <div className="relative w-full max-w-[430px] bg-background">
        <HoneycombBg />

        <AppProvider>
          <AppShell />
        </AppProvider>
      </div>
    </main>
  )
}
