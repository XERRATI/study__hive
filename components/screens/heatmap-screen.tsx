'use client'

/**
 * HEATMAP — a full honey grid of the last 15 weeks of study minutes.
 */
import { useApp } from '@/lib/store'
import { dateKey, totalMinutes } from '@/lib/storage'

export function HeatmapScreen() {
  const { data } = useApp()

  const days: { key: string; min: number }[] = []
  for (let i = 104; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = dateKey(d)
    days.push({ key, min: data.dailyLog[key] || 0 })
  }

  const activeDays = days.filter((d) => d.min > 0).length
  const best = Math.max(1, ...days.map((d) => d.min))

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🗓️ Heatmap</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          {activeDays} active days · {Math.round(totalMinutes(data))} total minutes
        </p>

        <div className="mt-4 grid grid-cols-[repeat(15,1fr)] gap-1">
          {days.map(({ key, min }) => (
            <div
              key={key}
              title={`${key}: ${min} min`}
              className="aspect-square rounded-[4px]"
              style={{
                background:
                  min === 0
                    ? 'var(--track)'
                    : min < best * 0.25
                      ? '#f7e2a9'
                      : min < best * 0.5
                        ? '#f4cf6b'
                        : min < best * 0.8
                          ? '#edb84a'
                          : '#c9962f',
              }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-1.5 text-xs font-semibold text-brown">
          less
          {['var(--track)', '#f7e2a9', '#f4cf6b', '#edb84a', '#c9962f'].map((c) => (
            <span key={c} className="h-3 w-3 rounded-[4px]" style={{ background: c }} />
          ))}
          more
        </div>
        <p className="mt-4 text-sm font-semibold text-brown">
          Every block you finish paints a honey cell. Missed days stay pale — come back tomorrow 🐝
        </p>
      </div>
    </div>
  )
}
