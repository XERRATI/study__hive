/**
 * PLACEHOLDER component — swap in your real components/custom-bee.tsx
 * (or your animated bee). Uses the bee-float animation from globals.css.
 */
export function CustomBee({ className = '' }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <span
        className="inline-block text-5xl"
        style={{ animation: 'bee-float 3.2s ease-in-out infinite' }}
      >
        🐝
      </span>
    </span>
  )
}
