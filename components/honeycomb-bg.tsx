/**
 * PLACEHOLDER component — swap in your real components/honeycomb-bg.tsx.
 * Renders a faint honeycomb pattern behind the app, using the theme's
 * --hex-line colour so it matches the design tokens.
 */
export function HoneycombBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-60"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='%23d8c9a0' stroke-width='1.5'/%3E%3Cpath d='M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34' fill='none' stroke='%23d8c9a0' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundSize: '56px 100px',
      }}
    />
  )
}
