function Hex({ className, size = 60 }: { className?: string; size?: number }) {
  // pointy-top hexagon outline
  const w = size
  const h = size * 1.1547
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 115.47"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <polygon
        points="50,2 97,28.8 97,86.6 50,113.4 3,86.6 3,28.8"
        stroke="var(--hex-line)"
        strokeWidth="2.5"
      />
    </svg>
  )
}

/**
 * Faint honeycomb clusters that sit behind the white content sheet,
 * peeking out on the left and right edges like the reference.
 */
export function HoneycombBg() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* right upper cluster */}
      <div className="absolute right-[-28px] top-[150px] flex flex-col items-end gap-[2px] opacity-90">
        <div className="flex gap-[2px]">
          <Hex size={58} />
          <Hex size={58} />
        </div>
        <div className="mr-7 flex gap-[2px]">
          <Hex size={58} />
        </div>
      </div>

      {/* left middle cluster */}
      <div className="absolute left-[-34px] top-[330px] flex flex-col gap-[2px]">
        <div className="flex gap-[2px]">
          <Hex size={54} />
          <Hex size={54} />
        </div>
        <div className="ml-7 flex gap-[2px]">
          <Hex size={54} />
        </div>
      </div>

      {/* right lower cluster */}
      <div className="absolute right-[-30px] top-[560px] flex flex-col items-end gap-[2px]">
        <div className="flex gap-[2px]">
          <Hex size={56} />
          <Hex size={56} />
        </div>
        <div className="mr-7 flex gap-[2px]">
          <Hex size={56} />
          <Hex size={56} />
        </div>
        <div className="mr-14 flex gap-[2px]">
          <Hex size={56} />
        </div>
      </div>
    </div>
  )
}
