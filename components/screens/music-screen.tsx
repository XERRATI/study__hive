'use client'

/**
 * FOCUS MUSIC — generative WebAudio lofi: hive hum, rain, forest, waves.
 * No files needed; the sound is built from oscillators + filtered noise.
 */
import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/lib/store'

const TRACKS = [
  { id: 'hive', label: '🎹 Hive Hum' },
  { id: 'rain', label: '🌧️ Rain' },
  { id: 'forest', label: '🌲 Forest' },
  { id: 'waves', label: '🌊 Waves' },
]

export function MusicScreen() {
  const { data, setData, toast } = useApp()
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState(data.music.track || 'hive')
  const vol = data.music.vol / 100
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<{ stop: () => void }[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopAll = () => {
    nodesRef.current.forEach((n) => {
      try {
        n.stop()
      } catch {
        /* already stopped */
      }
    })
    nodesRef.current = []
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const stop = () => {
    stopAll()
    setPlaying(false)
  }

  const play = (t: string) => {
    stopAll()
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    ctxRef.current = ctx
    const master = ctx.createGain()
    master.gain.value = vol * 0.6
    master.connect(ctx.destination)

    const push = (...ns: { stop?: () => void; disconnect?: () => void }[]) => {
      ns.forEach((n) => nodesRef.current.push({ stop: () => n.stop?.() }))
    }

    if (t === 'hive') {
      ;[110, 112].forEach((f) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = f
        g.gain.value = 0.4
        o.connect(g)
        g.connect(master)
        o.start()
        push(o, g)
      })
    } else if (t === 'rain') {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.loop = true
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = 900
      src.connect(f)
      f.connect(master)
      src.start()
      push(src, f)
    } else if (t === 'forest') {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.loop = true
      const f = ctx.createBiquadFilter()
      f.type = 'bandpass'
      f.frequency.value = 700
      f.Q.value = 0.5
      src.connect(f)
      f.connect(master)
      src.start()
      push(src, f)
      timerRef.current = setInterval(() => {
        if (Math.random() < 0.5) return
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'sine'
        o.frequency.value = 1600 + Math.random() * 900
        g.gain.setValueAtTime(0.0001, ctx.currentTime)
        g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16)
        o.connect(g)
        g.connect(master)
        o.start()
        o.stop(ctx.currentTime + 0.18)
        push(o, g)
      }, 2600)
    } else {
      // waves
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf
      src.loop = true
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.value = 500
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.12
      const lg = ctx.createGain()
      lg.gain.value = 0.08
      lfo.connect(lg)
      lg.connect(master.gain)
      src.connect(f)
      f.connect(master)
      src.start()
      lfo.start()
      push(src, f, lfo, lg)
    }
    setPlaying(true)
  }

  const toggle = () => {
    if (playing) {
      stop()
    } else {
      play(track)
      toast(`Playing · ${TRACKS.find((t) => t.id === track)?.label}`)
    }
  }

  const pick = (t: string) => {
    setTrack(t)
    setData((d) => ({ ...d, music: { ...d.music, track: t } }))
    if (playing) play(t)
  }

  useEffect(() => stop, [])

  return (
    <div className="mx-3 mt-3 overflow-hidden rounded-[2.25rem] bg-card pb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="px-7 pt-8">
        <h2 className="text-xl font-bold text-foreground">🎵 Focus Music</h2>
        <p className="mt-1 text-sm font-semibold text-brown">
          {playing ? 'Playing — stay with it 🐝' : 'Stopped'}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => pick(t.id)}
              className={`rounded-2xl px-4 py-4 text-base font-semibold transition-transform active:scale-95 ${
                track === t.id ? 'bg-honey text-primary-foreground' : 'bg-track text-tile-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={toggle}
            className="rounded-2xl bg-honey px-10 py-3 text-lg font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            {playing ? '⏸' : '▶'}
          </button>
        </div>

        <p className="mt-5 text-center text-xs font-semibold text-brown">
          Volume lives in Settings. Sound is generated on-device — nothing is uploaded.
        </p>
      </div>
    </div>
  )
}
