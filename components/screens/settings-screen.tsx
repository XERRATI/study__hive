'use client'

/**
 * SETTINGS — name, daily goal, finals date, city, music volume,
 * backup export/import, reset, and a link to the PC version.
 */
import { useRef, useState } from 'react'
import { useApp } from '@/lib/store'
import { defaultData, type AppData } from '@/lib/storage'

const PC_SITE = 'https://studyhive.co.za' // 👈 set your real site URL here

export function SettingsScreen() {
  const { data, setData, toast } = useApp()
  const [importText, setImportText] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const patch = (p: Partial<AppData>) => setData((d) => ({ ...d, ...p }))

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-hive-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('Backup downloaded 💾')
  }

  const importBackup = () => {
    try {
      const parsed = JSON.parse(importText)
      setData(() => ({ ...defaultData(), ...parsed }))
      setImportText('')
      toast('Backup restored ✅')
    } catch {
      toast('That does not look like a valid backup ⚠️')
    }
  }

  const resetAll = () => {
    if (confirm('Erase ALL hive data on this device? This cannot be undone.')) {
      setData(() => defaultData())
      toast('Hive reset — fresh start 🐝')
    }
  }

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">⚙️ Settings</h2>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-bold text-foreground">Your name</span>
            <input
              value={data.name}
              onChange={(e) => patch({ name: e.target.value })}
              placeholder="e.g. Sam"
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-foreground">Daily goal (minutes)</span>
            <input
              type="number"
              min={5}
              max={600}
              value={data.dailyGoal}
              onChange={(e) => patch({ dailyGoal: Math.max(5, Number(e.target.value) || 60) })}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-foreground">Finals date</span>
            <input
              type="date"
              value={data.finals}
              onChange={(e) => patch({ finals: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-foreground">Home city (for the weather chip)</span>
            <input
              value={data.city}
              onChange={(e) => patch({ city: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-3 text-base font-medium text-foreground outline-none"
            />
          </label>

          <div>
            <span className="text-sm font-bold text-foreground">Focus music volume</span>
            <input
              type="range"
              min={0}
              max={100}
              value={data.music.vol}
              onChange={(e) => patch({ music: { ...data.music, vol: Number(e.target.value) } })}
              className="mt-2 w-full accent-[#edb84a]"
            />
            <p className="text-xs font-semibold text-brown">{data.music.vol}%</p>
          </div>
        </div>

        {/* data */}
        <p className="mt-6 text-sm font-bold text-foreground">💾 Your data</p>
        <div className="mt-2 space-y-2">
          <a
            href={PC_SITE}
            target="_blank"
            rel="noreferrer"
            className="block w-full rounded-2xl bg-track px-4 py-3 text-center text-base font-semibold text-tile-foreground transition-transform active:scale-95"
          >
            🖥️ Open the full PC version
          </a>
          <button
            type="button"
            onClick={exportBackup}
            className="w-full rounded-2xl bg-honey px-4 py-3 text-base font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            Download backup
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-2xl bg-track px-4 py-3 text-base font-semibold text-tile-foreground transition-transform active:scale-95"
          >
            Restore from backup…
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              setImportText(await f.text())
              e.target.value = ''
            }}
          />
          {importText && (
            <div className="space-y-2">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-xs font-medium text-foreground outline-none"
              />
              <button
                type="button"
                onClick={importBackup}
                className="w-full rounded-2xl bg-greeting px-4 py-3 text-base font-semibold text-greeting-foreground transition-transform active:scale-95"
              >
                Confirm restore
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={resetAll}
            className="w-full rounded-2xl px-4 py-3 text-base font-semibold text-[#ef4a2f] transition-transform active:scale-95"
          >
            Reset all hive data
          </button>
        </div>

        <p className="mt-6 text-center text-xs font-semibold text-brown">
          🔒 Everything stays on this device. No accounts, no cloud.
        </p>
      </div>
    </div>
  )
}
