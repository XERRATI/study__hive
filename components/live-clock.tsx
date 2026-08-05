'use client'

import { useEffect, useState } from 'react'

function format(now: Date) {
  let h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  if (h === 0) h = 12
  const pad = (n: number) => n.toString().padStart(2, '0')
  const time = `${pad(h)}:${pad(m)}:${pad(s)}`

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const date = `${days[now.getDay()]},${months[now.getMonth()]} ${now.getDate()} ,${now.getFullYear()}`
  return { time, ampm, date }
}

export function LiveClock() {
  // Fixed initial value avoids hydration mismatch; updates on mount.
  const [{ time, ampm, date }, setNow] = useState(() => format(new Date('2026-08-05T09:24:21')))

  useEffect(() => {
    const tick = () => setNow(format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <h1 className="text-[3.4rem] font-bold leading-none tracking-tight text-foreground tabular-nums">
        {time} <span className="align-top">{ampm}</span>
      </h1>
      <p className="mt-3 text-lg font-semibold text-foreground">{date}</p>
    </div>
  )
}
